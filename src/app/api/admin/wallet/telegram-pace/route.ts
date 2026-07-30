import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import WalletMonth from '@/models/WalletMonth';
import { sendWhatsAppNotification } from '@/lib/whatsappService';
import { isAuthenticated } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    if (!isAuthenticated(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json().catch(() => ({}));
    const targetCap = Number(body.targetDailyCap) || 2000;

    const months = await WalletMonth.find({}).sort({ monthName: -1 }).lean();
    if (!months || months.length === 0) {
      return NextResponse.json({ error: 'No wallet data found.' }, { status: 400 });
    }

    const latestMonth = months[0];
    const totalIncome = (latestMonth.salary || 0) + (latestMonth.addon || 0) + (latestMonth.bonus || 0) +
      (latestMonth.incomes || []).reduce((acc: number, i: any) => acc + (i.amount || 0), 0);
    const totalExpense = (latestMonth.expenses || []).reduce((acc: number, e: any) => acc + (e.amount || 0), 0);
    const netSavings = totalIncome - totalExpense;

    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const daysElapsed = Math.max(1, now.getDate());
    const daysRemaining = Math.max(1, daysInMonth - daysElapsed + 1);

    const currentDailyAverage = totalExpense / daysElapsed;
    const recommendedDailyCap = Math.max(0, netSavings) / daysRemaining;

    // Calculate no-spend days
    const expenseDates = new Set((latestMonth.expenses || []).map((e: any) => 
      e.date ? new Date(e.date).toISOString().split('T')[0] : ''
    ).filter(Boolean));
    
    let noSpendDays = 0;
    for (let d = 1; d <= daysElapsed; d++) {
      const dateStr = new Date(now.getFullYear(), now.getMonth(), d).toISOString().split('T')[0];
      if (!expenseDates.has(dateStr)) noSpendDays++;
    }

    const projectedRemainingSpend = targetCap * daysRemaining;
    const projectedEndSavings = netSavings - projectedRemainingSpend;

    const fmt = (num: number) => `৳${Math.round(num).toLocaleString('en-US')}`;

    const msg = `⚡ <b>WALLETS DAILY PACE & GUIDANCE PUSH</b>

🗓️ <b>Period:</b> ${latestMonth.monthName}
📅 <b>Month Progress:</b> Day ${daysElapsed} of ${daysInMonth} (${daysRemaining} days remaining)

📊 <b>Current Daily Avg Spent:</b> ${fmt(currentDailyAverage)} / day
🎯 <b>Recommended Safe Daily Cap:</b> ${fmt(recommendedDailyCap)} / day
⚡ <b>Target Custom Daily Cap:</b> ${fmt(targetCap)} / day

🔥 <b>No-Spend Days Achieved:</b> ${noSpendDays} days 🌟
💰 <b>Current Net Savings:</b> ${fmt(netSavings)}
📈 <b>Projected End Savings (at ${fmt(targetCap)}/day):</b> ${fmt(projectedEndSavings)}

🛡️ <i>Guidance Status:</i> ${currentDailyAverage <= recommendedDailyCap ? '🟢 SAFE PACE' : '🔴 ELEVATED SPENDING PACE'}`;

    await sendWhatsAppNotification({ message: msg });

    return NextResponse.json({
      success: true,
      message: 'Daily Pace summary push sent to Telegram Bot successfully!'
    });
  } catch (error: any) {
    console.error('Error sending Telegram pace alert:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
