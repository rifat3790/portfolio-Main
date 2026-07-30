import dbConnect from './db';
import ProjectIssue from '@/models/ProjectIssue';
import { sendWhatsAppNotification } from './whatsappService';

export function getIssueKey(r: Record<string, string>): string {
  const profile = (r['Profile Name'] || '').trim().toLowerCase();
  const client = (r["Client's Name"] || '').trim().toLowerCase();
  const date = (r['Date'] || '').trim().toLowerCase();
  const notes = (r['Special Notes'] || '').trim().toLowerCase();
  const url = (r['Conversation Page URL'] || '').trim().toLowerCase();

  if (url) {
    return `url_${url}`;
  }
  return `key_${profile}_${client}_${date}_${notes}`;
}

export async function checkAndNotifyNewIssues(records: Record<string, string>[]) {
  if (!records || records.length === 0) return { newCount: 0 };

  try {
    await dbConnect();

    const existingIssues = await ProjectIssue.find({}, { issueKey: 1 }).lean();
    const existingKeysSet = new Set(existingIssues.map(i => i.issueKey));

    const isFirstRun = existingKeysSet.size === 0;
    const newRecordsToSave: any[] = [];
    const notificationsToSend: Record<string, string>[] = [];

    for (const r of records) {
      const issueKey = getIssueKey(r);
      if (!existingKeysSet.has(issueKey)) {
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

        // Queue notification if not initial seed run
        if (!isFirstRun) {
          notificationsToSend.push(r);
        }
      }
    }

    if (newRecordsToSave.length > 0) {
      await ProjectIssue.insertMany(newRecordsToSave, { ordered: false }).catch(() => {});
    }

    // Send instant Telegram Push notification for each new issue entry!
    for (const r of notificationsToSend) {
      const msg = `🚨 *NEW SHOPIFY PROJECT ISSUE DETECTED!*

📅 *Date:* ${r['Date'] || 'N/A'}
👤 *Profile Name:* ${r['Profile Name'] || 'N/A'}
💼 *Client's Name:* ${r["Client's Name"] || 'N/A'}
👥 *Team:* ${r['Team'] || 'Shopify Team'}
📝 *Special Notes:* ${r['Special Notes'] || 'N/A'}
📌 *Status:* ${r['Status'] || 'Open'}
👨‍💻 *Operation Note:* ${r['Note for Operation'] || 'N/A'}

🔗 *Conversation Link:* ${r['Conversation Page URL'] || 'N/A'}`;

      await sendWhatsAppNotification({ message: msg });
    }

    return { newCount: notificationsToSend.length };
  } catch (err) {
    console.error('Error checking and notifying new project issues:', err);
    return { newCount: 0, error: String(err) };
  }
}
