export type Currency = 'INR' | 'USD' | 'EUR' | 'GBP';

export interface Transaction {
  id: string;
  user_id?: string; // Optional if not needed in frontend
  type: 'revenue' | 'expense';
  category: string;
  amount: number;
  date: string;
  quantity: number;
}

export interface MonthlyData {
  month: string;
  revenue: number;
  expenses: number;
  netProfit: number;
  profitMargin: number;
}