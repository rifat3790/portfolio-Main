import mongoose, { Schema, Document } from 'mongoose';

export interface IExpense {
  _id?: string;
  description: string;
  amount: number;
  category: string;
  date: Date | string;
}

export interface IIncome {
  _id?: string;
  description: string;
  amount: number;
  category: string;
  date: Date | string;
}

export interface IWalletMonth extends Document {
  monthName: string; // e.g., "January 2026" or "2026-01"
  salary: number;
  addon: number;
  bonus: number;
  expenses: IExpense[];
  incomes: IIncome[];
  createdAt: Date;
  updatedAt: Date;
}

const ExpenseSchema: Schema = new Schema({
  description: { type: String, required: true },
  amount: { type: Number, required: true, min: 0 },
  category: { type: String, required: true, default: 'Other' },
  date: { type: Date, required: true, default: Date.now },
});

const IncomeSchema: Schema = new Schema({
  description: { type: String, required: true },
  amount: { type: Number, required: true, min: 0 },
  category: { type: String, required: true, default: 'Freelance' },
  date: { type: Date, required: true, default: Date.now },
});

const WalletMonthSchema: Schema = new Schema(
  {
    monthName: { type: String, required: true, unique: true },
    salary: { type: Number, required: true, default: 0 },
    addon: { type: Number, required: true, default: 0 },
    bonus: { type: Number, required: true, default: 0 },
    expenses: { type: [ExpenseSchema], default: [] },
    incomes: { type: [IncomeSchema], default: [] },
  },
  { timestamps: true }
);

if (process.env.NODE_ENV === 'development' && mongoose.models.WalletMonth) {
  delete (mongoose.models as any).WalletMonth;
}

export default mongoose.models.WalletMonth || mongoose.model<IWalletMonth>('WalletMonth', WalletMonthSchema);
