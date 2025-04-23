// Database Operation Types for Trade Ease Application

import { 
  CustomerProfile, 
  SiteAudit, 
  SiteAuditPhoto, 
  Quote, 
  QuoteItem, 
  Job, 
  JobMaterial, 
  JobTask, 
  Invoice, 
  InvoiceItem, 
  Expense, 
  ExpenseCategory, 
  Team, 
  TeamMember, 
  Property, 
  PropertyBoundary, 
  Integration, 
  Notification, 
  Document 
} from './database';

// Common operation types
export type SortDirection = 'asc' | 'desc';

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDirection?: SortDirection;
}

export interface FilterParams {
  [key: string]: string | number | boolean | null | undefined;
}

export interface QueryResult<T> {
  data: T | null;
  error: Error | null;
  count?: number;
}

// Supabase specific types
export interface SupabaseQueryOptions {
  select?: string;
  eq?: Record<string, any>;
  neq?: Record<string, any>;
  gt?: Record<string, any>;
  gte?: Record<string, any>;
  lt?: Record<string, any>;
  lte?: Record<string, any>;
  like?: Record<string, any>;
  ilike?: Record<string, any>;
  in?: Record<string, any[]>;
  is?: Record<string, any>;
  order?: { column: string; ascending: boolean };
  limit?: number;
  offset?: number;
}

// Customer Operations
export interface CustomerOperations {
  getCustomer: (id: string) => Promise<QueryResult<CustomerProfile>>;
  getCustomers: (options?: PaginationParams & { filters?: FilterParams }) => Promise<QueryResult<CustomerProfile[]>>;
  createCustomer: (customer: Omit<CustomerProfile, 'id' | 'created_at' | 'updated_at'>) => Promise<QueryResult<CustomerProfile>>;
  updateCustomer: (id: string, customer: Partial<CustomerProfile>) => Promise<QueryResult<CustomerProfile>>;
  deleteCustomer: (id: string) => Promise<QueryResult<boolean>>;
  searchCustomers: (query: string, options?: PaginationParams) => Promise<QueryResult<CustomerProfile[]>>;
}

// Site Audit Operations
export interface SiteAuditOperations {
  getAudit: (id: string) => Promise<QueryResult<SiteAudit>>;
  getAudits: (options?: PaginationParams & { filters?: FilterParams }) => Promise<QueryResult<SiteAudit[]>>;
  getCustomerAudits: (customerId: string, options?: PaginationParams) => Promise<QueryResult<SiteAudit[]>>;
  createAudit: (audit: Omit<SiteAudit, 'id' | 'created_at' | 'updated_at'>) => Promise<QueryResult<SiteAudit>>;
  updateAudit: (id: string, audit: Partial<SiteAudit>) => Promise<QueryResult<SiteAudit>>;
  deleteAudit: (id: string) => Promise<QueryResult<boolean>>;
  
  // Photo operations
  getAuditPhotos: (auditId: string) => Promise<QueryResult<SiteAuditPhoto[]>>;
  addAuditPhoto: (photo: Omit<SiteAuditPhoto, 'id' | 'created_at' | 'updated_at'>) => Promise<QueryResult<SiteAuditPhoto>>;
  deleteAuditPhoto: (id: string) => Promise<QueryResult<boolean>>;
}

// Quote Operations
export interface QuoteOperations {
  getQuote: (id: string) => Promise<QueryResult<Quote>>;
  getQuotes: (options?: PaginationParams & { filters?: FilterParams }) => Promise<QueryResult<Quote[]>>;
  getCustomerQuotes: (customerId: string, options?: PaginationParams) => Promise<QueryResult<Quote[]>>;
  createQuote: (quote: Omit<Quote, 'id' | 'created_at' | 'updated_at'>) => Promise<QueryResult<Quote>>;
  updateQuote: (id: string, quote: Partial<Quote>) => Promise<QueryResult<Quote>>;
  deleteQuote: (id: string) => Promise<QueryResult<boolean>>;
  approveQuote: (id: string) => Promise<QueryResult<Quote>>;
  rejectQuote: (id: string, reason?: string) => Promise<QueryResult<Quote>>;
  
  // Quote item operations
  getQuoteItems: (quoteId: string) => Promise<QueryResult<QuoteItem[]>>;
  addQuoteItem: (item: Omit<QuoteItem, 'id' | 'created_at' | 'updated_at'>) => Promise<QueryResult<QuoteItem>>;
  updateQuoteItem: (id: string, item: Partial<QuoteItem>) => Promise<QueryResult<QuoteItem>>;
  deleteQuoteItem: (id: string) => Promise<QueryResult<boolean>>;
}

// Job Operations
export interface JobOperations {
  getJob: (id: string) => Promise<QueryResult<Job>>;
  getJobs: (options?: PaginationParams & { filters?: FilterParams }) => Promise<QueryResult<Job[]>>;
  getCustomerJobs: (customerId: string, options?: PaginationParams) => Promise<QueryResult<Job[]>>;
  createJob: (job: Omit<Job, 'id' | 'created_at' | 'updated_at'>) => Promise<QueryResult<Job>>;
  updateJob: (id: string, job: Partial<Job>) => Promise<QueryResult<Job>>;
  deleteJob: (id: string) => Promise<QueryResult<boolean>>;
  startJob: (id: string) => Promise<QueryResult<Job>>;
  completeJob: (id: string) => Promise<QueryResult<Job>>;
  cancelJob: (id: string, reason?: string) => Promise<QueryResult<Job>>;
  
  // Job material operations
  getJobMaterials: (jobId: string) => Promise<QueryResult<JobMaterial[]>>;
  addJobMaterial: (material: Omit<JobMaterial, 'id' | 'created_at' | 'updated_at'>) => Promise<QueryResult<JobMaterial>>;
  updateJobMaterial: (id: string, material: Partial<JobMaterial>) => Promise<QueryResult<JobMaterial>>;
  deleteJobMaterial: (id: string) => Promise<QueryResult<boolean>>;
  
  // Job task operations
  getJobTasks: (jobId: string) => Promise<QueryResult<JobTask[]>>;
  addJobTask: (task: Omit<JobTask, 'id' | 'created_at' | 'updated_at'>) => Promise<QueryResult<JobTask>>;
  updateJobTask: (id: string, task: Partial<JobTask>) => Promise<QueryResult<JobTask>>;
  deleteJobTask: (id: string) => Promise<QueryResult<boolean>>;
  completeJobTask: (id: string) => Promise<QueryResult<JobTask>>;
}

// Invoice Operations
export interface InvoiceOperations {
  getInvoice: (id: string) => Promise<QueryResult<Invoice>>;
  getInvoices: (options?: PaginationParams & { filters?: FilterParams }) => Promise<QueryResult<Invoice[]>>;
  getCustomerInvoices: (customerId: string, options?: PaginationParams) => Promise<QueryResult<Invoice[]>>;
  createInvoice: (invoice: Omit<Invoice, 'id' | 'created_at' | 'updated_at'>) => Promise<QueryResult<Invoice>>;
  updateInvoice: (id: string, invoice: Partial<Invoice>) => Promise<QueryResult<Invoice>>;
  deleteInvoice: (id: string) => Promise<QueryResult<boolean>>;
  sendInvoice: (id: string) => Promise<QueryResult<Invoice>>;
  markInvoiceAsPaid: (id: string, paymentDate: string, paymentMethod: string) => Promise<QueryResult<Invoice>>;
  
  // Invoice item operations
  getInvoiceItems: (invoiceId: string) => Promise<QueryResult<InvoiceItem[]>>;
  addInvoiceItem: (item: Omit<InvoiceItem, 'id' | 'created_at' | 'updated_at'>) => Promise<QueryResult<InvoiceItem>>;
  updateInvoiceItem: (id: string, item: Partial<InvoiceItem>) => Promise<QueryResult<InvoiceItem>>;
  deleteInvoiceItem: (id: string) => Promise<QueryResult<boolean>>;
}

// Expense Operations
export interface ExpenseOperations {
  getExpense: (id: string) => Promise<QueryResult<Expense>>;
  getExpenses: (options?: PaginationParams & { filters?: FilterParams }) => Promise<QueryResult<Expense[]>>;
  getJobExpenses: (jobId: string, options?: PaginationParams) => Promise<QueryResult<Expense[]>>;
  createExpense: (expense: Omit<Expense, 'id' | 'created_at' | 'updated_at'>) => Promise<QueryResult<Expense>>;
  updateExpense: (id: string, expense: Partial<Expense>) => Promise<QueryResult<Expense>>;
  deleteExpense: (id: string) => Promise<QueryResult<boolean>>;
  approveExpense: (id: string, approvedBy: string) => Promise<QueryResult<Expense>>;
  rejectExpense: (id: string, rejectedBy: string, reason?: string) => Promise<QueryResult<Expense>>;
  
  // Expense category operations
  getExpenseCategories: () => Promise<QueryResult<ExpenseCategory[]>>;
  createExpenseCategory: (category: Omit<ExpenseCategory, 'id' | 'created_at' | 'updated_at'>) => Promise<QueryResult<ExpenseCategory>>;
  updateExpenseCategory: (id: string, category: Partial<ExpenseCategory>) => Promise<QueryResult<ExpenseCategory>>;
  deleteExpenseCategory: (id: string) => Promise<QueryResult<boolean>>;
}

// Team Operations
export interface TeamOperations {
  getTeam: (id: string) => Promise<QueryResult<Team>>;
  getTeams: (options?: PaginationParams & { filters?: FilterParams }) => Promise<QueryResult<Team[]>>;
  createTeam: (team: Omit<Team, 'id' | 'created_at' | 'updated_at'>) => Promise<QueryResult<Team>>;
  updateTeam: (id: string, team: Partial<Team>) => Promise<QueryResult<Team>>;
  deleteTeam: (id: string) => Promise<QueryResult<boolean>>;
  
  // Team member operations
  getTeamMembers: (teamId: string) => Promise<QueryResult<TeamMember[]>>;
  addTeamMember: (member: Omit<TeamMember, 'id' | 'created_at' | 'updated_at'>) => Promise<QueryResult<TeamMember>>;
  updateTeamMember: (id: string, member: Partial<TeamMember>) => Promise<QueryResult<TeamMember>>;
  removeTeamMember: (id: string) => Promise<QueryResult<boolean>>;
}

// Property Operations
export interface PropertyOperations {
  getProperty: (id: string) => Promise<QueryResult<Property>>;
  getProperties: (options?: PaginationParams & { filters?: FilterParams }) => Promise<QueryResult<Property[]>>;
  getCustomerProperties: (customerId: string, options?: PaginationParams) => Promise<QueryResult<Property[]>>;
  createProperty: (property: Omit<Property, 'id' | 'created_at' | 'updated_at'>) => Promise<QueryResult<Property>>;
  updateProperty: (id: string, property: Partial<Property>) => Promise<QueryResult<Property>>;
  deleteProperty: (id: string) => Promise<QueryResult<boolean>>;
  
  // Property boundary operations
  getPropertyBoundaries: (propertyId: string) => Promise<QueryResult<PropertyBoundary[]>>;
  addPropertyBoundary: (boundary: Omit<PropertyBoundary, 'id' | 'created_at' | 'updated_at'>) => Promise<QueryResult<PropertyBoundary>>;
  updatePropertyBoundary: (id: string, boundary: Partial<PropertyBoundary>) => Promise<QueryResult<PropertyBoundary>>;
  deletePropertyBoundary: (id: string) => Promise<QueryResult<boolean>>;
}

// Integration Operations
export interface IntegrationOperations {
  getIntegration: (id: string) => Promise<QueryResult<Integration>>;
  getIntegrations: (options?: PaginationParams & { filters?: FilterParams }) => Promise<QueryResult<Integration[]>>;
  getUserIntegrations: (userId: string) => Promise<QueryResult<Integration[]>>;
  createIntegration: (integration: Omit<Integration, 'id' | 'created_at' | 'updated_at'>) => Promise<QueryResult<Integration>>;
  updateIntegration: (id: string, integration: Partial<Integration>) => Promise<QueryResult<Integration>>;
  deleteIntegration: (id: string) => Promise<QueryResult<boolean>>;
  syncIntegration: (id: string) => Promise<QueryResult<Integration>>;
}

// Notification Operations
export interface NotificationOperations {
  getNotification: (id: string) => Promise<QueryResult<Notification>>;
  getNotifications: (options?: PaginationParams & { filters?: FilterParams }) => Promise<QueryResult<Notification[]>>;
  getUserNotifications: (userId: string, options?: PaginationParams) => Promise<QueryResult<Notification[]>>;
  createNotification: (notification: Omit<Notification, 'id' | 'created_at' | 'updated_at'>) => Promise<QueryResult<Notification>>;
  updateNotification: (id: string, notification: Partial<Notification>) => Promise<QueryResult<Notification>>;
  deleteNotification: (id: string) => Promise<QueryResult<boolean>>;
  markAsRead: (id: string) => Promise<QueryResult<Notification>>;
  markAllAsRead: (userId: string) => Promise<QueryResult<boolean>>;
}

// Document Operations
export interface DocumentOperations {
  getDocument: (id: string) => Promise<QueryResult<Document>>;
  getDocuments: (options?: PaginationParams & { filters?: FilterParams }) => Promise<QueryResult<Document[]>>;
  getRelatedDocuments: (relatedType: string, relatedId: string) => Promise<QueryResult<Document[]>>;
  createDocument: (document: Omit<Document, 'id' | 'created_at' | 'updated_at'>) => Promise<QueryResult<Document>>;
  updateDocument: (id: string, document: Partial<Document>) => Promise<QueryResult<Document>>;
  deleteDocument: (id: string) => Promise<QueryResult<boolean>>;
  approveDocument: (id: string) => Promise<QueryResult<Document>>;
  rejectDocument: (id: string, reason?: string) => Promise<QueryResult<Document>>;
}

// Combined Database Operations Interface
export interface DatabaseOperations extends 
  CustomerOperations, 
  SiteAuditOperations, 
  QuoteOperations, 
  JobOperations, 
  InvoiceOperations, 
  ExpenseOperations, 
  TeamOperations, 
  PropertyOperations, 
  IntegrationOperations, 
  NotificationOperations, 
  DocumentOperations {
  // Add any additional operations that span multiple entities
  searchAll: (query: string, options?: PaginationParams) => Promise<QueryResult<{
    customers?: CustomerProfile[];
    jobs?: Job[];
    quotes?: Quote[];
    invoices?: Invoice[];
    properties?: Property[];
  }>>;
  
  // Transaction operations
  beginTransaction: () => Promise<string>;
  commitTransaction: (transactionId: string) => Promise<boolean>;
  rollbackTransaction: (transactionId: string) => Promise<boolean>;
} 