
import React, { useState, useEffect } from 'react';
import { AppLayout } from "@/components/ui/AppLayout";
import { Button } from "@/components/ui/button";
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CustomerDetails } from './components/CustomerDetails';
import { useCustomers } from './hooks/useCustomers';
import { CustomerNote, CustomerJobHistory } from '@/pages/Banking/types';
import { supabase } from "@/integrations/supabase/client";

export default function CustomerDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isLoading } = useCustomers();
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

        // Fetch customer data
        const { data: customerData, error: customerError } = await supabase
          .from('customers')
          .select('*')
          .eq('id', id)
          .single();

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

        // Format customer data with correct property names
        const formattedCustomer = {
          ...customerData,
          zipCode: customerData.zipcode // Map zipcode from DB to zipCode for UI consistency
        };
        
        setCustomer(formattedCustomer);

        // Fetch customer jobs (in a real implementation)
        // For now we'll just mock this data
        const mockJobHistory: CustomerJobHistory[] = [
          {
            job_id: '1',
            job_number: 'J-2024-001',
            title: 'Bathroom Renovation',
            date: '2024-05-10',
            status: 'completed',
            amount: 4580
          },
          {
            job_id: '2',
            job_number: 'J-2024-008',
            title: 'Kitchen Remodel',
            date: '2024-06-15',
            status: 'in-progress'
          }
        ];
        
        setJobHistory(mockJobHistory);
        
        // Mock customer notes
        const mockNotes: CustomerNote[] = [
          {
            id: '1',
            content: 'Customer prefers communication via email rather than calls.',
            created_at: '2024-04-05T10:30:00Z',
            created_by: 'John Smith',
            important: true
          },
          {
            id: '2',
            content: 'Discussed potential kitchen renovation project for Q3.',
            created_at: '2024-05-20T14:15:00Z',
            created_by: 'John Smith',
            important: false
          }
        ];
        
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
      // In real implementation, save note to database
      // For now, just add to local state
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

  const handleCreateJob = (customerId: string) => {
    navigate(`/jobs/new?customer=${customerId}`);
  };

  const handleCreateQuote = (customerId: string) => {
    navigate(`/quotes/new?customer=${customerId}`);
  };

  if (isLoadingData || isLoading) {
    return (
      <AppLayout>
        <div className="p-6 flex justify-center items-center h-full">
          <div className="animate-pulse text-center">
            <div className="h-8 bg-slate-200 rounded w-48 mx-auto mb-4"></div>
            <div className="h-4 bg-slate-200 rounded w-64 mx-auto"></div>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!customer) {
    return (
      <AppLayout>
        <div className="p-6">
          <div className="text-center">
            <h1 className="text-xl font-bold mb-4">Customer not found</h1>
            <Button onClick={() => navigate('/customers')}>
              Back to Customers
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate('/customers')} className="rounded-md border border-gray-300">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">{customer.name}</h1>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigate(`/customers/edit/${customer.id}`)}
              className="flex items-center gap-1"
            >
              <Edit className="h-4 w-4" />
              Edit
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                // Implement delete functionality
                toast({
                  title: "Not implemented",
                  description: "Delete functionality will be implemented in future versions",
                });
              }}
              className="flex items-center gap-1"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
        
        <CustomerDetails 
          customer={customer}
          notes={notes}
          jobHistory={jobHistory}
          onAddNote={handleAddNote}
          onCreateJob={handleCreateJob}
          onCreateQuote={handleCreateQuote}
        />
      </div>
    </AppLayout>
  );
}
