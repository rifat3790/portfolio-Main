import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Message, ChatSession } from '@/models/Chat';
import { isAuthenticated } from '@/lib/auth';
import { sendLiveChatNotificationEmail } from '@/lib/emailService';

export const dynamic = 'force-dynamic';

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
      const now = new Date();

      if (isAdminRequest) {
        // Admin viewing: Mark all user messages as seen
        await Message.updateMany(
          { sessionId, sender: 'user', seen: false },
          { $set: { seen: true, seenAt: now } }
        );
        await ChatSession.findOneAndUpdate(
          { sessionId },
          { unreadCount: 0, lastSeenByAdmin: now },
          { new: true }
        );
      } else {
        // Visitor viewing: Mark all admin messages as seen
        await Message.updateMany(
          { sessionId, sender: 'admin', seen: false },
          { $set: { seen: true, seenAt: now } }
        );
        await ChatSession.findOneAndUpdate(
          { sessionId },
          { lastSeenByUser: now },
          { new: true }
        );
      }

      const [messages, session] = await Promise.all([
        Message.find({ sessionId }).sort({ createdAt: 1 }),
        ChatSession.findOne({ sessionId }),
      ]);

      const isAdminTyping = session?.adminTypingUntil ? new Date(session.adminTypingUntil).getTime() > Date.now() : false;
      const isUserTyping = session?.userTypingUntil ? new Date(session.userTypingUntil).getTime() > Date.now() : false;

      return NextResponse.json({
        messages,
        session: session ? {
          sessionId: session.sessionId,
          userName: session.userName,
          userEmail: session.userEmail,
          unreadCount: session.unreadCount,
          isAdminTyping,
          isUserTyping,
          lastSeenByUser: session.lastSeenByUser,
          lastSeenByAdmin: session.lastSeenByAdmin,
        } : null
      });
    }

    return NextResponse.json({ error: 'Session ID is required or unauthorized request' }, { status: 400 });
  } catch (error) {
    console.error('Chat GET API error:', error);
    return NextResponse.json({ error: 'Failed to fetch chat data' }, { status: 500 });
  }
}

// POST a new message or broadcast typing status
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { action, sessionId, sender, text, image, userName, userEmail } = data;

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    await dbConnect();
    const isAdminRequest = isAuthenticated(req);

    // Handle typing heartbeat action
    if (action === 'typing') {
      const typingExpiry = new Date(Date.now() + 3500);
      if (sender === 'admin') {
        if (!isAdminRequest) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        await ChatSession.findOneAndUpdate(
          { sessionId },
          { adminTypingUntil: typingExpiry },
          { upsert: true }
        );
      } else {
        await ChatSession.findOneAndUpdate(
          { sessionId },
          { userTypingUntil: typingExpiry },
          { upsert: true }
        );
      }
      return NextResponse.json({ success: true });
    }

    if (!sender) {
      return NextResponse.json({ error: 'Sender is required' }, { status: 400 });
    }

    // Enforce that only authenticated admins can send messages as 'admin'
    if (sender === 'admin' && !isAdminRequest) {
      return NextResponse.json({ error: 'Unauthorized to send as Admin' }, { status: 401 });
    }

    // Clear typing indicator when message is submitted
    const typingClear = sender === 'admin' ? { adminTypingUntil: new Date(0) } : { userTypingUntil: new Date(0) };

    // Save message to database
    const newMessage = await Message.create({
      sessionId,
      sender,
      text: text || '',
      image: image || null,
      seen: false,
    });

    // Update the ChatSession document
    const updateObj: Record<string, any> = {
      ...typingClear,
      updatedAt: new Date(),
    };

    if (userName && sender === 'user') {
      updateObj.userName = userName;
    }
    if (userEmail && sender === 'user') {
      updateObj.userEmail = userEmail;
    }

    // If user sent it, increment admin's unreadCount and await real-time email notification
    if (sender === 'user') {
      await ChatSession.findOneAndUpdate(
        { sessionId },
        { 
          ...updateObj, 
          $inc: { unreadCount: 1 } 
        },
        { upsert: true, new: true }
      );

      // Check if this is the first message in this session or if admin has not replied yet
      const adminMessageCount = await Message.countDocuments({ sessionId, sender: 'admin' });
      if (adminMessageCount === 0) {
        // Professional, luxury instant automated acknowledgment
        const autoReplyGreeting = userName ? `Hello ${userName.split(' ')[0]}!` : 'Hello!';
        const autoReplyText = `${autoReplyGreeting} Thank you for reaching out. I have received your message and will review it and get back to you shortly. In the meantime, please feel free to share any specific details about your project, timeline, or any questions you might have!`;

        await Message.create({
          sessionId,
          sender: 'admin',
          text: autoReplyText,
          seen: false,
          createdAt: new Date(Date.now() + 500),
        });
      }

      // Send instant notification alert in background
      sendLiveChatNotificationEmail({
        sessionId,
        senderName: userName || 'Website Visitor',
        senderEmail: userEmail || 'Not provided',
        messageText: text || (image ? 'Sent an attachment / image' : 'New chat message')
      }).catch(err => console.error('Error sending chat email alert:', err));

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
