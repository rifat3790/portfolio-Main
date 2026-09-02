import dbConnect from './db';
import WalletMonth from '@/models/WalletMonth';

/**
 * Parses month name (e.g. "July 2026", "2026-07") into timestamp for accurate calendar sorting.
 */
export function parseMonthDate(monthName: string, fallbackDate?: Date | string): number {
  if (!monthName) return fallbackDate ? new Date(fallbackDate).getTime() : 0;
  
  // Try "1 <MonthName> <Year>" e.g. "1 July 2026"
  const parsed = Date.parse(`1 ${monthName}`);
  if (!isNaN(parsed)) return parsed;

  // Try direct parse
  const direct = Date.parse(monthName);
  if (!isNaN(direct)) return direct;

  return fallbackDate ? new Date(fallbackDate).getTime() : 0;
}

/**
 * Recalculates and cascades carriedOverSavings and pending loans chronologically across all months.
 * Ensures that if any past month is updated (forgotten expenses, incomes, loans, etc.),
 * all future months immediately reflect the updated balances and loans without duplication.
 */
export async function syncAndCascadeWalletMonths(): Promise<any[]> {
  await dbConnect();

  const allMonths = await WalletMonth.find({});
  if (!allMonths || allMonths.length === 0) return [];

  // Sort chronologically by calendar date
  allMonths.sort((a, b) => {
    const timeA = parseMonthDate(a.monthName, a.createdAt);
    const timeB = parseMonthDate(b.monthName, b.createdAt);
    return timeA - timeB;
  });

  const getIncome = (m: any) => {
    return (m.salary || 0) + (m.addon || 0) + (m.bonus || 0) +
      (m.incomes || []).reduce((acc: number, curr: any) => acc + (curr.amount || 0), 0);
  };

  const getExpense = (m: any) => {
    return (m.expenses || []).reduce((acc: number, curr: any) => acc + (curr.amount || 0), 0);
  };

  // Iterate from month 1 to N-1
  for (let i = 1; i < allMonths.length; i++) {
    const prev = allMonths[i - 1];
    const curr = allMonths[i];

    let hasChanges = false;

    // 1. Calculate correct carriedOverSavings:
    // Opening gross savings for curr = prev carriedOverSavings + prev income - prev expense
    const expectedCarriedOver = (prev.carriedOverSavings || 0) + getIncome(prev) - getExpense(prev);
    if (curr.carriedOverSavings !== expectedCarriedOver) {
      curr.carriedOverSavings = expectedCarriedOver;
      hasChanges = true;
    }

    // 2. Synchronize carried-over pending loans from prev to curr:
    const prevPendingLoans = (prev.loans || []).filter((l: any) => l.status === 'Pending');
    const currLoans: any[] = [...(curr.loans || [])];

    for (const pLoan of prevPendingLoans) {
      const existingInCurr = currLoans.find((l: any) => {
        const nameMatch = l.personName?.trim().toLowerCase() === pLoan.personName?.trim().toLowerCase();
        const amtMatch = Math.abs((l.amount || 0) - (pLoan.amount || 0)) < 0.01;
        return nameMatch && amtMatch && (l.isCarriedOver || (l.originalMonthName || '') === (pLoan.originalMonthName || prev.monthName));
      });

      if (!existingInCurr) {
        currLoans.push({
          personName: pLoan.personName,
          amount: pLoan.amount,
          date: pLoan.date,
          dueDate: pLoan.dueDate,
          status: 'Pending',
          notes: pLoan.notes || '',
          isCarriedOver: true,
          originalMonthName: pLoan.originalMonthName || prev.monthName,
        });
        hasChanges = true;
      }
    }

    // If a loan was marked Returned in prev, ensure any carried-over copy in curr is also marked Returned
    const prevReturnedLoans = (prev.loans || []).filter((l: any) => l.status === 'Returned');
    for (const rLoan of prevReturnedLoans) {
      for (const cLoan of currLoans) {
        if (cLoan.isCarriedOver && cLoan.status === 'Pending') {
          const nameMatch = cLoan.personName?.trim().toLowerCase() === rLoan.personName?.trim().toLowerCase();
          const amtMatch = Math.abs((cLoan.amount || 0) - (rLoan.amount || 0)) < 0.01;
          if (nameMatch && amtMatch) {
            cLoan.status = 'Returned';
            cLoan.returnedDate = rLoan.returnedDate || new Date().toISOString().split('T')[0];
            hasChanges = true;
          }
        }
      }
    }

    // Clean up any carried-over loans in curr that were completely deleted from prev
    const cleanedLoans = currLoans.filter((l: any) => {
      if (!l.isCarriedOver) return true;
      const origMonth = l.originalMonthName || prev.monthName;
      if (origMonth === prev.monthName) {
        const stillInPrev = (prev.loans || []).some((pl: any) => {
          const nameMatch = pl.personName?.trim().toLowerCase() === l.personName?.trim().toLowerCase();
          const amtMatch = Math.abs((pl.amount || 0) - (l.amount || 0)) < 0.01;
          return nameMatch && amtMatch;
        });
        if (!stillInPrev) {
          hasChanges = true;
          return false;
        }
      }
      return true;
    });

    if (hasChanges || cleanedLoans.length !== (curr.loans || []).length) {
      curr.loans = cleanedLoans;
      await curr.save();
    }
  }

  return allMonths;
}

export async function ensureCurrentMonthCreated() {
  await dbConnect();

  const now = new Date();
  const currentMonthName = now.toLocaleString('en-US', { month: 'long', year: 'numeric' }); // e.g. "September 2026"

  const existing = await WalletMonth.findOne({ monthName: currentMonthName });
  if (existing) {
    await syncAndCascadeWalletMonths();
    return { created: false, monthName: currentMonthName, month: existing };
  }

  // Find the latest existing month sheet (sorted chronologically)
  const allMonths = await WalletMonth.find({});
  allMonths.sort((a, b) => parseMonthDate(a.monthName, a.createdAt) - parseMonthDate(b.monthName, b.createdAt));
  const previousMonth = allMonths.length > 0 ? allMonths[allMonths.length - 1] : null;

  let carriedOverSavings = 0;
  let inheritedLoans: any[] = [];
  let inheritedSavingsGoals: any[] = [];
  let inheritedRecurringBills: any[] = [];
  let inheritedAssets: any[] = [];
  let inheritedDailyCap = 2000;
  let inheritedCategoryBudgets: Record<string, number> = {
    Food: 4500,
    Travel: 500,
    Rent: 4000,
    Utility: 1000,
    Gadgets: 1,
    Server: 500,
    Entertainment: 500,
    'Parents (Baba Ma)': 15000,
    Other: 500
  };

  if (previousMonth) {
    const prevInc = (previousMonth.salary || 0) + (previousMonth.addon || 0) + (previousMonth.bonus || 0) +
      (previousMonth.incomes || []).reduce((acc: number, curr: any) => acc + (curr.amount || 0), 0);
    const prevExp = (previousMonth.expenses || []).reduce((acc: number, curr: any) => acc + (curr.amount || 0), 0);

    // Calculate opening gross savings balance carried over to the new month
    carriedOverSavings = (previousMonth.carriedOverSavings || 0) + prevInc - prevExp;

    // Migrate pending loans into the new month sheet
    const pendingLoans = (previousMonth.loans || []).filter((l: any) => l.status === 'Pending');
    inheritedLoans = pendingLoans.map((l: any) => ({
      personName: l.personName,
      amount: l.amount,
      date: l.date,
      dueDate: l.dueDate,
      status: 'Pending',
      notes: l.notes || '',
      isCarriedOver: true,
      originalMonthName: l.originalMonthName || previousMonth.monthName,
    }));

    inheritedSavingsGoals = previousMonth.savingsGoals || [];
    inheritedRecurringBills = previousMonth.recurringBills || [];
    inheritedAssets = previousMonth.assets || [];
    inheritedDailyCap = previousMonth.targetDailyCap || 2000;
    if (previousMonth.categoryBudgets && Object.keys(previousMonth.categoryBudgets).length > 0) {
      inheritedCategoryBudgets = previousMonth.categoryBudgets;
    }
  }

  const newMonth = await WalletMonth.create({
    monthName: currentMonthName,
    salary: 0,
    addon: 0,
    bonus: 0,
    targetDailyCap: inheritedDailyCap,
    categoryBudgets: inheritedCategoryBudgets,
    carriedOverSavings: carriedOverSavings,
    expenses: [],
    incomes: [],
    loans: inheritedLoans,
    savingsGoals: inheritedSavingsGoals,
    recurringBills: inheritedRecurringBills,
    assets: inheritedAssets,
  });

  await syncAndCascadeWalletMonths();

  return { created: true, monthName: currentMonthName, month: newMonth };
}
