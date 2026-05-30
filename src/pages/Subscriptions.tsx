import { useMemo } from 'react';
import { useExpenseStore } from '../store/useExpenseStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { Repeat, Calendar, CreditCard } from 'lucide-react';
import EmptyState from '../components/ui/EmptyState';
import Badge from '../components/ui/Badge';
import { formatCurrency } from '../utils/currency';
import { getNextBillingDate } from '../utils/dates';
import { EXPENSE_CATEGORIES } from '../utils/categories';

export default function Subscriptions() {
  const { entries } = useExpenseStore();
  const { currencySymbol } = useSettingsStore();

  const subscriptions = useMemo(() => {
    return entries.filter((entry) => entry.recurrence !== 'none');
  }, [entries]);

  const totalMonthly = useMemo(() => {
    return subscriptions.reduce((sum, sub) => {
      let amount = sub.amount;
      if (sub.recurrence === 'weekly') amount *= 4.33;
      if (sub.recurrence === 'annually') amount /= 12;
      return sum + amount;
    }, 0);
  }, [subscriptions]);

  const totalAnnually = totalMonthly * 12;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Subscriptions</h1>
        <p className="text-slate-500">Manage your recurring expenses and billing cycles.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card p-5 bg-blue-50/50 border-blue-100">
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Total Monthly Cost</p>
          <h2 className="text-2xl font-bold text-blue-700 mt-1">
            {formatCurrency(totalMonthly, currencySymbol)}
          </h2>
          <p className="text-xs text-blue-500 mt-1">Estimated based on all recurring items</p>
        </div>
        <div className="card p-5 bg-slate-50 border-slate-200">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Annual Equivalent</p>
          <h2 className="text-2xl font-bold text-slate-700 mt-1">
            {formatCurrency(totalAnnually, currencySymbol)}
          </h2>
          <p className="text-xs text-slate-400 mt-1">Total projected yearly spending</p>
        </div>
      </div>

      {subscriptions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subscriptions.map((sub) => {
            const category = EXPENSE_CATEGORIES[sub.category];
            const nextBilling = getNextBillingDate(sub.date, sub.recurrence);
            
            return (
              <div key={sub.id} className="card hover:shadow-md transition-shadow">
                <div className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                      <category.icon size={20} />
                    </div>
                    <Badge color={category.color}>
                      {sub.recurrence}
                    </Badge>
                  </div>
                  
                  <h3 className="text-lg font-bold text-slate-900 truncate" title={sub.label}>
                    {sub.label}
                  </h3>
                  
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500 flex items-center gap-1.5">
                        <CreditCard size={14} />
                        Cost
                      </span>
                      <span className="text-sm font-bold text-slate-900">
                        {formatCurrency(sub.amount, currencySymbol)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500 flex items-center gap-1.5">
                        <Calendar size={14} />
                        Next Billing
                      </span>
                      <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        {nextBilling}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    {category.label}
                  </span>
                  <button 
                    onClick={() => { /* Navigation to edit could be added here */ }}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Manage
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card">
          <EmptyState
            icon={Repeat}
            title="No active subscriptions"
            message="Recurring expenses like Netflix, Rent, or Gym memberships will appear here."
            actionLabel="Add Recurring Expense"
            onAction={() => window.location.hash = '/expenses'} // Simple way to suggest where to go
          />
        </div>
      )}
    </div>
  );
}
