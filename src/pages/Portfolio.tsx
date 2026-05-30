import { useState, useMemo } from 'react';
import { usePortfolioStore } from '../store/usePortfolioStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { Plus, BarChart2, RefreshCcw, Edit2, Trash2, AlertCircle } from 'lucide-react';
import EmptyState from '../components/ui/EmptyState';
import PositionForm from '../components/forms/PositionForm';
import { formatCurrency } from '../utils/currency';
import { fetchEODPrice } from '../api/stockPrice';
import type { StockPosition } from '../types';

export default function Portfolio() {
  const { positions, add, update, remove, load } = usePortfolioStore();
  const { alphaVantageApiKey, currencySymbol } = useSettingsStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPosition, setEditingPosition] = useState<StockPosition | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshProgress, setRefreshProgress] = useState(0);

  // Calculate totals
  const totals = useMemo(() => {
    let totalValue = 0;
    let totalInvested = 0;
    
    positions.forEach((p) => {
      const price = p.latestPrice || 0;
      totalValue += price * p.shares;
      if (p.avgBuyPrice) {
        totalInvested += p.avgBuyPrice * p.shares;
      }
    });
    
    const gainLoss = totalValue - totalInvested;
    const gainLossPercentage = totalInvested > 0 ? (gainLoss / totalInvested) * 100 : 0;
    
    return { totalValue, totalInvested, gainLoss, gainLossPercentage };
  }, [positions]);

  const handleRefreshPrices = async () => {
    if (!alphaVantageApiKey) {
      alert('Please set your Alpha Vantage API key in Settings.');
      return;
    }

    setIsRefreshing(true);
    setRefreshProgress(0);
    
    let completed = 0;
    for (const p of positions) {
      if (!p.id) continue;
      
      const result = await fetchEODPrice(p.ticker, alphaVantageApiKey);
      if (result) {
        await update(p.id, {
          latestPrice: result.price,
          priceUpdatedAt: new Date().toISOString()
        });
      }
      
      completed++;
      setRefreshProgress(Math.round((completed / positions.length) * 100));
      
      // Alpha Vantage Free Tier: 5 calls/min, but spec says 25/day. 
      // We'll add a small delay to be safe and avoid hitting the rate limit too fast if many positions.
      if (positions.length > 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    setIsRefreshing(false);
    await load(); // Ensure state is fresh
  };

  const handleAdd = async (data: any) => {
    await add(data);
    setIsModalOpen(false);
  };

  const handleUpdate = async (data: any) => {
    if (editingPosition?.id) {
      await update(editingPosition.id, data);
      setEditingPosition(null);
      setIsModalOpen(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this position?')) {
      await remove(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Portfolio</h1>
          <p className="text-slate-500">Track your stock holdings and performance.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefreshPrices}
            disabled={isRefreshing || positions.length === 0}
            className="btn btn-secondary flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCcw size={18} className={isRefreshing ? 'animate-spin' : ''} />
            {isRefreshing ? `Refreshing (${refreshProgress}%)` : 'Refresh Prices'}
          </button>
          <button
            onClick={() => {
              setEditingPosition(null);
              setIsModalOpen(true);
            }}
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus size={18} />
            Add Position
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-5">
          <p className="text-xs font-semibold text-slate-500 uppercase">Total Value</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">
            {formatCurrency(totals.totalValue, currencySymbol)}
          </h3>
        </div>
        <div className="card p-5">
          <p className="text-xs font-semibold text-slate-500 uppercase">Total Invested</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">
            {formatCurrency(totals.totalInvested, currencySymbol)}
          </h3>
        </div>
        <div className={`card p-5 ${totals.gainLoss >= 0 ? 'bg-green-50/30' : 'bg-red-50/30'}`}>
          <p className="text-xs font-semibold text-slate-500 uppercase">Unrealized Gain/Loss</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className={`text-2xl font-bold ${totals.gainLoss >= 0 ? 'text-green-600' : 'text-red-500'}`}>
              {formatCurrency(Math.abs(totals.gainLoss), totals.gainLoss >= 0 ? '+' : '-')}
            </h3>
            <span className={`text-sm font-semibold ${totals.gainLoss >= 0 ? 'text-green-600' : 'text-red-500'}`}>
              ({totals.gainLossPercentage.toFixed(2)}%)
            </span>
          </div>
        </div>
        <div className="card p-5 flex items-center justify-center">
          <div className="text-center">
            <p className="text-xs font-semibold text-slate-500 uppercase">Positions</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{positions.length}</h3>
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        {positions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase whitespace-nowrap">Ticker</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase whitespace-nowrap">Company</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase whitespace-nowrap">Shares</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase whitespace-nowrap">Price</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase whitespace-nowrap">Value</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase whitespace-nowrap">Avg. Cost</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase whitespace-nowrap">Gain/Loss</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {positions.map((p) => {
                  const value = (p.latestPrice || 0) * p.shares;
                  const cost = (p.avgBuyPrice || 0) * p.shares;
                  const gainLoss = value - cost;
                  const gainLossPct = cost > 0 ? (gainLoss / cost) * 100 : 0;
                  const isStale = !p.priceUpdatedAt || new Date(p.priceUpdatedAt).toDateString() !== new Date().toDateString();

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900">{p.ticker}</span>
                          {isStale && (
                            <span className="text-[10px] text-amber-600 flex items-center gap-0.5 mt-0.5">
                              <AlertCircle size={10} />
                              Stale
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-600 truncate max-w-[150px] block" title={p.companyName}>
                          {p.companyName}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {p.shares.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">
                        {p.latestPrice ? formatCurrency(p.latestPrice, currencySymbol) : '—'}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-900">
                        {formatCurrency(value, currencySymbol)}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {p.avgBuyPrice ? formatCurrency(p.avgBuyPrice, currencySymbol) : '—'}
                      </td>
                      <td className="px-6 py-4">
                        {p.avgBuyPrice ? (
                          <div className={`flex flex-col items-start ${gainLoss >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                            <span className="text-sm font-bold">
                              {gainLoss >= 0 ? '+' : '-'}{formatCurrency(Math.abs(gainLoss), currencySymbol)}
                            </span>
                            <span className="text-xs font-medium">
                              ({gainLoss >= 0 ? '+' : ''}{gainLossPct.toFixed(2)}%)
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditingPosition(p);
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => p.id && handleDelete(p.id)}
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
            icon={BarChart2}
            title="Your portfolio is empty"
            message="Add your stock positions to track their performance and real-time value."
            actionLabel="Add First Position"
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
                {editingPosition ? 'Edit Position' : 'Add Position'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <Plus size={24} className="rotate-45" />
              </button>
            </div>
            <div className="p-6">
              <PositionForm
                initialData={editingPosition || undefined}
                onSubmit={editingPosition ? handleUpdate : handleAdd}
                onCancel={() => setIsModalOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
