import { supabase } from "@/integrations/supabase/client";

// Customer Profile Interfaces
export interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  status: 'active' | 'inactive';
  created_at: string;
  user_id: string;
}

// Site Audit Interfaces
export interface SiteAudit {
  id: string;
  customer_id: string;
  title: string;
  date: string;
  status: 'completed' | 'pending' | 'in_progress';
  notes?: string;
  created_at: string;
  updated_at: string;
  location?: string;
}

export interface SiteAuditPhoto {
  id: string;
  audit_id: string;
  customer_id: string;
  photo_url: string;
  caption?: string;
  created_at: string;
  tags?: string[];
}

// Quote Interfaces
export interface Quote {
  id: string;
  customer_id: string;
  title: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  expiry_date?: string;
  job_id?: string;
}

// Job Interfaces
export interface Job {
  id: string;
  customer_id: string;
  quote_id?: string;
  title: string;
  description?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  start_date?: string;
  end_date?: string;
  created_at: string;
  assigned_to?: string[];
  location?: string;
}

// Invoice Interfaces
export interface Invoice {
  id: string;
  customer_id: string;
  job_id?: string;
  quote_id?: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  due_date: string;
  created_at: string;
  payment_date?: string;
}

export class CustomerService {
  // Customer Profile Methods
  async getCustomerProfile(customerId: string): Promise<CustomerProfile | null> {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', customerId)
        .single();
      
      if (error) {
        console.warn('Customer lookup failed:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error("Error fetching customer profile:", error);
      return null;
    }
  }

  // Add function to get customer details by name
  async getCustomerDetails(customerName: string): Promise<CustomerProfile | null> {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .ilike('name', `%${customerName}%`)
        .limit(1)
        .single();
      
      if (error) {
        console.warn('Customer name lookup failed:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error("Error fetching customer details by name:", error);
      return null;
    }
  }

  // Site Audit Methods
  async getCustomerAudits(customerId: string): Promise<SiteAudit[]> {
    try {
      const { data, error } = await supabase
        .from('site_audits')
        .select('*')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching customer audits:", error);
      return [];
    }
  }

  async getAuditPhotos(auditId: string): Promise<SiteAuditPhoto[]> {
    try {
      const { data, error } = await supabase
        .from('audit_photos')
        .select('*')
        .eq('audit_id', auditId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching audit photos:", error);
      return [];
    }
  }

  async addPhotoToCustomerProfile(
    customerId: string, 
    photoUrl: string, 
    caption?: string,
    auditId?: string
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('customer_photos')
        .insert({
          customer_id: customerId,
          photo_url: photoUrl,
          caption,
          audit_id: auditId
        });
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error adding photo to customer profile:", error);
      return false;
    }
  }

  // Quote Methods
  async getCustomerQuotes(customerId: string): Promise<Quote[]> {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching customer quotes:", error);
      return [];
    }
  }

  async createQuoteFromAudit(auditId: string, customerId: string, quoteData: Partial<Quote>): Promise<Quote | null> {
    try {
      // First get the audit to link data
      const { data: auditData, error: auditError } = await supabase
        .from('site_audits')
        .select('*')
        .eq('id', auditId)
        .single();
      
      if (auditError) throw auditError;

      const { data, error } = await supabase
        .from('quotes')
        .insert({
          customer_id: customerId,
          title: quoteData.title || `Quote for ${auditData.title}`,
          amount: quoteData.amount || 0,
          status: 'pending',
          created_at: new Date().toISOString(),
          audit_id: auditId
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error creating quote from audit:", error);
      return null;
    }
  }

  // Job Methods
  async getCustomerJobs(customerId: string): Promise<Job[]> {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching customer jobs:", error);
      return [];
    }
  }

  async createJobFromQuote(quoteId: string, customerId: string): Promise<Job | null> {
    try {
      // First get the quote to link data
      const { data: quoteData, error: quoteError } = await supabase
        .from('quotes')
        .select('*')
        .eq('id', quoteId)
        .single();
      
      if (quoteError) throw quoteError;

      // Create the job
      const { data, error } = await supabase
        .from('jobs')
        .insert({
          customer_id: customerId,
          quote_id: quoteId,
          title: `Job for ${quoteData.title}`,
          status: 'scheduled',
          created_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;

      // Update the quote to link to the job
      await supabase
        .from('quotes')
        .update({ job_id: data.id })
        .eq('id', quoteId);
      
      return data;
    } catch (error) {
      console.error("Error creating job from quote:", error);
      return null;
    }
  }

  // Invoice Methods
  async getCustomerInvoices(customerId: string): Promise<Invoice[]> {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching customer invoices:", error);
      return [];
    }
  }

  async createInvoiceFromJob(jobId: string, customerId: string, amount: number): Promise<Invoice | null> {
    try {
      // Get the job to link data
      const { data: jobData, error: jobError } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .single();
      
      if (jobError) throw jobError;

      // Create the invoice
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 30); // 30 days from now
      
      const { data, error } = await supabase
        .from('invoices')
        .insert({
          customer_id: customerId,
          job_id: jobId,
          quote_id: jobData.quote_id,
          amount: amount,
          status: 'draft',
          due_date: dueDate.toISOString(),
          created_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error creating invoice from job:", error);
      return null;
    }
  }

  // Get full customer journey
  async getCustomerJourney(customerId: string) {
    try {
      const profile = await this.getCustomerProfile(customerId);
      const audits = await this.getCustomerAudits(customerId);
      const quotes = await this.getCustomerQuotes(customerId);
      const jobs = await this.getCustomerJobs(customerId);
      const invoices = await this.getCustomerInvoices(customerId);

      return {
        profile,
        audits,
        quotes,
        jobs,
        invoices
      };
    } catch (error) {
      console.error("Error fetching customer journey:", error);
      return {
        profile: null,
        audits: [],
        quotes: [],
        jobs: [],
        invoices: []
      };
    }
  }
}

// Export a singleton instance
export const customerService = new CustomerService();

// Also export as default
export default CustomerService; 