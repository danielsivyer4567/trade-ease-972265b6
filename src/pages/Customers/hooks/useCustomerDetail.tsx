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
  const [addresses, setAddresses] = useState<any[]>([]);
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
        
        if (!customerData) {
          console.error("No customer found with ID:", id);
          throw new Error(`Customer not found with ID: ${id}`);
        }

        console.log("Customer data retrieved:", customerData);
        const formattedCustomer = {
          ...customerData,
          zipCode: customerData.zipcode
        };
        setCustomer(formattedCustomer);

        // Fetch job history from database
        const { data: jobHistoryData, error: jobHistoryError } = await supabase
          .from('jobs')
          .select('*')
          .eq('customer_id', id)
          .order('created_at', { ascending: false });
          
        if (jobHistoryError) {
          console.error("Error fetching job history:", jobHistoryError);
        } else {
          // Map database data to expected format
          const formattedJobHistory = jobHistoryData?.map(job => ({
            job_id: job.id,
            job_number: job.job_number || `J-${job.id.substring(0, 8)}`,
            title: job.title || 'Untitled Job',
            date: job.created_at,
            status: job.status || 'pending',
            amount: job.total_amount
          })) || [];
          
          setJobHistory(formattedJobHistory);
        }

        // Fetch customer notes from database
        const { data: notesData, error: notesError } = await supabase
          .from('customer_notes')
          .select('*')
          .eq('customer_id', id)
          .order('created_at', { ascending: false });
          
        if (notesError) {
          console.error("Error fetching customer notes:", notesError);
        } else {
          // Map database data to expected format
          const formattedNotes = notesData?.map(note => ({
            id: note.id,
            content: note.content,
            created_at: note.created_at,
            created_by: note.created_by || 'System',
            important: note.important || false
          })) || [];
          
          setNotes(formattedNotes);
        }

        // Fetch job site addresses from database
        const { data: addressesData, error: addressesError } = await supabase
          .from('customer_addresses')
          .select('*')
          .eq('customer_id', id);
        if (addressesError) {
          console.error("Error fetching addresses:", addressesError);
        } else {
          setAddresses(addressesData || []);
        }
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
    addresses,
    isLoadingData,
    error,
    handleAddNote
  };
};
