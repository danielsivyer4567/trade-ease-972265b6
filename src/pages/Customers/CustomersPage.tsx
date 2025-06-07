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
  PenLine,
  ExternalLink,
  Briefcase
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
import { supabase } from '@/integrations/supabase/client';
import { Timeline } from './components/Timeline';
import { useAuth } from '@/contexts/AuthContext';
import { useCustomers, Customer as CustomerType } from './hooks/useCustomers';
import { CreateDemoUser } from '../Auth/components/CreateDemoUser';

// Extended interface for Customer with additional fields needed for the page
interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  status: 'active' | 'inactive' | 'previous';
  progress?: number;
  lastContact?: string;
  jobId?: string;
  jobTitle?: string;
  stepCompleted?: number;
  totalSteps?: number;
  customer_code?: string;
  jobsQty?: number;
  quotesQty?: number;
  invoicesQty?: number;
  quickPayment?: boolean;
}

// API function to fetch customers
const fetchCustomers = async (user): Promise<Customer[]> => {
  console.log('Fetching customers...');
  try {
    // Check for authenticated user
    if (!user) {
      console.error('No authenticated user found');
      throw new Error("Authentication required to view customers");
    }

    console.log('Fetching customers for user:', user.id);
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('user_id', user.id)
      .order('name');
      
    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    
    console.log('Customers fetched successfully:', data?.length || 0);
    
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
      status: customer.status as 'active' | 'inactive' | 'previous',
      progress: Math.floor(Math.random() * 100), // TODO: Replace with actual progress from jobs table
      lastContact: customer.last_contact || new Date().toISOString().split('T')[0],
      jobId: `JOB-${customer.id.substring(0, 4)}`, // TODO: Replace with latest job ID
      jobTitle: '', // Will be populated from actual job data
      customer_code: customer.customer_code, // Include the customer_code
      jobsQty: customer.jobs_qty || 0,
      quotesQty: customer.quotes_qty || 0,
      invoicesQty: customer.invoices_qty || 0,
      quickPayment: customer.quick_payment === 'yes'
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
  const { user, loading: authLoading } = useAuth();
  
  // State for search, filter, and sort
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'previous'>('all');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [quotesStats, setQuotesStats] = useState<Record<string, { total: number; accepted: number; denied: number }>>({});
  const [showJourneyModal, setShowJourneyModal] = useState(false);
  const [workflowSteps, setWorkflowSteps] = useState([]);

  // Use the custom hook to get the actual implementation
  const { customers: hookCustomers, isLoading: hookLoading, error: hookError } = useCustomers();

  // Fallback to React Query if the hook fails
  const { isLoading: queryLoading, isError: queryIsError, data: queryCustomers, error: queryError, refetch } = useQuery({
    queryKey: ['customers'], 
    queryFn: () => fetchCustomers(user),
    enabled: !!user && (!hookCustomers || hookCustomers.length === 0), // Only run if hook failed
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Determine actual data source - make sure types are compatible
  const customers: Customer[] = useMemo(() => {
    if (hookCustomers && hookCustomers.length > 0) {
      // Map hookCustomers to our Customer interface
      return hookCustomers.map(c => ({
        id: c.id,
        name: c.name,
        email: c.email,
        phone: c.phone,
        address: c.address,
        city: c.city,
        state: c.state,
        zipCode: c.zipCode,
        status: c.status as 'active' | 'inactive' | 'previous',
        progress: Math.floor(Math.random() * 100),
        lastContact: c.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
        jobId: `JOB-${c.id.substring(0, 4)}`,
        jobTitle: '',
        customer_code: c.customer_code,
        jobsQty: 0,
        quotesQty: 0,
        invoicesQty: 0,
        quickPayment: false
      }));
    }
    return queryCustomers || [];
  }, [hookCustomers, queryCustomers]);

  const isLoading = authLoading || hookLoading || queryLoading;
  const error = hookError || queryError;
  const isError = !!error || (queryIsError && (!customers || customers.length === 0));

  // Try to refetch when auth state changes
  useEffect(() => {
    if (user && !authLoading && (!customers || customers.length === 0)) {
      refetch().catch(err => {
        console.error('Error refetching customers:', err);
      });
    }
  }, [user, authLoading, refetch, customers]);

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

  const handleWorkflowStepAction = (stepId: string) => {
    setWorkflowSteps(prevSteps => prevSteps.map(step => 
      step.id === stepId ? { ...step, isActioned: true, requiresAction: false } : step
    ));
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

  if (authLoading) {
    return (
      <BaseLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <span className="ml-2 text-lg">Checking authentication...</span>
        </div>
      </BaseLayout>
    );
  }
  
  if (!user) {
    return (
      <BaseLayout>
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md">
            <h3 className="text-red-800 font-medium">Authentication Required</h3>
            <p className="text-red-600 mt-1">You need to be signed in to view customers.</p>
            <div className="mt-4 space-y-4">
              <Button 
                onClick={() => navigate('/auth')} 
                className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Sign In
              </Button>
              <CreateDemoUser />
              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm text-gray-600 mb-2">Having issues with authentication?</p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate('/debug/auth')}
                >
                  Run Authentication Diagnostics
                </Button>
              </div>
            </div>
          </div>
        </div>
      </BaseLayout>
    );
  }

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
            <p className="text-red-600 mt-1">{error instanceof Error ? error.message : "Unknown error"}</p>
            <div className="flex gap-2 mt-4">
              <Button 
                onClick={() => refetch()} 
                className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
              >
                Try Again
              </Button>
              <Button 
                onClick={() => navigate('/')} 
                variant="outline"
                className="px-4 py-2 rounded"
              >
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </BaseLayout>
    );
  }

  return (
    <BaseLayout>
      <div className="container mx-auto px-0 py-8">
        <div className="flex items-center justify-between mb-6 px-4">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-gray-900">Customers</h2>
            <Badge variant="outline" className="ml-2">{filteredAndSortedCustomers.length}</Badge>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="w-48" onClick={() => navigate('/customers/console')}>Customer Console</Button>
            <Button variant="outline" className="w-48" onClick={() => navigate('/customers/external')}>External View</Button>
            <Button className="w-48" onClick={() => navigate('/customers/new')}>Add Customer</Button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4">
          {/* Left: Customer List */}
          <div className="col-span-12 md:col-span-3 bg-white rounded-lg shadow-md flex flex-col h-[80vh]">
            {/* Sticky header for search/filters */}
            <div className="sticky top-0 z-10 bg-white p-4 border-b flex flex-col gap-2">
              <Input
                type="text"
                placeholder="Search customers by name, email, ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10"
              />
              <div className="flex gap-2">
                <Button size="sm" variant={statusFilter === 'all' ? 'default' : 'outline'} onClick={() => setStatusFilter('all')}>All</Button>
                <Button size="sm" variant={statusFilter === 'active' ? 'default' : 'outline'} onClick={() => setStatusFilter('active')}>Active</Button>
                <Button size="sm" variant={statusFilter === 'inactive' ? 'default' : 'outline'} onClick={() => setStatusFilter('inactive')}>Inactive</Button>
              </div>
            </div>
            {/* Customer cards list */}
            <div className="overflow-y-auto flex-1 p-2">
              {filteredAndSortedCustomers.length > 0 ? (
                filteredAndSortedCustomers.map((customer) => (
                  <Card 
                    key={customer.id}
                    className={`mb-2 cursor-pointer hover:shadow transition-shadow ${selectedCustomer?.id === customer.id ? 'border-2 border-primary ring-2 ring-primary' : ''}`}
                    onClick={() => setSelectedCustomer(customer)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <h3 className="font-medium cursor-pointer hover:text-blue-600 hover:underline">{customer.name}</h3>
                          <p className="text-xs text-muted-foreground">{customer.jobTitle}</p>
                        </div>
                        {customer.status === 'active' && (
                          <Button 
                            variant="default"
                            size="sm"
                            className="flex items-center gap-1 ml-4"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/customers/${customer.id}`);
                            }}
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            <span>Open</span>
                          </Button>
                        )}
                      </div>
                      <Progress value={customer.progress} className="h-2 mb-2" />
                      <div className="text-xs text-gray-500">{customer.email}</div>
                      <div className="text-xs text-gray-500">{customer.phone}</div>
                      <div className="text-xs text-gray-500">{customer.address}</div>
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

          {/* Center: Tabs and Details */}
          <div className="col-span-12 md:col-span-6 flex flex-col h-[80vh] bg-white rounded-lg shadow-md">
            <Tabs defaultValue="communications" className="flex-1 flex flex-col">
              <TabsList className="flex gap-4 p-4 border-b bg-white sticky top-0 z-10">
                <TabsTrigger value="communications">Communications</TabsTrigger>
                <TabsTrigger value="quotes">Quotes</TabsTrigger>
                <TabsTrigger value="jobs">Jobs</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>
              <TabsContent value="communications" className="flex-1 overflow-y-auto p-4">
                {selectedCustomer ? (
                  <div className="bg-gray-50 rounded-lg p-4 min-h-[60vh]">Communications content goes here.</div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-4 min-h-[60vh] flex items-center justify-center text-gray-400">Select a customer to view communications.</div>
                )}
              </TabsContent>
              <TabsContent value="quotes" className="flex-1 overflow-y-auto p-4">
                {selectedCustomer ? (
                  <div className="bg-gray-50 rounded-lg p-4 min-h-[60vh]">Quotes content goes here.</div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-4 min-h-[60vh] flex items-center justify-center text-gray-400">Select a customer to view quotes.</div>
                )}
              </TabsContent>
              <TabsContent value="jobs" className="flex-1 overflow-y-auto p-4">
                {selectedCustomer ? (
                  <div className="bg-gray-50 rounded-lg p-4 min-h-[60vh]">Jobs content for {selectedCustomer.name} goes here.</div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-4 min-h-[60vh] flex items-center justify-center text-gray-400">Select a customer to view jobs.</div>
                )}
              </TabsContent>
              <TabsContent value="documents" className="flex-1 overflow-y-auto p-4">
                {selectedCustomer ? (
                  <div className="bg-gray-50 rounded-lg p-4 min-h-[60vh]">Documents content for {selectedCustomer.name} goes here.</div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-4 min-h-[60vh] flex items-center justify-center text-gray-400">Select a customer to view documents.</div>
                )}
              </TabsContent>
              <TabsContent value="notes" className="flex-1 overflow-y-auto p-4">
                {selectedCustomer ? (
                  <div className="bg-gray-50 rounded-lg p-4 min-h-[60vh]">Notes content for {selectedCustomer.name} goes here.</div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-4 min-h-[60vh] flex items-center justify-center text-gray-400">Select a customer to view notes.</div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Right: Journey/Progress */}
          <div className="col-span-12 md:col-span-3 flex flex-col h-[80vh] bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold mb-4">Job Journey</h3>
            <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 rounded-lg">
              {selectedCustomer ? (
                <span className="text-gray-700">Journey/Progress tracker for {selectedCustomer.name} goes here.</span>
              ) : (
                <span className="text-gray-400">Select a customer to view their journey/progress.</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}

export default CustomersPage; 