import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { mockCrmContacts } from "@/mocks/crm-contacts";

export type CrmPipelineType = 'pre-quote' | 'post-quote' | 'complaints';

export interface CrmContact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar: string;
  status: string;
  pipeline: CrmPipelineType;
  platforms: string[];
  last_message: string;
  last_updated: string;
  quote_id?: string;
  customer_id?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  assigned_to?: string;
  tags?: string[];
}

export function useCrmContacts() {
  const [contacts, setContacts] = useState<CrmContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePipeline, setActivePipeline] = useState<CrmPipelineType>('pre-quote');
  const [searchTerm, setSearchTerm] = useState('');
  const [isUsingMockData, setIsUsingMockData] = useState(true);

  useEffect(() => {
    async function fetchContacts() {
      setLoading(true);
      
      try {
        // First check if user is authenticated
        const { data: sessionData } = await supabase.auth.getSession();
        const userId = sessionData?.session?.user?.id;
        
        if (!userId) {
          console.log('No authenticated user, using mock data');
          await new Promise(resolve => setTimeout(resolve, 800));
          setContacts(mockCrmContacts);
          setIsUsingMockData(true);
          setLoading(false);
          return;
        }
        
        // Try to fetch real contacts from customers table
        const { data: customerData, error: customerError } = await supabase
          .from('customers')
          .select('*')
          .eq('user_id', userId);
          
        if (customerError || !customerData || customerData.length === 0) {
          console.log('No customer data found or error occurred, using mock data:', customerError);
          await new Promise(resolve => setTimeout(resolve, 800));
          setContacts(mockCrmContacts);
          setIsUsingMockData(true);
        } else {
          // Transform customer data to CRM contact format
          const transformedContacts: CrmContact[] = customerData.map(customer => ({
            id: customer.id,
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(customer.name)}&background=4299E1&color=fff`,
            status: customer.status || 'new',
            pipeline: 'pre-quote' as CrmPipelineType,
            platforms: ['email'],
            last_message: '',
            last_updated: customer.created_at,
            priority: 'medium',
          }));
          
          setContacts(transformedContacts);
          setIsUsingMockData(false);
        }
      } catch (error) {
        console.error('Error fetching contacts:', error);
        setContacts(mockCrmContacts);
        setIsUsingMockData(true);
      } finally {
        setLoading(false);
      }
    }
    
    fetchContacts();
  }, []);

  // Add new contact
  const addContact = async (contact: CrmContact) => {
    if (isUsingMockData) {
      // Just update local state with mock data
      setContacts(prev => [contact, ...prev]);
      return;
    }

    try {
      // Get current user ID
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData?.session?.user?.id;
      
      if (!userId) {
        throw new Error('No authenticated user');
      }
      
      // Insert into customers table
      const { data, error } = await supabase
        .from('customers')
        .insert({
          name: contact.name,
          email: contact.email,
          phone: contact.phone || '',
          status: contact.status,
          user_id: userId,
          address: '',
          city: '',
          state: '',
          zipcode: ''
        })
        .select();
        
      if (error) {
        throw error;
      }
      
      if (data && data[0]) {
        // Transform back to CrmContact and update state
        const newContact: CrmContact = {
          ...contact,
          id: data[0].id,
        };
        
        setContacts(prev => [newContact, ...prev]);
      }
    } catch (error) {
      console.error('Error adding contact:', error);
      // Fallback to local update
      setContacts(prev => [contact, ...prev]);
    }
  };

  // Update contact status
  async function updateContactStatus(id: string, status: string) {
    if (isUsingMockData) {
      // Just update local state with mock data
      setContacts(prev => prev.map(c => c.id === id ? { ...c, status, last_updated: new Date().toISOString() } : c));
      return;
    }
    
    try {
      const { error } = await supabase
        .from('customers')
        .update({ status })
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      // Update local state
      setContacts(prev => prev.map(c => c.id === id ? { ...c, status, last_updated: new Date().toISOString() } : c));
    } catch (error) {
      console.error('Error updating contact status:', error);
      // Fallback to local update
      setContacts(prev => prev.map(c => c.id === id ? { ...c, status, last_updated: new Date().toISOString() } : c));
    }
  }

  // Update contact pipeline
  async function updateContactPipeline(id: string, pipeline: CrmPipelineType) {
    // Currently pipelines aren't stored in the database, just update local state
    setContacts(prev => prev.map(c => c.id === id ? { ...c, pipeline, last_updated: new Date().toISOString() } : c));
  }

  // Update contact priority
  async function updateContactPriority(id: string, priority: 'low' | 'medium' | 'high' | 'urgent') {
    // Currently priority isn't stored in the database, just update local state
    setContacts(prev => prev.map(c => c.id === id ? { ...c, priority, last_updated: new Date().toISOString() } : c));
  }

  // Delete contact
  const deleteContact = async (id: string) => {
    if (isUsingMockData) {
      // Just update local state with mock data
      setContacts(prev => prev.filter(c => c.id !== id));
      return;
    }
    
    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      // Update local state
      setContacts(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting contact:', error);
      // Fallback to local update
      setContacts(prev => prev.filter(c => c.id !== id));
    }
  };

  // Search contacts
  const searchContacts = (term: string) => {
    setSearchTerm(term);
  };

  // Filter contacts by search term
  const searchedContacts = searchTerm
    ? contacts.filter(contact => 
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (contact.phone && contact.phone.includes(searchTerm)) ||
        (contact.tags && contact.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))) ||
        contact.last_message.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : contacts;

  // Get contacts filtered by active pipeline and search term
  const filteredContacts = searchedContacts.filter(contact => contact.pipeline === activePipeline);

  return { 
    contacts: filteredContacts, 
    allContacts: contacts,
    setContacts, 
    loading, 
    activePipeline,
    setActivePipeline,
    searchTerm,
    searchContacts,
    addContact,
    deleteContact,
    updateContactStatus,
    updateContactPipeline,
    updateContactPriority,
    isUsingMockData
  };
} 