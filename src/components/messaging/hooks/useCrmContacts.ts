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

  useEffect(() => {
    // Simulate API call with mock data
    async function fetchContacts() {
      setLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      setContacts(mockCrmContacts);
      setLoading(false);
    }
    fetchContacts();
  }, []);

  // Add new contact
  const addContact = (contact: CrmContact) => {
    // In a real app, we would call the API here
    // For now, just update the local state
    setContacts(prev => [contact, ...prev]);
  };

  // Update contact status
  async function updateContactStatus(id: string, status: string) {
    // In a real app, we would call the API here
    // For now, just update the local state
    setContacts(prev => prev.map(c => c.id === id ? { ...c, status, last_updated: new Date().toISOString() } : c));
  }

  // Update contact pipeline
  async function updateContactPipeline(id: string, pipeline: CrmPipelineType) {
    // In a real app, we would call the API here
    // For now, just update the local state
    setContacts(prev => prev.map(c => c.id === id ? { ...c, pipeline, last_updated: new Date().toISOString() } : c));
  }

  // Update contact priority
  async function updateContactPriority(id: string, priority: 'low' | 'medium' | 'high' | 'urgent') {
    // In a real app, we would call the API here
    // For now, just update the local state
    setContacts(prev => prev.map(c => c.id === id ? { ...c, priority, last_updated: new Date().toISOString() } : c));
  }

  // Delete contact
  const deleteContact = (id: string) => {
    // In a real app, we would call the API here
    // For now, just update the local state
    setContacts(prev => prev.filter(c => c.id !== id));
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
    updateContactPriority
  };
} 