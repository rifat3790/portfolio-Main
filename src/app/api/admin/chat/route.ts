import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { ChatSession, Message } from '@/models/Chat';
import { isAuthenticated } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('sessionId');

  try {
    await dbConnect();

    // 1. If fetching messages for a specific session
    if (sessionId) {
      // Clear unread count for this session
      await ChatSession.findOneAndUpdate(
        { sessionId },
        { unreadCount: 0 }
      );
      
      const messages = await Message.find({ sessionId }).sort({ createdAt: 1 });
      return NextResponse.json(messages);
    }

    // 2. If fetching all active chat sessions
    const sessions = await ChatSession.find({}).sort({ updatedAt: -1 });
    return NextResponse.json(sessions);
  } catch (error) {
    console.error('Admin Fetch Chat Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
