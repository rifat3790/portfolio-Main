import { NextRequest, NextResponse } from 'next/server';
import { checkAndNotifyNewIssues } from '@/lib/issueNotifier';

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

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const notifyAll = searchParams.get('notifyAll') === 'true' || searchParams.get('test') === 'true';

    const sheetUrl = 'https://docs.google.com/spreadsheets/d/1ic9UMVX0FFsAyz0TZ-_lGKj_D9NornoGhq38KTRtM54/export?format=csv&gid=1412843338';
    
    const response = await fetch(sheetUrl, {
      cache: 'no-store'
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch Google Sheet' }, { status: 502 });
    }

    const csvText = await response.text();
    const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
    
    if (lines.length === 0) {
      return NextResponse.json({ success: true, newCount: 0 });
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

    const records = dataRows.map(row => {
      const date = (row[0] || '').trim();
      const conversationUrl = (row[1] || '').trim();
      const clientName = (row[2] || '').trim();
      const team = (row[3] || 'Shopify Team').trim();
      const specialNotes = (row[4] || '').trim();
      const status = (row[5] || 'Open').trim();
      const profileName = (row[6] || '').trim();
      
      let noteForOperation = '';
      for (let i = 7; i < row.length; i++) {
        if (row[i] && row[i].trim().length > 0) {
          noteForOperation = row[i].trim();
          break;
        }
      }

      return {
        'Date': date,
        'Conversation Page URL': conversationUrl,
        "Client's Name": clientName,
        'Team': team,
        'Special Notes': specialNotes,
        'Status': status,
        'Profile Name': profileName,
        'Note for Operation': noteForOperation
      };
    }).filter(record => {
      return (
        record["Client's Name"] !== '' ||
        record["Conversation Page URL"] !== '' ||
        record["Special Notes"] !== '' ||
        record["Profile Name"] !== ''
      );
    });

    const result = await checkAndNotifyNewIssues(records, notifyAll);

    return NextResponse.json({ success: true, newCount: result.newCount });
  } catch (error) {
    console.error('Error in cron check-issues:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
