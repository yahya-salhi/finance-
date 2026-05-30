import { create } from 'zustand';
import { db } from '../db';
import type { ExpenseEntry } from '../types';

interface ExpenseStore {
  entries: ExpenseEntry[];
  isLoading: boolean;
  load: () => Promise<void>;
  add: (entry: Omit<ExpenseEntry, 'id' | 'createdAt'>) => Promise<void>;
  update: (id: number, entry: Partial<ExpenseEntry>) => Promise<void>;
  remove: (id: number) => Promise<void>;
}

export const useExpenseStore = create<ExpenseStore>((set, get) => ({
  entries: [],
  isLoading: false,
  load: async () => {
    set({ isLoading: true });
    try {
      const entries = await db.expenses.orderBy('date').reverse().toArray();
      set({ entries, isLoading: false });
    } catch (error) {
      console.error('Failed to load expense entries:', error);
      set({ isLoading: false });
    }
  },
  add: async (entry) => {
    try {
      await db.expenses.add({
        ...entry,
        createdAt: new Date().toISOString(),
      });
      await get().load();
    } catch (error) {
      console.error('Failed to add expense entry:', error);
      throw error;
    }
  },
  update: async (id, entry) => {
    try {
      await db.expenses.update(id, entry);
      await get().load();
    } catch (error) {
      console.error('Failed to update expense entry:', error);
      throw error;
    }
  },
  remove: async (id) => {
    try {
      await db.expenses.delete(id);
      await get().load();
    } catch (error) {
      console.error('Failed to remove expense entry:', error);
      throw error;
    }
  },
}));
