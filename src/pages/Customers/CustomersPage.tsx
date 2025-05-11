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
  FileSignature,
  Download,
  CheckSquare,
  Share2,
  FileCheck,
  Package,
  Tag,
  X,
  Users2,
  BellOff,
  MessageSquare,
  PhoneIncoming,
  Info,
  FileText,
  DollarSign,
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
import { CustomerConversations } from './components/CustomerConversations';
import { CustomerJourney } from './components/tabs/CustomerJourney';
import { Timeline } from './components/Timeline';
import { AppLayout } from '@/components/ui/AppLayout';

// Extended interface for Customer with additional fields needed for the page
interface Customer extends CustomerData {
  progress?: number;
  lastContact?: string;
  jobId?: string;
  jobTitle?: string;
  stepCompleted?: number;
  totalSteps?: number;
  customer_code?: string;
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
      jobTitle: 'Current Job', // TODO: Replace with actual job title
      customer_code: customer.customer_code // Include the customer_code
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

  // --- Add state and handlers from CustomerPortfolio ---
  const rightNavItems = [
    { id: 'customerJourney', label: 'Customer Journey', icon: Clock },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'notes', label: 'Notes', icon: PenLine },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'payments', label: 'Payments', icon: DollarSign },
    { id: 'associations', label: 'Associations', icon: Share2 },
  ];
  const [activeTab, setActiveTab] = useState('overview');
  const [rightColumnActiveTab, setRightColumnActiveTab] = useState('customerJourney');
  const [quotes, setQuotes] = useState([
    { id: '1', title: 'Bathroom Renovation', date: '2023-10-15', amount: 5200, status: 'accepted' },
    { id: '2', title: 'Kitchen Countertops', date: '2023-11-05', amount: 3800, status: 'sent' },
    { id: '3', title: 'Deck Installation', date: '2023-12-01', amount: 6500, status: 'draft' }
  ]);
  const [jobs, setJobs] = useState([
    { id: '1', title: 'Bathroom Renovation', date: '2023-10-20', status: 'in_progress', progress: 65 },
    { id: '2', title: 'Fence Repair', date: '2023-09-15', status: 'completed', progress: 100 }
  ]);
  const [notes, setNotes] = useState([
    { id: '1', text: 'Customer prefers communication via email', date: '2023-10-05', user: 'John Doe' },
    { id: '2', text: 'Follow up about kitchen renovation next month', date: '2023-11-10', user: 'Sarah Smith' }
  ]);
  const [documents, setDocuments] = useState([
    { id: '1', title: 'Service Agreement', signed_date: '2023-10-18', document_url: '#' },
    { id: '2', title: 'Bathroom Renovation Quote', signed_date: '2023-10-15', document_url: '#' }
  ]);
  const [workflowSteps, setWorkflowSteps] = useState([]);
  useEffect(() => {
    if (!selectedCustomer) return;
    let steps = [
      {
        id: 'inquiry',
        title: 'Customer Inquiry',
        description: 'Initial contact',
        status: 'completed',
        date: selectedCustomer.created_at ? new Date(selectedCustomer.created_at).toLocaleDateString() : undefined,
        icon: <User className="h-6 w-6" />, shortInfo: 'New Contact'
      },
      {
        id: 'quote',
        title: 'Quote Creation',
        description: 'Preparing estimates',
        status: quotes.length > 0 ? 'completed' : 'upcoming',
        date: quotes.length > 0 ? quotes[0].date : undefined,
        icon: <FileText className="h-6 w-6" />, shortInfo: quotes.length > 0 ? `${quotes.length} Quotes` : 'No Quotes'
      },
      {
        id: 'approval',
        title: 'Quote Approval',
        description: 'Customer review',
        status: quotes.some(q => q.status === 'accepted') ? 'completed' : quotes.some(q => q.status === 'sent') ? 'current' : 'upcoming',
        icon: <FileCheck className="h-6 w-6" />, shortInfo: quotes.some(q => q.status === 'accepted') ? 'Approved' : 'Pending'
      },
      {
        id: 'job',
        title: 'Job Creation',
        description: 'Schedule work',
        status: jobs.length > 0 ? 'completed' : quotes.some(q => q.status === 'accepted') ? 'current' : 'upcoming',
        date: jobs.length > 0 ? jobs[0].date : undefined,
        icon: <Briefcase className="h-6 w-6" />, shortInfo: jobs.length > 0 ? `${jobs.length} Jobs` : 'No Jobs'
      },
      {
        id: 'execution',
        title: 'Job Execution',
        description: 'Work in progress',
        status: jobs.some(j => j.status === 'in_progress') ? 'current' : jobs.some(j => j.status === 'completed') ? 'completed' : 'upcoming',
        icon: <Package className="h-6 w-6" />, shortInfo: jobs.some(j => j.status === 'in_progress') ? 'In Progress' : 'Not Started'
      },
      {
        id: 'completion',
        title: 'Job Completion',
        description: 'Customer sign-off',
        status: jobs.some(j => j.status === 'completed') ? 'completed' : 'upcoming',
        icon: <CheckSquare className="h-6 w-6" />, shortInfo: jobs.some(j => j.status === 'completed') ? 'Complete' : 'Pending'
      }
    ];
    steps = steps.map(step => ({ ...step, requiresAction: step.status === 'current', isActioned: false }));
    setWorkflowSteps(steps);
  }, [selectedCustomer, quotes, jobs]);
  const handleWorkflowStepAction = (stepId) => {
    setWorkflowSteps(prevSteps => prevSteps.map(step => step.id === stepId ? { ...step, isActioned: true, requiresAction: false } : step));
  };
  const handleAddNote = () => {
    const newNote = {
      id: `new-${Date.now()}`,
      text: 'New customer note...',
      date: new Date().toISOString().split('T')[0],
      user: 'Current User'
    };
    setNotes([newNote, ...notes]);
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
          <div className="md:col-span-1 space-y-4 bg-white border-r border-gray-200 p-4 min-h-[70vh]">
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
                      selectedCustomer?.id === customer.id ? 'border-2 border-primary ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedCustomer(customer)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <h3 
                            className="font-medium cursor-pointer hover:text-blue-600 hover:underline"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCustomer(customer);
                            }}
                          >
                            {customer.name}
                          </h3>
                          <p className="text-xs text-muted-foreground">{customer.jobTitle}</p>
                        </div>
                        {customer.status === 'active' ? (
                          <Button 
                            variant="default"
                            size="sm"
                            className="flex items-center gap-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCustomer(customer);
                            }}
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            <span>Open Portfolio</span>
                          </Button>
                        ) : (
                          <Badge variant="secondary">
                            {customer.status}
                          </Badge>
                        )}
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

          {/* Center Panel: Communications, Quotes, Jobs, Documents, Notes */}
          <div className="md:col-span-1 p-4">
            {selectedCustomer ? (
              <Card>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <CardHeader className="p-4 pb-2 border-b">
                    <TabsList className="grid grid-cols-5">
                      <TabsTrigger value="overview">Communications</TabsTrigger>
                      <TabsTrigger value="quotes">Quotes</TabsTrigger>
                      <TabsTrigger value="jobs">Jobs</TabsTrigger>
                      <TabsTrigger value="documents">Documents</TabsTrigger>
                      <TabsTrigger value="notes">Notes</TabsTrigger>
                    </TabsList>
                  </CardHeader>
                  <CardContent className="p-6">
                    <TabsContent value="overview" className="mt-0">
                      {/* --- CALL HISTORY SECTION --- */}
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
                          {/* ... (copy the rest of the conversation thread and message input bar as in CustomerPortfolio) ... */}
                        </div>
                        {/* Incoming Call Card */}
                        <div className="border rounded-xl p-4 bg-white shadow-sm mt-6">
                          {/* ... (copy as in CustomerPortfolio) ... */}
                        </div>
                        {/* --- MESSAGE INPUT BAR --- */}
                        <div className="mt-8 bg-white rounded-xl shadow p-4">
                          {/* ... (copy as in CustomerPortfolio) ... */}
                        </div>
                      </div>
                    </TabsContent>
                    {/* ... (copy Quotes, Jobs, Documents, Notes tabs as in CustomerPortfolio) ... */}
                  </CardContent>
                </Tabs>
              </Card>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[50vh] bg-muted rounded-lg p-6">
                <User className="w-16 h-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No Customer Selected</h3>
                <p className="text-muted-foreground text-center">
                  Select a customer from the list to view their conversations
                </p>
              </div>
            )}
          </div>

          {/* Right Panel: Customer Journey and Icon Nav */}
          <div className="md:col-span-1 p-4">
            {selectedCustomer ? (
              <Card className="h-full flex flex-col">
                {/* Icon Navigation Bar */}
                <div className="p-1.5 border-b flex justify-around items-center bg-slate-50 rounded-t-md">
                  {rightNavItems.map(item => (
                    <Button
                      key={item.id}
                      variant="ghost"
                      size="icon"
                      className={`h-8 w-8 p-1.5 ${rightColumnActiveTab === item.id ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-primary'}`}
                      onClick={() => setRightColumnActiveTab(item.id)}
                      title={item.label}
                    >
                      <item.icon className="h-5 w-5" />
                    </Button>
                  ))}
                </div>
                {/* Content Area for Right Column */}
                <CardContent className="flex-grow p-0 overflow-y-auto">
                  {rightColumnActiveTab === 'customerJourney' && (
                    <Timeline steps={workflowSteps} onStepAction={handleWorkflowStepAction} />
                  )}
                  {rightColumnActiveTab === 'tasks' && (
                    <div className="p-4 text-sm text-muted-foreground">Tasks content will go here.</div>
                  )}
                  {rightColumnActiveTab === 'notes' && (
                    <div className="p-4 text-sm text-muted-foreground">Notes content will go here.</div>
                  )}
                  {rightColumnActiveTab === 'calendar' && (
                    <div className="p-4 text-sm text-muted-foreground">Calendar content will go here.</div>
                  )}
                  {rightColumnActiveTab === 'documents' && (
                    <div className="p-4 text-sm text-muted-foreground">Documents content will go here.</div>
                  )}
                  {rightColumnActiveTab === 'payments' && (
                    <div className="p-4 text-sm text-muted-foreground">Payments content will go here.</div>
                  )}
                  {rightColumnActiveTab === 'associations' && (
                    <div className="p-4 text-sm text-muted-foreground">Associations content will go here.</div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[50vh] bg-muted rounded-lg p-6">
                <User className="w-16 h-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No Customer Selected</h3>
                <p className="text-muted-foreground text-center">
                  Select a customer from the list to view their journey
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