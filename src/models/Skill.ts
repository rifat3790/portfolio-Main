import mongoose, { Schema, Document } from 'mongoose';

export interface ISkill extends Document {
  name: string;
  category: string; // e.g. 'Frontend', 'Backend', 'Tools/Other'
  proficiency: number; // 0 to 100
  iconName?: string; // name of lucide-react icon to use
  order: number;
}

const SkillSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    proficiency: { type: Number, required: true, min: 0, max: 100 },
    iconName: { type: String },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Skill || mongoose.model<ISkill>('Skill', SkillSchema);
