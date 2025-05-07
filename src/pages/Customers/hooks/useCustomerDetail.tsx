import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CustomerNote, CustomerJobHistory } from '@/pages/Banking/types';

export const useCustomerDetail = (id: string | undefined) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [customer, setCustomer] = useState<any>(null);
  const [notes, setNotes] = useState<CustomerNote[]>([]);
  const [jobHistory, setJobHistory] = useState<CustomerJobHistory[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setIsLoadingData(false);
      setError("No customer ID provided");
      toast({
        title: "Error",
        description: "Customer ID is required to view details",
        variant: "destructive"
      });
      return;
    }
    
    const fetchCustomerDetails = async () => {
      setIsLoadingData(true);
      setError(null);
      
      try {
        console.log("Fetching customer with ID:", id);
        const { data: session } = await supabase.auth.getSession();
        if (!session?.session?.user) {
          console.error("No authenticated user found");
          toast({
            title: "Authentication Error",
            description: "You must be logged in to view customer details",
            variant: "destructive"
          });
          navigate('/auth');
          return;
        }

        const { data: customerData, error: customerError } = await supabase
          .from('customers')
          .select('*')
          .eq('id', id)
          .maybeSingle();
          
        if (customerError) {
          console.error("Supabase error fetching customer:", customerError);
          throw new Error(`Failed to load customer: ${customerError.message}`);
        }
        
        // If no data was found in the database, check if the ID matches mock data format (for demo/testing)
        if (!customerData) {
          console.log("No customer found in database, checking if it's a mock customer ID:", id);
          
          // Check if the ID follows the CUST-XXXX format (for mock customers)
          if (id.startsWith('CUST-')) {
            console.log("Using mock customer data for ID:", id);
            // Create a mock customer with the requested ID
            const mockCustomer = {
              id: id,
              name: `Customer ${id.slice(5)}`,
              email: `customer${id.slice(5)}@example.com`,
              phone: `(555) ${id.slice(5)}-${Math.floor(1000 + Math.random() * 9000)}`,
              address: `${Math.floor(100 + Math.random() * 900)} Main St`,
              city: "Demo City",
              state: "ST",
              zipcode: "12345",
              status: "active",
              created_at: new Date().toISOString(),
              user_id: session.session.user.id
            };
            
            const formattedCustomer = {
              ...mockCustomer,
              zipCode: mockCustomer.zipcode
            };
            
            setCustomer(formattedCustomer);
            
            // Also set up mock job history and notes
            const mockJobHistory = generateMockJobHistory(id);
            setJobHistory(mockJobHistory);
            
            const mockNotes = generateMockNotes(id);
            setNotes(mockNotes);
            
            return;
          }
          
          console.error("No customer found with ID:", id);
          throw new Error(`Customer not found with ID: ${id}`);
        }

        console.log("Customer data retrieved:", customerData);
        const formattedCustomer = {
          ...customerData,
          zipCode: customerData.zipcode
        };
        setCustomer(formattedCustomer);

        // Load mock data for job history and notes
        // In a real application, these would be fetched from the database
        const mockJobHistory = generateMockJobHistory(id);
        setJobHistory(mockJobHistory);

        const mockNotes = generateMockNotes(id);
        setNotes(mockNotes);
      } catch (error) {
        console.error("Error in useCustomerDetail:", error);
        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
        setError(errorMessage);
        
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive"
        });
      } finally {
        setIsLoadingData(false);
      }
    };
    
    fetchCustomerDetails();
  }, [id, navigate, toast]);

  // Helper functions to generate mock data
  const generateMockJobHistory = (customerId: string): CustomerJobHistory[] => {
    return [{
      job_id: `${customerId}-J1`,
      job_number: 'J-2024-001',
      title: 'Bathroom Renovation',
      date: '2024-05-10',
      status: 'completed',
      amount: 4580
    }, {
      job_id: `${customerId}-J2`,
      job_number: 'J-2024-008',
      title: 'Kitchen Remodel',
      date: '2024-06-15',
      status: 'in-progress'
    }];
  };
  
  const generateMockNotes = (customerId: string): CustomerNote[] => {
    return [{
      id: `${customerId}-N1`,
      content: 'Customer prefers communication via email rather than calls.',
      created_at: '2024-04-05T10:30:00Z',
      created_by: 'John Smith',
      important: true
    }, {
      id: `${customerId}-N2`,
      content: 'Discussed potential kitchen renovation project for Q3.',
      created_at: '2024-05-20T14:15:00Z',
      created_by: 'John Smith',
      important: false
    }];
  };

  const handleAddNote = async (content: string, important: boolean) => {
    try {
      const newNote: CustomerNote = {
        id: `temp-${Date.now()}`,
        content,
        created_at: new Date().toISOString(),
        created_by: 'Current User',
        important
      };
      setNotes(prev => [newNote, ...prev]);
      toast({
        title: "Success",
        description: "Note added successfully"
      });
      return Promise.resolve();
    } catch (error) {
      console.error("Error adding note:", error);
      toast({
        title: "Error",
        description: "Failed to add note",
        variant: "destructive"
      });
      return Promise.reject(error);
    }
  };

  return {
    customer,
    notes,
    jobHistory,
    isLoadingData,
    error,
    handleAddNote
  };
};
