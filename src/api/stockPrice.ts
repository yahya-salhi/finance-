const BASE = 'https://www.alphavantage.co/query';

export interface StockPriceResult {
  price: number;
  date: string;
}

export async function fetchEODPrice(
  ticker: string,
  apiKey: string
): Promise<StockPriceResult | null> {
  if (!apiKey) return null;

  try {
    const url = `${BASE}?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data['Note']) {
      console.warn('Alpha Vantage API limit reached (5 calls/min, 25/day)');
      return null;
    }

    const quote = data['Global Quote'];
    if (!quote || !quote['05. price']) {
      console.error(`No price data found for ${ticker}`, data);
      return null;
    }

    return { 
      price: parseFloat(quote['05. price']), 
      date: quote['07. latest trading day'] || new Date().toISOString().split('T')[0]
    };
  } catch (error) {
    console.error(`Failed to fetch price for ${ticker}:`, error);
    return null;
  }
}

export async function searchSymbol(
  query: string,
  apiKey: string
): Promise<{ ticker: string; name: string }[]> {
  if (!apiKey || !query) return [];

  try {
    const url = `${BASE}?function=SYMBOL_SEARCH&keywords=${query}&apikey=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data['Note'] || !data['bestMatches']) return [];

    return data['bestMatches'].map((match: any) => ({
      ticker: match['1. symbol'],
      name: match['2. name'],
    }));
  } catch (error) {
    console.error('Failed to search symbol:', error);
    return [];
  }
}
