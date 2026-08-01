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

export function getIssueKey(r: Record<string, string>, index: number): string {
  const profile = (r['Profile Name'] || '').trim().toLowerCase();
  const client = (r["Client's Name"] || '').trim().toLowerCase();
  const date = (r['Date'] || '').trim().toLowerCase();
  const notes = (r['Special Notes'] || '').trim().toLowerCase();
  const noteOp = (r['Note for Operation'] || '').trim().toLowerCase();
  const url = (r['Conversation Page URL'] || '').trim().toLowerCase();

  return `row_${index}_${profile}_${client}_${date}_${notes}_${noteOp}_${url}`;
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

    records.forEach((r, idx) => {
      const issueKey = getIssueKey(r, idx);
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
    });

    if (newRecordsToSave.length > 0) {
      await ProjectIssue.insertMany(newRecordsToSave, { ordered: false }).catch(() => {});
    }

    // Issue sheet notifications are disabled per user configuration.
    // Issue records are saved to MongoDB quietly without sending Telegram push alerts.
    return { newCount: notificationsToSend.length };
  } catch (err) {
    console.error('Error checking and notifying new project issues:', err);
    return { newCount: 0, error: String(err) };
  }
}
