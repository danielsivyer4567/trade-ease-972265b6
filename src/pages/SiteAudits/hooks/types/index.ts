
import { Customer, Audit, AuditsByDay } from '../../types/auditTypes';

export interface UseAuditsReturn {
  audits: Audit[];
  customers: Customer[];
  isLoading: boolean;
  uploadAuditPhoto: (customerId: string, file: File) => Promise<void>;
  createNewAudit: (customerId: string) => void;
  auditsByDay: AuditsByDay[];
  currentWeekStart: Date;
  goToPreviousWeek: () => void;
  goToNextWeek: () => void;
}
