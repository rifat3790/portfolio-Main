import { IWalletMonthData, IWalletExpense, IWalletIncome, IWalletAsset } from '../types/wallet';

// Configuration: API base URL (Production Vercel URL or local dev tunnel)
export const API_BASE_URL = 'https://rifat3790.vercel.app/api/admin/wallet';

export const fetchWalletMonths = async (): Promise<IWalletMonthData[]> => {
  try {
    const res = await fetch(API_BASE_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch wallet data');
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error('Error fetching wallet months:', err);
    return [];
  }
};

export const addExpenseItem = async (monthId: string, expense: Partial<IWalletExpense>): Promise<boolean> => {
  try {
    const res = await fetch(`${API_BASE_URL}/${monthId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'addExpense', data: expense })
    });
    return res.ok;
  } catch (err) {
    console.error('Error adding expense:', err);
    return false;
  }
};

export const addIncomeItem = async (monthId: string, income: Partial<IWalletIncome>): Promise<boolean> => {
  try {
    const res = await fetch(`${API_BASE_URL}/${monthId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'addIncome', data: income })
    });
    return res.ok;
  } catch (err) {
    console.error('Error adding income:', err);
    return false;
  }
};

export const addAssetItem = async (monthId: string, asset: Partial<IWalletAsset>): Promise<boolean> => {
  try {
    const res = await fetch(`${API_BASE_URL}/${monthId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'addAsset', data: asset })
    });
    return res.ok;
  } catch (err) {
    console.error('Error adding asset:', err);
    return false;
  }
};
