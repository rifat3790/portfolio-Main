import mongoose, { Schema, Document } from 'mongoose';

export interface ISubscriber extends Document {
  email: string;
  createdAt: Date;
}

const SubscriberSchema = new Schema<ISubscriber>({
  email: { type: String, required: true, unique: true, index: true },
}, { timestamps: true });

if (process.env.NODE_ENV === 'development' && mongoose.models.Subscriber) {
  delete (mongoose.models as any).Subscriber;
}

export default mongoose.models.Subscriber || mongoose.model<ISubscriber>('Subscriber', SubscriberSchema);
