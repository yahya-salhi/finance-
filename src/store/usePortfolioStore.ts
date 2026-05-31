import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { StockPosition } from '../types';

interface PortfolioStore {
  positions: StockPosition[];
  isLoading: boolean;
  load: () => Promise<void>;
  add: (position: Omit<StockPosition, 'id' | 'createdAt'>) => Promise<void>;
  update: (id: number, position: Partial<StockPosition>) => Promise<void>;
  remove: (id: number) => Promise<void>;
}

export const usePortfolioStore = create<PortfolioStore>((set, get) => ({
  positions: [],
  isLoading: false,
  load: async () => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('portfolio')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const positions: StockPosition[] = (data || []).map(item => ({
        id: item.id,
        ticker: item.ticker,
        companyName: item.company_name,
        shares: item.shares,
        avgBuyPrice: item.avg_buy_price,
        notes: item.notes,
        createdAt: item.created_at,
      }));

      set({ positions, isLoading: false });
    } catch (error) {
      console.error('Failed to load portfolio positions:', error);
      set({ isLoading: false });
    }
  },
  add: async (position) => {
    try {
      const { error } = await supabase.from('portfolio').insert([
        {
          ticker: position.ticker,
          company_name: position.companyName,
          shares: position.shares,
          avg_buy_price: position.avgBuyPrice,
          notes: position.notes,
        },
      ]);
      if (error) throw error;
      await get().load();
    } catch (error) {
      console.error('Failed to add position:', error);
      throw error;
    }
  },
  update: async (id, position) => {
    try {
      const { error } = await supabase
        .from('portfolio')
        .update({
          ticker: position.ticker,
          company_name: position.companyName,
          shares: position.shares,
          avg_buy_price: position.avgBuyPrice,
          notes: position.notes,
        })
        .eq('id', id);
      if (error) throw error;
      await get().load();
    } catch (error) {
      console.error('Failed to update position:', error);
      throw error;
    }
  },
  remove: async (id) => {
    try {
      const { error } = await supabase.from('portfolio').delete().eq('id', id);
      if (error) throw error;
      await get().load();
    } catch (error) {
      console.error('Failed to remove position:', error);
      throw error;
    }
  },
}));

