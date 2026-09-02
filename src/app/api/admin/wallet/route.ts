import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import WalletMonth from '@/models/WalletMonth';
import { isAuthenticated } from '@/lib/auth';
import { ensureCurrentMonthCreated, syncAndCascadeWalletMonths, parseMonthDate } from '@/lib/walletAutoMonth';

export async function GET(req: NextRequest) {
  try {
    if (!isAuthenticated(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    // Ensure current month sheet exists automatically
    await ensureCurrentMonthCreated();

    // Recalculate & cascade opening balances and pending loans across all months
    await syncAndCascadeWalletMonths();

    // Fetch all months and sort chronologically by calendar date
    const months = await WalletMonth.find({}).lean();
    months.sort((a, b) => parseMonthDate(a.monthName, a.createdAt) - parseMonthDate(b.monthName, b.createdAt));

    return NextResponse.json(months);
  } catch (error) {
    console.error('Error fetching wallet months:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!isAuthenticated(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const data = await req.json();

    if (!data.monthName) {
      return NextResponse.json({ error: 'Missing required field: monthName' }, { status: 400 });
    }

    // Check month uniqueness
    const existing = await WalletMonth.findOne({ monthName: data.monthName });
    if (existing) {
      return NextResponse.json({ error: 'This month sheet already exists.' }, { status: 400 });
    }

    // Find all existing months sorted chronologically to inherit config
    const allMonths = await WalletMonth.find({}).lean();
    allMonths.sort((a, b) => parseMonthDate(a.monthName, a.createdAt) - parseMonthDate(b.monthName, b.createdAt));
    const previousMonth = allMonths.length > 0 ? allMonths[allMonths.length - 1] : null;

    let carriedOverSavings = 0;
    let inheritedLoans: any[] = [];
    let inheritedSavingsGoals: any[] = [];
    let inheritedRecurringBills: any[] = [];
    let inheritedAssets: any[] = [];
    let inheritedDailyCap = 2000;
    let inheritedCategoryBudgets = {};

    if (previousMonth) {
      const prevInc = (previousMonth.salary || 0) + (previousMonth.addon || 0) + (previousMonth.bonus || 0) +
        (previousMonth.incomes || []).reduce((acc: number, curr: any) => acc + (curr.amount || 0), 0);
      const prevExp = (previousMonth.expenses || []).reduce((acc: number, curr: any) => acc + (curr.amount || 0), 0);

      // Previous Gross Savings (Opening balance for the new month)
      carriedOverSavings = (previousMonth.carriedOverSavings || 0) + prevInc - prevExp;

      // Extract pending loans to migrate into the new month sheet
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
      inheritedCategoryBudgets = previousMonth.categoryBudgets || {};
    }

    const newMonth = await WalletMonth.create({
      monthName: data.monthName,
      salary: Number(data.salary) || 0,
      addon: Number(data.addon) || 0,
      bonus: Number(data.bonus) || 0,
      targetDailyCap: data.targetDailyCap !== undefined ? Number(data.targetDailyCap) : inheritedDailyCap,
      categoryBudgets: data.categoryBudgets || inheritedCategoryBudgets,
      carriedOverSavings: data.carriedOverSavings !== undefined ? Number(data.carriedOverSavings) : carriedOverSavings,
      expenses: data.expenses || [],
      incomes: data.incomes || [],
      loans: data.loans && data.loans.length > 0 ? data.loans : inheritedLoans,
      savingsGoals: data.savingsGoals && data.savingsGoals.length > 0 ? data.savingsGoals : inheritedSavingsGoals,
      recurringBills: data.recurringBills && data.recurringBills.length > 0 ? data.recurringBills : inheritedRecurringBills,
      assets: data.assets && data.assets.length > 0 ? data.assets : inheritedAssets,
    });

    // Cascade & sync
    await syncAndCascadeWalletMonths();

    return NextResponse.json(newMonth);
  } catch (error) {
    console.error('Error creating wallet month:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
