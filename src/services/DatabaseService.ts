import { supabase } from '@/integrations/supabase/client';
import { 
  DatabaseOperations, 
  QueryResult, 
  PaginationParams, 
  FilterParams
} from '@/types/database-operations';
import { 
  CustomerProfile, 
  SiteAudit, 
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
} from '@/types/database';

// Helper function to convert Supabase response to QueryResult
const toQueryResult = <T>(data: T | null, error: any, count?: number): QueryResult<T> => {
  return {
    data,
    error: error ? new Error(error.message || 'Unknown error') : null,
    count
  };
};

// Implementation of the DatabaseOperations interface
export class DatabaseService implements Partial<DatabaseOperations> {
  // Customer Operations
  async getCustomer(id: string): Promise<QueryResult<CustomerProfile>> {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', id)
      .single();
    
    return toQueryResult(data, error);
  }
  
  async getCustomers(options?: PaginationParams & { filters?: FilterParams }): Promise<QueryResult<CustomerProfile[]>> {
    let query = supabase.from('customers').select('*', { count: 'exact' });
    
    // Apply filters
    if (options?.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });
    }
    
    // Apply sorting
    if (options?.sortBy) {
      query = query.order(options.sortBy, { ascending: options.sortDirection !== 'desc' });
    }
    
    // Apply pagination
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    
    if (options?.page && options?.limit) {
      query = query.range((options.page - 1) * options.limit, options.page * options.limit - 1);
    }
    
    const { data, error, count } = await query;
    return toQueryResult(data, error, count || undefined);
  }
  
  async createCustomer(customer: Omit<CustomerProfile, 'id' | 'created_at' | 'updated_at'>): Promise<QueryResult<CustomerProfile>> {
    const { data, error } = await supabase
      .from('customers')
      .insert(customer)
      .select()
      .single();
    
    return toQueryResult(data, error);
  }
  
  async updateCustomer(id: string, customer: Partial<CustomerProfile>): Promise<QueryResult<CustomerProfile>> {
    const { data, error } = await supabase
      .from('customers')
      .update(customer)
      .eq('id', id)
      .select()
      .single();
    
    return toQueryResult(data, error);
  }
  
  async deleteCustomer(id: string): Promise<QueryResult<boolean>> {
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id);
    
    return toQueryResult(!error, error);
  }
  
  async searchCustomers(query: string, options?: PaginationParams): Promise<QueryResult<CustomerProfile[]>> {
    let supabaseQuery = supabase
      .from('customers')
      .select('*', { count: 'exact' })
      .or(`name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%`);
    
    // Apply sorting
    if (options?.sortBy) {
      supabaseQuery = supabaseQuery.order(options.sortBy, { ascending: options.sortDirection !== 'desc' });
    }
    
    // Apply pagination
    if (options?.limit) {
      supabaseQuery = supabaseQuery.limit(options.limit);
    }
    
    if (options?.page && options?.limit) {
      supabaseQuery = supabaseQuery.range((options.page - 1) * options.limit, options.page * options.limit - 1);
    }
    
    const { data, error, count } = await supabaseQuery;
    return toQueryResult(data, error, count || undefined);
  }
  
  // Site Audit Operations
  async getAudit(id: string): Promise<QueryResult<SiteAudit>> {
    const { data, error } = await supabase
      .from('site_audits')
      .select('*')
      .eq('id', id)
      .single();
    
    return toQueryResult(data, error);
  }
  
  async getAudits(options?: PaginationParams & { filters?: FilterParams }): Promise<QueryResult<SiteAudit[]>> {
    let query = supabase.from('site_audits').select('*', { count: 'exact' });
    
    // Apply filters
    if (options?.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });
    }
    
    // Apply sorting
    if (options?.sortBy) {
      query = query.order(options.sortBy, { ascending: options.sortDirection !== 'desc' });
    }
    
    // Apply pagination
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    
    if (options?.page && options?.limit) {
      query = query.range((options.page - 1) * options.limit, options.page * options.limit - 1);
    }
    
    const { data, error, count } = await query;
    return toQueryResult(data, error, count || undefined);
  }
  
  async getCustomerAudits(customerId: string, options?: PaginationParams): Promise<QueryResult<SiteAudit[]>> {
    const { data, error, count } = await supabase
      .from('site_audits')
      .select('*', { count: 'exact' })
      .eq('customer_id', customerId)
      .order(options?.sortBy || 'created_at', { ascending: options?.sortDirection !== 'desc' })
      .range(
        options?.page && options?.limit ? (options.page - 1) * options.limit : 0,
        options?.page && options?.limit ? options.page * options.limit - 1 : 9
      );
    
    return toQueryResult(data, error, count || undefined);
  }
  
  async createAudit(audit: Omit<SiteAudit, 'id' | 'created_at' | 'updated_at'>): Promise<QueryResult<SiteAudit>> {
    const { data, error } = await supabase
      .from('site_audits')
      .insert(audit)
      .select()
      .single();
    
    return toQueryResult(data, error);
  }
  
  async updateAudit(id: string, audit: Partial<SiteAudit>): Promise<QueryResult<SiteAudit>> {
    const { data, error } = await supabase
      .from('site_audits')
      .update(audit)
      .eq('id', id)
      .select()
      .single();
    
    return toQueryResult(data, error);
  }
  
  async deleteAudit(id: string): Promise<QueryResult<boolean>> {
    const { error } = await supabase
      .from('site_audits')
      .delete()
      .eq('id', id);
    
    return toQueryResult(!error, error);
  }
  
  // Quote Operations
  async getQuote(id: string): Promise<QueryResult<Quote>> {
    const { data, error } = await supabase
      .from('quotes')
      .select('*')
      .eq('id', id)
      .single();
    
    return toQueryResult(data, error);
  }
  
  async getQuotes(options?: PaginationParams & { filters?: FilterParams }): Promise<QueryResult<Quote[]>> {
    let query = supabase.from('quotes').select('*', { count: 'exact' });
    
    // Apply filters
    if (options?.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });
    }
    
    // Apply sorting
    if (options?.sortBy) {
      query = query.order(options.sortBy, { ascending: options.sortDirection !== 'desc' });
    }
    
    // Apply pagination
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    
    if (options?.page && options?.limit) {
      query = query.range((options.page - 1) * options.limit, options.page * options.limit - 1);
    }
    
    const { data, error, count } = await query;
    return toQueryResult(data, error, count || undefined);
  }
  
  async getCustomerQuotes(customerId: string, options?: PaginationParams): Promise<QueryResult<Quote[]>> {
    const { data, error, count } = await supabase
      .from('quotes')
      .select('*', { count: 'exact' })
      .eq('customer_id', customerId)
      .order(options?.sortBy || 'created_at', { ascending: options?.sortDirection !== 'desc' })
      .range(
        options?.page && options?.limit ? (options.page - 1) * options.limit : 0,
        options?.page && options?.limit ? options.page * options.limit - 1 : 9
      );
    
    return toQueryResult(data, error, count || undefined);
  }
  
  async createQuote(quote: Omit<Quote, 'id' | 'created_at' | 'updated_at'>): Promise<QueryResult<Quote>> {
    const { data, error } = await supabase
      .from('quotes')
      .insert(quote)
      .select()
      .single();
    
    return toQueryResult(data, error);
  }
  
  async updateQuote(id: string, quote: Partial<Quote>): Promise<QueryResult<Quote>> {
    const { data, error } = await supabase
      .from('quotes')
      .update(quote)
      .eq('id', id)
      .select()
      .single();
    
    return toQueryResult(data, error);
  }
  
  async deleteQuote(id: string): Promise<QueryResult<boolean>> {
    const { error } = await supabase
      .from('quotes')
      .delete()
      .eq('id', id);
    
    return toQueryResult(!error, error);
  }
  
  async approveQuote(id: string): Promise<QueryResult<Quote>> {
    const { data, error } = await supabase
      .from('quotes')
      .update({ status: 'approved' })
      .eq('id', id)
      .select()
      .single();
    
    return toQueryResult(data, error);
  }
  
  async rejectQuote(id: string, reason?: string): Promise<QueryResult<Quote>> {
    const { data, error } = await supabase
      .from('quotes')
      .update({ 
        status: 'rejected',
        notes: reason ? `Rejected: ${reason}` : 'Rejected'
      })
      .eq('id', id)
      .select()
      .single();
    
    return toQueryResult(data, error);
  }
  
  // Quote Item Operations
  async getQuoteItems(quoteId: string): Promise<QueryResult<QuoteItem[]>> {
    const { data, error } = await supabase
      .from('quote_items')
      .select('*')
      .eq('quote_id', quoteId);
    
    return toQueryResult(data, error);
  }
  
  async addQuoteItem(item: Omit<QuoteItem, 'id' | 'created_at' | 'updated_at'>): Promise<QueryResult<QuoteItem>> {
    const { data, error } = await supabase
      .from('quote_items')
      .insert(item)
      .select()
      .single();
    
    return toQueryResult(data, error);
  }
  
  async updateQuoteItem(id: string, item: Partial<QuoteItem>): Promise<QueryResult<QuoteItem>> {
    const { data, error } = await supabase
      .from('quote_items')
      .update(item)
      .eq('id', id)
      .select()
      .single();
    
    return toQueryResult(data, error);
  }
  
  async deleteQuoteItem(id: string): Promise<QueryResult<boolean>> {
    const { error } = await supabase
      .from('quote_items')
      .delete()
      .eq('id', id);
    
    return toQueryResult(!error, error);
  }
  
  // Job Operations
  async getJob(id: string): Promise<QueryResult<Job>> {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', id)
      .single();
    
    return toQueryResult(data, error);
  }
  
  async getJobs(options?: PaginationParams & { filters?: FilterParams }): Promise<QueryResult<Job[]>> {
    let query = supabase.from('jobs').select('*', { count: 'exact' });
    
    // Apply filters
    if (options?.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });
    }
    
    // Apply sorting
    if (options?.sortBy) {
      query = query.order(options.sortBy, { ascending: options.sortDirection !== 'desc' });
    }
    
    // Apply pagination
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    
    if (options?.page && options?.limit) {
      query = query.range((options.page - 1) * options.limit, options.page * options.limit - 1);
    }
    
    const { data, error, count } = await query;
    return toQueryResult(data, error, count || undefined);
  }
  
  async getCustomerJobs(customerId: string, options?: PaginationParams): Promise<QueryResult<Job[]>> {
    const { data, error, count } = await supabase
      .from('jobs')
      .select('*', { count: 'exact' })
      .eq('customer_id', customerId)
      .order(options?.sortBy || 'created_at', { ascending: options?.sortDirection !== 'desc' })
      .range(
        options?.page && options?.limit ? (options.page - 1) * options.limit : 0,
        options?.page && options?.limit ? options.page * options.limit - 1 : 9
      );
    
    return toQueryResult(data, error, count || undefined);
  }
  
  async createJob(job: Omit<Job, 'id' | 'created_at' | 'updated_at'>): Promise<QueryResult<Job>> {
    const { data, error } = await supabase
      .from('jobs')
      .insert(job)
      .select()
      .single();
    
    return toQueryResult(data, error);
  }
  
  async updateJob(id: string, job: Partial<Job>): Promise<QueryResult<Job>> {
    const { data, error } = await supabase
      .from('jobs')
      .update(job)
      .eq('id', id)
      .select()
      .single();
    
    return toQueryResult(data, error);
  }
  
  async deleteJob(id: string): Promise<QueryResult<boolean>> {
    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', id);
    
    return toQueryResult(!error, error);
  }
  
  async startJob(id: string): Promise<QueryResult<Job>> {
    const { data, error } = await supabase
      .from('jobs')
      .update({ status: 'in_progress' })
      .eq('id', id)
      .select()
      .single();
    
    return toQueryResult(data, error);
  }
  
  async completeJob(id: string): Promise<QueryResult<Job>> {
    const { data, error } = await supabase
      .from('jobs')
      .update({ status: 'completed' })
      .eq('id', id)
      .select()
      .single();
    
    return toQueryResult(data, error);
  }
  
  async cancelJob(id: string, reason?: string): Promise<QueryResult<Job>> {
    const { data, error } = await supabase
      .from('jobs')
      .update({ 
        status: 'cancelled',
        notes: reason ? `Cancelled: ${reason}` : 'Cancelled'
      })
      .eq('id', id)
      .select()
      .single();
    
    return toQueryResult(data, error);
  }
  
  // Job Material Operations
  async getJobMaterials(jobId: string): Promise<QueryResult<JobMaterial[]>> {
    const { data, error } = await supabase
      .from('job_materials')
      .select('*')
      .eq('job_id', jobId);
    
    return toQueryResult(data, error);
  }
  
  async addJobMaterial(material: Omit<JobMaterial, 'id' | 'created_at' | 'updated_at'>): Promise<QueryResult<JobMaterial>> {
    const { data, error } = await supabase
      .from('job_materials')
      .insert(material)
      .select()
      .single();
    
    return toQueryResult(data, error);
  }
  
  async updateJobMaterial(id: string, material: Partial<JobMaterial>): Promise<QueryResult<JobMaterial>> {
    const { data, error } = await supabase
      .from('job_materials')
      .update(material)
      .eq('id', id)
      .select()
      .single();
    
    return toQueryResult(data, error);
  }
  
  async deleteJobMaterial(id: string): Promise<QueryResult<boolean>> {
    const { error } = await supabase
      .from('job_materials')
      .delete()
      .eq('id', id);
    
    return toQueryResult(!error, error);
  }
  
  // Job Task Operations
  async getJobTasks(jobId: string): Promise<QueryResult<JobTask[]>> {
    const { data, error } = await supabase
      .from('job_tasks')
      .select('*')
      .eq('job_id', jobId);
    
    return toQueryResult(data, error);
  }
  
  async addJobTask(task: Omit<JobTask, 'id' | 'created_at' | 'updated_at'>): Promise<QueryResult<JobTask>> {
    const { data, error } = await supabase
      .from('job_tasks')
      .insert(task)
      .select()
      .single();
    
    return toQueryResult(data, error);
  }
  
  async updateJobTask(id: string, task: Partial<JobTask>): Promise<QueryResult<JobTask>> {
    const { data, error } = await supabase
      .from('job_tasks')
      .update(task)
      .eq('id', id)
      .select()
      .single();
    
    return toQueryResult(data, error);
  }
  
  async deleteJobTask(id: string): Promise<QueryResult<boolean>> {
    const { error } = await supabase
      .from('job_tasks')
      .delete()
      .eq('id', id);
    
    return toQueryResult(!error, error);
  }
  
  async completeJobTask(id: string): Promise<QueryResult<JobTask>> {
    const { data, error } = await supabase
      .from('job_tasks')
      .update({ 
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    return toQueryResult(data, error);
  }
  
  // Invoice Operations
  async getInvoice(id: string): Promise<QueryResult<Invoice>> {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', id)
      .single();
    
    return toQueryResult(data, error);
  }
  
  async getInvoices(options?: PaginationParams & { filters?: FilterParams }): Promise<QueryResult<Invoice[]>> {
    let query = supabase.from('invoices').select('*', { count: 'exact' });
    
    // Apply filters
    if (options?.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });
    }
    
    // Apply sorting
    if (options?.sortBy) {
      query = query.order(options.sortBy, { ascending: options.sortDirection !== 'desc' });
    }
    
    // Apply pagination
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    
    if (options?.page && options?.limit) {
      query = query.range((options.page - 1) * options.limit, options.page * options.limit - 1);
    }
    
    const { data, error, count } = await query;
    return toQueryResult(data, error, count || undefined);
  }
  
  async getCustomerInvoices(customerId: string, options?: PaginationParams): Promise<QueryResult<Invoice[]>> {
    const { data, error, count } = await supabase
      .from('invoices')
      .select('*', { count: 'exact' })
      .eq('customer_id', customerId)
      .order(options?.sortBy || 'created_at', { ascending: options?.sortDirection !== 'desc' })
      .range(
        options?.page && options?.limit ? (options.page - 1) * options.limit : 0,
        options?.page && options?.limit ? options.page * options.limit - 1 : 9
      );
    
    return toQueryResult(data, error, count || undefined);
  }
  
  async createInvoice(invoice: Omit<Invoice, 'id' | 'created_at' | 'updated_at'>): Promise<QueryResult<Invoice>> {
    const { data, error } = await supabase
      .from('invoices')
      .insert(invoice)
      .select()
      .single();
    
    return toQueryResult(data, error);
  }
  
  async updateInvoice(id: string, invoice: Partial<Invoice>): Promise<QueryResult<Invoice>> {
    const { data, error } = await supabase
      .from('invoices')
      .update(invoice)
      .eq('id', id)
      .select()
      .single();
    
    return toQueryResult(data, error);
  }
  
  async deleteInvoice(id: string): Promise<QueryResult<boolean>> {
    const { error } = await supabase
      .from('invoices')
      .delete()
      .eq('id', id);
    
    return toQueryResult(!error, error);
  }
  
  async sendInvoice(id: string): Promise<QueryResult<Invoice>> {
    const { data, error } = await supabase
      .from('invoices')
      .update({ status: 'sent' })
      .eq('id', id)
      .select()
      .single();
    
    return toQueryResult(data, error);
  }
  
  async markInvoiceAsPaid(id: string, paymentDate: string, paymentMethod: string): Promise<QueryResult<Invoice>> {
    const { data, error } = await supabase
      .from('invoices')
      .update({ 
        status: 'paid',
        payment_date: paymentDate,
        payment_method: paymentMethod
      })
      .eq('id', id)
      .select()
      .single();
    
    return toQueryResult(data, error);
  }
  
  // Invoice Item Operations
  async getInvoiceItems(invoiceId: string): Promise<QueryResult<InvoiceItem[]>> {
    const { data, error } = await supabase
      .from('invoice_items')
      .select('*')
      .eq('invoice_id', invoiceId);
    
    return toQueryResult(data, error);
  }
  
  async addInvoiceItem(item: Omit<InvoiceItem, 'id' | 'created_at' | 'updated_at'>): Promise<QueryResult<InvoiceItem>> {
    const { data, error } = await supabase
      .from('invoice_items')
      .insert(item)
      .select()
      .single();
    
    return toQueryResult(data, error);
  }
  
  async updateInvoiceItem(id: string, item: Partial<InvoiceItem>): Promise<QueryResult<InvoiceItem>> {
    const { data, error } = await supabase
      .from('invoice_items')
      .update(item)
      .eq('id', id)
      .select()
      .single();
    
    return toQueryResult(data, error);
  }
  
  async deleteInvoiceItem(id: string): Promise<QueryResult<boolean>> {
    const { error } = await supabase
      .from('invoice_items')
      .delete()
      .eq('id', id);
    
    return toQueryResult(!error, error);
  }
  
  // Expense Operations
  async getExpense(id: string): Promise<QueryResult<Expense>> {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('id', id)
      .single();
    
    return toQueryResult(data, error);
  }
  
  async getExpenses(options?: PaginationParams & { filters?: FilterParams }): Promise<QueryResult<Expense[]>> {
    let query = supabase.from('expenses').select('*', { count: 'exact' });
    
    // Apply filters
    if (options?.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });
    }
    
    // Apply sorting
    if (options?.sortBy) {
      query = query.order(options.sortBy, { ascending: options.sortDirection !== 'desc' });
    }
    
    // Apply pagination
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    
    if (options?.page && options?.limit) {
      query = query.range((options.page - 1) * options.limit, options.page * options.limit - 1);
    }
    
    const { data, error, count } = await query;
    return toQueryResult(data, error, count || undefined);
  }
  
  async getJobExpenses(jobId: string, options?: PaginationParams): Promise<QueryResult<Expense[]>> {
    const { data, error, count } = await supabase
      .from('expenses')
      .select('*', { count: 'exact' })
      .eq('job_id', jobId)
      .order(options?.sortBy || 'created_at', { ascending: options?.sortDirection !== 'desc' })
      .range(
        options?.page && options?.limit ? (options.page - 1) * options.limit : 0,
        options?.page && options?.limit ? options.page * options.limit - 1 : 9
      );
    
    return toQueryResult(data, error, count || undefined);
  }
  
  async createExpense(expense: Omit<Expense, 'id' | 'created_at' | 'updated_at'>): Promise<QueryResult<Expense>> {
    const { data, error } = await supabase
      .from('expenses')
      .insert(expense)
      .select()
      .single();
    
    return toQueryResult(data, error);
  }
  
  async updateExpense(id: string, expense: Partial<Expense>): Promise<QueryResult<Expense>> {
    const { data, error } = await supabase
      .from('expenses')
      .update(expense)
      .eq('id', id)
      .select()
      .single();
    
    return toQueryResult(data, error);
  }
  
  async deleteExpense(id: string): Promise<QueryResult<boolean>> {
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id);
    
    return toQueryResult(!error, error);
  }
  
  async approveExpense(id: string, approvedBy: string): Promise<QueryResult<Expense>> {
    const { data, error } = await supabase
      .from('expenses')
      .update({ 
        status: 'approved',
        approvedBy
      })
      .eq('id', id)
      .select()
      .single();
    
    return toQueryResult(data, error);
  }
  
  async rejectExpense(id: string, rejectedBy: string, reason?: string): Promise<QueryResult<Expense>> {
    const { data, error } = await supabase
      .from('expenses')
      .update({ 
        status: 'rejected',
        rejectedBy,
        notes: reason ? `Rejected: ${reason}` : 'Rejected'
      })
      .eq('id', id)
      .select()
      .single();
    
    return toQueryResult(data, error);
  }
  
  // Search across multiple entities
  async searchAll(query: string, options?: PaginationParams): Promise<QueryResult<{
    customers?: CustomerProfile[];
    jobs?: Job[];
    quotes?: Quote[];
    invoices?: Invoice[];
    properties?: Property[];
  }>> {
    // This would be implemented to search across multiple tables
    // For now, we'll just return a placeholder
    return toQueryResult({
      customers: [],
      jobs: [],
      quotes: [],
      invoices: [],
      properties: []
    }, null);
  }
  
  // Transaction operations
  async beginTransaction(): Promise<string> {
    // Supabase doesn't support transactions in the same way as traditional databases
    // This is a placeholder that returns a transaction ID
    return `txn_${Date.now()}`;
  }
  
  async commitTransaction(transactionId: string): Promise<boolean> {
    // Supabase doesn't support transactions in the same way as traditional databases
    // This is a placeholder that always returns true
    return true;
  }
  
  async rollbackTransaction(transactionId: string): Promise<boolean> {
    // Supabase doesn't support transactions in the same way as traditional databases
    // This is a placeholder that always returns true
    return true;
  }
}

// Export a singleton instance
export const databaseService = new DatabaseService(); 