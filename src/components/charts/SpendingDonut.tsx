import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { ExpenseEntry } from '../../types';
import { EXPENSE_CATEGORIES } from '../../utils/categories';
import { useMemo, memo } from 'react';

interface SpendingDonutProps {
  expenses: ExpenseEntry[];
}

const SpendingDonut = memo(function SpendingDonut({ expenses }: SpendingDonutProps) {
  const data = useMemo(() => {
    const categories: Record<string, { name: string, value: number, color: string }> = {};
    
    expenses.forEach((e) => {
      const cat = EXPENSE_CATEGORIES[e.category];
      if (!categories[e.category]) {
        categories[e.category] = { 
          name: cat.label, 
          value: 0, 
          color: cat.color 
        };
      }
      categories[e.category].value += e.amount;
    });
    
    return Object.values(categories).sort((a, b) => b.value - a.value);
  }, [expenses]);

  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
        No expense data for this period
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: any) => `$${Number(value).toLocaleString()}`}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Legend iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
});

export default SpendingDonut;
