import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { StockPosition } from '../../types';
import { searchSymbol, fetchEODPrice } from '../../api/stockPrice';
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
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export default function PositionForm({ initialData, onSubmit, onCancel }: PositionFormProps) {
  const { alphaVantageApiKey } = useSettingsStore();
  const [isSearching, setIsSearching] = useState(false);
  const [fetchedPrice, setFetchedPrice] = useState<{ price: number; date: string } | null>(null);

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
    if (!ticker || ticker.length < 1 || initialData?.id || !alphaVantageApiKey) return;

    setIsSearching(true);
    try {
      // 1. Search for company name
      const results = await searchSymbol(ticker, alphaVantageApiKey);
      if (results.length > 0) {
        const found = results.find(r => r.ticker.toUpperCase() === ticker.toUpperCase()) || results[0];
        setValue('companyName', found.name);
        setValue('ticker', found.ticker);
        
        // 2. Fetch latest price
        const priceData = await fetchEODPrice(found.ticker, alphaVantageApiKey);
        if (priceData) {
          setFetchedPrice(priceData);
          // If user hasn't entered an avg buy price, suggest the current price
          if (!watch('avgBuyPrice')) {
            setValue('avgBuyPrice', priceData.price);
          }
        } else {
          // If priceData is null, it likely hit a limit or the ticker is invalid
          console.warn('Could not fetch price for', found.ticker);
        }
      } else {
        console.warn('No search results found for', ticker);
      }
    } catch (error) {
      console.error('Search/Price fetch failed', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleFormSubmit = async (data: FormData) => {
    let currentPrice = fetchedPrice;
    
    // Final check: if we don't have a fetched price yet, try one last time
    if (!currentPrice && data.ticker && alphaVantageApiKey) {
      setIsSearching(true);
      try {
        const priceData = await fetchEODPrice(data.ticker, alphaVantageApiKey);
        if (priceData) {
          currentPrice = priceData;
        }
      } catch (e) {
        console.error('Final price fetch failed', e);
      } finally {
        setIsSearching(false);
      }
    }

    const finalData = {
      ...data,
      ...(currentPrice ? {
        latestPrice: currentPrice.price,
        priceUpdatedAt: new Date().toISOString()
      } : {})
    };
    onSubmit(finalData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
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
        <div className="relative">
          <input
            type="number"
            step="0.01"
            className={`input ${errors.avgBuyPrice ? 'border-red-500' : ''}`}
            placeholder="0.00"
            {...register('avgBuyPrice', { valueAsNumber: true })}
          />
          {fetchedPrice && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md border border-green-200">
              Price Fetched
            </div>
          )}
        </div>
        {errors.avgBuyPrice && <p className="text-xs text-red-500 mt-1">{errors.avgBuyPrice.message}</p>}
        {fetchedPrice && (
          <p className="text-[10px] text-slate-400 mt-1 italic">
            Market price as of {fetchedPrice.date}
          </p>
        )}
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
