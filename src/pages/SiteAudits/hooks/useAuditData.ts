
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Audit, Customer } from '../types/auditTypes';

// Sample data for demonstration - would be replaced with actual API calls
const MOCK_CUSTOMERS: Customer[] = [
  { id: '1', name: 'John Smith', email: 'john@example.com' },
  { id: '2', name: 'Sarah Johnson', email: 'sarah@example.com' },
  { id: '3', name: 'Michael Brown', email: 'michael@example.com' },
  { id: '4', name: 'Emma Davis', email: 'emma@example.com' },
];

const MOCK_AUDITS: Audit[] = [
  {
    id: '1',
    customerId: '1',
    title: 'Remodeling Site Audit #1',
    location: '123 Main St, Anytown, CA',
    startDate: '2023-10-10',
    endDate: null,
    status: 'in_progress',
    completedItems: 15,
    totalItems: 24,
    assignedTo: 'John Smith',
    photos: []
  },
  {
    id: '2',
    customerId: '2',
    title: 'Plumbing Inspection #2',
    location: '456 Oak St, Somewhere, CA',
    startDate: '2023-11-05',
    endDate: null,
    status: 'in_progress',
    completedItems: 8,
    totalItems: 12,
    assignedTo: 'Mike Johnson',
    photos: []
  }
];

// This hook would eventually connect to your database
export function useAuditData() {
  const [audits, setAudits] = useState<Audit[]>(MOCK_AUDITS);
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // Mock customer data fetch - would be replaced with actual API call
  useEffect(() => {
    // Simulate API fetch
    setIsLoading(true);
    
    // Simulate API delay
    const timer = setTimeout(() => {
      setCustomers(MOCK_CUSTOMERS);
      setAudits(MOCK_AUDITS);
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Function to upload photo to an audit
  const uploadAuditPhoto = async (customerId: string, file: File): Promise<void> => {
    try {
      setIsLoading(true);
      
      // In a real implementation, this would upload to storage and update database
      console.log(`Uploading photo for customer ${customerId}`, file);
      
      // Simulate successful upload
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the local state with the new photo (mock implementation)
      setAudits(prevAudits => {
        return prevAudits.map(audit => {
          if (audit.customerId === customerId) {
            return {
              ...audit,
              photos: [...(audit.photos || []), {
                id: `photo_${Date.now()}`,
                url: URL.createObjectURL(file),
                uploadedAt: new Date().toISOString(),
                caption: ''
              }]
            };
          }
          return audit;
        });
      });
      
      setIsLoading(false);
      return Promise.resolve();
    } catch (error) {
      setIsLoading(false);
      console.error('Error uploading photo:', error);
      return Promise.reject(new Error('Failed to upload photo'));
    }
  };
  
  // Function to create a new audit
  const createNewAudit = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return;
    
    const newAudit: Audit = {
      id: `audit_${Date.now()}`,
      customerId,
      title: `New Site Audit - ${customer.name}`,
      location: 'Address pending...',
      startDate: new Date().toISOString(),
      endDate: null,
      status: 'in_progress',
      completedItems: 0,
      totalItems: 10,
      assignedTo: 'Current User', // Would use actual logged-in user
      photos: []
    };
    
    setAudits(prev => [...prev, newAudit]);
    
    toast({
      title: "Audit Created",
      description: `New audit for ${customer.name} has been created`
    });
  };
  
  return {
    audits,
    customers,
    isLoading,
    uploadAuditPhoto,
    createNewAudit
  };
}
