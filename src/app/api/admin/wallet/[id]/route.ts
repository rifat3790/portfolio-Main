import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import WalletMonth from '@/models/WalletMonth';
import { isAuthenticated } from '@/lib/auth';
import { sendWalletTransactionAlert } from '@/lib/emailService';
import { syncAndCascadeWalletMonths } from '@/lib/walletAutoMonth';

type Params = Promise<{ id: string }>;

export async function PUT(req: NextRequest, segmentData: { params: Params }) {
  try {
    if (!isAuthenticated(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await segmentData.params;
    await dbConnect();
    const data = await req.json();

    const existing = await WalletMonth.findById(id);
    if (!existing) {
      return NextResponse.json({ error: 'Month sheet not found' }, { status: 404 });
    }

    const oldExpenseCount = (existing.expenses || []).length;
    const oldLoanCount = (existing.loans || []).length;

    // Handle mobile-app action presets (e.g. from mobile-wallet service)
    if (data.action === 'addExpense' && data.data) {
      existing.expenses = existing.expenses || [];
      existing.expenses.push(data.data);
    } else if (data.action === 'addIncome' && data.data) {
      existing.incomes = existing.incomes || [];
      existing.incomes.push(data.data);
    } else if (data.action === 'addAsset' && data.data) {
      existing.assets = existing.assets || [];
      existing.assets.push(data.data);
    } else {
      // Standard full or partial document updates
      if (data.monthName !== undefined) existing.monthName = data.monthName;
      if (data.salary !== undefined) existing.salary = Number(data.salary);
      if (data.addon !== undefined) existing.addon = Number(data.addon);
      if (data.bonus !== undefined) existing.bonus = Number(data.bonus);
      if (data.targetDailyCap !== undefined) existing.targetDailyCap = Number(data.targetDailyCap);
      if (data.categoryBudgets !== undefined) existing.categoryBudgets = data.categoryBudgets;
      if (data.expenses !== undefined) existing.expenses = data.expenses;
      if (data.incomes !== undefined) existing.incomes = data.incomes;
      if (data.loans !== undefined) existing.loans = data.loans;
      if (data.savingsGoals !== undefined) existing.savingsGoals = data.savingsGoals;
      if (data.recurringBills !== undefined) existing.recurringBills = data.recurringBills;
      if (data.assets !== undefined) existing.assets = data.assets;
    }

    await existing.save();

    // Cascade updates to all subsequent months automatically
    await syncAndCascadeWalletMonths();

    // Check for newly added expenses for email alerts
    if (existing.expenses && existing.expenses.length > oldExpenseCount) {
      const latestExp = existing.expenses[existing.expenses.length - 1];
      sendWalletTransactionAlert({
        type: 'expense',
        description: latestExp.description || 'Expense Item',
        amount: latestExp.amount || 0,
        category: latestExp.category || 'General',
        date: latestExp.date ? new Date(latestExp.date).toISOString().split('T')[0] : undefined,
        monthName: existing.monthName
      }).catch(err => console.error('Error sending expense alert email:', err));
    }

    // Check for newly added loans for email alerts
    if (existing.loans && existing.loans.length > oldLoanCount) {
      const latestLoan = existing.loans[existing.loans.length - 1];
      sendWalletTransactionAlert({
        type: 'loan',
        description: `Loan to/from ${latestLoan.personName || 'Person'}`,
        amount: latestLoan.amount || 0,
        category: 'Loan',
        date: latestLoan.date ? new Date(latestLoan.date).toISOString().split('T')[0] : undefined,
        monthName: existing.monthName
      }).catch(err => console.error('Error sending loan alert email:', err));
    }

    // Fetch freshly cascaded document
    const refreshed = await WalletMonth.findById(id);
    return NextResponse.json(refreshed || existing);
  } catch (error) {
    console.error('Error updating wallet month:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, segmentData: { params: Params }) {
  try {
    if (!isAuthenticated(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await segmentData.params;
    await dbConnect();

    const deleted = await WalletMonth.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Month sheet not found' }, { status: 404 });
    }

    // Recalculate remaining months
    await syncAndCascadeWalletMonths();

    return NextResponse.json({ success: true, message: 'Month sheet deleted successfully' });
  } catch (error) {
    console.error('Error deleting wallet month:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
