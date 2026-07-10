import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ContactMessage from '@/models/ContactMessage';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();

    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    const newMessage = await ContactMessage.create({
      name,
      email,
      subject,
      message,
      read: false
    });

    return NextResponse.json({ success: true, message: 'Message sent successfully.' }, { status: 201 });
  } catch (error) {
    console.error('Contact POST error:', error);
    return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 });
  }
}
