import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  title: string;
  description: string;
  richText?: string;
  image: string; // Base64 representation of project image
  techStack: string[];
  liveLink?: string;
  githubLink?: string;
  order: number;
  category?: string;
  screenshots?: string[];
  role?: string;
  duration?: string;
  projectType?: string;
  keyFeatures?: string;
  isFeatured?: boolean;
  password?: string;
}

const ProjectSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    richText: { type: String },
    image: { type: String, required: true }, // Base64 string
    techStack: [{ type: String }],
    liveLink: { type: String },
    githubLink: { type: String },
    order: { type: Number, default: 0 },
    category: { type: String, default: 'Web Applications' },
    screenshots: [{ type: String }], // Array of Base64 strings
    role: { type: String, default: 'Developer' },
    duration: { type: String },
    projectType: { type: String, default: 'Web Application' },
    keyFeatures: { type: String },
    isFeatured: { type: Boolean, default: false },
    password: { type: String }
  },
  { timestamps: true }
);

if (process.env.NODE_ENV === 'development' && mongoose.models.Project) {
  delete (mongoose.models as any).Project;
}

export default mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
