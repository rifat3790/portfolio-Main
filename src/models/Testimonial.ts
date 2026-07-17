import mongoose, { Schema, Document } from 'mongoose';

export interface ITestimonial extends Document {
  name: string;
  role: string;
  company: string;
  reviewText: string;
  avatar?: string; // Base64 avatar image string
  rating: number; // 1 to 5
  order: number;
}

const TestimonialSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    company: { type: String, required: true },
    reviewText: { type: String, required: true },
    avatar: { type: String }, // Base64
    rating: { type: Number, required: true, min: 1, max: 5 },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

if (process.env.NODE_ENV === 'development' && mongoose.models.Testimonial) {
  delete (mongoose.models as any).Testimonial;
}

export default mongoose.models.Testimonial || mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);
