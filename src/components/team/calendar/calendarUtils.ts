import { format, isWeekend, getDay } from 'date-fns';
import { Job } from '@/types/job';
import { publicHolidaysService, PublicHoliday } from '@/services/PublicHolidaysService';

export const getJobsForDate = (date: Date, jobs: Job[] = []) => {
  const dateStr = format(date, 'yyyy-MM-dd');
  
  return jobs.filter(job => {
    try {
      const jobDate = new Date(job.date);
      return format(jobDate, 'yyyy-MM-dd') === dateStr;
    } catch (e) {
      console.error('Invalid date in job:', job);
      return false;
    }
  });
};

// Weekend detection
export const isWeekendDate = (date: Date): boolean => {
  return isWeekend(date);
};

export const getDayType = (date: Date): 'weekday' | 'weekend' | 'holiday' => {
  // Check if it's a public holiday first (takes precedence)
  if (publicHolidaysService.isPublicHoliday(date)) {
    return 'holiday';
  }
  
  // Check if it's a weekend
  if (isWeekendDate(date)) {
    return 'weekend';
  }
  
  return 'weekday';
};

export const getPublicHolidayForDate = (date: Date): PublicHoliday | null => {
  return publicHolidaysService.getHolidayForDate(date);
};

// Day of week helpers for new layout
export const isWeekdayDate = (date: Date): boolean => {
  const dayOfWeek = getDay(date); // 0 = Sunday, 6 = Saturday
  return dayOfWeek >= 1 && dayOfWeek <= 5; // Monday to Friday
};

export const isSaturdayDate = (date: Date): boolean => {
  return getDay(date) === 6;
};

export const isSundayDate = (date: Date): boolean => {
  return getDay(date) === 0;
};

// Get weekend days for a given month
export const getWeekendsForMonth = (date: Date): Date[] => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const weekends: Date[] = [];
  
  // Get all days of the month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  for (let day = 1; day <= daysInMonth; day++) {
    const currentDate = new Date(year, month, day);
    if (isWeekendDate(currentDate)) {
      weekends.push(currentDate);
    }
  }
  
  return weekends;
};

// Get weekdays for a given month
export const getWeekdaysForMonth = (date: Date): Date[] => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const weekdays: Date[] = [];
  
  // Get all days of the month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  for (let day = 1; day <= daysInMonth; day++) {
    const currentDate = new Date(year, month, day);
    if (isWeekdayDate(currentDate)) {
      weekdays.push(currentDate);
    }
  }
  
  return weekdays;
};
