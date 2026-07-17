import mongoose, { Schema, Document } from 'mongoose';

export interface IExperience extends Document {
  company: string;
  role: string;
  location: string;
  duration: string;
  employmentType?: string; // e.g. "1.5+ Years" or "Full-time"
  description: string;
  responsibilities?: string; // Newline separated responsibilities list
  techStack: string[];
  logo?: string; // Base64 representation of company logo
  order: number;
  isCurrent: boolean;
}

const ExperienceSchema: Schema = new Schema(
  {
    company: { type: String, required: true },
    role: { type: String, required: true },
    location: { type: String, required: true },
    duration: { type: String, required: true },
    employmentType: { type: String },
    description: { type: String, required: true },
    responsibilities: { type: String },
    techStack: [{ type: String }],
    logo: { type: String },
    order: { type: Number, default: 0 },
    isCurrent: { type: Boolean, default: false }
  },
  { timestamps: true }
);

if (process.env.NODE_ENV === 'development' && mongoose.models.Experience) {
  delete (mongoose.models as any).Experience;
}

export default mongoose.models.Experience || mongoose.model<IExperience>('Experience', ExperienceSchema);
