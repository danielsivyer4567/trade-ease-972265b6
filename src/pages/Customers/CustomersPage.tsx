import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  ArrowLeft, 
  Loader2, 
  Search, 
  Filter, 
  SortAsc, 
  SortDesc, 
  User, 
  Phone, 
  Mail, 
  Home, 
  Calendar, 
  Clock, 
  Link as LinkIcon, 
  Copy, 
  CheckCircle2, 
  Circle,
  PenLine
} from 'lucide-react';
import { BaseLayout } from '@/components/ui/BaseLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { fetchCustomersFromAPI } from '@/services/api';
import { CustomerData } from '@/pages/Customers/components/CustomerCard';
import { supabase } from '@/integrations/supabase/client';

// Extended interface for Customer with additional fields needed for the page
interface Customer extends CustomerData {
  progress?: number;
  lastContact?: string;
  jobId?: string;
  jobTitle?: string;
  stepCompleted?: number;
  totalSteps?: number;
}

// API function to fetch customers
const fetchCustomers = async (): Promise<Customer[]> => {
  try {
    // Use directly from database via useCustomers hook
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) {
      throw new Error("Authentication required to view customers");
    }

    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('user_id', session.session.user.id)
      .order('name');
      
    if (error) {
      throw error;
    }
    
    // Map database fields to match the Customer interface format
    const formattedData = data.map(customer => ({
      id: customer.id,
      name: customer.name,
      email: customer.email || '',
      phone: customer.phone || '',
      address: customer.address || '',
      city: customer.city || '',
      state: customer.state || '',
      zipCode: customer.zipcode || '',
      status: customer.status as 'active' | 'inactive',
      progress: Math.floor(Math.random() * 100), // TODO: Replace with actual progress from jobs table
      lastContact: customer.last_contact || new Date().toISOString().split('T')[0],
      jobId: `JOB-${customer.id.substring(0, 4)}`, // TODO: Replace with latest job ID
      jobTitle: 'Current Job' // TODO: Replace with actual job title
    }));
    
    return formattedData;
  } catch (error) {
    console.error('Error fetching customers from database:', error);
    throw error;
  }
};

type SortField = 'name' | 'status' | 'progress';
type SortOrder = 'asc' | 'desc';

function CustomersPage() {
  const { auditId } = useParams<{ auditId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State for search, filter, and sort
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const { isLoading, isError, data: customers, error } = useQuery({
    queryKey: ['customers'], 
    queryFn: fetchCustomers,
  });

  const handleViewCustomerDetails = (customer: Customer) => {
    setSelectedCustomer(customer);
  };

  const handleCopyLink = () => {
    if (selectedCustomer) {
      const link = `${window.location.origin}/progress/${selectedCustomer.id}`;
      navigator.clipboard.writeText(link);
      toast({
        title: "Link copied to clipboard",
        description: "Share this link with your customer",
      });
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleEditCustomer = (customerId: string) => {
    console.log("Edit button clicked for customer ID:", customerId);
    
    // Navigate to the customer edit page
    // Use navigate to go to edit page, which should trigger a page load
    try {
      console.log(`Navigating to: /customers/${customerId}/edit`);
      navigate(`/customers/${customerId}/edit`);
    } catch (error) {
      console.error("Navigation error:", error);
      // Fallback: try direct window location change
      window.location.href = `/customers/${customerId}/edit`;
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
          (customer.phone && customer.phone.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (customer.address && customer.address.toLowerCase().includes(searchTerm.toLowerCase()));
        
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
        } else if (sortField === 'progress') {
          const progressA = a.progress || 0;
          const progressB = b.progress || 0;
          return sortOrder === 'asc'
            ? progressA - progressB
            : progressB - progressA;
        }
        return 0;
      });
  }, [customers, searchTerm, statusFilter, sortField, sortOrder]);

  // Set first customer as selected on load if none selected
  useEffect(() => {
    if (!selectedCustomer && filteredAndSortedCustomers.length > 0) {
      setSelectedCustomer(filteredAndSortedCustomers[0]);
    }
  }, [filteredAndSortedCustomers, selectedCustomer]);

  if (isLoading) {
    return (
      <BaseLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <span className="ml-2 text-lg">Loading customers...</span>
        </div>
      </BaseLayout>
    );
  }

  if (isError) {
    return (
      <BaseLayout>
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
      </BaseLayout>
    );
  }

  return (
    <BaseLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-gray-900">Customers</h2>
            <Badge variant="outline" className="ml-2">{filteredAndSortedCustomers.length}</Badge>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/customers/new')}>Add Customer</Button>
            <Button>New Job</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Customer List Panel */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex gap-2 mb-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="flex gap-2 mb-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleSort('name')}
                className={sortField === 'name' ? 'bg-muted' : ''}
              >
                Name {sortField === 'name' && (sortOrder === 'asc' ? <SortAsc className="w-4 h-4 ml-1" /> : <SortDesc className="w-4 h-4 ml-1" />)}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleSort('progress')}
                className={sortField === 'progress' ? 'bg-muted' : ''}
              >
                Progress {sortField === 'progress' && (sortOrder === 'asc' ? <SortAsc className="w-4 h-4 ml-1" /> : <SortDesc className="w-4 h-4 ml-1" />)}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleSort('status')}
                className={sortField === 'status' ? 'bg-muted' : ''}
              >
                Status {sortField === 'status' && (sortOrder === 'asc' ? <SortAsc className="w-4 h-4 ml-1" /> : <SortDesc className="w-4 h-4 ml-1" />)}
              </Button>
            </div>

            <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-2">
              {filteredAndSortedCustomers.length > 0 ? (
                filteredAndSortedCustomers.map((customer) => (
                  <Card 
                    key={customer.id}
                    className={`cursor-pointer hover:shadow transition-shadow ${
                      selectedCustomer?.id === customer.id ? 'border-2 border-primary' : ''
                    }`}
                    onClick={() => handleViewCustomerDetails(customer)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <h3 
                            className="font-medium cursor-pointer hover:text-blue-600 hover:underline"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/customers/${customer.id}`);
                            }}
                          >
                            {customer.name}
                          </h3>
                          <p className="text-xs text-muted-foreground">{customer.jobTitle}</p>
                        </div>
                        <Badge variant={customer.status === 'active' ? 'default' : 'secondary'}>
                          {customer.status}
                        </Badge>
                      </div>
                      <Progress value={customer.progress} className="h-2 mb-2" />
                      <div className="text-xs text-muted-foreground flex justify-between">
                        <span>Job Progress: {customer.progress}%</span>
                        <span>Last Contact: {customer.lastContact}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12 bg-muted rounded-lg">
                  <p className="text-muted-foreground">
                    {searchTerm || statusFilter !== 'all' 
                      ? 'No customers match your search criteria.' 
                      : 'No customers found.'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Customer Details Panel */}
          <div className="md:col-span-2 space-y-6">
            {selectedCustomer ? (
              <>
                <Card>
                  <CardHeader className="bg-muted pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle 
                        className="cursor-pointer hover:text-blue-600 hover:underline"
                        onClick={() => navigate(`/customers/${selectedCustomer.id}`)}
                      >
                        {selectedCustomer.name}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex items-center gap-1"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent event from bubbling up
                            handleEditCustomer(selectedCustomer.id);
                          }}
                        >
                          <PenLine className="h-4 w-4" />
                          <span>Edit</span>
                        </Button>
                        <Badge variant={selectedCustomer.status === 'active' ? 'default' : 'secondary'}>
                          {selectedCustomer.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Mail className="w-5 h-5 text-muted-foreground" />
                          <span>{selectedCustomer.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-5 h-5 text-muted-foreground" />
                          <span>{selectedCustomer.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Home className="w-5 h-5 text-muted-foreground" />
                          <span>{selectedCustomer.address}</span>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-muted-foreground" />
                          <span>Last Contact: {selectedCustomer.lastContact}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="bg-muted pb-2">
                    <CardTitle>Customer Progress Link</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Share this link with your customer to keep them updated on job progress
                    </p>
                    
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center">
                        <div className="font-medium">Select Job for Progress Link</div>
                      </div>
                      
                      <select 
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        defaultValue={selectedCustomer.jobId}
                      >
                        <option value={selectedCustomer.jobId}>
                          {selectedCustomer.jobTitle} ({selectedCustomer.jobId})
                        </option>
                      </select>
                      
                      <div className="flex justify-between items-center">
                        <div className="relative flex-1">
                          <input 
                            type="text" 
                            readOnly
                            value={`${window.location.origin}/progress/${selectedCustomer.id}`}
                            className="w-full p-2 pr-10 border border-gray-300 rounded-lg bg-muted"
                          />
                        </div>
                        <Button variant="outline" size="icon" className="ml-2" onClick={handleCopyLink}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="enable-notifications" className="rounded" defaultChecked />
                        <label htmlFor="enable-notifications">Enable notifications</label>
                      </div>
                      
                      <Button variant="outline" className="flex items-center gap-2 w-fit">
                        <LinkIcon className="h-4 w-4" />
                        <span>Preview Link</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[50vh] bg-muted rounded-lg p-6">
                <User className="w-16 h-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No Customer Selected</h3>
                <p className="text-muted-foreground text-center">
                  Select a customer from the list to view their details and progress
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}

export default CustomersPage; 