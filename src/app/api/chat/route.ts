import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Message, ChatSession } from '@/models/Chat';
import { isAuthenticated } from '@/lib/auth';

// GET messages for a session, or GET all chat sessions (if admin)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('sessionId');
  const isAdminRequest = isAuthenticated(req);

  try {
    await dbConnect();

    // 1. If admin requests list of all active chat sessions
    if (isAdminRequest && !sessionId) {
      const sessions = await ChatSession.find({}).sort({ updatedAt: -1 });
      return NextResponse.json(sessions);
    }

    // 2. If requesting messages for a specific session
    if (sessionId) {
      // If admin accesses it, clear unread count for this session
      if (isAdminRequest) {
        await ChatSession.findOneAndUpdate(
          { sessionId },
          { unreadCount: 0 },
          { new: true }
        );
      }

      const messages = await Message.find({ sessionId }).sort({ createdAt: 1 });
      return NextResponse.json(messages);
    }

    return NextResponse.json({ error: 'Session ID is required or unauthorized request' }, { status: 400 });
  } catch (error) {
    console.error('Chat GET API error:', error);
    return NextResponse.json({ error: 'Failed to fetch chat data' }, { status: 500 });
  }
}

// POST a new message (accessible by user or admin)
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { sessionId, sender, text, image, userName } = data;

    if (!sessionId || !sender) {
      return NextResponse.json({ error: 'Session ID and Sender are required' }, { status: 400 });
    }

    const isAdminRequest = isAuthenticated(req);

    // Enforce that only authenticated admins can send messages as 'admin'
    if (sender === 'admin' && !isAdminRequest) {
      return NextResponse.json({ error: 'Unauthorized to send as Admin' }, { status: 401 });
    }

    await dbConnect();

    // Save message to database
    const newMessage = await Message.create({
      sessionId,
      sender,
      text: text || '',
      image: image || null,
    });

    // Update the ChatSession document
    const updateObj: Record<string, any> = {
      updatedAt: new Date(),
    };

    if (userName && sender === 'user') {
      updateObj.userName = userName;
    }

    // If user sent it, increment admin's unreadCount
    if (sender === 'user') {
      await ChatSession.findOneAndUpdate(
        { sessionId },
        { 
          ...updateObj, 
          $inc: { unreadCount: 1 } 
        },
        { upsert: true, new: true }
      );
    } else {
      // If admin replied, reset unreadCount to 0
      await ChatSession.findOneAndUpdate(
        { sessionId },
        { 
          ...updateObj, 
          unreadCount: 0 
        },
        { upsert: true, new: true }
      );
    }

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error('Chat POST API error:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
