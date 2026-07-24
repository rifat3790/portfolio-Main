import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import WalletMonth from '@/models/WalletMonth';
import { isAuthenticated } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    if (!isAuthenticated(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    // Sort months chronologically by their name format (e.g., "2026-01" or "January 2026")
    const months = await WalletMonth.find({}).sort({ monthName: 1 }).lean();
    return NextResponse.json(months);
  } catch (error) {
    console.error('Error fetching wallet months:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!isAuthenticated(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const data = await req.json();

    if (!data.monthName) {
      return NextResponse.json({ error: 'Missing required field: monthName' }, { status: 400 });
    }

    // Check month uniqueness
    const existing = await WalletMonth.findOne({ monthName: data.monthName });
    if (existing) {
      return NextResponse.json({ error: 'This month sheet already exists.' }, { status: 400 });
    }

    const newMonth = await WalletMonth.create({
      monthName: data.monthName,
      salary: Number(data.salary) || 0,
      addon: Number(data.addon) || 0,
      bonus: Number(data.bonus) || 0,
      expenses: data.expenses || [],
      incomes: data.incomes || [],
      loans: data.loans || [],
    });

    return NextResponse.json(newMonth);
  } catch (error) {
    console.error('Error creating wallet month:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
