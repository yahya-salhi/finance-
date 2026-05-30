/**
 * Formats a number as a currency string.
 * Example: formatCurrency(1234.5, '$') -> '$1,234.50'
 */
export function formatCurrency(amount: number, symbol: string): string {
  const formatted = amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  
  // Handle cases where the symbol might be placed after the amount in some locales,
  // but the spec suggests symbol + amount.
  return `${symbol}${formatted}`;
}
