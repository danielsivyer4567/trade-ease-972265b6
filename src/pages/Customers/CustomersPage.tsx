import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Loader2, Search, Filter, SortAsc, SortDesc } from 'lucide-react';

// Define the interface for your Customer object
interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  status?: 'active' | 'inactive';
  // other properties
}

// Replace with your actual API endpoint
const fetchCustomersByAuditId = async (auditId: string): Promise<Customer[]> => {
  const response = await fetch(`/api/audits/${auditId}/customers`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

type SortField = 'name' | 'status';
type SortOrder = 'asc' | 'desc';

function CustomersPage() {
  const { auditId } = useParams<{ auditId: string }>();
  const navigate = useNavigate();
  
  // State for search, filter, and sort
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const { isLoading, isError, data: customers, error } = useQuery({
    queryKey: ['customers', auditId], // Unique key for this query, will refetch if auditId changes
    queryFn: () => fetchCustomersByAuditId(auditId),
    enabled: !!auditId, // Only run the query if auditId is available
  });

  const handleViewCustomerDetails = (customerId: string) => {
    navigate(`/customers/${auditId}/${customerId}`);
  };

  const handleBack = () => {
    navigate('/site-audits');
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Filter and sort customers
  const filteredAndSortedCustomers = useMemo(() => {
    if (!customers) return [];
    
    return customers
      .filter(customer => {
        // Apply search filter
        const matchesSearch = searchTerm === '' || 
          customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (customer.phone && customer.phone.toLowerCase().includes(searchTerm.toLowerCase()));
        
        // Apply status filter
        const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
        
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        // Apply sorting
        if (sortField === 'name') {
          return sortOrder === 'asc' 
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        } else if (sortField === 'status') {
          const statusA = a.status || 'inactive';
          const statusB = b.status || 'inactive';
          return sortOrder === 'asc'
            ? statusA.localeCompare(statusB)
            : statusB.localeCompare(statusA);
        }
        return 0;
      });
  }, [customers, searchTerm, statusFilter, sortField, sortOrder]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-2 text-lg">Loading customers...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md">
          <h3 className="text-red-800 font-medium">Error loading customers</h3>
          <p className="text-red-600 mt-1">{error?.message}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={handleBack}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Audits
        </button>
        <h2 className="text-2xl font-bold text-gray-900">Customers for Audit: {auditId}</h2>
      </div>

      {/* Search, Filter, and Sort Controls */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex items-center">
          <Filter className="w-5 h-5 text-gray-400 mr-2" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleSort('name')}
            className={`flex items-center px-3 py-2 rounded-lg ${
              sortField === 'name' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
            }`}
          >
            Name
            {sortField === 'name' && (
              sortOrder === 'asc' ? <SortAsc className="w-4 h-4 ml-1" /> : <SortDesc className="w-4 h-4 ml-1" />
            )}
          </button>
          <button
            onClick={() => handleSort('status')}
            className={`flex items-center px-3 py-2 rounded-lg ${
              sortField === 'status' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
            }`}
          >
            Status
            {sortField === 'status' && (
              sortOrder === 'asc' ? <SortAsc className="w-4 h-4 ml-1" /> : <SortDesc className="w-4 h-4 ml-1" />
            )}
          </button>
        </div>
      </div>

      {filteredAndSortedCustomers.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredAndSortedCustomers.map((customer) => (
            <div 
              key={customer.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-medium text-gray-900">{customer.name}</h3>
                  <p className="text-sm text-gray-500">ID: {customer.id}</p>
                </div>
                {customer.status && (
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    customer.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                  </span>
                )}
              </div>
              
              {(customer.email || customer.phone) && (
                <div className="space-y-1 mb-4">
                  {customer.email && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Email:</span> {customer.email}
                    </p>
                  )}
                  {customer.phone && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Phone:</span> {customer.phone}
                    </p>
                  )}
                </div>
              )}

              <button 
                onClick={() => handleViewCustomerDetails(customer.id)}
                className="w-full px-4 py-2 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">
            {searchTerm || statusFilter !== 'all' 
              ? 'No customers match your search criteria.' 
              : 'No customers found for this audit.'}
          </p>
        </div>
      )}
    </div>
  );
}

export default CustomersPage; 