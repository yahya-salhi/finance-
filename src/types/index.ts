export type Recurrence = 'none' | 'weekly' | 'monthly' | 'annually';
export type PaymentMethod = 'cash' | 'card' | 'transfer' | 'other';

export type IncomeCategory =
  | 'salary'
  | 'freelance'
  | 'business'
  | 'rental'
  | 'dividends'
  | 'interest'
  | 'government'
  | 'gift'
  | 'other';

export type ExpenseCategory =
  | 'housing'
  | 'groceries'
  | 'dining'
  | 'transport'
  | 'utilities'
  | 'subscriptions'
  | 'health'
  | 'education'
  | 'clothing'
  | 'entertainment'
  | 'travel'
  | 'family'
  | 'personal_care'
  | 'savings'
  | 'misc';

export interface IncomeEntry {
  id?: number;
  amount: number;
  label: string;
  category: IncomeCategory;
  date: string;             // ISO date string YYYY-MM-DD
  recurrence: Recurrence;
  notes?: string;
  createdAt: string;        // ISO timestamp
}

export interface ExpenseEntry {
  id?: number;
  amount: number;
  label: string;
  category: ExpenseCategory;
  date: string;
  recurrence: Recurrence;
  paymentMethod?: PaymentMethod;
  notes?: string;
  createdAt: string;
}

export interface StockPosition {
  id?: number;
  ticker: string;
  companyName: string;
  shares: number;
  avgBuyPrice?: number;
  notes?: string;
  latestPrice?: number;
  priceUpdatedAt?: string;  // ISO timestamp
  createdAt: string;
}

export interface Settings {
  geminiApiKey: string;
  alphaVantageApiKey: string;
  currency: string;         // e.g. 'USD', 'EUR', 'TND'
  currencySymbol: string;
  subscriptionStatus: 'active' | 'inactive' | 'canceled' | 'past_due';
  stripeCustomerId?: string;
}
