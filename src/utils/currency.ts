/**
 * Formats a number as a currency string.
 * Example: formatCurrency(1234.5, '$') -> '$1,234.50'
 */
export function formatCurrency(amount: number, symbol: string): string {
  const formatted = amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  
  // Add a space if the symbol is more than one character (e.g. 'DT 10.00')
  const spacing = symbol.length > 1 ? ' ' : '';
  return `${symbol}${spacing}${formatted}`;
}
