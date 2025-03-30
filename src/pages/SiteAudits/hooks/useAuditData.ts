
import { useState, useEffect } from 'react';
import { Customer, Audit } from '../types/auditTypes';
import { useToast } from '@/hooks/use-toast';

export const useAuditData = () => {
  const [audits, setAudits] = useState<Audit[]>([
    {
      id: '1',
      title: 'Kitchen Renovation Initial Assessment',
      customerId: '1',
      location: '123 Main St, Springfield',
      startDate: '2023-11-15',
      status: 'in_progress',
      assignedTo: 'John Carpenter',
      completedItems: 8,
      totalItems: 12,
      photos: []
    },
    {
      id: '2',
      title: 'Bathroom Remodel Site Check',
      customerId: '2',
      location: '456 Oak Ave, Springfield',
      startDate: '2023-11-10',
      status: 'in_progress',
      assignedTo: 'Sarah Plumber',
      completedItems: 3,
      totalItems: 10,
      photos: []
    }
  ]);

  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: '1',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '555-123-4567',
      address: '123 Main St, Springfield'
    },
    {
      id: '2',
      name: 'Robert Johnson',
      email: 'robert.johnson@example.com',
      phone: '555-987-6543',
      address: '456 Oak Ave, Springfield'
    },
    {
      id: '3',
      name: 'Emily Williams',
      email: 'emily.williams@example.com',
      phone: '555-321-7654',
      address: '789 Pine St, Springfield'
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Simulate loading data
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  const uploadAuditPhoto = async (customerId: string, file: File) => {
    // Simulate API call
    setIsLoading(true);
    
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // Simulate successful upload
        setAudits(prevAudits => {
          const existingAudit = prevAudits.find(a => a.customerId === customerId);
          
          if (existingAudit) {
            // Add photo to existing audit
            return prevAudits.map(audit => {
              if (audit.customerId === customerId) {
                return {
                  ...audit,
                  photos: [...audit.photos, {
                    id: `photo-${Date.now()}`,
                    url: URL.createObjectURL(file),
                    name: file.name,
                    uploadedAt: new Date().toISOString()
                  }]
                };
              }
              return audit;
            });
          } else {
            // No matching audit found
            reject(new Error("No audit found for this customer"));
          }
          
          return prevAudits;
        });
        
        setIsLoading(false);
        resolve();
      }, 1500);
    });
  };

  const createNewAudit = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return;
    
    setIsLoading(true);
    
    setTimeout(() => {
      const newAudit: Audit = {
        id: `audit-${Date.now()}`,
        title: `${customer.name} Property Assessment`,
        customerId: customer.id,
        location: customer.address,
        startDate: new Date().toISOString(),
        status: 'in_progress',
        assignedTo: 'Current User', // In a real app, use logged-in user
        completedItems: 0,
        totalItems: 10,
        photos: []
      };
      
      setAudits(prevAudits => [...prevAudits, newAudit]);
      setIsLoading(false);
      
      toast({
        title: "Audit Created",
        description: `New site audit created for ${customer.name}`
      });
    }, 1000);
  };

  return {
    audits,
    customers,
    isLoading,
    uploadAuditPhoto,
    createNewAudit
  };
};
