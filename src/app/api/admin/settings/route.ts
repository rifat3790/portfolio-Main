import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Setting from '@/models/Setting';
import { isAuthenticated } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { clearDbCache, writeHomepageDataJson } from '@/lib/data-cache';

export const dynamic = 'force-dynamic';

// GET current settings (publicly accessible since settings are needed on client home)
export async function GET() {
  try {
    await dbConnect();
    let settings = await Setting.findOne().lean();
    if (!settings) {
      // Create default settings if none exist
      settings = await Setting.create({});
    }
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST/PUT to update settings (protected)
export async function POST(req: NextRequest) {
  try {
    if (!isAuthenticated(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const data = await req.json();
    console.log('--- Incoming Settings Data ---', Object.keys(data), 'heroBannerImage exists:', !!data.heroBannerImage);

    let settings = await Setting.findOne();
    if (settings) {
      console.log('Updating existing settings ID:', settings._id);
      settings = await Setting.findByIdAndUpdate(settings._id, { $set: data }, { new: true });
      console.log('Updated Settings Result (heroTitle):', settings?.heroTitle);
    } else {
      console.log('Creating new settings document');
      settings = await Setting.create(data);
    }

    // Force revalidation of homepage client cache
    revalidatePath('/');
    clearDbCache();
    await writeHomepageDataJson();

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
