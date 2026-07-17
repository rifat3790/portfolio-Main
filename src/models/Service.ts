import mongoose, { Schema, Document } from 'mongoose';

export interface IService extends Document {
  title: string;
  description: string;
  iconName: string; // e.g. "Code", "Palette", "Smartphone", "Globe", etc.
  order: number;
}

const ServiceSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    iconName: { type: String, required: true, default: 'Code' },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

if (process.env.NODE_ENV === 'development' && mongoose.models.Service) {
  delete (mongoose.models as any).Service;
}

export default mongoose.models.Service || mongoose.model<IService>('Service', ServiceSchema);
