import { create } from 'zustand';
import { supabase } from '../lib/supabase';
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
      const { data, error } = await supabase
        .from('income')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      
      // Map Supabase fields to our type if necessary (snake_case to camelCase)
      const entries: IncomeEntry[] = (data || []).map(item => ({
        id: item.id,
        amount: item.amount,
        label: item.label,
        category: item.category as any,
        date: item.date,
        recurrence: item.recurrence as any,
        notes: item.notes,
        createdAt: item.created_at,
      }));

      set({ entries, isLoading: false });
    } catch (error) {
      console.error('Failed to load income entries:', error);
      set({ isLoading: false });
    }
  },
  add: async (entry) => {
    try {
      const { error } = await supabase.from('income').insert([
        {
          amount: entry.amount,
          label: entry.label,
          category: entry.category,
          date: entry.date,
          recurrence: entry.recurrence,
          notes: entry.notes,
        },
      ]);
      if (error) throw error;
      await get().load();
    } catch (error) {
      console.error('Failed to add income entry:', error);
      throw error;
    }
  },
  update: async (id, entry) => {
    try {
      const { error } = await supabase
        .from('income')
        .update({
          amount: entry.amount,
          label: entry.label,
          category: entry.category,
          date: entry.date,
          recurrence: entry.recurrence,
          notes: entry.notes,
        })
        .eq('id', id);
      if (error) throw error;
      await get().load();
    } catch (error) {
      console.error('Failed to update income entry:', error);
      throw error;
    }
  },
  remove: async (id) => {
    try {
      const { error } = await supabase.from('income').delete().eq('id', id);
      if (error) throw error;
      await get().load();
    } catch (error) {
      console.error('Failed to remove income entry:', error);
      throw error;
    }
  },
}));
