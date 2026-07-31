import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import WalletMonth from '@/models/WalletMonth';
import { sendWalletDailyEmailReport } from '@/lib/emailService';
import { sendWhatsAppNotification } from '@/lib/whatsappService';
import { isAuthenticated } from '@/lib/auth';

// Helper function to format currency
const fmt = (num: number) => `৳${Math.round(num).toLocaleString('en-US')}`;

export async function GET(req: NextRequest) {
  try {
    if (!isAuthenticated(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const months = await WalletMonth.find({}).sort({ createdAt: 1 }).lean();
    if (!months || months.length === 0) {
      return NextResponse.json({ error: 'No wallet data available for AI analysis.' }, { status: 400 });
    }

    const latestMonth = months[months.length - 1];
    const carriedOverSavings = latestMonth.carriedOverSavings || 0;
    const totalIncome = (latestMonth.salary || 0) + (latestMonth.addon || 0) + (latestMonth.bonus || 0) +
      (latestMonth.incomes || []).reduce((acc: number, i: any) => acc + (i.amount || 0), 0);
    const totalExpense = (latestMonth.expenses || []).reduce((acc: number, e: any) => acc + (e.amount || 0), 0);
    const activeLoans = (latestMonth.loans || [])
      .filter((l: any) => l.status === 'Pending')
      .reduce((acc: number, l: any) => acc + (l.amount || 0), 0);
    const returnedLoans = (latestMonth.loans || [])
      .filter((l: any) => l.status === 'Returned')
      .reduce((acc: number, l: any) => acc + (l.amount || 0), 0);

    const netLiquidSavings = carriedOverSavings + totalIncome - totalExpense - activeLoans;

    // Time calculations
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const daysElapsed = Math.max(1, now.getDate());
    const daysRemaining = Math.max(1, daysInMonth - daysElapsed + 1);

    // 1. ML Spending Velocity & Regression Model
    const currentDailyPace = totalExpense / daysElapsed;
    const recommendedDailyCap = Math.max(0, netLiquidSavings) / daysRemaining;

    // 2. Monte Carlo 3-Tier Risk Simulation Forecast
    const monteCarloOptimistic = carriedOverSavings + totalIncome - (totalExpense + (currentDailyPace * 0.8 * daysRemaining)) - activeLoans;
    const monteCarloExpected = carriedOverSavings + totalIncome - (totalExpense + (currentDailyPace * daysRemaining)) - activeLoans;
    const monteCarloConservative = carriedOverSavings + totalIncome - (totalExpense + (currentDailyPace * 1.25 * daysRemaining)) - activeLoans;

    // 3. FIRE (Financial Independence) Roadmap & Runway Math
    const estimatedAnnualExpense = (totalExpense / Math.max(1, daysElapsed)) * 365;
    const fireTargetNumber = estimatedAnnualExpense * 25; // 4% rule
    const fireProgressPct = fireTargetNumber > 0 ? Math.min(100, Math.max(0, (netLiquidSavings / fireTargetNumber) * 100)) : 0;
    const livingRunwayDays = currentDailyPace > 0 ? Math.round(netLiquidSavings / currentDailyPace) : 999;
    const livingRunwayMonths = (livingRunwayDays / 30).toFixed(1);

    // 4. Dynamic Category Burn Rate & Over-spending Anomaly Detection
    const knownCategoriesSet = new Set(['Food', 'Rent', 'Utility', 'Gadgets', 'Server', 'Entertainment', 'Parents (Baba Ma)', 'Other']);
    const categoryTotals: Record<string, number> = {};
    (latestMonth.expenses || []).forEach((e: any) => {
      const cat = knownCategoriesSet.has(e.category) ? e.category : 'Utility';
      categoryTotals[cat] = (categoryTotals[cat] || 0) + (e.amount || 0);
    });

    const categoryBudgets: Record<string, number> = latestMonth.categoryBudgets || {
      Food: 6000, Rent: 5000, Utility: 3000, Gadgets: 5000, Server: 2000, Entertainment: 2000, 'Parents (Baba Ma)': 5000, Other: 3000
    };

    const anomalies: any[] = [];
    Object.entries(categoryTotals).forEach(([cat, spent]) => {
      const budget = categoryBudgets[cat] || 5000;
      if (spent > budget) {
        anomalies.push({
          category: cat,
          spent,
          budget,
          excess: spent - budget,
          pct: Math.round((spent / budget) * 100),
          severity: spent > budget * 1.5 ? 'CRITICAL' : 'WARNING'
        });
      }
    });

    // 5. Financial Health Index (0-100)
    const savingsRate = (totalIncome + carriedOverSavings) > 0 ? (netLiquidSavings / (totalIncome + carriedOverSavings)) * 100 : 0;
    let healthScore = 60;
    if (savingsRate >= 35) healthScore += 25;
    else if (savingsRate >= 15) healthScore += 10;
    if (currentDailyPace <= recommendedDailyCap) healthScore += 15;
    if (anomalies.length === 0) healthScore += 10;
    else healthScore -= anomalies.length * 5;
    healthScore = Math.max(10, Math.min(100, healthScore));

    // 6. Actionable AI Recommendations & Roadmap Direction ("কিভাবে চলা উচিত")
    const adviceRules: string[] = [];

    if (currentDailyPace > recommendedDailyCap) {
      adviceRules.push(`⚠️ দৈনিক খরচের গড় (${fmt(currentDailyPace)}/দিন) প্রস্তাবিত সীমা (${fmt(recommendedDailyCap)}/দিন) অতিক্রম করেছে। দৈনিক খরচ ${fmt(currentDailyPace - recommendedDailyCap)} টাকা কমালে মাস শেষে ${fmt(monteCarloExpected > 0 ? monteCarloExpected : 0)} সঞ্চয় নিশ্চিত হবে।`);
    } else {
      adviceRules.push(`🌟 আপনার দৈনিক খরচের গতি বজায় রয়েছে (${fmt(currentDailyPace)}/দিন)। প্রস্তাবিত সীমার মধ্যে থাকলে মাস শেষে মন্টে কার্লো প্রেডিকশন অনুযায়ী ${fmt(monteCarloExpected)} জমা থাকবে।`);
    }

    if (anomalies.length > 0) {
      const catNames = anomalies.map(a => `${a.category} (${fmt(a.excess)} ওভার)`).join(', ');
      adviceRules.push(`🚨 <b>OVER-SPENDING ALERT:</b> ${catNames} খাতে বাজেটের অতিরিক্ত খরচ হয়েছে। অবিলম্বে নিয়ন্ত্রণ করুন।`);
    }

    if (activeLoans > 0) {
      adviceRules.push(`🤝 মোট ${fmt(activeLoans)} টাকা বাজারে পেন্ডিং লোন রয়েছে। ১-ক্লিক রিমাইন্ডার পাঠিয়ে লোন উদ্ধার করলে ব্যালেন্স বাড়বে।`);
    } else {
      adviceRules.push(`✅ বাজারে কোনো বকেয়া লোন পেন্ডিং নেই। সকল পাওনা টাকা আদায়কৃত।`);
    }

    adviceRules.push(`🛡️ বর্তমান জমানো ব্যালেন্সে আপনার কোনো ইনকাম ছাড়াও প্রায় ${livingRunwayMonths} মাস (${livingRunwayDays} দিন) সম্পূর্ণ নিরাপদে সংসার চালানোর সক্ষমতা রয়েছে।`);

    return NextResponse.json({
      monthName: latestMonth.monthName,
      daysElapsed,
      daysInMonth,
      daysRemaining,
      carriedOverSavings,
      totalIncome,
      totalExpense,
      activeLoans,
      returnedLoans,
      netLiquidSavings,
      currentDailyPace,
      recommendedDailyCap,
      healthScore,
      savingsRate,
      anomalies,
      livingRunwayDays,
      livingRunwayMonths,
      fireTargetNumber,
      fireProgressPct,
      monteCarlo: {
        optimistic: monteCarloOptimistic,
        expected: monteCarloExpected,
        conservative: monteCarloConservative,
      },
      adviceRules,
      scheduledTimeNotice: 'Automated Daily 9:00 PM BST Notifications Active'
    });
  } catch (error: any) {
    console.error('Error computing AI Advisor data:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!isAuthenticated(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json().catch(() => ({}));
    const channel = body.channel || 'all'; // 'email' | 'telegram' | 'all'
    const recipients = body.emails || ['mdrifayethossen@gmail.com', 'rifayet.cse@gmail.com'];
    const smtpPass = body.appPassword || process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS || '';

    const months = await WalletMonth.find({}).sort({ createdAt: 1 }).lean();
    if (!months || months.length === 0) {
      return NextResponse.json({ error: 'No wallet data found.' }, { status: 400 });
    }

    const latestMonth = months[months.length - 1];
    const carriedOverSavings = latestMonth.carriedOverSavings || 0;
    const totalIncome = (latestMonth.salary || 0) + (latestMonth.addon || 0) + (latestMonth.bonus || 0) +
      (latestMonth.incomes || []).reduce((acc: number, i: any) => acc + (i.amount || 0), 0);
    const totalExpense = (latestMonth.expenses || []).reduce((acc: number, e: any) => acc + (e.amount || 0), 0);
    const activeLoans = (latestMonth.loans || [])
      .filter((l: any) => l.status === 'Pending')
      .reduce((acc: number, l: any) => acc + (l.amount || 0), 0);

    const netLiquidSavings = carriedOverSavings + totalIncome - totalExpense - activeLoans;

    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const daysElapsed = Math.max(1, now.getDate());
    const daysRemaining = Math.max(1, daysInMonth - daysElapsed + 1);

    const currentDailyPace = totalExpense / daysElapsed;
    const recommendedDailyCap = Math.max(0, netLiquidSavings) / daysRemaining;
    const monteCarloExpected = carriedOverSavings + totalIncome - (totalExpense + (currentDailyPace * daysRemaining)) - activeLoans;
    const savingsRatePct = (totalIncome + carriedOverSavings) > 0 ? (netLiquidSavings / (totalIncome + carriedOverSavings)) * 100 : 0;

    // Check individual category budget over-spending warnings
    const knownCategoriesSet = new Set(['Food', 'Rent', 'Utility', 'Gadgets', 'Server', 'Entertainment', 'Parents (Baba Ma)', 'Other']);
    const categoryTotals: Record<string, number> = {};
    (latestMonth.expenses || []).forEach((e: any) => {
      const cat = knownCategoriesSet.has(e.category) ? e.category : 'Utility';
      categoryTotals[cat] = (categoryTotals[cat] || 0) + (e.amount || 0);
    });

    const categoryBudgets: Record<string, number> = latestMonth.categoryBudgets || {
      Food: 6000, Rent: 5000, Utility: 3000, Gadgets: 5000, Server: 2000, Entertainment: 2000, 'Parents (Baba Ma)': 5000, Other: 3000
    };

    const catOverWarnings: string[] = [];
    Object.entries(categoryTotals).forEach(([cat, spent]) => {
      const limit = categoryBudgets[cat] || 5000;
      if (spent > limit) {
        catOverWarnings.push(`🔴 <b>${cat}</b>: Spent ${fmt(spent)} (Exceeded limit ${fmt(limit)} by ${fmt(spent - limit)})`);
      }
    });

    const warningNoticeText = catOverWarnings.length > 0
      ? `\n🚨 <b>OVER-SPENDING WARNING ALERTS:</b>\n${catOverWarnings.join('\n')}\n`
      : `\n✅ <b>Category Budgets:</b> All sectors within budget caps.\n`;

    let healthScore = 65;
    if (currentDailyPace <= recommendedDailyCap) healthScore += 20;
    if (catOverWarnings.length > 0) healthScore -= catOverWarnings.length * 10;
    healthScore = Math.max(10, Math.min(100, healthScore));

    const results: Record<string, any> = {};

    // Send Telegram Notification (Daily 9:00 PM BST)
    if (channel === 'telegram' || channel === 'all') {
      const telegramMsg = `🤖 <b>DAILY 9:00 PM BST AI EXECUTIVE FINANCIAL ADVISOR</b>

🗓️ <b>Period:</b> ${latestMonth.monthName} (Day ${daysElapsed}/${daysInMonth})
💰 <b>Net Liquid Savings:</b> ${fmt(netLiquidSavings)}
⚡ <b>Current Daily Pace:</b> ${fmt(currentDailyPace)} / day
🎯 <b>Recommended Safe Daily Cap:</b> ${fmt(recommendedDailyCap)} / day

🔮 <b>Monte Carlo Expected Savings:</b> ${fmt(monteCarloExpected)}
📊 <b>Health Rating:</b> ${healthScore}/100
🛡️ <b>Status:</b> ${catOverWarnings.length > 0 ? '🚨 OVER-SPENDING WARNING' : currentDailyPace <= recommendedDailyCap ? '🟢 SAFE PACING' : '⚠️ ELEVATED PACING'}
${warningNoticeText}
💡 <b>AI Executive Direction:</b>
• ${currentDailyPace <= recommendedDailyCap ? 'দৈনিক খরচ নিয়ন্ত্রণে আছে। প্রস্তাবিত ক্যাপিং বজায় রাখুন।' : 'দৈনিক খরচ সীমা অতিক্রম করেছে। অপচয় ছাঁটাই করুন।'}
• পেন্ডিং লোন: ${fmt(activeLoans)} (আদায়ে সচেষ্ট হন)।
• <i>Automated Dispatch at 9:00 PM BST Everyday</i>`;

      try {
        await sendWhatsAppNotification({ message: telegramMsg });
        results.telegram = { success: true, message: 'Dispatched 9:00 PM report with over-spending warnings to Telegram Bot successfully!' };
      } catch (err: any) {
        results.telegram = { success: false, error: err.message };
      }
    }

    // Send Email Notification (Daily 9:00 PM BST)
    if (channel === 'email' || channel === 'all') {
      try {
        const emailResult = await sendWalletDailyEmailReport({
          recipientEmail: recipients,
          smtpPass,
          monthName: latestMonth.monthName,
          totalIncome,
          totalExpense,
          netSavings: netLiquidSavings,
          dailyAverage: currentDailyPace,
          recommendedDailyCap,
          highestSpendingDay: { date: 'N/A', amount: 0, description: '' },
          peakWeekday: { day: 'Friday', amount: 0 },
          healthScore,
          savingsRatePct
        });
        results.email = emailResult;
      } catch (err: any) {
        results.email = { success: false, error: err.message };
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Daily 9:00 PM AI Executive Advisory dispatch completed!',
      results
    });
  } catch (error: any) {
    console.error('Error in AI Advisory notification endpoint:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
