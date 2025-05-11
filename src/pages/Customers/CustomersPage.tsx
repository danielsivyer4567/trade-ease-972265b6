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
import { fetchCustomersFromAPI } from '@/services/api';
import { CustomerData } from '@/pages/Customers/components/CustomerCard';
import { supabase } from '@/integrations/supabase/client';
import { Timeline } from './components/Timeline';

// Extended interface for Customer with additional fields needed for the page
interface Customer extends CustomerData {
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
  status: 'active' | 'inactive' | 'previous';
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
      status: customer.status as 'active' | 'inactive' | 'previous',
      progress: Math.floor(Math.random() * 100), // TODO: Replace with actual progress from jobs table
      lastContact: customer.last_contact || new Date().toISOString().split('T')[0],
      jobId: `JOB-${customer.id.substring(0, 4)}`, // TODO: Replace with latest job ID
      jobTitle: 'Current Job', // TODO: Replace with actual job title
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
  
  // State for search, filter, and sort
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'previous'>('all');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [quotesStats, setQuotesStats] = useState<Record<string, { total: number; accepted: number; denied: number }>>({});
  const [showJourneyModal, setShowJourneyModal] = useState(false);
  const [workflowSteps, setWorkflowSteps] = useState([]);

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

  const handleWorkflowStepAction = (stepId) => {
    setWorkflowSteps(prevSteps => prevSteps.map(step => step.id === stepId ? { ...step, isActioned: true, requiresAction: false } : step));
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
      <div className="container mx-auto px-0 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 px-4">
          <div className="flex items-center gap-2">
            <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <User className="h-8 w-8" />
              Customers
            </h2>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/customers/console')}>Customer Console</Button>
            <Button variant="outline" onClick={() => navigate('/customers/external')}>External View</Button>
            <Button className="bg-blue-600 text-white" onClick={() => navigate('/customers/new')}>+ Add Customer</Button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4">
          {/* Left: Customer List */}
          <div className="col-span-12 md:col-span-3 bg-white rounded-lg shadow-sm flex flex-col h-[80vh]">
            {/* Sticky Search/Filter Header */}
            <div className="sticky top-0 z-10 bg-white p-4 border-b flex flex-col gap-2">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Search customers by name, email, ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 bg-slate-100"
                />
                <Button variant={statusFilter === 'all' ? 'default' : 'outline'} size="sm" onClick={() => setStatusFilter('all')}>All</Button>
                <Button variant={statusFilter === 'active' ? 'default' : 'outline'} size="sm" onClick={() => setStatusFilter('active')}>Active</Button>
                <Button variant={statusFilter === 'inactive' ? 'default' : 'outline'} size="sm" onClick={() => setStatusFilter('inactive')}>Inactive</Button>
              </div>
            </div>
            {/* Customer Cards List */}
            <div className="overflow-y-auto flex-1 p-2 space-y-2">
              {filteredAndSortedCustomers.length > 0 ? (
                filteredAndSortedCustomers.map((customer) => (
                  <Card
                    key={customer.id}
                    className={`cursor-pointer hover:shadow transition-shadow ${selectedCustomer?.id === customer.id ? 'border-2 border-primary ring-2 ring-primary' : ''}`}
                    onClick={() => setSelectedCustomer(customer)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-1">
                        <div>
                          <h3 className="font-medium cursor-pointer hover:text-blue-600 hover:underline">{customer.name}</h3>
                          <p className="text-xs text-muted-foreground">{customer.email}</p>
                          <p className="text-xs text-muted-foreground">{customer.phone}</p>
                          <p className="text-xs text-muted-foreground">{customer.address}</p>
                        </div>
                        <Button variant="ghost" size="icon" onClick={(e) => {e.stopPropagation(); handleEditCustomer(customer.id);}}><PenLine className="h-4 w-4" /></Button>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="bg-slate-200 rounded px-2 py-0.5">Code: {customer.customer_code || '-'}</span>
                        <Badge variant={customer.status === 'active' ? 'default' : 'secondary'}>{customer.status}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12 bg-muted rounded-lg">
                  <p className="text-muted-foreground">No customers found.</p>
                </div>
              )}
            </div>
          </div>

          {/* Center: Details & Tabs */}
          <div className="col-span-12 md:col-span-6 bg-white rounded-lg shadow-sm flex flex-col h-[80vh]">
            <Tabs defaultValue="communications" className="flex flex-col h-full">
              <TabsList className="flex gap-2 p-4 border-b bg-white sticky top-0 z-10">
                <TabsTrigger value="communications">Communications</TabsTrigger>
                <TabsTrigger value="quotes">Quotes</TabsTrigger>
                <TabsTrigger value="jobs">Jobs</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>
              <TabsContent value="communications" className="flex-1 overflow-y-auto p-4">
                {/* Placeholder for Communications */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Communications</h3>
                  <div className="bg-slate-100 rounded p-4">Sample communication content here...</div>
                </div>
              </TabsContent>
              <TabsContent value="quotes" className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Quotes</h3>
                  <div className="bg-slate-100 rounded p-4">Sample quotes content here...</div>
                </div>
              </TabsContent>
              <TabsContent value="jobs" className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Jobs</h3>
                  <div className="bg-slate-100 rounded p-4">Sample jobs content here...</div>
                </div>
              </TabsContent>
              <TabsContent value="documents" className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Documents</h3>
                  <div className="bg-slate-100 rounded p-4">Sample documents content here...</div>
                </div>
              </TabsContent>
              <TabsContent value="notes" className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Notes</h3>
                  <div className="bg-slate-100 rounded p-4">Sample notes content here...</div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right: Journey/Progress */}
          <div className="col-span-12 md:col-span-3 bg-white rounded-lg shadow-sm flex flex-col h-[80vh] p-4">
            <h3 className="text-lg font-semibold mb-4">Job Journey</h3>
            {/* Placeholder for journey/progress tracker */}
            <div className="flex flex-col items-center justify-center flex-1">
              <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 rounded-lg p-6">
                <p className="text-muted-foreground">Journey/Progress tracker here...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}

export default CustomersPage; 