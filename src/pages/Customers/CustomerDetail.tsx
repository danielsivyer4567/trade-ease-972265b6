
import React, { useState, useEffect } from 'react';
import { AppLayout } from "@/components/ui/AppLayout";
import { Button } from "@/components/ui/button";
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { CustomerDetails } from './components/CustomerDetails';
import { useCustomers } from './hooks/useCustomers';
import { useTabNavigation } from '@/hooks/useTabNavigation';
import { useCustomerDetail } from './hooks/useCustomerDetail';
import { CustomerDetailHeader } from './components/CustomerDetailHeader';
import { CustomerSearch } from './components/CustomerSearch';
import { CustomerSaveActions } from './components/CustomerSaveActions';

export default function CustomerDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { customers, isLoading, fetchCustomers } = useCustomers();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  const { openInTab } = useTabNavigation();
  const { 
    customer, 
    notes, 
    jobHistory, 
    isLoadingData, 
    handleAddNote 
  } = useCustomerDetail(id);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

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

  // Handle opening customer in new tab
  useEffect(() => {
    if (customer && !isLoadingData && id) {
      // Only set tab information if we have a customer loaded
      openInTab(`/customers/${id}`, customer?.name || 'Customer Details', `customer-${id}`);
    }
  }, [customer, id, isLoadingData, openInTab]);

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
      <div className="flex flex-col h-full w-full">
        <div className="bg-white border-b p-3 sm:p-4 shadow-sm fixed top-16 left-0 right-0 z-10">
          <div className="flex flex-col sm:flex-row gap-3 max-w-5xl mx-auto">
            <CustomerSearch 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filteredCustomers={filteredCustomers}
              onCustomerChange={handleCustomerChange}
              showSearchResults={showSearchResults}
              setShowSearchResults={setShowSearchResults}
            />
            
            <CustomerSaveActions 
              onSaveAndContinue={handleSaveAndContinue}
              onSaveAndExit={handleSaveAndExit}
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto pt-24 sm:pt-28 p-3 sm:p-6 bg-slate-50">
          <div className="max-w-5xl mx-auto">
            <CustomerDetailHeader 
              customerId={customer.id} 
              customerName={customer.name} 
            />
            
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
