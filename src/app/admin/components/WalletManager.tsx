'use client';

import React, { useState, useEffect } from 'react';
import { 
  Wallet, Plus, Layers, TrendingUp, Edit, Download, Trash2, FileText, X, PieChart,
  HandCoins, CheckCircle2, Clock, Send, Copy, User, Calendar, MessageCircle, AlertCircle, RefreshCw, Check,
  Target, Zap, ArrowUpDown, ShieldAlert, Sparkles, Eye, EyeOff, CreditCard, ShieldCheck, PiggyBank, Flame,
  TrendingDown, Lock, Award, Tag, CopyCheck, Share2, Gauge, FilePlus, Sliders, Activity, Compass, Filter,
  BarChart3, Coins, Globe, Building2, Laptop, DollarSign, Briefcase, ArrowRightLeft, Save
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '../admin.module.css';

export interface IWalletExpense {
  _id?: string;
  description: string;
  amount: number;
  category: string;
  date: string | Date;
}

export interface IWalletIncome {
  _id?: string;
  description: string;
  amount: number;
  category: string; // 'Salary' | 'Freelance' | 'Bonus' | 'Other'
  date: string | Date;
}

export interface IWalletLoan {
  _id?: string;
  personName: string;
  amount: number;
  date: string | Date;
  dueDate?: string | Date;
  status: 'Pending' | 'Returned';
  returnedDate?: string | Date;
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
  incomes?: IWalletIncome[];
  loans?: IWalletLoan[];
  savingsGoals?: ISavingsGoal[];
  recurringBills?: IRecurringBill[];
  assets?: IAsset[];
  createdAt: string;
}

export default function WalletManager({ showToast }: { showToast: (msg: string, type?: 'success' | 'error' | 'info') => void }) {
  const [months, setMonths] = useState<IWalletMonthData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonthId, setSelectedMonthId] = useState<string>('');
  const [walletSubTab, setWalletSubTab] = useState<'single' | 'consolidated' | 'global_summary' | 'analytics' | 'wealth_vault' | 'daily_intel' | 'goals_debts' | 'ai_advisor'>('single');
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');

  // Daily Pace & Email State
  const [targetDailyCap, setTargetDailyCap] = useState<number>(2000);
  const [sendingEmailReport, setSendingEmailReport] = useState<boolean>(false);
  const [customAppPassword, setCustomAppPassword] = useState<string>('');
  const [isSmtpModalOpen, setIsSmtpModalOpen] = useState<boolean>(false);

  // AI Financial Simulator State
  const [simReturnRate, setSimReturnRate] = useState<number>(8);
  const [simMonthlySavings, setSimMonthlySavings] = useState<number>(15000);
  const [simYears, setSimYears] = useState<number>(5);
  
  // Date & Amount Sorting State
  const [expSortBy, setExpSortBy] = useState<'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc'>('date_desc');
  const [incSortBy, setIncSortBy] = useState<'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc'>('date_desc');

  // Category Budget Limits & Over-spending Alert State
  const [categoryBudgets, setCategoryBudgets] = useState<{ [cat: string]: number }>({
    Food: 6000,
    Rent: 5000,
    Utility: 3000,
    Gadgets: 5000,
    Server: 2000,
    Entertainment: 2000,
    'Parents (Baba Ma)': 5000,
    Other: 3000
  });
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);

  // 👁️ Executive Stealth & Privacy Mode State
  const [privacyMode, setPrivacyMode] = useState(false);

  // 🛡️ Interactive Emergency Reserve Calculator State
  const [emergencyMonthsTarget, setEmergencyMonthsTarget] = useState<number>(6);
  // 🔍 Expense Date Range Filter State
  const [expenseDateRange, setExpenseDateRange] = useState<'all' | '7days' | '30days'>('all');
  // 🔀 Consolidated All-Month Table Filter & Sort State
  const [consolidatedSearchQuery, setConsolidatedSearchQuery] = useState('');
  const [consolidatedSortBy, setConsolidatedSortBy] = useState<'name' | 'income_desc' | 'savings_desc' | 'rate_desc'>('name');

  // 🎯 Savings Goals & Wealth Target Allocator State
  const [savingsGoals, setSavingsGoals] = useState<ISavingsGoal[]>([]);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [editingGoalId, setEditingGoalId] = useState('');
  const [goalName, setGoalName] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalCurrent, setGoalCurrent] = useState('');

  // 🔒 Recurring Bills Overhead Vault State
  const [recurringBills, setRecurringBills] = useState<IRecurringBill[]>([]);

  const [isVaultModalOpen, setIsVaultModalOpen] = useState(false);

  // 💼 Wealth Vault & Assets State
  const [assets, setAssets] = useState<IAsset[]>([]);
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const [editingAssetId, setEditingAssetId] = useState('');
  const [assetName, setAssetName] = useState('');
  const [assetCategory, setAssetCategory] = useState('Bank');
  const [assetValue, setAssetValue] = useState('');
  const [assetGrowthRate, setAssetGrowthRate] = useState('');

  // 💱 Remittance & FX Converter State
  const [baseCurrency, setBaseCurrency] = useState<'USD' | 'EUR' | 'GBP' | 'BDT' | 'INR' | 'CAD' | 'AED'>('USD');
  const [targetCurrency, setTargetCurrency] = useState<'BDT' | 'USD' | 'EUR' | 'GBP' | 'INR' | 'CAD' | 'AED'>('BDT');
  const [convertAmount, setConvertAmount] = useState<string>('1000');
  const [netWorthTarget, setNetWorthTarget] = useState<number>(1000000);

  // Modal states
  const [isAddMonthOpen, setIsAddMonthOpen] = useState(false);
  const [isEditMonthOpen, setIsEditMonthOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isEditExpenseOpen, setIsEditExpenseOpen] = useState(false);
  const [isAddIncomeOpen, setIsAddIncomeOpen] = useState(false);
  const [isEditIncomeOpen, setIsEditIncomeOpen] = useState(false);

  // Loan / Debt Ledger Modal states & inputs
  const [isAddLoanOpen, setIsAddLoanOpen] = useState(false);
  const [isEditLoanOpen, setIsEditLoanOpen] = useState(false);
  const [loanPersonName, setLoanPersonName] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [loanDate, setLoanDate] = useState('');
  const [loanDueDate, setLoanDueDate] = useState('');
  const [loanNotes, setLoanNotes] = useState('');
  const [loanStatus, setLoanStatus] = useState<'Pending' | 'Returned'>('Pending');
  const [editingLoanId, setEditingLoanId] = useState<string>('');
  const [loanFilterStatus, setLoanFilterStatus] = useState<'All' | 'Pending' | 'Returned'>('All');
  const [loanSearchQuery, setLoanSearchQuery] = useState('');
  
  // Month Form Inputs
  const [monthName, setMonthName] = useState('');
  const [salary, setSalary] = useState('');
  const [addon, setAddon] = useState('');
  const [bonus, setBonus] = useState('');
  
  // Expense Form Inputs
  const [expDesc, setExpDesc] = useState('');
  const [expAmount, setExpAmount] = useState('');
  const [expCategory, setExpCategory] = useState('Food');
  const [expDate, setExpDate] = useState('');
  const [editingExpenseId, setEditingExpenseId] = useState<string>('');
  const [customCategory, setCustomCategory] = useState('');

  // Income Form Inputs
  const [incDesc, setIncDesc] = useState('');
  const [incAmount, setIncAmount] = useState('');
  const [incCategory, setIncCategory] = useState('Freelance');
  const [customIncCategory, setCustomIncCategory] = useState('');
  const [incDate, setIncDate] = useState('');
  const [editingIncomeId, setEditingIncomeId] = useState<string>('');

  const fetchMonths = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/wallet');
      if (res.ok) {
        const data = await res.json();
        setMonths(data);
        if (data.length > 0 && !selectedMonthId) {
          setSelectedMonthId(data[data.length - 1]._id); // default to latest month
        }
      } else {
        showToast('Failed to load wallet data', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Error connecting to database', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonths();
  }, []);

  const activeMonth = months.find(m => m._id === selectedMonthId) || null;

  useEffect(() => {
    if (activeMonth) {
      if (activeMonth.targetDailyCap) setTargetDailyCap(activeMonth.targetDailyCap);
      if (activeMonth.categoryBudgets) setCategoryBudgets(activeMonth.categoryBudgets);
      setAssets(activeMonth.assets || []);
      setSavingsGoals(activeMonth.savingsGoals || []);
      setRecurringBills(activeMonth.recurringBills || []);
    } else if (months.length > 0) {
      const latest = months[months.length - 1];
      if (latest.targetDailyCap) setTargetDailyCap(latest.targetDailyCap);
      if (latest.categoryBudgets) setCategoryBudgets(latest.categoryBudgets);
      setAssets(latest.assets || []);
      setSavingsGoals(latest.savingsGoals || []);
      setRecurringBills(latest.recurringBills || []);
    } else {
      setAssets([]);
      setSavingsGoals([]);
      setRecurringBills([]);
    }
  }, [selectedMonthId, months]);

  // Helper calculation formulas
  const getSalaryTotal = (m: IWalletMonthData) => {
    if (m.incomes && m.incomes.length > 0) {
      return m.incomes.filter(i => i.category === 'Salary').reduce((acc, curr) => acc + (curr.amount || 0), 0);
    }
    return m.salary || 0;
  };

  const getAddonTotal = (m: IWalletMonthData) => {
    if (m.incomes && m.incomes.length > 0) {
      return m.incomes.filter(i => i.category === 'Freelance' || i.category === 'Other').reduce((acc, curr) => acc + (curr.amount || 0), 0);
    }
    return m.addon || 0;
  };

  const getBonusTotal = (m: IWalletMonthData) => {
    if (m.incomes && m.incomes.length > 0) {
      return m.incomes.filter(i => i.category === 'Bonus').reduce((acc, curr) => acc + (curr.amount || 0), 0);
    }
    return m.bonus || 0;
  };

  const getCarriedOverSavings = (m: IWalletMonthData) => m.carriedOverSavings || 0;

  const getIncomeTotal = (m: IWalletMonthData) => {
    if (m.incomes && m.incomes.length > 0) {
      return m.incomes.reduce((acc, curr) => acc + (curr.amount || 0), 0);
    }
    return (m.salary || 0) + (m.addon || 0) + (m.bonus || 0);
  };

  const getExpenseTotal = (m: IWalletMonthData) => (m.expenses || []).reduce((acc, curr) => acc + (curr.amount || 0), 0);

  // Loan & Debt calculations
  const getActiveLoansTotal = (m: IWalletMonthData) => {
    return (m.loans || [])
      .filter(l => l.status === 'Pending')
      .reduce((acc, curr) => acc + (curr.amount || 0), 0);
  };

  const getReturnedLoansTotal = (m: IWalletMonthData) => {
    return (m.loans || [])
      .filter(l => l.status === 'Returned')
      .reduce((acc, curr) => acc + (curr.amount || 0), 0);
  };

  const getTotalLoansGiven = (m: IWalletMonthData) => {
    return (m.loans || []).reduce((acc, curr) => acc + (curr.amount || 0), 0);
  };

  // Fresh Monthly Cashflow Savings (This Month's Income - This Month's Expenses)
  const getGrossSavings = (m: IWalletMonthData) => getIncomeTotal(m) - getExpenseTotal(m);

  // Total Available Net Liquid Savings = Opening Balance + This Month's Income - This Month's Expenses - Active Pending Loans
  const getSavings = (m: IWalletMonthData) => {
    return getCarriedOverSavings(m) + getIncomeTotal(m) - getExpenseTotal(m) - getActiveLoansTotal(m);
  };

  const getSavingsRate = (m: IWalletMonthData) => {
    const inc = getIncomeTotal(m) + getCarriedOverSavings(m);
    if (inc === 0) return 0;
    return Math.max(0, (getSavings(m) / inc) * 100);
  };

  // Main Available Balance (Equal to Net Liquid Savings)
  const getNetBalance = (m: IWalletMonthData) => getSavings(m);

  // Global calculations
  const globalTotalIncome = months.reduce((acc, m) => acc + getIncomeTotal(m), 0);
  const globalTotalSpent = months.reduce((acc, m) => acc + getExpenseTotal(m), 0);
  const globalActiveLoans = months.reduce((acc, m) => acc + getActiveLoansTotal(m), 0);
  const globalReturnedLoans = months.reduce((acc, m) => acc + getReturnedLoansTotal(m), 0);
  const globalGrossSavings = globalTotalIncome - globalTotalSpent;
  const globalTotalSavings = months.length > 0 ? getSavings(months[months.length - 1]) : 0;
  const globalNetBalance = globalTotalSavings;
  const globalSavingsRate = globalTotalIncome > 0 ? (globalGrossSavings / globalTotalIncome) * 100 : 0;

  // Expense Categories mapping & colors
  const categoriesList = ['Food', 'Rent', 'Utility', 'Gadgets', 'Server', 'Entertainment', 'Parents (Baba Ma)', 'Other'];
  const categoryColors: { [key: string]: string } = {
    Food: '#ff9800',
    Rent: '#4caf50',
    Utility: '#2196f3',
    Gadgets: '#9c27b0',
    Server: '#f44336',
    Entertainment: '#e91e63',
    'Parents (Baba Ma)': '#ff5722',
    Other: '#607d8b'
  };

  // 📐 Premium Financial Score Algorithm
  const getHealthScore = (m: IWalletMonthData) => {
    const inc = getIncomeTotal(m);
    if (inc === 0) return 0;
    const savingsRate = getSavingsRate(m);
    // 60% of score is based on savings rate (target 40%+)
    const savingsPoints = Math.min(60, (savingsRate / 40) * 60);

    // 20% based on expense diversity/over-concentration
    const expTotal = getExpenseTotal(m);
    let categoryPoints = 20;
    if (expTotal > 0) {
      const maxCategorySpent = Math.max(...categoriesList.map(cat =>
        (m.expenses || []).filter(e => e.category === cat).reduce((sum, e) => sum + e.amount, 0)
      ));
      const concentration = maxCategorySpent / expTotal;
      if (concentration > 0.7) categoryPoints = 5; 
      else if (concentration > 0.4) categoryPoints = 12;
    }

    // 20% bonus reward for side-gig diversification
    const sideGigRatio = getAddonTotal(m) / inc;
    const sidePoints = Math.min(20, sideGigRatio * 100);

    return Math.round(savingsPoints + categoryPoints + sidePoints);
  };

  const getHealthGrade = (score: number) => {
    if (score >= 80) return { grade: 'Excellent', color: '#10b981', border: '#10b981' };
    if (score >= 60) return { grade: 'Healthy', color: '#818cf8', border: '#818cf8' };
    if (score >= 40) return { grade: 'Balanced', color: '#fbbf24', border: '#fbbf24' };
    return { grade: 'Over-concentrated', color: '#f87171', border: '#f87171' };
  };

  // 💡 Smart Automated Warnings
  const getSmartRecommendations = (m: IWalletMonthData) => {
    const recs: string[] = [];
    const inc = getIncomeTotal(m);
    const exp = getExpenseTotal(m);
    if (inc === 0) return ['Add income resources to build smart metrics.'];

    if (exp / inc > 0.65) {
      recs.push(`Spending Ratio is at ${( (exp / inc) * 100 ).toFixed(0)}%. Consider auditing non-essential items to push it below 50%.`);
    } else {
      recs.push('Excellent! Spending ratio is under control. Keep saving!');
    }

    // Find highest spending category
    let topCat = '';
    let topAmount = 0;
    categoriesList.forEach(cat => {
      const sum = (m.expenses || []).filter(e => e.category === cat).reduce((acc, curr) => acc + curr.amount, 0);
      if (sum > topAmount) {
        topAmount = sum;
        topCat = cat;
      }
    });

    if (topAmount > 0) {
      recs.push(`Largest outlay sector: "${topCat}" at ৳${topAmount.toLocaleString()} (${((topAmount / exp) * 100).toFixed(0)}% of expenses).`);
    }

    const mSalary = getSalaryTotal(m);
    const mAddon = getAddonTotal(m);
    if (mAddon > mSalary) {
      recs.push('Outstanding: Side-gigs and addon revenue outperformed your primary base salary! 🚀');
    }

    const activeLoanAmt = getActiveLoansTotal(m);
    const grossSav = getGrossSavings(m);
    if (activeLoanAmt > 0) {
      if (grossSav > 0) {
        const pctLocked = Math.min(100, Math.round((activeLoanAmt / grossSav) * 100));
        recs.push(`🔒 Active Loans Alert: ৳${activeLoanAmt.toLocaleString()} (${pctLocked}% of gross savings) is currently deducted from your savings until repaid.`);
      } else {
        recs.push(`🔒 Active Loans Alert: ৳${activeLoanAmt.toLocaleString()} is currently deducted from your savings balance.`);
      }
    }

    return recs;
  };

  // 🤖 MACHINE LEARNING FINANCIAL ENGINE ALGORITHMS (OLS Linear Regression & Debt Recovery Probability)
  const predictNextMonthML = () => {
    if (months.length < 2) {
      const singleInc = months[0] ? getIncomeTotal(months[0]) : 0;
      const singleExp = months[0] ? getExpenseTotal(months[0]) : 0;
      return {
        predictedIncome: singleInc,
        predictedExpense: singleExp,
        predictedSavings: singleInc - singleExp,
        trendDirection: 'Stable Baseline',
        confidenceScore: 78,
        slopeInc: 0,
        slopeExp: 0
      };
    }

    // Ordinary Least Squares (OLS) Linear Regression: y = mx + c
    const n = months.length;
    let sumX = 0, sumYInc = 0, sumYExp = 0;
    let sumXYInc = 0, sumXYExp = 0;
    let sumXX = 0;

    months.forEach((m, idx) => {
      const x = idx + 1;
      const inc = getIncomeTotal(m);
      const exp = getExpenseTotal(m);
      sumX += x;
      sumYInc += inc;
      sumYExp += exp;
      sumXYInc += x * inc;
      sumXYExp += x * exp;
      sumXX += x * x;
    });

    const slopeInc = (n * sumXYInc - sumX * sumYInc) / (n * sumXX - sumX * sumX || 1);
    const interceptInc = (sumYInc - slopeInc * sumX) / n;

    const slopeExp = (n * sumXYExp - sumX * sumYExp) / (n * sumXX - sumX * sumX || 1);
    const interceptExp = (sumYExp - slopeExp * sumX) / n;

    const nextX = n + 1;
    const predictedIncome = Math.max(0, Math.round(slopeInc * nextX + interceptInc));
    const predictedExpense = Math.max(0, Math.round(slopeExp * nextX + interceptExp));
    const predictedSavings = predictedIncome - predictedExpense;

    const trendDirection = slopeInc > slopeExp ? 'Growing (Bullish)' : slopeInc < 0 ? 'Declining (Caution)' : 'Balanced Growth';
    const confidenceScore = Math.min(96, Math.max(82, 80 + n * 3));

    return {
      predictedIncome,
      predictedExpense,
      predictedSavings,
      trendDirection,
      confidenceScore,
      slopeInc,
      slopeExp
    };
  };

  // ML Debt Recovery Risk Scorer
  const calculateLoanMLRiskScore = (loan: IWalletLoan) => {
    if (loan.status === 'Returned') return { score: 100, label: 'Low Risk (Returned)', color: '#10b981' };
    
    const daysElapsed = Math.floor((Date.now() - new Date(loan.date).getTime()) / (1000 * 60 * 60 * 24));
    let score = 90;
    if (daysElapsed > 60) score -= 40;
    else if (daysElapsed > 30) score -= 20;

    if (loan.dueDate) {
      const dueDaysLeft = Math.floor((new Date(loan.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      if (dueDaysLeft < 0) score -= 30; // Overdue penalty
    }

    if (loan.amount > 20000) score -= 10;

    score = Math.max(15, Math.min(99, score));
    if (score >= 75) return { score, label: 'Low Risk (High Return Probability)', color: '#10b981' };
    if (score >= 50) return { score, label: 'Moderate Risk (Follow-up Recommended)', color: '#fbbf24' };
    return { score, label: 'High Risk (Overdue / Immediate Reminder Needed)', color: '#f87171' };
  };

  // 📊 Excel / CSV Spreadsheet Exporter
  const exportMonthToCSV = (m: IWalletMonthData) => {
    const headers = ['Category', 'Description', 'Date', 'Amount (৳)'];
    const rows = (m.expenses || []).map(e => [
      e.category,
      `"${e.description.replace(/"/g, '""')}"`,
      new Date(e.date).toLocaleDateString(),
      e.amount
    ]);
    
    const loanHeaders = ['Person Name (Debtor)', 'Amount (৳)', 'Date Given', 'Due Date', 'Status', 'Returned Date', 'Notes'];
    const loanRows = (m.loans || []).map(l => [
      `"${l.personName.replace(/"/g, '""')}"`,
      l.amount,
      new Date(l.date).toLocaleDateString(),
      l.dueDate ? new Date(l.dueDate).toLocaleDateString() : 'N/A',
      l.status,
      l.returnedDate ? new Date(l.returnedDate).toLocaleDateString() : 'N/A',
      `"${(l.notes || '').replace(/"/g, '""')}"`
    ]);

    const metaRows = [
      ['Rifat Finance Console - Ledger Summary', m.monthName],
      ['Base Salary', m.salary],
      ['Add-on Revenue', m.addon],
      ['Bonuses Received', m.bonus],
      ['Total Income', getIncomeTotal(m)],
      ['Total Expenses', getExpenseTotal(m)],
      ['Active Money Lent Out', getActiveLoansTotal(m)],
      ['Returned Money Recovered', getReturnedLoansTotal(m)],
      ['Main Available Cash Balance', getNetBalance(m)],
      [],
      headers
    ];

    const csvString = metaRows.map(r => r.join(',')).join('\n') + 
      '\n' + rows.map(r => r.join(',')).join('\n') + 
      '\n\n--- LOANS & MONEY LENT LEDGER ---\n' + 
      loanHeaders.join(',') + '\n' + 
      loanRows.map(r => r.join(',')).join('\n');

    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Finance_Ledger_${m.monthName.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Ledger CSV file generated successfully!', 'success');
  };

  // 📄 On-Demand Direct Vector PDF Download Engine (100% Crisp Vector Text & Zero Blank Pages)
  const downloadPDFHelper = (htmlContent: string, filename: string) => {
    const title = filename.replace('.pdf', '').replace(/_/g, ' ');

    const printWithIframe = (html: string, docTitle: string) => {
      showToast('Preparing PDF document...', 'info');
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      document.body.appendChild(iframe);

      const iframeDoc = iframe.contentWindow?.document || iframe.contentDocument;
      if (!iframeDoc) {
        showToast('Failed to open PDF document', 'error');
        return;
      }

      iframeDoc.open();
      iframeDoc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <title>${docTitle}</title>
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
              * { box-sizing: border-box; margin: 0; padding: 0; }
              body {
                font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
                background: #ffffff !important;
                color: #0f172a !important;
                padding: 24px;
                font-size: 12px;
                line-height: 1.5;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              @page {
                size: A4 portrait;
                margin: 10mm;
              }
              table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
              th, td { padding: 8px 10px; text-align: left; }
              tr { page-break-inside: avoid; }
            </style>
          </head>
          <body>
            ${html}
          </body>
        </html>
      `);
      iframeDoc.close();

      setTimeout(() => {
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
          showToast('PDF document ready!', 'success');
        } catch (err) {
          console.error('Print iframe error:', err);
        } finally {
          setTimeout(() => {
            if (document.body.contains(iframe)) {
              document.body.removeChild(iframe);
            }
          }, 1000);
        }
      }, 350);
    };

    try {
      const printWindow = window.open('', '_blank');
      
      const fullDoc = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <title>${title}</title>
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
              * { box-sizing: border-box; margin: 0; padding: 0; }
              body {
                font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
                background: #ffffff !important;
                color: #0f172a !important;
                padding: 30px;
                font-size: 12px;
                line-height: 1.5;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              @page {
                size: A4 portrait;
                margin: 10mm;
              }
              .no-print {
                background: #0f172a;
                color: #ffffff;
                padding: 12px 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                border-radius: 8px;
                font-family: system-ui, sans-serif;
              }
              .no-print button {
                background: #6366f1;
                color: #ffffff;
                border: none;
                padding: 8px 16px;
                border-radius: 6px;
                font-weight: 700;
                cursor: pointer;
                font-size: 13px;
              }
              @media print {
                .no-print { display: none !important; }
                body { padding: 0 !important; }
              }
              table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
              th, td { padding: 8px 10px; text-align: left; }
              tr { page-break-inside: avoid; }
            </style>
          </head>
          <body>
            <div class="no-print">
              <span style="font-weight: 700; font-size: 14px;">📄 Rifat Finance Console PDF Statement</span>
              <div style="display: flex; gap: 10px;">
                <button onclick="window.print()">📥 Save as PDF / Print</button>
                <button onclick="window.close()" style="background: #334155;">✖ Close</button>
              </div>
            </div>
            ${htmlContent}
            <script>
              window.onload = function() {
                setTimeout(function() {
                  window.print();
                }, 300);
              };
            </script>
          </body>
        </html>
      `;

      if (printWindow) {
        printWindow.document.open();
        printWindow.document.write(fullDoc);
        printWindow.document.close();
        showToast('Vector PDF Statement ready! Click Save as PDF.', 'success');
      } else {
        printWithIframe(htmlContent, title);
      }
    } catch (err) {
      printWithIframe(htmlContent, title);
    }
  };

  const printMonthPDF = (m: IWalletMonthData) => {
    const totalIncome = getIncomeTotal(m);
    const totalExpense = getExpenseTotal(m);
    const netSavings = getSavings(m);
    const activeLoans = getActiveLoansTotal(m);
    const returnedLoans = getReturnedLoansTotal(m);
    const netBalance = getNetBalance(m);
    const savingsRate = totalIncome > 0 ? ((netSavings / totalIncome) * 100).toFixed(1) : '0.0';

    const htmlContent = `
      <div style="font-family: 'Plus Jakarta Sans', sans-serif; color: #1e293b; background: #ffffff; padding: 24px; line-height: 1.5;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 16px; margin-bottom: 24px;">
          <div>
            <h1 style="margin: 0; font-size: 22px; font-weight: 800; color: #4f46e5;">RIFAT FINANCE CONSOLE</h1>
            <p style="margin: 4px 0 0 0; font-size: 10px; color: #64748b; text-transform: uppercase; letter-spacing: 1px;">Personal Wallet & Debt Ledger</p>
          </div>
          <div style="text-align: right;">
            <h2 style="margin: 0; font-size: 16px; font-weight: 700; color: #0f172a;">Monthly Statement</h2>
            <p style="margin: 4px 0 0 0; font-size: 11px; color: #64748b;">Period: ${m.monthName}</p>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 24px;">
          <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px; background: #f8fafc;">
            <div style="font-size: 9px; color: #64748b; text-transform: uppercase; font-weight: 600; margin-bottom: 4px;">Total Income</div>
            <div style="font-size: 14px; font-weight: 700; color: #16a34a;">৳${totalIncome.toLocaleString()}</div>
          </div>
          <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px; background: #f8fafc;">
            <div style="font-size: 9px; color: #64748b; text-transform: uppercase; font-weight: 600; margin-bottom: 4px;">Total Outlays</div>
            <div style="font-size: 14px; font-weight: 700; color: #dc2626;">৳${totalExpense.toLocaleString()}</div>
          </div>
          <div style="border: 1px solid #fed7aa; border-radius: 8px; padding: 10px; background: #fff7ed;">
            <div style="font-size: 9px; color: #c2410c; text-transform: uppercase; font-weight: 600; margin-bottom: 4px;">Active Money Lent</div>
            <div style="font-size: 14px; font-weight: 700; color: #ea580c;">৳${activeLoans.toLocaleString()}</div>
          </div>
          <div style="border: 1px solid #c7d2fe; border-radius: 8px; padding: 10px; background: #e0e7ff;">
            <div style="font-size: 9px; color: #3730a3; text-transform: uppercase; font-weight: 600; margin-bottom: 4px;">Net Cash Balance</div>
            <div style="font-size: 14px; font-weight: 700; color: #3730a3;">৳${netBalance.toLocaleString()}</div>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 24px;">
          <div style="padding: 10px; border: 1px solid #e2e8f0; border-radius: 6px; background: #ffffff;">
            <div style="font-size: 9px; color: #64748b; font-weight:600; text-transform:uppercase;">Base Salary</div>
            <div style="font-size: 13px; font-weight:700; color:#334155;">৳${m.salary.toLocaleString()}</div>
          </div>
          <div style="padding: 10px; border: 1px solid #e2e8f0; border-radius: 6px; background: #ffffff;">
            <div style="font-size: 9px; color: #64748b; font-weight:600; text-transform:uppercase;">Freelance Add-on</div>
            <div style="font-size: 13px; font-weight:700; color:#334155;">৳${m.addon.toLocaleString()}</div>
          </div>
          <div style="padding: 10px; border: 1px solid #e2e8f0; border-radius: 6px; background: #ffffff;">
            <div style="font-size: 9px; color: #64748b; font-weight:600; text-transform:uppercase;">Recovered Loans</div>
            <div style="font-size: 13px; font-weight:700; color:#16a34a;">৳${returnedLoans.toLocaleString()}</div>
          </div>
        </div>

        <div style="margin-top: 10px;">
          <h3 style="font-size: 13px; font-weight: 700; color: #0f172a; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Expenditure Ledger</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr style="background: #f1f5f9; border-bottom: 2px solid #e2e8f0;">
                <th style="color: #475569; text-align: left; font-size: 10px; font-weight: 700; text-transform: uppercase; padding: 10px;">Date</th>
                <th style="color: #475569; text-align: left; font-size: 10px; font-weight: 700; text-transform: uppercase; padding: 10px;">Category</th>
                <th style="color: #475569; text-align: left; font-size: 10px; font-weight: 700; text-transform: uppercase; padding: 10px;">Description</th>
                <th style="color: #475569; text-align: right; font-size: 10px; font-weight: 700; text-transform: uppercase; padding: 10px;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${(m.expenses || []).length === 0 ? `
                <tr>
                  <td colspan="4" style="text-align: center; color: #94a3b8; padding: 20px; font-size: 12px;">No expenditures registered for this month.</td>
                </tr>
              ` : (m.expenses || []).map(e => `
                <tr style="border-bottom: 1px solid #e2e8f0;">
                  <td style="padding: 10px; font-size: 11px;">${new Date(e.date).toLocaleDateString()}</td>
                  <td style="padding: 10px; font-size: 11px;"><span style="display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 9px; font-weight: 700; text-transform: uppercase; background: #e2e8f0; color: #475569;">${e.category}</span></td>
                  <td style="padding: 10px; font-size: 11px; color: #334155;">${e.description}</td>
                  <td style="padding: 10px; font-size: 11px; text-align: right; font-weight: 600; color: #0f172a;">৳${e.amount.toLocaleString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div style="margin-top: 20px;">
          <h3 style="font-size: 13px; font-weight: 700; color: #0f172a; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Money Lent Ledger (ধারের হিসাব)</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr style="background: #fff7ed; border-bottom: 2px solid #fed7aa;">
                <th style="color: #9a3412; text-align: left; font-size: 10px; font-weight: 700; text-transform: uppercase; padding: 10px;">Debtor Name</th>
                <th style="color: #9a3412; text-align: left; font-size: 10px; font-weight: 700; text-transform: uppercase; padding: 10px;">Date Given</th>
                <th style="color: #9a3412; text-align: left; font-size: 10px; font-weight: 700; text-transform: uppercase; padding: 10px;">Due Date</th>
                <th style="color: #9a3412; text-align: left; font-size: 10px; font-weight: 700; text-transform: uppercase; padding: 10px;">Status</th>
                <th style="color: #9a3412; text-align: right; font-size: 10px; font-weight: 700; text-transform: uppercase; padding: 10px;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${(m.loans || []).length === 0 ? `
                <tr>
                  <td colspan="5" style="text-align: center; color: #94a3b8; padding: 20px; font-size: 12px;">No loan records registered for this month.</td>
                </tr>
              ` : (m.loans || []).map(l => `
                <tr style="border-bottom: 1px solid #e2e8f0;">
                  <td style="padding: 10px; font-size: 11px; font-weight: 700; color: #0f172a;">${l.personName}</td>
                  <td style="padding: 10px; font-size: 11px;">${new Date(l.date).toLocaleDateString()}</td>
                  <td style="padding: 10px; font-size: 11px;">${l.dueDate ? new Date(l.dueDate).toLocaleDateString() : 'N/A'}</td>
                  <td style="padding: 10px; font-size: 11px;">
                    <span style="display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 9px; font-weight: 700; text-transform: uppercase; background: ${l.status === 'Pending' ? '#ffedd5; color: #c2410c;' : '#dcfce7; color: #15803d;'}">
                      ${l.status}
                    </span>
                  </td>
                  <td style="padding: 10px; font-size: 11px; text-align: right; font-weight: 700; color: #0f172a;">৳${l.amount.toLocaleString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div style="margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 16px; text-align: center; font-size: 10px; color: #94a3b8;">
          Generated automatically by Rifat Finance Console on ${new Date().toLocaleDateString()}
        </div>
      </div>
    `;
    downloadPDFHelper(htmlContent, `Finance_Statement_${m.monthName.replace(/\s+/g, '_')}.pdf`);
  };

  const printGlobalPDF = () => {
    if (months.length === 0) {
      showToast('No monthly datasets available to consolidate.', 'error');
      return;
    }

    const totalIncome = months.reduce((acc, m) => acc + getIncomeTotal(m), 0);
    const totalExpense = months.reduce((acc, m) => acc + getExpenseTotal(m), 0);
    const netSavings = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? ((netSavings / totalIncome) * 100).toFixed(1) : '0.0';

    const htmlContent = `
      <div style="font-family: 'Plus Jakarta Sans', sans-serif; color: #1e293b; background: #ffffff; padding: 24px; line-height: 1.5;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 16px; margin-bottom: 24px;">
          <div>
            <h1 style="margin: 0; font-size: 22px; font-weight: 800; color: #4f46e5;">RIFAT FINANCE CONSOLE</h1>
            <p style="margin: 4px 0 0 0; font-size: 10px; color: #64748b; text-transform: uppercase; letter-spacing: 1px;">Personal Wallet Ledger</p>
          </div>
          <div style="text-align: right;">
            <h2 style="margin: 0; font-size: 16px; font-weight: 700; color: #0f172a;">Global Portfolio Statement</h2>
            <p style="margin: 4px 0 0 0; font-size: 11px; color: #64748b;">Consolidated Periods Overview</p>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 24px;">
          <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; background: #f8fafc;">
            <div style="font-size: 10px; color: #64748b; text-transform: uppercase; font-weight: 600; margin-bottom: 4px;">Cumulative Income</div>
            <div style="font-size: 16px; font-weight: 700; color: #0f172a;">৳${totalIncome.toLocaleString()}</div>
          </div>
          <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; background: #f8fafc;">
            <div style="font-size: 10px; color: #64748b; text-transform: uppercase; font-weight: 600; margin-bottom: 4px;">Cumulative Expenses</div>
            <div style="font-size: 16px; font-weight: 700; color: #0f172a;">৳${totalExpense.toLocaleString()}</div>
          </div>
          <div style="border: 1px solid #c7d2fe; border-radius: 8px; padding: 12px; background: #e0e7ff;">
            <div style="font-size: 10px; color: #3730a3; text-transform: uppercase; font-weight: 600; margin-bottom: 4px;">Overall Net Savings (${savingsRate}%)</div>
            <div style="font-size: 16px; font-weight: 700; color: #3730a3;">৳${netSavings.toLocaleString()}</div>
          </div>
        </div>

        <div style="margin-top: 10px;">
          <h3 style="font-size: 13px; font-weight: 700; color: #0f172a; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Period Summary Matrix</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr style="background: #f1f5f9; border-bottom: 2px solid #e2e8f0;">
                <th style="color: #475569; text-align: left; font-size: 9px; font-weight: 700; text-transform: uppercase; padding: 8px;">Month</th>
                <th style="color: #475569; text-align: right; font-size: 9px; font-weight: 700; text-transform: uppercase; padding: 8px;">Base Salary</th>
                <th style="color: #475569; text-align: right; font-size: 9px; font-weight: 700; text-transform: uppercase; padding: 8px;">Add-on</th>
                <th style="color: #475569; text-align: right; font-size: 9px; font-weight: 700; text-transform: uppercase; padding: 8px;">Bonus</th>
                <th style="color: #475569; text-align: right; font-size: 9px; font-weight: 700; text-transform: uppercase; padding: 8px;">Total Earnings</th>
                <th style="color: #475569; text-align: right; font-size: 9px; font-weight: 700; text-transform: uppercase; padding: 8px;">Total Outlays</th>
                <th style="color: #475569; text-align: right; font-size: 9px; font-weight: 700; text-transform: uppercase; padding: 8px;">Savings</th>
                <th style="color: #475569; text-align: right; font-size: 9px; font-weight: 700; text-transform: uppercase; padding: 8px;">Savings Rate</th>
              </tr>
            </thead>
            <tbody>
              ${months.map(m => {
                const inc = getIncomeTotal(m);
                const exp = getExpenseTotal(m);
                const sav = getSavings(m);
                const rate = inc > 0 ? ((sav / inc) * 100).toFixed(0) : '0';
                return `
                  <tr style="border-bottom: 1px solid #e2e8f0;">
                    <td style="padding: 8px; font-size: 11px; font-weight: 700; color: #0f172a;">${m.monthName}</td>
                    <td style="padding: 8px; font-size: 11px; text-align: right;">৳${m.salary.toLocaleString()}</td>
                    <td style="padding: 8px; font-size: 11px; text-align: right;">৳${m.addon.toLocaleString()}</td>
                    <td style="padding: 8px; font-size: 11px; text-align: right;">৳${m.bonus.toLocaleString()}</td>
                    <td style="padding: 8px; font-size: 11px; text-align: right; font-weight: 600; color: #0f172a;">৳${inc.toLocaleString()}</td>
                    <td style="padding: 8px; font-size: 11px; text-align: right; color: #dc2626;">৳${exp.toLocaleString()}</td>
                    <td style="padding: 8px; font-size: 11px; text-align: right; font-weight: 600; color: #16a34a;">৳${sav.toLocaleString()}</td>
                    <td style="padding: 8px; font-size: 11px; text-align: right; font-weight: 700; color: #4f46e5;">${rate}%</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>

        <div style="margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 16px; text-align: center; font-size: 10px; color: #94a3b8;">
          Consolidated Portfolio Ledger Summary • Generated on ${new Date().toLocaleDateString()}
        </div>
      </div>
    `;
    downloadPDFHelper(htmlContent, `Global_Financial_Consolidated_Statement.pdf`);
  };

  // CRUD functions
  const handleAddMonth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!monthName) return showToast('Month name is required', 'error');
    try {
      const res = await fetch('/api/admin/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          monthName,
          salary: Number(salary) || 0,
          addon: Number(addon) || 0,
          bonus: Number(bonus) || 0,
        })
      });
      const data = await res.json();
      if (res.ok) {
        showToast('Month sheet created successfully!', 'success');
        setMonths(prev => [...prev, data]);
        setSelectedMonthId(data._id);
        setIsAddMonthOpen(false);
        // Reset inputs
        setMonthName('');
        setSalary('');
        setAddon('');
        setBonus('');
      } else {
        showToast(data.error || 'Failed to create month sheet', 'error');
      }
    } catch (err) {
      showToast('Error saving month', 'error');
    }
  };

  const handleEditMonth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeMonth) return;
    try {
      const res = await fetch(`/api/admin/wallet/${activeMonth._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          monthName: monthName.trim(),
          salary: Number(salary) || 0,
          addon: Number(addon) || 0,
          bonus: Number(bonus) || 0,
        })
      });
      const data = await res.json();
      if (res.ok) {
        showToast('Month sheet settings updated successfully', 'success');
        setMonths(prev => prev.map(m => m._id === data._id ? data : m));
        setIsEditMonthOpen(false);
      } else {
        showToast(data.error || 'Failed to update month settings', 'error');
      }
    } catch (err) {
      showToast('Error saving data', 'error');
    }
  };

  const handleDeleteMonth = async () => {
    if (!activeMonth) return;
    if (!confirm(`Are you sure you want to delete the financial sheet for ${activeMonth.monthName}?`)) return;
    try {
      const res = await fetch(`/api/admin/wallet/${activeMonth._id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Month sheet deleted', 'success');
        const remaining = months.filter(m => m._id !== activeMonth._id);
        setMonths(remaining);
        setSelectedMonthId(remaining.length > 0 ? remaining[remaining.length - 1]._id : '');
      } else {
        showToast('Failed to delete sheet', 'error');
      }
    } catch (err) {
      showToast('Error deleting sheet', 'error');
    }
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeMonth || !expDesc || !expAmount) return showToast('Please enter description and amount', 'error');
    
    const finalCategory = expCategory === 'Other' && customCategory.trim() !== '' ? customCategory.trim() : expCategory;
    const newExpense: IWalletExpense = {
      description: expDesc,
      amount: Number(expAmount) || 0,
      category: finalCategory,
      date: expDate || new Date().toISOString().split('T')[0],
    };

    const updatedExpenses = [...(activeMonth.expenses || []), newExpense];

    try {
      const res = await fetch(`/api/admin/wallet/${activeMonth._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expenses: updatedExpenses })
      });
      const data = await res.json();
      if (res.ok) {
        showToast('Expense logged successfully', 'success');
        setMonths(prev => prev.map(m => m._id === data._id ? data : m));
        setIsAddExpenseOpen(false);
        // Reset
        setExpDesc('');
        setExpAmount('');
        setExpCategory('Food');
        setCustomCategory('');
        setExpDate('');
      } else {
        showToast(data.error || 'Failed to save expense', 'error');
      }
    } catch (err) {
      showToast('Error logging expense', 'error');
    }
  };

  const handleEditExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeMonth || !editingExpenseId || !expDesc || !expAmount) return;

    const finalCategory = expCategory === 'Other' && customCategory.trim() !== '' ? customCategory.trim() : expCategory;
    const updatedExpenses = activeMonth.expenses.map(exp => {
      if (exp._id === editingExpenseId) {
        return {
          ...exp,
          description: expDesc,
          amount: Number(expAmount) || 0,
          category: finalCategory,
          date: expDate || exp.date,
        };
      }
      return exp;
    });

    try {
      const res = await fetch(`/api/admin/wallet/${activeMonth._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expenses: updatedExpenses })
      });
      const data = await res.json();
      if (res.ok) {
        showToast('Expense updated', 'success');
        setMonths(prev => prev.map(m => m._id === data._id ? data : m));
        setIsEditExpenseOpen(false);
        setEditingExpenseId('');
        // Reset
        setExpDesc('');
        setExpAmount('');
        setExpCategory('Food');
        setCustomCategory('');
        setExpDate('');
      } else {
        showToast(data.error || 'Failed to update expense', 'error');
      }
    } catch (err) {
      showToast('Error saving changes', 'error');
    }
  };

  const handleDeleteExpense = async (expenseId: string) => {
    if (!activeMonth) return;
    if (!confirm('Are you sure you want to delete this expense record?')) return;

    const updatedExpenses = activeMonth.expenses.filter(exp => exp._id !== expenseId);

    try {
      const res = await fetch(`/api/admin/wallet/${activeMonth._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expenses: updatedExpenses })
      });
      const data = await res.json();
      if (res.ok) {
        showToast('Expense record removed', 'success');
        setMonths(prev => prev.map(m => m._id === data._id ? data : m));
      } else {
        showToast('Failed to remove expense', 'error');
      }
    } catch (err) {
      showToast('Error removing expense', 'error');
    }
  };

  const handleAddIncome = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeMonth || !incDesc || !incAmount) return showToast('Please enter description and amount', 'error');

    const finalCategory = incCategory === 'Other' && customIncCategory.trim() !== '' ? customIncCategory.trim() : incCategory;
    const newIncome: IWalletIncome = {
      description: incDesc,
      amount: Number(incAmount) || 0,
      category: finalCategory,
      date: incDate || new Date().toISOString().split('T')[0],
    };

    const updatedIncomes = [...(activeMonth.incomes || []), newIncome];

    try {
      const res = await fetch(`/api/admin/wallet/${activeMonth._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ incomes: updatedIncomes })
      });
      const data = await res.json();
      if (res.ok) {
        showToast('Income logged successfully', 'success');
        setMonths(prev => prev.map(m => m._id === data._id ? data : m));
        setIsAddIncomeOpen(false);
        // Reset
        setIncDesc('');
        setIncAmount('');
        setIncCategory('Freelance');
        setCustomIncCategory('');
        setIncDate('');
      } else {
        showToast(data.error || 'Failed to save income', 'error');
      }
    } catch (err) {
      showToast('Error logging income', 'error');
    }
  };

  const handleEditIncome = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeMonth || !editingIncomeId || !incDesc || !incAmount) return;

    const finalCategory = incCategory === 'Other' && customIncCategory.trim() !== '' ? customIncCategory.trim() : incCategory;
    const updatedIncomes = (activeMonth.incomes || []).map(inc => {
      if (inc._id === editingIncomeId) {
        return {
          ...inc,
          description: incDesc,
          amount: Number(incAmount) || 0,
          category: finalCategory,
          date: incDate || inc.date,
        };
      }
      return inc;
    });

    try {
      const res = await fetch(`/api/admin/wallet/${activeMonth._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ incomes: updatedIncomes })
      });
      const data = await res.json();
      if (res.ok) {
        showToast('Income updated', 'success');
        setMonths(prev => prev.map(m => m._id === data._id ? data : m));
        setIsEditIncomeOpen(false);
        setEditingIncomeId('');
        // Reset
        setIncDesc('');
        setIncAmount('');
        setIncCategory('Freelance');
        setCustomIncCategory('');
        setIncDate('');
      } else {
        showToast(data.error || 'Failed to update income', 'error');
      }
    } catch (err) {
      showToast('Error saving changes', 'error');
    }
  };

  const handleDeleteIncome = async (incomeId: string) => {
    if (!activeMonth) return;
    if (!confirm('Are you sure you want to delete this income record?')) return;

    const updatedIncomes = (activeMonth.incomes || []).filter(inc => inc._id !== incomeId);

    try {
      const res = await fetch(`/api/admin/wallet/${activeMonth._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ incomes: updatedIncomes })
      });
      const data = await res.json();
      if (res.ok) {
        showToast('Income record removed', 'success');
        setMonths(prev => prev.map(m => m._id === data._id ? data : m));
      } else {
        showToast('Failed to remove income', 'error');
      }
    } catch (err) {
      showToast('Error removing income', 'error');
    }
  };

  const openEditIncomeItemModal = (inc: IWalletIncome) => {
    if (!inc._id) return;
    const standardCategories = ['Salary', 'Freelance', 'Bonus'];
    setEditingIncomeId(inc._id);
    setIncDesc(inc.description);
    setIncAmount(String(inc.amount));
    setIncCategory(standardCategories.includes(inc.category) ? inc.category : 'Other');
    setCustomIncCategory(standardCategories.includes(inc.category) ? '' : inc.category);
    setIncDate(new Date(inc.date).toISOString().split('T')[0]);
    setIsEditIncomeOpen(true);
  };

  const openEditExpenseModal = (exp: IWalletExpense) => {
    if (!exp._id) return;
    setEditingExpenseId(exp._id);
    setExpDesc(exp.description);
    setExpAmount(String(exp.amount));
    setExpCategory(categoriesList.includes(exp.category) ? exp.category : 'Other');
    setCustomCategory(categoriesList.includes(exp.category) ? '' : exp.category);
    setExpDate(new Date(exp.date).toISOString().split('T')[0]);
    setIsEditExpenseOpen(true);
  };

  const handleAddLoan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeMonth || !loanPersonName || !loanAmount) return showToast('Please enter person name and amount', 'error');

    const newLoan: IWalletLoan = {
      personName: loanPersonName.trim(),
      amount: Number(loanAmount) || 0,
      date: loanDate || new Date().toISOString().split('T')[0],
      dueDate: loanDueDate || undefined,
      status: loanStatus,
      notes: loanNotes.trim(),
      returnedDate: loanStatus === 'Returned' ? new Date().toISOString().split('T')[0] : undefined,
    };

    const updatedLoans = [...(activeMonth.loans || []), newLoan];

    try {
      const res = await fetch(`/api/admin/wallet/${activeMonth._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loans: updatedLoans })
      });
      const data = await res.json();
      if (res.ok) {
        showToast(`Loan logged for ${loanPersonName.trim()}! Amount deducted from main balance.`, 'success');
        setMonths(prev => prev.map(m => m._id === data._id ? data : m));
        setIsAddLoanOpen(false);
        setLoanPersonName('');
        setLoanAmount('');
        setLoanDate('');
        setLoanDueDate('');
        setLoanNotes('');
        setLoanStatus('Pending');
      } else {
        showToast(data.error || 'Failed to save loan record', 'error');
      }
    } catch (err) {
      showToast('Error saving loan record', 'error');
    }
  };

  const handleEditLoan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeMonth || !editingLoanId || !loanPersonName || !loanAmount) return;

    const updatedLoans = (activeMonth.loans || []).map(loan => {
      if (loan._id === editingLoanId) {
        const isNowReturned = loanStatus === 'Returned';
        const wasReturned = loan.status === 'Returned';
        let retDate = loan.returnedDate;
        if (isNowReturned && !wasReturned) {
          retDate = new Date().toISOString().split('T')[0];
        } else if (!isNowReturned) {
          retDate = undefined;
        }

        return {
          ...loan,
          personName: loanPersonName.trim(),
          amount: Number(loanAmount) || 0,
          date: loanDate || loan.date,
          dueDate: loanDueDate || undefined,
          status: loanStatus,
          returnedDate: retDate,
          notes: loanNotes.trim(),
        };
      }
      return loan;
    });

    try {
      const res = await fetch(`/api/admin/wallet/${activeMonth._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loans: updatedLoans })
      });
      const data = await res.json();
      if (res.ok) {
        showToast('Loan record updated successfully', 'success');
        setMonths(prev => prev.map(m => m._id === data._id ? data : m));
        setIsEditLoanOpen(false);
        setEditingLoanId('');
        setLoanPersonName('');
        setLoanAmount('');
        setLoanDate('');
        setLoanDueDate('');
        setLoanNotes('');
        setLoanStatus('Pending');
      } else {
        showToast(data.error || 'Failed to update loan record', 'error');
      }
    } catch (err) {
      showToast('Error saving changes', 'error');
    }
  };

  const handleDeleteLoan = async (loanId: string) => {
    if (!activeMonth) return;
    if (!confirm('Are you sure you want to delete this loan record?')) return;

    const updatedLoans = (activeMonth.loans || []).filter(loan => loan._id !== loanId);

    try {
      const res = await fetch(`/api/admin/wallet/${activeMonth._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loans: updatedLoans })
      });
      const data = await res.json();
      if (res.ok) {
        showToast('Loan record removed', 'success');
        setMonths(prev => prev.map(m => m._id === data._id ? data : m));
      } else {
        showToast('Failed to remove loan record', 'error');
      }
    } catch (err) {
      showToast('Error removing loan record', 'error');
    }
  };

  const handleToggleLoanStatus = async (loan: IWalletLoan) => {
    if (!activeMonth || !loan._id) return;

    const newStatus = loan.status === 'Pending' ? 'Returned' : 'Pending';
    const returnedDate = newStatus === 'Returned' ? new Date().toISOString().split('T')[0] : undefined;

    const updatedLoans = (activeMonth.loans || []).map(l => {
      if (l._id === loan._id) {
        return {
          ...l,
          status: newStatus as 'Pending' | 'Returned',
          returnedDate: returnedDate,
        };
      }
      return l;
    });

    // ⚡ Optimistic UI Update for instant 0ms feedback!
    const previousMonths = [...months];
    setMonths(prev => prev.map(m => m._id === activeMonth._id ? { ...m, loans: updatedLoans } : m));

    if (newStatus === 'Returned') {
      showToast(`🎉 ৳${loan.amount.toLocaleString()} returned by ${loan.personName}! Added back to main balance.`, 'success');
    } else {
      showToast(`Loan status set to pending for ${loan.personName}. Deducted from main balance.`, 'info');
    }

    try {
      const res = await fetch(`/api/admin/wallet/${activeMonth._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loans: updatedLoans })
      });
      const data = await res.json();
      if (res.ok) {
        setMonths(prev => prev.map(m => m._id === data._id ? data : m));
      } else {
        // Rollback on error
        setMonths(previousMonths);
        showToast(data.error || 'Failed to toggle loan status', 'error');
      }
    } catch (err) {
      // Rollback on error
      setMonths(previousMonths);
      showToast('Error updating loan status', 'error');
    }
  };

  const openEditLoanModal = (loan: IWalletLoan) => {
    if (!loan._id) return;
    setEditingLoanId(loan._id);
    setLoanPersonName(loan.personName);
    setLoanAmount(String(loan.amount));
    setLoanDate(new Date(loan.date).toISOString().split('T')[0]);
    setLoanDueDate(loan.dueDate ? new Date(loan.dueDate).toISOString().split('T')[0] : '');
    setLoanNotes(loan.notes || '');
    setLoanStatus(loan.status);
    setIsEditLoanOpen(true);
  };

  const handleCopyReminder = (loan: IWalletLoan) => {
    const loanDateFormatted = new Date(loan.date).toLocaleDateString();
    const reminderText = `Salam ${loan.personName} bhai, hope you are well! Just a gentle reminder regarding the ৳${loan.amount.toLocaleString()} lent on ${loanDateFormatted}. Please let me know whenever convenient. Thanks!`;
    
    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(reminderText);
      showToast(`Reminder copied to clipboard for ${loan.personName}!`, 'success');
    } else {
      showToast(`Reminder message: "${reminderText}"`, 'info');
    }
  };

  const handleOpenWhatsApp = (loan: IWalletLoan) => {
    const loanDateFormatted = new Date(loan.date).toLocaleDateString();
    const reminderText = `Salam ${loan.personName} bhai, hope you are well! Just a gentle reminder regarding the ৳${loan.amount.toLocaleString()} lent on ${loanDateFormatted}. Please let me know whenever convenient. Thanks!`;
    const waUrl = `https://wa.me/?text=${encodeURIComponent(reminderText)}`;
    window.open(waUrl, '_blank');
    showToast(`Opening WhatsApp for ${loan.personName}...`, 'info');
  };

  // 👁️ Formatting Helper with Privacy Mode Support
  const fmtVal = (amount: number) => {
    if (privacyMode) return '৳ ••••••';
    return `৳${amount.toLocaleString()}`;
  };

  // 💼 Assets CRUD Handler (Persisted in MongoDB)
  const handleAddOrEditAsset = async () => {
    if (!assetName.trim() || !assetValue || isNaN(Number(assetValue))) {
      showToast('Please enter a valid asset name and numeric value', 'error');
      return;
    }
    const val = Number(assetValue);
    const growth = Number(assetGrowthRate) || 0;

    let updatedAssets: IAsset[];
    if (editingAssetId) {
      updatedAssets = assets.map(a => (a.id === editingAssetId || a._id === editingAssetId ? { ...a, name: assetName, category: assetCategory, value: val, growthRate: growth } : a));
    } else {
      const newAsset: IAsset = {
        id: Date.now().toString(),
        name: assetName,
        category: assetCategory,
        value: val,
        growthRate: growth
      };
      updatedAssets = [...assets, newAsset];
    }

    setAssets(updatedAssets);
    setIsAssetModalOpen(false);
    setEditingAssetId('');
    setAssetName('');
    setAssetValue('');
    setAssetGrowthRate('');

    if (activeMonth) {
      try {
        const res = await fetch(`/api/admin/wallet/${activeMonth._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ assets: updatedAssets }),
        });
        if (res.ok) {
          showToast('Asset saved and synced with database!', 'success');
          fetchMonths();
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      showToast(editingAssetId ? 'Asset updated!' : 'Asset added!', 'success');
    }
  };

  const handleDeleteAsset = async (id: string) => {
    const updated = assets.filter(a => a.id !== id && a._id !== id);
    setAssets(updated);
    if (activeMonth) {
      try {
        await fetch(`/api/admin/wallet/${activeMonth._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ assets: updated }),
        });
        fetchMonths();
      } catch (e) {
        console.error(e);
      }
    }
    showToast('Asset removed', 'info');
  };

  // 📥 Export Ledger to CSV
  const exportWalletCSV = () => {
    if (months.length === 0) {
      showToast('No wallet data available to export', 'error');
      return;
    }
    const headers = ['Month', 'Base Salary', 'Add-on', 'Bonus', 'Total Income', 'Total Expense', 'Net Savings', 'Savings Rate %'];
    const rows = months.map(m => {
      const inc = getIncomeTotal(m);
      const exp = getExpenseTotal(m);
      const net = inc - exp;
      const rate = inc > 0 ? ((net / inc) * 100).toFixed(1) : '0';
      return [
        `"${m.monthName}"`,
        m.salary,
        m.addon,
        m.bonus,
        inc,
        exp,
        net,
        `"${rate}%"`
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Personal_Wallet_Ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Wallet ledger exported to CSV successfully!', 'success');
  };

  // 📥 Export Complete Backup to JSON
  const exportWalletJSON = () => {
    if (months.length === 0) {
      showToast('No wallet data available to export', 'error');
      return;
    }
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(months, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', `Personal_Wallet_Backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Wallet backup exported to JSON successfully!', 'success');
  };

  // ✉️ Send Test Email Report to Inbox (mdrifayethossen@gmail.com & rifayet.cse@gmail.com)
  const handleSendTestEmailReport = async () => {
    setSendingEmailReport(true);
    showToast('🚀 Sending Test Email Digest to mdrifayethossen@gmail.com & rifayet.cse@gmail.com...', 'info');
    try {
      const res = await fetch('/api/admin/wallet/email-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emails: ['mdrifayethossen@gmail.com', 'rifayet.cse@gmail.com'],
          appPassword: customAppPassword
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('✉️ Test Email Digest successfully delivered to Inbox (mdrifayethossen@gmail.com & rifayet.cse@gmail.com)!', 'success');
      } else {
        if (data.error && (data.error.includes('Authentication') || data.error.includes('App Password') || data.error.includes('535'))) {
          showToast('⚠️ Gmail SMTP App Password required to send live emails. Opening SMTP Setup...', 'error');
          setIsSmtpModalOpen(true);
        } else {
          showToast(data.error || 'Failed to send email report', 'error');
        }
      }
    } catch (err) {
      showToast('Error sending email report', 'error');
    } finally {
      setSendingEmailReport(false);
    }
  };
  const [sendingTelegramPush, setSendingTelegramPush] = useState<boolean>(false);

  const handleSendTelegramPacePush = async () => {
    setSendingTelegramPush(true);
    showToast('🚀 Sending Daily Pace & Guidance push to Telegram Bot...', 'info');
    try {
      const res = await fetch('/api/admin/wallet/telegram-pace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetDailyCap }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('🤖 Daily Pace push sent to Telegram Bot successfully!', 'success');
      } else {
        showToast(data.error || 'Failed to send Telegram push', 'error');
      }
    } catch (err) {
      showToast('Error sending Telegram push notification', 'error');
    } finally {
      setSendingTelegramPush(false);
    }
  };

  const handlePushAiAdvisory = async (channel: 'email' | 'telegram' | 'all') => {
    showToast(`🚀 Pushing AI Advisory report via ${channel.toUpperCase()}...`, 'info');
    try {
      const res = await fetch('/api/admin/wallet/ai-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel,
          emails: ['mdrifayethossen@gmail.com', 'rifayet.cse@gmail.com'],
          appPassword: customAppPassword
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`🎉 AI Advisory report successfully pushed via ${channel.toUpperCase()}!`, 'success');
      } else {
        if (data.error && (data.error.includes('Authentication') || data.error.includes('App Password') || data.error.includes('535'))) {
          showToast('⚠️ Gmail SMTP App Password required. Opening SMTP Setup...', 'error');
          setIsSmtpModalOpen(true);
        } else {
          showToast(data.error || 'Failed to dispatch AI advisory report', 'error');
        }
      }
    } catch (err) {
      showToast('Error pushing AI advisory notification', 'error');
    }
  };

  const handleSaveDailyIntelSettings = async (newCap?: number, newBudgets?: Record<string, number>) => {
    if (!activeMonth) {
      showToast('No active month sheet selected', 'error');
      return;
    }
    const capToSave = newCap !== undefined ? newCap : targetDailyCap;
    const budgetsToSave = newBudgets !== undefined ? newBudgets : categoryBudgets;
    try {
      const res = await fetch(`/api/admin/wallet/${activeMonth._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetDailyCap: capToSave,
          categoryBudgets: budgetsToSave
        }),
      });
      if (res.ok) {
        showToast('Daily Pace & Guidance settings saved to MongoDB database!', 'success');
        fetchMonths();
      } else {
        showToast('Failed to save settings to database', 'error');
      }
    } catch (err) {
      console.error('Error saving daily intel settings:', err);
      showToast('Error connecting to database', 'error');
    }
  };

  // FX Rates relative to BDT
  const fxRates: { [key: string]: number } = {
    BDT: 1.0,
    USD: 122.50,
    EUR: 132.80,
    GBP: 158.40,
    CAD: 89.20,
    INR: 1.44,
    AED: 33.35,
  };

  // 🔒 Bulk Log Recurring Bills for Selected Month
  const handleBulkLogRecurringBills = async () => {
    if (!activeMonth) return;
    const existingDescs = (activeMonth.expenses || []).map(e => e.description.toLowerCase());
    const unloggedBills = recurringBills.filter(b => !existingDescs.includes(b.name.toLowerCase()));

    if (unloggedBills.length === 0) {
      showToast('All fixed recurring bills have already been logged for this month!', 'info');
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const newExpenses: IWalletExpense[] = unloggedBills.map(b => ({
      description: b.name,
      amount: b.amount,
      category: b.category,
      date: todayStr
    }));

    const updatedExpenses = [...(activeMonth.expenses || []), ...newExpenses];

    try {
      const res = await fetch(`/api/admin/wallet/${activeMonth._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expenses: updatedExpenses })
      });
      const data = await res.json();
      if (res.ok) {
        showToast(`🎉 Bulk logged ${unloggedBills.length} recurring bills for ${activeMonth.monthName}!`, 'success');
        setMonths(prev => prev.map(m => m._id === data._id ? data : m));
      } else {
        showToast(data.error || 'Failed to bulk log bills', 'error');
      }
    } catch (err) {
      showToast('Error bulk logging bills', 'error');
    }
  };

  // 🎯 Add or Update Savings Goal Jar (Persisted in MongoDB)
  const handleSaveGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeMonth) return;
    if (!goalName || !goalTarget) return showToast('Goal name and target amount are required', 'error');

    const currentGoals = activeMonth.savingsGoals || [];
    let updatedGoals: ISavingsGoal[] = [];

    if (editingGoalId) {
      updatedGoals = currentGoals.map(g => (g._id === editingGoalId || g.id === editingGoalId) ? {
        ...g,
        name: goalName,
        target: Number(goalTarget) || 0,
        current: Number(goalCurrent) || 0
      } : g);
    } else {
      const newGoal: ISavingsGoal = {
        id: String(Date.now()),
        name: goalName,
        target: Number(goalTarget) || 0,
        current: Number(goalCurrent) || 0,
        category: 'Gadgets'
      };
      updatedGoals = [...currentGoals, newGoal];
    }

    // ⚡ Optimistic UI Update
    setMonths(prev => prev.map(m => m._id === activeMonth._id ? { ...m, savingsGoals: updatedGoals } : m));

    try {
      const res = await fetch(`/api/admin/wallet/${activeMonth._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ savingsGoals: updatedGoals })
      });
      const data = await res.json();
      if (res.ok) {
        setMonths(prev => prev.map(m => m._id === data._id ? data : m));
        showToast(editingGoalId ? 'Savings goal updated & saved to Database!' : 'New Savings Goal Jar created & saved to Database!', 'success');
      } else {
        showToast(data.error || 'Failed to update goal jar', 'error');
      }
    } catch (err) {
      showToast('Error saving goal jar to database', 'error');
    }

    setIsGoalModalOpen(false);
    setGoalName('');
    setGoalTarget('');
    setGoalCurrent('');
    setEditingGoalId('');
  };

  const handleDeleteGoal = async (goalId: string) => {
    if (!activeMonth) return;
    if (!confirm('Are you sure you want to remove this Savings Goal Jar?')) return;

    const currentGoals = activeMonth.savingsGoals || [];
    const updatedGoals = currentGoals.filter(g => g._id !== goalId && g.id !== goalId);

    // ⚡ Optimistic UI Update
    setMonths(prev => prev.map(m => m._id === activeMonth._id ? { ...m, savingsGoals: updatedGoals } : m));

    try {
      const res = await fetch(`/api/admin/wallet/${activeMonth._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ savingsGoals: updatedGoals })
      });
      const data = await res.json();
      if (res.ok) {
        setMonths(prev => prev.map(m => m._id === data._id ? data : m));
        showToast('Savings Goal Jar permanently removed from Database', 'info');
      } else {
        showToast(data.error || 'Failed to delete goal jar', 'error');
      }
    } catch (err) {
      showToast('Error deleting goal jar from database', 'error');
    }
  };

  // 📥 Master Multi-Month Financial Database CSV Exporter
  const exportMasterCSV = () => {
    if (months.length === 0) return showToast('No months available to export', 'error');

    let csvContent = 'RIFAT PRIVATE FINANCE - MASTER PORTFOLIO DATABASE EXPORT\n';
    csvContent += `Export Date,${new Date().toLocaleDateString()}\n\n`;
    csvContent += 'MONTHLY CONSOLIDATED SUMMARY\n';
    csvContent += 'Month Name,Salary,Add-on,Bonus,Total Earnings,Total Spent,Net Savings,Savings Rate (%)\n';

    months.forEach(m => {
      const inc = getIncomeTotal(m);
      const exp = getExpenseTotal(m);
      const sav = getSavings(m);
      const rate = getSavingsRate(m).toFixed(1);
      csvContent += `"${m.monthName}",${m.salary},${m.addon},${m.bonus},${inc},${exp},${sav},${rate}\n`;
    });

    csvContent += '\nALL EXPENSE RECORDS ACROSS HISTORY\n';
    csvContent += 'Month,Date,Category,Description,Amount\n';
    months.forEach(m => {
      (m.expenses || []).forEach(e => {
        csvContent += `"${m.monthName}","${new Date(e.date).toLocaleDateString()}","${e.category}","${e.description.replace(/"/g, '""')}",${e.amount}\n`;
      });
    });

    csvContent += '\nALL MONEY LENT (DEBT) RECORDS\n';
    csvContent += 'Month,Debtor Name,Amount,Date Given,Due Date,Status,Notes\n';
    months.forEach(m => {
      (m.loans || []).forEach(l => {
        csvContent += `"${m.monthName}","${l.personName.replace(/"/g, '""')}",${l.amount},"${new Date(l.date).toLocaleDateString()}","${l.dueDate ? new Date(l.dueDate).toLocaleDateString() : 'N/A'}","${l.status}","${(l.notes || '').replace(/"/g, '""')}"\n`;
      });
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Master_Financial_Portfolio_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Master Multi-Month Database CSV downloaded successfully!', 'success');
  };

  // 📅 Date Formatting Helper
  const formatItemDate = (dateVal?: string | Date) => {
    if (!dateVal) return 'N/A';
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return 'N/A';
    
    const now = new Date();
    const isSameYear = d.getFullYear() === now.getFullYear();
    const isToday = d.toISOString().split('T')[0] === now.toISOString().split('T')[0];
    
    if (isToday) return 'Today';
    
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      ...(isSameYear ? {} : { year: 'numeric' })
    });
  };

  // ⚡ Quick Expense Presets
  const quickExpensePresets = [
    { name: 'Nasta / Snack', amount: 150, category: 'Food' },
    { name: 'Travel / Transport', amount: 60, category: 'Utility' },
    { name: 'Mess Deposit', amount: 500, category: 'Food' },
    { name: 'Wi-Fi / Internet', amount: 1000, category: 'Utility' },
    { name: 'Tea / Coffee', amount: 30, category: 'Food' },
  ];

  const handleQuickPresetClick = (preset: { name: string; amount: number; category: string }) => {
    setExpDesc(preset.name);
    setExpAmount(String(preset.amount));
    setExpCategory(categoriesList.includes(preset.category) ? preset.category : 'Other');
    setExpDate(new Date().toISOString().split('T')[0]);
    setIsAddExpenseOpen(true);
  };

  // 📊 Daily Spending Velocity & Outlay Pace
  const getDailyVelocity = (m: IWalletMonthData) => {
    const totalExp = getExpenseTotal(m);
    const dayOfMonth = new Date().getDate();
    return totalExp > 0 ? Math.round(totalExp / Math.max(1, dayOfMonth)) : 0;
  };

  // 📈 Month-over-Month Velocity Comparison Delta
  const getVelocityComparison = (activeM: IWalletMonthData) => {
    if (months.length <= 1) return null;
    const sortedM = [...months].sort((a, b) => new Date(a.monthName).getTime() - new Date(b.monthName).getTime());
    const currentIndex = sortedM.findIndex(m => m._id === activeM._id);
    if (currentIndex <= 0) return null;
    
    const prevM = sortedM[currentIndex - 1];
    const activeVel = getDailyVelocity(activeM);
    const prevVel = getDailyVelocity(prevM);

    if (prevVel === 0) return null;
    const diffPct = Math.round(((activeVel - prevVel) / prevVel) * 100);
    return {
      activeVel,
      prevVel,
      diffPct,
      isLower: activeVel < prevVel,
      prevMonthName: prevM.monthName
    };
  };

  const getLargestExpense = (m: IWalletMonthData) => {
    if (!m.expenses || m.expenses.length === 0) return null;
    return [...m.expenses].sort((a, b) => b.amount - a.amount)[0];
  };

  // Over-budget Category Alerts
  const getOverBudgetCategories = (m: IWalletMonthData) => {
    if (!m.expenses) return [];
    return categoriesList.filter(cat => {
      const spent = m.expenses.filter(e => e.category === cat).reduce((acc, curr) => acc + curr.amount, 0);
      const budget = categoryBudgets[cat] || 5000;
      return spent > budget;
    }).map(cat => {
      const spent = m.expenses.filter(e => e.category === cat).reduce((acc, curr) => acc + curr.amount, 0);
      const budget = categoryBudgets[cat] || 5000;
      return { category: cat, spent, budget, excess: spent - budget };
    });
  };

  // Get active month's category percentages
  const activeMonthCategoryTotals = categoriesList.reduce((acc, cat) => {
    const total = (activeMonth?.expenses || [])
      .filter(e => e.category === cat)
      .reduce((sum, e) => sum + e.amount, 0);
    acc[cat] = total;
    return acc;
  }, {} as { [key: string]: number });

  // Filter Ledger client-side (instantaneous loading search & date range)
  const filteredExpenses = (activeMonth?.expenses || []).filter(e => {
    const matchesSearch = e.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategoryFilter === 'All' || e.category === selectedCategoryFilter;
    
    let matchesRange = true;
    if (expenseDateRange !== 'all' && e.date) {
      const itemTime = new Date(e.date).getTime();
      const nowTime = new Date().getTime();
      const diffDays = (nowTime - itemTime) / (1000 * 60 * 60 * 24);
      if (expenseDateRange === '7days') matchesRange = diffDays <= 7 && diffDays >= 0;
      if (expenseDateRange === '30days') matchesRange = diffDays <= 30 && diffDays >= 0;
    }

    return matchesSearch && matchesCategory && matchesRange;
  });

  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    if (expSortBy === 'date_desc') return new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime();
    if (expSortBy === 'date_asc') return new Date(a.date || 0).getTime() - new Date(b.date || 0).getTime();
    if (expSortBy === 'amount_desc') return b.amount - a.amount;
    if (expSortBy === 'amount_asc') return a.amount - b.amount;
    return 0;
  });

  const sortedIncomes = [...(activeMonth?.incomes || [])].sort((a, b) => {
    if (incSortBy === 'date_desc') return new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime();
    if (incSortBy === 'date_asc') return new Date(a.date || 0).getTime() - new Date(b.date || 0).getTime();
    if (incSortBy === 'amount_desc') return b.amount - a.amount;
    if (incSortBy === 'amount_asc') return a.amount - b.amount;
    return 0;
  });

  const activeHealthScore = activeMonth ? getHealthScore(activeMonth) : 0;
  const activeHealthInfo = getHealthGrade(activeHealthScore);
  const activeMonthSavings = activeMonth ? getSavings(activeMonth) : 0;

  const activeSavingsGoals: ISavingsGoal[] = activeMonth?.savingsGoals || [];
  const activeRecurringBills: IRecurringBill[] = activeMonth?.recurringBills || [];

  // 📦 1-Click JSON Data Backup Engine
  const exportAllDataJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(months, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Wallet_Full_Backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Full Wallet JSON backup file downloaded!', 'success');
  };

  return (
    <div style={{ fontFamily: 'var(--font-sans)', color: '#ffffff', padding: '10px 4px', width: '100%', maxWidth: '100%', overflowX: 'hidden', boxSizing: 'border-box' }}>
      
      {/* HEADER SECTION */}
      <div className={styles.walletHeader}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Wallet size={28} style={{ color: 'var(--accent-gold)' }} /> Personal Wallet Ledger
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '4px 0 0' }}>
            Monitor side gig revenues, base salaries, bonuses, and detail monthly expenses.
          </p>
        </div>
        <div className={styles.walletHeaderBtns} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            onClick={() => {
              setPrivacyMode(!privacyMode);
              showToast(privacyMode ? 'Privacy Stealth Mode Disabled' : 'Privacy Stealth Mode Activated (Balances Hidden)', 'info');
            }}
            style={{
              background: privacyMode ? 'rgba(245, 158, 11, 0.15)' : 'rgba(15, 23, 42, 0.4)',
              border: '1px solid',
              borderColor: privacyMode ? 'var(--accent-gold)' : 'rgba(255,255,255,0.1)',
              color: privacyMode ? 'var(--accent-gold)' : 'var(--text-secondary)',
              padding: '10px 16px',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.82rem',
              transition: 'all 0.3s ease'
            }}
            title="Toggle Hide/Show Balances Privacy Mode"
          >
            {privacyMode ? <EyeOff size={15} /> : <Eye size={15} />}
            {privacyMode ? 'Stealth Mode On' : 'Privacy Mode'}
          </button>
          <button
            onClick={exportAllDataJSON}
            style={{
              background: 'rgba(15, 23, 42, 0.4)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'var(--text-secondary)',
              padding: '10px 16px',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.82rem'
            }}
            title="Download full database JSON backup"
          >
            <FileText size={15} /> Backup JSON
          </button>
          <button
            onClick={() => setIsAddMonthOpen(true)}
            style={{
              background: 'linear-gradient(135deg, #818cf8 0%, #4f46e5 100%)',
              color: '#fff',
              border: 'none',
              padding: '10px 18px',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(129, 140, 248, 0.3)'
            }}
          >
            <Plus size={16} /> Add Month Sheet
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-secondary)' }}>
          Connecting ledger databases...
        </div>
      ) : months.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', background: 'rgba(15, 23, 42, 0.25)', border: '1px dashed var(--glass-border)', borderRadius: '16px' }}>
          <Wallet size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px', opacity: 0.5 }} />
          <h3 style={{ margin: '0 0 8px', fontSize: '1.2rem', color: '#fff' }}>No Wallet Data Recorded</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', maxWidth: '380px', margin: '0 auto 20px' }}>
            Create your first month sheet to log revenues and detail your spending habits.
          </p>
          <button
            onClick={() => setIsAddMonthOpen(true)}
            style={{ background: 'transparent', border: '1px solid var(--accent-gold)', color: 'var(--accent-gold)', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
          >
            Create Month Sheet
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', maxWidth: '100%' }}>
          
          {/* Sub-navigation Tabs */}
          <div className={styles.walletTabs}>
            <button
              onClick={() => setWalletSubTab('single')}
              style={{
                background: walletSubTab === 'single' ? 'rgba(129, 140, 248, 0.15)' : 'transparent',
                border: '1px solid',
                borderColor: walletSubTab === 'single' ? 'var(--accent-gold)' : 'var(--glass-border-light)',
                color: walletSubTab === 'single' ? '#ffffff' : 'var(--text-secondary)',
                padding: '10px 20px',
                borderRadius: '8px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Wallet size={16} /> Monthly
            </button>
            <button
              onClick={() => setWalletSubTab('consolidated')}
              style={{
                background: walletSubTab === 'consolidated' ? 'rgba(129, 140, 248, 0.15)' : 'transparent',
                border: '1px solid',
                borderColor: walletSubTab === 'consolidated' ? 'var(--accent-gold)' : 'var(--glass-border-light)',
                color: walletSubTab === 'consolidated' ? '#ffffff' : 'var(--text-secondary)',
                padding: '10px 20px',
                borderRadius: '8px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Layers size={16} /> All Month
            </button>
            <button
              onClick={() => setWalletSubTab('global_summary')}
              style={{
                background: walletSubTab === 'global_summary' ? 'rgba(129, 140, 248, 0.15)' : 'transparent',
                border: '1px solid',
                borderColor: walletSubTab === 'global_summary' ? 'var(--accent-gold)' : 'var(--glass-border-light)',
                color: walletSubTab === 'global_summary' ? '#ffffff' : 'var(--text-secondary)',
                padding: '10px 20px',
                borderRadius: '8px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <TrendingUp size={16} /> Global Summary
            </button>

            <button
              onClick={() => setWalletSubTab('analytics')}
              style={{
                background: walletSubTab === 'analytics' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                border: '1px solid',
                borderColor: walletSubTab === 'analytics' ? '#10b981' : 'var(--glass-border-light)',
                color: walletSubTab === 'analytics' ? '#ffffff' : 'var(--text-secondary)',
                padding: '10px 20px',
                borderRadius: '8px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <PieChart size={16} style={{ color: '#10b981' }} /> Smart Analytics
            </button>

            <button
              onClick={() => setWalletSubTab('wealth_vault')}
              style={{
                background: walletSubTab === 'wealth_vault' ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
                border: '1px solid',
                borderColor: walletSubTab === 'wealth_vault' ? 'var(--accent-gold)' : 'var(--glass-border-light)',
                color: walletSubTab === 'wealth_vault' ? '#ffffff' : 'var(--text-secondary)',
                padding: '10px 20px',
                borderRadius: '8px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <PiggyBank size={16} style={{ color: 'var(--accent-gold)' }} /> Wealth Vault
            </button>

            <button
              onClick={() => setWalletSubTab('ai_advisor')}
              style={{
                background: walletSubTab === 'ai_advisor' ? 'rgba(129, 140, 248, 0.2)' : 'transparent',
                border: '1px solid',
                borderColor: walletSubTab === 'ai_advisor' ? 'var(--accent-gold)' : 'var(--glass-border-light)',
                color: walletSubTab === 'ai_advisor' ? '#ffffff' : 'var(--text-secondary)',
                padding: '10px 20px',
                borderRadius: '8px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Sparkles size={16} style={{ color: 'var(--accent-gold)' }} /> 🤖 AI Executive Copilot
            </button>

            <button
              onClick={() => setWalletSubTab('daily_intel')}
              style={{
                background: walletSubTab === 'daily_intel' ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
                border: '1px solid',
                borderColor: walletSubTab === 'daily_intel' ? 'var(--accent-gold)' : 'var(--glass-border-light)',
                color: walletSubTab === 'daily_intel' ? '#ffffff' : 'var(--text-secondary)',
                padding: '10px 20px',
                borderRadius: '8px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Zap size={16} style={{ color: 'var(--accent-gold)' }} /> Daily Pace & Guidance
            </button>

            <button
              onClick={() => setWalletSubTab('goals_debts')}
              style={{
                background: walletSubTab === 'goals_debts' ? 'rgba(236, 72, 153, 0.15)' : 'transparent',
                border: '1px solid',
                borderColor: walletSubTab === 'goals_debts' ? '#f472b6' : 'var(--glass-border-light)',
                color: walletSubTab === 'goals_debts' ? '#ffffff' : 'var(--text-secondary)',
                padding: '10px 20px',
                borderRadius: '8px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Target size={16} style={{ color: '#f472b6' }} /> Goals & Debt Audit
            </button>
          </div>

          {walletSubTab === 'single' && (
            <div className={styles.grid260_1fr}>
              
              {/* Months Selector Sidebar */}
              <div className={styles.walletCard} style={{ padding: '12px' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '14px', paddingLeft: '8px' }}>Months Sheets</div>
                <div className={styles.monthsListContainer}>
                  {months.map((m) => {
                    const isSelected = m._id === selectedMonthId;
                    const monthTotalInc = getIncomeTotal(m);
                    return (
                      <button
                        key={m._id}
                        onClick={() => {
                          setSelectedMonthId(m._id);
                          setSearchQuery('');
                          setSelectedCategoryFilter('All');
                        }}
                        style={{
                          background: isSelected ? 'rgba(129, 140, 248, 0.12)' : 'transparent',
                          border: '1px solid',
                          borderColor: isSelected ? 'rgba(129, 140, 248, 0.25)' : 'transparent',
                          color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                          padding: '12px 14px',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          textAlign: 'left',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '4px',
                          transition: 'all 0.25s ease'
                        }}
                      >
                        <span style={{ fontWeight: isSelected ? 700 : 500, fontSize: '0.9rem' }}>{m.monthName}</span>
                        <span style={{ fontSize: '0.72rem', color: isSelected ? 'var(--accent-gold)' : 'var(--text-muted)' }}>
                          Earned: ৳{monthTotalInc.toLocaleString()}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected Month Sheet details ledger */}
              {activeMonth ? (
                <div className={styles.walletCard}>
                  
                  {/* Upper toolbar actions */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '16px', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {activeMonth.monthName} Sheet
                        <button
                          onClick={() => {
                            setMonthName(activeMonth.monthName);
                            setSalary(String(activeMonth.salary || ''));
                            setAddon(String(activeMonth.addon || ''));
                            setBonus(String(activeMonth.bonus || ''));
                            setIsEditMonthOpen(true);
                          }}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-secondary)',
                            cursor: 'pointer',
                            padding: '4px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '6px',
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                          title="Edit Month Settings"
                        >
                          <Edit size={14} />
                        </button>
                      </h2>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Savings Rate: {getSavingsRate(activeMonth).toFixed(1)}%</span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => printMonthPDF(activeMonth)}
                        style={{ background: 'rgba(129,140,248,0.1)', border: '1px solid rgba(129,140,248,0.2)', color: '#818cf8', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 600 }}
                      >
                        <Download size={14} /> Download PDF
                      </button>
                      <button
                        onClick={() => exportMonthToCSV(activeMonth)}
                        style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#10b981', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 600 }}
                      >
                        Export CSV
                      </button>
                      <button
                        onClick={handleDeleteMonth}
                        style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}
                      >
                        <Trash2 size={14} /> Delete Month
                      </button>
                    </div>
                  </div>

                  {/* 💳 LUXURY 3D HOLOGRAPHIC EXECUTIVE ASSET CARD */}
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 27, 75, 0.9) 50%, rgba(15, 23, 42, 0.98) 100%)',
                    border: '1px solid rgba(212, 175, 55, 0.35)',
                    borderRadius: '16px',
                    padding: '24px',
                    marginBottom: '24px',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 12px 32px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.1)'
                  }}>
                    {/* Holographic glare glow */}
                    <div style={{
                      position: 'absolute',
                      top: '-50%',
                      right: '-30%',
                      width: '300px',
                      height: '300px',
                      background: 'radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, rgba(129, 140, 248, 0.08) 50%, transparent 80%)',
                      pointerEvents: 'none',
                      filter: 'blur(30px)'
                    }} />

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', position: 'relative', zIndex: 2 }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <span style={{ background: 'linear-gradient(90deg, #d4af37, #f3e5ab)', color: '#0f172a', fontSize: '0.65rem', fontWeight: 900, padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            👑 PRIVATE WEALTH • EXECUTIVE ASSET CARD
                          </span>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>ID: **** 3790</span>
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>
                          Available Net Cash Balance
                        </div>
                        <div style={{ fontSize: '2.2rem', fontWeight: 900, background: 'linear-gradient(135deg, #ffffff 0%, #d4af37 60%, #fef08a 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginTop: '4px' }}>
                          {fmtVal(getSavings(activeMonth))}
                        </div>
                      </div>

                      {/* Contactless & Action Pills */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '40px', height: '26px', background: 'linear-gradient(135deg, #fbbf24, #d97706)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <CreditCard size={16} style={{ color: '#0f172a' }} />
                          </div>
                          <Sparkles size={20} style={{ color: 'var(--accent-gold)' }} />
                        </div>
                        
                        <button
                          onClick={() => setIsVaultModalOpen(true)}
                          style={{
                            background: 'rgba(212, 175, 55, 0.15)',
                            border: '1px solid rgba(212, 175, 55, 0.35)',
                            color: '#fef08a',
                            padding: '6px 14px',
                            borderRadius: '8px',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            transition: 'all 0.2s ease'
                          }}
                          title="View Monthly Fixed Overhead Bills Vault"
                        >
                          <Lock size={13} style={{ color: 'var(--accent-gold)' }} /> Fixed Overhead Vault
                        </button>
                      </div>
                    </div>

                    {/* Card Footer Indicators */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '14px', marginTop: '16px', flexWrap: 'wrap', gap: '10px', fontSize: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
                        <span>⚡ Daily Pace: <strong style={{ color: '#fff' }}>{fmtVal(getDailyVelocity(activeMonth))}/day</strong></span>
                        {(() => {
                          const vComp = getVelocityComparison(activeMonth);
                          if (!vComp) return null;
                          return (
                            <span style={{ color: vComp.isLower ? '#34d399' : '#f87171', fontWeight: 700, background: vComp.isLower ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)', padding: '2px 8px', borderRadius: '4px', border: `1px solid ${vComp.isLower ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}` }}>
                              {vComp.isLower ? '📉 Pace Down' : '📈 Pace Up'} {Math.abs(vComp.diffPct)}% vs {vComp.prevMonthName}
                            </span>
                          );
                        })()}
                        <span>🛡️ Zero-Income Runway: <strong style={{ color: '#10b981' }}>{getExpenseTotal(activeMonth) > 0 ? Math.round(getSavings(activeMonth) / (getDailyVelocity(activeMonth) || 1)) : '∞'} Days</strong></span>
                      </div>
                      <div style={{ color: 'var(--accent-gold)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <ShieldCheck size={14} /> Sovereign Wealth Vault Active
                      </div>
                    </div>
                  </div>

                  {/* PREMIUM HUD: Score Ring, Forecast, recommendations alerts */}
                  <div className={styles.walletHudContainer}>
                    
                    {/* Gauge 1: Health Score Circular Gauge */}
                    <div className={styles.walletHudCol1}>
                      <div style={{ position: 'relative', width: '80px', height: '80px' }}>
                        <svg width="80" height="80" viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)', overflow: 'visible' }}>
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="rgba(255,255,255,0.05)"
                            strokeWidth="2"
                          />
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke={activeHealthInfo.color}
                            strokeWidth="2.5"
                            strokeDasharray={`${activeHealthScore}, 100`}
                            strokeLinecap="round"
                            style={{ filter: `drop-shadow(0 0 4px ${activeHealthInfo.color}40)` }}
                          />
                        </svg>
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: activeHealthInfo.color }}>{activeHealthScore}</span>
                          <span style={{ fontSize: '0.45rem', display: 'block', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Score</span>
                        </div>
                      </div>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: activeHealthInfo.color, marginTop: '8px', textAlign: 'center' }}>
                        {activeHealthInfo.grade}
                      </span>
                    </div>

                    {/* Smart Projections */}
                    <div className={styles.walletHudCol2}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>Future Net Worth Forecasts</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>6-Month Proj:</span>
                          <span style={{ fontWeight: 700, color: '#4caf50' }}>{fmtVal(activeMonthSavings * 6)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>12-Month Proj:</span>
                          <span style={{ fontWeight: 700, color: '#2196f3' }}>{fmtVal(activeMonthSavings * 12)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>5-Year Proj:</span>
                          <span style={{ fontWeight: 700, color: 'var(--accent-gold)' }}>{fmtVal(activeMonthSavings * 60)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Smart Automated Advice Alerts */}
                    <div className={styles.walletHudCol3}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>Ledger Insight Advisor</div>
                      <div style={{ marginTop: '8px', fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {getSmartRecommendations(activeMonth).map((rec, i) => (
                          <div key={i} style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
                            <span style={{ color: 'var(--accent-gold)', fontSize: '0.8rem' }}>•</span>
                            <span>{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* 📊 DYNAMIC CASHFLOW DISTRIBUTION WATERFALL BAR */}
                  {(() => {
                    const inc = getIncomeTotal(activeMonth);
                    if (inc === 0) return null;

                    const fixedCost = activeRecurringBills.reduce((acc, b) => acc + b.amount, 0);
                    const totalExp = getExpenseTotal(activeMonth);
                    const varExp = Math.max(0, totalExp - fixedCost);
                    const loansG = getActiveLoansTotal(activeMonth);
                    const netSav = Math.max(0, getSavings(activeMonth));

                    const fixedPct = Math.min(100, Math.round((fixedCost / inc) * 100));
                    const varPct = Math.min(100, Math.round((varExp / inc) * 100));
                    const loanPct = Math.min(100, Math.round((loansG / inc) * 100));
                    const savPct = Math.min(100, Math.round((netSav / inc) * 100));

                    return (
                      <div style={{ background: 'rgba(7, 8, 15, 0.4)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px', marginBottom: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                          <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Compass size={16} style={{ color: 'var(--accent-gold)' }} /> Active Cashflow Allocation Waterfall
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                            Gross Income Partition (100% = {fmtVal(inc)})
                          </div>
                        </div>

                        {/* Waterfall Multi-Segment Bar */}
                        <div style={{ height: '12px', background: 'rgba(255,255,255,0.06)', borderRadius: '6px', overflow: 'hidden', display: 'flex', marginBottom: '12px' }}>
                          {fixedPct > 0 && <div style={{ width: `${fixedPct}%`, background: '#f87171' }} title={`Fixed Overhead: ${fixedPct}%`} />}
                          {varPct > 0 && <div style={{ width: `${varPct}%`, background: '#fbbf24' }} title={`Variable Expenses: ${varPct}%`} />}
                          {loanPct > 0 && <div style={{ width: `${loanPct}%`, background: '#60a5fa' }} title={`Money Lent: ${loanPct}%`} />}
                          {savPct > 0 && <div style={{ width: `${savPct}%`, background: '#34d399' }} title={`Net Liquid Savings: ${savPct}%`} />}
                        </div>

                        {/* Legend Pills */}
                        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span style={{ width: 8, height: 8, background: '#f87171', borderRadius: '50%' }} />
                            Fixed Overhead: <strong style={{ color: '#fff' }}>{fixedPct}% ({fmtVal(fixedCost)})</strong>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span style={{ width: 8, height: 8, background: '#fbbf24', borderRadius: '50%' }} />
                            Variable Spending: <strong style={{ color: '#fff' }}>{varPct}% ({fmtVal(varExp)})</strong>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span style={{ width: 8, height: 8, background: '#60a5fa', borderRadius: '50%' }} />
                            Money Lent: <strong style={{ color: '#fff' }}>{loanPct}% ({fmtVal(loansG)})</strong>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span style={{ width: 8, height: 8, background: '#34d399', borderRadius: '50%' }} />
                            Net Savings: <strong style={{ color: '#34d399' }}>{savPct}% ({fmtVal(netSav)})</strong>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Over-spending Category Alert Banner */}
                  {(() => {
                    const overBudgets = getOverBudgetCategories(activeMonth);
                    if (overBudgets.length === 0) return null;
                    return (
                      <div style={{ marginBottom: '20px', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '12px', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <ShieldAlert size={24} style={{ color: '#ef4444', flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 800, color: '#fca5a5', fontSize: '0.88rem' }}>
                            ⚠️ Over-Budget Limit Alert! ({overBudgets.length} Category Exceeded)
                          </div>
                          <div style={{ fontSize: '0.78rem', color: '#f87171', marginTop: '2px' }}>
                            {overBudgets.map(b => `${b.category}: Spent ${fmtVal(b.spent)} (Limit ${fmtVal(b.budget)} • Over by ${fmtVal(b.excess)})`).join(' | ')}
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Sub-sheet metrics summary cards */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '24px' }}>
                    <div style={{ background: 'rgba(7, 8, 15, 0.25)', border: '1px solid rgba(52, 211, 153, 0.2)', borderRadius: '12px', padding: '16px' }}>
                      <div style={{ fontSize: '0.72rem', color: '#34d399', textTransform: 'uppercase', fontWeight: 700 }}>Opening Savings (বিগত মাসের জমা)</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#34d399', marginTop: '4px' }}>{fmtVal(getCarriedOverSavings(activeMonth))}</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        Carried over from previous month
                      </div>
                    </div>

                    <div style={{ background: 'rgba(7, 8, 15, 0.25)', border: '1px solid rgba(255, 255, 255, 0.03)', borderRadius: '12px', padding: '16px' }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>This Month Earned</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#4caf50', marginTop: '4px' }}>{fmtVal(getIncomeTotal(activeMonth))}</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        Salary: {fmtVal(getSalaryTotal(activeMonth))} • Side: {fmtVal(getAddonTotal(activeMonth))}
                      </div>
                    </div>

                    <div style={{ background: 'rgba(7, 8, 15, 0.25)', border: '1px solid rgba(255, 255, 255, 0.03)', borderRadius: '12px', padding: '16px' }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700, display: 'flex', justifyContent: 'space-between' }}>
                        <span>This Month Spent</span>
                        <span style={{ color: '#ff6b6b', fontWeight: 700 }}>{fmtVal(getDailyVelocity(activeMonth))}/day</span>
                      </div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f44336', marginTop: '4px' }}>{fmtVal(getExpenseTotal(activeMonth))}</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        {(activeMonth.expenses || []).length} items logged • Daily Avg Pace
                      </div>
                    </div>

                    <div style={{ background: 'rgba(7, 8, 15, 0.25)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '12px', padding: '16px' }}>
                      <div style={{ fontSize: '0.72rem', color: '#fbbf24', textTransform: 'uppercase', fontWeight: 700 }}>Active Money Lent (ধারে দেওয়া)</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fbbf24', marginTop: '4px' }}>{fmtVal(getActiveLoansTotal(activeMonth))}</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        Deducted from Savings • Recovered: {fmtVal(getReturnedLoansTotal(activeMonth))}
                      </div>
                    </div>

                    <div style={{ background: 'rgba(7, 8, 15, 0.25)', border: '1px solid rgba(129, 140, 248, 0.2)', borderRadius: '12px', padding: '16px' }}>
                      <div style={{ fontSize: '0.72rem', color: '#818cf8', textTransform: 'uppercase', fontWeight: 700 }}>Total Net Liquid Savings</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#818cf8', marginTop: '4px' }}>{fmtVal(getSavings(activeMonth))}</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        Gross Cashflow: {fmtVal(getGrossSavings(activeMonth))} • Rate: {getSavingsRate(activeMonth).toFixed(1)}%
                      </div>
                    </div>
                  </div>

                  {/* 2-Column Ledger Tables Grid */}
                  <div className={styles.grid2}>
                    
                    {/* Left Column: Incomes Ledger */}
                    <div className={styles.walletCard} style={{ background: 'rgba(7, 8, 15, 0.15)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <TrendingUp size={16} style={{ color: '#4caf50' }} /> Incomes Ledger
                        </h3>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                          <select
                            value={incSortBy}
                            onChange={e => setIncSortBy(e.target.value as any)}
                            style={{
                              padding: '4px 8px',
                              background: 'rgba(7,8,15,0.4)',
                              border: '1px solid rgba(255,255,255,0.06)',
                              borderRadius: '6px',
                              color: 'var(--text-secondary)',
                              fontSize: '0.72rem'
                            }}
                          >
                            <option value="date_desc">Date (Newest)</option>
                            <option value="date_asc">Date (Oldest)</option>
                            <option value="amount_desc">Amount (High-Low)</option>
                            <option value="amount_asc">Amount (Low-High)</option>
                          </select>
                          <button
                            onClick={() => {
                              setIncDesc('');
                              setIncAmount('');
                              setIncCategory('Freelance');
                              setCustomIncCategory('');
                              setIncDate(new Date().toISOString().split('T')[0]);
                              setIsAddIncomeOpen(true);
                            }}
                            style={{ background: 'rgba(76, 175, 80, 0.1)', border: '1px solid rgba(76, 175, 80, 0.2)', color: '#4caf50', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}
                          >
                            <Plus size={12} /> Log Income
                          </button>
                        </div>
                      </div>

                      {(!activeMonth.incomes || activeMonth.incomes.length === 0) ? (
                        <div style={{ textAlign: 'center', padding: '24px 10px', color: 'var(--text-secondary)', background: 'rgba(7, 8, 15, 0.1)', border: '1px dashed rgba(255,255,255,0.03)', borderRadius: '8px', fontSize: '0.8rem' }}>
                          No individual incomes logged. (Primary Base Salary: ৳{activeMonth.salary.toLocaleString()})
                        </div>
                      ) : (
                        <div className={styles.walletTableWrapper}>
                          <table>
                            <thead>
                              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', color: 'var(--text-secondary)' }}>
                                <th style={{ padding: '8px' }}>Date</th>
                                <th style={{ padding: '8px' }}>Category</th>
                                <th style={{ padding: '8px' }}>Description</th>
                                <th style={{ padding: '8px', textAlign: 'right' }}>Amount</th>
                                <th style={{ padding: '8px', textAlign: 'right' }}>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {sortedIncomes.map((inc) => (
                                <tr key={inc._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                                  <td style={{ padding: '8px', color: 'var(--text-secondary)', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(76, 175, 80, 0.08)', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(76, 175, 80, 0.15)', color: '#4caf50' }}>
                                      <Calendar size={11} style={{ opacity: 0.8 }} />
                                      {formatItemDate(inc.date)}
                                    </span>
                                  </td>
                                  <td style={{ padding: '8px' }}>
                                    <span style={{ display: 'inline-flex', padding: '2px 6px', borderRadius: '4px', fontSize: '0.68rem', fontWeight: 700, background: 'rgba(76, 175, 80, 0.15)', color: '#4caf50' }}>
                                      {inc.category}
                                    </span>
                                  </td>
                                  <td style={{ padding: '8px', color: '#fff', wordBreak: 'break-word' }}>{inc.description}</td>
                                  <td style={{ padding: '8px', textAlign: 'right', fontWeight: 700, color: '#4caf50' }}>৳{inc.amount.toLocaleString()}</td>
                                  <td style={{ padding: '8px', textAlign: 'right' }}>
                                    <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end' }}>
                                      <button
                                        type="button"
                                        onClick={() => openEditIncomeItemModal(inc)}
                                        style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '2px' }}
                                      >
                                        <Edit size={12} />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => inc._id && handleDeleteIncome(inc._id)}
                                        style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '2px' }}
                                      >
                                        <Trash2 size={12} />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>

                    {/* Right Column: Expenses Ledger */}
                    <div style={{ background: 'rgba(7, 8, 15, 0.15)', border: '1px solid rgba(255, 255, 255, 0.03)', borderRadius: '12px', padding: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <PieChart size={16} style={{ color: '#ff6b6b' }} /> Expenses Ledger
                        </h3>
                        <button
                          onClick={() => {
                            setExpDesc('');
                            setExpAmount('');
                            setExpCategory('Food');
                            setCustomCategory('');
                            setExpDate(new Date().toISOString().split('T')[0]);
                            setIsAddExpenseOpen(true);
                          }}
                          style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ff6b6b', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}
                        >
                          <Plus size={12} /> Log Expense
                        </button>
                      </div>

                      {/* ⚡ 1-Click Quick Expense Logger Chips */}
                      <div style={{ marginBottom: '12px', display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <Zap size={11} style={{ color: 'var(--accent-gold)' }} /> Quick Log:
                        </span>
                        {quickExpensePresets.map((preset, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleQuickPresetClick(preset)}
                            style={{
                              background: 'rgba(255,255,255,0.03)',
                              border: '1px solid rgba(255,255,255,0.07)',
                              color: '#cbd5e1',
                              padding: '3px 8px',
                              borderRadius: '12px',
                              fontSize: '0.7rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = 'var(--accent-gold)';
                              e.currentTarget.style.color = '#fff';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
                              e.currentTarget.style.color = '#cbd5e1';
                            }}
                          >
                            + {preset.name} (৳{preset.amount})
                          </button>
                        ))}
                      </div>

                      {/* Filter & Instant Search & Sorting */}
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                        <input
                          type="text"
                          placeholder="Search expenses..."
                          value={searchQuery}
                          onChange={e => setSearchQuery(e.target.value)}
                          style={{
                            flex: 1,
                            minWidth: '110px',
                            padding: '6px 10px',
                            background: 'rgba(7,8,15,0.4)',
                            border: '1px solid rgba(255,255,255,0.06)',
                            borderRadius: '6px',
                            color: '#fff',
                            fontSize: '0.75rem'
                          }}
                        />
                        <select
                          value={expenseDateRange}
                          onChange={e => setExpenseDateRange(e.target.value as any)}
                          style={{
                            padding: '6px 10px',
                            background: 'rgba(7,8,15,0.4)',
                            border: '1px solid rgba(255,255,255,0.06)',
                            borderRadius: '6px',
                            color: '#fff',
                            fontSize: '0.75rem'
                          }}
                        >
                          <option value="all">All Dates</option>
                          <option value="7days">Last 7 Days</option>
                          <option value="30days">Last 30 Days</option>
                        </select>
                        <select
                          value={selectedCategoryFilter}
                          onChange={e => setSelectedCategoryFilter(e.target.value)}
                          style={{
                            padding: '6px 10px',
                            background: 'rgba(7,8,15,0.4)',
                            border: '1px solid rgba(255,255,255,0.06)',
                            borderRadius: '6px',
                            color: '#fff',
                            fontSize: '0.75rem'
                          }}
                        >
                          <option value="All">All Categories</option>
                          {categoriesList.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <select
                          value={expSortBy}
                          onChange={e => setExpSortBy(e.target.value as any)}
                          style={{
                            padding: '6px 10px',
                            background: 'rgba(7,8,15,0.4)',
                            border: '1px solid rgba(255,255,255,0.06)',
                            borderRadius: '6px',
                            color: '#fff',
                            fontSize: '0.75rem'
                          }}
                        >
                          <option value="date_desc">Date (Newest)</option>
                          <option value="date_asc">Date (Oldest)</option>
                          <option value="amount_desc">Amount (High-Low)</option>
                          <option value="amount_asc">Amount (Low-High)</option>
                        </select>
                      </div>

                      {/* Expenses Table */}
                      {sortedExpenses.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '24px 10px', color: 'var(--text-secondary)', background: 'rgba(7, 8, 15, 0.1)', border: '1px dashed rgba(255,255,255,0.03)', borderRadius: '8px', fontSize: '0.8rem' }}>
                          No expenses matching criteria.
                        </div>
                      ) : (
                        <div style={{ overflowX: 'auto', background: 'rgba(7, 8, 15, 0.1)', border: '1px solid rgba(255, 255, 255, 0.02)', borderRadius: '8px' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
                            <thead>
                              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', color: 'var(--text-secondary)' }}>
                                <th style={{ padding: '8px 10px' }}>Date</th>
                                <th style={{ padding: '8px 10px' }}>Category</th>
                                <th style={{ padding: '8px 10px' }}>Description</th>
                                <th style={{ padding: '8px 10px', textAlign: 'right' }}>Amount</th>
                                <th style={{ padding: '8px 10px', textAlign: 'right' }}>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {sortedExpenses.map((exp) => {
                                const isToday = exp.date && new Date(exp.date).toISOString().split('T')[0] === new Date().toISOString().split('T')[0];
                                return (
                                  <tr key={exp._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                                    <td style={{ padding: '8px 10px', color: 'var(--text-secondary)', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: isToday ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255,255,255,0.03)', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.05)', color: isToday ? 'var(--accent-gold)' : 'var(--text-secondary)', fontWeight: isToday ? 700 : 400 }}>
                                        <Calendar size={11} style={{ opacity: 0.8 }} />
                                        {formatItemDate(exp.date)}
                                      </span>
                                    </td>
                                    <td style={{ padding: '8px 10px' }}>
                                      <span style={{ display: 'inline-flex', padding: '2px 6px', borderRadius: '4px', fontSize: '0.68rem', fontWeight: 700, background: `${categoryColors[exp.category] || '#607d8b'}20`, color: categoryColors[exp.category] || '#607d8b' }}>
                                        {exp.category}
                                      </span>
                                    </td>
                                    <td style={{ padding: '8px 10px', color: '#fff', wordBreak: 'break-word' }}>{exp.description}</td>
                                    <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 700, color: '#ff6b6b' }}>৳{exp.amount.toLocaleString()}</td>
                                    <td style={{ padding: '8px 10px', textAlign: 'right' }}>
                                      <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end' }}>
                                        <button
                                          type="button"
                                          onClick={() => openEditExpenseModal(exp)}
                                          style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '2px' }}
                                        >
                                          <Edit size={12} />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => exp._id && handleDeleteExpense(exp._id)}
                                          style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '2px' }}
                                        >
                                          <Trash2 size={12} />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>

                  </div>

                  {/* 🎯 Category Budget Target Caps & Over-spending Progress Widget */}
                  <div className={styles.walletCard} style={{ background: 'rgba(7, 8, 15, 0.25)', border: '1px solid rgba(255, 255, 255, 0.04)', marginTop: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                      <div>
                        <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: '#fff' }}>
                          <Target size={18} style={{ color: 'var(--accent-gold)' }} /> Category Budget Limits & Over-spending Tracker
                        </h3>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          Track spending against target monthly caps per sector. Real-time visual status indicator.
                        </span>
                      </div>
                      <button
                        onClick={() => setIsBudgetModalOpen(true)}
                        style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'var(--text-secondary)', padding: '5px 12px', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 600 }}
                      >
                        <Edit size={12} /> Edit Budgets
                      </button>
                    </div>

                    <div className={styles.grid4} style={{ gap: '12px' }}>
                      {categoriesList.map((cat) => {
                        const spent = (activeMonth.expenses || []).filter(e => e.category === cat).reduce((sum, e) => sum + e.amount, 0);
                        const budget = categoryBudgets[cat] || 5000;
                        const pct = Math.round((spent / budget) * 100);
                        const isOver = spent > budget;
                        const isWarning = pct >= 80 && !isOver;
                        const statusColor = isOver ? '#ef4444' : isWarning ? '#f59e0b' : '#10b981';

                        return (
                          <div key={cat} style={{ background: 'rgba(15, 23, 42, 0.4)', border: `1px solid ${isOver ? 'rgba(239, 68, 68, 0.35)' : 'rgba(255,255,255,0.04)'}`, borderRadius: '10px', padding: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', marginBottom: '6px' }}>
                              <span style={{ fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ width: 8, height: 8, background: categoryColors[cat] || '#607d8b', borderRadius: '50%' }} />
                                {cat}
                              </span>
                              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: statusColor }}>
                                {isOver ? '🔴 OVER' : `${pct}%`}
                              </span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                              <span>Spent: ৳{spent.toLocaleString()}</span>
                              <span>Limit: ৳{budget.toLocaleString()}</span>
                            </div>
                            <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: `${Math.min(100, pct)}%`, background: statusColor, borderRadius: '3px', transition: 'width 0.4s ease' }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 🎯 SAVINGS JARS & WEALTH GOALS ALLOCATOR WIDGET */}
                  <div className={styles.walletCard} style={{ background: 'rgba(7, 8, 15, 0.25)', border: '1px solid rgba(129, 140, 248, 0.25)', marginTop: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                      <div>
                        <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: '#fff' }}>
                          <PiggyBank size={18} style={{ color: '#818cf8' }} /> Savings Goal Jars & Target Allocator
                        </h3>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          Allocate accumulated liquid savings toward specific hardware, emergency reserves, and luxury goals.
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setGoalName('');
                          setGoalTarget('');
                          setGoalCurrent('');
                          setEditingGoalId('');
                          setIsGoalModalOpen(true);
                        }}
                        style={{
                          background: 'linear-gradient(135deg, #818cf8 0%, #4f46e5 100%)',
                          color: '#fff',
                          border: 'none',
                          padding: '6px 14px',
                          borderRadius: '8px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          boxShadow: '0 4px 12px rgba(129, 140, 248, 0.25)'
                        }}
                      >
                        <Plus size={14} /> New Goal Jar
                      </button>
                    </div>

                    {activeSavingsGoals.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '24px 12px', color: 'var(--text-muted)', fontSize: '0.8rem', background: 'rgba(15, 23, 42, 0.4)', borderRadius: '10px', border: '1px dashed rgba(255,255,255,0.08)' }}>
                        No active Savings Goal Jars. Click &quot;New Goal Jar&quot; to set target wealth goals.
                      </div>
                    ) : (
                      <div className={styles.grid3} style={{ gap: '14px' }}>
                        {activeSavingsGoals.map(goal => {
                        const goalKey = goal._id || goal.id || goal.name;
                        const pct = Math.min(100, Math.round((goal.current / (goal.target || 1)) * 100));
                        return (
                          <div key={goalKey} style={{ background: 'rgba(15, 23, 42, 0.4)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '14px', position: 'relative' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                              <div style={{ fontWeight: 800, color: '#fff', fontSize: '0.85rem' }}>{goal.name}</div>
                              <div style={{ display: 'flex', gap: '4px' }}>
                                <button
                                  onClick={() => {
                                    setEditingGoalId(goal._id || goal.id || '');
                                    setGoalName(goal.name);
                                    setGoalTarget(String(goal.target));
                                    setGoalCurrent(String(goal.current));
                                    setIsGoalModalOpen(true);
                                  }}
                                  style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '2px' }}
                                >
                                  <Edit size={12} />
                                </button>
                                <button
                                  onClick={() => handleDeleteGoal(goal._id || goal.id || '')}
                                  style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '2px' }}
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '6px' }}>
                              <span style={{ color: '#818cf8', fontWeight: 700 }}>Saved: {fmtVal(goal.current)}</span>
                              <span style={{ color: 'var(--text-muted)' }}>Target: {fmtVal(goal.target)}</span>
                            </div>

                            <div style={{ height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden', marginBottom: '6px' }}>
                              <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, #818cf8, #34d399)', borderRadius: '4px', transition: 'width 0.5s ease' }} />
                            </div>

                            <div style={{ textAlign: 'right', fontSize: '0.7rem', fontWeight: 800, color: pct >= 100 ? '#10b981' : '#818cf8' }}>
                              {pct >= 100 ? '🎉 GOAL ACHIEVED!' : `${pct}% Funded`}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    )}
                  </div>

                  {/* 🛡️ INTERACTIVE EMERGENCY SAFETY RESERVE SIMULATOR */}
                  <div className={styles.walletCard} style={{ background: 'rgba(7, 8, 15, 0.25)', border: '1px solid rgba(16, 185, 129, 0.25)', marginTop: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '12px' }}>
                      <div>
                        <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: '#fff' }}>
                          <ShieldCheck size={18} style={{ color: '#34d399' }} /> Emergency Safety Reserve Simulator (জরুরি তহবিল সিমুলেটর)
                        </h3>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          Adjust target reserve duration to simulate living expenses buffer based on current monthly burn rate. (Calculated live in browser)
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Sliders size={14} style={{ color: '#34d399' }} />
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#34d399' }}>Target: {emergencyMonthsTarget} Months Buffer</span>
                      </div>
                    </div>

                    {/* Slider Control */}
                    <div style={{ marginBottom: '16px', background: 'rgba(15, 23, 42, 0.4)', padding: '12px 16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                        <span>3 Months (Basic)</span>
                        <span>6 Months (Recommended)</span>
                        <span>12 Months (Sovereign)</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="12"
                        step="1"
                        value={emergencyMonthsTarget}
                        onChange={e => setEmergencyMonthsTarget(Number(e.target.value))}
                        style={{ width: '100%', accentColor: '#10b981', cursor: 'pointer' }}
                      />
                    </div>

                    {(() => {
                      const monthlyBurn = getExpenseTotal(activeMonth);
                      const requiredReserve = monthlyBurn * emergencyMonthsTarget;
                      const currentSavings = getSavings(activeMonth);
                      const gap = requiredReserve - currentSavings;
                      const pctAchieved = requiredReserve > 0 ? Math.min(100, Math.round((currentSavings / requiredReserve) * 100)) : 100;

                      return (
                        <div className={styles.grid3} style={{ gap: '14px' }}>
                          <div style={{ background: 'rgba(15, 23, 42, 0.4)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '10px', padding: '12px' }}>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>Required Reserve ({emergencyMonthsTarget} Mo)</div>
                            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#34d399', marginTop: '4px' }}>{fmtVal(requiredReserve)}</div>
                            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>At {fmtVal(monthlyBurn)}/mo outlay pace</div>
                          </div>

                          <div style={{ background: 'rgba(15, 23, 42, 0.4)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '10px', padding: '12px' }}>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>Current Reserve Level</div>
                            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#818cf8', marginTop: '4px' }}>{fmtVal(currentSavings)}</div>
                            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>{pctAchieved}% of {emergencyMonthsTarget}-month buffer funded</div>
                          </div>

                          <div style={{ background: 'rgba(15, 23, 42, 0.4)', border: `1px solid ${gap <= 0 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`, borderRadius: '10px', padding: '12px' }}>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>{gap <= 0 ? 'Fund Status' : 'Reserve Gap'}</div>
                            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: gap <= 0 ? '#10b981' : '#fbbf24', marginTop: '4px' }}>
                              {gap <= 0 ? '🛡️ FULLY PROTECTED' : fmtVal(gap)}
                            </div>
                            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                              {gap <= 0 ? 'You meet your target safety buffer!' : `Save ${fmtVal(Math.round(gap / 3))}/mo over 3 months`}
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Money Lent Ledger (ধারের হিসাব & পাওনা) */}
                  <div className={styles.walletCard} style={{ background: 'rgba(7, 8, 15, 0.25)', border: '1px solid rgba(245, 158, 11, 0.25)', marginTop: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                      <div style={{ flex: 1, minWidth: '200px' }}>
                        <h3 style={{ fontSize: 'clamp(0.95rem, 3.5vw, 1.15rem)', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', flexWrap: 'wrap', wordBreak: 'break-word' }}>
                          <HandCoins size={20} style={{ color: '#fbbf24', flexShrink: 0 }} /> Money Lent Ledger (ধারের হিসাব & পাওনা)
                        </h3>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginTop: '4px' }}>
                          কাকে কত টাকা ধার দিয়েছেন তার হিসাব। ফেরত পাওয়া বাটনে ক্লিক করলে তা স্বয়ংক্রিয়ভাবে মেইন ব্যালেন্সে যুক্ত হয়ে যাবে।
                        </span>
                      </div>
                      
                      <button
                        onClick={() => {
                          setLoanPersonName('');
                          setLoanAmount('');
                          setLoanDate(new Date().toISOString().split('T')[0]);
                          setLoanDueDate('');
                          setLoanNotes('');
                          setLoanStatus('Pending');
                          setIsAddLoanOpen(true);
                        }}
                        style={{
                          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                          color: '#fff',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '8px',
                          fontWeight: 700,
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          boxShadow: '0 4px 12px rgba(245, 158, 11, 0.25)'
                        }}
                      >
                        <Plus size={15} /> Log New Loan (ধার দিন)
                      </button>
                    </div>

                    {/* Debt Recovery Progress Indicator */}
                    {(() => {
                      const totalLent = getTotalLoansGiven(activeMonth);
                      const totalReturned = getReturnedLoansTotal(activeMonth);
                      const recoveryPct = totalLent > 0 ? Math.round((totalReturned / totalLent) * 100) : 100;

                      return totalLent > 0 ? (
                        <div style={{ marginBottom: '16px', background: 'rgba(15, 23, 42, 0.4)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px', padding: '12px 16px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', marginBottom: '6px', flexWrap: 'wrap', gap: '4px' }}>
                            <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Debt Recovery Progress (ধার আদায়ের হার)</span>
                            <span style={{ fontWeight: 800, color: recoveryPct >= 80 ? '#10b981' : recoveryPct >= 50 ? '#fbbf24' : '#f87171' }}>
                              {recoveryPct}% Recovered (৳{totalReturned.toLocaleString()} / ৳{totalLent.toLocaleString()})
                            </span>
                          </div>
                          <div style={{ height: '8px', width: '100%', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${recoveryPct}%`, background: 'linear-gradient(90deg, #f59e0b, #10b981)', borderRadius: '4px', transition: 'width 0.5s ease' }} />
                          </div>
                        </div>
                      ) : null;
                    })()}

                    {/* Filter & Search Bar */}
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {(['All', 'Pending', 'Returned'] as const).map((st) => (
                          <button
                            key={st}
                            onClick={() => setLoanFilterStatus(st)}
                            style={{
                              background: loanFilterStatus === st ? 'rgba(245, 158, 11, 0.2)' : 'rgba(15, 23, 42, 0.4)',
                              border: '1px solid',
                              borderColor: loanFilterStatus === st ? '#f59e0b' : 'rgba(255,255,255,0.06)',
                              color: loanFilterStatus === st ? '#fbbf24' : 'var(--text-secondary)',
                              padding: '4px 10px',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                          >
                            {st === 'All' ? 'All' : st === 'Pending' ? '⌛ Pending' : '✅ Returned'}
                          </button>
                        ))}
                      </div>

                      <input
                        type="text"
                        placeholder="Search..."
                        value={loanSearchQuery}
                        onChange={(e) => setLoanSearchQuery(e.target.value)}
                        style={{
                          background: '#07070b',
                          border: '1px solid rgba(255,255,255,0.08)',
                          borderRadius: '6px',
                          padding: '6px 12px',
                          fontSize: '0.78rem',
                          color: '#fff',
                          width: '100%',
                          maxWidth: '200px'
                        }}
                      />
                    </div>

                    {/* Loan Records Table */}
                    {(!activeMonth.loans || activeMonth.loans.length === 0) ? (
                      <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--text-secondary)', background: 'rgba(7, 8, 15, 0.2)', border: '1px dashed rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                        <HandCoins size={36} style={{ color: 'var(--text-muted)', marginBottom: '10px', opacity: 0.5 }} />
                        <p style={{ margin: 0, fontSize: '0.85rem' }}>No loans logged for this month. Click &quot;Log New Loan&quot; to record money given.</p>
                      </div>
                    ) : (
                      <div className={styles.walletTableWrapper}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
                          <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-secondary)', background: 'rgba(15, 23, 42, 0.5)' }}>
                              <th style={{ padding: '10px 12px' }}>Person Name (কাকে দেওয়া)</th>
                              <th style={{ padding: '10px 12px' }}>Amount (৳)</th>
                              <th style={{ padding: '10px 12px' }}>Date Given</th>
                              <th style={{ padding: '10px 12px' }}>Target Due Date</th>
                              <th style={{ padding: '10px 12px' }}>Status</th>
                              <th style={{ padding: '10px 12px', textAlign: 'right' }}>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {activeMonth.loans
                              .filter(loan => {
                                const matchesSt = loanFilterStatus === 'All' || loan.status === loanFilterStatus;
                                const matchesQ = loan.personName.toLowerCase().includes(loanSearchQuery.toLowerCase()) || (loan.notes || '').toLowerCase().includes(loanSearchQuery.toLowerCase());
                                return matchesSt && matchesQ;
                              })
                              .map((loan) => {
                                const isPending = loan.status === 'Pending';
                                return (
                                  <tr key={loan._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.2s' }}>
                                    <td style={{ padding: '12px' }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: isPending ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isPending ? '#fbbf24' : '#10b981', fontWeight: 800, fontSize: '0.85rem' }}>
                                          {loan.personName.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                          <div style={{ fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                                            {loan.personName}
                                            {loan.isCarriedOver && (
                                              <span style={{ fontSize: '0.64rem', background: 'rgba(129, 140, 248, 0.15)', color: '#a5b4fc', border: '1px solid rgba(129, 140, 248, 0.3)', padding: '1px 6px', borderRadius: '4px', fontWeight: 600 }}>
                                                🔄 Carried Over {loan.originalMonthName ? `(${loan.originalMonthName})` : ''}
                                              </span>
                                            )}
                                          </div>
                                          {loan.notes && <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{loan.notes}</div>}
                                        </div>
                                      </div>
                                    </td>

                                    <td style={{ padding: '12px', fontWeight: 800, fontSize: '0.95rem', color: isPending ? '#fbbf24' : '#10b981' }}>
                                      {fmtVal(loan.amount)}
                                    </td>

                                    <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>
                                      {new Date(loan.date).toLocaleDateString()}
                                    </td>

                                    <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>
                                      <div>{loan.dueDate ? new Date(loan.dueDate).toLocaleDateString() : 'N/A'}</div>
                                      {(() => {
                                        if (!loan.dueDate || !isPending) return null;
                                        const due = new Date(loan.dueDate);
                                        const now = new Date();
                                        due.setHours(0,0,0,0);
                                        now.setHours(0,0,0,0);
                                        const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

                                        if (diffDays < 0) {
                                          return <span style={{ color: '#ef4444', fontWeight: 800, fontSize: '0.68rem', background: 'rgba(239,68,68,0.15)', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(239,68,68,0.3)', display: 'inline-block', marginTop: '2px' }}>🔴 Overdue ({Math.abs(diffDays)}d)</span>;
                                        }
                                        if (diffDays === 0) {
                                          return <span style={{ color: '#f59e0b', fontWeight: 800, fontSize: '0.68rem', background: 'rgba(245,158,11,0.15)', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(245,158,11,0.3)', display: 'inline-block', marginTop: '2px' }}>⚠️ Due Today!</span>;
                                        }
                                        return <span style={{ color: '#818cf8', fontWeight: 700, fontSize: '0.68rem', background: 'rgba(129,140,248,0.12)', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(129,140,248,0.2)', display: 'inline-block', marginTop: '2px' }}>⌛ {diffDays} days left</span>;
                                      })()}
                                    </td>

                                    <td style={{ padding: '12px' }}>
                                      {isPending ? (
                                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700, background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                                          <Clock size={12} /> Pending (ধারে আছে)
                                        </span>
                                      ) : (
                                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700, background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                                          <CheckCircle2 size={12} /> Returned ({loan.returnedDate ? new Date(loan.returnedDate).toLocaleDateString() : 'Yes'})
                                        </span>
                                      )}
                                    </td>

                                    <td style={{ padding: '12px', textAlign: 'right' }}>
                                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', alignItems: 'center' }}>
                                        {/* TOGGLE RETURN BUTTON */}
                                        <button
                                          onClick={() => handleToggleLoanStatus(loan)}
                                          style={{
                                            background: isPending ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'rgba(255,255,255,0.06)',
                                            border: '1px solid',
                                            borderColor: isPending ? '#10b981' : 'rgba(255,255,255,0.1)',
                                            color: isPending ? '#fff' : 'var(--text-secondary)',
                                            padding: '6px 12px',
                                            borderRadius: '6px',
                                            fontSize: '0.75rem',
                                            fontWeight: 700,
                                            cursor: 'pointer',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '5px',
                                            boxShadow: isPending ? '0 2px 8px rgba(16, 185, 129, 0.3)' : 'none'
                                          }}
                                          title={isPending ? 'Click to mark as returned and add money back to Main Balance' : 'Click to revert back to Pending status'}
                                        >
                                          {isPending ? (
                                            <>
                                              <CheckCircle2 size={13} /> ফেরত পেয়েছি
                                            </>
                                          ) : (
                                            <>
                                              <RefreshCw size={13} /> Mark Pending
                                            </>
                                          )}
                                        </button>

                                        {/* WhatsApp Direct Action Button */}
                                        {isPending && (
                                          <button
                                            onClick={() => handleOpenWhatsApp(loan)}
                                            style={{
                                              background: 'rgba(34, 197, 94, 0.15)',
                                              border: '1px solid rgba(34, 197, 94, 0.3)',
                                              color: '#4ade80',
                                              padding: '6px 10px',
                                              borderRadius: '6px',
                                              fontSize: '0.75rem',
                                              cursor: 'pointer',
                                              display: 'inline-flex',
                                              alignItems: 'center',
                                              gap: '4px',
                                              fontWeight: 600
                                            }}
                                            title="Open WhatsApp directly with payment reminder"
                                          >
                                            <MessageCircle size={12} /> WhatsApp
                                          </button>
                                        )}

                                        {/* Copy Text Reminder Button */}
                                        {isPending && (
                                          <button
                                            onClick={() => handleCopyReminder(loan)}
                                            style={{
                                              background: 'rgba(59, 130, 246, 0.15)',
                                              border: '1px solid rgba(59, 130, 246, 0.3)',
                                              color: '#60a5fa',
                                              padding: '6px 10px',
                                              borderRadius: '6px',
                                              fontSize: '0.75rem',
                                              cursor: 'pointer',
                                              display: 'inline-flex',
                                              alignItems: 'center',
                                              gap: '4px',
                                              fontWeight: 600
                                            }}
                                            title="Copy polite payment reminder message text"
                                          >
                                            <Copy size={12} /> Copy
                                          </button>
                                        )}

                                        {/* Edit Loan */}
                                        <button
                                          onClick={() => openEditLoanModal(loan)}
                                          style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}
                                          title="Edit Loan details"
                                        >
                                          <Edit size={14} />
                                        </button>

                                        {/* Delete Loan */}
                                        <button
                                          onClick={() => handleDeleteLoan(loan._id!)}
                                          style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                                          title="Delete Loan record"
                                        >
                                          <Trash2 size={14} />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                </div>
              ) : null}

            </div>
          )}

          {walletSubTab === 'consolidated' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* 🏆 ALL-TIME FINANCIAL CHAMPIONS SPOTLIGHT WIDGET */}
              {months.length > 0 && (() => {
                const peakEarnMonth = [...months].sort((a, b) => getIncomeTotal(b) - getIncomeTotal(a))[0];
                const frugalMonth = [...months].sort((a, b) => getExpenseTotal(a) - getExpenseTotal(b))[0];
                const topSavingsRateMonth = [...months].sort((a, b) => getSavingsRate(b) - getSavingsRate(a))[0];

                return (
                  <div className={styles.grid3} style={{ gap: '16px' }}>
                    <div style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(15, 23, 42, 0.5) 100%)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '14px', padding: '18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <Award size={20} style={{ color: '#10b981' }} />
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          🎯 Peak Earning Month
                        </span>
                      </div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#fff' }}>{peakEarnMonth?.monthName || 'N/A'}</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#10b981', marginTop: '4px' }}>
                        Gross Income: {fmtVal(getIncomeTotal(peakEarnMonth))}
                      </div>
                    </div>

                    <div style={{ background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(15, 23, 42, 0.5) 100%)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '14px', padding: '18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <ShieldCheck size={20} style={{ color: '#fbbf24' }} />
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          🛡️ Most Frugal Month
                        </span>
                      </div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#fff' }}>{frugalMonth?.monthName || 'N/A'}</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fbbf24', marginTop: '4px' }}>
                        Total Spent: {fmtVal(getExpenseTotal(frugalMonth))}
                      </div>
                    </div>

                    <div style={{ background: 'linear-gradient(135deg, rgba(129, 140, 248, 0.15) 0%, rgba(15, 23, 42, 0.5) 100%)', border: '1px solid rgba(129, 140, 248, 0.3)', borderRadius: '14px', padding: '18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <TrendingUp size={20} style={{ color: '#818cf8' }} />
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          🔥 Highest Savings Rate
                        </span>
                      </div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#fff' }}>{topSavingsRateMonth?.monthName || 'N/A'}</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#818cf8', marginTop: '4px' }}>
                        Savings Rate: {getSavingsRate(topSavingsRateMonth).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* 🚀 DYNAMIC SEASONALITY & WEALTH MOMENTUM ALGORITHM RADAR */}
              {months.length > 0 && (() => {
                const sortedByDate = [...months].sort((a, b) => new Date(a.monthName).getTime() - new Date(b.monthName).getTime());
                const last3 = sortedByDate.slice(-3);
                const avg3MoSavings = last3.length > 0 ? Math.round(last3.reduce((acc, m) => acc + getSavings(m), 0) / last3.length) : 0;
                
                // Rolling Savings Volatility Algorithm (Standard Deviation)
                const meanSavings = months.reduce((acc, m) => acc + getSavings(m), 0) / months.length;
                const variance = months.reduce((acc, m) => acc + Math.pow(getSavings(m) - meanSavings, 2), 0) / months.length;
                const stdDev = Math.sqrt(variance);
                const volatilityLevel = stdDev < 5000 ? '🟢 Low Volatility (Stable)' : stdDev < 15000 ? '🟡 Moderate Volatility' : '🔴 High Cashflow Variation';

                // Capital Retention Score
                const lifetimeIncome = globalTotalIncome;
                const retentionScore = lifetimeIncome > 0 ? Math.round((globalTotalSavings / lifetimeIncome) * 100) : 0;

                return (
                  <div className={styles.walletCard} style={{ background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.4) 0%, rgba(15, 23, 42, 0.7) 100%)', border: '1px solid rgba(129, 140, 248, 0.3)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                      <div>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: '#fff' }}>
                          <Gauge size={18} style={{ color: '#818cf8' }} /> Seasonality & Wealth Momentum Algorithm Radar
                        </h3>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          Calculated via 3-month rolling average & capital volatility variance algorithm
                        </span>
                      </div>
                      <span style={{ fontSize: '0.75rem', background: 'rgba(129, 140, 248, 0.15)', color: '#818cf8', border: '1px solid rgba(129, 140, 248, 0.3)', padding: '4px 12px', borderRadius: '20px', fontWeight: 700 }}>
                        {volatilityLevel}
                      </span>
                    </div>

                    <div className={styles.grid3} style={{ gap: '14px' }}>
                      <div style={{ background: 'rgba(7, 8, 15, 0.4)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px', padding: '14px' }}>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>3-Month Rolling Savings Pace</div>
                        <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#34d399', marginTop: '4px' }}>{fmtVal(avg3MoSavings)}/mo</div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>Short-Term Wealth Momentum</div>
                      </div>

                      <div style={{ background: 'rgba(7, 8, 15, 0.4)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px', padding: '14px' }}>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>Capital Retention Efficiency</div>
                        <div style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--accent-gold)', marginTop: '4px' }}>{retentionScore}% Retained</div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>Of total lifetime revenues saved</div>
                      </div>

                      <div style={{ background: 'rgba(7, 8, 15, 0.4)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px', padding: '14px' }}>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>Cashflow Standard Deviation</div>
                        <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#60a5fa', marginTop: '4px' }}>±{fmtVal(Math.round(stdDev))}</div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>Statistical Income Stability Index</div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* 📊 MULTI-MONTH CASHFLOW VISUAL BAR MATRIX */}
              <div className={styles.walletCard} style={{ background: 'rgba(7, 8, 15, 0.25)', border: '1px solid rgba(255, 255, 255, 0.04)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: '#fff' }}>
                      <Activity size={18} style={{ color: '#34d399' }} /> Multi-Month Cashflow Visual Bar Matrix
                    </h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      Comparative visual breakdown of monthly income vs expenses across all recorded months.
                    </span>
                  </div>
                </div>

                <div className={styles.grid3} style={{ gap: '14px' }}>
                  {months.map(m => {
                    const inc = getIncomeTotal(m);
                    const exp = getExpenseTotal(m);
                    const sav = getSavings(m);
                    const maxVal = Math.max(1, inc, exp);
                    const incPct = Math.min(100, Math.round((inc / maxVal) * 100));
                    const expPct = Math.min(100, Math.round((exp / maxVal) * 100));
                    const sRate = getSavingsRate(m).toFixed(0);

                    return (
                      <div key={m._id} style={{ background: 'rgba(15, 23, 42, 0.4)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '14px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                          <span style={{ fontWeight: 800, color: '#fff', fontSize: '0.9rem' }}>{m.monthName}</span>
                          <button
                            onClick={() => {
                              setSelectedMonthId(m._id);
                              setWalletSubTab('single');
                            }}
                            style={{ background: 'rgba(129, 140, 248, 0.15)', border: '1px solid rgba(129, 140, 248, 0.3)', color: '#818cf8', padding: '3px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer' }}
                          >
                            View Sheet
                          </button>
                        </div>

                        {/* Income Bar */}
                        <div style={{ marginBottom: '8px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '3px' }}>
                            <span>Earned: {fmtVal(inc)}</span>
                          </div>
                          <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${incPct}%`, background: '#10b981', borderRadius: '3px' }} />
                          </div>
                        </div>

                        {/* Expense Bar */}
                        <div style={{ marginBottom: '10px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '3px' }}>
                            <span>Spent: {fmtVal(exp)}</span>
                          </div>
                          <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${expPct}%`, background: '#ef4444', borderRadius: '3px' }} />
                          </div>
                        </div>

                        {/* Footer Savings Pill */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.04)', fontSize: '0.75rem' }}>
                          <span style={{ color: '#818cf8', fontWeight: 700 }}>Net: {fmtVal(sav)}</span>
                          <span style={{ background: 'rgba(212, 175, 55, 0.12)', color: 'var(--accent-gold)', border: '1px solid rgba(212, 175, 55, 0.25)', padding: '1px 6px', borderRadius: '4px', fontWeight: 800, fontSize: '0.68rem' }}>
                            {sRate}% Saved
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* TABLE CARD WITH SEARCH & SORT */}
              <div className={styles.walletCard}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '16px' }}>
                  <div>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>Consolidated Financial Portfolio Ledger</h2>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Aggregated historical ledger overview & quick sheet navigation</span>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button
                      onClick={exportMasterCSV}
                      style={{
                        background: 'rgba(16, 185, 129, 0.12)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        color: '#34d399',
                        padding: '10px 16px',
                        borderRadius: '8px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.82rem'
                      }}
                      title="Export entire multi-month database to CSV"
                    >
                      <FileText size={15} /> Master CSV Export
                    </button>
                    <button
                      onClick={printGlobalPDF}
                      style={{
                        background: 'linear-gradient(135deg, #818cf8 0%, #4f46e5 100%)',
                        color: '#fff',
                        border: 'none',
                        padding: '10px 18px',
                        borderRadius: '8px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 12px rgba(129, 140, 248, 0.3)'
                      }}
                    >
                      <Download size={16} /> Download Consolidated PDF
                    </button>
                  </div>
                </div>

                {/* Search & Sort Controls */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
                  <input
                    type="text"
                    placeholder="Search month name..."
                    value={consolidatedSearchQuery}
                    onChange={e => setConsolidatedSearchQuery(e.target.value)}
                    style={{
                      flex: 1,
                      minWidth: '150px',
                      padding: '8px 12px',
                      background: 'rgba(7, 8, 15, 0.4)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: '6px',
                      color: '#fff',
                      fontSize: '0.78rem'
                    }}
                  />
                  <select
                    value={consolidatedSortBy}
                    onChange={e => setConsolidatedSortBy(e.target.value as any)}
                    style={{
                      padding: '8px 12px',
                      background: 'rgba(7, 8, 15, 0.4)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: '6px',
                      color: '#fff',
                      fontSize: '0.78rem'
                    }}
                  >
                    <option value="name">Sort by Month Name</option>
                    <option value="income_desc">Highest Income</option>
                    <option value="savings_desc">Highest Savings</option>
                    <option value="rate_desc">Highest Savings Rate</option>
                  </select>
                </div>

                <div className={styles.walletTableWrapper}>
                  <table style={{ width: '100%', minWidth: '700px', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', color: 'var(--text-secondary)' }}>
                        <th style={{ padding: '12px 16px' }}>Month Name</th>
                        <th style={{ padding: '12px 16px', textAlign: 'right' }}>Salary</th>
                        <th style={{ padding: '12px 16px', textAlign: 'right' }}>Add-on</th>
                        <th style={{ padding: '12px 16px', textAlign: 'right' }}>Bonus</th>
                        <th style={{ padding: '12px 16px', textAlign: 'right' }}>Total Income</th>
                        <th style={{ padding: '12px 16px', textAlign: 'right' }}>Total Spent</th>
                        <th style={{ padding: '12px 16px', textAlign: 'right' }}>Savings</th>
                        <th style={{ padding: '12px 16px', textAlign: 'right' }}>Savings Rate</th>
                        <th style={{ padding: '12px 16px', textAlign: 'right' }}>Health Score</th>
                        <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {months
                        .filter(m => m.monthName.toLowerCase().includes(consolidatedSearchQuery.toLowerCase()))
                        .sort((a, b) => {
                          if (consolidatedSortBy === 'income_desc') return getIncomeTotal(b) - getIncomeTotal(a);
                          if (consolidatedSortBy === 'savings_desc') return getSavings(b) - getSavings(a);
                          if (consolidatedSortBy === 'rate_desc') return getSavingsRate(b) - getSavingsRate(a);
                          return 0;
                        })
                        .map(m => {
                          const totalInc = getIncomeTotal(m);
                          const totalExp = getExpenseTotal(m);
                          const netSav = getSavings(m);
                          const rate = getSavingsRate(m).toFixed(0);
                          const health = getHealthScore(m);
                          const hInfo = getHealthGrade(health);
                          return (
                            <tr key={m._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                              <td style={{ padding: '12px 16px', fontWeight: 700, color: '#fff' }}>
                                <button
                                  onClick={() => {
                                    setSelectedMonthId(m._id);
                                    setWalletSubTab('single');
                                  }}
                                  style={{ background: 'transparent', border: 'none', color: '#818cf8', cursor: 'pointer', fontWeight: 700, fontSize: '0.88rem', padding: 0, textDecoration: 'underline' }}
                                  title="Click to view detailed month sheet"
                                >
                                  {m.monthName}
                                </button>
                              </td>
                              <td style={{ padding: '12px 16px', textAlign: 'right' }}>{fmtVal(getSalaryTotal(m))}</td>
                              <td style={{ padding: '12px 16px', textAlign: 'right' }}>{fmtVal(getAddonTotal(m))}</td>
                              <td style={{ padding: '12px 16px', textAlign: 'right' }}>{fmtVal(getBonusTotal(m))}</td>
                              <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#4caf50' }}>{fmtVal(totalInc)}</td>
                              <td style={{ padding: '12px 16px', textAlign: 'right', color: '#f44336' }}>{fmtVal(totalExp)}</td>
                              <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#2196f3' }}>{fmtVal(netSav)}</td>
                              <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700, color: 'var(--accent-gold)' }}>{totalInc > 0 ? rate : '0'}%</td>
                              <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                                <span style={{ display: 'inline-block', padding: '2px 6px', borderRadius: '4px', background: `${hInfo.color}15`, color: hInfo.color, border: `1px solid ${hInfo.color}35`, fontSize: '0.75rem', fontWeight: 700 }}>
                                  {health} ({hInfo.grade})
                                </span>
                              </td>
                              <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                                <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                                  <button
                                    onClick={() => {
                                      setSelectedMonthId(m._id);
                                      setWalletSubTab('single');
                                    }}
                                    style={{ background: 'rgba(129, 140, 248, 0.15)', border: '1px solid rgba(129, 140, 248, 0.3)', color: '#818cf8', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}
                                  >
                                    Open Sheet
                                  </button>
                                  <button
                                    onClick={() => printMonthPDF(m)}
                                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                                    title="Download PDF Statement"
                                  >
                                    <Download size={12} /> PDF
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {walletSubTab === 'global_summary' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* ─── GLOBAL VISUAL REPRESENTATION PANEL ─── */}
              <div className={styles.walletCard}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <TrendingUp size={20} style={{ color: '#4caf50' }} /> Global Financial Portfolio Summary
                  </h2>
                  <button
                    onClick={printGlobalPDF}
                    style={{ background: 'rgba(129,140,248,0.1)', border: '1px solid rgba(129,140,248,0.2)', color: '#818cf8', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 600 }}
                  >
                    <Download size={14} /> Download Portfolio PDF
                  </button>
                </div>
                
                {/* 🤖 MACHINE LEARNING TIME-SERIES PREDICTION PANEL */}
                {(() => {
                  const mlPred = predictNextMonthML();
                  return (
                    <div style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(192, 132, 252, 0.08) 100%)', border: '1px solid rgba(129, 140, 248, 0.3)', borderRadius: '14px', padding: '18px', marginBottom: '24px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                          🤖 Machine Learning Financial Forecasting Engine (OLS Trend Predictor)
                        </h4>
                        <span style={{ fontSize: '0.72rem', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '3px 10px', borderRadius: '20px', fontWeight: 700 }}>
                          ML Model Confidence: {mlPred.confidenceScore}% • Trend: {mlPred.trendDirection}
                        </span>
                      </div>

                      <div className={styles.grid3} style={{ gap: '14px' }}>
                        <div style={{ background: 'rgba(7, 8, 15, 0.4)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px', padding: '12px 14px' }}>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>Predicted Next Month Income</div>
                          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#34d399', marginTop: '4px' }}>{fmtVal(mlPred.predictedIncome)}</div>
                          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>Linear Regression Slope: +{Math.round(mlPred.slopeInc)}/mo</div>
                        </div>

                        <div style={{ background: 'rgba(7, 8, 15, 0.4)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px', padding: '12px 14px' }}>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>Predicted Next Month Outlays</div>
                          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f87171', marginTop: '4px' }}>{fmtVal(mlPred.predictedExpense)}</div>
                          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>Expense Trajectory: +{Math.round(mlPred.slopeExp)}/mo</div>
                        </div>

                        <div style={{ background: 'rgba(7, 8, 15, 0.4)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px', padding: '12px 14px' }}>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>Predicted Net Liquid Savings</div>
                          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#60a5fa', marginTop: '4px' }}>{fmtVal(mlPred.predictedSavings)}</div>
                          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>Net Surplus Runway</div>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Global Stats Grid */}
                <div className={styles.grid4} style={{ marginBottom: '24px' }}>
                  <div style={{ background: 'rgba(7, 8, 15, 0.4)', border: '1px solid rgba(255, 255, 255, 0.03)', borderRadius: '12px', padding: '16px' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Total Revenues</span>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#4caf50', marginTop: '6px' }}>{fmtVal(globalTotalIncome)}</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '4px' }}>Across {months.length} monthly sheets</div>
                  </div>
                  <div style={{ background: 'rgba(7, 8, 15, 0.4)', border: '1px solid rgba(255, 255, 255, 0.03)', borderRadius: '12px', padding: '16px' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Total Spent</span>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f44336', marginTop: '6px' }}>{fmtVal(globalTotalSpent)}</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '4px' }}>Cumulative Outlays</div>
                  </div>
                  <div style={{ background: 'rgba(7, 8, 15, 0.4)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '12px', padding: '16px' }}>
                    <span style={{ fontSize: '0.72rem', color: '#fbbf24', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Active Loans (ধারে আছে)</span>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fbbf24', marginTop: '6px' }}>{fmtVal(globalActiveLoans)}</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '4px' }}>Recovered: {fmtVal(globalReturnedLoans)}</div>
                  </div>
                  <div style={{ background: 'rgba(7, 8, 15, 0.4)', border: '1px solid rgba(129, 140, 248, 0.2)', borderRadius: '12px', padding: '16px' }}>
                    <span style={{ fontSize: '0.72rem', color: '#818cf8', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Net Liquid Savings</span>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#818cf8', marginTop: '6px' }}>{fmtVal(globalTotalSavings)}</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '4px' }}>Gross: {fmtVal(globalGrossSavings)} • Rate: {globalSavingsRate.toFixed(1)}%</div>
                  </div>
                </div>

                {/* Lifetime Debt Recovery & Liquidity Visual Gauge */}
                {(() => {
                  const globalTotalLent = globalActiveLoans + globalReturnedLoans;
                  const globalRecoveryRate = globalTotalLent > 0 ? Math.round((globalReturnedLoans / globalTotalLent) * 100) : 100;
                  const lockedPct = globalGrossSavings > 0 ? Math.min(100, Math.round((globalActiveLoans / globalGrossSavings) * 100)) : 0;

                  return (
                    <div style={{ background: 'rgba(15, 23, 42, 0.4)', border: '1px solid rgba(129, 140, 248, 0.2)', borderRadius: '12px', padding: '16px 20px', marginBottom: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <HandCoins size={18} style={{ color: '#fbbf24' }} /> Lifetime Debt Recovery & Liquidity Visual Hub
                        </div>
                        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: globalRecoveryRate >= 80 ? '#10b981' : '#fbbf24' }}>
                          Recovery Rate: {globalRecoveryRate}% (৳{globalReturnedLoans.toLocaleString()} / ৳{globalTotalLent.toLocaleString()})
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '12px' }}>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                            <span>Lifetime Debt Recovery Progress</span>
                            <span>{globalRecoveryRate}%</span>
                          </div>
                          <div style={{ height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${globalRecoveryRate}%`, background: 'linear-gradient(90deg, #f59e0b, #10b981)', borderRadius: '4px', transition: 'width 0.6s ease' }} />
                          </div>
                        </div>

                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                            <span>Capital at Risk (Savings Locked in Loans)</span>
                            <span style={{ color: lockedPct > 30 ? '#f87171' : '#818cf8' }}>{lockedPct}%</span>
                          </div>
                          <div style={{ height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${lockedPct}%`, background: 'linear-gradient(90deg, #818cf8, #ef4444)', borderRadius: '4px', transition: 'width 0.6s ease' }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* 🔥 FIRE (FINANCIAL INDEPENDENCE) & WEALTH SURVIVAL RADAR */}
                {(() => {
                  const avgMonthlyExpense = months.length > 0 ? globalTotalSpent / Math.max(1, months.length) : 0;
                  const fireTarget = avgMonthlyExpense * 12 * 25; // 25x Annualized Living Expenses (4% SWR Rule)
                  const fireProgress = fireTarget > 0 ? Math.min(100, (globalTotalSavings / fireTarget) * 100) : 0;
                  const runwayMonths = avgMonthlyExpense > 0 ? (globalTotalSavings / avgMonthlyExpense).toFixed(1) : '∞';

                  return (
                    <div style={{ background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%)', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: '14px', padding: '20px', marginBottom: '24px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                        <div>
                          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: '#fff' }}>
                            <Flame size={20} style={{ color: 'var(--accent-gold)' }} /> FIRE (Financial Independence) & Lifetime Survival Radar
                          </h3>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                            Calculated based on standard 4% Safe Withdrawal Rate (25x Annualized Outlays)
                          </span>
                        </div>
                        <span style={{ fontSize: '0.75rem', background: 'rgba(212, 175, 55, 0.15)', color: '#fef08a', border: '1px solid rgba(212, 175, 55, 0.3)', padding: '4px 12px', borderRadius: '20px', fontWeight: 700 }}>
                          🛡️ Survival Runway: {runwayMonths} Months
                        </span>
                      </div>

                      <div className={styles.grid2} style={{ gap: '16px', marginBottom: '14px' }}>
                        <div style={{ background: 'rgba(7, 8, 15, 0.4)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px', padding: '14px' }}>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>Average Monthly Outlay Pace</div>
                          <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#f87171', marginTop: '4px' }}>{fmtVal(Math.round(avgMonthlyExpense))}</div>
                          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>Based on {months.length} monthly ledger history</div>
                        </div>

                        <div style={{ background: 'rgba(7, 8, 15, 0.4)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px', padding: '14px' }}>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>Full FIRE Target Fund (25x Outlays)</div>
                          <div style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--accent-gold)', marginTop: '4px' }}>{fmtVal(Math.round(fireTarget))}</div>
                          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>Complete Sovereign Financial Independence Target</div>
                        </div>
                      </div>

                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '6px' }}>
                          <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>FIRE Independence Progress</span>
                          <span style={{ fontWeight: 800, color: fireProgress >= 100 ? '#10b981' : 'var(--accent-gold)' }}>
                            {fireProgress.toFixed(2)}% Achieved ({fmtVal(globalTotalSavings)} / {fmtVal(Math.round(fireTarget))})
                          </span>
                        </div>
                        <div style={{ height: '10px', background: 'rgba(255,255,255,0.06)', borderRadius: '5px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${fireProgress}%`, background: 'linear-gradient(90deg, #f59e0b, #34d399)', borderRadius: '5px', transition: 'width 0.8s ease' }} />
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* ⚡ SOVEREIGN WEALTH COMPOUND GROWTH & MONTE CARLO PROJECTION SIMULATOR */}
                {(() => {
                  const avgMonthlySavings = months.length > 0 ? globalTotalSavings / Math.max(1, months.length) : 0;
                  const currentNetAsset = globalTotalSavings;
                  const rate = 0.10; // 10% annual return benchmark

                  // Compound Interest Formula: A = P*(1+r/12)^(12*t) + PMT * [((1+r/12)^(12*t) - 1) / (r/12)]
                  const calcCompound = (years: number) => {
                    const r = rate / 12;
                    const n = years * 12;
                    const pVal = currentNetAsset * Math.pow(1 + r, n);
                    const pmtVal = avgMonthlySavings * ((Math.pow(1 + r, n) - 1) / r);
                    return Math.round(pVal + pmtVal);
                  };

                  const proj3Yr = calcCompound(3);
                  const proj5Yr = calcCompound(5);
                  const proj10Yr = calcCompound(10);

                  return (
                    <div style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(15, 23, 42, 0.8) 100%)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '14px', padding: '20px', marginBottom: '24px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                        <div>
                          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: '#fff' }}>
                            <Sparkles size={20} style={{ color: '#34d399' }} /> Sovereign Wealth Compound Growth Engine (10% CAGR Model)
                          </h3>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                            Simulates long-term wealth trajectory combining current liquid net worth and average monthly savings pace ({fmtVal(Math.round(avgMonthlySavings))}/mo).
                          </span>
                        </div>
                        <span style={{ fontSize: '0.75rem', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '4px 12px', borderRadius: '20px', fontWeight: 700 }}>
                          🚀 Compound Yield: 10% CAGR
                        </span>
                      </div>

                      <div className={styles.grid3} style={{ gap: '16px' }}>
                        <div style={{ background: 'rgba(7, 8, 15, 0.4)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px', padding: '14px' }}>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>3-Year Compound Value</div>
                          <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#34d399', marginTop: '4px' }}>{fmtVal(proj3Yr)}</div>
                          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>36 Months Compound Velocity</div>
                        </div>

                        <div style={{ background: 'rgba(7, 8, 15, 0.4)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px', padding: '14px' }}>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>5-Year Compound Value</div>
                          <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#60a5fa', marginTop: '4px' }}>{fmtVal(proj5Yr)}</div>
                          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>60 Months Sovereign Capital</div>
                        </div>

                        <div style={{ background: 'rgba(7, 8, 15, 0.4)', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: '10px', padding: '14px' }}>
                          <div style={{ fontSize: '0.72rem', color: 'var(--accent-gold)', textTransform: 'uppercase', fontWeight: 700 }}>10-Year Empire Fund</div>
                          <div style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--accent-gold)', marginTop: '4px' }}>{fmtVal(proj10Yr)}</div>
                          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>120 Months Exponential Growth</div>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Grid of Two Dynamic SVG Charts */}
                <div className={styles.grid2} style={{ gap: '24px', marginTop: '20px' }}>
                  
                  {/* Left Column: Revenue vs Spending Column Chart */}
                  <div style={{ background: 'rgba(7, 8, 15, 0.2)', border: '1px solid rgba(255, 255, 255, 0.02)', borderRadius: '12px', padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Revenue vs Spending Trend</span>
                      <div style={{ display: 'flex', gap: '12px', fontSize: '0.7rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: 6, height: 6, background: '#818cf8', borderRadius: 2 }} /> Income</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: 6, height: 6, background: '#f44336', borderRadius: 2 }} /> Expenses</div>
                      </div>
                    </div>
                    
                    <div style={{ width: '100%', overflowX: 'auto', background: 'rgba(7, 8, 15, 0.15)', borderRadius: '10px', padding: '12px' }}>
                      <svg viewBox="0 0 600 180" width="100%" height="150" style={{ display: 'block', overflow: 'visible' }}>
                        {/* Grid Lines */}
                        <line x1="40" y1="20" x2="580" y2="20" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                        <line x1="40" y1="70" x2="580" y2="70" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                        <line x1="40" y1="120" x2="580" y2="120" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                        <line x1="40" y1="150" x2="580" y2="150" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
                        
                        {/* Y Axis Legend */}
                        <text x="30" y="24" fill="var(--text-muted)" fontSize="8" textAnchor="end">High</text>
                        <text x="30" y="74" fill="var(--text-muted)" fontSize="8" textAnchor="end">Mid</text>
                        <text x="30" y="124" fill="var(--text-muted)" fontSize="8" textAnchor="end">Low</text>
                        <text x="30" y="154" fill="var(--text-muted)" fontSize="8" textAnchor="end">0</text>

                        {/* Draw Bar Groups */}
                        {months.map((m, idx) => {
                          const maxVal = Math.max(...months.map(x => Math.max(getIncomeTotal(x), getExpenseTotal(x))), 1);
                          const chartHeight = 120;
                          
                          const incHeight = (getIncomeTotal(m) / maxVal) * chartHeight;
                          const expHeight = (getExpenseTotal(m) / maxVal) * chartHeight;
                          
                          const numMonths = months.length;
                          const colWidth = 24;
                          const spacing = (500 - (numMonths * (colWidth * 2))) / (numMonths + 1);
                          const startX = 50 + spacing + idx * ((colWidth * 2) + spacing);
                          
                          return (
                            <g key={m._id}>
                              <rect x={startX} y={150 - incHeight} width="10" height={Math.max(incHeight, 2)} fill="#818cf8" rx="2" />
                              <rect x={startX + 12} y={150 - expHeight} width="10" height={Math.max(expHeight, 2)} fill="#f44336" rx="2" />
                              <text x={startX + 11} y="165" fill="var(--text-secondary)" fontSize="8" textAnchor="middle">
                                {m.monthName.split(' ')[0].slice(0, 3)}
                              </text>
                            </g>
                          );
                        })}
                      </svg>
                    </div>
                  </div>

                  {/* Right Column: Net Savings Trend Line/Area Chart */}
                  <div style={{ background: 'rgba(7, 8, 15, 0.2)', border: '1px solid rgba(255, 255, 255, 0.02)', borderRadius: '12px', padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Net Savings Growth Trend</span>
                      <span style={{ fontSize: '0.7rem', color: '#00e5ff', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ width: 6, height: 6, background: '#00e5ff', borderRadius: '50%' }} /> Savings (৳)
                      </span>
                    </div>

                    <div style={{ width: '100%', overflowX: 'auto', background: 'rgba(7, 8, 15, 0.15)', borderRadius: '10px', padding: '12px' }}>
                      {(() => {
                        const maxSav = Math.max(...months.map(m => getSavings(m)), 1);
                        const minSav = Math.min(...months.map(m => getSavings(m)), 0);
                        const savRange = maxSav - minSav || 1;
                        
                        const points = months.map((m, idx) => {
                          const x = 50 + idx * (500 / Math.max(months.length - 1, 1));
                          const y = 140 - ((getSavings(m) - minSav) / savRange) * 110;
                          return { x, y, m };
                        });
                        
                        const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
                        const areaD = points.length > 0 
                          ? `${pathD} L ${points[points.length - 1].x} 140 L ${points[0].x} 140 Z` 
                          : '';
                          
                        return (
                          <svg viewBox="0 0 600 180" width="100%" height="150" style={{ display: 'block', overflow: 'visible' }}>
                            <defs>
                              <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.25" />
                                <stop offset="100%" stopColor="#00e5ff" stopOpacity="0.0" />
                              </linearGradient>
                            </defs>
                            {/* Grid Lines */}
                            <line x1="40" y1="30" x2="580" y2="30" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                            <line x1="40" y1="85" x2="580" y2="85" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                            <line x1="40" y1="140" x2="580" y2="140" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
                            
                            {/* Y axis legend */}
                            <text x="35" y="34" fill="var(--text-muted)" fontSize="8" textAnchor="end">৳{maxSav.toLocaleString()}</text>
                            <text x="35" y="144" fill="var(--text-muted)" fontSize="8" textAnchor="end">৳{minSav.toLocaleString()}</text>

                            {/* Area */}
                            {areaD && <path d={areaD} fill="url(#savingsGrad)" />}
                            
                            {/* Smooth path */}
                            {pathD && (
                              <path 
                                d={pathD} 
                                fill="none" 
                                stroke="#00e5ff" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                style={{ filter: 'drop-shadow(0 0 4px rgba(0,229,255,0.4))' }}
                              />
                            )}

                            {/* Nodes */}
                            {points.map((p, idx) => (
                              <g key={idx}>
                                <circle cx={p.x} cy={p.y} r="3.5" fill="#00e5ff" stroke="#fff" strokeWidth="1" />
                                <text x={p.x} y={p.y - 8} fill="#fff" fontSize="8" fontWeight="700" textAnchor="middle">
                                  ৳{getSavings(p.m).toLocaleString()}
                                </text>
                                <text x={p.x} y="155" fill="var(--text-secondary)" fontSize="8" textAnchor="middle">
                                  {p.m.monthName.split(' ')[0].slice(0, 3)}
                                </text>
                              </g>
                            ))}
                          </svg>
                        );
                      })()}
                    </div>
                  </div>

                </div>

                {/* Dynamic Category Outlay breakdown */}
                {(() => {
                  const globalCategoryTotals = categoriesList.reduce((acc, cat) => {
                    const total = months.reduce((sum, m) => {
                      return sum + (m.expenses || []).filter(e => e.category === cat).reduce((s, e) => s + e.amount, 0);
                    }, 0);
                    acc[cat] = total;
                    return acc;
                  }, {} as { [key: string]: number });
                  const globalTotalExpense = Object.values(globalCategoryTotals).reduce((sum, v) => sum + v, 0) || 1;

                  return (
                    <div style={{ marginTop: '24px', background: 'rgba(7, 8, 15, 0.2)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '12px', padding: '18px' }}>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Consolidated Expense Outlay Breakdown</h4>
                      <div className={styles.grid2} style={{ gap: '16px' }}>
                        {categoriesList.map(cat => {
                          const amt = globalCategoryTotals[cat] || 0;
                          const pct = (amt / globalTotalExpense) * 100;
                          if (amt === 0) return null;
                          return (
                            <div key={cat} style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '8px', padding: '10px 14px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '6px' }}>
                                <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <span style={{ width: 8, height: 8, background: categoryColors[cat], borderRadius: '50%' }} />
                                  {cat}
                                </span>
                                <span style={{ color: 'var(--text-secondary)' }}>৳{amt.toLocaleString()} ({pct.toFixed(1)}%)</span>
                              </div>
                              <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${pct}%`, background: categoryColors[cat], borderRadius: 3 }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}

                {/* 🔮 FUTURE WEALTH PLANNING & FIRE SIMULATOR HUB */}
                {(() => {
                  const avgMonthlyIncome = months.length > 0 ? globalTotalIncome / months.length : 0;
                  const avgMonthlyExpense = months.length > 0 ? globalTotalSpent / months.length : 0;
                  const avgMonthlySavings = months.length > 0 ? globalTotalSavings / months.length : 0;
                  
                  // Emergency Reserve Coverage (Months of survival with zero income)
                  const emergencyReserveMonths = avgMonthlyExpense > 0 ? (globalTotalSavings / avgMonthlyExpense).toFixed(1) : '∞';

                  // FIRE Target (25x annual expense)
                  const annualExpense = avgMonthlyExpense * 12;
                  const fireTarget = annualExpense * 25;
                  const fireProgressPct = fireTarget > 0 ? Math.min(100, Math.round((globalTotalSavings / fireTarget) * 100)) : 0;

                  return (
                    <div style={{ marginTop: '24px', background: 'rgba(15, 23, 42, 0.4)', border: '1px solid rgba(129, 140, 248, 0.25)', borderRadius: '16px', padding: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <TrendingUp size={18} style={{ color: '#818cf8' }} /> Future Wealth Planning & Financial Independence (FIRE) Engine
                        </h4>
                        <span style={{ fontSize: '0.75rem', background: 'rgba(129, 140, 248, 0.15)', color: '#818cf8', border: '1px solid rgba(129, 140, 248, 0.3)', padding: '3px 10px', borderRadius: '20px', fontWeight: 700 }}>
                          Avg Net Savings: ৳{Math.round(avgMonthlySavings).toLocaleString()}/mo
                        </span>
                      </div>

                      {/* Future Growth Projections Grid */}
                      <div className={styles.grid4} style={{ marginBottom: '20px' }}>
                        <div style={{ background: 'rgba(7, 8, 15, 0.5)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '10px', padding: '14px' }}>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>1-Year Wealth Projection</div>
                          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>৳{Math.round(avgMonthlySavings * 12).toLocaleString()}</div>
                          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>Linear Accumulation</div>
                        </div>

                        <div style={{ background: 'rgba(7, 8, 15, 0.5)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '10px', padding: '14px' }}>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>3-Year Wealth Projection</div>
                          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#60a5fa', marginTop: '4px' }}>৳{Math.round(avgMonthlySavings * 36).toLocaleString()}</div>
                          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>Compound Reserve</div>
                        </div>

                        <div style={{ background: 'rgba(7, 8, 15, 0.5)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '10px', padding: '14px' }}>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>5-Year Wealth (8% ROI)</div>
                          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fbbf24', marginTop: '4px' }}>৳{Math.round((avgMonthlySavings * 60) * 1.22).toLocaleString()}</div>
                          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>With 8% Investment Yield</div>
                        </div>

                        <div style={{ background: 'rgba(7, 8, 15, 0.5)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '10px', padding: '14px' }}>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>Emergency Reserve Longevity</div>
                          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: Number(emergencyReserveMonths) >= 6 ? '#10b981' : '#f59e0b', marginTop: '4px' }}>
                            {emergencyReserveMonths} Months
                          </div>
                          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>Zero-Income Survival Runway</div>
                        </div>
                      </div>

                      {/* FIRE Goal Milestone Meter */}
                      <div style={{ background: 'rgba(7, 8, 15, 0.3)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '10px', padding: '14px 16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', marginBottom: '6px' }}>
                          <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Financial Independence (FIRE) Progress (Target: ৳{Math.round(fireTarget).toLocaleString()})</span>
                          <span style={{ fontWeight: 800, color: '#818cf8' }}>{fireProgressPct}% Achieved</span>
                        </div>
                        <div style={{ height: '8px', width: '100%', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${fireProgressPct}%`, background: 'linear-gradient(90deg, #6366f1, #c084fc)', borderRadius: '4px', transition: 'width 0.6s ease' }} />
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {walletSubTab === 'analytics' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Financial Health Scorecard & AI Advice */}
              <div className={styles.analyticsGrid}>
                
                {/* Financial Health Gauge Card */}
                <div className={styles.healthGaugeCard}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Financial Health Score</span>
                    <Award size={20} style={{ color: '#10b981' }} />
                  </div>
                  
                  {(() => {
                    const totalInc = months.reduce((acc, m) => acc + getIncomeTotal(m), 0);
                    const totalExp = months.reduce((acc, m) => acc + getExpenseTotal(m), 0);
                    const avgSavingsRate = totalInc > 0 ? ((totalInc - totalExp) / totalInc) * 100 : 0;
                    
                    let score = 50;
                    if (avgSavingsRate >= 40) score += 30;
                    else if (avgSavingsRate >= 20) score += 20;
                    else if (avgSavingsRate >= 10) score += 10;
                    
                    const pendingLoansCount = months.flatMap(m => m.loans || []).filter(l => l.status === 'Pending').length;
                    if (pendingLoansCount === 0) score += 20;
                    else if (pendingLoansCount <= 2) score += 10;

                    const capScore = Math.min(100, Math.max(10, score));
                    const grade = capScore >= 80 ? 'EXCELLENT' : capScore >= 60 ? 'GOOD' : 'NEEDS ATTENTION';
                    const color = capScore >= 80 ? '#10b981' : capScore >= 60 ? '#f59e0b' : '#ef4444';

                    return (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ position: 'relative', width: '90px', height: '90px', borderRadius: '50%', background: `conic-gradient(${color} ${capScore * 3.6}deg, rgba(255,255,255,0.08) 0deg)`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 20px ${color}33` }}>
                          <div style={{ width: '74px', height: '74px', borderRadius: '50%', background: '#0b0f19', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fff' }}>{capScore}</span>
                            <span style={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }}>/ 100</span>
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: color, marginBottom: '4px' }}>{grade} STATUS</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Based on savings margin ({avgSavingsRate.toFixed(1)}%) & loan safety</div>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* AI Smart Advice Card */}
                <div className={styles.walletCard} style={{ background: 'linear-gradient(135deg, rgba(129, 140, 248, 0.08) 0%, rgba(15, 23, 42, 0.4) 100%)', border: '1px solid rgba(129, 140, 248, 0.2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', color: '#818cf8', fontWeight: 700, fontSize: '0.9rem' }}>
                    <Sparkles size={18} /> Automated AI Wealth Advisor
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ fontSize: '0.8rem', color: '#e2e8f0', background: 'rgba(7, 8, 15, 0.4)', padding: '10px 12px', borderRadius: '8px', borderLeft: '3px solid #10b981' }}>
                      💡 <strong>Pro Tip:</strong> Re-invest 15% of monthly net savings into high-yield tech assets or emergency reserves.
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#e2e8f0', background: 'rgba(7, 8, 15, 0.4)', padding: '10px 12px', borderRadius: '8px', borderLeft: '3px solid var(--accent-gold)' }}>
                      ⚡ <strong>Budget Check:</strong> Keep fixed overheads below 30% of total salary for optimal wealth acceleration.
                    </div>
                  </div>
                </div>

              </div>

              {/* ⚡ NEW VISUAL MODULE 1: Monthly Wealth Velocity & Cash Flow Trend Matrix */}
              <div className={styles.walletCard} style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.5) 100%)', border: '1px solid rgba(59, 130, 246, 0.25)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <TrendingUp size={20} style={{ color: '#3b82f6' }} /> Monthly Wealth Velocity & Cash Flow Trend Matrix
                  </h3>
                  <span style={{ fontSize: '0.72rem', background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', padding: '3px 8px', borderRadius: '4px', fontWeight: 700 }}>
                    MULTI-MONTH TREND ENGINE
                  </span>
                </div>

                {(() => {
                  if (months.length === 0) return <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>No monthly ledger records found for trend analysis.</div>;

                  const maxMonthVal = Math.max(1, ...months.map(m => Math.max(getIncomeTotal(m), getExpenseTotal(m))));
                  const totalInflow = months.reduce((acc, m) => acc + getIncomeTotal(m), 0);
                  const totalOutflow = months.reduce((acc, m) => acc + getExpenseTotal(m), 0);
                  const bestSavingsMonth = [...months].sort((a, b) => (getIncomeTotal(b) - getExpenseTotal(b)) - (getIncomeTotal(a) - getExpenseTotal(a)))[0];

                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {/* Dual Bar Trend Comparison */}
                      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '150px', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.08)', overflowX: 'auto' }}>
                        {months.map((m) => {
                          const inc = getIncomeTotal(m);
                          const exp = getExpenseTotal(m);
                          const incHeight = (inc / maxMonthVal) * 100;
                          const expHeight = (exp / maxMonthVal) * 100;
                          const net = inc - exp;

                          return (
                            <div key={m._id} style={{ flex: 1, minWidth: '60px', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                              <div style={{ display: 'flex', gap: '3px', alignItems: 'flex-end', height: '100%', width: '100%', justifyContent: 'center' }}>
                                <div title={`Income: ${fmtVal(inc)}`} style={{ width: '45%', height: `${Math.max(8, incHeight)}%`, background: 'linear-gradient(180deg, #10b981 0%, #059669 100%)', borderRadius: '4px 4px 0 0', transition: 'all 0.3s ease' }} />
                                <div title={`Expense: ${fmtVal(exp)}`} style={{ width: '45%', height: `${Math.max(8, expHeight)}%`, background: 'linear-gradient(180deg, #ef4444 0%, #b91c1c 100%)', borderRadius: '4px 4px 0 0', transition: 'all 0.3s ease' }} />
                              </div>
                              <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#e2e8f0', marginTop: '6px', whiteSpace: 'nowrap' }}>
                                {m.monthName}
                              </span>
                              <span style={{ fontSize: '0.62rem', fontWeight: 800, color: net >= 0 ? '#34d399' : '#f87171' }}>
                                {fmtVal(net)}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Cash Flow Summary Metrics */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                        <div style={{ background: 'rgba(7, 8, 15, 0.4)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>Total Cumulative Inflow</span>
                          <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#34d399', marginTop: '2px' }}>{fmtVal(totalInflow)}</div>
                        </div>

                        <div style={{ background: 'rgba(7, 8, 15, 0.4)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>Total Cumulative Outflow</span>
                          <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#f87171', marginTop: '2px' }}>{fmtVal(totalOutflow)}</div>
                        </div>

                        <div style={{ background: 'rgba(7, 8, 15, 0.4)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.25)' }}>
                          <span style={{ fontSize: '0.7rem', color: '#fbbf24', textTransform: 'uppercase', fontWeight: 700 }}>Best Savings Month</span>
                          <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#fbbf24', marginTop: '2px' }}>{bestSavingsMonth?.monthName || 'N/A'}</div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* ⚡ NEW VISUAL MODULE 2: Debt Liability & Loan Exposure Radar */}
              <div className={styles.walletCard} style={{ background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(15, 23, 42, 0.5) 100%)', border: '1px solid rgba(245, 158, 11, 0.25)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldAlert size={20} style={{ color: 'var(--accent-gold)' }} /> Debt Liability & Pending Loan Safety Radar
                  </h3>
                  <span style={{ fontSize: '0.72rem', background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', padding: '3px 8px', borderRadius: '4px', fontWeight: 700 }}>
                    LIABILITY AUDIT
                  </span>
                </div>

                {(() => {
                  const pendingLoans = months.flatMap(m => m.loans || []).filter(l => l.status === 'Pending');
                  const totalPendingAmount = pendingLoans.reduce((acc, l) => acc + l.amount, 0);
                  const totalIncomeVal = months.reduce((acc, m) => acc + getIncomeTotal(m), 0);
                  const dtiRatio = totalIncomeVal > 0 ? (totalPendingAmount / totalIncomeVal) * 100 : 0;
                  const isSafeDti = dtiRatio <= 20;

                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                        <div style={{ background: 'rgba(7, 8, 15, 0.4)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>Total Active Liabilities</span>
                          <div style={{ fontSize: '1.3rem', fontWeight: 900, color: totalPendingAmount > 0 ? '#ef4444' : '#10b981', marginTop: '4px' }}>
                            {fmtVal(totalPendingAmount)}
                          </div>
                          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{pendingLoans.length} Unresolved loan entries</span>
                        </div>

                        <div style={{ background: 'rgba(7, 8, 15, 0.4)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(245, 158, 11, 0.25)' }}>
                          <span style={{ fontSize: '0.7rem', color: '#fbbf24', textTransform: 'uppercase', fontWeight: 700 }}>Debt-to-Income (DTI) Ratio</span>
                          <div style={{ fontSize: '1.3rem', fontWeight: 900, color: isSafeDti ? '#34d399' : '#f87171', marginTop: '4px' }}>
                            {dtiRatio.toFixed(1)}% <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>{isSafeDti ? '🟢 Safe Buffer' : '🔴 High Risk'}</span>
                          </div>
                          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Target: Under 20% total revenue</span>
                        </div>
                      </div>

                      {/* Pending Loans Table */}
                      {pendingLoans.length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#e2e8f0' }}>Pending Loan Outstandings:</span>
                          {pendingLoans.map(l => (
                            <div key={l._id || l.personName} style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div>
                                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>👤 {l.personName}</span>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                                  Date: {l.date ? new Date(l.date).toISOString().split('T')[0] : 'N/A'} {l.dueDate ? `| Due: ${new Date(l.dueDate).toISOString().split('T')[0]}` : ''}
                                </div>
                              </div>
                              <span style={{ fontSize: '1.05rem', fontWeight: 900, color: '#f87171' }}>{fmtVal(l.amount)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* Visual Category Distribution */}
              <div className={styles.walletCard}>
                <h3 style={{ margin: '0 0 20px', fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <PieChart size={20} style={{ color: '#10b981' }} /> Lifetime Spending Category Breakdown
                </h3>

                {(() => {
                  const categoryTotals: { [cat: string]: number } = {};
                  let grandTotalExp = 0;

                  months.forEach(m => {
                    (m.expenses || []).forEach(e => {
                      categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
                      grandTotalExp += e.amount;
                    });
                  });

                  const sortedCats = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);

                  if (sortedCats.length === 0) {
                    return <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>No expense records found to generate category distribution.</div>;
                  }

                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {sortedCats.map(([cat, amt]) => {
                        const pct = grandTotalExp > 0 ? (amt / grandTotalExp) * 100 : 0;
                        return (
                          <div key={cat} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                              <span style={{ fontWeight: 600, color: '#fff' }}>{cat}</span>
                              <span style={{ color: 'var(--text-secondary)' }}>
                                <strong style={{ color: '#fca5a5' }}>{fmtVal(amt)}</strong> ({pct.toFixed(1)}%)
                              </span>
                            </div>
                            <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.06)', borderRadius: '6px', overflow: 'hidden' }}>
                              <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, #10b981 0%, #3b82f6 100%)', borderRadius: '6px', transition: 'width 0.5s ease' }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {walletSubTab === 'wealth_vault' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Executive Net Worth HUD Card */}
              <div className={styles.walletCard} style={{ background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(15, 23, 42, 0.5) 100%)', border: '1px solid rgba(245, 158, 11, 0.25)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Net Worth Portfolio</span>
                    <h2 style={{ margin: '4px 0 0', fontSize: '2rem', fontWeight: 900, color: '#fff' }}>
                      {(() => {
                        const lifetimeSavings = months.reduce((acc, m) => acc + (getIncomeTotal(m) - getExpenseTotal(m)), 0);
                        const totalAssetsVal = assets.reduce((acc, a) => acc + a.value, 0);
                        const totalPendingLoans = months.flatMap(m => m.loans || []).filter(l => l.status === 'Pending').reduce((acc, l) => acc + l.amount, 0);
                        const netWorth = lifetimeSavings + totalAssetsVal - totalPendingLoans;
                        return fmtVal(netWorth);
                      })()}
                    </h2>
                  </div>
                  <button
                    onClick={() => {
                      setEditingAssetId('');
                      setAssetName('');
                      setAssetCategory('Bank');
                      setAssetValue('');
                      setAssetGrowthRate('');
                      setIsAssetModalOpen(true);
                    }}
                    style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)' }}
                  >
                    <Plus size={16} /> Add New Asset
                  </button>
                </div>

                {/* Net Worth Breakdown Pills */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Cumulative Liquid Savings</span>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#818cf8' }}>
                      {fmtVal(months.reduce((acc, m) => acc + (getIncomeTotal(m) - getExpenseTotal(m)), 0))}
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Total Assets Value</span>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#10b981' }}>
                      {fmtVal(assets.reduce((acc, a) => acc + a.value, 0))}
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Pending Loan Liabilities</span>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#ef4444' }}>
                      {fmtVal(months.flatMap(m => m.loans || []).filter(l => l.status === 'Pending').reduce((acc, l) => acc + l.amount, 0))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Financial Freedom Target Calculator */}
              <div className={styles.walletCard}>
                <h3 style={{ margin: '0 0 16px', fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Target size={20} style={{ color: 'var(--accent-gold)' }} /> Financial Freedom Milestone Target
                </h3>
                {(() => {
                  const netWorth = months.reduce((acc, m) => acc + (getIncomeTotal(m) - getExpenseTotal(m)), 0) + assets.reduce((acc, a) => acc + a.value, 0);
                  const progressPct = netWorthTarget > 0 ? Math.min(100, Math.max(0, (netWorth / netWorthTarget) * 100)) : 0;
                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          Target: <strong style={{ color: '#fff' }}>{fmtVal(netWorthTarget)}</strong>
                        </span>
                        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
                          {progressPct.toFixed(1)}% Achieved
                        </span>
                      </div>
                      <div style={{ width: '100%', height: '12px', background: 'rgba(255,255,255,0.06)', borderRadius: '6px', overflow: 'hidden' }}>
                        <div style={{ width: `${progressPct}%`, height: '100%', background: 'linear-gradient(90deg, #f59e0b 0%, #10b981 100%)', borderRadius: '6px' }} />
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Assets Portfolio List */}
              <div className={styles.walletCard}>
                <h3 style={{ margin: '0 0 20px', fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Briefcase size={20} style={{ color: '#818cf8' }} /> Asset Allocation Vault
                </h3>

                {assets.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '36px 16px', background: 'rgba(15, 23, 42, 0.4)', borderRadius: '12px', border: '1px dashed rgba(129, 140, 248, 0.3)' }}>
                    <Briefcase size={38} style={{ color: '#818cf8', marginBottom: '12px' }} />
                    <h4 style={{ margin: '0 0 6px', fontSize: '1rem', fontWeight: 800, color: '#fff' }}>No Assets Saved in Vault</h4>
                    <p style={{ margin: '0 0 16px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      Add your bank deposits, gadgets, liquid cash reserves, or investments to dynamically compute your total net worth portfolio.
                    </p>
                    <button
                      onClick={() => {
                        setEditingAssetId('');
                        setAssetName('');
                        setAssetCategory('Bank');
                        setAssetValue('');
                        setAssetGrowthRate('');
                        setIsAssetModalOpen(true);
                      }}
                      style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem' }}
                    >
                      <Plus size={16} /> Add First Asset to Database
                    </button>
                  </div>
                ) : (
                  <div className={styles.wealthGrid}>
                    {assets.map((asset) => (
                      <div key={asset.id || asset._id} className={styles.assetCardItem}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                          <div>
                            <span style={{ fontSize: '0.7rem', padding: '2px 8px', background: 'rgba(129, 140, 248, 0.15)', border: '1px solid rgba(129, 140, 248, 0.3)', borderRadius: '4px', color: '#818cf8', fontWeight: 700 }}>
                              {asset.category}
                            </span>
                            <h4 style={{ margin: '8px 0 0', fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>{asset.name}</h4>
                          </div>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            <button
                              onClick={() => {
                                setEditingAssetId(asset.id || asset._id || '');
                                setAssetName(asset.name);
                                setAssetCategory(asset.category);
                                setAssetValue(String(asset.value));
                                setAssetGrowthRate(String(asset.growthRate || 0));
                                setIsAssetModalOpen(true);
                              }}
                              style={{ background: 'transparent', border: 'none', color: '#818cf8', cursor: 'pointer', padding: '4px' }}
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteAsset(asset.id || asset._id || '')}
                              style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                          <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>{fmtVal(asset.value)}</span>
                          {asset.growthRate !== undefined && (
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: asset.growthRate >= 0 ? '#10b981' : '#ef4444' }}>
                              {asset.growthRate >= 0 ? `+${asset.growthRate}%/yr` : `${asset.growthRate}%/yr`}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {walletSubTab === 'ai_advisor' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Header HUD */}
              <div className={styles.walletCard} style={{ background: 'linear-gradient(135deg, rgba(129, 140, 248, 0.12) 0%, rgba(15, 23, 42, 0.6) 100%)', border: '1px solid rgba(129, 140, 248, 0.3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      🤖 ADVANCED FINANCIAL ML & EXECUTIVE ADVISORY COPILOT
                    </span>
                    <h2 style={{ margin: '4px 0 2px', fontSize: '1.8rem', fontWeight: 900, color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Sparkles size={24} style={{ color: 'var(--accent-gold)' }} /> AI Financial Advisor & Lifestyle Guidance
                    </h2>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      মেশিন লার্নিং ও অ্যাডভান্সড অ্যালগরিদম ভিত্তিক পার্সোনালাইজড আর্থিক দিকনির্দেশনা ও সিদ্ধান্ত সহায়িকা।
                    </p>
                  </div>

                  {/* Multi-Channel Push Action Buttons */}
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => handlePushAiAdvisory('email')}
                      style={{
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: '#fff',
                        border: 'none',
                        padding: '10px 16px',
                        borderRadius: '8px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.82rem',
                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                      }}
                    >
                      <Send size={15} /> ✉️ Push to Email
                    </button>
                    <button
                      onClick={() => handlePushAiAdvisory('telegram')}
                      style={{
                        background: 'linear-gradient(135deg, #0088cc 0%, #006699 100%)',
                        color: '#fff',
                        border: 'none',
                        padding: '10px 16px',
                        borderRadius: '8px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.82rem',
                        boxShadow: '0 4px 12px rgba(0, 136, 204, 0.3)'
                      }}
                    >
                      <MessageCircle size={15} /> 📲 Push to Telegram
                    </button>
                    <button
                      onClick={() => handlePushAiAdvisory('all')}
                      style={{
                        background: 'linear-gradient(135deg, #818cf8 0%, #4f46e5 100%)',
                        color: '#fff',
                        border: 'none',
                        padding: '10px 16px',
                        borderRadius: '8px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.82rem',
                        boxShadow: '0 4px 12px rgba(129, 140, 248, 0.3)'
                      }}
                    >
                      <Zap size={15} /> 🚀 Push All Channels
                    </button>
                  </div>
                </div>
              </div>

              {/* Main Analytics & Guidance Grid */}
              {(() => {
                const currentM = activeMonth || (months.length > 0 ? months[months.length - 1] : null);
                if (!currentM) return null;

                const inc = getIncomeTotal(currentM);
                const exp = getExpenseTotal(currentM);
                const loans = getActiveLoansTotal(currentM);
                const carriedOver = getCarriedOverSavings(currentM);
                const netSavings = getSavings(currentM);

                const now = new Date();
                const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
                const daysElapsed = Math.max(1, now.getDate());
                const daysRemaining = Math.max(1, daysInMonth - daysElapsed + 1);

                const dailyAvg = exp / daysElapsed;
                const safeDailyCap = Math.max(0, netSavings) / daysRemaining;
                const isSafePace = dailyAvg <= safeDailyCap;

                const anomalies = getOverBudgetCategories(currentM);

                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    
                    {/* ML Velocity & Health Score Gauge Grid */}
                    <div className={styles.grid3} style={{ gap: '16px' }}>
                      
                      {/* Card 1: Machine Learning Velocity */}
                      <div className={styles.walletCard} style={{ background: 'rgba(15, 23, 42, 0.4)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                          ⚡ ML Expenditure Velocity Model
                        </div>
                        <div style={{ fontSize: '1.6rem', fontWeight: 900, color: isSafePace ? '#34d399' : '#f87171', marginTop: '6px' }}>
                          {fmtVal(dailyAvg)} <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>/ day avg</span>
                        </div>
                        <div style={{ fontSize: '0.78rem', color: isSafePace ? '#34d399' : '#f87171', marginTop: '6px', fontWeight: 700 }}>
                          {isSafePace ? '🟢 Controlled Velocity' : `🔴 Over Pace by ${fmtVal(dailyAvg - safeDailyCap)}/day`}
                        </div>
                      </div>

                      {/* Card 2: Recommended Safe Daily Cap */}
                      <div className={styles.walletCard} style={{ background: 'rgba(15, 23, 42, 0.4)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#34d399', textTransform: 'uppercase' }}>
                          🎯 Recommended Safe Daily Limit
                        </div>
                        <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#34d399', marginTop: '6px' }}>
                          {fmtVal(safeDailyCap)} <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>/ day cap</span>
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                          For remaining {daysRemaining} days in {currentM.monthName}
                        </div>
                      </div>

                      {/* Card 3: Financial Health Rating */}
                      <div className={styles.walletCard} style={{ background: 'rgba(15, 23, 42, 0.4)', border: '1px solid rgba(129, 140, 248, 0.3)' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#818cf8', textTransform: 'uppercase' }}>
                          🛡️ Financial Health Index
                        </div>
                        <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#818cf8', marginTop: '6px' }}>
                          {getHealthScore(currentM)} / 100
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                          Zero-income runway: {exp > 0 ? Math.round(netSavings / (dailyAvg || 1)) : '∞'} days
                        </div>
                      </div>
                    </div>

                    {/* Section: Actionable Personal AI Recommendations ("কিভাবে চলা উচিত") */}
                    <div className={styles.walletCard} style={{ background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.6) 0%, rgba(30, 41, 59, 0.4) 100%)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                      <h3 style={{ margin: '0 0 16px', fontSize: '1.15rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Compass size={20} style={{ color: 'var(--accent-gold)' }} /> Personal AI Lifestyle & Budget Direction ("কিভাবে চলা উচিত")
                      </h3>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        
                        {/* Guidance Item 1 */}
                        <div style={{ background: 'rgba(15, 23, 42, 0.5)', borderLeft: `4px solid ${isSafePace ? '#10b981' : '#ef4444'}`, padding: '14px 16px', borderRadius: '8px', fontSize: '0.88rem', color: '#fff', lineHeight: 1.6 }}>
                          <strong>১. দৈনিক খরচের সঠিক সীমা (Daily Spending Cap):</strong><br />
                          {isSafePace ? (
                            <span>আপনার বর্তমান দৈনিক খরচ <strong>{fmtVal(dailyAvg)}/দিন</strong> যা আপনার বাজেট অনুযায়ী নিরাপদ সীমার মধ্যে আছে। এই গতি বজায় রাখলে মাস শেষে আপনার জমা সুরক্ষিত থাকবে।</span>
                          ) : (
                            <span>আপনার দৈনিক গড় খরচ নির্ধারিত সীমার চেয়ে বেশি হচ্ছে। প্রতিদিনের খরচ <strong>{fmtVal(safeDailyCap)} টাকার</strong> মধ্যে রাখলে মাস শেষে সঞ্চয় রক্ষা করা সম্ভব হবে।</span>
                          )}
                        </div>

                        {/* Guidance Item 2 */}
                        <div style={{ background: 'rgba(15, 23, 42, 0.5)', borderLeft: '4px solid #818cf8', padding: '14px 16px', borderRadius: '8px', fontSize: '0.88rem', color: '#fff', lineHeight: 1.6 }}>
                          <strong>২. সেভিংস বৃদ্ধি ও ছাঁটাই পরিকল্পনা (Savings Optimization):</strong><br />
                          বিগত মাসের জমানো টাকা (<strong>{fmtVal(carriedOver)}</strong>) সহ আপনার মোট নেট ব্যালেন্স রয়েছে <strong>{fmtVal(netSavings)}</strong>। অপ্রয়োজনীয় বিনোদন বা বাইরের খাবার খরচ সীমিত রাখলে আপনার জমানো তহবিল আরও সুরক্ষিত হবে।
                        </div>

                        {/* Guidance Item 3 */}
                        <div style={{ background: 'rgba(15, 23, 42, 0.5)', borderLeft: `4px solid ${anomalies.length > 0 ? '#f59e0b' : '#34d399'}`, padding: '14px 16px', borderRadius: '8px', fontSize: '0.88rem', color: '#fff', lineHeight: 1.6 }}>
                          <strong>৩. খাতের বাজেট ও ওভার-স্পেন্ডিং রিকভারি (Category Audit):</strong><br />
                          {anomalies.length > 0 ? (
                            <span>⚠️ <strong>{anomalies.map(a => a.category).join(', ')}</strong> খাতে আপনি বাজেটের বেশি খরচ করেছেন। এই খাতে বাকি দিনগুলোতে কেনাকাটা স্থগিত রাখার পরামর্শ দেওয়া হচ্ছে।</span>
                          ) : (
                            <span>✅ আপনার কোনো নির্দিষ্ট ক্যাটাগরিতে বাজেট অতিক্রম করেনি। এটি অত্যন্ত শৃঙ্খলাবদ্ধ আর্থিক অভ্যাসের নির্দেশক।</span>
                          )}
                        </div>

                        {/* Guidance Item 4 */}
                        <div style={{ background: 'rgba(15, 23, 42, 0.5)', borderLeft: `4px solid ${loans > 0 ? '#fbbf24' : '#10b981'}`, padding: '14px 16px', borderRadius: '8px', fontSize: '0.88rem', color: '#fff', lineHeight: 1.6 }}>
                          <strong>৪. বকেয়া লোন ও পাওনা ব্যবস্থাপনা (Debt Pacing):</strong><br />
                          {loans > 0 ? (
                            <span>বাজারে আপনার মোট <strong>{fmtVal(loans)}</strong> পাওনা বা লোন রয়েছে। ১-ক্লিক রিমাইন্ডারের মাধ্যমে এই টাকা আদায়ের পদক্ষেপ নিন।</span>
                          ) : (
                            <span>বর্তমানে কোনো পেন্ডিং লোন নেই। সমস্ত দেওয়া ধার আদায় হয়েছে।</span>
                          )}
                        </div>

                      </div>
                    </div>

                  </div>
                );
              })()}

            </div>
          )}

          {walletSubTab === 'daily_intel' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Daily Pace HUD Header */}
              <div className={styles.walletCard} style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(15, 23, 42, 0.5) 100%)', border: '1px solid rgba(129, 140, 248, 0.25)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#818cf8', textTransform: 'uppercase', letterSpacing: '1px' }}>Daily Spending & Budget Guidance Engine</span>
                    <h2 style={{ margin: '4px 0 0', fontSize: '1.8rem', fontWeight: 900, color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Zap size={24} style={{ color: 'var(--accent-gold)' }} /> Daily Expense Pace & AI Advisor
                    </h2>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => fetchMonths()}
                      style={{
                        background: 'rgba(99, 102, 241, 0.15)',
                        color: '#a5b4fc',
                        border: '1px solid rgba(129, 140, 248, 0.3)',
                        padding: '10px 16px',
                        borderRadius: '8px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.82rem'
                      }}
                    >
                      <RefreshCw size={15} /> Sync & Reload DB
                    </button>

                    <button
                      onClick={() => handleSaveDailyIntelSettings()}
                      style={{
                        background: 'rgba(16, 185, 129, 0.15)',
                        color: '#34d399',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        padding: '10px 16px',
                        borderRadius: '8px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.82rem'
                      }}
                    >
                      <Save size={15} /> Save Settings to DB
                    </button>

                    <button
                      onClick={handleSendTelegramPacePush}
                      disabled={sendingTelegramPush}
                      style={{
                        background: 'linear-gradient(135deg, #0088cc 0%, #006699 100%)',
                        color: '#fff',
                        border: 'none',
                        padding: '10px 16px',
                        borderRadius: '8px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 12px rgba(0, 136, 204, 0.3)',
                        opacity: sendingTelegramPush ? 0.7 : 1,
                        fontSize: '0.82rem'
                      }}
                    >
                      <MessageCircle size={16} /> {sendingTelegramPush ? 'Pushing Telegram...' : 'Telegram Push Alert'}
                    </button>

                    <button
                      onClick={handleSendTestEmailReport}
                      disabled={sendingEmailReport}
                      style={{
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: '#fff',
                        border: 'none',
                        padding: '10px 16px',
                        borderRadius: '8px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                        opacity: sendingEmailReport ? 0.7 : 1,
                        fontSize: '0.82rem'
                      }}
                    >
                      <Send size={16} /> {sendingEmailReport ? 'Sending Email...' : 'Send Test Email Report'}
                    </button>
                  </div>
                </div>

                {/* Daily Metrics Dashboard Pills & No-Spend Streak */}
                {(() => {
                  const now = new Date();
                  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
                  const daysElapsed = Math.max(1, now.getDate());
                  const daysRemaining = Math.max(1, daysInMonth - daysElapsed + 1);

                  const currentMonthData = activeMonth || months[0];
                  const totalExp = currentMonthData ? getExpenseTotal(currentMonthData) : 0;
                  const totalInc = currentMonthData ? getIncomeTotal(currentMonthData) : 0;
                  const netSav = totalInc - totalExp;

                  const dailyAverage = totalExp / daysElapsed;
                  const recommendedDailyCap = Math.max(0, netSav) / daysRemaining;
                  const isSafePace = dailyAverage <= recommendedDailyCap;

                  // No spend days calculator
                  const expenseDates = new Set((currentMonthData?.expenses || []).map(e => 
                    e.date ? new Date(e.date).toISOString().split('T')[0] : ''
                  ).filter(Boolean));

                  let noSpendDays = 0;
                  for (let d = 1; d <= daysElapsed; d++) {
                    const dateStr = new Date(now.getFullYear(), now.getMonth(), d).toISOString().split('T')[0];
                    if (!expenseDates.has(dateStr)) noSpendDays++;
                  }

                  return (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                      <div style={{ background: 'rgba(7, 8, 15, 0.4)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>Current Daily Average</span>
                        <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#f87171', marginTop: '4px' }}>
                          {fmtVal(dailyAverage)} <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>/ day</span>
                        </div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Based on {daysElapsed} days elapsed</span>
                      </div>

                      <div style={{ background: 'rgba(7, 8, 15, 0.4)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>Recommended Safe Daily Limit</span>
                        <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#10b981', marginTop: '4px' }}>
                          {fmtVal(recommendedDailyCap)} <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>/ day</span>
                        </div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>For remaining {daysRemaining} days</span>
                      </div>

                      <div style={{ background: 'rgba(7, 8, 15, 0.4)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>Spending Velocity</span>
                        <div style={{ fontSize: '1.1rem', fontWeight: 900, color: isSafePace ? '#10b981' : '#ef4444', marginTop: '6px' }}>
                          {isSafePace ? '🟢 OPTIMAL / SAFE' : '🔴 HIGH SPENDING PACE'}
                        </div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          {isSafePace ? 'Within target savings margin' : 'Consider reducing daily spend'}
                        </span>
                      </div>

                      <div style={{ background: 'rgba(7, 8, 15, 0.4)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(251, 191, 36, 0.25)' }}>
                        <span style={{ fontSize: '0.72rem', color: '#fbbf24', textTransform: 'uppercase', fontWeight: 700 }}>🔥 No-Spend Streak</span>
                        <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#fbbf24', marginTop: '4px' }}>
                          {noSpendDays} Days <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#fef08a' }}>Achieved 🌟</span>
                        </div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Days with ৳0 expenditure</span>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* 📈 SECTION 1: Dynamic Interactive Day-by-Day Expenditure Bar Chart (1st to 31st) */}
              <div className={styles.walletCard} style={{ background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.7) 0%, rgba(30, 41, 59, 0.4) 100%)', border: '1px solid rgba(99, 102, 241, 0.25)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <BarChart3 size={20} style={{ color: '#818cf8' }} /> Day-by-Day Daily Expenditure Timeline (তারিখ অনুযায়ী খরচ)
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: '#a5b4fc', background: 'rgba(129, 140, 248, 0.15)', padding: '3px 8px', borderRadius: '6px', fontWeight: 700 }}>
                    1st to 31st Live Ledger Breakdown
                  </span>
                </div>

                {(() => {
                  const now = new Date();
                  const currentMonthData = activeMonth || months[0];
                  const daysInMonth = currentMonthData ? new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate() : 31;
                  
                  const dailyTotals: { [day: number]: { total: number; items: string[] } } = {};
                  for (let d = 1; d <= daysInMonth; d++) {
                    dailyTotals[d] = { total: 0, items: [] };
                  }

                  if (currentMonthData && currentMonthData.expenses) {
                    currentMonthData.expenses.forEach(e => {
                      if (e.date) {
                        const d = new Date(e.date).getDate();
                        if (dailyTotals[d]) {
                          dailyTotals[d].total += e.amount;
                          dailyTotals[d].items.push(`${e.description} (${fmtVal(e.amount)})`);
                        }
                      }
                    });
                  }

                  const maxDailySpend = Math.max(1, ...Object.values(dailyTotals).map(v => v.total));

                  return (
                    <div>
                      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '140px', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.08)', overflowX: 'auto' }}>
                        {Object.entries(dailyTotals).map(([dayNum, data]) => {
                          const heightPct = (data.total / maxDailySpend) * 100;
                          const isZero = data.total === 0;
                          const barBg = isZero 
                            ? 'rgba(251, 191, 36, 0.3)' 
                            : data.total > 2000 
                              ? 'linear-gradient(180deg, #ef4444 0%, #b91c1c 100%)' 
                              : 'linear-gradient(180deg, #6366f1 0%, #3b82f6 100%)';

                          return (
                            <div 
                              key={dayNum} 
                              title={`Day ${dayNum}: ${fmtVal(data.total)}${data.items.length ? '\n' + data.items.join('\n') : '\nNo Spend Day'}`}
                              style={{ flex: 1, minWidth: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end', cursor: 'pointer' }}
                            >
                              <div 
                                style={{ 
                                  width: '100%', 
                                  height: `${Math.max(isZero ? 6 : 10, heightPct)}%`, 
                                  background: barBg, 
                                  borderRadius: '4px 4px 0 0',
                                  transition: 'all 0.3s ease' 
                                }} 
                              />
                              <span style={{ fontSize: '0.62rem', color: isZero ? '#fbbf24' : 'var(--text-secondary)', marginTop: '4px', fontWeight: isZero ? 800 : 400 }}>
                                {dayNum}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        <div style={{ display: 'flex', gap: '14px' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span style={{ width: '10px', height: '10px', background: '#6366f1', borderRadius: '2px' }} /> Normal Spend
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span style={{ width: '10px', height: '10px', background: '#ef4444', borderRadius: '2px' }} /> Peak Day (&gt; ৳2,000)
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span style={{ width: '10px', height: '10px', background: '#fbbf24', borderRadius: '2px' }} /> No-Spend Day
                          </span>
                        </div>
                        <span>Hover bars to see exact date items</span>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* 🔮 SECTION 2: AI Expense Anomaly & Impulse Purchase Radar */}
              <div className={styles.walletCard} style={{ background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(15, 23, 42, 0.5) 100%)', border: '1px solid rgba(239, 68, 68, 0.25)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldAlert size={20} style={{ color: '#ef4444' }} /> AI Impulse Purchase & Expense Anomaly Radar
                  </h3>
                  <span style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#fca5a5', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '3px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 800 }}>
                    HIGH-SPIKE SPIRE RADAR
                  </span>
                </div>

                {(() => {
                  const currentMonthData = activeMonth || months[0];
                  const expenses = currentMonthData?.expenses || [];
                  if (expenses.length === 0) {
                    return <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>No expense records available for anomaly detection.</div>;
                  }

                  const avgExp = getExpenseTotal(currentMonthData) / Math.max(1, expenses.length);
                  const spikes = expenses.filter(e => e.amount >= 600 || e.amount > avgExp * 2.5);
                  const spikeTotal = spikes.reduce((acc, s) => acc + s.amount, 0);
                  const disciplineScore = Math.max(50, 100 - spikes.length * 8);

                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                        <div style={{ background: 'rgba(7, 8, 15, 0.4)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>Financial Discipline Score</span>
                          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: disciplineScore >= 80 ? '#34d399' : '#fbbf24', marginTop: '4px' }}>
                            {disciplineScore}/100 <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>{disciplineScore >= 80 ? '🌟 High Control' : '⚡ Moderate Control'}</span>
                          </div>
                        </div>

                        <div style={{ background: 'rgba(7, 8, 15, 0.4)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(239, 68, 68, 0.25)' }}>
                          <span style={{ fontSize: '0.7rem', color: '#fca5a5', textTransform: 'uppercase', fontWeight: 700 }}>High-Spike Outlay Total</span>
                          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#ef4444', marginTop: '4px' }}>
                            {fmtVal(spikeTotal)}
                          </div>
                          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{spikes.length} High-value transactions flagged</span>
                        </div>
                      </div>

                      {/* Flagged Spikes Breakdown */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#e2e8f0' }}>Flagged Expense Outliers:</span>
                        {spikes.slice(0, 4).map(s => (
                          <div key={s._id || s.description} style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff' }}>{s.description}</span>
                              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                                Category: {s.category} | Date: {s.date ? new Date(s.date).toISOString().split('T')[0] : 'N/A'}
                              </div>
                            </div>
                            <span style={{ fontSize: '1rem', fontWeight: 900, color: '#f87171' }}>{fmtVal(s.amount)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* 📅 SECTION 3: Dynamic 31-Day Heat-Calendar Matrix */}
              <div className={styles.walletCard} style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(15, 23, 42, 0.5) 100%)', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar size={20} style={{ color: '#34d399' }} /> 31-Day Expense Heat-Calendar Matrix
                  </h3>
                  <span style={{ fontSize: '0.72rem', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '3px 8px', borderRadius: '4px', fontWeight: 700 }}>
                    MONTHLY INTENSITY MAP
                  </span>
                </div>

                {(() => {
                  const now = new Date();
                  const currentMonthData = activeMonth || months[0];
                  const daysInMonth = currentMonthData ? new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate() : 31;
                  
                  const dailyMap: { [day: number]: number } = {};
                  if (currentMonthData && currentMonthData.expenses) {
                    currentMonthData.expenses.forEach(e => {
                      if (e.date) {
                        const d = new Date(e.date).getDate();
                        dailyMap[d] = (dailyMap[d] || 0) + e.amount;
                      }
                    });
                  }

                  const gridCells = [];
                  for (let d = 1; d <= daysInMonth; d++) {
                    const amt = dailyMap[d] || 0;
                    let bg = 'rgba(16, 185, 129, 0.25)';
                    let borderColor = 'rgba(16, 185, 129, 0.4)';
                    let labelColor = '#34d399';

                    if (amt === 0) {
                      bg = 'rgba(16, 185, 129, 0.15)';
                      borderColor = 'rgba(16, 185, 129, 0.3)';
                      labelColor = '#6ee7b7';
                    } else if (amt > 2000) {
                      bg = 'rgba(239, 68, 68, 0.25)';
                      borderColor = 'rgba(239, 68, 68, 0.5)';
                      labelColor = '#fca5a5';
                    } else if (amt > 1000) {
                      bg = 'rgba(245, 158, 11, 0.2)';
                      borderColor = 'rgba(245, 158, 11, 0.4)';
                      labelColor = '#fbbf24';
                    } else {
                      bg = 'rgba(99, 102, 241, 0.2)';
                      borderColor = 'rgba(99, 102, 241, 0.4)';
                      labelColor = '#a5b4fc';
                    }

                    gridCells.push(
                      <div 
                        key={d} 
                        title={`Date: ${d} | Spent: ${fmtVal(amt)}`}
                        style={{ 
                          background: bg, 
                          border: `1px solid ${borderColor}`, 
                          borderRadius: '8px', 
                          padding: '10px 4px', 
                          textAlign: 'center',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: labelColor }}>Day {d}</span>
                        <span style={{ fontSize: '0.7rem', fontWeight: 900, color: '#fff', marginTop: '2px' }}>
                          {amt === 0 ? '৳0 🌟' : fmtVal(amt)}
                        </span>
                      </div>
                    );
                  }

                  return (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(75px, 1fr))', gap: '8px' }}>
                      {gridCells}
                    </div>
                  );
                })()}
              </div>

              {/* 🎛️ SECTION 4: Interactive Daily Budget Simulator & End-of-Month Projection Engine */}
              {(() => {
                const now = new Date();
                const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
                const daysElapsed = Math.max(1, now.getDate());
                const daysRemaining = Math.max(1, daysInMonth - daysElapsed + 1);

                const currentMonthData = activeMonth || months[0];
                const totalExp = currentMonthData ? getExpenseTotal(currentMonthData) : 0;
                const totalInc = currentMonthData ? getIncomeTotal(currentMonthData) : 0;
                const currentNetSavings = totalInc - totalExp;

                const projectedRemainingSpend = targetDailyCap * daysRemaining;
                const projectedTotalExp = totalExp + projectedRemainingSpend;
                const projectedEndSavings = totalInc - projectedTotalExp;
                const projectedSavingsRate = totalInc > 0 ? (projectedEndSavings / totalInc) * 100 : 0;
                const runwayDays = targetDailyCap > 0 ? Math.max(0, currentNetSavings) / targetDailyCap : 0;

                return (
                  <div className={styles.walletCard} style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%)', border: '1px solid rgba(0, 229, 255, 0.25)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                      <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Sliders size={20} style={{ color: '#00e5ff' }} /> Interactive Daily Budget Simulator & Projection Engine
                      </h3>
                      <button
                        onClick={() => handleSaveDailyIntelSettings(targetDailyCap)}
                        style={{ background: 'rgba(0, 229, 255, 0.15)', color: '#00e5ff', border: '1px solid rgba(0, 229, 255, 0.3)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <Save size={14} /> Save Daily Cap to Database
                      </button>
                    </div>

                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0 0 16px' }}>
                      Adjust your target daily spending limit below to instantly project your End-of-Month Savings balance and runway coverage.
                    </p>

                    {/* Range Slider & Preset Buttons */}
                    <div style={{ background: 'rgba(7, 8, 15, 0.4)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#e2e8f0' }}>Target Daily Spending Cap:</span>
                        <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#00e5ff' }}>{fmtVal(targetDailyCap)} / day</span>
                      </div>

                      <input
                        type="range"
                        min={500}
                        max={5000}
                        step={100}
                        value={targetDailyCap}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setTargetDailyCap(val);
                        }}
                        style={{ width: '100%', height: '8px', borderRadius: '4px', cursor: 'pointer', accentColor: '#00e5ff', marginBottom: '14px' }}
                      />

                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {[
                          { label: '৳1,000 / day (Ultra Saver)', val: 1000 },
                          { label: '৳1,800 / day (Balanced)', val: 1800 },
                          { label: '৳2,500 / day (Comfortable)', val: 2500 },
                          { label: '৳3,500 / day (Flex)', val: 3500 },
                        ].map((preset) => (
                          <button
                            key={preset.val}
                            onClick={() => {
                              setTargetDailyCap(preset.val);
                              handleSaveDailyIntelSettings(preset.val);
                            }}
                            style={{
                              background: targetDailyCap === preset.val ? 'rgba(0, 229, 255, 0.2)' : 'rgba(255,255,255,0.04)',
                              color: targetDailyCap === preset.val ? '#00e5ff' : 'var(--text-secondary)',
                              border: targetDailyCap === preset.val ? '1px solid #00e5ff' : '1px solid rgba(255,255,255,0.08)',
                              padding: '6px 12px',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Simulation Live Metrics Result Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                      <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>Projected Remaining Spend</span>
                        <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#f87171', marginTop: '4px' }}>
                          {fmtVal(projectedRemainingSpend)}
                        </div>
                        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>At {fmtVal(targetDailyCap)}/day for {daysRemaining} days</span>
                      </div>

                      <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                        <span style={{ fontSize: '0.7rem', color: '#34d399', textTransform: 'uppercase', fontWeight: 700 }}>Projected End Net Savings</span>
                        <div style={{ fontSize: '1.2rem', fontWeight: 900, color: projectedEndSavings >= 0 ? '#34d399' : '#ef4444', marginTop: '4px' }}>
                          {fmtVal(projectedEndSavings)}
                        </div>
                        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Savings Margin: {projectedSavingsRate.toFixed(1)}%</span>
                      </div>

                      <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(129, 140, 248, 0.3)' }}>
                        <span style={{ fontSize: '0.7rem', color: '#a5b4fc', textTransform: 'uppercase', fontWeight: 700 }}>Savings Runway Coverage</span>
                        <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#818cf8', marginTop: '4px' }}>
                          {runwayDays.toFixed(1)} Days
                        </div>
                        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Living coverage by current savings</span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* 🧠 SECTION 5: AI Category Daily Pace Breakdown & Advisory Matrix */}
              <div className={styles.walletCard} style={{ background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(15, 23, 42, 0.5) 100%)', border: '1px solid rgba(245, 158, 11, 0.25)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sparkles size={20} style={{ color: '#f59e0b' }} /> AI Category Daily Pace Breakdown & Advisory
                  </h3>
                  <button
                    onClick={() => handleSaveDailyIntelSettings()}
                    style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Save size={14} /> Sync Budgets to Database
                  </button>
                </div>

                {(() => {
                  const now = new Date();
                  const daysElapsed = Math.max(1, now.getDate());
                  const currentMonthData = activeMonth || months[0];
                  
                  if (!currentMonthData || !currentMonthData.expenses || currentMonthData.expenses.length === 0) {
                    return <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>No expense data logged for category pace analysis.</div>;
                  }

                  const catTotals: { [cat: string]: number } = {};
                  let totalExp = 0;
                  currentMonthData.expenses.forEach(e => {
                    const cat = e.category || 'Other';
                    catTotals[cat] = (catTotals[cat] || 0) + e.amount;
                    totalExp += e.amount;
                  });

                  const sortedCats = Object.entries(catTotals).sort((a, b) => b[1] - a[1]);
                  const topCategory = sortedCats[0];
                  const topCatPct = totalExp > 0 && topCategory ? (topCategory[1] / totalExp) * 100 : 0;

                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                        {sortedCats.map(([cat, amt]) => {
                          const dailyCategoryPace = amt / daysElapsed;
                          const budgetCap = categoryBudgets[cat] || 5000;
                          const isOver = amt > budgetCap;

                          return (
                            <div key={cat} style={{ background: 'rgba(15, 23, 42, 0.4)', padding: '12px', borderRadius: '10px', border: isOver ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(255,255,255,0.06)' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#fff' }}>{cat}</span>
                                {isOver && <span style={{ fontSize: '0.65rem', background: 'rgba(239,68,68,0.2)', color: '#fca5a5', padding: '1px 5px', borderRadius: '4px', fontWeight: 800 }}>EXCEEDED</span>}
                              </div>
                              <div style={{ fontSize: '1.05rem', fontWeight: 900, color: isOver ? '#ef4444' : '#fbbf24' }}>
                                {fmtVal(dailyCategoryPace)} <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>/ day</span>
                              </div>
                              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Total: {fmtVal(amt)} (Cap: {fmtVal(budgetCap)})</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Smart Advisory Banner */}
                      <div style={{ background: 'rgba(15, 23, 42, 0.7)', borderLeft: '4px solid #f59e0b', padding: '14px 16px', borderRadius: '8px', fontSize: '0.82rem', color: '#e2e8f0', lineHeight: 1.6 }}>
                        💡 <strong>Smart Advisory:</strong> {topCategory ? `${topCategory[0]} খরচে আপনার বাজেটের ${topCatPct.toFixed(0)}% খরচ হয়েছে। দৈনিক খরচের হার নিয়ন্ত্রণ করলে মাসে অতিরিক্ত সেভিংস নিশ্চিত থাকবে।` : 'দৈনিক বাজেটের সীমার মধ্যে খরচ বজায় রাখুন।'}
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* 🛡️ SECTION 6: AI Living Runway & Emergency Financial Readiness Meter */}
              <div className={styles.walletCard} style={{ background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.08) 0%, rgba(15, 23, 42, 0.5) 100%)', border: '1px solid rgba(192, 132, 252, 0.25)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Activity size={20} style={{ color: '#c084fc' }} /> AI Living Runway & Emergency Buffer Meter
                  </h3>
                  <span style={{ fontSize: '0.72rem', background: 'rgba(192, 132, 252, 0.15)', color: '#c084fc', padding: '3px 8px', borderRadius: '4px', fontWeight: 700 }}>
                    LIVING RUNWAY AUDIT
                  </span>
                </div>

                {(() => {
                  const currentMonthData = activeMonth || months[0];
                  const expenses = currentMonthData?.expenses || [];
                  const coreOverhead = expenses.filter(e => e.category === 'Rent' || e.category === 'Food' || e.category === 'Utility').reduce((acc, e) => acc + e.amount, 0) || 12000;
                  const totalNetSavings = months.reduce((acc, m) => acc + (getIncomeTotal(m) - getExpenseTotal(m)), 0);
                  const totalAssetsVal = assets.reduce((acc, a) => acc + a.value, 0);
                  const totalLiquidBuffer = Math.max(0, totalNetSavings + totalAssetsVal);
                  const runwayMonths = coreOverhead > 0 ? totalLiquidBuffer / coreOverhead : 0;
                  const isHealthyBuffer = runwayMonths >= 3;

                  return (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                      <div style={{ background: 'rgba(7, 8, 15, 0.4)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>Core Essential Monthly Overhead</span>
                        <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#a5b4fc', marginTop: '4px' }}>
                          {fmtVal(coreOverhead)} <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>/ month</span>
                        </div>
                        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Rent + Food + Utility essential baseline</span>
                      </div>

                      <div style={{ background: 'rgba(7, 8, 15, 0.4)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(192, 132, 252, 0.3)' }}>
                        <span style={{ fontSize: '0.7rem', color: '#c084fc', textTransform: 'uppercase', fontWeight: 700 }}>Living Emergency Runway</span>
                        <div style={{ fontSize: '1.3rem', fontWeight: 900, color: isHealthyBuffer ? '#34d399' : '#fbbf24', marginTop: '4px' }}>
                          {runwayMonths.toFixed(1)} Months <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#e9d5ff' }}>Buffer 🛡️</span>
                        </div>
                        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{isHealthyBuffer ? 'Sufficient liquid runway buffer' : 'Consider building emergency reserves'}</span>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* 🔥 SECTION 7: Peak Spending Days & Weekday Heatmap */}
              <div className={styles.toolsGrid}>
                
                {/* Top Highest Spending Days */}
                <div className={styles.walletCard}>
                  <h3 style={{ margin: '0 0 16px', fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Flame size={20} style={{ color: '#ef4444' }} /> Peak Expenditure Days (কোন দিন বেশি খরচ হচ্ছে)
                  </h3>

                  {(() => {
                    const currentMonthData = activeMonth || months[0];
                    if (!currentMonthData || !currentMonthData.expenses || currentMonthData.expenses.length === 0) {
                      return <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>No expense records logged for this period.</div>;
                    }

                    const dateMap: { [date: string]: { total: number; items: string[] } } = {};
                    currentMonthData.expenses.forEach(e => {
                      const dateStr = e.date ? new Date(e.date).toISOString().split('T')[0] : 'Other';
                      if (!dateMap[dateStr]) dateMap[dateStr] = { total: 0, items: [] };
                      dateMap[dateStr].total += e.amount;
                      dateMap[dateStr].items.push(`${e.description} (${fmtVal(e.amount)})`);
                    });

                    const sortedDates = Object.entries(dateMap).sort((a, b) => b[1].total - a[1].total).slice(0, 4);

                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {sortedDates.map(([date, data], index) => (
                          <div key={date} style={{ background: 'rgba(15, 23, 42, 0.4)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <span style={{ fontSize: '0.7rem', padding: '2px 6px', background: index === 0 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(129, 140, 248, 0.15)', color: index === 0 ? '#fca5a5' : '#a5b4fc', borderRadius: '4px', fontWeight: 700 }}>
                                #{index + 1} PEAK DATE: {date}
                              </span>
                              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                                {data.items.slice(0, 2).join(', ')}
                              </div>
                            </div>
                            <span style={{ fontSize: '1.05rem', fontWeight: 900, color: '#f87171' }}>{fmtVal(data.total)}</span>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>

                {/* Weekday Spending Distribution (Heatmap) */}
                <div className={styles.walletCard}>
                  <h3 style={{ margin: '0 0 16px', fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar size={20} style={{ color: 'var(--accent-gold)' }} /> Weekday Expenditure Distribution
                  </h3>

                  {(() => {
                    const currentMonthData = activeMonth || months[0];
                    const weekdayTotals: { [day: string]: number } = {
                      Friday: 0, Saturday: 0, Sunday: 0, Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0
                    };
                    let grandTotal = 0;

                    if (currentMonthData && currentMonthData.expenses) {
                      currentMonthData.expenses.forEach(e => {
                        if (e.date) {
                          const dayName = new Date(e.date).toLocaleDateString('en-US', { weekday: 'long' });
                          if (weekdayTotals[dayName] !== undefined) {
                            weekdayTotals[dayName] += e.amount;
                            grandTotal += e.amount;
                          }
                        }
                      });
                    }

                    const dayNamesInOrder = ['Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];

                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {dayNamesInOrder.map((day) => {
                          const amount = weekdayTotals[day] || 0;
                          const pct = grandTotal > 0 ? (amount / grandTotal) * 100 : 0;
                          return (
                            <div key={day} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                                <span style={{ fontWeight: 600, color: day === 'Friday' || day === 'Saturday' ? 'var(--accent-gold)' : '#fff' }}>
                                  🇧🇩 {day} {day === 'Friday' ? '(ছুটির দিন)' : ''}
                                </span>
                                <span style={{ color: 'var(--text-secondary)' }}>
                                  <strong style={{ color: '#fff' }}>{fmtVal(amount)}</strong> ({pct.toFixed(0)}%)
                                </span>
                              </div>
                              <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{ width: `${pct}%`, height: '100%', background: day === 'Friday' ? 'linear-gradient(90deg, #f59e0b, #ef4444)' : 'linear-gradient(90deg, #6366f1, #3b82f6)', borderRadius: '4px' }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>

              </div>

              {/* SECTION 8: Scheduled Daily 8:00 PM Email Report Card */}
              <div className={styles.walletCard} style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(15, 23, 42, 0.5) 100%)', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', padding: '3px 8px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '4px', color: '#34d399', fontWeight: 700 }}>
                      🟢 AUTOMATED SCHEDULE ACTIVE
                    </span>
                    <h3 style={{ margin: '8px 0 4px', fontSize: '1.15rem', fontWeight: 800, color: '#fff' }}>
                      ✉️ Daily 8:00 PM BST Executive Digest Dispatch
                    </h3>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      Recipient: <strong style={{ color: '#fff' }}>mdrifayethossen@gmail.com</strong> | Schedule: Everyday at 8:00 PM Bangladesh Time (BST)
                    </p>
                  </div>
                  <button
                    onClick={handleSendTestEmailReport}
                    disabled={sendingEmailReport}
                    style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#34d399', padding: '10px 16px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem' }}
                  >
                    <Send size={15} /> Send Test Email Now
                  </button>
                </div>
              </div>

            </div>
          )}



          {walletSubTab === 'goals_debts' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Header Hero Card */}
              <div className={styles.walletCard} style={{ background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.12) 0%, rgba(15, 23, 42, 0.5) 100%)', border: '1px solid rgba(244, 114, 182, 0.25)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#f472b6', textTransform: 'uppercase', letterSpacing: '1px' }}>Goals & Loan Management Command</span>
                    <h2 style={{ margin: '4px 0 0', fontSize: '1.8rem', fontWeight: 900, color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Target size={24} style={{ color: '#f472b6' }} /> Savings Milestones & Active Loans Audit
                    </h2>
                  </div>
                  <button
                    onClick={() => setIsAddLoanOpen(true)}
                    style={{ background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    + Record New Loan
                  </button>
                </div>
              </div>

              {/* Grid: Savings Goals & Loans */}
              <div className={styles.toolsGrid}>
                
                {/* Active Savings Goals Card */}
                <div className={styles.walletCard}>
                  <h3 style={{ margin: '0 0 16px', fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <PiggyBank size={20} style={{ color: '#f472b6' }} /> Target Savings Goals
                  </h3>

                  {savingsGoals.length === 0 ? (
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>No active savings goals added yet.</div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {savingsGoals.map(g => {
                        const pct = Math.min(100, (g.current / (g.target || 1)) * 100);
                        return (
                          <div key={g.id || g.name} style={{ background: 'rgba(15, 23, 42, 0.4)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '14px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                              <span style={{ color: '#fff' }}>{g.name}</span>
                              <span style={{ color: '#f472b6' }}>{pct.toFixed(0)}% Completed</span>
                            </div>
                            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden', marginBottom: '8px' }}>
                              <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, #ec4899, #8b5cf6)', borderRadius: '4px' }} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                              <span>Saved: <strong style={{ color: '#34d399' }}>{fmtVal(g.current)}</strong></span>
                              <span>Target: <strong>{fmtVal(g.target)}</strong></span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Active Loans & Debt Tracker Card */}
                <div className={styles.walletCard}>
                  <h3 style={{ margin: '0 0 16px', fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <PiggyBank size={20} style={{ color: 'var(--accent-gold)' }} /> Active Loans Audit (ধার/ঋণ)
                  </h3>

                  {(() => {
                    const currentMonthData = activeMonth || months[0];
                    const activeLoans = currentMonthData ? currentMonthData.loans || [] : [];
                    if (activeLoans.length === 0) {
                      return <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>No active loans registered for this period.</div>;
                    }
                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {activeLoans.map((l: IWalletLoan) => (
                          <div key={l._id || l.personName} style={{ background: 'rgba(15, 23, 42, 0.4)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>{l.personName}</div>
                              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                                Due: {l.dueDate ? new Date(l.dueDate).toISOString().split('T')[0] : 'No deadline'} | Status: <span style={{ color: l.status === 'Returned' ? '#34d399' : '#f59e0b', fontWeight: 700 }}>{l.status}</span>
                              </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontSize: '1.05rem', fontWeight: 900, color: 'var(--accent-gold)' }}>{fmtVal(l.amount)}</div>
                              <a
                                href={`https://wa.me/8801952321390?text=${encodeURIComponent(`Hello ${l.personName}, friendly reminder regarding loan balance of ৳${l.amount}.`)}`}
                                target="_blank"
                                rel="noreferrer"
                                style={{ fontSize: '0.7rem', color: '#34d399', textDecoration: 'none', fontWeight: 700 }}
                              >
                                📲 WhatsApp Reminder
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>

              </div>

            </div>
          )}

        </div>
      )}

      {/* ─── MODALS DIALOGS PANELS ─── */}

      {/* Modal 1: Create Month Sheet */}
      {isAddMonthOpen && (
        <div className={styles.walletModalOverlay}>
          <div className={styles.walletModalBox}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>Create Month Sheet</h3>
              <button onClick={() => setIsAddMonthOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            {/* 🔄 Live Rollover Preview Box */}
            {(() => {
              const latestMonth = months.length > 0 ? months[months.length - 1] : null;
              if (!latestMonth) return null;
              const estOpeningSavings = getSavings(latestMonth);
              const estPendingLoans = (latestMonth.loans || []).filter(l => l.status === 'Pending');
              const estPendingLoanTotal = estPendingLoans.reduce((sum, l) => sum + l.amount, 0);

              return (
                <div style={{ marginBottom: '14px', background: 'rgba(129, 140, 248, 0.08)', border: '1px solid rgba(129, 140, 248, 0.25)', borderRadius: '10px', padding: '12px 14px', fontSize: '0.78rem', color: '#e2e8f0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ fontWeight: 800, color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Sparkles size={14} /> Automatic Month Rollover Preview
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>💰 Carried-Over Opening Savings:</span>
                    <strong style={{ color: '#34d399' }}>{fmtVal(estOpeningSavings)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>🤝 Pending Loans to Migrate ({estPendingLoans.length} items):</span>
                    <strong style={{ color: '#fbbf24' }}>{fmtVal(estPendingLoanTotal)}</strong>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', borderTop: '1px dashed rgba(255,255,255,0.08)', paddingTop: '6px' }}>
                    ℹ️ New month income & expenses will start fresh (0), while your savings balance and active pending debts seamlessly carry forward.
                  </div>
                </div>
              );
            })()}

            <form onSubmit={handleAddMonth} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Month Name (e.g. "January 2026")</label>
                <input
                  type="text"
                  required
                  placeholder="January 2026"
                  value={monthName}
                  onChange={e => setMonthName(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: '#07070b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff' }}
                />
              </div>
              <button
                type="submit"
                style={{ background: 'linear-gradient(135deg, #818cf8 0%, #4f46e5 100%)', color: '#fff', border: 'none', padding: '10px 14px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', marginTop: '8px' }}
              >
                Create Month Sheet
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Month Settings & Name */}
      {isEditMonthOpen && activeMonth && (
        <div className={styles.walletModalOverlay}>
          <div className={styles.walletModalBox}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>Edit Month Settings</h3>
              <button onClick={() => setIsEditMonthOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleEditMonth} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Month Name</label>
                <input
                  type="text"
                  required
                  placeholder="January 2026"
                  value={monthName}
                  onChange={e => setMonthName(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: '#07070b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Base Salary (৳)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={salary}
                  onChange={e => setSalary(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: '#07070b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Base Add-on (৳)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={addon}
                  onChange={e => setAddon(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: '#07070b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Base Bonus (৳)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={bonus}
                  onChange={e => setBonus(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: '#07070b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff' }}
                />
              </div>
              <button
                type="submit"
                style={{ background: 'linear-gradient(135deg, #818cf8 0%, #4f46e5 100%)', color: '#fff', border: 'none', padding: '10px 14px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', marginTop: '8px' }}
              >
                Save Settings
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Log Income Item */}
      {isAddIncomeOpen && activeMonth && (
        <div className={styles.walletModalOverlay}>
          <div className={styles.walletModalBox}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>Log Income record</h3>
              <button onClick={() => setIsAddIncomeOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleAddIncome} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Category</label>
                <select
                  value={incCategory}
                  onChange={e => setIncCategory(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: '#07070b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff' }}
                >
                  <option value="Salary">Salary (Primary)</option>
                  <option value="Freelance">Freelance / Add-on</option>
                  <option value="Bonus">Bonus</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              {incCategory === 'Other' && (
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Custom Category Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sponsorship"
                    value={customIncCategory}
                    onChange={e => setCustomIncCategory(e.target.value)}
                    style={{ width: '100%', padding: '10px', background: '#07070b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff' }}
                  />
                </div>
              )}
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Description / Source</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Portfolio project"
                  value={incDesc}
                  onChange={e => setIncDesc(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: '#07070b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Amount (৳)</label>
                <input
                  type="number"
                  required
                  placeholder="0"
                  value={incAmount}
                  onChange={e => setIncAmount(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: '#07070b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Date</label>
                <input
                  type="date"
                  value={incDate}
                  onChange={e => setIncDate(e.target.value)}
                  onClick={(e) => {
                    try {
                      e.currentTarget.showPicker();
                    } catch (err) {}
                  }}
                  style={{ width: '100%', padding: '10px', background: '#07070b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff', cursor: 'pointer' }}
                />
              </div>
              <button
                type="submit"
                style={{ background: 'linear-gradient(135deg, #818cf8 0%, #4f46e5 100%)', color: '#fff', border: 'none', padding: '10px 14px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', marginTop: '8px' }}
              >
                Log Income
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Edit Income Item */}
      {isEditIncomeOpen && activeMonth && (
        <div className={styles.walletModalOverlay}>
          <div className={styles.walletModalBox}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>Edit Income record</h3>
              <button onClick={() => { setIsEditIncomeOpen(false); setEditingIncomeId(''); }} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleEditIncome} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Category</label>
                <select
                  value={incCategory}
                  onChange={e => setIncCategory(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: '#07070b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff' }}
                >
                  <option value="Salary">Salary (Primary)</option>
                  <option value="Freelance">Freelance / Add-on</option>
                  <option value="Bonus">Bonus</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              {incCategory === 'Other' && (
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Custom Category Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sponsorship"
                    value={customIncCategory}
                    onChange={e => setCustomIncCategory(e.target.value)}
                    style={{ width: '100%', padding: '10px', background: '#07070b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff' }}
                  />
                </div>
              )}
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Description / Source</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Portfolio project"
                  value={incDesc}
                  onChange={e => setIncDesc(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: '#07070b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Amount (৳)</label>
                <input
                  type="number"
                  required
                  placeholder="0"
                  value={incAmount}
                  onChange={e => setIncAmount(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: '#07070b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Date</label>
                <input
                  type="date"
                  value={incDate}
                  onChange={e => setIncDate(e.target.value)}
                  onClick={(e) => {
                    try {
                      e.currentTarget.showPicker();
                    } catch (err) {}
                  }}
                  style={{ width: '100%', padding: '10px', background: '#07070b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff', cursor: 'pointer' }}
                />
              </div>
              <button
                type="submit"
                style={{ background: 'linear-gradient(135deg, #818cf8 0%, #4f46e5 100%)', color: '#fff', border: 'none', padding: '10px 14px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', marginTop: '8px' }}
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal 4: Log Expense */}
      {isAddExpenseOpen && activeMonth && (
        <div className={styles.walletModalOverlay}>
          <div className={styles.walletModalBox}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>Log Expense record</h3>
              <button onClick={() => setIsAddExpenseOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleAddExpense} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Category</label>
                <select
                  value={expCategory}
                  onChange={e => setExpCategory(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: '#07070b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff' }}
                >
                  {categoriesList.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              {expCategory === 'Other' && (
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Custom Category Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Gift / Medical"
                    value={customCategory}
                    onChange={e => setCustomCategory(e.target.value)}
                    style={{ width: '100%', padding: '10px', background: '#07070b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff' }}
                  />
                </div>
              )}
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Description / Item</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AWS server cost"
                  value={expDesc}
                  onChange={e => setExpDesc(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: '#07070b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Amount (৳)</label>
                <input
                  type="number"
                  required
                  placeholder="0"
                  value={expAmount}
                  onChange={e => setExpAmount(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: '#07070b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Date</label>
                <input
                  type="date"
                  value={expDate}
                  onChange={e => setExpDate(e.target.value)}
                  onClick={(e) => {
                    try {
                      e.currentTarget.showPicker();
                    } catch (err) {}
                  }}
                  style={{ width: '100%', padding: '10px', background: '#07070b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff', cursor: 'pointer' }}
                />
              </div>
              <button
                type="submit"
                style={{ background: 'linear-gradient(135deg, #818cf8 0%, #4f46e5 100%)', color: '#fff', border: 'none', padding: '10px 14px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', marginTop: '8px' }}
              >
                Log Expense
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal 5: Edit Expense */}
      {isEditExpenseOpen && activeMonth && (
        <div className={styles.walletModalOverlay}>
          <div className={styles.walletModalBox}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>Edit Expense details</h3>
              <button onClick={() => { setIsEditExpenseOpen(false); setEditingExpenseId(''); }} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleEditExpense} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Category</label>
                <select
                  value={expCategory}
                  onChange={e => setExpCategory(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: '#07070b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff' }}
                >
                  {categoriesList.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              {expCategory === 'Other' && (
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Custom Category Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Gift / Medical"
                    value={customCategory}
                    onChange={e => setCustomCategory(e.target.value)}
                    style={{ width: '100%', padding: '10px', background: '#07070b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff' }}
                  />
                </div>
              )}
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Description / Item</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AWS server cost"
                  value={expDesc}
                  onChange={e => setExpDesc(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: '#07070b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Amount (৳)</label>
                <input
                  type="number"
                  required
                  placeholder="0"
                  value={expAmount}
                  onChange={e => setExpAmount(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: '#07070b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Date</label>
                <input
                  type="date"
                  value={expDate}
                  onChange={e => setExpDate(e.target.value)}
                  onClick={(e) => {
                    try {
                      e.currentTarget.showPicker();
                    } catch (err) {}
                  }}
                  style={{ width: '100%', padding: '10px', background: '#07070b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff', cursor: 'pointer' }}
                />
              </div>
              <button
                type="submit"
                style={{ background: 'linear-gradient(135deg, #818cf8 0%, #4f46e5 100%)', color: '#fff', border: 'none', padding: '10px 14px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', marginTop: '8px' }}
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal 6: Log New Loan */}
      {isAddLoanOpen && activeMonth && (
        <div className={styles.walletModalOverlay}>
          <div className={styles.walletModalBox}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <HandCoins size={20} style={{ color: '#fbbf24' }} /> Log Money Lent (ধার দিন)
              </h3>
              <button onClick={() => setIsAddLoanOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleAddLoan} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Person Name (কাকে ধার দিয়েছেন)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahim / Shakil"
                  value={loanPersonName}
                  onChange={e => setLoanPersonName(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: '#07070b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Amount (৳) - Will deduct from main balance</label>
                <input
                  type="number"
                  required
                  placeholder="0"
                  value={loanAmount}
                  onChange={e => setLoanAmount(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: '#07070b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Date Given</label>
                  <input
                    type="date"
                    required
                    value={loanDate}
                    onChange={e => setLoanDate(e.target.value)}
                    onClick={(e) => {
                      try { e.currentTarget.showPicker(); } catch (err) {}
                    }}
                    style={{ width: '100%', padding: '10px', background: '#07070b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff', cursor: 'pointer' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Target Due Date (Optional)</label>
                  <input
                    type="date"
                    value={loanDueDate}
                    onChange={e => setLoanDueDate(e.target.value)}
                    onClick={(e) => {
                      try { e.currentTarget.showPicker(); } catch (err) {}
                    }}
                    style={{ width: '100%', padding: '10px', background: '#07070b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff', cursor: 'pointer' }}
                  />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Initial Status</label>
                <select
                  value={loanStatus}
                  onChange={e => setLoanStatus(e.target.value as 'Pending' | 'Returned')}
                  style={{ width: '100%', padding: '10px', background: '#07070b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff' }}
                >
                  <option value="Pending">⌛ Pending (ধারে দেওয়া হলো)</option>
                  <option value="Returned">✅ Already Returned (ফেরত চলে এসেছে)</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Notes / Reason (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Emergency loan for tuition"
                  value={loanNotes}
                  onChange={e => setLoanNotes(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: '#07070b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff' }}
                />
              </div>
              <button
                type="submit"
                style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: '#fff', border: 'none', padding: '10px 14px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', marginTop: '8px' }}
              >
                Log Loan Record
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal 7: Edit Loan */}
      {isEditLoanOpen && activeMonth && (
        <div className={styles.walletModalOverlay}>
          <div className={styles.walletModalBox}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>Edit Loan Record</h3>
              <button onClick={() => { setIsEditLoanOpen(false); setEditingLoanId(''); }} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleEditLoan} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Person Name</label>
                <input
                  type="text"
                  required
                  value={loanPersonName}
                  onChange={e => setLoanPersonName(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: '#07070b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Amount (৳)</label>
                <input
                  type="number"
                  required
                  value={loanAmount}
                  onChange={e => setLoanAmount(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: '#07070b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Date Given</label>
                  <input
                    type="date"
                    required
                    value={loanDate}
                    onChange={e => setLoanDate(e.target.value)}
                    style={{ width: '100%', padding: '10px', background: '#07070b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Due Date</label>
                  <input
                    type="date"
                    value={loanDueDate}
                    onChange={e => setLoanDueDate(e.target.value)}
                    style={{ width: '100%', padding: '10px', background: '#07070b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff' }}
                  />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Status</label>
                <select
                  value={loanStatus}
                  onChange={e => setLoanStatus(e.target.value as 'Pending' | 'Returned')}
                  style={{ width: '100%', padding: '10px', background: '#07070b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff' }}
                >
                  <option value="Pending">⌛ Pending (ধারে আছে)</option>
                  <option value="Returned">✅ Returned (ফেরত পাওয়া গেছে)</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Notes / Reason</label>
                <input
                  type="text"
                  value={loanNotes}
                  onChange={e => setLoanNotes(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: '#07070b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff' }}
                />
              </div>
              <button
                type="submit"
                style={{ background: 'linear-gradient(135deg, #818cf8 0%, #4f46e5 100%)', color: '#fff', border: 'none', padding: '10px 14px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', marginTop: '8px' }}
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal 8: Edit Category Budgets */}
      {isBudgetModalOpen && (
        <div className={styles.walletModalOverlay}>
          <div className={styles.walletModalBox} style={{ maxWidth: '540px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Target size={20} style={{ color: 'var(--accent-gold)' }} /> Category Monthly Budget Caps
              </h3>
              <button onClick={() => setIsBudgetModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Set monthly spending caps for each expense sector to receive real-time warnings when nearing or exceeding limits.
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', maxHeight: '360px', overflowY: 'auto', paddingRight: '4px' }}>
              {categoriesList.map(cat => (
                <div key={cat}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>{cat} (৳)</label>
                  <input
                    type="number"
                    value={categoryBudgets[cat] ?? 5000}
                    onChange={e => {
                      const val = Number(e.target.value) || 0;
                      setCategoryBudgets(prev => ({ ...prev, [cat]: val }));
                    }}
                    style={{ width: '100%', padding: '8px 10px', background: '#07070b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', color: '#fff', fontSize: '0.85rem' }}
                  />
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                showToast('Category budget targets saved!', 'success');
                setIsBudgetModalOpen(false);
              }}
              style={{ width: '100%', background: 'linear-gradient(135deg, #818cf8 0%, #4f46e5 100%)', color: '#fff', border: 'none', padding: '10px 14px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', marginTop: '16px' }}
            >
              Done & Save Caps
            </button>
          </div>
        </div>
      )}

      {/* Modal 9: Create / Edit Savings Goal Jar */}
      {isGoalModalOpen && (
        <div className={styles.walletModalOverlay}>
          <div className={styles.walletModalBox}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PiggyBank size={20} style={{ color: '#818cf8' }} /> {editingGoalId ? 'Edit Savings Goal Jar' : 'Create New Savings Goal Jar'}
              </h3>
              <button onClick={() => setIsGoalModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleSaveGoal} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Goal Name / Target Item</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. M3 MacBook Pro / Tour Fund"
                  value={goalName}
                  onChange={e => setGoalName(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: '#07070b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Target Goal Amount (৳)</label>
                  <input
                    type="number"
                    required
                    placeholder="250000"
                    value={goalTarget}
                    onChange={e => setGoalTarget(e.target.value)}
                    style={{ width: '100%', padding: '10px', background: '#07070b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Currently Saved (৳)</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={goalCurrent}
                    onChange={e => setGoalCurrent(e.target.value)}
                    style={{ width: '100%', padding: '10px', background: '#07070b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff' }}
                  />
                </div>
              </div>
              <button
                type="submit"
                style={{ background: 'linear-gradient(135deg, #818cf8 0%, #4f46e5 100%)', color: '#fff', border: 'none', padding: '10px 14px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', marginTop: '8px' }}
              >
                {editingGoalId ? 'Save Goal Changes' : 'Create Goal Jar'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal 10: Fixed Overhead Bills Vault */}
      {isVaultModalOpen && (
        <div className={styles.walletModalOverlay}>
          <div className={styles.walletModalBox} style={{ maxWidth: '520px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lock size={20} style={{ color: 'var(--accent-gold)' }} /> Fixed Monthly Overhead Vault
              </h3>
              <button onClick={() => setIsVaultModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '0 0 16px' }}>
              Inspect your recurring overhead bills. Click &quot;Pre-fill Expense Form&quot; to review and log any item manually. (No automatic database insertion)
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              {activeRecurringBills.map((bill, index) => (
                <div key={index} style={{ background: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.85rem' }}>{bill.name}</div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Category: {bill.category}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontWeight: 800, color: '#fca5a5', fontSize: '0.9rem' }}>{fmtVal(bill.amount)}</span>
                    <button
                      onClick={() => {
                        setExpDesc(bill.name);
                        setExpAmount(String(bill.amount));
                        setExpCategory(categoriesList.includes(bill.category) ? bill.category : 'Other');
                        setExpDate(new Date().toISOString().split('T')[0]);
                        setIsVaultModalOpen(false);
                        setIsAddExpenseOpen(true);
                      }}
                      style={{ background: 'rgba(212, 175, 55, 0.15)', border: '1px solid rgba(212, 175, 55, 0.3)', color: '#fef08a', padding: '4px 10px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}
                    >
                      Pre-fill Form
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: 'rgba(7, 8, 15, 0.4)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Total Fixed Overheads: </span>
              <strong style={{ color: '#fca5a5', fontSize: '0.95rem' }}>{fmtVal(activeRecurringBills.reduce((acc, b) => acc + b.amount, 0))}/month</strong>
            </div>
          </div>
        </div>
      )}

      {/* Modal 11: Add / Edit Asset */}
      {isAssetModalOpen && (
        <div className={styles.walletModalOverlay}>
          <div className={styles.walletModalBox}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>
                {editingAssetId ? 'Edit Asset Item' : 'Add New Wealth Asset'}
              </h3>
              <button onClick={() => setIsAssetModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Asset Name</label>
                <input
                  type="text"
                  placeholder="e.g. Workstation M3 Max / Savings Deposit"
                  value={assetName}
                  onChange={e => setAssetName(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: '#07070b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Category</label>
                  <select
                    value={assetCategory}
                    onChange={e => setAssetCategory(e.target.value)}
                    style={{ width: '100%', padding: '10px', background: '#07070b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff' }}
                  >
                    <option value="Bank">Bank Deposit</option>
                    <option value="Cash">Liquid Cash</option>
                    <option value="Gadget">Tech Hardware</option>
                    <option value="Investment">Stocks / Funds</option>
                    <option value="Crypto">Crypto Asset</option>
                    <option value="Other">Other Asset</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Value (৳)</label>
                  <input
                    type="number"
                    placeholder="150000"
                    value={assetValue}
                    onChange={e => setAssetValue(e.target.value)}
                    style={{ width: '100%', padding: '10px', background: '#07070b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Annual Growth / Depreciation Rate (%)</label>
                <input
                  type="number"
                  placeholder="e.g. 5 or -10"
                  value={assetGrowthRate}
                  onChange={e => setAssetGrowthRate(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: '#07070b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff' }}
                />
              </div>

              <button
                onClick={handleAddOrEditAsset}
                style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: '#fff', border: 'none', padding: '10px 14px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', marginTop: '8px' }}
              >
                {editingAssetId ? 'Save Asset Changes' : 'Add Asset to Vault'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 12: Configure Gmail App Password for Live Email Reports */}
      {isSmtpModalOpen && (
        <div className={styles.walletModalOverlay}>
          <div className={styles.walletModalBox} style={{ maxWidth: '500px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Send size={20} style={{ color: '#10b981' }} /> Gmail SMTP App Password Setup
              </h3>
              <button onClick={() => setIsSmtpModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.5 }}>
              To deliver live daily reports directly to Inbox (<strong>mdrifayethossen@gmail.com</strong> & <strong>rifayet.cse@gmail.com</strong>), enter your 16-character Gmail App Password below or add <code style={{ color: 'var(--accent-gold)' }}>GMAIL_APP_PASSWORD</code> in <code style={{ color: 'var(--accent-gold)' }}>.env.local</code>.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Gmail App Password (16 Characters)</label>
                <input
                  type="password"
                  placeholder="xxxx xxxx xxxx xxxx"
                  value={customAppPassword}
                  onChange={e => setCustomAppPassword(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: '#07070b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff', fontSize: '0.95rem' }}
                />
              </div>

              <div style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)', borderRadius: '8px', padding: '12px', fontSize: '0.75rem', color: '#c7d2fe' }}>
                💡 <strong>How to get Gmail App Password:</strong> Google Account ➔ Security ➔ 2-Step Verification ➔ App Passwords ➔ Create App Password for Mail.
              </div>

              <button
                onClick={() => {
                  setIsSmtpModalOpen(false);
                  handleSendTestEmailReport();
                }}
                style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#fff', border: 'none', padding: '10px 14px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', marginTop: '4px' }}
              >
                Save & Trigger Test Email Now
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
