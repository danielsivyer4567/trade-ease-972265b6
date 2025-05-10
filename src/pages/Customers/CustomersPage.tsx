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
  Share2,
  FileText,
  FileCheck,
  Briefcase,
  Package,
  CheckSquare,
  DollarSign
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
import { customerService } from '@/services/CustomerService';
import { Timeline } from './components/Timeline';
import type { WorkflowStep } from './CustomerPortfolio';

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

  useEffect(() => {
    async function fetchAllQuotesStats() {
      if (!customers) return;
      const stats: Record<string, { total: number; accepted: number; denied: number }> = {};
      await Promise.all(customers.map(async (customer) => {
        const quotes = await customerService.getCustomerQuotes(customer.id);
        stats[customer.id] = {
          total: quotes.length,
          accepted: quotes.filter(q => q.status === 'approved').length,
          denied: quotes.filter(q => q.status === 'rejected').length,
        };
      }));
      setQuotesStats(stats);
    }
    fetchAllQuotesStats();
  }, [customers]);

  // Build workflow steps for selected customer
  const workflowSteps: WorkflowStep[] = useMemo(() => {
    if (!selectedCustomer) return [];
    const stats = quotesStats[selectedCustomer.id] || { total: 0, accepted: 0, denied: 0 };
    const jobs = selectedCustomer.jobsQty || 0;
    // Build steps dynamically
    const steps: WorkflowStep[] = [];
    // Always start with Inquiry
    steps.push({
      id: 'inquiry',
      title: 'Customer Inquiry',
      description: 'Initial contact',
      status: 'completed',
      icon: <User className="h-6 w-6" />, // always completed for now
      shortInfo: 'New Contact',
    });
    // If they have a quote booked
    if (stats.total > 0) {
      steps.push({
        id: 'quote',
        title: 'Quote Booked',
        description: 'Preparing estimates',
        status: 'completed',
        icon: <FileText className="h-6 w-6" />,
        shortInfo: `${stats.total} Quotes`,
      });
      // If they have an accepted quote
      if (stats.accepted > 0) {
        steps.push({
          id: 'quote-completed',
          title: 'Quote Accepted',
          description: 'Customer approved quote',
          status: 'completed',
          icon: <FileCheck className="h-6 w-6" />,
          shortInfo: `${stats.accepted} Accepted`,
        });
        // If they have a job
        if (jobs > 0) {
          steps.push({
            id: 'job',
            title: 'Job Scheduled',
            description: 'Work scheduled',
            status: 'completed',
            icon: <Briefcase className="h-6 w-6" />,
            shortInfo: `${jobs} Jobs`,
          });
          // Next step could be job execution, but only if you have job status data
          // For now, stop here
        } else {
          // Next actionable step: Job Scheduled
          steps.push({
            id: 'job-next',
            title: 'Job Scheduled',
            description: 'Schedule work',
            status: 'current',
            icon: <Briefcase className="h-6 w-6" />,
            shortInfo: 'Pending',
          });
        }
      } else {
        // Next actionable step: Quote Accepted
        steps.push({
          id: 'quote-completed',
          title: 'Quote Accepted',
          description: 'Customer approved quote',
          status: 'current',
          icon: <FileCheck className="h-6 w-6" />,
          shortInfo: 'Pending',
        });
      }
    } else {
      // Next actionable step: Quote Booked
      steps.push({
        id: 'quote',
        title: 'Quote Booked',
        description: 'Preparing estimates',
        status: 'current',
        icon: <FileText className="h-6 w-6" />,
        shortInfo: 'Pending',
      });
    }
    return steps;
  }, [selectedCustomer, quotesStats]);

  const handleWorkflowStepAction = (stepId: string) => {
    // Optionally handle marking steps as actioned
  };

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
        <div className="flex items-center justify-between mb-6 px-4">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-gray-900">Customers</h2>
            <Badge variant="outline" className="ml-2">{filteredAndSortedCustomers.length}</Badge>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="w-48" onClick={() => navigate('/customers/new')}>Add Customer</Button>
            <Button className="w-48">New Job</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-8 gap-0">
          {/* Customer List Panel */}
          <div className="md:col-span-3 space-y-4 pl-4">
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
                onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive' | 'previous')}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="previous">Previous</option>
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
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-300">
                            {customer.status === 'active' ? (
                              <>
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                                <span className="text-xs text-green-600 font-medium">Active</span>
                              </>
                            ) : customer.status === 'previous' ? (
                              <>
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                                <span className="text-xs text-yellow-600 font-medium">Previous</span>
                              </>
                            ) : (
                              <>
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                                <span className="text-xs text-red-600 font-medium">Inactive</span>
                              </>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-300">
                            <h3 
                              className="font-medium cursor-pointer hover:text-blue-600 hover:underline"
                              onClick={(e) => {
                                e.stopPropagation();
                                try {
                                  navigate(`/customers/${customer.id}`);
                                } catch (error) {
                                  console.error('Navigation error:', error);
                                  window.location.href = `/customers/${customer.id}`;
                                }
                              }}
                            >
                              {customer.name}
                            </h3>
                          </div>
                          <div className="text-sm text-muted-foreground mb-3 pb-2 border-b border-gray-300">
                            {customer.address && (
                              <div className="flex items-center gap-1">
                                <Home className="h-3 w-3" />
                                <span>{customer.address}</span>
                              </div>
                            )}
                            {(customer.city || customer.state) && (
                              <div className="text-xs text-muted-foreground ml-4">
                                {[customer.city, customer.state].filter(Boolean).join(', ')}
                              </div>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mb-3 pb-2 border-b border-gray-300">{customer.jobTitle}</p>
                          <div className="text-xs text-muted-foreground space-y-1">
                            <div className="flex justify-between mb-2 pb-2 border-b border-gray-300">
                              <span>Job Progress: {customer.progress}%</span>
                              <span>Last Contact: {customer.lastContact}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                              <div className="flex items-center gap-1 p-2 border border-gray-300 rounded">
                                <span className="font-medium">Jobs:</span>
                                <span>{customer.jobsQty || 0}</span>
                              </div>
                              <div className="flex flex-col gap-1 p-2 border border-gray-300 rounded">
                                <span className="font-medium">Quotes:</span>
                                <span>Total: {quotesStats[customer.id]?.total ?? 0}</span>
                                <span className="text-green-700">Accepted: {quotesStats[customer.id]?.accepted ?? 0}</span>
                                <span className="text-red-700">Denied: {quotesStats[customer.id]?.denied ?? 0}</span>
                              </div>
                              <div className="flex items-center gap-1 p-2 border border-gray-300 rounded">
                                <span className="font-medium">Invoices:</span>
                                <span>{customer.invoicesQty || 0}</span>
                              </div>
                            </div>
                            {customer.phone && (
                              <div className="flex items-center gap-1 mt-2 p-2 border border-gray-300 rounded">
                                <Phone className="h-3 w-3" />
                                <span>{customer.phone}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        {customer.status === 'active' && (
                          <Button 
                            variant="default"
                            size="sm"
                            className="flex items-center gap-1 ml-4"
                            onClick={(e) => {
                              e.stopPropagation();
                              try {
                                navigate(`/customers/${customer.id}`);
                              } catch (error) {
                                console.error('Navigation error:', error);
                                window.location.href = `/customers/${customer.id}`;
                              }
                            }}
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            <span>Open Portfolio</span>
                          </Button>
                        )}
                      </div>
                      <Progress value={customer.progress} className="h-2 mb-2" />
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

          {/* Main Content Panel (Conversation, etc.) */}
          <div className="md:col-span-3 space-y-6 px-4 border-l">
            {selectedCustomer ? (
              <>
                {/* Customer Portfolio Chat Mode Layout */}
                <Card>
                  <Tabs defaultValue="communications" className="w-full">
                    <CardHeader className="p-4 pb-2 border-b">
                      <TabsList className="grid grid-cols-5">
                        <TabsTrigger value="communications">Communications</TabsTrigger>
                        <TabsTrigger value="quotes">Quotes</TabsTrigger>
                        <TabsTrigger value="jobs">Jobs</TabsTrigger>
                        <TabsTrigger value="documents">Documents</TabsTrigger>
                        <TabsTrigger value="notes">Notes</TabsTrigger>
                      </TabsList>
                    </CardHeader>
                    <CardContent className="p-6">
                      <TabsContent value="communications" className="mt-0">
                        <div className="space-y-6">
                          {/* Outgoing Call Card */}
                          <div className="border rounded-xl p-4 bg-white shadow-sm mb-2">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <Phone className="h-5 w-5 text-primary" />
                                <span className="font-bold text-lg text-gray-900">Outgoing Call</span>
                              </div>
                              <span className="font-bold text-base text-gray-700">15:23 <span className="uppercase">EAST</span></span>
                            </div>
                            <div className="flex items-center gap-6 mb-2">
                              <span className="font-semibold text-gray-700">Duration: <span className="font-bold">12:45</span></span>
                              <span className="font-bold text-gray-500">2 days ago</span>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" className="font-semibold flex items-center gap-1"><svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 3l14 9-14 9V3z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>Play Recording</Button>
                              <Button variant="outline" size="sm" className="font-semibold flex items-center gap-1"><svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>Save to Vault</Button>
                              <Button variant="outline" size="sm" className="font-semibold flex items-center gap-1"><Share2 className="h-4 w-4" />Share</Button>
                            </div>
                          </div>

                          {/* Conversation Thread */}
                          <div className="bg-slate-50 rounded-xl p-6 shadow-inner">
                            {/* Date Separator */}
                            <div className="flex justify-center mb-6">
                              <span className="bg-white px-4 py-1 rounded-full font-bold text-lg text-gray-700 shadow">9th May, 2025</span>
                            </div>
                            {/* Outgoing Message */}
                            <div className="flex justify-end mb-2">
                              <div className="max-w-xl">
                                <div className="flex items-end gap-2">
                                  <div className="flex flex-col items-end">
                                    <span className="text-xs text-black mb-1">SMS</span>
                                    <div className="bg-primary text-white rounded-2xl px-5 py-3 text-base font-medium shadow-md">
                                      Hi Sajad. This is Ana from Affordable Fencing Gold Coast. I need to confirm which colour sleeper you would like for your retaining wall?
                                      <br />
                                      <a href="#" className="underline text-white font-semibold">View Image</a>
                                    </div>
                                    <span className="font-bold text-xs text-gray-700 mt-1">15:52 <span className="uppercase">EAST</span></span>
                                  </div>
                                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">AR</div>
                                </div>
                              </div>
                            </div>
                            {/* Incoming Message */}
                            <div className="flex justify-start mb-2">
                              <div className="max-w-xl">
                                <div className="flex items-end gap-2">
                                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">N</div>
                                  <div className="flex flex-col items-start">
                                    <span className="text-xs text-black mb-1">SMS</span>
                                    <div className="bg-white border border-gray-200 rounded-2xl px-5 py-3 text-base font-medium text-gray-900 shadow-sm">
                                      Hi, could we please get monument? thanks
                                    </div>
                                    <span className="font-bold text-xs text-gray-700 mt-1">17:07 <span className="uppercase">EAST</span></span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {/* Outgoing Message */}
                            <div className="flex justify-end mb-2">
                              <div className="max-w-xl">
                                <div className="flex items-end gap-2">
                                  <div className="flex flex-col items-end">
                                    <span className="text-xs text-black mb-1">SMS</span>
                                    <div className="bg-primary text-white rounded-2xl px-5 py-3 text-base font-medium shadow-md">
                                      You sure can. Thank you
                                    </div>
                                    <span className="font-bold text-xs text-gray-700 mt-1">17:41 <span className="uppercase">EAST</span></span>
                                  </div>
                                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">AR</div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Incoming Call Card */}
                          <div className="border rounded-xl p-4 bg-white shadow-sm mt-6">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <Phone className="h-5 w-5 text-primary" />
                                <span className="font-bold text-lg text-gray-900">Incoming Call</span>
                              </div>
                              <span className="font-bold text-base text-gray-700">08:45 <span className="uppercase">EAST</span></span>
                            </div>
                            <div className="flex items-center gap-6 mb-2">
                              <span className="font-semibold text-gray-700">Duration: <span className="font-bold">05:12</span></span>
                              <span className="font-bold text-gray-500">1 week ago</span>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" className="font-semibold flex items-center gap-1"><svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 3l14 9-14 9V3z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>Play Recording</Button>
                              <Button variant="outline" size="sm" className="font-semibold flex items-center gap-1"><svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>Save to Vault</Button>
                              <Button variant="outline" size="sm" className="font-semibold flex items-center gap-1"><Share2 className="h-4 w-4" />Share</Button>
                            </div>
                          </div>

                          {/* Message Input Bar */}
                          <div className="mt-8 bg-white rounded-xl shadow p-4">
                            <div className="flex flex-wrap gap-2 mb-2">
                              <Button variant="ghost" size="sm" className="font-bold text-primary">SMS</Button>
                              <Button variant="ghost" size="sm">WhatsApp</Button>
                              <Button variant="ghost" size="sm">Email</Button>
                              <Button variant="ghost" size="sm">Facebook</Button>
                              <Button variant="ghost" size="sm">TikTok</Button>
                              <Button variant="ghost" size="sm">Instagram</Button>
                              <Button variant="ghost" size="sm">GBP</Button>
                              <Button variant="ghost" size="sm">Website</Button>
                              <span className="ml-auto text-xs text-gray-400">Internal Comment</span>
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs text-gray-500">From:</span>
                              <input className="border rounded px-2 py-1 text-xs w-40" value={selectedCustomer.phone} readOnly />
                              <span className="text-xs text-gray-500">To:</span>
                              <input className="border rounded px-2 py-1 text-xs w-40" value={selectedCustomer.phone} readOnly />
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                              <input className="flex-grow border rounded px-3 py-2 text-base" placeholder="Type a message" />
                              <Button variant="outline" size="icon"><svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10" strokeWidth="2"/><path d="M8 12l2 2 4-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></Button>
                              <Button variant="outline" size="icon"><svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><polyline points="17 8 12 3 7 8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><line x1="12" y1="3" x2="12" y2="15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></Button>
                              <Button variant="outline" size="icon"><svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10" strokeWidth="2"/><path d="M8 12l2 2 4-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></Button>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-2">
                              <Badge variant="secondary" className="text-xs font-normal">new client form</Badge>
                              <Badge variant="secondary" className="text-xs font-normal">basic contract</Badge>
                              <Badge variant="secondary" className="text-xs font-normal">defect form</Badge>
                              <Badge variant="secondary" className="text-xs font-normal">variation approval</Badge>
                              <Badge variant="secondary" className="text-xs font-normal">job preference form</Badge>
                            </div>
                            <div className="flex gap-2 mt-2">
                              <Button variant="outline" size="sm" className="font-semibold">Call Customer</Button>
                              <Button variant="outline" size="sm">Clear</Button>
                              <Button variant="default" size="sm" className="font-semibold">Send</Button>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                      {/* Other tabs can be filled in as needed */}
                    </CardContent>
                  </Tabs>
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

          {/* Customer Journey Sidebar (Desktop/Tablet) */}
          <div className="hidden md:block md:col-span-2 pl-4">
            {selectedCustomer && (
              <Card className="h-full flex flex-col">
                <CardHeader className="p-3">
                  <h3 className="text-lg font-semibold text-gray-700">Customer Journey</h3>
                </CardHeader>
                <CardContent className="flex-grow p-0 overflow-y-auto">
                  <Timeline steps={workflowSteps} onStepAction={handleWorkflowStepAction} />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Floating Button for Mobile */}
          <button
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 md:hidden bg-blue-600 text-white rounded-full shadow-lg p-4 flex items-center justify-center"
            onClick={() => setShowJourneyModal(true)}
            style={{ display: selectedCustomer ? 'flex' : 'none' }}
            aria-label="Show Customer Journey"
          >
            <Briefcase className="h-6 w-6" />
          </button>

          {/* Modal for Customer Journey on Mobile */}
          {showJourneyModal && selectedCustomer && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-md mx-auto p-4 relative">
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowJourneyModal(false)}
                  aria-label="Close"
                >
                  &times;
                </button>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Customer Journey</h3>
                <Timeline steps={workflowSteps} onStepAction={handleWorkflowStepAction} />
              </div>
            </div>
          )}
        </div>
      </div>
    </BaseLayout>
  );
}

export default CustomersPage; 