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
  },
  { timestamps: true }
);

export default mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
