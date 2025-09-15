import React, { useMemo } from 'react';
import type { Expense } from '../../types';
import { ExpenseCategory } from '../../types';

interface ExpensePieChartProps {
  data: Expense[];
}

const COLORS: Record<ExpenseCategory, string> = {
  [ExpenseCategory.Food]: '#34D399', // Emerald 400
  [ExpenseCategory.Books]: '#60A5FA', // Blue 400
  [ExpenseCategory.Travel]: '#FBBF24', // Amber 400
  [ExpenseCategory.Misc]: '#A78BFA', // Violet 400
};

const ExpensePieChart: React.FC<ExpensePieChartProps> = ({ data }) => {
  const Recharts = (window as any).Recharts;

  if (!Recharts) {
    return <div className="text-center text-slate-500 py-10">Loading chart...</div>;
  }
  
  const { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } = Recharts;

  const chartData = useMemo(() => {
    const categoryTotals = data.reduce((acc, expense) => {
      if (!acc[expense.category]) {
        acc[expense.category] = 0;
      }
      acc[expense.category] += expense.amount;
      return acc;
    }, {} as Record<ExpenseCategory, number>);

    return Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      value,
    }));
  }, [data]);
  
  if (chartData.length === 0) {
    return <div className="text-center text-slate-500 py-10">No data for this month's chart.</div>;
  }

  return (
    <div style={{ width: '100%', height: 250 }}>
        <ResponsiveContainer>
            <PieChart>
                <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                >
                {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name as ExpenseCategory]} />
                ))}
                </Pie>
                <Tooltip
                    contentStyle={{
                        backgroundColor: '#334155', // slate-700
                        border: '1px solid #475569' // slate-600
                    }}
                    itemStyle={{ color: '#F1F5F9' }} // slate-100
                />
                <Legend iconSize={10} />
            </PieChart>
        </ResponsiveContainer>
    </div>
  );
};

export default ExpensePieChart;