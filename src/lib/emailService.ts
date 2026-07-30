import nodemailer from 'nodemailer';

export interface IEmailReportData {
  recipientEmail?: string | string[];
  smtpUser?: string;
  smtpPass?: string;
  monthName: string;
  totalIncome: number;
  totalExpense: number;
  netSavings: number;
  dailyAverage: number;
  recommendedDailyCap: number;
  highestSpendingDay: { date: string; amount: number; description?: string };
  peakWeekday: { day: string; amount: number };
  healthScore: number;
  savingsRatePct: number;
  stealthModeActive?: boolean;
}

export const sendWalletDailyEmailReport = async (data: IEmailReportData) => {
  const defaultRecipients = ['mdrifayethossen@gmail.com', 'rifayet.cse@gmail.com'];
  const recipients = data.recipientEmail
    ? (Array.isArray(data.recipientEmail) ? data.recipientEmail : [data.recipientEmail])
    : defaultRecipients;

  const {
    monthName,
    totalIncome,
    totalExpense,
    netSavings,
    dailyAverage,
    recommendedDailyCap,
    highestSpendingDay,
    peakWeekday,
    healthScore,
    savingsRatePct,
    smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER || 'rifayet.cse@gmail.com',
    smtpPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD || ''
  } = data;

  const fmt = (num: number) => `৳${Math.round(num).toLocaleString('en-US')}`;

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Personal Wallet Executive Digest</title>
</head>
<body style="margin:0; padding:0; background-color:#0b0f19; font-family:'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color:#f8fafc;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#0b0f19; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:600px; background-color:#151c2c; border:1px solid #2d3748; border-radius:16px; overflow:hidden; box-shadow:0 25px 60px rgba(0,0,0,0.6);">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #6366f1 0%, #06b6d4 100%); padding: 32px 28px; text-align: left;">
              <div style="font-size:11px; font-weight:800; text-transform:uppercase; letter-spacing:1.5px; color:#e0e7ff;">Executive Briefing Dispatch</div>
              <h1 style="margin: 8px 0 0; font-size:26px; font-weight:900; color:#ffffff; letter-spacing:-0.5px;">🏛️ Personal Wallet Executive Digest</h1>
              <div style="font-size:13px; color:#c7d2fe; margin-top:6px; font-weight:500;">
                Period: <strong>${monthName}</strong> | Daily Schedule: <strong>8:00 PM BST (Bangladesh Time)</strong>
              </div>
            </td>
          </tr>

          <!-- Summary Metrics Cards -->
          <tr>
            <td style="padding: 28px 24px 20px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td width="32%" style="background:#1a233a; border:1px solid #2e3a59; border-radius:12px; padding:16px 10px; text-align:center;">
                    <div style="font-size:10px; color:#94a3b8; text-transform:uppercase; font-weight:800; letter-spacing:0.5px;">Total Revenues</div>
                    <div style="font-size:18px; font-weight:900; color:#34d399; margin-top:6px;">${fmt(totalIncome)}</div>
                  </td>
                  <td width="2%"></td>
                  <td width="32%" style="background:#1a233a; border:1px solid #2e3a59; border-radius:12px; padding:16px 10px; text-align:center;">
                    <div style="font-size:10px; color:#94a3b8; text-transform:uppercase; font-weight:800; letter-spacing:0.5px;">Total Spending</div>
                    <div style="font-size:18px; font-weight:900; color:#f87171; margin-top:6px;">${fmt(totalExpense)}</div>
                  </td>
                  <td width="2%"></td>
                  <td width="32%" style="background:#1a233a; border:1px solid #2e3a59; border-radius:12px; padding:16px 10px; text-align:center;">
                    <div style="font-size:10px; color:#94a3b8; text-transform:uppercase; font-weight:800; letter-spacing:0.5px;">Net Balance</div>
                    <div style="font-size:18px; font-weight:900; color:#818cf8; margin-top:6px;">${fmt(netSavings)}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Daily Pace & Advice Section -->
          <tr>
            <td style="padding: 0 24px 20px;">
              <div style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(30, 41, 59, 0.7) 100%); border:1px solid #059669; border-radius:14px; padding:20px;">
                <div style="font-size:14px; font-weight:800; color:#10b981; margin-bottom:12px; text-transform:uppercase; letter-spacing:0.5px;">⚡ Daily Expense & Pace Intelligence</div>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="font-size:13px; color:#cbd5e1; padding-bottom:8px;">Current Daily Average Spent:</td>
                    <td style="font-size:15px; font-weight:900; color:#ffffff; text-align:right;">${fmt(dailyAverage)} / day</td>
                  </tr>
                  <tr>
                    <td style="font-size:13px; color:#cbd5e1; padding-bottom:8px;">Recommended Safe Daily Limit:</td>
                    <td style="font-size:15px; font-weight:900; color:#fbbf24; text-align:right;">${fmt(recommendedDailyCap)} / day</td>
                  </tr>
                  <tr>
                    <td style="font-size:13px; color:#cbd5e1;">Peak Expenditure Date:</td>
                    <td style="font-size:14px; font-weight:800; color:#f87171; text-align:right;">${highestSpendingDay.date} (${fmt(highestSpendingDay.amount)})</td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>

          <!-- Weekday Heatmap & Guidance -->
          <tr>
            <td style="padding: 0 24px 24px;">
              <div style="background:#1e293b; border:1px solid #334155; border-radius:14px; padding:20px;">
                <div style="font-size:14px; font-weight:800; color:#fbbf24; margin-bottom:10px; text-transform:uppercase; letter-spacing:0.5px;">📊 Peak Spending Weekday Analysis</div>
                <div style="font-size:13px; color:#e2e8f0; margin-bottom:10px;">
                  Highest expenditure day of the week: <strong>🇧🇩 ${peakWeekday.day}</strong> (Total: ${fmt(peakWeekday.amount)}).
                </div>
                <div style="font-size:12px; color:#94a3b8; line-height:1.6; background:#0f172a; padding:12px 14px; border-radius:10px; border-left:4px solid #6366f1;">
                  💡 <strong>Smart Advisory:</strong> To preserve your monthly net savings margin (${savingsRatePct.toFixed(1)}%), keep daily discretionary expenses capped at ${fmt(recommendedDailyCap)}.
                </div>
              </div>
            </td>
          </tr>

          <!-- Health Score Footer -->
          <tr>
            <td style="background-color:#0f172a; border-top:1px solid #1e293b; padding: 20px 24px; text-align: center;">
              <div style="font-size:14px; font-weight:800; color:#ffffff;">
                Financial Health Score: <span style="color:#10b981; font-weight:900;">${healthScore}/100</span> | Status: Active & Secured
              </div>
              <div style="font-size:11px; color:#64748b; margin-top:8px;">
                Delivered to <strong>${recipients.join(', ')}</strong> | Daily Schedule: 8:00 PM BST
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const textContent = `
Personal Wallet Daily Executive Digest - ${monthName}
Recipients: ${recipients.join(', ')}
Total Revenues: ${fmt(totalIncome)}
Total Spending: ${fmt(totalExpense)}
Net Balance: ${fmt(netSavings)}
Daily Average Spent: ${fmt(dailyAverage)} / day
Recommended Safe Daily Limit: ${fmt(recommendedDailyCap)} / day
Peak Expenditure Date: ${highestSpendingDay.date} (${fmt(highestSpendingDay.amount)})
Peak Weekday: ${peakWeekday.day} (${fmt(peakWeekday.amount)})
Financial Health Score: ${healthScore}/100
  `;

  // Transporter creation with Gmail TLS/SSL & error diagnostics
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // SSL
    auth: {
      user: smtpUser,
      pass: smtpPass
    },
    tls: { rejectUnauthorized: false }
  });

  try {
    if (!smtpPass) {
      // If no password provided, inform frontend clearly so user can enter Gmail App Password
      return {
        success: false,
        needAuth: true,
        message: 'Gmail App Password required to send real email to Inbox. Please provide App Password in settings or .env.local.',
        recipients
      };
    }

    const info = await transporter.sendMail({
      from: `"Personal Wallet Executive" <${smtpUser}>`,
      to: recipients,
      subject: `📊 Wallet Executive Digest: ${monthName} Daily Spending & Guidance Report`,
      text: textContent,
      html: htmlContent,
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'high'
      }
    });

    return { success: true, messageId: info.messageId, recipients };
  } catch (error: any) {
    console.error('Error sending wallet email report via Nodemailer:', error);
    return {
      success: false,
      error: error.message || 'SMTP Authentication failed',
      recipients
    };
  }
};
