import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { StockPosition } from '../../types';
import { searchSymbol } from '../../api/stockPrice';
import { useSettingsStore } from '../../store/useSettingsStore';
import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';

const schema = z.object({
  ticker: z.string().min(1, 'Ticker is required').max(10).toUpperCase(),
  companyName: z.string().min(1, 'Company name is required'),
  shares: z.number().positive('Shares must be positive'),
  avgBuyPrice: z.number().positive('Price must be positive').optional(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface PositionFormProps {
  initialData?: Partial<StockPosition>;
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
}

export default function PositionForm({ initialData, onSubmit, onCancel }: PositionFormProps) {
  const { alphaVantageApiKey } = useSettingsStore();
  const [isSearching, setIsSearching] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      ticker: initialData?.ticker || '',
      companyName: initialData?.companyName || '',
      shares: initialData?.shares || 0,
      avgBuyPrice: initialData?.avgBuyPrice || undefined,
      notes: initialData?.notes || '',
    },
  });

  const ticker = watch('ticker');

  const handleTickerBlur = async () => {
    if (!ticker || ticker.length < 1 || initialData?.id) return;

    setIsSearching(true);
    try {
      const results = await searchSymbol(ticker, alphaVantageApiKey);
      if (results.length > 0) {
        setValue('companyName', results[0].name);
        // If the ticker was slightly different (e.g. user typed 'aapl' and result is 'AAPL'), update it
        setValue('ticker', results[0].ticker);
      }
    } catch (error) {
      console.error('Search failed', error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Ticker</label>
          <div className="relative">
            <input
              type="text"
              className={`input uppercase ${errors.ticker ? 'border-red-500' : ''}`}
              placeholder="e.g. AAPL"
              {...register('ticker')}
              onBlur={handleTickerBlur}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              {isSearching ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
            </div>
          </div>
          {errors.ticker && <p className="text-xs text-red-500 mt-1">{errors.ticker.message}</p>}
        </div>
        <div>
          <label className="label">Shares</label>
          <input
            type="number"
            step="0.00001"
            className={`input ${errors.shares ? 'border-red-500' : ''}`}
            {...register('shares', { valueAsNumber: true })}
          />
          {errors.shares && <p className="text-xs text-red-500 mt-1">{errors.shares.message}</p>}
        </div>
      </div>

      <div>
        <label className="label">Company Name</label>
        <input
          type="text"
          className={`input ${errors.companyName ? 'border-red-500' : ''}`}
          placeholder="e.g. Apple Inc."
          {...register('companyName')}
        />
        {errors.companyName && <p className="text-xs text-red-500 mt-1">{errors.companyName.message}</p>}
      </div>

      <div>
        <label className="label">Avg. Buy Price (Optional)</label>
        <input
          type="number"
          step="0.01"
          className={`input ${errors.avgBuyPrice ? 'border-red-500' : ''}`}
          placeholder="0.00"
          {...register('avgBuyPrice', { valueAsNumber: true })}
        />
        {errors.avgBuyPrice && <p className="text-xs text-red-500 mt-1">{errors.avgBuyPrice.message}</p>}
      </div>

      <div>
        <label className="label">Notes (Optional)</label>
        <textarea
          className="input min-h-[80px]"
          {...register('notes')}
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button type="button" onClick={onCancel} className="btn btn-secondary flex-1">
          Cancel
        </button>
        <button type="submit" className="btn btn-primary flex-1">
          {initialData?.id ? 'Update Position' : 'Add Position'}
        </button>
      </div>
    </form>
  );
}
