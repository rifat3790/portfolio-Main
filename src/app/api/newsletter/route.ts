import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Subscriber from '@/models/Subscriber';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }

    // Check if email already subscribed
    const existing = await Subscriber.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ success: false, message: 'Already subscribed.' }, { status: 409 });
    }

    await Subscriber.create({ email: email.toLowerCase() });

    return NextResponse.json({ success: true, message: 'Subscribed successfully.' }, { status: 201 });
  } catch (error) {
    console.error('Newsletter POST error:', error);
    return NextResponse.json({ error: 'Failed to subscribe.' }, { status: 500 });
  }
}
