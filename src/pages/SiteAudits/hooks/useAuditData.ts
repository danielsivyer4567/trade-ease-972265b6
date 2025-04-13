
import { useState, useEffect, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { initialAudits, initialCustomers } from '../data/mockData';
import { organizeAuditsByDay, getWeekStartDate, goToPreviousWeek as prevWeek, goToNextWeek as nextWeek } from '../utils/dateUtils';
import { useAuditPhotos } from './useAuditPhotos';
import { useAuditOperations } from './useAuditOperations';
import { UseAuditsReturn } from './types';

export const useAuditData = (): UseAuditsReturn => {
  const [audits, setAudits] = useState(initialAudits);
  const [customers, setCustomers] = useState(initialCustomers);
  const [isLoading, setIsLoading] = useState(false);
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(getWeekStartDate());
  
  // Navigate to previous week
  const goToPreviousWeek = () => {
    setCurrentWeekStart(prevDate => prevWeek(prevDate));
  };

  // Navigate to next week
  const goToNextWeek = () => {
    setCurrentWeekStart(prevDate => nextWeek(prevDate));
  };

  // Import audit photo functionality
  const { uploadAuditPhoto } = useAuditPhotos(audits, setAudits, setIsLoading);
  
  // Import audit operations functionality
  const { createNewAudit } = useAuditOperations(audits, setAudits, customers, setIsLoading);

  // Organize audits by day for the current week
  const auditsByDay = useMemo(() => {
    return organizeAuditsByDay(audits, currentWeekStart);
  }, [audits, currentWeekStart]);

  // Simulate loading data
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [currentWeekStart]);

  return {
    audits,
    customers,
    isLoading,
    uploadAuditPhoto,
    createNewAudit,
    auditsByDay,
    currentWeekStart,
    goToPreviousWeek,
    goToNextWeek
  };
};
