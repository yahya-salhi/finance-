import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useMemo } from 'react';
import { subMonths, format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import type { IncomeEntry, ExpenseEntry } from '../../types';

interface CashFlowBarProps {
  income: IncomeEntry[];
  expenses: ExpenseEntry[];
}

export default function CashFlowBar({ income, expenses }: CashFlowBarProps) {
  const data = useMemo(() => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const date = subMonths(new Date(), i);
      const start = startOfMonth(date);
      const end = endOfMonth(date);
      
      const monthIncome = income
        .filter(e => isWithinInterval(new Date(e.date), { start, end }))
        .reduce((sum, e) => sum + e.amount, 0);
        
      const monthExpenses = expenses
        .filter(e => isWithinInterval(new Date(e.date), { start, end }))
        .reduce((sum, e) => sum + e.amount, 0);
        
      months.push({
        name: format(date, 'MMM'),
        Income: monthIncome,
        Expenses: monthExpenses,
      });
    }
    return months;
  }, [income, expenses]);

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 12 }} 
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 12 }} 
          />
          <Tooltip 
            cursor={{ fill: '#f8fafc' }}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Legend iconType="circle" />
          <Bar dataKey="Income" fill="#16a34a" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
