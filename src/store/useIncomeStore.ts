import { create } from 'zustand';
import { db } from '../db';
import type { IncomeEntry } from '../types';

interface IncomeStore {
  entries: IncomeEntry[];
  isLoading: boolean;
  load: () => Promise<void>;
  add: (entry: Omit<IncomeEntry, 'id' | 'createdAt'>) => Promise<void>;
  update: (id: number, entry: Partial<IncomeEntry>) => Promise<void>;
  remove: (id: number) => Promise<void>;
}

export const useIncomeStore = create<IncomeStore>((set, get) => ({
  entries: [],
  isLoading: false,
  load: async () => {
    set({ isLoading: true });
    try {
      const entries = await db.income.orderBy('date').reverse().toArray();
      set({ entries, isLoading: false });
    } catch (error) {
      console.error('Failed to load income entries:', error);
      set({ isLoading: false });
    }
  },
  add: async (entry) => {
    try {
      await db.income.add({
        ...entry,
        createdAt: new Date().toISOString(),
      });
      await get().load();
    } catch (error) {
      console.error('Failed to add income entry:', error);
      throw error;
    }
  },
  update: async (id, entry) => {
    try {
      await db.income.update(id, entry);
      await get().load();
    } catch (error) {
      console.error('Failed to update income entry:', error);
      throw error;
    }
  },
  remove: async (id) => {
    try {
      await db.income.delete(id);
      await get().load();
    } catch (error) {
      console.error('Failed to remove income entry:', error);
      throw error;
    }
  },
}));
