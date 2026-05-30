import { useState, useMemo } from 'react';
import { useExpenseStore } from '../store/useExpenseStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { Plus, TrendingDown, Edit2, Trash2, Repeat, Filter } from 'lucide-react';
import MonthSelector from '../components/ui/MonthSelector';
import ExpenseForm from '../components/forms/ExpenseForm';
import EmptyState from '../components/ui/EmptyState';
import Badge from '../components/ui/Badge';
import { formatCurrency } from '../utils/currency';
import { formatDate } from '../utils/dates';
import { EXPENSE_CATEGORIES } from '../utils/categories';
import type { ExpenseEntry, ExpenseCategory } from '../types';
import { format } from 'date-fns';

export default function Expenses() {
  const { entries, add, update, remove } = useExpenseStore();
  const { currencySymbol } = useSettingsStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<ExpenseEntry | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<ExpenseCategory | 'all'>('all');

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const entryDate = new Date(entry.date);
      const isSameMonth = 
        entryDate.getMonth() === currentDate.getMonth() &&
        entryDate.getFullYear() === currentDate.getFullYear();
      
      const matchesCategory = categoryFilter === 'all' || entry.category === categoryFilter;
      
      return isSameMonth && matchesCategory;
    });
  }, [entries, currentDate, categoryFilter]);

  const monthlyTotal = useMemo(() => {
    return filteredEntries.reduce((sum, entry) => sum + entry.amount, 0);
  }, [filteredEntries]);

  const handleAdd = async (data: any) => {
    await add(data);
    setIsModalOpen(false);
  };

  const handleUpdate = async (data: any) => {
    if (editingEntry?.id) {
      await update(editingEntry.id, data);
      setEditingEntry(null);
      setIsModalOpen(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this entry?')) {
      await remove(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Expenses</h1>
          <p className="text-slate-500">Track and manage your spending.</p>
        </div>
        <div className="flex items-center gap-3">
          <MonthSelector currentDate={currentDate} onChange={setCurrentDate} />
          <button
            onClick={() => {
              setEditingEntry(null);
              setIsModalOpen(true);
            }}
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus size={18} />
            Add Entry
          </button>
        </div>
      </div>

      <div className="card p-6 bg-red-50/50 border-red-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-red-700 uppercase tracking-wider">Total Monthly Spending</p>
            <h2 className="text-3xl font-bold text-red-500 mt-1">
              {formatCurrency(monthlyTotal, currencySymbol)}
            </h2>
          </div>
          <div className="p-3 bg-red-500 rounded-xl text-white">
            <TrendingDown size={24} />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-slate-500 bg-white border border-slate-200 rounded-lg px-3 py-1.5 shadow-sm">
          <Filter size={16} />
          <span className="text-sm font-medium">Filter by:</span>
          <select 
            className="bg-transparent text-sm font-semibold text-slate-900 outline-none"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as any)}
          >
            <option value="all">All Categories</option>
            {Object.entries(EXPENSE_CATEGORIES).map(([key, meta]) => (
              <option key={key} value={key}>{meta.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="card overflow-hidden">
        {filteredEntries.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Date</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Label</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Category</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Amount</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEntries.map((entry) => {
                  const category = EXPENSE_CATEGORIES[entry.category];
                  return (
                    <tr key={entry.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">
                        {formatDate(entry.date)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-slate-900">{entry.label}</span>
                          {entry.recurrence !== 'none' && (
                            <Repeat size={14} className="text-blue-500" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge color={category.color}>
                          {category.label}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-red-500">
                        {formatCurrency(entry.amount, currencySymbol)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditingEntry(entry);
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => entry.id && handleDelete(entry.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={TrendingDown}
            title="No expense entries"
            message={`You haven't added any expenses for ${format(currentDate, 'MMMM yyyy')} ${categoryFilter !== 'all' ? `in ${categoryFilter}` : ''} yet.`}
            actionLabel="Add Expense"
            onAction={() => setIsModalOpen(true)}
          />
        )}
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">
                {editingEntry ? 'Edit Expense Entry' : 'Add Expense Entry'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <Plus size={24} className="rotate-45" />
              </button>
            </div>
            <div className="p-6">
              <ExpenseForm
                initialData={editingEntry || undefined}
                onSubmit={editingEntry ? handleUpdate : handleAdd}
                onCancel={() => setIsModalOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
