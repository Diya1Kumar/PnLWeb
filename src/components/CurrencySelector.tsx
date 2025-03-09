import React from 'react';
import { Currency } from '../types';

interface CurrencySelectorProps {
  selectedCurrency: Currency;
  onCurrencyChange: (currency: Currency) => void;
}

export default function CurrencySelector({ selectedCurrency, onCurrencyChange }: CurrencySelectorProps) {
  const currencies: Currency[] = ['INR', 'USD', 'EUR', 'GBP'];

  return (
    <select
      value={selectedCurrency}
      onChange={(e) => onCurrencyChange(e.target.value as Currency)}
      className="bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white"
    >
      {currencies.map((currency) => (
        <option key={currency} value={currency}>
          {currency}
        </option>
      ))}
    </select>
  );
}