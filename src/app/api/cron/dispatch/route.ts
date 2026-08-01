import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import WalletMonth from '@/models/WalletMonth';
import { ensureCurrentMonthCreated } from '@/lib/walletAutoMonth';
import { sendWhatsAppNotification, sendTelegramPhotoNotification } from '@/lib/whatsappService';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const fmt = (num: number) => `৳${Math.round(num).toLocaleString('en-US')}`;

const generateQuickChartUrl = (config: any) => {
  return `https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify(config))}&bkg=0b0f19&w=550&h=320&devicePixelRatio=2`;
};

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // 1. Ensure active current month sheet exists automatically
    const monthResult = await ensureCurrentMonthCreated();

    // 2. Fetch the latest month sheet
    const months = await WalletMonth.find({}).sort({ createdAt: 1 }).lean();
    if (!months || months.length === 0) {
      return NextResponse.json({ error: 'No wallet data found.' }, { status: 400 });
    }

    const latestMonth = months[months.length - 1];

    // Determine target slot from query or current time (BST = UTC+6)
    const { searchParams } = new URL(req.url);
    let slot = searchParams.get('slot') || '';

    if (!slot) {
      const nowUtc = new Date();
      // Convert to BST (UTC+6)
      const bstHour = (nowUtc.getUTCHours() + 6) % 24;
      if (bstHour >= 8 && bstHour < 12) slot = '9am';
      else if (bstHour >= 12 && bstHour < 17) slot = '3pm';
      else if (bstHour >= 17 && bstHour < 20) slot = '6pm';
      else if (bstHour >= 20 && bstHour < 23) slot = '9pm';
      else slot = '11pm';
    }

    // Financial Metrics Calculation
    const carriedOverSavings = latestMonth.carriedOverSavings || 0;
    const totalIncome = (latestMonth.salary || 0) + (latestMonth.addon || 0) + (latestMonth.bonus || 0) +
      (latestMonth.incomes || []).reduce((acc: number, i: any) => acc + (i.amount || 0), 0);
    const totalExpense = (latestMonth.expenses || []).reduce((acc: number, e: any) => acc + (e.amount || 0), 0);
    const pendingLoans = (latestMonth.loans || []).filter((l: any) => l.status === 'Pending');
    const pendingLoansTotal = pendingLoans.reduce((acc: number, l: any) => acc + (l.amount || 0), 0);

    const netSavings = totalIncome - totalExpense;
    const netLiquidSavings = carriedOverSavings + netSavings - pendingLoansTotal;

    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const daysElapsed = Math.max(1, now.getDate());
    const daysRemaining = Math.max(1, daysInMonth - daysElapsed + 1);

    const currentDailyPace = totalExpense / daysElapsed;
    const recommendedDailyCap = Math.max(0, netSavings) / daysRemaining;

    // Over-budget check
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

    let dispatchedMsg = '';

    // Slot 1: 🌅 9:00 AM BST - Morning Kickoff & Daily Cap Allowance
    if (slot === '9am') {
      dispatchedMsg = `🌅 <b>MORNING FINANCIAL KICKOFF (9:00 AM BST)</b>

🗓️ <b>Period:</b> ${latestMonth.monthName} (Day ${daysElapsed}/${daysInMonth})

💰 <b>Target Safe Daily Cap:</b> ${fmt(recommendedDailyCap)} / day
⚡ <b>Current Avg Daily Spend:</b> ${fmt(currentDailyPace)} / day
🏦 <b>Net Savings Margin:</b> ${fmt(netSavings)}

🛡️ <b>Guidance:</b> Today's target cap is ${fmt(recommendedDailyCap)}. Keep expenses within cap for optimum monthly savings rate!`;

      await sendWhatsAppNotification({ message: dispatchedMsg });
    }

    // Slot 2: 🕒 3:00 PM BST - Mid-Day Pace & Category Budget Alert
    else if (slot === '3pm') {
      const alertStr = overBudgetList.length > 0
        ? `\n⚠️ <b>Category Over-Spending Warning:</b>\n${overBudgetList.join('\n')}`
        : '\n🟢 All category budgets are currently under control.';

      dispatchedMsg = `🕒 <b>MID-DAY EXPENSE PACE AUDIT (3:00 PM BST)</b>

🗓️ <b>Period:</b> ${latestMonth.monthName}
💸 <b>Total Spent so far:</b> ${fmt(totalExpense)}
📊 <b>Current Daily Pace:</b> ${fmt(currentDailyPace)} / day${alertStr}

💡 Track your remaining spending carefully for the rest of today.`;

      await sendWhatsAppNotification({ message: dispatchedMsg });
    }

    // Slot 3: 🕕 6:00 PM BST - Wealth Vault & Pending Debt Recovery
    else if (slot === '6pm') {
      const loanStr = pendingLoansTotal > 0
        ? `\n🤝 <b>Pending Loans Receivable:</b> ${fmt(pendingLoansTotal)} (${pendingLoans.length} active borrowers)`
        : '\n🟢 Zero pending loan receivables.';

      dispatchedMsg = `🕕 <b>WEALTH VAULT & ASSETS DISPATCH (6:00 PM BST)</b>

🗓️ <b>Period:</b> ${latestMonth.monthName}
💎 <b>Net Liquid Assets:</b> ${fmt(netLiquidSavings)}
🏦 <b>Carried-Over Balance:</b> ${fmt(carriedOverSavings)}${loanStr}

🎯 Stay focused on debt recovery and wealth accumulation goals.`;

      await sendWhatsAppNotification({ message: dispatchedMsg });
    }

    // Slot 4: 🕘 9:00 PM BST - AI Executive Copilot & FIRE Guidance
    else if (slot === '9pm') {
      const savingsRate = (totalIncome + carriedOverSavings) > 0 ? (netSavings / (totalIncome + carriedOverSavings)) * 100 : 0;
      dispatchedMsg = `🕘 <b>AI EXECUTIVE COPILOT & FIRE AUDIT (9:00 PM BST)</b>

🗓️ <b>Period:</b> ${latestMonth.monthName}
📈 <b>Savings Margin:</b> ${savingsRate.toFixed(1)}%
🎯 <b>Projected End Savings:</b> ${fmt(netSavings - (currentDailyPace * daysRemaining))}

🛡️ Keep your financial velocity positive to maintain long-term capital compounding!`;

      await sendWhatsAppNotification({ message: dispatchedMsg });
    }

    // Slot 5: 🕛 11:30 PM BST - Day-End Closing Audit & Infographic
    else if (slot === '11pm' || slot === 'daily_intel') {
      dispatchedMsg = `🕛 <b>DAY-END EXECUTIVE CLOSING AUDIT (11:30 PM BST)</b>

🗓️ <b>Period:</b> ${latestMonth.monthName} (Day ${daysElapsed}/${daysInMonth})
💰 <b>Revenues:</b> ${fmt(totalIncome)}
💸 <b>Expenses:</b> ${fmt(totalExpense)}
🏦 <b>Net Savings:</b> ${fmt(netSavings)}
💎 <b>Total Liquid Balance:</b> ${fmt(netLiquidSavings)}

⚡ <b>Daily Average:</b> ${fmt(currentDailyPace)} / day
🎯 <b>Recommended Daily Cap:</b> ${fmt(recommendedDailyCap)} / day`;

      const chartUrl = generateQuickChartUrl({
        type: 'bar',
        data: {
          labels: ['Total Inflow', 'Total Outflow', 'Net Savings'],
          datasets: [{
            label: 'Financial Summary (৳)',
            data: [totalIncome, totalExpense, Math.max(0, netSavings)],
            backgroundColor: ['#10b981', '#ef4444', '#6366f1']
          }]
        },
        options: {
          title: { display: true, text: `Day-End Executive Audit: ${latestMonth.monthName}`, fontColor: '#fff' }
        }
      });

      await sendTelegramPhotoNotification({ imageUrl: chartUrl, caption: dispatchedMsg });
    }

    // Slot: 📊 Weekly Phase Report
    else if (slot === 'weekly_phase') {
      dispatchedMsg = `📊 <b>WEEKLY EXECUTIVE PHASE AUDIT REPORT</b>

🗓️ <b>Period:</b> ${latestMonth.monthName}
💰 <b>Total Gross Inflow:</b> ${fmt(totalIncome)}
💸 <b>Total Gross Outflow:</b> ${fmt(totalExpense)}
🏦 <b>Net Savings:</b> ${fmt(netSavings)}

📈 Weekly phase velocity audit complete.`;

      const chartUrl = generateQuickChartUrl({
        type: 'line',
        data: {
          labels: ['Inflow', 'Outflow', 'Savings'],
          datasets: [{
            label: 'Weekly Phase Audit (৳)',
            data: [totalIncome, totalExpense, Math.max(0, netSavings)],
            borderColor: '#818cf8',
            fill: false
          }]
        },
        options: {
          title: { display: true, text: `Weekly Phase Audit (${latestMonth.monthName})`, fontColor: '#fff' }
        }
      });

      await sendTelegramPhotoNotification({ imageUrl: chartUrl, caption: dispatchedMsg });
    }

    // Default / All
    else {
      dispatchedMsg = `📊 <b>EXECUTIVE DAILY REPORT</b> (${slot.toUpperCase()})\nPeriod: ${latestMonth.monthName}\nRevenues: ${fmt(totalIncome)} | Expenses: ${fmt(totalExpense)} | Net: ${fmt(netSavings)}`;
      await sendWhatsAppNotification({ message: dispatchedMsg });
    }

    return NextResponse.json({
      success: true,
      slotExecuted: slot,
      autoMonthCreated: monthResult.created,
      monthName: latestMonth.monthName,
      messageSent: true
    });
  } catch (error: any) {
    console.error('Error in cron dispatch handler:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
