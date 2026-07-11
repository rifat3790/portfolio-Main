import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Skill from '@/models/Skill';
import { isAuthenticated } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { clearDbCache } from '@/lib/data-cache';

// GET all skills (Admin view, sorted by order)
export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const skills = await Skill.find({}).sort({ order: 1, createdAt: -1 });
    return NextResponse.json(skills);
  } catch (error) {
    console.error('Skills GET API error:', error);
    return NextResponse.json({ error: 'Failed to fetch skills' }, { status: 500 });
  }
}

// POST create skill
export async function POST(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await req.json();
    await dbConnect();
    const newSkill = await Skill.create(data);
    revalidatePath('/');
    clearDbCache();
    return NextResponse.json(newSkill, { status: 201 });
  } catch (error) {
    console.error('Skills POST API error:', error);
    return NextResponse.json({ error: 'Failed to create skill' }, { status: 500 });
  }
}
