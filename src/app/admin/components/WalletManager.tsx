'use client';

import React, { useState, useEffect } from 'react';
import { 
  Wallet, Plus, Layers, TrendingUp, Edit, Download, Trash2, FileText, X, PieChart,
  HandCoins, CheckCircle2, Clock, Send, Copy, User, Calendar, MessageCircle, AlertCircle, RefreshCw, Check
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
}

export interface IWalletMonthData {
  _id: string;
  monthName: string;
  salary: number;
  addon: number;
  bonus: number;
  expenses: IWalletExpense[];
  incomes?: IWalletIncome[];
  loans?: IWalletLoan[];
  createdAt: string;
}

export default function WalletManager({ showToast }: { showToast: (msg: string, type?: 'success' | 'error' | 'info') => void }) {
  const [months, setMonths] = useState<IWalletMonthData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonthId, setSelectedMonthId] = useState<string>('');
  const [walletSubTab, setWalletSubTab] = useState<'single' | 'consolidated' | 'global_summary'>('single');
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');

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

  // Gross Savings (Total Income minus Total Expenses, before active loan deductions)
  const getGrossSavings = (m: IWalletMonthData) => getIncomeTotal(m) - getExpenseTotal(m);

  // Net Liquid Savings (Total Income minus Total Expenses minus Active Pending Loans)
  // Loan money is deducted from Savings until it is returned!
  const getSavings = (m: IWalletMonthData) => {
    return getIncomeTotal(m) - getExpenseTotal(m) - getActiveLoansTotal(m);
  };

  const getSavingsRate = (m: IWalletMonthData) => {
    const inc = getIncomeTotal(m);
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
  const globalTotalSavings = globalTotalIncome - globalTotalSpent - globalActiveLoans;
  const globalNetBalance = globalTotalSavings;
  const globalSavingsRate = globalTotalIncome > 0 ? (globalTotalSavings / globalTotalIncome) * 100 : 0;

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

  // 📄 On-Demand Direct PDF Download Engine (Bypasses popup-blockers and downloads direct vector PDF files)
  const downloadPDFHelper = (htmlContent: string, filename: string) => {
    const fallbackPrint = (html: string) => {
      showToast('Opening print preview to save PDF...', 'info');
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>${filename}</title>
              <style>
                body { font-family: system-ui, -apple-system, sans-serif; padding: 20px; color: #1e293b; }
                @page { size: A4; margin: 12mm; }
              </style>
            </head>
            <body>
              ${html}
              <script>
                window.onload = function() {
                  window.print();
                };
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      } else {
        showToast('Please allow popups to save or print PDF', 'error');
      }
    };

    const runDownload = () => {
      const opt = {
        margin:       10,
        filename:     filename,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, logging: false },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      
      const element = document.createElement('div');
      element.innerHTML = htmlContent;
      element.style.position = 'absolute';
      element.style.left = '-9999px';
      element.style.top = '-9999px';
      document.body.appendChild(element);
      
      if ((window as any).html2pdf) {
        (window as any).html2pdf().from(element).set(opt).save().then(() => {
          if (document.body.contains(element)) document.body.removeChild(element);
          showToast('PDF downloaded successfully!', 'success');
        }).catch((err: any) => {
          console.error('html2pdf error:', err);
          if (document.body.contains(element)) document.body.removeChild(element);
          fallbackPrint(htmlContent);
        });
      } else {
        if (document.body.contains(element)) document.body.removeChild(element);
        fallbackPrint(htmlContent);
      }
    };

    if ((window as any).html2pdf) {
      runDownload();
    } else {
      showToast('Initializing secure PDF engine...', 'info');
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
      script.onload = () => {
        runDownload();
      };
      script.onerror = () => {
        fallbackPrint(htmlContent);
      };
      document.body.appendChild(script);
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

  // Get active month's category percentages
  const activeMonthCategoryTotals = categoriesList.reduce((acc, cat) => {
    const total = (activeMonth?.expenses || [])
      .filter(e => e.category === cat)
      .reduce((sum, e) => sum + e.amount, 0);
    acc[cat] = total;
    return acc;
  }, {} as { [key: string]: number });

  // Filter Ledger client-side (instantaneous loading search)
  const filteredExpenses = (activeMonth?.expenses || []).filter(e => {
    const matchesSearch = e.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategoryFilter === 'All' || e.category === selectedCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  const activeHealthScore = activeMonth ? getHealthScore(activeMonth) : 0;
  const activeHealthInfo = getHealthGrade(activeHealthScore);
  const activeMonthSavings = activeMonth ? getSavings(activeMonth) : 0;

  return (
    <div style={{ fontFamily: 'var(--font-sans)', color: '#ffffff', padding: '10px' }}>
      
      {/* HEADER SECTION */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Wallet size={28} style={{ color: 'var(--accent-gold)' }} /> Personal Wallet Ledger
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '4px 0 0' }}>
            Monitor side gig revenues, base salaries, bonuses, and detail monthly expenses.
          </p>
        </div>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Sub-navigation Tabs */}
          <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--glass-border-light)', paddingBottom: '12px', marginBottom: '18px' }}>
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
          </div>

          {walletSubTab === 'single' && (
            <div className={styles.grid260_1fr}>
              
              {/* Months Selector Sidebar */}
              <div style={{ background: 'rgba(15, 23, 42, 0.3)', border: '1px solid var(--glass-border-light)', borderRadius: '16px', padding: '16px' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '14px', paddingLeft: '8px' }}>Months Sheets</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
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
                <div style={{ background: 'rgba(15, 23, 42, 0.3)', border: '1px solid var(--glass-border-light)', borderRadius: '16px', padding: '24px' }}>
                  
                  {/* Upper toolbar actions */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '16px', marginBottom: '20px' }}>
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
                    <div style={{ display: 'flex', gap: '8px' }}>
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

                  {/* PREMIUM HUD: Score Ring, Forecast, recommendations alerts */}
                  <div className={styles.grid150_1fr_1fr} style={{ marginBottom: '24px', background: 'rgba(7, 8, 15, 0.3)', border: '1px solid rgba(255,255,255,0.02)', borderRadius: '14px', padding: '16px' }}>
                    
                    {/* Gauge 1: Health Score Circular Gauge */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
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
                    <div style={{ borderRight: '1px solid rgba(255,255,255,0.05)', paddingRight: '12px' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>Future Net Worth Forecasts</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>6-Month Proj:</span>
                          <span style={{ fontWeight: 700, color: '#4caf50' }}>৳{(activeMonthSavings * 6).toLocaleString()}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>12-Month Proj:</span>
                          <span style={{ fontWeight: 700, color: '#2196f3' }}>৳{(activeMonthSavings * 12).toLocaleString()}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>5-Year Proj:</span>
                          <span style={{ fontWeight: 700, color: 'var(--accent-gold)' }}>৳{(activeMonthSavings * 60).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Smart Automated Advice Alerts */}
                    <div>
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

                  {/* Sub-sheet metrics summary cards */}
                  <div className={styles.grid4} style={{ marginBottom: '24px' }}>
                    <div style={{ background: 'rgba(7, 8, 15, 0.25)', border: '1px solid rgba(255, 255, 255, 0.03)', borderRadius: '12px', padding: '16px' }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>Total Earned</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#4caf50', marginTop: '4px' }}>৳{getIncomeTotal(activeMonth).toLocaleString()}</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        Salary: ৳{getSalaryTotal(activeMonth).toLocaleString()} • Side: ৳{getAddonTotal(activeMonth).toLocaleString()}
                      </div>
                    </div>
                    <div style={{ background: 'rgba(7, 8, 15, 0.25)', border: '1px solid rgba(255, 255, 255, 0.03)', borderRadius: '12px', padding: '16px' }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>Total Spent</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f44336', marginTop: '4px' }}>৳{getExpenseTotal(activeMonth).toLocaleString()}</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        Across {(activeMonth.expenses || []).length} ledger items logged
                      </div>
                    </div>
                    <div style={{ background: 'rgba(7, 8, 15, 0.25)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '12px', padding: '16px' }}>
                      <div style={{ fontSize: '0.72rem', color: '#fbbf24', textTransform: 'uppercase', fontWeight: 700 }}>Active Money Lent (ধারে দেওয়া)</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fbbf24', marginTop: '4px' }}>৳{getActiveLoansTotal(activeMonth).toLocaleString()}</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        Deducted from Savings • Recovered: ৳{getReturnedLoansTotal(activeMonth).toLocaleString()}
                      </div>
                    </div>
                    <div style={{ background: 'rgba(7, 8, 15, 0.25)', border: '1px solid rgba(129, 140, 248, 0.2)', borderRadius: '12px', padding: '16px' }}>
                      <div style={{ fontSize: '0.72rem', color: '#818cf8', textTransform: 'uppercase', fontWeight: 700 }}>Net Liquid Savings & Balance</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#818cf8', marginTop: '4px' }}>৳{getSavings(activeMonth).toLocaleString()}</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        Gross: ৳{getGrossSavings(activeMonth).toLocaleString()} • Rate: {getSavingsRate(activeMonth).toFixed(1)}%
                      </div>
                    </div>
                  </div>

                  {/* 2-Column Ledger Tables Grid */}
                  <div className={styles.grid2}>
                    
                    {/* Left Column: Incomes Ledger */}
                    <div style={{ background: 'rgba(7, 8, 15, 0.15)', border: '1px solid rgba(255, 255, 255, 0.03)', borderRadius: '12px', padding: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <TrendingUp size={16} style={{ color: '#4caf50' }} /> Incomes Ledger
                        </h3>
                        <button
                          onClick={() => setIsAddIncomeOpen(true)}
                          style={{ background: 'rgba(76, 175, 80, 0.1)', border: '1px solid rgba(76, 175, 80, 0.2)', color: '#4caf50', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}
                        >
                          <Plus size={12} /> Log Income
                        </button>
                      </div>

                      {(!activeMonth.incomes || activeMonth.incomes.length === 0) ? (
                        <div style={{ textAlign: 'center', padding: '24px 10px', color: 'var(--text-secondary)', background: 'rgba(7, 8, 15, 0.1)', border: '1px dashed rgba(255,255,255,0.03)', borderRadius: '8px', fontSize: '0.8rem' }}>
                          No individual incomes logged. (Primary Base Salary: ৳{activeMonth.salary.toLocaleString()})
                        </div>
                      ) : (
                        <div style={{ overflowX: 'auto', background: 'rgba(7, 8, 15, 0.1)', border: '1px solid rgba(255, 255, 255, 0.02)', borderRadius: '8px' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
                            <thead>
                              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', color: 'var(--text-secondary)' }}>
                                <th style={{ padding: '8px' }}>Category</th>
                                <th style={{ padding: '8px' }}>Description</th>
                                <th style={{ padding: '8px', textAlign: 'right' }}>Amount</th>
                                <th style={{ padding: '8px', textAlign: 'right' }}>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {activeMonth.incomes.map((inc) => (
                                <tr key={inc._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                                  <td style={{ padding: '8px' }}>
                                    <span style={{ display: 'inline-flex', padding: '2px 6px', borderRadius: '4px', fontSize: '0.68rem', fontWeight: 700, background: 'rgba(76, 175, 80, 0.15)', color: '#4caf50' }}>
                                      {inc.category}
                                    </span>
                                  </td>
                                  <td style={{ padding: '8px', color: '#fff' }}>{inc.description}</td>
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
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <PieChart size={16} style={{ color: '#ff6b6b' }} /> Expenses Ledger
                        </h3>
                        <button
                          onClick={() => setIsAddExpenseOpen(true)}
                          style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ff6b6b', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}
                        >
                          <Plus size={12} /> Log Expense
                        </button>
                      </div>

                      {/* Filter & Instant Search Input */}
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                        <input
                          type="text"
                          placeholder="Search..."
                          value={searchQuery}
                          onChange={e => setSearchQuery(e.target.value)}
                          style={{
                            flex: 1,
                            padding: '6px 10px',
                            background: 'rgba(7,8,15,0.4)',
                            border: '1px solid rgba(255,255,255,0.06)',
                            borderRadius: '6px',
                            color: '#fff',
                            fontSize: '0.75rem'
                          }}
                        />
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
                      </div>

                      {/* Expenses Table */}
                      {filteredExpenses.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '24px 10px', color: 'var(--text-secondary)', background: 'rgba(7, 8, 15, 0.1)', border: '1px dashed rgba(255,255,255,0.03)', borderRadius: '8px', fontSize: '0.8rem' }}>
                          No expenses matching criteria.
                        </div>
                      ) : (
                        <div style={{ overflowX: 'auto', background: 'rgba(7, 8, 15, 0.1)', border: '1px solid rgba(255, 255, 255, 0.02)', borderRadius: '8px' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
                            <thead>
                              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', color: 'var(--text-secondary)' }}>
                                <th style={{ padding: '8px' }}>Category</th>
                                <th style={{ padding: '8px' }}>Description</th>
                                <th style={{ padding: '8px', textAlign: 'right' }}>Amount</th>
                                <th style={{ padding: '8px', textAlign: 'right' }}>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredExpenses.map((exp) => (
                                <tr key={exp._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                                  <td style={{ padding: '8px' }}>
                                    <span style={{ display: 'inline-flex', padding: '2px 6px', borderRadius: '4px', fontSize: '0.68rem', fontWeight: 700, background: `${categoryColors[exp.category] || '#607d8b'}20`, color: categoryColors[exp.category] || '#607d8b' }}>
                                      {exp.category}
                                    </span>
                                  </td>
                                  <td style={{ padding: '8px', color: '#fff' }}>{exp.description}</td>
                                  <td style={{ padding: '8px', textAlign: 'right', fontWeight: 700, color: '#ff6b6b' }}>৳{exp.amount.toLocaleString()}</td>
                                  <td style={{ padding: '8px', textAlign: 'right' }}>
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
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>

                  </div>

                  {/* Money Lent Ledger (ধারের হিসাব & পাওনা) */}
                  <div style={{ background: 'rgba(7, 8, 15, 0.25)', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: '16px', padding: '20px', marginTop: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                      <div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: '#fff' }}>
                          <HandCoins size={20} style={{ color: '#fbbf24' }} /> Money Lent Ledger (ধারের হিসাব & পাওনা)
                        </h3>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
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
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', marginBottom: '6px' }}>
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
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {(['All', 'Pending', 'Returned'] as const).map((st) => (
                          <button
                            key={st}
                            onClick={() => setLoanFilterStatus(st)}
                            style={{
                              background: loanFilterStatus === st ? 'rgba(245, 158, 11, 0.2)' : 'rgba(15, 23, 42, 0.4)',
                              border: '1px solid',
                              borderColor: loanFilterStatus === st ? '#f59e0b' : 'rgba(255,255,255,0.06)',
                              color: loanFilterStatus === st ? '#fbbf24' : 'var(--text-secondary)',
                              padding: '4px 12px',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                          >
                            {st === 'All' ? 'All Records' : st === 'Pending' ? '⌛ Pending (ধারে আছে)' : '✅ Returned (ফেরত পাওয়া)'}
                          </button>
                        ))}
                      </div>

                      <input
                        type="text"
                        placeholder="Search by person or note..."
                        value={loanSearchQuery}
                        onChange={(e) => setLoanSearchQuery(e.target.value)}
                        style={{
                          background: '#07070b',
                          border: '1px solid rgba(255,255,255,0.08)',
                          borderRadius: '6px',
                          padding: '6px 12px',
                          fontSize: '0.78rem',
                          color: '#fff',
                          width: '220px'
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
                      <div style={{ overflowX: 'auto', background: 'rgba(7, 8, 15, 0.2)', border: '1px solid rgba(255, 255, 255, 0.03)', borderRadius: '10px' }}>
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
                                          <div style={{ fontWeight: 700, color: '#fff' }}>{loan.personName}</div>
                                          {loan.notes && <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{loan.notes}</div>}
                                        </div>
                                      </div>
                                    </td>

                                    <td style={{ padding: '12px', fontWeight: 800, fontSize: '0.95rem', color: isPending ? '#fbbf24' : '#10b981' }}>
                                      ৳{loan.amount.toLocaleString()}
                                    </td>

                                    <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>
                                      {new Date(loan.date).toLocaleDateString()}
                                    </td>

                                    <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>
                                      {loan.dueDate ? new Date(loan.dueDate).toLocaleDateString() : 'N/A'}
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
            <div style={{ background: 'rgba(15, 23, 42, 0.3)', border: '1px solid var(--glass-border-light)', borderRadius: '16px', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>Consolidated Financial Report</h2>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Aggregated historical ledger overview</span>
                </div>
                <button
                  onClick={printGlobalPDF}
                  style={{
                    background: 'linear-gradient(135deg, #818cf8 0%, #4f46e5 100%)',
                    color: '#fff',
                    border: 'none',
                    padding: '10px 20px',
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

              <div style={{ overflowX: 'auto', background: 'rgba(7, 8, 15, 0.15)', border: '1px solid rgba(255, 255, 255, 0.03)', borderRadius: '10px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
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
                    {months.map(m => {
                      const totalInc = getIncomeTotal(m);
                      const totalExp = getExpenseTotal(m);
                      const netSav = getSavings(m);
                      const rate = getSavingsRate(m).toFixed(0);
                      const health = getHealthScore(m);
                      const hInfo = getHealthGrade(health);
                      return (
                        <tr key={m._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                          <td style={{ padding: '12px 16px', fontWeight: 700, color: '#fff' }}>{m.monthName}</td>
                          <td style={{ padding: '12px 16px', textAlign: 'right' }}>৳{getSalaryTotal(m).toLocaleString()}</td>
                          <td style={{ padding: '12px 16px', textAlign: 'right' }}>৳{getAddonTotal(m).toLocaleString()}</td>
                          <td style={{ padding: '12px 16px', textAlign: 'right' }}>৳{getBonusTotal(m).toLocaleString()}</td>
                          <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#4caf50' }}>৳{totalInc.toLocaleString()}</td>
                          <td style={{ padding: '12px 16px', textAlign: 'right', color: '#f44336' }}>৳{totalExp.toLocaleString()}</td>
                          <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#2196f3' }}>৳{netSav.toLocaleString()}</td>
                          <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700, color: 'var(--accent-gold)' }}>{totalInc > 0 ? rate : '0'}%</td>
                          <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                            <span style={{ display: 'inline-block', padding: '2px 6px', borderRadius: '4px', background: `${hInfo.color}15`, color: hInfo.color, border: `1px solid ${hInfo.color}35`, fontSize: '0.75rem', fontWeight: 700 }}>
                              {health} ({hInfo.grade})
                            </span>
                          </td>
                          <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                              <button
                                onClick={() => printMonthPDF(m)}
                                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                                title="Download PDF Statement"
                              >
                                <Download size={12} /> PDF
                              </button>
                              <button
                                onClick={() => exportMonthToCSV(m)}
                                style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#10b981', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                                title="Export CSV"
                              >
                                <FileText size={12} /> CSV
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
          )}

          {walletSubTab === 'global_summary' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* ─── GLOBAL VISUAL REPRESENTATION PANEL ─── */}
              <div style={{ background: 'rgba(15, 23, 42, 0.3)', border: '1px solid var(--glass-border-light)', borderRadius: '16px', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
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
                
                {/* Global Stats Grid */}
                <div className={styles.grid4} style={{ marginBottom: '24px' }}>
                  <div style={{ background: 'rgba(7, 8, 15, 0.4)', border: '1px solid rgba(255, 255, 255, 0.03)', borderRadius: '12px', padding: '16px' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Total Revenues</span>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#4caf50', marginTop: '6px' }}>৳{globalTotalIncome.toLocaleString()}</div>
                  </div>
                  <div style={{ background: 'rgba(7, 8, 15, 0.4)', border: '1px solid rgba(255, 255, 255, 0.03)', borderRadius: '12px', padding: '16px' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Total Spent</span>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f44336', marginTop: '6px' }}>৳{globalTotalSpent.toLocaleString()}</div>
                  </div>
                  <div style={{ background: 'rgba(7, 8, 15, 0.4)', border: '1px solid rgba(255, 255, 255, 0.03)', borderRadius: '12px', padding: '16px' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Net Savings</span>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#2196f3', marginTop: '6px' }}>৳{globalTotalSavings.toLocaleString()}</div>
                  </div>
                  <div style={{ background: 'rgba(7, 8, 15, 0.4)', border: '1px solid rgba(255, 255, 255, 0.03)', borderRadius: '12px', padding: '16px' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Savings Rate</span>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-gold)', marginTop: '6px' }}>{globalSavingsRate.toFixed(1)}%</div>
                  </div>
                </div>

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

              </div>
            </div>
          )}

        </div>
      )}

      {/* ─── MODALS DIALOGS PANELS ─── */}

      {/* Modal 1: Create Month Sheet */}
      {isAddMonthOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#0e1017', border: '1px solid var(--glass-border)', width: '90%', maxWidth: '400px', borderRadius: '16px', padding: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.8)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>Create Month Sheet</h3>
              <button onClick={() => setIsAddMonthOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><X size={20} /></button>
            </div>
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
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#0e1017', border: '1px solid var(--glass-border)', width: '90%', maxWidth: '400px', borderRadius: '16px', padding: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.8)' }}>
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
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#0e1017', border: '1px solid var(--glass-border)', width: '90%', maxWidth: '400px', borderRadius: '16px', padding: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.8)' }}>
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
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#0e1017', border: '1px solid var(--glass-border)', width: '90%', maxWidth: '400px', borderRadius: '16px', padding: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.8)' }}>
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
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#0e1017', border: '1px solid var(--glass-border)', width: '90%', maxWidth: '400px', borderRadius: '16px', padding: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.8)' }}>
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
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#0e1017', border: '1px solid var(--glass-border)', width: '90%', maxWidth: '400px', borderRadius: '16px', padding: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.8)' }}>
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
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#0e1017', border: '1px solid var(--glass-border)', width: '90%', maxWidth: '420px', borderRadius: '16px', padding: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.8)' }}>
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
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#0e1017', border: '1px solid var(--glass-border)', width: '90%', maxWidth: '420px', borderRadius: '16px', padding: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.8)' }}>
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

    </div>
  );
}
