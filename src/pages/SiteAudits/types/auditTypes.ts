
export interface Customer {
  id: string;
  name: string;
  email: string;
}

export interface AuditPhoto {
  id: string;
  url: string;
  uploadedAt: string;
  caption: string;
}

export interface Audit {
  id: string;
  customerId: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string | null;
  status: 'scheduled' | 'in_progress' | 'completed';
  completedItems: number;
  totalItems: number;
  assignedTo: string;
  photos: AuditPhoto[];
}
