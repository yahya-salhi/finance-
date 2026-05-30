import Dexie from 'dexie';
import type { Table } from 'dexie';
import type { IncomeEntry, ExpenseEntry, StockPosition } from '../types';

class FinanceDB extends Dexie {
  income!: Table<IncomeEntry>;
  expenses!: Table<ExpenseEntry>;
  portfolio!: Table<StockPosition>;

  constructor() {
    super('FinanceTrackerDB');
    this.version(1).stores({
      income:    '++id, date, category, recurrence',
      expenses:  '++id, date, category, recurrence',
      portfolio: '++id, ticker',
    });
  }
}

export const db = new FinanceDB();
