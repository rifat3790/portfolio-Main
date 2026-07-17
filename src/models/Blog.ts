import mongoose, { Schema, Document } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image?: string; // Base64
  tags: string[];
  readTime: string;
  published: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema = new Schema<IBlog>({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String },
  tags: { type: [String], default: [] },
  readTime: { type: String, default: '5 min read' },
  published: { type: Boolean, default: false },
  order: { type: Number, default: 0 }
}, { timestamps: true });

if (process.env.NODE_ENV === 'development' && mongoose.models.Blog) {
  delete (mongoose.models as any).Blog;
}

export default mongoose.models.Blog || mongoose.model<IBlog>('Blog', BlogSchema);
