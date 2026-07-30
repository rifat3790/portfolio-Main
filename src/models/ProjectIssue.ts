import mongoose, { Schema, Document } from 'mongoose';

export interface IProjectIssue extends Document {
  issueKey: string;
  clientName: string;
  profileName: string;
  conversationUrl: string;
  specialNotes: string;
  team: string;
  status: string;
  noteForOperation: string;
  dateStr: string;
  notifiedAt: Date;
  createdAt: Date;
}

const ProjectIssueSchema = new Schema<IProjectIssue>({
  issueKey: { type: String, required: true, unique: true, index: true },
  clientName: { type: String, default: '' },
  profileName: { type: String, default: '' },
  conversationUrl: { type: String, default: '' },
  specialNotes: { type: String, default: '' },
  team: { type: String, default: '' },
  status: { type: String, default: '' },
  noteForOperation: { type: String, default: '' },
  dateStr: { type: String, default: '' },
  notifiedAt: { type: Date, default: Date.now }
}, { timestamps: true });

if (process.env.NODE_ENV === 'development' && mongoose.models.ProjectIssue) {
  delete (mongoose.models as any).ProjectIssue;
}

export default mongoose.models.ProjectIssue || mongoose.model<IProjectIssue>('ProjectIssue', ProjectIssueSchema);
