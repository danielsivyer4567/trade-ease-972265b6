import { Database } from '@/integrations/supabase/types';

export type DatabaseWorkflow = Database['public']['Tables']['workflows']['Row'];
export type WorkflowNode = any; // Database['public']['Tables']['workflow_nodes']['Row']
export type WorkflowEdge = any; // Database['public']['Tables']['workflow_edges']['Row']
export type WorkflowExecution = any; // Database['public']['Tables']['workflow_executions']['Row']

export type NodeType = 
  | 'customerNode'
  | 'jobNode'
  | 'taskNode'
  | 'quoteNode'
  | 'customNode'
  | 'visionNode'
  | 'automationNode'
  | 'messagingNode'
  | 'emailNode'
  | 'whatsappNode'
  | 'socialNode';

export interface NodeData {
  label: string;
  description?: string;
  automationId?: number;
  targetType?: 'job' | 'quote' | 'customer' | 'message' | 'social' | 'calendar';
  targetId?: string;
  workflowDarkMode?: boolean;
  [key: string]: any;
}

export interface EdgeData {
  label?: string;
  type?: string;
  [key: string]: any;
}

export interface WorkflowData {
  nodes: Array<{
    id: string;
    type: NodeType;
    position: { x: number; y: number };
    data: NodeData;
  }>;
  edges: Array<{
    id: string;
    source: string;
    target: string;
    data?: EdgeData;
  }>;
}

export interface WorkflowExecutionData {
  status: 'pending' | 'running' | 'completed' | 'failed';
  steps: Array<{
    nodeId: string;
    status: 'pending' | 'running' | 'completed' | 'failed';
    startedAt?: string;
    completedAt?: string;
    error?: string;
    output?: any;
  }>;
  input?: any;
  output?: any;
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  isUserTemplate?: boolean;
  data: {
    nodes: Array<{
      id: string;
      type: string;
      position: {
        x: number;
        y: number;
      };
      data: {
        label: string;
        [key: string]: any;
      };
    }>;
    edges: Array<{
      id: string;
      source: string;
      target: string;
    }>;
  };
}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  category?: string;
  is_template?: boolean;
  data: {
    nodes: Array<{
      id: string;
      type: string;
      position: {
        x: number;
        y: number;
      };
      data: {
        label: string;
        [key: string]: any;
      };
    }>;
    edges: Array<{
      id: string;
      source: string;
      target: string;
    }>;
    created_at?: string;
    updated_at?: string;
  };
}

export interface CreateWorkflowParams {
  name: string;
  description?: string;
  category?: string;
  isTemplate?: boolean;
  data: {
    nodes: Array<{
      id: string;
      type: string;
      position: {
        x: number;
        y: number;
      };
      data: {
        label: string;
        [key: string]: any;
      };
    }>;
    edges: Array<{
      id: string;
      source: string;
      target: string;
    }>;
  };
}

export interface UpdateWorkflowParams {
  id: string;
  name?: string;
  description?: string;
  data?: WorkflowData;
  category?: string;
  isTemplate?: boolean;
}

export interface ExecuteWorkflowParams {
  workflowId: string;
  input?: any;
}

export type LeadSource = 
  | 'social_media'
  | 'email'
  | 'phone_call'
  | 'website'
  | 'whatsapp'
  | 'other';

export type WorkflowStage = 
  | 'incoming_lead'
  | 'lead_response'
  | 'lead_qualification'
  | 'details_extraction'
  | 'calendar_booking'
  | 'progress_portal_sent'
  | 'site_audit_scheduled'
  | 'site_audit_completed'
  | 'quote_created'
  | 'quote_sent'
  | 'quote_signed'
  | 'quote_accepted'
  | 'quote_denied'
  | 'job_created'
  | 'job_scheduled'
  | 'staff_allocated'
  | 'job_started'
  | 'job_in_progress'
  | 'job_completed'
  | 'invoice_sent'
  | 'payment_received'
  | 'quality_control'
  | 'customer_satisfaction'
  | 'review_requested'
  | 'complaint_received'
  | 'complaint_resolved'
  | 'workflow_completed';

export interface WorkflowLead {
  id: string;
  source: LeadSource;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  description: string;
  qualified: boolean | null;
  denialReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowCalendarBooking {
  id: string;
  leadId: string;
  customerFirstName: string;
  requestBrief: string;
  bookingDate: string;
  progressPortalLink?: string;
  createdAt: string;
}

export interface WorkflowSiteAudit {
  id: string;
  leadId: string;
  bookingId: string;
  estimatorId?: string;
  photos: string[];
  notes: string;
  completedAt?: string;
  createdAt: string;
}

export interface WorkflowQuote {
  id: string;
  leadId: string;
  siteAuditId: string;
  pdfUrl?: string;
  amount: number;
  status: 'draft' | 'sent' | 'viewed' | 'signed' | 'accepted' | 'denied';
  textNotificationSent: boolean;
  docusignEnvelopeId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowJob {
  id: string;
  leadId: string;
  quoteId: string;
  jobId: string; // Reference to main job table
  dateBooked?: string;
  staffAllocated: string[];
  contractorsNotified: boolean;
  status: 'scheduled' | 'started' | 'in_progress' | 'completed';
  dailyUpdates: WorkflowJobUpdate[];
  completionPhotos: string[];
  completionNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowJobUpdate {
  id: string;
  jobId: string;
  update: string;
  photos: string[];
  tags: string[];
  createdBy: string;
  createdAt: string;
}

export interface WorkflowInvoice {
  id: string;
  jobId: string;
  amount: number;
  status: 'draft' | 'sent' | 'viewed' | 'paid';
  paymentMethod?: 'card' | 'bank_transfer' | 'cash';
  receiptUrl?: string;
  createdAt: string;
  paidAt?: string;
}

export interface WorkflowQualityControl {
  id: string;
  jobId: string;
  approved: boolean;
  customerSatisfactionSigned: boolean;
  followUpSent: boolean;
  customerFeedback?: 'positive' | 'negative';
  improvementSuggestions?: string;
  googleReviewRequested: boolean;
  socialMediaImages: string[];
  createdAt: string;
}

export interface WorkflowComplaint {
  id: string;
  jobId: string;
  issueDescription: string;
  photos: string[];
  isDefective: boolean | null;
  contractorNotified: boolean;
  rectificationDate?: string;
  rectificationPhotos: string[];
  resolved: boolean;
  qbccLodged: boolean;
  createdAt: string;
  resolvedAt?: string;
}

export interface WorkflowState {
  id: string;
  leadId: string;
  currentStage: WorkflowStage;
  stages: {
    stage: WorkflowStage;
    completedAt?: string;
    completedBy?: string;
    notes?: string;
  }[];
  lead?: WorkflowLead;
  calendarBooking?: WorkflowCalendarBooking;
  siteAudit?: WorkflowSiteAudit;
  quote?: WorkflowQuote;
  job?: WorkflowJob;
  invoice?: WorkflowInvoice;
  qualityControl?: WorkflowQualityControl;
  complaint?: WorkflowComplaint;
  createdAt: string;
  updatedAt: string;
} 