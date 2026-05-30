import { 
  startOfMonth, 
  endOfMonth, 
  format, 
  addWeeks, 
  addMonths, 
  addYears, 
  parseISO,
  differenceInDays
} from 'date-fns';
import type { Recurrence } from '../types';

/**
 * Returns ISO date strings for the first and last day of the given month.
 */
export function getMonthRange(year: number, month: number): { start: string; end: string } {
  const date = new Date(year, month);
  return {
    start: format(startOfMonth(date), 'yyyy-MM-dd'),
    end: format(endOfMonth(date), 'yyyy-MM-dd'),
  };
}

/**
 * Computes the next occurrence of a recurring entry from its last date.
 * Returns formatted string e.g. "Jun 15" or "in 3 days"
 */
export function getNextBillingDate(lastDate: string, recurrence: Recurrence): string {
  if (recurrence === 'none') return '';

  const last = parseISO(lastDate);
  let next: Date;

  switch (recurrence) {
    case 'weekly':
      next = addWeeks(last, 1);
      break;
    case 'monthly':
      next = addMonths(last, 1);
      break;
    case 'annually':
      next = addYears(last, 1);
      break;
    default:
      return '';
  }

  const today = new Date();
  const daysUntil = differenceInDays(next, today);

  if (daysUntil === 0) return 'Today';
  if (daysUntil === 1) return 'Tomorrow';
  if (daysUntil > 1 && daysUntil <= 7) return `in ${daysUntil} days`;
  
  return format(next, 'MMM d');
}

/**
 * Formats a date string for display.
 */
export function formatDate(dateStr: string): string {
  return format(parseISO(dateStr), 'MMM d, yyyy');
}
