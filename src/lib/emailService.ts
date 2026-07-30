import nodemailer from 'nodemailer';
import { sendWhatsAppNotification } from './whatsappService';

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

const DEFAULT_ADMIN_RECIPIENTS = ['mdrifayethossen@gmail.com', 'rifayet.cse@gmail.com'];
const TARGET_WHATSAPP_PHONE = '8801952321390';

const createTransporter = (customUser?: string, customPass?: string) => {
  const user = customUser || process.env.SMTP_USER || process.env.GMAIL_USER || 'rifayet.cse@gmail.com';
  const pass = customPass || process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD || 'flovlnotljzuizfw';

  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // SSL
    auth: { user, pass },
    tls: { rejectUnauthorized: false }
  });
};

// 1. Executive Daily Wallet Report (Email + WhatsApp)
export const sendWalletDailyEmailReport = async (data: IEmailReportData) => {
  const recipients = data.recipientEmail
    ? (Array.isArray(data.recipientEmail) ? data.recipientEmail : [data.recipientEmail])
    : DEFAULT_ADMIN_RECIPIENTS;

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
    smtpUser,
    smtpPass
  } = data;

  const fmt = (num: number) => `৳${Math.round(num).toLocaleString('en-US')}`;

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Personal Wallet Executive Digest</title>
</head>
<body style="margin:0; padding:0; background-color:#0b0f19; font-family:'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color:#f8fafc;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#0b0f19; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:600px; background-color:#151c2c; border:1px solid #2d3748; border-radius:16px; overflow:hidden; box-shadow:0 25px 60px rgba(0,0,0,0.6);">
          <tr>
            <td style="background: linear-gradient(135deg, #6366f1 0%, #06b6d4 100%); padding: 32px 28px; text-align: left;">
              <div style="font-size:11px; font-weight:800; text-transform:uppercase; letter-spacing:1.5px; color:#e0e7ff;">Executive Briefing Dispatch</div>
              <h1 style="margin: 8px 0 0; font-size:26px; font-weight:900; color:#ffffff;">🏛️ Personal Wallet Executive Digest</h1>
              <div style="font-size:13px; color:#c7d2fe; margin-top:6px;">Period: <strong>${monthName}</strong> | Daily Schedule: <strong>8:00 PM BST</strong></div>
            </td>
          </tr>
          <tr>
            <td style="padding: 28px 24px 20px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td width="32%" style="background:#1a233a; border:1px solid #2e3a59; border-radius:12px; padding:16px 10px; text-align:center;">
                    <div style="font-size:10px; color:#94a3b8; text-transform:uppercase; font-weight:800;">Total Revenues</div>
                    <div style="font-size:18px; font-weight:900; color:#34d399; margin-top:6px;">${fmt(totalIncome)}</div>
                  </td>
                  <td width="2%"></td>
                  <td width="32%" style="background:#1a233a; border:1px solid #2e3a59; border-radius:12px; padding:16px 10px; text-align:center;">
                    <div style="font-size:10px; color:#94a3b8; text-transform:uppercase; font-weight:800;">Total Spending</div>
                    <div style="font-size:18px; font-weight:900; color:#f87171; margin-top:6px;">${fmt(totalExpense)}</div>
                  </td>
                  <td width="2%"></td>
                  <td width="32%" style="background:#1a233a; border:1px solid #2e3a59; border-radius:12px; padding:16px 10px; text-align:center;">
                    <div style="font-size:10px; color:#94a3b8; text-transform:uppercase; font-weight:800;">Net Balance</div>
                    <div style="font-size:18px; font-weight:900; color:#818cf8; margin-top:6px;">${fmt(netSavings)}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 24px 20px;">
              <div style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(30, 41, 59, 0.7) 100%); border:1px solid #059669; border-radius:14px; padding:20px;">
                <div style="font-size:14px; font-weight:800; color:#10b981; margin-bottom:12px; text-transform:uppercase;">⚡ Daily Expense & Pace Intelligence</div>
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
          <tr>
            <td style="padding: 0 24px 24px;">
              <div style="background:#1e293b; border:1px solid #334155; border-radius:14px; padding:20px;">
                <div style="font-size:14px; font-weight:800; color:#fbbf24; margin-bottom:10px; text-transform:uppercase;">📊 Peak Spending Weekday Analysis</div>
                <div style="font-size:13px; color:#e2e8f0; margin-bottom:10px;">
                  Highest expenditure day of the week: <strong>🇧🇩 ${peakWeekday.day}</strong> (Total: ${fmt(peakWeekday.amount)}).
                </div>
                <div style="font-size:12px; color:#94a3b8; line-height:1.6; background:#0f172a; padding:12px 14px; border-radius:10px; border-left:4px solid #6366f1;">
                  💡 <strong>Smart Advisory:</strong> Keep daily discretionary expenses capped at ${fmt(recommendedDailyCap)} to protect net savings (${savingsRatePct.toFixed(1)}%).
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color:#0f172a; border-top:1px solid #1e293b; padding: 20px 24px; text-align: center;">
              <div style="font-size:14px; font-weight:800; color:#ffffff;">
                Financial Health Score: <span style="color:#10b981; font-weight:900;">${healthScore}/100</span> | Status: Active
              </div>
              <div style="font-size:11px; color:#64748b; margin-top:8px;">
                Delivered to <strong>${recipients.join(', ')}</strong> & WhatsApp <strong>+${TARGET_WHATSAPP_PHONE}</strong>
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

  // Trigger WhatsApp Summary Message simultaneously
  sendWhatsAppNotification({
    phone: TARGET_WHATSAPP_PHONE,
    message: `📊 *Personal Wallet Executive Digest*\nPeriod: ${monthName}\n💰 Total Revenues: ${fmt(totalIncome)}\n💸 Total Spending: ${fmt(totalExpense)}\n🏦 Net Balance: ${fmt(netSavings)}\n⚡ Daily Average: ${fmt(dailyAverage)}/day\n🎯 Recommended Cap: ${fmt(recommendedDailyCap)}/day\n🔥 Peak Spending Date: ${highestSpendingDay.date} (${fmt(highestSpendingDay.amount)})\n📊 Peak Weekday: ${peakWeekday.day}\n🛡️ Health Rating: ${healthScore}/100`
  }).catch(err => console.error('WhatsApp daily digest error:', err));

  try {
    const transporter = createTransporter(smtpUser, smtpPass);
    const info = await transporter.sendMail({
      from: `"Personal Wallet Executive" <${smtpUser || 'rifayet.cse@gmail.com'}>`,
      to: recipients,
      subject: `📊 Wallet Executive Digest: ${monthName} Daily Report`,
      html: htmlContent
    });
    return { success: true, messageId: info.messageId, recipients };
  } catch (error: any) {
    console.error('Error sending wallet email report:', error);
    return { success: false, error: error.message || 'Failed to send report', recipients };
  }
};

// 2. Real-Time Alert for New Expense or New Loan (Email + WhatsApp)
export const sendWalletTransactionAlert = async (data: {
  type: 'expense' | 'loan';
  description: string;
  amount: number;
  category?: string;
  date?: string;
  monthName?: string;
}) => {
  const { type, description, amount, category = 'General', date = new Date().toISOString().split('T')[0], monthName = 'Current Month' } = data;
  const isExp = type === 'expense';
  const title = isExp ? '💸 New Expense Recorded' : '🤝 New Loan Logged';
  const color = isExp ? '#ef4444' : '#f59e0b';

  const html = `
    <div style="background:#0b0f19; padding:24px; font-family:sans-serif; color:#f8fafc;">
      <div style="max-width:550px; margin:0 auto; background:#151c2c; border:1px solid #2d3748; border-radius:14px; padding:24px;">
        <div style="font-size:12px; font-weight:800; color:${color}; text-transform:uppercase; letter-spacing:1px;">Personal Wallet Real-Time Alert</div>
        <h2 style="margin:6px 0 16px; font-size:20px; color:#ffffff;">${title}</h2>
        <div style="background:#1e293b; border:1px solid #334155; border-radius:10px; padding:16px; margin-bottom:16px;">
          <table width="100%" style="font-size:14px; color:#e2e8f0;">
            <tr><td style="padding:4px 0; color:#94a3b8;">Description / Item:</td><td style="font-weight:700; text-align:right;">${description}</td></tr>
            <tr><td style="padding:4px 0; color:#94a3b8;">Amount:</td><td style="font-size:18px; font-weight:900; color:${color}; text-align:right;">৳${amount.toLocaleString()}</td></tr>
            <tr><td style="padding:4px 0; color:#94a3b8;">Category / Tag:</td><td style="font-weight:700; text-align:right;">${category}</td></tr>
            <tr><td style="padding:4px 0; color:#94a3b8;">Date & Period:</td><td style="font-weight:600; text-align:right;">${date} (${monthName})</td></tr>
          </table>
        </div>
        <div style="font-size:11px; color:#64748b; text-align:center;">Delivered via Email & WhatsApp (+8801952321390).</div>
      </div>
    </div>
  `;

  // Trigger WhatsApp Alert simultaneously
  sendWhatsAppNotification({
    phone: TARGET_WHATSAPP_PHONE,
    message: `${isExp ? '💸' : '🤝'} *Wallet Real-Time Alert*\n*${title}*\n• Description: ${description}\n• Amount: ৳${amount.toLocaleString()}\n• Category: ${category}\n• Date: ${date} (${monthName})`
  }).catch(err => console.error('WhatsApp transaction alert error:', err));

  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"Wallet Alert" <rifayet.cse@gmail.com>`,
      to: DEFAULT_ADMIN_RECIPIENTS,
      subject: `${isExp ? '💸' : '🤝'} Wallet Alert: ${description} (৳${amount.toLocaleString()})`,
      html
    });
    return { success: true };
  } catch (error) {
    console.error('Wallet alert mail error:', error);
    return { success: false };
  }
};

// 3. Real-Time Alert for Live Chat Message from Visitor (Email + WhatsApp)
export const sendLiveChatNotificationEmail = async (data: {
  sessionId: string;
  senderName?: string;
  senderEmail?: string;
  messageText: string;
}) => {
  const { sessionId, senderName = 'Website Visitor', senderEmail = 'Not provided', messageText } = data;

  const html = `
    <div style="background:#0b0f19; padding:24px; font-family:sans-serif; color:#f8fafc;">
      <div style="max-width:550px; margin:0 auto; background:#151c2c; border:1px solid #2d3748; border-radius:14px; padding:24px;">
        <div style="font-size:12px; font-weight:800; color:#3b82f6; text-transform:uppercase; letter-spacing:1px;">💬 Portfolio Live Chat Alert</div>
        <h2 style="margin:6px 0 16px; font-size:20px; color:#ffffff;">New Live Chat Message</h2>
        <div style="background:#1e293b; border:1px solid #334155; border-radius:10px; padding:16px; margin-bottom:16px;">
          <p style="margin:0 0 8px; font-size:13px; color:#94a3b8;"><strong>Visitor Name:</strong> ${senderName}</p>
          <p style="margin:0 0 8px; font-size:13px; color:#94a3b8;"><strong>Visitor Email:</strong> ${senderEmail}</p>
          <p style="margin:0 0 12px; font-size:13px; color:#94a3b8;"><strong>Session ID:</strong> ${sessionId}</p>
          <div style="background:#0f172a; border-left:4px solid #3b82f6; padding:12px; border-radius:6px; font-size:14px; color:#f1f5f9; line-height:1.5;">
            "${messageText}"
          </div>
        </div>
        <div style="font-size:11px; color:#64748b; text-align:center;">Delivered via Email & WhatsApp (+8801952321390).</div>
      </div>
    </div>
  `;

  // Trigger WhatsApp Live Chat Alert simultaneously
  sendWhatsAppNotification({
    phone: TARGET_WHATSAPP_PHONE,
    message: `💬 *Portfolio Live Chat Alert*\nNew message from *${senderName}* (${senderEmail})\n\n"${messageText}"\n\nSession: ${sessionId}`
  }).catch(err => console.error('WhatsApp chat error:', err));

  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"Portfolio Live Chat" <rifayet.cse@gmail.com>`,
      to: DEFAULT_ADMIN_RECIPIENTS,
      subject: `💬 New Live Chat Message from ${senderName}`,
      html
    });
    return { success: true };
  } catch (error) {
    console.error('Live chat notification mail error:', error);
    return { success: false };
  }
};

// 4. Real-Time Alert for Contact Form Submission (Email + WhatsApp)
export const sendContactFormNotificationEmail = async (data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) => {
  const { name, email, subject, message } = data;

  const html = `
    <div style="background:#0b0f19; padding:24px; font-family:sans-serif; color:#f8fafc;">
      <div style="max-width:550px; margin:0 auto; background:#151c2c; border:1px solid #2d3748; border-radius:14px; padding:24px;">
        <div style="font-size:12px; font-weight:800; color:#10b981; text-transform:uppercase; letter-spacing:1px;">📬 Portfolio Contact Form Alert</div>
        <h2 style="margin:6px 0 16px; font-size:20px; color:#ffffff;">New Inquiry Received</h2>
        <div style="background:#1e293b; border:1px solid #334155; border-radius:10px; padding:16px; margin-bottom:16px;">
          <p style="margin:0 0 6px; font-size:13px; color:#94a3b8;"><strong>Name:</strong> ${name}</p>
          <p style="margin:0 0 6px; font-size:13px; color:#94a3b8;"><strong>Email:</strong> ${email}</p>
          <p style="margin:0 0 12px; font-size:13px; color:#94a3b8;"><strong>Subject:</strong> ${subject}</p>
          <div style="background:#0f172a; border-left:4px solid #10b981; padding:12px; border-radius:6px; font-size:14px; color:#f1f5f9; line-height:1.5;">
            ${message}
          </div>
        </div>
        <div style="font-size:11px; color:#64748b; text-align:center;">Delivered via Email & WhatsApp (+8801952321390).</div>
      </div>
    </div>
  `;

  // Trigger WhatsApp Contact Form Alert simultaneously
  sendWhatsAppNotification({
    phone: TARGET_WHATSAPP_PHONE,
    message: `📬 *New Portfolio Contact Inquiry*\n• Sender: *${name}*\n• Email: ${email}\n• Subject: ${subject}\n\n"${message}"`
  }).catch(err => console.error('WhatsApp contact form error:', err));

  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"Portfolio Contact Form" <rifayet.cse@gmail.com>`,
      to: DEFAULT_ADMIN_RECIPIENTS,
      subject: `📬 Contact Inquiry: ${subject} (from ${name})`,
      html
    });
    return { success: true };
  } catch (error) {
    console.error('Contact form alert mail error:', error);
    return { success: false };
  }
};

// 5. Professional Auto-Responder Email back to Visitor
export const sendContactFormAutoResponderEmail = async (data: {
  name: string;
  email: string;
  subject: string;
}) => {
  const { name, email, subject } = data;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Thank You for Contacting Rifayet Hossen</title>
</head>
<body style="margin:0; padding:0; background-color:#090d16; font-family:'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color:#f8fafc;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#090d16; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:580px; background-color:#131a2a; border:1px solid #28334e; border-radius:16px; overflow:hidden; box-shadow:0 20px 50px rgba(0,0,0,0.5);">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%); padding: 30px 24px; text-align: left;">
              <div style="font-size:11px; font-weight:800; text-transform:uppercase; letter-spacing:1.5px; color:#e0e7ff;">Confirmation Receipt</div>
              <h1 style="margin: 6px 0 0; font-size:24px; font-weight:900; color:#ffffff;">✨ Thank You for Reaching Out!</h1>
              <div style="font-size:13px; color:#c7d2fe; margin-top:4px;">Rifayet Hossen | Full-Stack & AI Software Engineer</div>
            </td>
          </tr>

          <!-- Main Body Content -->
          <tr>
            <td style="padding: 28px 24px;">
              <div style="font-size:15px; color:#e2e8f0; line-height:1.6; margin-bottom:18px;">
                Dear <strong>${name}</strong>,
              </div>
              <div style="font-size:14px; color:#cbd5e1; line-height:1.7; margin-bottom:20px;">
                Thank you for getting in touch through my personal portfolio! I have successfully received your inquiry regarding <strong>"${subject}"</strong>.
              </div>
              
              <div style="background: linear-gradient(135deg, rgba(79, 70, 229, 0.12) 0%, rgba(30, 41, 59, 0.6) 100%); border:1px solid rgba(99, 102, 241, 0.3); border-radius:12px; padding:18px; margin-bottom:24px;">
                <div style="font-size:13px; font-weight:700; color:#818cf8; margin-bottom:6px; text-transform:uppercase;">⚡ Next Steps & Response Guarantee</div>
                <div style="font-size:13px; color:#e2e8f0; line-height:1.6;">
                  I personally review every inquiry. You can expect a detailed reply sent directly to <strong>${email}</strong> within <strong>2 to 4 hours</strong>.
                </div>
              </div>

              <div style="border-top:1px solid #232d44; padding-top:20px; margin-top:20px;">
                <div style="font-size:14px; font-weight:800; color:#ffffff;">Best Regards,</div>
                <div style="font-size:15px; font-weight:900; color:#38bdf8; margin-top:4px;">Md. Rifayet Hossen</div>
                <div style="font-size:12px; color:#94a3b8; margin-top:2px;">Full-Stack Engineer & AI Applications Specialist</div>
                <div style="font-size:12px; color:#64748b; margin-top:2px;">📧 rifayet.cse@gmail.com | 📱 WhatsApp: +8801952321390 | 🌐 <a href="https://rifayethossen.com" style="color:#818cf8; text-decoration:none;">rifayethossen.com</a></div>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#0b0f19; border-top:1px solid #1e293b; padding: 16px 24px; text-align: center;">
              <div style="font-size:11px; color:#64748b;">
                This is an automated confirmation from Md. Rifayet Hossen's Portfolio Platform.
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

  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"Md. Rifayet Hossen" <rifayet.cse@gmail.com>`,
      to: email,
      subject: `✨ Thank you for contacting Md. Rifayet Hossen [Ref: ${subject}]`,
      html
    });
    return { success: true };
  } catch (error) {
    console.error('Contact form auto-responder mail error:', error);
    return { success: false };
  }
};
