// Database Types for Trade Ease Application

// Common Types
export type Status = 'active' | 'inactive' | 'pending' | 'completed' | 'cancelled' | 'draft' | 'sent' | 'paid' | 'overdue' | 'approved' | 'rejected' | 'in_progress';
export type DocumentStatus = 'draft' | 'pending' | 'approved' | 'submitted';

// Base Interface for Common Fields
interface BaseEntity {
  id: string;
  created_at: string;
  updated_at?: string;
}

// Customer Related Types
export interface CustomerProfile extends BaseEntity {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  status: Status;
  user_id: string;
  company_name?: string;
  notes?: string;
  tags?: string[];
}

// Site Audit Related Types
export interface SiteAudit extends BaseEntity {
  customer_id: string;
  title: string;
  date: string;
  status: Status;
  notes?: string;
  location?: string;
  assigned_to?: string[];
  photos?: SiteAuditPhoto[];
}

export interface SiteAuditPhoto extends BaseEntity {
  audit_id: string;
  customer_id: string;
  photo_url: string;
  caption?: string;
  tags?: string[];
}

// Quote Related Types
export interface Quote extends BaseEntity {
  customer_id: string;
  title: string;
  amount: number;
  status: Status;
  expiry_date?: string;
  job_id?: string;
  audit_id?: string;
  items?: QuoteItem[];
  notes?: string;
  terms?: string;
}

export interface QuoteItem extends BaseEntity {
  quote_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
  category?: string;
  notes?: string;
}

// Job Related Types
export interface Job extends BaseEntity {
  customer_id: string;
  quote_id?: string;
  title: string;
  description?: string;
  status: Status;
  start_date?: string;
  end_date?: string;
  assigned_to?: string[];
  location?: string;
  priority?: 'low' | 'medium' | 'high';
  estimated_hours?: number;
  actual_hours?: number;
  materials?: JobMaterial[];
  tasks?: JobTask[];
}

export interface JobMaterial extends BaseEntity {
  job_id: string;
  name: string;
  quantity: number;
  unit: string;
  cost: number;
  supplier?: string;
  status: Status;
}

export interface JobTask extends BaseEntity {
  job_id: string;
  title: string;
  description?: string;
  status: Status;
  assigned_to?: string;
  due_date?: string;
  completed_at?: string;
}

// Invoice Related Types
export interface Invoice extends BaseEntity {
  customer_id: string;
  job_id?: string;
  quote_id?: string;
  amount: number;
  status: Status;
  due_date: string;
  payment_date?: string;
  items?: InvoiceItem[];
  notes?: string;
  terms?: string;
  payment_method?: string;
  reference_number?: string;
}

export interface InvoiceItem extends BaseEntity {
  invoice_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
  category?: string;
}

// Expense Related Types
export interface Expense extends BaseEntity {
  date: string;
  vendor: string;
  category: string;
  amount: number;
  status: Status;
  description?: string;
  receipt?: string;
  submittedBy?: string;
  approvedBy?: string;
  rejectedBy?: string;
  notes?: string;
  tags?: string[];
  job_id?: string;
}

export interface ExpenseCategory extends BaseEntity {
  name: string;
  description?: string;
  color?: string;
  budgetLimit?: number;
  isActive: boolean;
  icon?: string;
  budget?: number;
}

// Team Related Types
export interface Team extends BaseEntity {
  name: string;
  description?: string;
  members: TeamMember[];
  leader_id: string;
  isActive: boolean;
}

export interface TeamMember extends BaseEntity {
  team_id: string;
  user_id: string;
  role: 'leader' | 'member';
  permissions: string[];
  isActive: boolean;
}

// Property Related Types
export interface Property extends BaseEntity {
  customer_id: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  type: 'residential' | 'commercial' | 'industrial';
  status: Status;
  squareFootage?: number;
  yearBuilt?: number;
  notes?: string;
  boundaries?: PropertyBoundary[];
}

export interface PropertyBoundary extends BaseEntity {
  property_id: string;
  geometry: {
    type: string;
    coordinates: number[][];
  };
  area: number;
  description?: string;
}

// Integration Related Types
export interface Integration extends BaseEntity {
  name: string;
  type: string;
  status: Status;
  config: Record<string, any>;
  user_id: string;
  last_sync?: string;
  isActive: boolean;
}

// Notification Related Types
export interface Notification extends BaseEntity {
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  read: boolean;
  link?: string;
  priority: 'low' | 'medium' | 'high';
}

// Document Related Types
export interface Document extends BaseEntity {
  title: string;
  type: string;
  status: DocumentStatus;
  file_url: string;
  file_type: string;
  file_size: number;
  uploaded_by: string;
  related_to?: {
    type: 'job' | 'quote' | 'invoice' | 'customer';
    id: string;
  };
  tags?: string[];
  metadata?: Record<string, any>;
} 