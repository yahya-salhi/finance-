import { useState, useMemo, useDeferredValue } from 'react';
import { useIncomeStore } from '../store/useIncomeStore';
import { useExpenseStore } from '../store/useExpenseStore';
import { usePortfolioStore } from '../store/usePortfolioStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { TrendingUp, TrendingDown, DollarSign, BarChart2, Repeat, Clock, Loader2 } from 'lucide-react';
import MonthSelector from '../components/ui/MonthSelector';
import StatCard from '../components/ui/StatCard';
import SpendingDonut from '../components/charts/SpendingDonut';
import CashFlowBar from '../components/charts/CashFlowBar';
import { formatCurrency } from '../utils/currency';
import { formatDate } from '../utils/dates';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../utils/categories';
import Badge from '../components/ui/Badge';

export default function Dashboard() {
  const { entries: income } = useIncomeStore();
  const { entries: expenses } = useExpenseStore();
  const { positions } = usePortfolioStore();
  const { currencySymbol } = useSettingsStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Use deferred value for the month filtering to keep UI responsive
  const deferredDate = useDeferredValue(currentDate);
  const isStale = currentDate !== deferredDate;

  const filteredData = useMemo(() => {
    const month = deferredDate.getMonth();
    const year = deferredDate.getFullYear();
    
    const monthIncome = income.filter(e => {
      const d = new Date(e.date);
      return d.getMonth() === month && d.getFullYear() === year;
    });
    
    const monthExpenses = expenses.filter(e => {
      const d = new Date(e.date);
      return d.getMonth() === month && d.getFullYear() === year;
    });
    
    return { monthIncome, monthExpenses };
  }, [income, expenses, deferredDate]);

  const totals = useMemo(() => {
    const incomeTotal = filteredData.monthIncome.reduce((sum, e) => sum + e.amount, 0);
    const expenseTotal = filteredData.monthExpenses.reduce((sum, e) => sum + e.amount, 0);
    const cashFlow = incomeTotal - expenseTotal;
    
    let portfolioValue = 0;
    positions.forEach(p => {
      portfolioValue += (p.latestPrice || 0) * p.shares;
    });
    
    const subscriptionsTotal = expenses
      .filter(e => e.recurrence !== 'none')
      .reduce((sum, e) => {
        let amt = e.amount;
        if (e.recurrence === 'weekly') amt *= 4.33;
        if (e.recurrence === 'annually') amt /= 12;
        return sum + amt;
      }, 0);
      
    return { incomeTotal, expenseTotal, cashFlow, portfolioValue, subscriptionsTotal };
  }, [filteredData, positions, expenses]);

  const recentActivity = useMemo(() => {
    const combined = [
      ...income.map(e => ({ ...e, type: 'income' })),
      ...expenses.map(e => ({ ...e, type: 'expense' }))
    ];
    return combined
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);
  }, [income, expenses]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">Financial Overview</h1>
            {isStale ? (
              <div className="animate-spin">
                <Loader2 className="text-slate-400" size={18} />
              </div>
            ) : null}
          </div>
          <p className="text-slate-500">Welcome back! Here's what's happening with your money.</p>
        </div>
        <MonthSelector currentDate={currentDate} onChange={setCurrentDate} />
      </div>

      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-200 ${isStale ? 'opacity-50' : 'opacity-100'}`}>
        <div className="lg:col-span-1">
          <StatCard
            label="Total Income"
            value={formatCurrency(totals.incomeTotal, currencySymbol)}
            icon={TrendingUp}
            color="green"
          />
        </div>
        <div className="lg:col-span-1">
          <StatCard
            label="Total Expenses"
            value={formatCurrency(totals.expenseTotal, currencySymbol)}
            icon={TrendingDown}
            color="red"
          />
        </div>
        <div className="lg:col-span-1">
          <StatCard
            label="Net Cash Flow"
            value={formatCurrency(Math.abs(totals.cashFlow), totals.cashFlow >= 0 ? '+' : '-')}
            icon={DollarSign}
            color={totals.cashFlow >= 0 ? 'green' : 'red'}
          />
        </div>

        <section className="card p-6 lg:col-span-1">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Spending by Category</h2>
          <SpendingDonut expenses={filteredData.monthExpenses} />
        </section>

        <section className="card p-6 lg:col-span-2">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Cash Flow History</h2>
          <CashFlowBar income={income} expenses={expenses} />
        </section>

        <div className="lg:col-span-1 space-y-6">
          <section className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900">Portfolio Snapshot</h2>
              <BarChart2 className="text-blue-500" />
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Total Portfolio Value</p>
                <p className="text-3xl font-bold text-slate-900 mt-1 font-mono">
                  {formatCurrency(totals.portfolioValue, currencySymbol)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400">Positions: {positions.length}</p>
                <a href="/portfolio" className="text-sm font-semibold text-blue-600 hover:underline mt-1 block">View Portfolio</a>
              </div>
            </div>
          </section>

          <section className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900">Subscriptions</h2>
              <Repeat className="text-purple-500" />
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Monthly Recurring Cost</p>
                <p className="text-2xl font-bold text-slate-900 mt-1 font-mono">
                  {formatCurrency(totals.subscriptionsTotal, currencySymbol)}
                </p>
              </div>
              <a href="/subscriptions" className="text-sm font-semibold text-blue-600 hover:underline">Manage All</a>
            </div>
          </section>
        </div>

        <section className="card overflow-hidden lg:col-span-2">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
            <Clock size={18} className="text-slate-400" />
          </div>
          <div className="divide-y divide-slate-100 content-visibility-auto contain-intrinsic-size-[500px]">
            {recentActivity.length > 0 ? (
              recentActivity.map((item, idx) => {
                const isIncome = 'type' in item && item.type === 'income';
                const category = isIncome 
                  ? INCOME_CATEGORIES[item.category as keyof typeof INCOME_CATEGORIES]
                  : EXPENSE_CATEGORIES[item.category as keyof typeof EXPENSE_CATEGORIES];
                
                return (
                  <div key={`${item.id}-${idx}`} className="px-6 py-3 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg" style={{ backgroundColor: `${category.color}15`, color: category.color }}>
                        <category.icon size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                        <p className="text-xs text-slate-500">{formatDate(item.date)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold font-mono ${isIncome ? 'text-green-600' : 'text-red-500'}`}>
                        {isIncome ? '+' : '-'}{formatCurrency(item.amount, currencySymbol)}
                      </p>
                      <Badge color={category.color} className="mt-1">{category.label}</Badge>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-12 text-center text-slate-400 text-sm">
                No recent transactions
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
