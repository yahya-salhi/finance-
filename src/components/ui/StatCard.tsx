import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  subValue?: string;
  icon?: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  color?: 'green' | 'red' | 'blue' | 'slate';
}

export default function StatCard({ 
  label, 
  value, 
  subValue, 
  icon: Icon, 
  trend,
  color = 'slate'
}: StatCardProps) {
  const colorClasses = {
    green: 'text-green-600 bg-green-50',
    red: 'text-red-600 bg-red-50',
    blue: 'text-blue-600 bg-blue-50',
    slate: 'text-slate-600 bg-slate-50',
  };

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <h3 className={`text-2xl font-bold mt-1 font-mono ${
            color === 'green' ? 'text-green-600' : 
            color === 'red' ? 'text-red-500' : 'text-slate-900'
          }`}>
            {value}
          </h3>
          {subValue && (
            <p className="text-xs text-slate-400 mt-1">{subValue}</p>
          )}
        </div>
        {Icon && (
          <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
            <Icon size={20} />
          </div>
        )}
      </div>
      {trend && (
        <div className="mt-4 flex items-center gap-1">
          {/* Trend indicator logic could be added here */}
        </div>
      )}
    </div>
  );
}
