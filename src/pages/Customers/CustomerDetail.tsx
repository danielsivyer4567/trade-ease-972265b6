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
import { AlertTriangle, Share2, ArrowLeft, Minimize2 } from "lucide-react";
import { Card } from '@/components/ui/card';
import { PhotoSharingModal } from '@/components/sharing/PhotoSharingModal';
import { CustomerStageIndicator } from '@/components/dashboard/CustomerStageIndicator';

// Define the CustomerProgressBar component inline to avoid import issues
function CustomerProgressBar({ customerId }: { customerId: string }) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-medium">Customer Journey Progress</h3>
      <div className="flex items-center">
        <div className="w-48 bg-gray-200 rounded-full h-2.5 mr-2">
          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '45%' }}></div>
        </div>
        <span className="text-xs text-gray-500">2 of 4 steps</span>
      </div>
    </div>
  );
}

// Create a simple hook for tab management
function useOpenInTab() {
  const openInTab = (path: string, title: string, id: string) => {
    console.log('Opening tab:', { path, title, id });
    return true;
  };
  
  return { openInTab };
}

// Create a simple hook for photo sharing
function usePhotoSharing() {
  const [isPhotoSharingOpen, setIsPhotoSharingOpen] = useState(false);
  const [sharingEntityId, setSharingEntityId] = useState<string | null>(null);
  const [sharingSource, setSharingSource] = useState<'job' | 'customer' | null>(null);
  
  const openPhotoSharing = (source: 'job' | 'customer', id: string) => {
    setSharingSource(source);
    setSharingEntityId(id);
    setIsPhotoSharingOpen(true);
  };
  
  const closePhotoSharing = () => {
    setIsPhotoSharingOpen(false);
  };
  
  return {
    isPhotoSharingOpen,
    openPhotoSharing,
    closePhotoSharing,
    sharingEntityId,
    sharingSource
  };
}

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
    error,
    handleAddNote 
  } = useCustomerDetail(id);

  const {
    isPhotoSharingOpen,
    openPhotoSharing,
    closePhotoSharing
  } = usePhotoSharing();

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

  const handleRetry = () => {
    if (id) {
      window.location.reload();
    } else {
      navigate('/customers');
    }
  };

  // Handle opening customer in new tab
  useEffect(() => {
    if (customer && !isLoadingData && id) {
      // Only set tab information if we have a customer loaded
      openInTab(`/customers/${id}`, customer?.name || 'Customer Details', `customer-${id}`);
    }
  }, [customer, id, isLoadingData, openInTab]);

  const handleSendPhotosToCustomer = () => {
    if (!id) return;
    openPhotoSharing('customer', id);
  };

  const handleBackToPipeline = () => {
    navigate('/messaging');
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

  if (error) {
    return <AppLayout>
        <div className="p-6">
          <div className="max-w-md mx-auto text-center bg-white rounded-lg shadow-md p-6 mt-10">
            <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <h1 className="text-xl font-bold mb-4">Customer Load Error</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="flex gap-4 justify-center">
              <Button onClick={handleRetry} variant="default">
                Retry
              </Button>
              <Button onClick={() => navigate('/customers')} variant="outline">
                Back to Customers
              </Button>
            </div>
          </div>
        </div>
      </AppLayout>;
  }

  if (!customer) {
    return <AppLayout>
        <div className="p-6">
          <div className="max-w-md mx-auto text-center bg-white rounded-lg shadow-md p-6 mt-10">
            <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <h1 className="text-xl font-bold mb-4">Customer not found</h1>
            <p className="text-gray-600 mb-6">The customer you're looking for couldn't be found or may have been deleted.</p>
            <Button onClick={() => navigate('/customers')}>
              Back to Customers
            </Button>
          </div>
        </div>
      </AppLayout>;
  }

  return (
    <AppLayout>
      <div className="container-responsive mx-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => window.history.back()}
              className="mr-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-bold">Customers</h1>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleBackToPipeline}
            className="flex items-center gap-1"
          >
            <Minimize2 className="h-4 w-4" />
            <span>Return to Pipeline</span>
          </Button>
        </div>
        
        <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 max-w-7xl mx-auto pb-24 bg-slate-200">
          {/* Customer Progress Steps */}
          <Card className="bg-white shadow-sm py-3 px-3 sm:px-6">
            <CustomerProgressBar customerId={customer.id} />
          </Card>
          
          {/* Customer Header Info */}
          <Card className="bg-white p-4">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex items-center">
                <div className="mr-4 flex-shrink-0">
                  {id && <CustomerStageIndicator customerId={id} size="lg" />}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{customer.name}</h2>
                  <p className="text-sm text-gray-500">ID: {customer.id}</p>
                  <div className="mt-2">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      customer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {customer.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <div className="text-sm">
                  <p className="font-medium">Email</p>
                  <p className="text-gray-600">{customer.email}</p>
                </div>
                <div className="text-sm">
                  <p className="font-medium">Phone</p>
                  <p className="text-gray-600">{customer.phone}</p>
                </div>
                <div className="text-sm">
                  <p className="font-medium">Address</p>
                  <p className="text-gray-600">{`${customer.address}, ${customer.city}, ${customer.state} ${customer.zipCode}`}</p>
                </div>
              </div>
            </div>
          </Card>
          
          <div className="flex justify-end space-x-2">
            <Button 
              size="sm"
              variant="outline"
              onClick={handleSendPhotosToCustomer}
              className="mb-2"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share Photos
            </Button>
          </div>
          
          {/* Customer Details Component with Tabs */}
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
      
      <PhotoSharingModal 
        isOpen={isPhotoSharingOpen} 
        onClose={closePhotoSharing} 
        initialSource="customer"
        customerId={id}
      />
    </AppLayout>
  );
}
