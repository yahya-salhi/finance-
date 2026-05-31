import { db as dexieDb } from '../db';
import { supabase } from '../lib/supabase';

export const migrateDexieToSupabase = async () => {
  const results = {
    income: 0,
    expenses: 0,
    portfolio: 0,
    errors: [] as string[],
  };

  try {
    // 1. Migrate Income
    const incomeEntries = await dexieDb.income.toArray();
    if (incomeEntries.length > 0) {
      const { error } = await supabase.from('income').insert(
        incomeEntries.map(e => ({
          amount: e.amount,
          label: e.label,
          category: e.category,
          date: e.date,
          recurrence: e.recurrence,
          notes: e.notes,
          created_at: e.createdAt,
        }))
      );
      if (error) results.errors.push(`Income migration failed: ${error.message}`);
      else results.income = incomeEntries.length;
    }

    // 2. Migrate Expenses
    const expenseEntries = await dexieDb.expenses.toArray();
    if (expenseEntries.length > 0) {
      const { error } = await supabase.from('expenses').insert(
        expenseEntries.map(e => ({
          amount: e.amount,
          label: e.label,
          category: e.category,
          date: e.date,
          recurrence: e.recurrence,
          payment_method: e.paymentMethod,
          notes: e.notes,
          created_at: e.createdAt,
        }))
      );
      if (error) results.errors.push(`Expenses migration failed: ${error.message}`);
      else results.expenses = expenseEntries.length;
    }

    // 3. Migrate Portfolio
    const portfolioEntries = await dexieDb.portfolio.toArray();
    if (portfolioEntries.length > 0) {
      const { error } = await supabase.from('portfolio').insert(
        portfolioEntries.map(e => ({
          ticker: e.ticker,
          company_name: e.companyName,
          shares: e.shares,
          avg_buy_price: e.avgBuyPrice,
          notes: e.notes,
          created_at: e.createdAt,
        }))
      );
      if (error) results.errors.push(`Portfolio migration failed: ${error.message}`);
      else results.portfolio = portfolioEntries.length;
    }

    return results;
  } catch (error: any) {
    console.error('Migration error:', error);
    results.errors.push(error.message);
    return results;
  }
};

export const checkLocalDataExists = async () => {
  const counts = await Promise.all([
    dexieDb.income.count(),
    dexieDb.expenses.count(),
    dexieDb.portfolio.count(),
  ]);
  return counts.some(count => count > 0);
};
