import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Settings } from '../types';

interface SettingsStore extends Settings {
  setGeminiKey: (key: string) => void;
  setAlphaVantageKey: (key: string) => void;
  setCurrency: (currency: string, symbol: string) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      geminiApiKey: '',
      alphaVantageApiKey: '',
      currency: 'USD',
      currencySymbol: '$',
      setGeminiKey: (key) => set({ geminiApiKey: key }),
      setAlphaVantageKey: (key) => set({ alphaVantageApiKey: key }),
      setCurrency: (currency, symbol) => set({ currency, currencySymbol: symbol }),
    }),
    {
      name: 'finance-settings',
    }
  )
);
