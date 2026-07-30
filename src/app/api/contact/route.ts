import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ContactMessage from '@/models/ContactMessage';
import { sendContactFormNotificationEmail, sendContactFormAutoResponderEmail } from '@/lib/emailService';

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

    // 📩 Await Real-Time Notification to Admin & Professional Auto-Responder to Visitor for Vercel serverless lambda execution
    await Promise.allSettled([
      sendContactFormNotificationEmail({ name, email, subject, message }),
      sendContactFormAutoResponderEmail({ name, email, subject })
    ]);

    return NextResponse.json({ success: true, message: 'Message sent successfully.' }, { status: 201 });
  } catch (error) {
    console.error('Contact POST error:', error);
    return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 });
  }
}
