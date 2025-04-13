
import { format, startOfWeek, addDays, subWeeks, addWeeks, parseISO, isSameDay } from 'date-fns';
import { Audit, AuditsByDay } from '../types/auditTypes';

export const getWeekStartDate = (): Date => {
  return startOfWeek(new Date(), { weekStartsOn: 1 }); // Monday as week start
};

export const goToPreviousWeek = (currentWeekStart: Date): Date => {
  return subWeeks(currentWeekStart, 1);
};

export const goToNextWeek = (currentWeekStart: Date): Date => {
  return addWeeks(currentWeekStart, 1);
};

export const organizeAuditsByDay = (audits: Audit[], currentWeekStart: Date): AuditsByDay[] => {
  const result: AuditsByDay[] = [];
  
  // Create 5 days (Monday to Friday)
  for (let i = 0; i < 5; i++) {
    const day = addDays(currentWeekStart, i);
    const dayName = format(day, 'EEEE');
    const formattedDate = format(day, 'MMM d');
    
    // Filter audits for this specific day
    const dayAudits = (audits || []).filter(audit => {
      const auditDate = parseISO(audit.startDate);
      return isSameDay(auditDate, day);
    });
    
    // Sort audits by their ID (assuming higher ID means more recent)
    const sortedAudits = [...dayAudits].sort((a, b) => a.id.localeCompare(b.id));
    
    result.push({
      date: day,
      dayName,
      formattedDate,
      audits: sortedAudits
    });
  }
  
  return result;
};
