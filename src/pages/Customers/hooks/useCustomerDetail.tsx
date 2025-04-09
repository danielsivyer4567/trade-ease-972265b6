
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

  useEffect(() => {
    if (!id) return;
    
    const fetchCustomerDetails = async () => {
      setIsLoadingData(true);
      try {
        const { data: session } = await supabase.auth.getSession();
        if (!session?.session?.user) {
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
          
        if (customerError || !customerData) {
          console.error("Error fetching customer:", customerError);
          toast({
            title: "Error",
            description: "Failed to load customer details",
            variant: "destructive"
          });
          navigate('/customers');
          return;
        }

        const formattedCustomer = {
          ...customerData,
          zipCode: customerData.zipcode
        };
        setCustomer(formattedCustomer);

        const mockJobHistory: CustomerJobHistory[] = [{
          job_id: '1',
          job_number: 'J-2024-001',
          title: 'Bathroom Renovation',
          date: '2024-05-10',
          status: 'completed',
          amount: 4580
        }, {
          job_id: '2',
          job_number: 'J-2024-008',
          title: 'Kitchen Remodel',
          date: '2024-06-15',
          status: 'in-progress'
        }];
        setJobHistory(mockJobHistory);

        const mockNotes: CustomerNote[] = [{
          id: '1',
          content: 'Customer prefers communication via email rather than calls.',
          created_at: '2024-04-05T10:30:00Z',
          created_by: 'John Smith',
          important: true
        }, {
          id: '2',
          content: 'Discussed potential kitchen renovation project for Q3.',
          created_at: '2024-05-20T14:15:00Z',
          created_by: 'John Smith',
          important: false
        }];
        setNotes(mockNotes);
      } catch (error) {
        console.error("Error fetching customer details:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred while loading customer details",
          variant: "destructive"
        });
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchCustomerDetails();
  }, [id, navigate, toast]);

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
    handleAddNote
  };
};
