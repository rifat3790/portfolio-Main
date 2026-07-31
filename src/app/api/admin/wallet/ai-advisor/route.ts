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
    const projectedMonthEndExpense = totalExpense + (currentDailyPace * daysRemaining);
    const projectedEndSavings = carriedOverSavings + totalIncome - projectedMonthEndExpense - activeLoans;

    // 2. Category Burn Rate Anomaly Detection
    const categoryTotals: Record<string, number> = {};
    (latestMonth.expenses || []).forEach((e: any) => {
      const cat = e.category || 'Other';
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

    // 3. Financial Discipline & Health Score (0-100)
    const savingsRate = (totalIncome + carriedOverSavings) > 0 ? (netLiquidSavings / (totalIncome + carriedOverSavings)) * 100 : 0;
    let healthScore = 60;
    if (savingsRate >= 35) healthScore += 25;
    else if (savingsRate >= 15) healthScore += 10;
    if (currentDailyPace <= recommendedDailyCap) healthScore += 15;
    if (anomalies.length === 0) healthScore += 10;
    else healthScore -= anomalies.length * 5;
    healthScore = Math.max(10, Math.min(100, healthScore));

    // 4. Personalized AI Lifestyle & Action Advice ("কিভাবে চলা উচিত")
    const adviceRules: string[] = [];

    if (currentDailyPace > recommendedDailyCap) {
      adviceRules.push(`⚠️ দৈনিক খরচের গড় (${fmt(currentDailyPace)}/দিন) প্রস্তাবিত সীমা (${fmt(recommendedDailyCap)}/দিন) অতিক্রম করেছে। দৈনিক খরচ ${fmt(currentDailyPace - recommendedDailyCap)} টাকা কমালে মাস শেষে ${fmt(projectedEndSavings > 0 ? projectedEndSavings : 0)} সঞ্চয় নিশ্চিত হবে।`);
    } else {
      adviceRules.push(`🌟 আপনার দৈনিক খরচের গতি নিয়ন্ত্রণাধীন রয়েছে (${fmt(currentDailyPace)}/দিন)। প্রস্তাবিত ক্যাপিং অনুযায়ী চললে মাস শেষে আনুমানিক ${fmt(projectedEndSavings)} ব্যালেন্স থাকবে।`);
    }

    if (anomalies.length > 0) {
      const catNames = anomalies.map(a => a.category).join(', ');
      adviceRules.push(`🔴 ${catNames} খাতে বাজেট সীমা অতিক্রম করেছে। এই খাতে অপ্রয়োজনীয় ব্যয় স্থগিত রাখার পরামর্শ দেওয়া হচ্ছে।`);
    }

    if (activeLoans > 0) {
      adviceRules.push(`🤝 মোট ${fmt(activeLoans)} টাকা বাজারে লোন/ধারে দেওয়া আছে। দ্রুত আদায়ের চেষ্টা করলে আপনার লিকুইড সেভিংস বৃদ্ধি পাবে।`);
    } else {
      adviceRules.push(`✅ বাজারে কোনো বকেয়া লোন পেন্ডিং নেই। আপনার লিকুইড ব্যালেন্স নিরাপদ রয়েছে।`);
    }

    const livingRunwayDays = currentDailyPace > 0 ? Math.round(netLiquidSavings / currentDailyPace) : 999;
    adviceRules.push(`🛡️ বর্তমান ব্যালেন্সে আপনার কোনো ইনকাম ছাড়াও পরবর্তী প্রায় ${livingRunwayDays} দিন চলার সক্ষমতা রয়েছে।`);

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
      projectedMonthEndExpense,
      projectedEndSavings,
      healthScore,
      savingsRate,
      anomalies,
      livingRunwayDays,
      adviceRules,
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
    const savingsRatePct = (totalIncome + carriedOverSavings) > 0 ? (netLiquidSavings / (totalIncome + carriedOverSavings)) * 100 : 0;

    let healthScore = 65;
    if (currentDailyPace <= recommendedDailyCap) healthScore += 20;

    const results: Record<string, any> = {};

    // Send Telegram Notification
    if (channel === 'telegram' || channel === 'all') {
      const telegramMsg = `🤖 <b>AI EXECUTIVE FINANCIAL COPILOT REPORT</b>

🗓️ <b>Period:</b> ${latestMonth.monthName} (Day ${daysElapsed}/${daysInMonth})
💰 <b>Net Liquid Savings:</b> ${fmt(netLiquidSavings)}
⚡ <b>Current Daily Pace:</b> ${fmt(currentDailyPace)} / day
🎯 <b>Recommended Daily Cap:</b> ${fmt(recommendedDailyCap)} / day

📊 <b>Health Rating:</b> ${healthScore}/100
🛡️ <b>Status:</b> ${currentDailyPace <= recommendedDailyCap ? '🟢 SAFE PACING' : '⚠️ ELEVATED PACING'}

💡 <b>AI Executive Advice:</b>
• ${currentDailyPace <= recommendedDailyCap ? 'দৈনিক খরচ নিয়ন্ত্রণে আছে। প্রস্তাবিত ক্যাপিং বজায় রাখুন।' : 'দৈনিক খরচ প্রস্তাবিত ক্যাপিং ছাড়িয়েছে। অপচয় কমানো প্রয়োজন।'}
• পেন্ডিং লোন: ${fmt(activeLoans)} (আদায়ে সচেষ্ট হন)।`;

      try {
        await sendWhatsAppNotification({ message: telegramMsg });
        results.telegram = { success: true, message: 'Dispatched to Telegram Bot successfully!' };
      } catch (err: any) {
        results.telegram = { success: false, error: err.message };
      }
    }

    // Send Email Notification
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
      message: 'AI Executive Advisory dispatch completed!',
      results
    });
  } catch (error: any) {
    console.error('Error in AI Advisory notification endpoint:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
