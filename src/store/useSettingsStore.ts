import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Settings } from '../types';

interface SettingsStore extends Settings {
  isLoading: boolean;
  load: () => Promise<void>;
  setGeminiKey: (key: string) => Promise<void>;
  setAlphaVantageKey: (key: string) => Promise<void>;
  setCurrency: (currency: string, symbol: string) => Promise<void>;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  geminiApiKey: '',
  alphaVantageApiKey: '',
  currency: 'USD',
  currencySymbol: '$',
  isLoading: false,

  load: async () => {
    set({ isLoading: true });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('gemini_api_key, alpha_vantage_api_key, currency, currency_symbol')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"

      if (data) {
        set({
          geminiApiKey: data.gemini_api_key || '',
          alphaVantageApiKey: data.alpha_vantage_api_key || '',
          currency: data.currency || 'USD',
          currencySymbol: data.currency_symbol || '$',
        });
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  setGeminiKey: async (key) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .update({ gemini_api_key: key })
        .eq('id', user.id);
      
      if (error) throw error;
      set({ geminiApiKey: key });
    } catch (error) {
      console.error('Failed to save Gemini key:', error);
      throw error;
    }
  },

  setAlphaVantageKey: async (key) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .update({ alpha_vantage_api_key: key })
        .eq('id', user.id);
      
      if (error) throw error;
      set({ alphaVantageApiKey: key });
    } catch (error) {
      console.error('Failed to save Alpha Vantage key:', error);
      throw error;
    }
  },

  setCurrency: async (currency, symbol) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .update({ currency, currency_symbol: symbol })
        .eq('id', user.id);
      
      if (error) throw error;
      set({ currency, currencySymbol: symbol });
    } catch (error) {
      console.error('Failed to save currency:', error);
      throw error;
    }
  },
}));
