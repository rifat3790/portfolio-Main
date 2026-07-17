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

    const sheetUrl = 'https://docs.google.com/spreadsheets/d/1IRIDbowvg0qM9wqNMxegwqz4jNGl6bj9UThL0NjYScQ/export?format=csv&gid=453782671';
    const response = await fetch(sheetUrl, {
      next: { revalidate: 300 } // cache for 5 minutes
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch Google Sheet' }, { status: 502 });
    }

    const csvText = await response.text();
    const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
    
    const parsedRows = lines.map(line => parseCSVLine(line));
    const headerIndex = parsedRows.findIndex(row => row.some(cell => cell.toLowerCase().includes('order id')));
    
    if (headerIndex === -1) {
      return NextResponse.json({ error: 'Invalid Google Sheet headers format' }, { status: 400 });
    }

    const headers = parsedRows[headerIndex].map(h => h.trim());
    const dataRows = parsedRows.slice(headerIndex + 1).filter(row => {
      const orderIdIdx = headers.findIndex(h => h.toLowerCase() === 'order id');
      return row.length > 0 && orderIdIdx !== -1 && row[orderIdIdx]?.trim() !== '';
    });

    const records = dataRows.map(row => {
      const record: Record<string, string> = {};
      headers.forEach((header, index) => {
        if (header) {
          record[header] = row[index] || '';
        }
      });
      return record;
    });

    return NextResponse.json({ records });
  } catch (error) {
    console.error('Error fetching/parsing team data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
