import { supabase } from '@/integrations/supabase/client';

// Mock data types
export interface MockUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface MockCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  created_at: string;
}

export interface MockJob {
  id: string;
  title: string;
  customer_id: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  scheduled_date: string;
  assigned_team: string;
  description: string;
  created_at: string;
}

export interface MockQuote {
  id: string;
  customer_id: string;
  job_id?: string;
  total_amount: number;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  created_at: string;
  expiration_date: string;
  items: MockQuoteItem[];
}

export interface MockQuoteItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
}

export interface MockTeam {
  id: string;
  name: string;
  members: MockTeamMember[];
  color: string;
}

export interface MockTeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
}

// Generate mock data
const mockCustomers: MockCustomer[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '555-123-4567',
    address: '123 Main St, Anytown, AN 12345',
    created_at: '2025-01-15T08:00:00Z',
  },
  {
    id: '2',
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    phone: '555-987-6543',
    address: '456 Oak Ave, Somewhere, SM 67890',
    created_at: '2025-01-20T10:30:00Z',
  },
  {
    id: '3',
    name: 'Robert Johnson',
    email: 'robert.johnson@example.com',
    phone: '555-456-7890',
    address: '789 Pine Rd, Nowhere, NW 54321',
    created_at: '2025-01-25T14:15:00Z',
  },
];

const mockJobs: MockJob[] = [
  {
    id: 'JB001',
    title: 'Bathroom Renovation',
    customer_id: '1',
    status: 'scheduled',
    scheduled_date: '2025-04-25T09:00:00Z',
    assigned_team: 'Red Team',
    description: 'Complete bathroom renovation including new fixtures, tiling, and paint',
    created_at: '2025-04-10T08:30:00Z',
  },
  {
    id: 'JB002',
    title: 'Kitchen Plumbing',
    customer_id: '2',
    status: 'in_progress',
    scheduled_date: '2025-04-22T11:30:00Z',
    assigned_team: 'Blue Team',
    description: 'Fix kitchen sink leak and install new garbage disposal',
    created_at: '2025-04-15T14:45:00Z',
  },
  {
    id: 'JB003',
    title: 'Roof Repair',
    customer_id: '3',
    status: 'completed',
    scheduled_date: '2025-04-18T10:00:00Z',
    assigned_team: 'Green Team',
    description: 'Replace damaged shingles and repair leak',
    created_at: '2025-04-05T09:15:00Z',
  },
];

const mockQuotes: MockQuote[] = [
  {
    id: 'QT001',
    customer_id: '1',
    job_id: 'JB001',
    total_amount: 5500,
    status: 'accepted',
    created_at: '2025-04-08T09:30:00Z',
    expiration_date: '2025-05-08T09:30:00Z',
    items: [
      { id: '1', description: 'Labor', quantity: 35, unit_price: 95 },
      { id: '2', description: 'Materials', quantity: 1, unit_price: 2175 }
    ]
  },
  {
    id: 'QT002',
    customer_id: '2',
    job_id: 'JB002',
    total_amount: 750,
    status: 'sent',
    created_at: '2025-04-14T11:45:00Z',
    expiration_date: '2025-05-14T11:45:00Z',
    items: [
      { id: '1', description: 'Labor', quantity: 5, unit_price: 95 },
      { id: '2', description: 'Garbage Disposal', quantity: 1, unit_price: 275 }
    ]
  },
  {
    id: 'QT003',
    customer_id: '3',
    job_id: 'JB003',
    total_amount: 2800,
    status: 'accepted',
    created_at: '2025-04-03T10:15:00Z',
    expiration_date: '2025-05-03T10:15:00Z',
    items: [
      { id: '1', description: 'Labor', quantity: 16, unit_price: 95 },
      { id: '2', description: 'Roofing Materials', quantity: 1, unit_price: 1280 }
    ]
  },
];

const mockTeams: MockTeam[] = [
  {
    id: '1',
    name: 'Red Team',
    color: 'red',
    members: [
      { id: '1', name: 'Mike Anderson', role: 'Team Lead', email: 'mike@example.com', phone: '555-111-2222' },
      { id: '2', name: 'Sarah Johnson', role: 'Technician', email: 'sarah@example.com', phone: '555-222-3333' },
      { id: '3', name: 'Dave Williams', role: 'Apprentice', email: 'dave@example.com', phone: '555-333-4444' },
    ]
  },
  {
    id: '2',
    name: 'Blue Team',
    color: 'blue',
    members: [
      { id: '4', name: 'Lisa Chen', role: 'Team Lead', email: 'lisa@example.com', phone: '555-444-5555' },
      { id: '5', name: 'Mark Davis', role: 'Technician', email: 'mark@example.com', phone: '555-555-6666' },
      { id: '6', name: 'Emma Brown', role: 'Apprentice', email: 'emma@example.com', phone: '555-666-7777' },
    ]
  },
  {
    id: '3',
    name: 'Green Team',
    color: 'green',
    members: [
      { id: '7', name: 'James Wilson', role: 'Team Lead', email: 'james@example.com', phone: '555-777-8888' },
      { id: '8', name: 'Linda Garcia', role: 'Technician', email: 'linda@example.com', phone: '555-888-9999' },
      { id: '9', name: 'Tom Martinez', role: 'Apprentice', email: 'tom@example.com', phone: '555-999-0000' },
    ]
  },
];

// Mock database service
class MockDatabaseService {
  // Customers
  async getCustomers(): Promise<MockCustomer[]> {
    try {
      // Try to get real data first
      const { data, error } = await supabase.from('customers').select('*');
      if (error) throw error;
      
      // If we have real data, use it
      if (data && data.length > 0) {
        return data;
      }
      
      // Fall back to mock data
      return mockCustomers;
    } catch (error) {
      console.error('Error fetching customers:', error);
      return mockCustomers; // Fall back to mock data
    }
  }
  
  async getCustomerById(id: string): Promise<MockCustomer | null> {
    try {
      // Try to get real data first
      const { data, error } = await supabase.from('customers').select('*').eq('id', id).single();
      if (error) throw error;
      
      // If we have real data, use it
      if (data) {
        return data;
      }
      
      // Fall back to mock data
      return mockCustomers.find(customer => customer.id === id) || null;
    } catch (error) {
      console.error(`Error fetching customer ${id}:`, error);
      return mockCustomers.find(customer => customer.id === id) || null; // Fall back to mock data
    }
  }

  // Jobs
  async getJobs(): Promise<MockJob[]> {
    try {
      // Try to get real data first
      const { data, error } = await supabase.from('jobs').select('*');
      if (error) throw error;
      
      // If we have real data, use it
      if (data && data.length > 0) {
        return data;
      }
      
      // Fall back to mock data
      return mockJobs;
    } catch (error) {
      console.error('Error fetching jobs:', error);
      return mockJobs; // Fall back to mock data
    }
  }
  
  async getJobById(id: string): Promise<MockJob | null> {
    try {
      // Try to get real data first
      const { data, error } = await supabase.from('jobs').select('*').eq('id', id).single();
      if (error) throw error;
      
      // If we have real data, use it
      if (data) {
        return data;
      }
      
      // Fall back to mock data
      return mockJobs.find(job => job.id === id) || null;
    } catch (error) {
      console.error(`Error fetching job ${id}:`, error);
      return mockJobs.find(job => job.id === id) || null; // Fall back to mock data
    }
  }

  // Quotes
  async getQuotes(): Promise<MockQuote[]> {
    try {
      // Try to get real data first
      const { data, error } = await supabase.from('quotes').select('*');
      if (error) throw error;
      
      // If we have real data, use it
      if (data && data.length > 0) {
        return data;
      }
      
      // Fall back to mock data
      return mockQuotes;
    } catch (error) {
      console.error('Error fetching quotes:', error);
      return mockQuotes; // Fall back to mock data
    }
  }
  
  async getQuoteById(id: string): Promise<MockQuote | null> {
    try {
      // Try to get real data first
      const { data, error } = await supabase.from('quotes').select('*').eq('id', id).single();
      if (error) throw error;
      
      // If we have real data, use it
      if (data) {
        return data;
      }
      
      // Fall back to mock data
      return mockQuotes.find(quote => quote.id === id) || null;
    } catch (error) {
      console.error(`Error fetching quote ${id}:`, error);
      return mockQuotes.find(quote => quote.id === id) || null; // Fall back to mock data
    }
  }

  // Teams
  async getTeams(): Promise<MockTeam[]> {
    try {
      // Try to get real data first
      const { data, error } = await supabase.from('teams').select('*');
      if (error) throw error;
      
      // If we have real data, use it
      if (data && data.length > 0) {
        return data;
      }
      
      // Fall back to mock data
      return mockTeams;
    } catch (error) {
      console.error('Error fetching teams:', error);
      return mockTeams; // Fall back to mock data
    }
  }
  
  async getTeamById(id: string): Promise<MockTeam | null> {
    try {
      // Try to get real data first
      const { data, error } = await supabase.from('teams').select('*').eq('id', id).single();
      if (error) throw error;
      
      // If we have real data, use it
      if (data) {
        return data;
      }
      
      // Fall back to mock data
      return mockTeams.find(team => team.id === id) || null;
    } catch (error) {
      console.error(`Error fetching team ${id}:`, error);
      return mockTeams.find(team => team.id === id) || null; // Fall back to mock data
    }
  }
}

export const mockDatabaseService = new MockDatabaseService(); 