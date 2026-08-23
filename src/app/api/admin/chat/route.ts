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
      const now = new Date();

      // Mark all user messages as seen and clear unread count
      await Message.updateMany(
        { sessionId, sender: 'user', seen: false },
        { $set: { seen: true, seenAt: now } }
      );

      const [updatedSession, messages] = await Promise.all([
        ChatSession.findOneAndUpdate(
          { sessionId },
          { unreadCount: 0, lastSeenByAdmin: now },
          { new: true }
        ),
        Message.find({ sessionId }).sort({ createdAt: 1 }),
      ]);
      
      const isUserTyping = updatedSession?.userTypingUntil ? new Date(updatedSession.userTypingUntil).getTime() > Date.now() : false;
      const isAdminTyping = updatedSession?.adminTypingUntil ? new Date(updatedSession.adminTypingUntil).getTime() > Date.now() : false;

      return NextResponse.json({
        messages,
        session: updatedSession ? {
          sessionId: updatedSession.sessionId,
          userName: updatedSession.userName,
          userEmail: updatedSession.userEmail,
          unreadCount: updatedSession.unreadCount,
          isUserTyping,
          isAdminTyping,
          lastSeenByUser: updatedSession.lastSeenByUser,
          lastSeenByAdmin: updatedSession.lastSeenByAdmin,
        } : null,
      });
    }

    // 2. If fetching all active chat sessions
    const sessions = await ChatSession.find({}).sort({ updatedAt: -1 });
    return NextResponse.json(sessions);
  } catch (error) {
    console.error('Admin Fetch Chat Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
