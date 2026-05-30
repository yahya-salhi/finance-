import { GoogleGenerativeAI } from '@google/generative-ai';
import type { IncomeEntry, ExpenseEntry, StockPosition } from '../types';
import { subMonths, isAfter } from 'date-fns';

export function buildFinancialContext(
  income: IncomeEntry[],
  expenses: ExpenseEntry[],
  portfolio: StockPosition[],
  currencySymbol: string
): string {
  const threeMonthsAgo = subMonths(new Date(), 3);
  
  const recentIncome = income.filter(e => isAfter(new Date(e.date), threeMonthsAgo));
  const recentExpenses = expenses.filter(e => isAfter(new Date(e.date), threeMonthsAgo));
  
  const portfolioSummary = portfolio.map(p => ({
    ticker: p.ticker,
    company: p.companyName,
    shares: p.shares,
    value: (p.latestPrice || 0) * p.shares,
    gainLoss: ((p.latestPrice || 0) - (p.avgBuyPrice || 0)) * p.shares
  }));

  const context = {
    summary: {
      totalPortfolioValue: portfolioSummary.reduce((sum, p) => sum + p.value, 0),
      currency: currencySymbol
    },
    recentTransactions: {
      income: recentIncome.map(e => ({ date: e.date, label: e.label, amount: e.amount, category: e.category })),
      expenses: recentExpenses.map(e => ({ date: e.date, label: e.label, amount: e.amount, category: e.category }))
    },
    portfolio: portfolioSummary
  };

  return JSON.stringify(context, null, 2);
}

export async function askGemini(
  userMessage: string,
  financialContext: string,
  apiKey: string,
  currencySymbol: string
): Promise<string> {
  if (!apiKey) throw new Error('Gemini API Key is missing');

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const systemPrompt = `You are a personal finance assistant. 
You have access to the user's financial data below.
Answer questions accurately based only on this data.
Be concise. Use the user's currency symbol (${currencySymbol}) when quoting amounts.
Provide insights on spending habits, portfolio performance, and potential savings if asked.
If you cannot answer from the data, say so clearly.

FINANCIAL DATA:
${financialContext}`;

  try {
    const result = await model.generateContent([systemPrompt, userMessage]);
    return result.response.text();
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    throw new Error(error.message || 'Failed to get response from Gemini');
  }
}
