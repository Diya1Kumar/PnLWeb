import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { supabase } from '../supabase/supabaseClient'; // Import Supabase client
import { Transaction } from '../types'; // Import Transaction interface

interface TransactionFormProps {
  onAddTransaction: (transaction: Transaction) => void;
}

export default function TransactionForm({ onAddTransaction }: TransactionFormProps) {
  const [formData, setFormData] = useState({
    type: 'revenue',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    quantity: '1' // Default to 1
  });

  const [userId, setUserId] = useState<string | null>(null);

  // Fetch authenticated user ID
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error);
        return;
      }
      setUserId(data?.user?.id || null);
    };

    fetchUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      alert("User not logged in. Please log in first.");
      return;
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      alert("Please enter a valid amount greater than 0");
      return;
    }

    if (!formData.quantity || parseInt(formData.quantity, 10) <= 0) {
      alert("Please enter a valid quantity greater than 0");
      return;
    }

    // Insert transaction into Supabase with user_id
    const { data, error } = await supabase
      .from('transactions')
      .insert([
        {
          user_id: userId, // ✅ Include user ID
          type: formData.type,
          amount: parseFloat(formData.amount),
          category: formData.category,
          date: formData.date,
          quantity: parseInt(formData.quantity, 10) // Convert string to number
        }
      ])
      .select();

    if (error) {
      console.error("Error inserting transaction:", error);
      alert("Error saving transaction. Try again.");
      return;
    }

    if (data?.length) {
      onAddTransaction({
        id: data[0].id,
        user_id: userId,
        type: formData.type as 'revenue' | 'expense', // Explicitly cast type
        amount: parseFloat(formData.amount),
        category: formData.category,
        date: formData.date,
        quantity: parseInt(formData.quantity, 10),
      });
    }
    
    // Reset form after submission
    setFormData({
      type: 'revenue',
      amount: '',
      category: '',
      date: new Date().toISOString().split('T')[0],
      quantity: '1'
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as 'revenue' | 'expense' })}
            className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white"
          >
            <option value="revenue">Revenue</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Amount</label>
          <input
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white"
            placeholder="Enter amount"
            min="0.01"
            step="0.01"
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
          <input
            type="text"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white"
            placeholder="Enter category"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white"
            required
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Quantity</label>
        <input
          type="number"
          value={formData.quantity}
          onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
          className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white"
          placeholder="Enter quantity"
          min="1"
          step="1"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 
                 hover:bg-blue-600 text-white rounded-lg transition-all duration-300
                 shadow-lg hover:shadow-blue-500/50"
      >
        <Plus className="h-5 w-5" />
        Add Transaction
      </button>
    </form>
  );
}
