import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Service from '@/models/Service';
import { isAuthenticated } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { clearDbCache, writeHomepageDataJson } from '@/lib/data-cache';

// GET all services (Admin view, sorted by order)
export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const services = await Service.find({}).sort({ order: 1, createdAt: -1 }).lean();
    return NextResponse.json(services);
  } catch (error) {
    console.error('Services GET API error:', error);
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}

// POST create service
export async function POST(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await req.json();
    await dbConnect();
    const newService = await Service.create(data);
    revalidatePath('/');
    clearDbCache();
    await writeHomepageDataJson();
    return NextResponse.json(newService, { status: 201 });
  } catch (error) {
    console.error('Services POST API error:', error);
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
  }
}
