import dbConnect from './db';
import WalletMonth from '@/models/WalletMonth';

export async function ensureCurrentMonthCreated() {
  await dbConnect();

  const now = new Date();
  const currentMonthName = now.toLocaleString('en-US', { month: 'long', year: 'numeric' }); // e.g. "August 2026"

  const existing = await WalletMonth.findOne({ monthName: currentMonthName });
  if (existing) {
    return { created: false, monthName: currentMonthName, month: existing };
  }

  // Find the latest existing month sheet (sorted by creation time)
  const previousMonth = await WalletMonth.findOne({}).sort({ createdAt: -1 }).lean();

  let carriedOverSavings = 0;
  let inheritedLoans: any[] = [];
  let inheritedSavingsGoals: any[] = [];
  let inheritedRecurringBills: any[] = [];
  let inheritedAssets: any[] = [];
  let inheritedDailyCap = 2000;
  let inheritedCategoryBudgets: Record<string, number> = {
    Food: 4500,
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
    const prevActiveLoans = (previousMonth.loans || [])
      .filter((l: any) => l.status === 'Pending')
      .reduce((acc: number, curr: any) => acc + (curr.amount || 0), 0);

    // Calculate opening savings balance carried over to the new month
    carriedOverSavings = (previousMonth.carriedOverSavings || 0) + prevInc - prevExp - prevActiveLoans;

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

  return { created: true, monthName: currentMonthName, month: newMonth };
}
