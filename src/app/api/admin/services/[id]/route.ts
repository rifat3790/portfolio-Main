import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Service from '@/models/Service';
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
    
    const updatedService = await Service.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!updatedService) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    revalidatePath('/');
    clearDbCache();
    await writeHomepageDataJson();

    return NextResponse.json(updatedService);
  } catch (error) {
    console.error('Service PUT API error:', error);
    return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
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
    
    const deletedService = await Service.findByIdAndDelete(id);

    if (!deletedService) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    revalidatePath('/');
    clearDbCache();
    await writeHomepageDataJson();

    return NextResponse.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Service DELETE API error:', error);
    return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
  }
}
