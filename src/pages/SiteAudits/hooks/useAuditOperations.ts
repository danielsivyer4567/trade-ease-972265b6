
import { useState } from 'react';
import { Audit, Customer } from '../types/auditTypes';
import { useToast } from '@/hooks/use-toast';

export const useAuditOperations = (
  audits: Audit[],
  setAudits: React.Dispatch<React.SetStateAction<Audit[]>>,
  customers: Customer[],
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const { toast } = useToast();

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

  return { createNewAudit };
};
