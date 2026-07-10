import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Skill from '@/models/Skill';
import { isAuthenticated } from '@/lib/auth';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const data = await req.json();
    await dbConnect();
    
    const updatedSkill = await Skill.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!updatedSkill) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }

    return NextResponse.json(updatedSkill);
  } catch (error) {
    console.error('Skill PUT API error:', error);
    return NextResponse.json({ error: 'Failed to update skill' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    await dbConnect();
    
    const deletedSkill = await Skill.findByIdAndDelete(id);

    if (!deletedSkill) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    console.error('Skill DELETE API error:', error);
    return NextResponse.json({ error: 'Failed to delete skill' }, { status: 500 });
  }
}
