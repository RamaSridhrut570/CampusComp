
import React, { useState, useMemo } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';
import { Expense, ExpenseCategory } from '../../types';
import ExpensePieChart from './ExpensePieChart';

const BudgetManager: React.FC = () => {
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('expenses', []);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>(ExpenseCategory.Food);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount) return;

    const newExpense: Expense = {
      id: crypto.randomUUID(),
      title,
      amount: parseFloat(amount),
      category,
      date: new Date().toISOString().split('T')[0],
    };

    setExpenses([...expenses, newExpense]);
    setTitle('');
    setAmount('');
  };

  const removeExpense = (id: string) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };
  
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyExpenses = useMemo(() => {
    return expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
    });
  }, [expenses, currentMonth, currentYear]);

  const monthlyTotal = useMemo(() => {
    return monthlyExpenses.reduce((total, expense) => total + expense.amount, 0);
  }, [monthlyExpenses]);


  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-bold mb-4">Add Expense</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-400">Title</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full mt-1 p-2 bg-slate-700 border border-slate-600 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
                required
              />
            </div>
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-slate-400">Amount ($)</label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full mt-1 p-2 bg-slate-700 border border-slate-600 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
                required
                min="0.01"
                step="0.01"
              />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-slate-400">Category</label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                className="w-full mt-1 p-2 bg-slate-700 border border-slate-600 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
              >
                {Object.values(ExpenseCategory).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="w-full bg-cyan-600 text-white font-bold py-2 px-4 rounded-md hover:bg-cyan-700 transition-colors">
              Add Expense
            </button>
          </form>
        </div>
        <div className="bg-slate-800 p-6 rounded-xl shadow-lg mt-8">
            <h2 className="text-xl font-bold mb-4">Monthly Breakdown</h2>
            <ExpensePieChart data={monthlyExpenses} />
            <div className="text-center mt-4">
                <p className="text-slate-400">This Month's Total</p>
                <p className="text-3xl font-bold text-white">${monthlyTotal.toFixed(2)}</p>
            </div>
        </div>
      </div>
      <div className="lg:col-span-2 bg-slate-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold mb-4">Recent Expenses</h2>
        <div className="overflow-y-auto max-h-[70vh]">
          {expenses.length > 0 ? (
            <ul className="space-y-3">
              {[...expenses].reverse().map(expense => (
                <li key={expense.id} className="flex justify-between items-center bg-slate-700 p-3 rounded-md">
                  <div>
                    <p className="font-semibold">{expense.title}</p>
                    <p className="text-sm text-slate-400">{expense.category} - {new Date(expense.date).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <p className="font-bold text-lg">${expense.amount.toFixed(2)}</p>
                    <button onClick={() => removeExpense(expense.id)} className="text-red-400 hover:text-red-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-400 text-center py-8">No expenses added yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BudgetManager;
