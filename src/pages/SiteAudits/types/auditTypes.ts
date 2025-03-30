
export interface Photo {
  id: string;
  url: string;
  name: string;
  uploadedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface Audit {
  id: string;
  title: string;
  customerId: string;
  location: string;
  startDate: string;
  status: 'scheduled' | 'in_progress' | 'completed';
  assignedTo: string;
  completedItems: number;
  totalItems: number;
  photos: Photo[];
}

export interface AuditsByDay {
  date: Date;
  formattedDate: string;
  dayName: string;
  audits: Audit[];
}
