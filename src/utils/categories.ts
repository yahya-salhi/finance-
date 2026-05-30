import { 
  Briefcase, 
  Code, 
  Building2, 
  Home, 
  Coins, 
  Percent, 
  Gift, 
  HelpCircle,
  ShoppingCart,
  Utensils,
  Car,
  Zap,
  Repeat,
  HeartPulse,
  GraduationCap,
  Shirt,
  Gamepad2,
  Plane,
  Users,
  Sparkles,
  PiggyBank,
  FolderTree
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { IncomeCategory, ExpenseCategory } from '../types';

export interface CategoryMetadata {
  label: string;
  color: string;
  icon: LucideIcon;
}

export const INCOME_CATEGORIES: Record<IncomeCategory, CategoryMetadata> = {
  salary: { label: 'Salary', color: '#16a34a', icon: Briefcase },
  freelance: { label: 'Freelance', color: '#2563eb', icon: Code },
  business: { label: 'Business', color: '#9333ea', icon: Building2 },
  rental: { label: 'Rental', color: '#ca8a04', icon: Home },
  dividends: { label: 'Dividends', color: '#0891b2', icon: Coins },
  interest: { label: 'Interest', color: '#0d9488', icon: Percent },
  government: { label: 'Government', color: '#4b5563', icon: Building2 },
  gift: { label: 'Gift', color: '#db2777', icon: Gift },
  other: { label: 'Other', color: '#64748b', icon: HelpCircle },
};

export const EXPENSE_CATEGORIES: Record<ExpenseCategory, CategoryMetadata> = {
  housing: { label: 'Housing', color: '#e11d48', icon: Home },
  groceries: { label: 'Groceries', color: '#16a34a', icon: ShoppingCart },
  dining: { label: 'Dining', color: '#ea580c', icon: Utensils },
  transport: { label: 'Transport', color: '#2563eb', icon: Car },
  utilities: { label: 'Utilities', color: '#0891b2', icon: Zap },
  subscriptions: { label: 'Subscriptions', color: '#9333ea', icon: Repeat },
  health: { label: 'Health', color: '#db2777', icon: HeartPulse },
  education: { label: 'Education', color: '#4f46e5', icon: GraduationCap },
  clothing: { label: 'Clothing', color: '#7c3aed', icon: Shirt },
  entertainment: { label: 'Entertainment', color: '#c026d3', icon: Gamepad2 },
  travel: { label: 'Travel', color: '#0d9488', icon: Plane },
  family: { label: 'Family', color: '#f59e0b', icon: Users },
  personal_care: { label: 'Personal Care', color: '#be185d', icon: Sparkles },
  savings: { label: 'Savings', color: '#059669', icon: PiggyBank },
  misc: { label: 'Misc', color: '#64748b', icon: FolderTree },
};
