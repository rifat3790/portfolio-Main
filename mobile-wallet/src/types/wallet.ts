export interface IWalletExpense {
  _id?: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

export interface IWalletIncome {
  _id?: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

export interface IWalletLoan {
  _id?: string;
  personName: string;
  amount: number;
  date: string;
  dueDate?: string;
  status: 'Pending' | 'Returned';
  notes?: string;
  isCarriedOver?: boolean;
  originalMonthName?: string;
}

export interface IWalletAsset {
  _id?: string;
  name: string;
  category: string;
  value: number;
  growthRate?: number;
}

export interface IWalletMonthData {
  _id: string;
  monthName: string;
  salary: number;
  addon: number;
  bonus: number;
  targetDailyCap?: number;
  categoryBudgets?: Record<string, number>;
  carriedOverSavings?: number;
  expenses: IWalletExpense[];
  incomes: IWalletIncome[];
  loans: IWalletLoan[];
  assets: IWalletAsset[];
  createdAt?: string;
}
