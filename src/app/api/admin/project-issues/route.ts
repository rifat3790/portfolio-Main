import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { checkAndNotifyNewIssues } from '@/lib/issueNotifier';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

export function parseShopifyIssueRow(row: string[]): Record<string, string> {
  const urlIdx = row.findIndex(c => c.startsWith('http://') || c.startsWith('https://') || c.includes('fiverr.com'));
  
  let date = '';
  let conversationUrl = '';
  let clientName = '';
  let team = 'Shopify Team';
  let specialNotes = '';
  let status = 'Open';
  let profileName = '';
  let noteForOperation = '';

  if (urlIdx !== -1) {
    conversationUrl = row[urlIdx].trim();
    date = row.slice(0, urlIdx).filter(Boolean).join(', ').trim();
    const remaining = row.slice(urlIdx + 1).map(c => c.trim()).filter(Boolean);

    if (remaining.length > 0) clientName = remaining[0];
    if (remaining.length > 1) team = remaining[1];
    if (remaining.length > 2) specialNotes = remaining[2];
    if (remaining.length > 3) status = remaining[3];
    if (remaining.length > 4) profileName = remaining[4];

    const slashIdx = remaining.findIndex((c, i) => i >= 4 && c.includes('/'));
    if (slashIdx !== -1) {
      noteForOperation = remaining[slashIdx];
    } else if (remaining.length >= 6) {
      noteForOperation = remaining[5];
    }
  } else {
    date = (row[0] || '').trim();
    conversationUrl = (row[1] || '').trim();
    clientName = (row[2] || '').trim();
    team = (row[3] || 'Shopify Team').trim();
    specialNotes = (row[4] || '').trim();
    status = (row[5] || 'Open').trim();
    profileName = (row[6] || '').trim();
    noteForOperation = (row[7] || row[8] || '').trim();
  }

  return {
    'Date': date,
    'Conversation Page URL': conversationUrl,
    "Client's Name": clientName,
    'Team': team,
    'Special Notes': specialNotes,
    'Status': status,
    'Profile Name': profileName,
    'Note for Operation': noteForOperation,
    'Operation Note': noteForOperation,
    'Employee Name': noteForOperation
  };
}

export async function GET(req: NextRequest) {
  try {
    if (!isAuthenticated(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const notifyAll = searchParams.get('notifyAll') === 'true' || searchParams.get('test') === 'true';

    const sheetUrl = `https://docs.google.com/spreadsheets/d/1ic9UMVX0FFsAyz0TZ-_lGKj_D9NornoGhq38KTRtM54/export?format=csv&gid=1412843338&t=${Date.now()}`;
    
    const response = await fetch(sheetUrl, {
      cache: 'no-store'
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch Google Sheet' }, { status: 502 });
    }

    const csvText = await response.text();
    const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
    
    if (lines.length === 0) {
      return NextResponse.json({ records: [] });
    }

    const parsedRows = lines.map(line => parseCSVLine(line));

    const headerIndex = parsedRows.findIndex(row => 
      row.some(cell => 
        cell.toLowerCase().includes('client') || 
        cell.toLowerCase().includes('conversation') ||
        cell.toLowerCase().includes('special notes')
      )
    );
    
    if (headerIndex === -1) {
      return NextResponse.json({ error: 'Invalid Google Sheet headers format' }, { status: 400 });
    }

    const dataRows = parsedRows.slice(headerIndex + 1).filter(row => {
      return row.some(cell => cell.trim().length > 0);
    });

    const records = dataRows
      .map(row => parseShopifyIssueRow(row))
      .filter(record => 
        record["Client's Name"] !== '' || 
        record["Conversation Page URL"] !== '' || 
        record["Profile Name"] !== ''
      );

    // Check for new issue entries and trigger bot notifications
    checkAndNotifyNewIssues(records, notifyAll).catch(err => {
      console.error('Background issue notification check error:', err);
    });

    return NextResponse.json({ records });
  } catch (error) {
    console.error('Error fetching/parsing project issues data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
