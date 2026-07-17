import mongoose, { Schema, Document } from 'mongoose';

// Interface for a single message in a chat session
export interface IMessage extends Document {
  sessionId: string;
  sender: 'user' | 'admin';
  text: string;
  image?: string; // Base64 string for images
  createdAt: Date;
}

// Interface for a chat session (groups chat messages for admin visualization)
export interface IChatSession extends Document {
  sessionId: string;
  userName: string;
  userEmail?: string;
  unreadCount: number;
  updatedAt: Date;
}

const MessageSchema: Schema = new Schema(
  {
    sessionId: { type: String, required: true, index: true },
    sender: { type: String, enum: ['user', 'admin'], required: true },
    text: { type: String, default: '' },
    image: { type: String }, // Base64 image
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const ChatSessionSchema: Schema = new Schema(
  {
    sessionId: { type: String, required: true, unique: true, index: true },
    userName: { type: String, required: true },
    userEmail: { type: String },
    unreadCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

if (process.env.NODE_ENV === 'development') {
  if (mongoose.models.Message) delete (mongoose.models as any).Message;
  if (mongoose.models.ChatSession) delete (mongoose.models as any).ChatSession;
}

export const Message = mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);
export const ChatSession = mongoose.models.ChatSession || mongoose.model<IChatSession>('ChatSession', ChatSessionSchema);
