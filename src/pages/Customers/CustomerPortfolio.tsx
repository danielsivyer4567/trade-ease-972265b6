import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from "@/components/ui/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, Phone, Mail, Home, Calendar, FileText, Clock, Briefcase, FileSignature, History, PenLine, Trash2, MessageSquare, Download, CheckCircle, CircleDashed, MoveRight, AlertCircle, ChevronDown, FileCheck, Package, CheckSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Separator } from '@/components/ui/separator';
import { CustomerData } from './components/CustomerCard';
import ErrorBoundary from '@/components/error/ErrorBoundary';

interface CustomerWithDetails extends CustomerData {
  business_name?: string;
  abn?: string;
  acn?: string;
  state_licence_state?: string;
  state_licence_number?: string;
  national_certifications?: string[];
  certification_details?: Record<string, string>;
  created_at?: string;
  last_contact?: string;
  customer_code?: string;
}

interface Quote {
  id: string;
  title: string;
  date: string;
  amount: number;
  status: 'draft' | 'sent' | 'accepted' | 'declined';
}

interface Job {
  id: string;
  title: string;
  date: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  progress: number;
}

interface NoteItem {
  id: string;
  text: string;
  date: string;
  user: string;
}

interface SignedDocument {
  id: string;
  title: string;
  signed_date: string;
  document_url: string;
}

// Enhanced WorkflowStep with icon information
interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'upcoming';
  date?: string;
  icon: React.ReactNode;
  shortInfo?: string;
}

const CustomerPortfolio = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [customer, setCustomer] = useState<CustomerWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  
  // Mock data (would be fetched from API in production)
  const [quotes, setQuotes] = useState<Quote[]>([
    { id: '1', title: 'Bathroom Renovation', date: '2023-10-15', amount: 5200, status: 'accepted' },
    { id: '2', title: 'Kitchen Countertops', date: '2023-11-05', amount: 3800, status: 'sent' },
    { id: '3', title: 'Deck Installation', date: '2023-12-01', amount: 6500, status: 'draft' }
  ]);
  
  const [jobs, setJobs] = useState<Job[]>([
    { id: '1', title: 'Bathroom Renovation', date: '2023-10-20', status: 'in_progress', progress: 65 },
    { id: '2', title: 'Fence Repair', date: '2023-09-15', status: 'completed', progress: 100 }
  ]);
  
  const [notes, setNotes] = useState<NoteItem[]>([
    { id: '1', text: 'Customer prefers communication via email', date: '2023-10-05', user: 'John Doe' },
    { id: '2', text: 'Follow up about kitchen renovation next month', date: '2023-11-10', user: 'Sarah Smith' }
  ]);
  
  const [documents, setDocuments] = useState<SignedDocument[]>([
    { id: '1', title: 'Service Agreement', signed_date: '2023-10-18', document_url: '#' },
    { id: '2', title: 'Bathroom Renovation Quote', signed_date: '2023-10-15', document_url: '#' }
  ]);

  useEffect(() => {
    const fetchCustomerData = async () => {
      if (!id) {
        setError("No customer ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        const { data: session } = await supabase.auth.getSession();
        if (!session?.session?.user) {
          throw new Error("Authentication required to view customer details");
        }

        const { data, error } = await supabase
          .from('customers')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }

        if (!data) {
          throw new Error("Customer not found");
        }

        setCustomer({
          id: data.id,
          name: data.name,
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || '',
          city: data.city || '',
          state: data.state || '',
          zipCode: data.zipcode || '',
          status: data.status as 'active' | 'inactive',
          business_name: data.business_name,
          abn: data.abn,
          acn: data.acn,
          state_licence_state: data.state_licence_state,
          state_licence_number: data.state_licence_number,
          national_certifications: data.national_certifications || [],
          certification_details: data.certification_details || {},
          created_at: data.created_at,
          last_contact: data.last_contact,
          customer_code: data.customer_code
        });
        
        // In a real implementation, we would fetch related data here
        // Such as quotes, jobs, notes, documents, etc.
        
      } catch (err: any) {
        console.error("Error fetching customer data:", err);
        setError(err.message || "Failed to load customer details");
        toast({
          title: "Error",
          description: err.message || "Failed to load customer details",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [id, toast]);

  const handleAddNote = () => {
    const newNote = {
      id: `new-${Date.now()}`,
      text: 'New customer note...',
      date: new Date().toISOString().split('T')[0],
      user: 'Current User'
    };
    
    setNotes([newNote, ...notes]);
    
    toast({
      title: "Note Added",
      description: "Your note has been added successfully"
    });
  };

  const handleSendMessage = () => {
    toast({
      title: "Message Sent",
      description: "Your message has been sent to the customer"
    });
  };

  // Define the workflow steps based on customer data
  const getWorkflowSteps = (): WorkflowStep[] => {
    if (!customer) return [];
    
    const steps: WorkflowStep[] = [
      { 
        id: 'inquiry', 
        title: 'Customer Inquiry', 
        description: 'Initial contact', 
        status: 'completed',
        date: customer.created_at ? new Date(customer.created_at).toLocaleDateString() : undefined,
        icon: <User className="h-6 w-6" />,
        shortInfo: 'New Contact'
      },
      { 
        id: 'quote', 
        title: 'Quote Creation', 
        description: 'Preparing estimates',
        status: quotes.length > 0 ? 'completed' : 'upcoming',
        date: quotes.length > 0 ? quotes[0].date : undefined,
        icon: <FileText className="h-6 w-6" />,
        shortInfo: quotes.length > 0 ? `${quotes.length} Quotes` : 'No Quotes'
      },
      { 
        id: 'approval', 
        title: 'Quote Approval', 
        description: 'Customer review',
        status: quotes.some(q => q.status === 'accepted') ? 'completed' : quotes.some(q => q.status === 'sent') ? 'current' : 'upcoming',
        icon: <FileCheck className="h-6 w-6" />,
        shortInfo: quotes.some(q => q.status === 'accepted') ? 'Approved' : 'Pending'
      },
      { 
        id: 'job', 
        title: 'Job Creation', 
        description: 'Schedule work',
        status: jobs.length > 0 ? 'completed' : quotes.some(q => q.status === 'accepted') ? 'current' : 'upcoming',
        date: jobs.length > 0 ? jobs[0].date : undefined,
        icon: <Briefcase className="h-6 w-6" />,
        shortInfo: jobs.length > 0 ? `${jobs.length} Jobs` : 'No Jobs'
      },
      { 
        id: 'execution', 
        title: 'Job Execution', 
        description: 'Work in progress',
        status: jobs.some(j => j.status === 'in_progress') ? 'current' : jobs.some(j => j.status === 'completed') ? 'completed' : 'upcoming',
        icon: <Package className="h-6 w-6" />,
        shortInfo: jobs.some(j => j.status === 'in_progress') ? 'In Progress' : 'Not Started'
      },
      { 
        id: 'completion', 
        title: 'Job Completion', 
        description: 'Customer sign-off',
        status: jobs.some(j => j.status === 'completed') ? 'completed' : 'upcoming',
        icon: <CheckSquare className="h-6 w-6" />,
        shortInfo: jobs.some(j => j.status === 'completed') ? 'Complete' : 'Pending'
      }
    ];
    
    return steps;
  };
  
  const workflowSteps = getWorkflowSteps();

  if (loading) {
    return (
      <AppLayout>
        <div className="container mx-auto p-6 flex items-center justify-center min-h-[80vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </AppLayout>
    );
  }

  if (error || !customer) {
    return (
      <AppLayout>
        <div className="container mx-auto p-6">
          <div className="flex items-center gap-2 mb-6">
            <Button variant="ghost" onClick={() => navigate('/customers')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Customer Portfolio</h1>
          </div>
          
          <Card className="p-8 text-center">
            <h2 className="text-red-500 font-bold text-lg mb-2">Error Loading Customer</h2>
            <p className="mb-4">{error || "Customer not found"}</p>
            <Button onClick={() => navigate("/customers")}>Return to Customers</Button>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto p-6">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" onClick={() => navigate('/customers')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Customer Portfolio</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <User className="h-12 w-12 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold">
                    {customer.name}
                    {customer.customer_code && (
                      <span className="ml-2 text-sm bg-gray-100 px-2 py-0.5 rounded-full text-gray-600">
                        {customer.customer_code}
                      </span>
                    )}
                  </h2>
                  <div className="mt-2">
                    <span className={`inline-block px-3 py-1 text-sm rounded-full ${
                      customer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {customer.status}
                    </span>
                  </div>
                  
                  {customer.business_name && (
                    <p className="text-sm text-muted-foreground mt-2">{customer.business_name}</p>
                  )}
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{customer.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{customer.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Home className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{customer.address}, {customer.city}, {customer.state} {customer.zipCode}</span>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="flex flex-col gap-2">
                  <Button variant="outline" className="w-full flex items-center gap-2 justify-start" onClick={handleSendMessage}>
                    <MessageSquare className="h-4 w-4" />
                    <span>Send Message</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center gap-2 justify-start"
                    onClick={() => navigate(`/customers/${id}/edit`)}
                  >
                    <PenLine className="h-4 w-4" />
                    <span>Edit Customer</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-6">
            <Card>
              <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
                <CardHeader className="p-4 pb-2 border-b">
                  <TabsList className="grid grid-cols-5">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="quotes">Quotes</TabsTrigger>
                    <TabsTrigger value="jobs">Jobs</TabsTrigger>
                    <TabsTrigger value="documents">Documents</TabsTrigger>
                    <TabsTrigger value="notes">Notes</TabsTrigger>
                  </TabsList>
                </CardHeader>
                
                <CardContent className="p-6">
                  <TabsContent value="overview" className="mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Briefcase className="h-5 w-5 text-primary" />
                            Business Details
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-2">
                          <div className="space-y-2">
                            <div>
                              <p className="text-sm font-medium">Business Name</p>
                              <p className="text-sm text-muted-foreground">{customer.business_name || 'Not specified'}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">ABN</p>
                              <p className="text-sm text-muted-foreground">{customer.abn || 'Not specified'}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">ACN</p>
                              <p className="text-sm text-muted-foreground">{customer.acn || 'Not specified'}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">State License</p>
                              <p className="text-sm text-muted-foreground">
                                {customer.state_licence_state && customer.state_licence_number
                                  ? `${customer.state_licence_state}: ${customer.state_licence_number}`
                                  : 'Not specified'}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <FileSignature className="h-5 w-5 text-primary" />
                            Certifications
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-2">
                          {customer.national_certifications?.length ? (
                            <div className="space-y-2">
                              {customer.national_certifications.map((cert, index) => (
                                <div key={index}>
                                  <p className="text-sm font-medium">{cert}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {customer.certification_details?.[cert] || 'No license number provided'}
                                  </p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">No certifications listed</p>
                          )}
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <FileText className="h-5 w-5 text-primary" />
                            Recent Quotes
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-2">
                          {quotes.length > 0 ? (
                            <div className="space-y-2">
                              {quotes.slice(0, 3).map((quote) => (
                                <div key={quote.id} className="flex justify-between items-center">
                                  <div>
                                    <p className="text-sm font-medium">{quote.title}</p>
                                    <p className="text-xs text-muted-foreground">{quote.date}</p>
                                  </div>
                                  <Badge variant={
                                    quote.status === 'accepted' ? 'default' : 
                                    quote.status === 'sent' ? 'secondary' : 
                                    'outline'
                                  }>
                                    {quote.status}
                                  </Badge>
                                </div>
                              ))}
                              <Button variant="link" onClick={() => setActiveTab("quotes")} className="p-0 h-auto">
                                View all quotes
                              </Button>
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">No quotes available</p>
                          )}
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <History className="h-5 w-5 text-primary" />
                            Activity History
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-2">
                          <div className="space-y-2">
                            <div>
                              <p className="text-sm font-medium">Customer Since</p>
                              <p className="text-sm text-muted-foreground">
                                {customer.created_at ? new Date(customer.created_at).toLocaleDateString() : 'Unknown'}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Last Contact</p>
                              <p className="text-sm text-muted-foreground">
                                {customer.last_contact ? new Date(customer.last_contact).toLocaleDateString() : 'Unknown'}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Active Jobs</p>
                              <p className="text-sm text-muted-foreground">
                                {jobs.filter(j => j.status === 'in_progress').length}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="quotes" className="mt-0">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-medium">Customer Quotes</h2>
                      <Button size="sm" onClick={() => navigate('/quotes/new')}>New Quote</Button>
                    </div>
                    
                    {quotes.length > 0 ? (
                      <div className="space-y-4">
                        {quotes.map((quote) => (
                          <Card key={quote.id}>
                            <CardContent className="p-4 flex justify-between items-center">
                              <div>
                                <h3 className="font-medium">{quote.title}</h3>
                                <div className="text-sm text-muted-foreground">
                                  Created: {quote.date} • ${quote.amount.toLocaleString()}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant={
                                  quote.status === 'accepted' ? 'default' : 
                                  quote.status === 'sent' ? 'secondary' : 
                                  'outline'
                                }>
                                  {quote.status}
                                </Badge>
                                <Button variant="outline" size="sm">View</Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-muted rounded-lg">
                        <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">No quotes found for this customer</p>
                        <Button variant="outline" size="sm" className="mt-4" onClick={() => navigate('/quotes/new')}>
                          Create a Quote
                        </Button>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="jobs" className="mt-0">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-medium">Customer Jobs</h2>
                      <Button size="sm" onClick={() => navigate('/jobs/new')}>New Job</Button>
                    </div>
                    
                    {jobs.length > 0 ? (
                      <div className="space-y-4">
                        {jobs.map((job) => (
                          <Card key={job.id}>
                            <CardContent className="p-4">
                              <div className="flex justify-between items-center mb-2">
                                <h3 className="font-medium">{job.title}</h3>
                                <Badge variant={
                                  job.status === 'completed' ? 'default' : 
                                  job.status === 'in_progress' ? 'secondary' : 
                                  'outline'
                                }>
                                  {job.status.replace('_', ' ')}
                                </Badge>
                              </div>
                              <div className="text-sm text-muted-foreground mb-2">
                                Start Date: {job.date} • Progress: {job.progress}%
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div 
                                  className="bg-primary rounded-full h-2"
                                  style={{ width: `${job.progress}%` }}
                                ></div>
                              </div>
                              <div className="mt-4 flex justify-end">
                                <Button variant="outline" size="sm">View Details</Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-muted rounded-lg">
                        <Briefcase className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">No jobs found for this customer</p>
                        <Button variant="outline" size="sm" className="mt-4" onClick={() => navigate('/jobs/new')}>
                          Create a Job
                        </Button>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="documents" className="mt-0">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-medium">Signed Documents</h2>
                      <Button size="sm">Upload Document</Button>
                    </div>
                    
                    {documents.length > 0 ? (
                      <div className="space-y-4">
                        {documents.map((doc) => (
                          <Card key={doc.id}>
                            <CardContent className="p-4 flex justify-between items-center">
                              <div>
                                <h3 className="font-medium">{doc.title}</h3>
                                <div className="text-sm text-muted-foreground">
                                  Signed: {doc.signed_date}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm">
                                  <FileText className="h-4 w-4 mr-2" />
                                  View
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Download className="h-4 w-4 mr-2" />
                                  Download
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-muted rounded-lg">
                        <FileSignature className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">No signed documents found</p>
                        <Button variant="outline" size="sm" className="mt-4">
                          Request Signature
                        </Button>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="notes" className="mt-0">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-medium">Customer Notes</h2>
                      <Button size="sm" onClick={handleAddNote}>Add Note</Button>
                    </div>
                    
                    {notes.length > 0 ? (
                      <div className="space-y-4">
                        {notes.map((note) => (
                          <Card key={note.id}>
                            <CardContent className="p-4">
                              <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm text-muted-foreground">{note.date}</span>
                                </div>
                                <span className="text-sm text-muted-foreground">{note.user}</span>
                              </div>
                              <p className="text-sm">{note.text}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-muted rounded-lg">
                        <MessageSquare className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">No notes found for this customer</p>
                        <Button variant="outline" size="sm" className="mt-4" onClick={handleAddNote}>
                          Add First Note
                        </Button>
                      </div>
                    )}
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>
          </div>
          
          {/* Customer Journey Workflow - Now with node style */}
          <div className="lg:col-span-3">
            <Card className="h-full overflow-hidden bg-gradient-to-br from-pink-50 to-indigo-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <History className="h-5 w-5 text-primary" />
                  Customer Journey
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 relative">
                {/* Dashed connector line for background */}
                <div className="absolute top-0 bottom-0 left-1/2 w-0.5 border-l-2 border-dashed border-gray-200 -translate-x-1/2 z-0"></div>
                
                <div className="relative z-10">
                  {workflowSteps.map((step, index) => (
                    <div key={step.id} className="mb-8 relative">
                      {/* Connector arrow between nodes */}
                      {index < workflowSteps.length - 1 && (
                        <div className="absolute top-16 left-1/2 -translate-x-1/2 text-gray-400 animate-bounce">
                          <ChevronDown className="h-5 w-5" />
                        </div>
                      )}
                      
                      {/* Node */}
                      <div className="flex flex-col items-center">
                        {/* Node circle with icon */}
                        <div 
                          className={`rounded-full w-16 h-16 flex items-center justify-center
                            ${step.status === 'completed' ? 'bg-green-100 text-green-600 shadow-md shadow-green-200' : 
                              step.status === 'current' ? 'bg-pink-100 text-pink-600 animate-pulse shadow-md shadow-pink-200' : 
                              'bg-gray-100 text-gray-400'} 
                            transition-all duration-300 hover:scale-110 cursor-pointer`}
                        >
                          {step.icon}
                        </div>
                        
                        {/* Node label */}
                        <div className="mt-2 text-center w-full">
                          <h3 className="font-medium text-sm text-center">{step.title}</h3>
                          <p className="text-xs text-muted-foreground text-center">{step.shortInfo}</p>
                          {step.date && (
                            <div className="flex justify-center mt-1">
                              <span className="px-2 py-0.5 bg-white/80 rounded-full text-xs text-primary">
                                {step.date}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default function CustomerPortfolioPage() {
  return (
    <ErrorBoundary
      fallback={
        <AppLayout>
          <div className="container mx-auto p-6">
            <div className="flex items-center gap-2 mb-6">
              <Button variant="ghost" onClick={() => window.location.href = '/customers'}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-bold">Customer Portfolio</h1>
            </div>
            
            <Card className="p-8 text-center">
              <h2 className="text-red-500 font-bold text-lg mb-2">Error Loading Customer</h2>
              <p className="mb-4">There was an error rendering the customer portfolio. Please try again later.</p>
              <Button onClick={() => window.location.href = "/customers"}>Return to Customers</Button>
            </Card>
          </div>
        </AppLayout>
      }
    >
      <CustomerPortfolio />
    </ErrorBoundary>
  );
} 