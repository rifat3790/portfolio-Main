import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import WalletMonth from '@/models/WalletMonth';
import { ensureCurrentMonthCreated } from '@/lib/walletAutoMonth';
import { sendWhatsAppNotification } from '@/lib/whatsappService';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // 1. Auto-create current month sheet if it does not exist (1st of month auto creation guarantee)
    const monthResult = await ensureCurrentMonthCreated();

    // 2. Fetch the latest month sheet
    const months = await WalletMonth.find({}).sort({ createdAt: 1 }).lean();
    if (!months || months.length === 0) {
      return NextResponse.json({ error: 'No wallet data found.' }, { status: 400 });
    }

    const latestMonth = months[months.length - 1];

    // 3. Compute Financial Indicators
    const totalIncome = (latestMonth.salary || 0) + (latestMonth.addon || 0) + (latestMonth.bonus || 0) +
      (latestMonth.incomes || []).reduce((acc: number, i: any) => acc + (i.amount || 0), 0);
    const totalExpense = (latestMonth.expenses || []).reduce((acc: number, e: any) => acc + (e.amount || 0), 0);
    const carriedOver = latestMonth.carriedOverSavings || 0;
    const netSavings = totalIncome - totalExpense;
    const totalLiquidAssets = carriedOver + netSavings;

    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const daysElapsed = Math.max(1, now.getDate());
    const daysRemaining = Math.max(1, daysInMonth - daysElapsed + 1);

    const dailyAverage = totalExpense / daysElapsed;
    const targetCap = latestMonth.targetDailyCap || 2000;
    const recommendedDailyCap = Math.max(0, netSavings) / daysRemaining;

    // Calculate no-spend days in current month
    const expenseDates = new Set((latestMonth.expenses || []).map((e: any) => 
      e.date ? new Date(e.date).toISOString().split('T')[0] : ''
    ).filter(Boolean));
    
    let noSpendDays = 0;
    for (let d = 1; d <= daysElapsed; d++) {
      const dateStr = new Date(now.getFullYear(), now.getMonth(), d).toISOString().split('T')[0];
      if (!expenseDates.has(dateStr)) noSpendDays++;
    }

    // Pending Loans Summary
    const pendingLoans = (latestMonth.loans || []).filter((l: any) => l.status === 'Pending');
    const pendingLoansTotal = pendingLoans.reduce((acc: number, l: any) => acc + (l.amount || 0), 0);

    // Over-budget Categories Alert
    const categoryTotals: Record<string, number> = {};
    (latestMonth.expenses || []).forEach((e: any) => {
      const cat = e.category || 'Other';
      categoryTotals[cat] = (categoryTotals[cat] || 0) + (e.amount || 0);
    });

    const categoryBudgets = latestMonth.categoryBudgets || {};
    const overBudgetList: string[] = [];
    Object.entries(categoryTotals).forEach(([cat, spent]) => {
      const limit = categoryBudgets[cat];
      if (limit !== undefined && spent > limit) {
        overBudgetList.push(`• ${cat}: ৳${spent.toLocaleString()} (Limit: ৳${limit.toLocaleString()})`);
      }
    });

    const fmt = (num: number) => `৳${Math.round(num).toLocaleString('en-US')}`;

    // 4. Construct Executive Telegram Notification Payload
    const alertHeader = monthResult.created 
      ? `🎉 <b>NEW MONTH AUTO-CREATED FOR ${latestMonth.monthName.toUpperCase()}!</b>\n\n`
      : '';

    const overBudgetSection = overBudgetList.length > 0
      ? `\n⚠️ <b>Over-Budget Categories:</b>\n${overBudgetList.join('\n')}\n`
      : '';

    const loanSection = pendingLoansTotal > 0
      ? `\n🤝 <b>Active Loans Receivable:</b> ${fmt(pendingLoansTotal)} (${pendingLoans.length} pending)`
      : '';

    const paceStatus = dailyAverage <= recommendedDailyCap
      ? '🟢 SAFE SPENDING PACE'
      : '🔴 ELEVATED SPENDING PACE';

    const telegramMsg = `${alertHeader}📊 <b>EXECUTIVE DAILY WALLET & PACING REPORT</b>

🗓️ <b>Period:</b> ${latestMonth.monthName}
📅 <b>Progress:</b> Day ${daysElapsed} of ${daysInMonth} (${daysRemaining} days remaining)

💰 <b>Current Month Revenues:</b> ${fmt(totalIncome)}
💸 <b>Current Month Expenses:</b> ${fmt(totalExpense)}
🏦 <b>Net Savings (Current):</b> ${fmt(netSavings)}
💎 <b>Total Liquid Balance:</b> ${fmt(totalLiquidAssets)}

⚡ <b>Daily Average Spent:</b> ${fmt(dailyAverage)} / day
🎯 <b>Recommended Safe Daily Cap:</b> ${fmt(recommendedDailyCap)} / day
🔥 <b>No-Spend Days:</b> ${noSpendDays} days 🌟${loanSection}${overBudgetSection}

🛡️ <b>Status:</b> ${paceStatus}`;

    // 5. Send Notification
    const pushResult = await sendWhatsAppNotification({ message: telegramMsg });

    return NextResponse.json({
      success: true,
      autoMonthCreated: monthResult.created,
      monthName: latestMonth.monthName,
      messageSent: pushResult.success,
      pushDetails: pushResult
    });
  } catch (error: any) {
    console.error('Error executing daily Telegram cron job:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
