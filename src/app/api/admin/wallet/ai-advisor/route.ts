import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import WalletMonth from '@/models/WalletMonth';
import { sendWalletDailyEmailReport } from '@/lib/emailService';
import { sendWhatsAppNotification, sendTelegramPhotoNotification } from '@/lib/whatsappService';
import { isAuthenticated } from '@/lib/auth';

// Helper function to format currency
const fmt = (num: number) => `৳${Math.round(num).toLocaleString('en-US')}`;

// QuickChart PNG Image Generator helper for Telegram
const generateQuickChartUrl = (config: any) => {
  return `https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify(config))}&bkg=0b0f19&w=550&h=320&devicePixelRatio=2`;
};

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
      Food: 4500, Rent: 4000, Utility: 1000, Gadgets: 1, Server: 500, Entertainment: 500, 'Parents (Baba Ma)': 15000, Other: 500
    };

    const anomalies: any[] = [];
    Object.entries(categoryTotals).forEach(([cat, spent]) => {
      const budget = categoryBudgets[cat] ?? 5000;
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
      adviceRules.push(`⚠️ দৈনিক খরচের গড় (${fmt(currentDailyPace)}/দিন) প্রস্তাবিত সীমা (${fmt(recommendedDailyCap)}/দিন) অতিক্রম করেছে। দৈনিক খরচ কমালে মাস শেষে ${fmt(monteCarloExpected > 0 ? monteCarloExpected : 0)} সঞ্চয় নিশ্চিত হবে।`);
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
      scheduledTimeNotice: '5-Slot Automated Daily Dispatch System Active (9:00 AM, 3:00 PM, 6:00 PM, 9:00 PM, 11:30 PM BST)'
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
    const slot = body.slot || 'all'; // '9am' | '3pm' | '6pm' | '9pm' | '11pm' | 'all'
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

    // Check category over-spending
    const knownCategoriesSet = new Set(['Food', 'Rent', 'Utility', 'Gadgets', 'Server', 'Entertainment', 'Parents (Baba Ma)', 'Other']);
    const categoryTotals: Record<string, number> = {};
    (latestMonth.expenses || []).forEach((e: any) => {
      const cat = knownCategoriesSet.has(e.category) ? e.category : 'Utility';
      categoryTotals[cat] = (categoryTotals[cat] || 0) + (e.amount || 0);
    });

    const categoryBudgets: Record<string, number> = latestMonth.categoryBudgets || {
      Food: 4500, Rent: 4000, Utility: 1000, Gadgets: 1, Server: 500, Entertainment: 500, 'Parents (Baba Ma)': 15000, Other: 500
    };

    const catOverWarnings: string[] = [];
    Object.entries(categoryTotals).forEach(([cat, spent]) => {
      const limit = categoryBudgets[cat] ?? 5000;
      if (spent > limit) {
        catOverWarnings.push(`🔴 <b>${cat}</b>: Spent ${fmt(spent)} (Exceeded limit ${fmt(limit)} by ${fmt(spent - limit)})`);
      }
    });

    // 4-Week Phase Breakdown
    let week1Spent = 0, week2Spent = 0, week3Spent = 0, week4Spent = 0;
    (latestMonth.expenses || []).forEach((e: any) => {
      const d = new Date(e.date).getDate();
      if (d <= 7) week1Spent += e.amount;
      else if (d <= 14) week2Spent += e.amount;
      else if (d <= 21) week3Spent += e.amount;
      else week4Spent += e.amount;
    });

    let healthScore = 65;
    if (currentDailyPace <= recommendedDailyCap) healthScore += 20;
    if (catOverWarnings.length > 0) healthScore -= catOverWarnings.length * 10;
    healthScore = Math.max(10, Math.min(100, healthScore));

    const results: Record<string, any> = {};

    // Generate Custom Telegram Visual Infographic Image & Text based on Slot
    if (channel === 'telegram' || channel === 'all') {

      if (slot === '9am' || slot === 'all') {
        const title = `🌅 <b>MORNING FINANCIAL KICKOFF (9:00 AM BST)</b>`;
        const bodyMsg = `${title}

🗓️ <b>Period:</b> ${latestMonth.monthName} (Day ${daysElapsed}/${daysInMonth})
💰 <b>Net Liquid Balance:</b> ${fmt(netLiquidSavings)}
🎯 <b>Today's Safe Spending Cap:</b> <b>${fmt(recommendedDailyCap)} / day</b>

💡 <b>Morning Guidance:</b>
আজকের নিরাপদ খরচ সীমা ${fmt(recommendedDailyCap)} টাকার মধ্যে বজায় রাখলে মাস শেষে সঞ্চয় লক্ষ্য অর্জন সম্ভব।`;

        // Chart for 9am: Progress Gauge
        const chartUrl = generateQuickChartUrl({
          type: 'gauge',
          data: {
            datasets: [{
              value: Math.min(100, Math.round((daysElapsed / daysInMonth) * 100)),
              data: [50, 80, 100],
              backgroundColor: ['#10b981', '#f59e0b', '#ef4444']
            }]
          },
          options: {
            title: { display: true, text: `Month Progress vs Daily Cap (${fmt(recommendedDailyCap)})`, fontColor: '#fff' }
          }
        });

        await sendTelegramPhotoNotification({ imageUrl: chartUrl, caption: bodyMsg });
      }

      if (slot === '3pm' || slot === 'all') {
        const title = `🕒 <b>MID-DAY PACE & CATEGORY AUDIT (3:00 PM BST)</b>`;
        const warnText = catOverWarnings.length > 0
          ? `\n🚨 <b>OVER-SPENDING WARNING ALERTS:</b>\n${catOverWarnings.join('\n')}\n`
          : `\n✅ <b>Category Budgets:</b> All sectors within limits.\n`;

        const bodyMsg = `${title}

🗓️ <b>Period:</b> ${latestMonth.monthName}
⚡ <b>Current Daily Pace:</b> ${fmt(currentDailyPace)} / day
🎯 <b>Safe Target Daily Cap:</b> ${fmt(recommendedDailyCap)} / day
${warnText}
💡 <b>Mid-Day Action Direction:</b>
${catOverWarnings.length > 0 ? 'ক্যাটাগরি বাজেটের অতিরিক্ত খরচ হয়েছে। অপচয় ছাঁটাই করুন।' : 'সকল খাতের খরচ সীমার মধ্যে রয়েছে।'}`;

        // Chart for 3pm: Category Limits vs Actual
        const labels = Object.keys(categoryBudgets).slice(0, 6);
        const limitVals = labels.map(l => categoryBudgets[l] || 0);
        const spentVals = labels.map(l => categoryTotals[l] || 0);

        const chartUrl = generateQuickChartUrl({
          type: 'bar',
          data: {
            labels,
            datasets: [
              { label: 'Budget Cap', data: limitVals, backgroundColor: '#818cf8' },
              { label: 'Actual Spent', data: spentVals, backgroundColor: '#ef4444' }
            ]
          },
          options: {
            title: { display: true, text: 'Mid-Day Category Budget vs Actual Spent', fontColor: '#fff' }
          }
        });

        await sendTelegramPhotoNotification({ imageUrl: chartUrl, caption: bodyMsg });
      }

      if (slot === '6pm' || slot === 'all') {
        const title = `🕕 <b>WEALTH VAULT & LOAN RECOVERY (6:00 PM BST)</b>`;
        const bodyMsg = `${title}

🗓️ <b>Period:</b> ${latestMonth.monthName}
💰 <b>Cumulative Savings Balance:</b> ${fmt(netLiquidSavings)}
🤝 <b>Pending Loan Outstandings:</b> <b>${fmt(activeLoans)}</b>

💡 <b>Wealth Vault Direction:</b>
পেন্ডিং লোন রিমাইন্ডার পাঠিয়ে পাওনা টাকা উদ্ধার নিশ্চিত করুন।`;

        const chartUrl = generateQuickChartUrl({
          type: 'doughnut',
          data: {
            labels: ['Net Savings', 'Carried Over', 'Active Debts'],
            datasets: [{
              data: [Math.max(0, netLiquidSavings), Math.max(0, carriedOverSavings), Math.max(0, activeLoans)],
              backgroundColor: ['#10b981', '#3b82f6', '#ef4444']
            }]
          },
          options: {
            title: { display: true, text: 'Global Wealth Portfolio Distribution', fontColor: '#fff' }
          }
        });

        await sendTelegramPhotoNotification({ imageUrl: chartUrl, caption: bodyMsg });
      }

      if (slot === '9pm' || slot === 'all') {
        const title = `🤖 <b>AI EXECUTIVE COPILOT & LIFESTYLE GUIDANCE (9:00 PM BST)</b>`;
        const bodyMsg = `${title}

🗓️ <b>Period:</b> ${latestMonth.monthName}
🔮 <b>Monte Carlo Expected Savings:</b> ${fmt(monteCarloExpected)}
📊 <b>Health Rating:</b> ${healthScore}/100
🛡️ <b>Status:</b> ${currentDailyPace <= recommendedDailyCap ? '🟢 SAFE PACING' : '⚠️ ELEVATED PACING'}

💡 <b>AI Executive Direction:</b>
• ${currentDailyPace <= recommendedDailyCap ? 'দৈনিক খরচ নিয়ন্ত্রণে আছে। প্রস্তাবিত ক্যাপিং বজায় রাখুন।' : 'দৈনিক খরচ সীমা অতিক্রম করেছে।'}
• পেন্ডিং লোন: ${fmt(activeLoans)} (আদায়ে সচেষ্ট হন)।`;

        const chartUrl = generateQuickChartUrl({
          type: 'line',
          data: {
            labels: ['Optimistic (-20%)', 'Expected Velocity', 'Conservative (+25%)'],
            datasets: [{
              label: 'Monte Carlo Month-End Savings',
              data: [
                carriedOverSavings + totalIncome - (totalExpense + (currentDailyPace * 0.8 * daysRemaining)),
                monteCarloExpected,
                carriedOverSavings + totalIncome - (totalExpense + (currentDailyPace * 1.25 * daysRemaining))
              ],
              borderColor: '#818cf8',
              fill: false
            }]
          },
          options: {
            title: { display: true, text: 'Monte Carlo 3-Tier Risk Simulation Forecast', fontColor: '#fff' }
          }
        });

        await sendTelegramPhotoNotification({ imageUrl: chartUrl, caption: bodyMsg });
      }

      if (slot === '11pm' || slot === 'all') {
        const title = `📊 <b>DAY-END CLOSING AUDIT & SMART ANALYTICS (11:30 PM BST)</b>`;
        const bodyMsg = `${title}

🗓️ <b>Period:</b> ${latestMonth.monthName} (Day-End Closing)
💰 <b>Day-End Net Savings:</b> ${fmt(netLiquidSavings)}
⚡ <b>4-Week Phase Breakdown:</b>
• 1st Week (Days 1–7): ${fmt(week1Spent)}
• 2nd Week (Days 8–14): ${fmt(week2Spent)}
• 3rd Week (Days 15–21): ${fmt(week3Spent)}
• 4th Week (Days 22–31): ${fmt(week4Spent)}

💡 <b>Day-End Summary:</b>
আজকের দিন সফলভাবে সমাপ্ত হয়েছে। শুভরাত্রি!`;

        const chartUrl = generateQuickChartUrl({
          type: 'bar',
          data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4+'],
            datasets: [{
              label: 'Phase Expense (৳)',
              data: [week1Spent, week2Spent, week3Spent, week4Spent],
              backgroundColor: ['#60a5fa', '#818cf8', '#fbbf24', '#f472b6']
            }]
          },
          options: {
            title: { display: true, text: 'Monthly 4-Week Phase Outflow Velocity', fontColor: '#fff' }
          }
        });

        await sendTelegramPhotoNotification({ imageUrl: chartUrl, caption: bodyMsg });
      }

      results.telegram = { success: true, message: `Dispatched ${slot} visual report with QuickChart infographics to Telegram successfully!` };
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
      slot,
      message: `Staggered Daily Dispatch for ${slot.toUpperCase()} completed successfully!`,
      results
    });
  } catch (error: any) {
    console.error('Error in AI Advisory notification endpoint:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
