import { useState, useEffect } from 'react';
import { BarChart3, DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight, PieChart, Calendar, TrendingDown, Trash2 } from 'lucide-react';
import { PieChart as RechartsChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import TransactionForm from '../components/TransactionForm';
import CurrencySelector from '../components/CurrencySelector';
import { Transaction, Currency, MonthlyData } from '../types';
import currency from 'currency.js';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const COLORS = ['#0088FE', '#FF8042', '#00C49F', '#FFBB28'];

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('transactions');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('INR');
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toISOString().substring(0, 7)
  );

  const exchangeRates = {
    INR: 1,
    USD: 0.012,
    EUR: 0.011,
    GBP: 0.0095
  };

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  const formatCurrency = (amount: number) => {
    const rate = exchangeRates[selectedCurrency];
    const converted = amount * rate;
    return currency(converted, { symbol: selectedCurrency + ' ' }).format();
  };

  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    return `${months[parseInt(month) - 1]} ${year}`;
  };

  const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const calculateYearlyData = () => {
    const currentYear = new Date().getFullYear().toString();
    const yearlyTransactions = transactions.filter(t => t.date.startsWith(currentYear));
    
    const revenueByCategory = new Map<string, number>();
    const expensesByCategory = new Map<string, number>();
    
    yearlyTransactions.forEach(transaction => {
      const map = transaction.type === 'revenue' ? revenueByCategory : expensesByCategory;
      const current = map.get(transaction.category) || 0;
      map.set(transaction.category, current + transaction.amount);
    });

    const revenueData = Array.from(revenueByCategory.entries()).map(([name, value]) => ({
      name,
      value,
      type: 'Revenue'
    }));

    const expenseData = Array.from(expensesByCategory.entries()).map(([name, value]) => ({
      name,
      value,
      type: 'Expense'
    }));

    return { revenueData, expenseData };
  };

  useEffect(() => {
    const calculateMonthlyData = () => {
      const monthlyMap = new Map<string, MonthlyData>();
      
      monthlyMap.set(selectedMonth, {
        month: selectedMonth,
        revenue: 0,
        expenses: 0,
        netProfit: 0,
        profitMargin: 0
      });
      
      transactions.forEach(transaction => {
        const month = transaction.date.substring(0, 7);
        const current = monthlyMap.get(month) || {
          month,
          revenue: 0,
          expenses: 0,
          netProfit: 0,
          profitMargin: 0
        };

        if (transaction.type === 'revenue') {
          current.revenue += transaction.amount;
        } else {
          current.expenses += transaction.amount;
        }

        current.netProfit = current.revenue - current.expenses;
        current.profitMargin = current.revenue ? (current.netProfit / current.revenue) * 100 : 0;

        monthlyMap.set(month, current);
      });

      return Array.from(monthlyMap.values())
        .sort((a, b) => a.month.localeCompare(b.month));
    };

    setMonthlyData(calculateMonthlyData());
  }, [transactions, selectedMonth]);

  const currentMonthData = monthlyData.find(data => data.month === selectedMonth) || {
    month: selectedMonth,
    revenue: 0,
    expenses: 0,
    netProfit: 0,
    profitMargin: 0
  };

  const previousMonthData = monthlyData.find(data => {
    const [year, month] = selectedMonth.split('-');
    const previousMonth = new Date(parseInt(year), parseInt(month) - 2);
    return data.month === previousMonth.toISOString().substring(0, 7);
  }) || {
    revenue: 0,
    expenses: 0,
    netProfit: 0,
    profitMargin: 0
  };

  const stats = [
    {
      title: "Revenue",
      value: formatCurrency(currentMonthData.revenue),
      change: `${calculateGrowth(currentMonthData.revenue, previousMonthData.revenue).toFixed(1)}%`,
      isPositive: currentMonthData.revenue >= previousMonthData.revenue,
      icon: DollarSign
    },
    {
      title: "Expenses",
      value: formatCurrency(currentMonthData.expenses),
      change: `${calculateGrowth(currentMonthData.expenses, previousMonthData.expenses).toFixed(1)}%`,
      isPositive: currentMonthData.expenses <= previousMonthData.expenses,
      icon: TrendingUp
    },
    {
      title: "Net Profit",
      value: formatCurrency(currentMonthData.netProfit),
      change: `${calculateGrowth(currentMonthData.netProfit, previousMonthData.netProfit).toFixed(1)}%`,
      isPositive: currentMonthData.netProfit >= previousMonthData.netProfit,
      icon: BarChart3
    },
    {
      title: "Profit Margin",
      value: `${currentMonthData.profitMargin.toFixed(1)}%`,
      change: `${(currentMonthData.profitMargin - previousMonthData.profitMargin).toFixed(1)}%`,
      isPositive: currentMonthData.profitMargin >= previousMonthData.profitMargin,
      icon: PieChart
    }
  ];

  const handleAddTransaction = (transaction: Transaction) => {
    setTransactions(prev => [...prev, transaction]);
  };

  const handleDeleteTransaction = (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      setTransactions(prev => prev.filter(t => t.id !== id));
    }
  };

  const { revenueData, expenseData } = calculateYearlyData();

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <p className="text-white font-medium">{data.name}</p>
          <p className="text-gray-300">{data.type}</p>
          <p className={`font-bold ${data.type === 'Revenue' ? 'text-green-400' : 'text-red-400'}`}>
            {formatCurrency(data.value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Financial Dashboard</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white"
            >
              {monthlyData.length > 0 ? (
                monthlyData.map((data) => (
                  <option key={data.month} value={data.month}>
                    {formatMonth(data.month)}
                  </option>
                ))
              ) : (
                <option value={selectedMonth}>{formatMonth(selectedMonth)}</option>
              )}
            </select>
          </div>
          <CurrencySelector
            selectedCurrency={selectedCurrency}
            onCurrencyChange={setSelectedCurrency}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="p-6 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50
                      transform hover:scale-105 transition-all duration-300 hover:shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400">{stat.title}</span>
              <stat.icon className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-white mb-2">{stat.value}</div>
            <div className={`flex items-center ${stat.isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {stat.isPositive ? (
                <ArrowUpRight className="w-4 h-4 mr-1" />
              ) : (
                <ArrowDownRight className="w-4 h-4 mr-1" />
              )}
              <span>{stat.change} from last month</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 p-6 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Yearly Overview</h2>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div className="h-[300px]">
              <h3 className="text-center text-white mb-4">Revenue by Category</h3>
              <ResponsiveContainer width="100%" height="100%">
                <RechartsChart>
                  <Pie
                    data={revenueData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={(entry) => entry.name}
                  >
                    {revenueData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </RechartsChart>
              </ResponsiveContainer>
            </div>
            <div className="h-[300px]">
              <h3 className="text-center text-white mb-4">Expenses by Category</h3>
              <ResponsiveContainer width="100%" height="100%">
                <RechartsChart>
                  <Pie
                    data={expenseData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={(entry) => entry.name}
                  >
                    {expenseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </RechartsChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50">
          <h2 className="text-xl font-semibold text-white mb-4">Monthly Summary</h2>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-gray-700/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300">Total Revenue</span>
                <span className="text-green-400">{formatCurrency(currentMonthData.revenue)}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300">Total Expenses</span>
                <span className="text-red-400">{formatCurrency(currentMonthData.expenses)}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300">Net Profit</span>
                <span className={currentMonthData.netProfit >= 0 ? 'text-green-400' : 'text-red-400'}>
                  {formatCurrency(currentMonthData.netProfit)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Profit Margin</span>
                <span className={currentMonthData.profitMargin >= 0 ? 'text-green-400' : 'text-red-400'}>
                  {currentMonthData.profitMargin.toFixed(1)}%
                </span>
              </div>
            </div>
            
            <div className="p-4 rounded-lg bg-gray-700/30">
              <h3 className="text-white font-medium mb-3">Month-over-Month Change</h3>
              {stats.map((stat, index) => (
                <div key={index} className="flex items-center justify-between mb-2 last:mb-0">
                  <span className="text-gray-300">{stat.title}</span>
                  <div className={`flex items-center ${stat.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                    {stat.isPositive ? (
                      <TrendingUp className="w-4 h-4 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 mr-1" />
                    )}
                    {stat.change}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-6 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50">
          <h2 className="text-xl font-semibold text-white mb-4">Add Transaction</h2>
          <TransactionForm onAddTransaction={handleAddTransaction} />
        </div>

        <div className="p-6 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50">
          <h2 className="text-xl font-semibold text-white mb-4">Recent Transactions</h2>
          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {transactions
              .filter(t => t.date.startsWith(selectedMonth))
              .sort((a, b) => b.date.localeCompare(a.date))
              .map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-gray-700/30 group hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex-grow">
        
                    <div className="text-gray-400 text-sm">
                      {transaction.category} • {transaction.date}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={`text-lg font-semibold ${
                      transaction.type === 'revenue' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {transaction.type === 'revenue' ? '+' : '-'} {formatCurrency(transaction.amount)}
                    </div>
                    <button
                      onClick={() => handleDeleteTransaction(transaction.id)}
                      className="text-gray-400 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                      title="Delete transaction"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            {transactions.filter(t => t.date.startsWith(selectedMonth)).length === 0 && (
              <div className="text-center text-gray-400 py-4">
                No transactions found for this month
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}