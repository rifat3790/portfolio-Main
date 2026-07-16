import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Experience from '@/models/Experience';
import { isAuthenticated } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { clearDbCache, writeHomepageDataJson } from '@/lib/data-cache';

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
    
    const updatedExperience = await Experience.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!updatedExperience) {
      return NextResponse.json({ error: 'Experience not found' }, { status: 404 });
    }

    revalidatePath('/');
    clearDbCache();
    await writeHomepageDataJson();

    return NextResponse.json(updatedExperience);
  } catch (error) {
    console.error('Experience PUT API error:', error);
    return NextResponse.json({ error: 'Failed to update experience' }, { status: 500 });
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
    
    const deletedExperience = await Experience.findByIdAndDelete(id);

    if (!deletedExperience) {
      return NextResponse.json({ error: 'Experience not found' }, { status: 404 });
    }

    revalidatePath('/');
    clearDbCache();
    await writeHomepageDataJson();

    return NextResponse.json({ message: 'Experience deleted successfully' });
  } catch (error) {
    console.error('Experience DELETE API error:', error);
    return NextResponse.json({ error: 'Failed to delete experience' }, { status: 500 });
  }
}
