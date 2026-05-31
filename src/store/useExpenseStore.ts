import { create } from 'zustand';
import { supabase } from '../lib/supabase';
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
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      
      const entries: ExpenseEntry[] = (data || []).map(item => ({
        id: item.id,
        amount: item.amount,
        label: item.label,
        category: item.category as any,
        date: item.date,
        recurrence: item.recurrence as any,
        paymentMethod: item.payment_method as any,
        notes: item.notes,
        createdAt: item.created_at,
      }));

      set({ entries, isLoading: false });
    } catch (error) {
      console.error('Failed to load expense entries:', error);
      set({ isLoading: false });
    }
  },
  add: async (entry) => {
    try {
      const { error } = await supabase.from('expenses').insert([
        {
          amount: entry.amount,
          label: entry.label,
          category: entry.category,
          date: entry.date,
          recurrence: entry.recurrence,
          payment_method: entry.paymentMethod,
          notes: entry.notes,
        },
      ]);
      if (error) throw error;
      await get().load();
    } catch (error) {
      console.error('Failed to add expense entry:', error);
      throw error;
    }
  },
  update: async (id, entry) => {
    try {
      const { error } = await supabase
        .from('expenses')
        .update({
          amount: entry.amount,
          label: entry.label,
          category: entry.category,
          date: entry.date,
          recurrence: entry.recurrence,
          payment_method: entry.paymentMethod,
          notes: entry.notes,
        })
        .eq('id', id);
      if (error) throw error;
      await get().load();
    } catch (error) {
      console.error('Failed to update expense entry:', error);
      throw error;
    }
  },
  remove: async (id) => {
    try {
      const { error } = await supabase.from('expenses').delete().eq('id', id);
      if (error) throw error;
      await get().load();
    } catch (error) {
      console.error('Failed to remove expense entry:', error);
      throw error;
    }
  },
}));
