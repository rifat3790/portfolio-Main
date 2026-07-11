import { NextResponse } from 'next/server';
import { getHomepageData } from '@/lib/data-cache';

export async function GET() {
  try {
    const data = await getHomepageData();
    return NextResponse.json(data.blogs);
  } catch (error) {
    console.error('Error fetching public blogs:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
