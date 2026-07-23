import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import WalletMonth from '@/models/WalletMonth';
import { isAuthenticated } from '@/lib/auth';

type Params = Promise<{ id: string }>;

export async function PUT(req: NextRequest, segmentData: { params: Params }) {
  try {
    if (!isAuthenticated(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await segmentData.params;
    await dbConnect();
    const data = await req.json();

    const existing = await WalletMonth.findById(id);
    if (!existing) {
      return NextResponse.json({ error: 'Month sheet not found' }, { status: 404 });
    }

    if (data.monthName !== undefined) existing.monthName = data.monthName;
    if (data.salary !== undefined) existing.salary = Number(data.salary);
    if (data.addon !== undefined) existing.addon = Number(data.addon);
    if (data.bonus !== undefined) existing.bonus = Number(data.bonus);
    if (data.expenses !== undefined) existing.expenses = data.expenses;
    if (data.incomes !== undefined) existing.incomes = data.incomes;
    if (data.loans !== undefined) existing.loans = data.loans;

    await existing.save();
    return NextResponse.json(existing);
  } catch (error) {
    console.error('Error updating wallet month:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, segmentData: { params: Params }) {
  try {
    if (!isAuthenticated(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await segmentData.params;
    await dbConnect();

    const deleted = await WalletMonth.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Month sheet not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Month sheet deleted successfully' });
  } catch (error) {
    console.error('Error deleting wallet month:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
