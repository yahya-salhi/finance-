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
    const url = `${BASE}?function=TIME_SERIES_DAILY&symbol=${ticker}&apikey=${apiKey}&outputsize=compact`;
    const res = await fetch(url);
    const data = await res.json();

    // Check for Alpha Vantage error/limit messages
    if (data['Note']) {
      console.warn('Alpha Vantage API limit reached');
      return null;
    }

    if (data['Error Message']) {
      console.error(`Error fetching price for ${ticker}:`, data['Error Message']);
      return null;
    }

    const series = data['Time Series (Daily)'];
    if (!series) return null;

    const latestDate = Object.keys(series)[0];
    const price = parseFloat(series[latestDate]['4. close']);
    
    return { price, date: latestDate };
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
