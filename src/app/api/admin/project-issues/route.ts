import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';

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
    if (!isAuthenticated(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Google Sheet link (Shopify tab): https://docs.google.com/spreadsheets/d/1ic9UMVX0FFsAyz0TZ-_lGKj_D9NornoGhq38KTRtM54/edit?gid=1412843338
    const sheetUrl = 'https://docs.google.com/spreadsheets/d/1ic9UMVX0FFsAyz0TZ-_lGKj_D9NornoGhq38KTRtM54/export?format=csv&gid=1412843338';
    
    const response = await fetch(sheetUrl, {
      cache: 'no-store' // Fetch fresh data on every request
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

    // Find header index (contains 'client's name' or 'conversation page url' or 'special notes')
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

    const rawHeaders = parsedRows[headerIndex];
    // Standardize headers
    const headers = rawHeaders.map(h => h.trim());

    const dataRows = parsedRows.slice(headerIndex + 1).filter(row => {
      // Must have at least one non-empty meaningful field
      return row.some(cell => cell.trim().length > 0);
    });

    const records = dataRows.map(row => {
      const record: Record<string, string> = {};
      headers.forEach((header, index) => {
        if (header) {
          record[header] = row[index] || '';
        }
      });
      return record;
    }).filter(record => {
      // Filter out completely blank records where neither Client's Name nor Special Notes nor URL exists
      return (
        (record["Client's Name"] && record["Client's Name"].trim() !== '') ||
        (record["Conversation Page URL"] && record["Conversation Page URL"].trim() !== '') ||
        (record["Special Notes"] && record["Special Notes"].trim() !== '') ||
        (record["Profile Name"] && record["Profile Name"].trim() !== '')
      );
    });

    return NextResponse.json({ records });
  } catch (error) {
    console.error('Error fetching/parsing project issues data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
