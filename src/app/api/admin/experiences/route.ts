import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Experience from '@/models/Experience';
import { isAuthenticated } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { clearDbCache, writeHomepageDataJson } from '@/lib/data-cache';

// GET all experiences (Admin view, sorted by order)
export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const experiences = await Experience.find({}).sort({ order: 1, createdAt: -1 });
    return NextResponse.json(experiences);
  } catch (error) {
    console.error('Experiences GET API error:', error);
    return NextResponse.json({ error: 'Failed to fetch experiences' }, { status: 500 });
  }
}

// POST create experience
export async function POST(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await req.json();
    await dbConnect();
    const newExperience = await Experience.create(data);
    revalidatePath('/');
    clearDbCache();
    await writeHomepageDataJson();
    return NextResponse.json(newExperience, { status: 201 });
  } catch (error) {
    console.error('Experiences POST API error:', error);
    return NextResponse.json({ error: 'Failed to create experience' }, { status: 500 });
  }
}
