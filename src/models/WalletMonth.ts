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
  isCarriedOver?: boolean;
  originalMonthName?: string;
}

export interface ISavingsGoal {
  _id?: string;
  id?: string;
  name: string;
  target: number;
  current: number;
  category: string;
}

export interface IRecurringBill {
  _id?: string;
  name: string;
  amount: number;
  category: string;
}

export interface IAsset {
  _id?: string;
  id?: string;
  name: string;
  category: string; // 'Cash' | 'Bank' | 'Gadget' | 'Investment' | 'Crypto' | 'Other'
  value: number;
  growthRate?: number;
}

export interface IWalletMonth extends Document {
  monthName: string; // e.g., "January 2026" or "2026-01"
  salary: number;
  addon: number;
  bonus: number;
  targetDailyCap?: number;
  categoryBudgets?: Record<string, number>;
  carriedOverSavings?: number;
  expenses: IExpense[];
  incomes: IIncome[];
  loans: ILoan[];
  savingsGoals?: ISavingsGoal[];
  recurringBills?: IRecurringBill[];
  assets?: IAsset[];
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
  isCarriedOver: { type: Boolean, default: false },
  originalMonthName: { type: String, default: '' },
});

const SavingsGoalSchema: Schema = new Schema({
  id: { type: String },
  name: { type: String, required: true },
  target: { type: Number, required: true, min: 0 },
  current: { type: Number, required: true, default: 0 },
  category: { type: String, required: true, default: 'Other' },
});

const RecurringBillSchema: Schema = new Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true, min: 0 },
  category: { type: String, required: true, default: 'Utility' },
});

const AssetSchema: Schema = new Schema({
  id: { type: String },
  name: { type: String, required: true },
  category: { type: String, required: true, default: 'Other' },
  value: { type: Number, required: true, min: 0 },
  growthRate: { type: Number, default: 0 },
});

const WalletMonthSchema: Schema = new Schema(
  {
    monthName: { type: String, required: true, unique: true },
    salary: { type: Number, required: true, default: 0 },
    addon: { type: Number, required: true, default: 0 },
    bonus: { type: Number, required: true, default: 0 },
    targetDailyCap: { type: Number, default: 2000 },
    categoryBudgets: { type: Schema.Types.Mixed, default: {} },
    carriedOverSavings: { type: Number, default: 0 },
    expenses: { type: [ExpenseSchema], default: [] },
    incomes: { type: [IncomeSchema], default: [] },
    loans: { type: [LoanSchema], default: [] },
    savingsGoals: { type: [SavingsGoalSchema], default: [] },
    recurringBills: { type: [RecurringBillSchema], default: [] },
    assets: { type: [AssetSchema], default: [] },
  },
  { timestamps: true }
);

if (process.env.NODE_ENV === 'development' && mongoose.models.WalletMonth) {
  delete (mongoose.models as any).WalletMonth;
}

export default mongoose.models.WalletMonth || mongoose.model<IWalletMonth>('WalletMonth', WalletMonthSchema);
