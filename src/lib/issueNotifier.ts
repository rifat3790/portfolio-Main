import dbConnect from './db';
import ProjectIssue from '@/models/ProjectIssue';
import { sendWhatsAppNotification } from './whatsappService';

export function parseOperationNote(noteStr: string): { memberName: string; teamName: string } {
  if (!noteStr || !noteStr.trim()) {
    return { memberName: '', teamName: '' };
  }
  const clean = noteStr.trim();
  const parts = clean.split('/');
  if (parts.length >= 2) {
    const memberName = parts[0].trim();
    const teamName = parts.slice(1).join('/').trim().toUpperCase();
    return { memberName, teamName };
  }
  return { memberName: clean, teamName: '' };
}

export function getIssueKey(r: Record<string, string>): string {
  const profile = (r['Profile Name'] || '').trim().toLowerCase();
  const client = (r["Client's Name"] || '').trim().toLowerCase();
  const date = (r['Date'] || '').trim().toLowerCase();
  const notes = (r['Special Notes'] || '').trim().toLowerCase();
  const noteOp = (r['Note for Operation'] || '').trim().toLowerCase();
  const url = (r['Conversation Page URL'] || '').trim().toLowerCase();

  return `issue_${profile}_${client}_${date}_${notes}_${noteOp}_${url}`;
}

function escapeHtml(str: string): string {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export async function checkAndNotifyNewIssues(records: Record<string, string>[], forceNotify: boolean = false) {
  if (!records || records.length === 0) return { newCount: 0 };

  try {
    await dbConnect();

    const existingIssues = await ProjectIssue.find({}, { issueKey: 1 }).lean();
    const existingKeysSet = new Set(existingIssues.map(i => i.issueKey));

    const newRecordsToSave: any[] = [];
    const notificationsToSend: Record<string, string>[] = [];

    for (const r of records) {
      const issueKey = getIssueKey(r);
      const isNew = !existingKeysSet.has(issueKey);

      if (isNew) {
        newRecordsToSave.push({
          issueKey,
          clientName: r["Client's Name"] || '',
          profileName: r['Profile Name'] || '',
          conversationUrl: r['Conversation Page URL'] || '',
          specialNotes: r['Special Notes'] || '',
          team: r['Team'] || 'Shopify Team',
          status: r['Status'] || 'Open',
          noteForOperation: r['Note for Operation'] || '',
          dateStr: r['Date'] || '',
          notifiedAt: new Date()
        });
      }

      if (isNew || forceNotify) {
        notificationsToSend.push(r);
      }
    }

    if (newRecordsToSave.length > 0) {
      await ProjectIssue.insertMany(newRecordsToSave, { ordered: false }).catch(() => {});
    }

    // Send Telegram Bot notifications for new / forced issue entries!
    for (const r of notificationsToSend) {
      const noteStr = r['Note for Operation'] || '';
      const { memberName, teamName } = parseOperationNote(noteStr);

      const memberLine = memberName ? `👨‍💻 <b>Assigned Member:</b> ${escapeHtml(memberName)}\n` : '';
      const teamLine = teamName ? `🛡️ <b>Assigned Team:</b> ${escapeHtml(teamName)}\n` : '';
      const rawNoteLine = (!memberName && noteStr) ? `📝 <b>Operation Note:</b> ${escapeHtml(noteStr)}\n` : '';

      const msg = `🚨 <b>NEW SHOPIFY PROJECT ISSUE DETECTED!</b>

📅 <b>Date:</b> ${escapeHtml(r['Date'] || 'N/A')}
👤 <b>Profile Name:</b> ${escapeHtml(r['Profile Name'] || 'N/A')}
💼 <b>Client's Name:</b> ${escapeHtml(r["Client's Name"] || 'N/A')}
👥 <b>Team:</b> ${escapeHtml(r['Team'] || 'Shopify Team')}
⚠️ <b>Special Notes:</b> ${escapeHtml(r['Special Notes'] || 'N/A')}
📌 <b>Status:</b> ${escapeHtml(r['Status'] || 'Open')}
${memberLine}${teamLine}${rawNoteLine}
🔗 <b>Conversation Link:</b> ${r['Conversation Page URL'] ? `<a href="${r['Conversation Page URL']}">View Fiverr Inbox</a>` : 'N/A'}`;

      await sendWhatsAppNotification({ message: msg });
    }

    return { newCount: notificationsToSend.length };
  } catch (err) {
    console.error('Error checking and notifying new project issues:', err);
    return { newCount: 0, error: String(err) };
  }
}
