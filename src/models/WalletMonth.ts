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

export interface ILoan {
  _id?: string;
  personName: string;
  amount: number;
  date: Date | string;
  dueDate?: Date | string;
  status: 'Pending' | 'Returned';
  returnedDate?: Date | string;
  notes?: string;
}

export interface IWalletMonth extends Document {
  monthName: string; // e.g., "January 2026" or "2026-01"
  salary: number;
  addon: number;
  bonus: number;
  expenses: IExpense[];
  incomes: IIncome[];
  loans: ILoan[];
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

const LoanSchema: Schema = new Schema({
  personName: { type: String, required: true },
  amount: { type: Number, required: true, min: 0 },
  date: { type: Date, required: true, default: Date.now },
  dueDate: { type: Date },
  status: { type: String, enum: ['Pending', 'Returned'], default: 'Pending' },
  returnedDate: { type: Date },
  notes: { type: String, default: '' },
});

const WalletMonthSchema: Schema = new Schema(
  {
    monthName: { type: String, required: true, unique: true },
    salary: { type: Number, required: true, default: 0 },
    addon: { type: Number, required: true, default: 0 },
    bonus: { type: Number, required: true, default: 0 },
    expenses: { type: [ExpenseSchema], default: [] },
    incomes: { type: [IncomeSchema], default: [] },
    loans: { type: [LoanSchema], default: [] },
  },
  { timestamps: true }
);

if (process.env.NODE_ENV === 'development' && mongoose.models.WalletMonth) {
  delete (mongoose.models as any).WalletMonth;
}

export default mongoose.models.WalletMonth || mongoose.model<IWalletMonth>('WalletMonth', WalletMonthSchema);
