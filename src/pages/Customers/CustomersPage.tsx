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
  Circle
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
import { mockDatabaseService, MockCustomer } from '@/services/MockDatabaseService';

// Define the interface for your Customer object
interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  status?: 'active' | 'inactive';
  progress?: number;
  lastContact?: string;
  jobId?: string;
  jobTitle?: string;
  stepCompleted?: number;
  totalSteps?: number;
}

// Convert MockCustomer to Customer for the UI
const convertToCustomer = (mockCustomer: MockCustomer): Customer => {
  return {
    id: mockCustomer.id,
    name: mockCustomer.name,
    email: mockCustomer.email,
    phone: mockCustomer.phone,
    address: mockCustomer.address,
    status: 'active', // Default status
    progress: 50, // Default progress
    lastContact: mockCustomer.created_at,
    jobId: `JOB-${1000 + parseInt(mockCustomer.id)}`,
    jobTitle: 'Active Project',
    stepCompleted: 5,
    totalSteps: 10
  };
};

// Simulating API call with mock data service
const fetchCustomers = async (): Promise<Customer[]> => {
  const mockCustomers = await mockDatabaseService.getCustomers();
  return mockCustomers.map(convertToCustomer);
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
      const link = `https://1b024d1a-36c6-4c1f-bf9e-27b08a6c3df4.lovableproject.com/progress/0cd951be-9809-464b-9419-08f143d51477`;
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
            <Button variant="outline">Add Customer</Button>
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
                          <h3 className="font-medium">{customer.name}</h3>
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
                      <CardTitle>{selectedCustomer.name}</CardTitle>
                      <Badge variant={selectedCustomer.status === 'active' ? 'default' : 'secondary'}>
                        {selectedCustomer.status}
                      </Badge>
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
                        <div className="flex items-center gap-2">
                          <Clock className="w-5 h-5 text-muted-foreground" />
                          <span>Customer since: January 2023</span>
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
                            value="https://1b024d1a-36c6-4c1f-bf9e-27b08a6c3df4.lovableproject.com/progress/0cd951be-9809-464b-9419-08f143d51477"
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

                <Card>
                  <CardHeader className="bg-muted pb-2">
                    <CardTitle>Progress Portal Preview</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <Tabs defaultValue="progress">
                      <TabsList className="mb-4">
                        <TabsTrigger value="progress">Progress</TabsTrigger>
                        <TabsTrigger value="photos">Photos</TabsTrigger>
                        <TabsTrigger value="documents">Documents</TabsTrigger>
                        <TabsTrigger value="comments">Comments</TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="progress">
                        <div className="space-y-6">
                          <div>
                            <div className="flex justify-between mb-1">
                              <span>Progress: {selectedCustomer.stepCompleted} of {selectedCustomer.totalSteps} steps completed</span>
                              <span>{selectedCustomer.progress}%</span>
                            </div>
                            <Progress value={selectedCustomer.progress} className="h-2" />
                          </div>
                          
                          <div>
                            <h3 className="font-semibold mb-4">Job Steps</h3>
                            <div className="space-y-4">
                              <div className="flex items-center gap-3">
                                <CheckCircle2 className="text-green-500 h-5 w-5" />
                                <div>
                                  <div className="font-medium">Initial Consultation</div>
                                  <div className="text-sm text-muted-foreground">Completed 2023-12-01</div>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-3">
                                <CheckCircle2 className="text-green-500 h-5 w-5" />
                                <div>
                                  <div className="font-medium">Quote Provided</div>
                                  <div className="text-sm text-muted-foreground">Completed 2023-12-05</div>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-3">
                                <CheckCircle2 className="text-green-500 h-5 w-5" />
                                <div>
                                  <div className="font-medium">Materials Ordered</div>
                                  <div className="text-sm text-muted-foreground">Completed 2023-12-10</div>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-3">
                                <Circle className="text-gray-300 h-5 w-5" />
                                <div>
                                  <div className="font-medium text-muted-foreground">Materials Delivered</div>
                                  <div className="text-sm text-muted-foreground">Pending</div>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-3">
                                <Circle className="text-gray-300 h-5 w-5" />
                                <div>
                                  <div className="font-medium text-muted-foreground">Work In Progress</div>
                                  <div className="text-sm text-muted-foreground">Pending</div>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-3">
                                <Circle className="text-gray-300 h-5 w-5" />
                                <div>
                                  <div className="font-medium text-muted-foreground">Quality Check</div>
                                  <div className="text-sm text-muted-foreground">Pending</div>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-3">
                                <Circle className="text-gray-300 h-5 w-5" />
                                <div>
                                  <div className="font-medium text-muted-foreground">Job Completed</div>
                                  <div className="text-sm text-muted-foreground">Pending</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="photos">
                        <div className="text-center py-12">
                          <p className="text-muted-foreground">No photos uploaded yet.</p>
                        </div>
                      </TabsContent>

                      <TabsContent value="documents">
                        <div className="text-center py-12">
                          <p className="text-muted-foreground">No documents uploaded yet.</p>
                        </div>
                      </TabsContent>

                      <TabsContent value="comments">
                        <div className="text-center py-12">
                          <p className="text-muted-foreground">No comments yet.</p>
                        </div>
                      </TabsContent>

                      <TabsContent value="settings">
                        <div className="text-center py-12">
                          <p className="text-muted-foreground">Portal settings will appear here.</p>
                        </div>
                      </TabsContent>
                    </Tabs>
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