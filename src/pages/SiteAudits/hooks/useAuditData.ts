
import { useState, useEffect, useMemo } from 'react';
import { Customer, Audit, AuditsByDay } from '../types/auditTypes';
import { useToast } from '@/hooks/use-toast';
import { format, startOfWeek, addDays, subWeeks, addWeeks, parseISO, isSameDay } from 'date-fns';

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
    },
    {
      id: '3',
      title: 'Deck Installation Follow-up',
      customerId: '3',
      location: '789 Pine St, Springfield',
      startDate: '2023-11-16',
      status: 'scheduled',
      assignedTo: 'Mike Builder',
      completedItems: 0,
      totalItems: 8,
      photos: []
    },
    {
      id: '4',
      title: 'Roof Inspection',
      customerId: '1',
      location: '123 Main St, Springfield',
      startDate: '2023-11-17',
      status: 'scheduled',
      assignedTo: 'John Carpenter',
      completedItems: 0,
      totalItems: 6,
      photos: []
    },
    {
      id: '5',
      title: 'Kitchen Backsplash Installation',
      customerId: '2',
      location: '456 Oak Ave, Springfield',
      startDate: '2023-11-18',
      status: 'scheduled',
      assignedTo: 'Sarah Plumber',
      completedItems: 0,
      totalItems: 4,
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
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => startOfWeek(new Date(), { weekStartsOn: 1 })); // Monday as week start
  const { toast } = useToast();

  // Navigate to previous week
  const goToPreviousWeek = () => {
    setCurrentWeekStart(prevDate => subWeeks(prevDate, 1));
  };

  // Navigate to next week
  const goToNextWeek = () => {
    setCurrentWeekStart(prevDate => addWeeks(prevDate, 1));
  };

  // Organize audits by day for the current week
  const auditsByDay = useMemo(() => {
    const result: AuditsByDay[] = [];
    
    // Create 5 days (Monday to Friday)
    for (let i = 0; i < 5; i++) {
      const day = addDays(currentWeekStart, i);
      const dayName = format(day, 'EEEE');
      const formattedDate = format(day, 'MMM d');
      
      // Filter audits for this specific day
      const dayAudits = audits.filter(audit => {
        const auditDate = parseISO(audit.startDate);
        return isSameDay(auditDate, day);
      });
      
      // Sort audits by their ID (assuming higher ID means more recent)
      const sortedAudits = [...dayAudits].sort((a, b) => a.id.localeCompare(b.id));
      
      result.push({
        date: day,
        dayName,
        formattedDate,
        audits: sortedAudits
      });
    }
    
    return result;
  }, [audits, currentWeekStart]);

  // Simulate loading data
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [currentWeekStart]);

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
    createNewAudit,
    auditsByDay,
    currentWeekStart,
    goToPreviousWeek,
    goToNextWeek
  };
};
