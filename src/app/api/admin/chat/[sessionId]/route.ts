import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Message, ChatSession } from '@/models/Chat';
import { isAuthenticated } from '@/lib/auth';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { sessionId } = await params;
    await dbConnect();
    
    // Delete session and all related messages
    await ChatSession.findOneAndDelete({ sessionId });
    await Message.deleteMany({ sessionId });

    return NextResponse.json({ message: 'Chat thread deleted successfully' });
  } catch (error) {
    console.error('Chat DELETE API error:', error);
    return NextResponse.json({ error: 'Failed to delete chat thread' }, { status: 500 });
  }
}
