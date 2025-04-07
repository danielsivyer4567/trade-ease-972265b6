import React, { useState, useEffect } from 'react';
import { AppLayout } from "@/components/ui/AppLayout";
import { Button } from "@/components/ui/button";
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Search, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CustomerDetails } from './components/CustomerDetails';
import { useCustomers } from './hooks/useCustomers';
import { CustomerNote, CustomerJobHistory } from '@/pages/Banking/types';
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTabs } from '@/contexts/TabsContext';

export default function CustomerDetail() {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { customers, isLoading, fetchCustomers } = useCustomers();
  const [customer, setCustomer] = useState<any>(null);
  const [notes, setNotes] = useState<CustomerNote[]>([]);
  const [jobHistory, setJobHistory] = useState<CustomerJobHistory[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  const { addTab } = useTabs();

  useEffect(() => {
    fetchCustomers();
  }, []);

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

        const formattedCustomer = {
          ...customerData,
          zipCode: customerData.zipcode
        };
        setCustomer(formattedCustomer);
        
        if (formattedCustomer) {
          addTab({
            id: formattedCustomer.id,
            title: formattedCustomer.name,
            path: `/customers/${formattedCustomer.id}`
          });
        }

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
  }, [id, navigate, toast, addTab]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = customers.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.email && c.email.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredCustomers(filtered);
      setShowSearchResults(true);
    } else {
      setFilteredCustomers([]);
      setShowSearchResults(false);
    }
  }, [searchQuery, customers]);

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

  const handleCreateJob = (customerId: string) => {
    navigate(`/jobs/new?customer=${customerId}`);
  };

  const handleCreateQuote = (customerId: string) => {
    navigate(`/quotes/new?customer=${customerId}`);
  };

  const handleCustomerChange = (customerId: string) => {
    setHasUnsavedChanges(true);
    navigate(`/customers/${customerId}`);
    setSearchQuery('');
    setShowSearchResults(false);
  };

  const handleSaveAndContinue = () => {
    setHasUnsavedChanges(false);
    toast({
      title: "Success",
      description: "Changes saved successfully"
    });
  };

  const handleSaveAndExit = () => {
    setHasUnsavedChanges(false);
    toast({
      title: "Success",
      description: "Changes saved successfully"
    });
    navigate('/customers');
  };

  const handleTabChange = (tabId: string) => {
    if (hasUnsavedChanges) {
      if (confirm("You have unsaved changes. Are you sure you want to leave?")) {
        setHasUnsavedChanges(false);
        navigate(`/customers/${tabId}`);
      }
    } else {
      navigate(`/customers/${tabId}`);
    }
  };

  const handleCloseTab = (tabId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setCustomerTabs(prev => prev.filter(tab => tab.id !== tabId));
    
    if (tabId === activeTab) {
      const remainingTabs = customerTabs.filter(tab => tab.id !== tabId);
      if (remainingTabs.length > 0) {
        navigate(`/customers/${remainingTabs[0].id}`);
      } else {
        navigate('/customers');
      }
    }
  };

  if (isLoadingData || isLoading) {
    return <AppLayout>
        <div className="p-6 flex justify-center items-center h-full">
          <div className="animate-pulse text-center">
            <div className="h-8 bg-slate-200 rounded w-48 mx-auto mb-4"></div>
            <div className="h-4 bg-slate-200 rounded w-64 mx-auto"></div>
          </div>
        </div>
      </AppLayout>;
  }

  if (!customer) {
    return <AppLayout>
        <div className="p-6">
          <div className="text-center">
            <h1 className="text-xl font-bold mb-4">Customer not found</h1>
            <Button onClick={() => navigate('/customers')}>
              Back to Customers
            </Button>
          </div>
        </div>
      </AppLayout>;
  }

  return (
    <AppLayout>
      <div className="flex flex-col h-full">
        <div className="bg-white border-b p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search customers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full"
                />
              </div>
              
              {showSearchResults && (
                <div className="absolute z-50 mt-1 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                  {filteredCustomers.length > 0 ? (
                    filteredCustomers.map((c) => (
                      <div
                        key={c.id}
                        className="p-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                        onClick={() => handleCustomerChange(c.id)}
                      >
                        <div className="font-medium">{c.name}</div>
                        <div className="text-sm text-gray-500">{c.email}</div>
                      </div>
                    ))
                  ) : (
                    <div className="p-2 text-center text-gray-500">No customers found</div>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleSaveAndContinue} className="flex items-center gap-1">
                <Save className="h-4 w-4" />
                Save
              </Button>
              <Button onClick={handleSaveAndExit} className="flex items-center gap-1">
                <Save className="h-4 w-4" />
                Save & Exit
              </Button>
            </div>
          </div>
        </div>
        
        {customerTabs.length > 0 && (
          <div className="bg-white border-b overflow-x-auto">
            <div className="flex">
              {customerTabs.map((tab) => (
                <div
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center px-4 py-2 border-r cursor-pointer ${
                    activeTab === tab.id ? 'bg-blue-50 border-b-2 border-b-blue-500' : 'hover:bg-gray-50'
                  }`}
                >
                  <span className="truncate max-w-[150px]">{tab.name}</span>
                  <button
                    onClick={(e) => handleCloseTab(tab.id, e)}
                    className="ml-2 text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => navigate('/customers')} className="rounded-md border border-gray-300">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-2xl font-bold">{customer.name}</h1>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => navigate(`/customers/edit/${customer.id}`)} className="flex items-center gap-1">
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
                <Button variant="destructive" onClick={() => {
                  toast({
                    title: "Not implemented",
                    description: "Delete functionality will be implemented in future versions"
                  });
                }} className="flex items-center gap-1">
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
        </div>
      </div>
    </AppLayout>
  );
}
