
import { format, parseISO } from 'date-fns';

export const formatDate = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    return format(date, 'MMM d, yyyy');
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

export const formatMonthYear = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    return format(date, 'MMM yyyy');
  } catch (error) {
    console.error('Error formatting month/year:', error);
    return dateString;
  }
};
