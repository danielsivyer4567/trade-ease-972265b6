import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';

// Define the Customer interface (as updated by Cursor)
interface Customer {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  status?: 'active' | 'inactive' | 'pending';
  notes?: string;
  // ... other optional fields
}

// Replace with your actual API endpoint
const fetchCustomerDetails = async ({ auditId, customerId }: { auditId: string; customerId: string }): Promise<Customer> => {
  const response = await fetch(`/api/audits/${auditId}/customers/${customerId}`);
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Customer details not found');
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

function CustomerDetails() {
  const { auditId, customerId } = useParams<{ auditId: string; customerId: string }>();
  const navigate = useNavigate();

  const { isLoading, isError, data: customer, error, refetch } = useQuery({
    queryKey: ['customerDetails', auditId, customerId],
    queryFn: () => fetchCustomerDetails({ auditId: auditId!, customerId: customerId! }), // Non-null assertions since enabled is true
    enabled: !!auditId && !!customerId,
    retry: 2,
  });

  const handleCreateQuote = () => {
    navigate(`/quote/create?auditId=${auditId}&customerId=${customerId}`);
  };

  const handleGoBack = () => {
    navigate(`/customers/${auditId}`);
  };

  const handleRetry = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-2 text-lg">Loading customer details...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md">
          <h3 className="text-red-800 font-medium">Error loading customer details</h3>
          <p className="text-red-600 mt-1">{error?.message}</p>
          <Button onClick={handleRetry}>Retry</Button>
          <Button onClick={handleGoBack}>Back to Customers</Button>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md">
          <h3 className="text-yellow-800 font-medium">Customer Not Found</h3>
          <p className="text-yellow-600 mt-1">The requested customer could not be found.</p>
          <Button onClick={handleGoBack}>Back to Customers</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Button 
          onClick={handleGoBack}
          variant="ghost"
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors p-0"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Customers
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{customer.name}</h2>
            <p className="text-sm text-gray-500">ID: {customer.id}</p>
          </div>
          {customer.status && (
            <span className={`px-3 py-1 rounded-full text-sm ${
              customer.status === 'active' 
                ? 'bg-green-100 text-green-800' 
                : customer.status === 'inactive' 
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
            }`}>
              {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {customer.email && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                <p className="mt-1 text-gray-900">{customer.email}</p>
              </div>
            )}
            
            {customer.phone && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                <p className="mt-1 text-gray-900">{customer.phone}</p>
              </div>
            )}
            
            {customer.address && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Address</h3>
                <p className="mt-1 text-gray-900">{customer.address}</p>
              </div>
            )}
          </div>

          {customer.notes && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Notes</h3>
              <p className="mt-1 text-gray-900 whitespace-pre-line">{customer.notes}</p>
            </div>
          )}
        </div>

        <div className="mt-6">
          <Button onClick={handleCreateQuote}>Create Quote</Button>
          <Button onClick={handleGoBack}>Back to Customers</Button>
        </div>
      </div>
    </div>
  );
}

export default CustomerDetails; 