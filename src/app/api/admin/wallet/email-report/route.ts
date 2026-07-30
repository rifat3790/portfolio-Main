import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import WalletMonth from '@/models/WalletMonth';
import { sendWalletDailyEmailReport } from '@/lib/emailService';
import { isAuthenticated } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    if (!isAuthenticated(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json().catch(() => ({}));
    const recipients = body.emails || ['mdrifayethossen@gmail.com', 'rifayet.cse@gmail.com'];
    const smtpPass = body.appPassword || process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS || '';

    // Fetch latest active month or current month
    const months = await WalletMonth.find({}).sort({ monthName: -1 }).lean();
    if (!months || months.length === 0) {
      return NextResponse.json({ error: 'No wallet data found to generate email report.' }, { status: 400 });
    }

    const latestMonth = months[0];
    const totalIncome = (latestMonth.salary || 0) + (latestMonth.addon || 0) + (latestMonth.bonus || 0) +
      (latestMonth.incomes || []).reduce((acc: number, i: any) => acc + (i.amount || 0), 0);
    const totalExpense = (latestMonth.expenses || []).reduce((acc: number, e: any) => acc + (e.amount || 0), 0);
    const netSavings = totalIncome - totalExpense;

    // Calculate daily metrics
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const daysElapsed = Math.max(1, now.getDate());
    const daysRemaining = Math.max(1, daysInMonth - daysElapsed + 1);

    const dailyAverage = totalExpense / daysElapsed;
    const recommendedDailyCap = Math.max(0, netSavings) / daysRemaining;

    // Highest spending day & Weekday analysis
    const expenses = latestMonth.expenses || [];
    let highestSpendingDay = { date: 'N/A', amount: 0, description: '' };
    const weekdayTotals: { [key: string]: number } = {
      Sunday: 0, Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0, Saturday: 0
    };

    expenses.forEach((e: any) => {
      if (e.amount > highestSpendingDay.amount) {
        highestSpendingDay = {
          date: e.date ? new Date(e.date).toISOString().split('T')[0] : 'N/A',
          amount: e.amount,
          description: e.description
        };
      }

      if (e.date) {
        const d = new Date(e.date);
        const dayName = d.toLocaleDateString('en-US', { weekday: 'long' });
        if (weekdayTotals[dayName] !== undefined) {
          weekdayTotals[dayName] += e.amount;
        }
      }
    });

    const sortedWeekdays = Object.entries(weekdayTotals).sort((a, b) => b[1] - a[1]);
    const peakWeekday = sortedWeekdays[0] ? { day: sortedWeekdays[0][0], amount: sortedWeekdays[0][1] } : { day: 'Friday', amount: 0 };

    // Calculate health score
    const savingsRatePct = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;
    let healthScore = 50;
    if (savingsRatePct >= 35) healthScore += 30;
    else if (savingsRatePct >= 15) healthScore += 15;
    if (dailyAverage <= recommendedDailyCap) healthScore += 20;

    const result = await sendWalletDailyEmailReport({
      recipientEmail: recipients,
      smtpPass,
      monthName: latestMonth.monthName,
      totalIncome,
      totalExpense,
      netSavings,
      dailyAverage,
      recommendedDailyCap,
      highestSpendingDay,
      peakWeekday,
      healthScore: Math.min(100, healthScore),
      savingsRatePct
    });

    if (!result.success) {
      return NextResponse.json({
        success: false,
        error: result.error || result.message || 'SMTP Authentication failed. Please configure GMAIL_APP_PASSWORD.',
        recipients: result.recipients
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: `Test email report successfully delivered directly to Inbox (${recipients.join(', ')})!`,
      scheduledTime: 'Everyday at 8:00 PM BST (Bangladesh Time)',
      details: result
    });
  } catch (error: any) {
    console.error('Error generating wallet email report:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
