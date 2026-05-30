import { create } from 'zustand';
import { db } from '../db';
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
      const positions = await db.portfolio.toArray();
      set({ positions, isLoading: false });
    } catch (error) {
      console.error('Failed to load portfolio positions:', error);
      set({ isLoading: false });
    }
  },
  add: async (position) => {
    try {
      await db.portfolio.add({
        ...position,
        createdAt: new Date().toISOString(),
      });
      await get().load();
    } catch (error) {
      console.error('Failed to add position:', error);
      throw error;
    }
  },
  update: async (id, position) => {
    try {
      await db.portfolio.update(id, position);
      await get().load();
    } catch (error) {
      console.error('Failed to update position:', error);
      throw error;
    }
  },
  remove: async (id) => {
    try {
      await db.portfolio.delete(id);
      await get().load();
    } catch (error) {
      console.error('Failed to remove position:', error);
      throw error;
    }
  },
}));
