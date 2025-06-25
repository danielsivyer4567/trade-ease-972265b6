import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from "@/components/ui/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, Phone, Mail, Home, Calendar, FileText, Clock, Briefcase, FileSignature, History, PenLine, Trash2, MessageSquare, Download, CheckCircle, CircleDashed, MoveRight, AlertCircle, ChevronDown, FileCheck, Package, CheckSquare, Zap, Camera, DollarSign, Share2, ListChecks, NotebookText, Files, Users2, Route, BellOff, MessageCircle, PhoneIncoming, Info, Tag, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Separator } from '@/components/ui/separator';
import { CustomerData } from './components/CustomerCard';
import ErrorBoundary from '@/components/error/ErrorBoundary';
import Noodle from './components/Noodle';
import { Timeline } from './components/Timeline';
import './components/pulseLine.css';
import { ElectricNoodle } from './components/ElectricNoodle';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useState as useLocalState } from "react";

export interface CustomerWithDetails extends CustomerData {
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
export interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'upcoming';
  date?: string;
  icon: React.ReactNode;
  shortInfo?: string;
  requiresAction?: boolean; // Added for hazard signal
  isActioned?: boolean;    // Added for hazard signal
}

// Define the workflow steps based on customer data (this is an existing comment, placing new const near it)
const rightNavItems = [
  { id: 'customerJourney', label: 'Customer Journey', icon: Clock },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare },
  { id: 'notes', label: 'Notes', icon: PenLine },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'payments', label: 'Payments', icon: DollarSign },
  { id: 'associations', label: 'Associations', icon: Share2 },
];

// Helper function to toggle accordion sections
const toggleSection = (sectionId: string, setExpandedSectionsFunc: React.Dispatch<React.SetStateAction<Record<string, boolean>>>) => {
  setExpandedSectionsFunc(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
};

const CustomerPortfolio = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [customer, setCustomer] = useState<CustomerWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    contactInfo: true, // Default open for contact info
    businessDetails: true, // Default open for business details
    commandTags: false, // Add commandTags, default closed
    dndSettings: false, // Add DND settings, default closed
  }); // State for accordion sections
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [nodePositions, setNodePositions] = useState<{ x: number; y: number }[]>([]);
  const [rightColumnActiveTab, setRightColumnActiveTab] = useState('customerJourney'); // New state for right column nav
  
  // State for DND options
  const [dndOptions, setDndOptions] = useState({
    allChannels: false,
    emails: false,
    textMessages: false,
    callsVoicemails: false,
    gbp: false,
    inboundCallsSms: false,
  });

  // State for Command Tags
  const [commandTagInput, setCommandTagInput] = useState('');
  const [commandTagsList, setCommandTagsList] = useState<string[]>(['new enquiry', '01_base_assistant']); // Initial example tags

  const handleDndChange = (option: keyof typeof dndOptions) => {
    setDndOptions(prev => {
      const newState = { ...prev, [option]: !prev[option] };
      if (option === 'allChannels' && newState.allChannels) {
        // If "allChannels" is checked, check all individual channels except inboundCallsSms
        return {
          allChannels: true,
          emails: true,
          textMessages: true,
          callsVoicemails: true,
          gbp: true,
          inboundCallsSms: newState.inboundCallsSms, // Preserve its state
        };
      } else if (option === 'allChannels' && !newState.allChannels) {
        // If "allChannels" is unchecked, uncheck all individual channels
        return {
          allChannels: false,
          emails: false,
          textMessages: false,
          callsVoicemails: false,
          gbp: false,
          inboundCallsSms: newState.inboundCallsSms, // Preserve its state
        };
      } else if (['emails', 'textMessages', 'callsVoicemails', 'gbp'].includes(option) && !newState[option]) {
        // If any individual channel is unchecked, uncheck "allChannels"
        newState.allChannels = false;
      } else if (newState.emails && newState.textMessages && newState.callsVoicemails && newState.gbp) {
        // If all individual channels are checked, check "allChannels"
        newState.allChannels = true;
      }
      return newState;
    });
  };

  const handleAddCommandTag = () => {
    if (commandTagInput.trim() !== '' && !commandTagsList.includes(commandTagInput.trim())) {
      setCommandTagsList([...commandTagsList, commandTagInput.trim()]);
      setCommandTagInput('');
      toast({ title: "Tag Added", description: `Tag "${commandTagInput.trim()}" added.` });
    } else if (commandTagsList.includes(commandTagInput.trim())) {
      toast({ title: "Tag Exists", description: "This tag has already been added.", variant: "destructive" });
    }
    setCommandTagInput(''); // Clear input even if tag exists or is empty
  };

  const handleRemoveCommandTag = (tagToRemove: string) => {
    setCommandTagsList(commandTagsList.filter(tag => tag !== tagToRemove));
    toast({ title: "Tag Removed", description: `Tag "${tagToRemove}" removed.` });
  };

  // Early check for missing customer ID
  if (!id) {
    return <div className="p-8 text-center text-red-500">No customer ID provided in the URL.</div>;
  }

  // Define the animation style for the electrical effect
  const electricAnimationStyle = `
    @keyframes moveDown {
      0% {
        transform: translateY(-100%);
        opacity: 0.3;
      }
      50% {
        opacity: 1;
      }
      100% {
        transform: translateY(100%);
        opacity: 0.3;
      }
    }
    
    @keyframes slowFlash {
      0% {
        opacity: 0.7;
        box-shadow: 0 0 5px rgba(219, 39, 119, 0.3);
      }
      50% {
        opacity: 1;
        box-shadow: 0 0 15px rgba(219, 39, 119, 0.6);
      }
      100% {
        opacity: 0.7;
        box-shadow: 0 0 5px rgba(219, 39, 119, 0.3);
      }
    }
    
    @keyframes glow {
      0% {
        box-shadow: 0 0 8px rgba(59, 130, 246, 0.4);
      }
      50% {
        box-shadow: 0 0 20px rgba(59, 130, 246, 0.8);
      }
      100% {
        box-shadow: 0 0 8px rgba(59, 130, 246, 0.4);
      }
    }
    
    @keyframes noodlePulse {
      0% {
        opacity: 0.2;
        transform: translateY(-5px) scale(0.8);
      }
      20% {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
      80% {
        opacity: 1;
        transform: translateY(20px) scale(1);
      }
      100% {
        opacity: 0.2;
        transform: translateY(30px) scale(0.8);
      }
    }
    
    @keyframes progressPulse {
      0% {
        transform: translateY(0) scale(0.8);
        opacity: 0.7;
        box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
      }
      50% {
        transform: translateY(40px) scale(1.3);
        opacity: 1;
        box-shadow: 0 0 20px rgba(59, 130, 246, 0.9);
      }
      100% {
        transform: translateY(80px) scale(0.8);
        opacity: 0;
        box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
      }
    }
  `;
  
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

  // Define the workflow steps based on customer data
  const getWorkflowSteps = (): WorkflowStep[] => {
    if (!customer) return [];
    
    let steps: WorkflowStep[] = [
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

    // Add requiresAction and isActioned flags
    steps = steps.map(step => ({
      ...step,
      requiresAction: step.status === 'current', // Example: current steps require action
      isActioned: step.isActioned || false, // Initialize isActioned if not present
    }));

    return steps;
  };
  
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([]);

  useEffect(() => {
    setWorkflowSteps(getWorkflowSteps());
  }, [customer, quotes, jobs]); // Re-calculate when these change

  const handleWorkflowStepAction = (stepId: string) => {
    setWorkflowSteps(prevSteps =>
      prevSteps.map(step =>
        step.id === stepId ? { ...step, isActioned: true, requiresAction: false } : step
      )
    );
    toast({
      title: "Step Actioned",
      description: `Step "${workflowSteps.find(s => s.id === stepId)?.title}" marked as actioned.`,
    });
  };

  useEffect(() => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const positions = nodeRefs.current.map(ref => {
      if (!ref) return { x: 0, y: 0 };
      const rect = ref.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2 - containerRect.left,
        y: rect.top + rect.height - containerRect.top,
      };
    });
    setNodePositions(positions);
  }, [loading, workflowSteps.length]);

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
      {/* Inject the CSS animation for the electrical effect */}
      <style dangerouslySetInnerHTML={{ __html: electricAnimationStyle }} />
      
      <div className="w-full px-3 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Sidebar */}
          <div className="lg:col-span-3 flex flex-col h-full">
            <Card className="h-full flex flex-col">
              <CardHeader className="p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Button variant="ghost" size="sm" onClick={() => navigate('/customers')} className="p-1">
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <h1 className="text-xl font-semibold text-gray-700">Customer Portfolio</h1>
                </div>
                <div className="pl-[calc(theme(spacing.1)+theme(spacing.5)+theme(spacing.2))] mb-3">
                  <div className="w-3/4 border-b border-gray-300"></div>
                </div>
                <div className="flex flex-col items-center text-center">
                  {/* Avatar/Profile Picture with upload & Street View */}
                  <ProfilePictureUpload
                    customer={customer}
                    customerId={id}
                  />
                  <h2 className="text-md font-semibold">
                    {customer.name}
                    {customer.customer_code && (
                      <span className="ml-2 text-xs bg-gray-100 px-1.5 py-0.5 rounded-full text-gray-600">
                        {customer.customer_code}
                      </span>
                    )}
                  </h2>
                  <div className="mt-1">
                    <span className={`inline-block px-2 py-0.5 text-xs rounded-full ${
                      customer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {customer.status}
                    </span>
                  </div>
                  {customer.business_name && (
                    <p className="text-xs text-muted-foreground mt-1">{customer.business_name}</p>
                  )}
                </div>
              </CardHeader>
              
              <Separator />

              {/* Accordion Sections Start Here */}
              <CardContent className="p-3 flex-grow space-y-1 overflow-y-auto"> {/* Reduced space-y, added overflow */}
                
                {/* Contact Info Accordion Item */}
                <div className="border-b border-gray-200 last:border-b-0">
                  <button 
                    onClick={() => toggleSection('contactInfo', setExpandedSections)}
                    className="w-full flex justify-between items-center py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-t-md"
                  >
                    <span>Contact Info</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections['contactInfo'] ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedSections['contactInfo'] && (
                    <div className="pt-1 pb-2 space-y-1.5 pl-2 pr-1"> {/* Content padding */}
                      <div className="space-y-1.5">
                        {/* Email, Phone, Address */}
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <span className="text-sm truncate" title={customer.email}>{customer.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <span className="text-sm truncate" title={customer.phone}>{customer.phone}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Home className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <span className="text-sm">
                            {customer.address}, {customer.city}, {customer.state} {customer.zipCode}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5 pt-2">
                        {/* Send Message, Edit Customer Buttons */}
                        <Button variant="outline" size="sm" className="w-full flex items-center gap-2 justify-start" onClick={handleSendMessage}>
                          <MessageSquare className="h-4 w-4" />
                          <span>Send Message</span>
                        </Button>
                        <Button variant="outline" size="sm" className="w-full flex items-center gap-2 justify-start" onClick={() => navigate(`/customers/${id}/edit`)}>
                          <PenLine className="h-4 w-4" />
                          <span>Edit Customer</span>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Business Details Accordion Item */}
                <div className="border-b border-gray-200 last:border-b-0">
                  <button 
                    onClick={() => toggleSection('businessDetails', setExpandedSections)}
                    className="w-full flex justify-between items-center py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <span>Business Details</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections['businessDetails'] ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedSections['businessDetails'] && (
                    <div className="pt-1 pb-2 space-y-1.5 pl-2 pr-1"> {/* Content padding */}
                      <div>
                        <p className="text-xs font-medium">Business Name</p>
                        <p className="text-xs text-muted-foreground">{customer.business_name || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium">ABN</p>
                        <p className="text-xs text-muted-foreground">{customer.abn || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium">ACN</p>
                        <p className="text-xs text-muted-foreground">{customer.acn || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium">State License</p>
                        <p className="text-xs text-muted-foreground">
                          {customer.state_licence_state && customer.state_licence_number
                            ? `${customer.state_licence_state}: ${customer.state_licence_number}`
                            : 'N/A'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* COMMANDEMENTS Section */}
                <div className="pt-2">
                  <h3 className="px-1 pt-3 pb-1 text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                    COMMANDEMENTS
                  </h3>
                  {/* Command Tags Accordion Item */}
                  <div className="border-b border-gray-200 last:border-b-0">
                    <button
                      onClick={() => toggleSection('commandTags', setExpandedSections)}
                      className="w-full flex justify-between items-center py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-t-md"
                    >
                      <span className="flex items-center">
                        <Tag className="h-4 w-4 mr-2 text-muted-foreground flex-shrink-0" />
                        Command Tags
                      </span>
                      <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections['commandTags'] ? 'rotate-180' : ''}`} />
                    </button>
                    {expandedSections['commandTags'] && (
                      <div className="pt-2 pb-3 space-y-3 pl-2 pr-1">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="Add Tags"
                            value={commandTagInput}
                            onChange={(e) => setCommandTagInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddCommandTag()}
                            className="flex-grow p-1.5 border border-gray-300 rounded-md text-xs focus:ring-primary focus:border-primary"
                          />
                          <Button size="sm" onClick={handleAddCommandTag} className="text-xs px-2.5 py-1.5">Add</Button>
                        </div>
                        {commandTagsList.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {commandTagsList.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs font-normal pl-2 pr-1 py-0.5">
                                {tag}
                                <button
                                  onClick={() => handleRemoveCommandTag(tag)}
                                  className="ml-1.5 p-0.5 rounded-full hover:bg-muted-foreground/20"
                                  aria-label={`Remove ${tag}`}
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {/* Placeholder for future Automation and Opportunities sections within COMMANDEMENTS */}
                </div>

                {/* DND Settings Accordion Item */}
                <div className="border-b border-gray-200 last:border-b-0 pt-2"> {/* Added pt-2 for spacing */}
                  <button
                    onClick={() => toggleSection('dndSettings', setExpandedSections)}
                    className="w-full flex justify-between items-center py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <span>DND Settings</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections['dndSettings'] ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedSections['dndSettings'] && (
                    <div className="pt-2 pb-3 space-y-2.5 pl-2 pr-1">
                      {/* DND all channels */}
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="dndAll"
                          checked={dndOptions.allChannels}
                          onChange={() => handleDndChange('allChannels')}
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        />
                        <label htmlFor="dndAll" className="text-xs font-medium text-gray-700 flex items-center">
                          <BellOff className="h-4 w-4 mr-1.5 text-muted-foreground" /> DND all channels
                        </label>
                      </div>

                      <div className="relative my-2">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                          <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center">
                          <span className="bg-white px-2 text-xs text-gray-500">OR</span>
                        </div>
                      </div>

                      {/* Individual DND options */}
                      {[
                        { id: 'emails', label: 'Emails', icon: Mail, optionKey: 'emails' as keyof typeof dndOptions },
                        { id: 'textMessages', label: 'Text Messages', icon: MessageSquare, optionKey: 'textMessages' as keyof typeof dndOptions },
                        { id: 'callsVoicemails', label: 'Calls & Voicemails', icon: PhoneIncoming, optionKey: 'callsVoicemails' as keyof typeof dndOptions },
                        { id: 'gbp', label: 'GBP', icon: Users2, optionKey: 'gbp' as keyof typeof dndOptions }, // Assuming Users2 for GBP, replace if a better icon exists
                      ].map(item => (
                        <div key={item.id} className="flex items-center space-x-2 pl-1">
                          <input
                            type="checkbox"
                            id={item.id}
                            checked={dndOptions[item.optionKey]}
                            onChange={() => handleDndChange(item.optionKey)}
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                            disabled={dndOptions.allChannels && item.optionKey !== 'inboundCallsSms'}
                          />
                          <label htmlFor={item.id} className="text-xs text-gray-600 flex items-center">
                            <item.icon className="h-4 w-4 mr-1.5 text-muted-foreground" /> {item.label}
                          </label>
                        </div>
                      ))}
                      
                      <Separator className="my-2.5" />

                      {/* DND Inbound Calls and SMS */}
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="dndInbound"
                          checked={dndOptions.inboundCallsSms}
                          onChange={() => handleDndChange('inboundCallsSms')}
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        />
                        <label htmlFor="dndInbound" className="text-xs font-medium text-gray-700 flex items-center">
                          DND Inbound Calls and SMS
                          <span /* title="This setting affects direct inbound calls and SMS messages only." */ >
                            <Info className="h-3.5 w-3.5 ml-1 text-muted-foreground cursor-pointer" />
                          </span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                {/* Placeholder Accordion Items */}
                {[
                  'General Info', 'Additional Info', 'Forms', 'Automations', 
                  'Opportunities', 'Client Portal', 'Groups'
                ].map(sectionTitle => (
                  <div key={sectionTitle} className="border-b border-gray-200 last:border-b-0">
                    <button 
                      onClick={() => toggleSection(sectionTitle.toLowerCase().replace(' ', ''), setExpandedSections)}
                      className="w-full flex justify-between items-center py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      <span>{sectionTitle}</span>
                      <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections[sectionTitle.toLowerCase().replace(' ', '')] ? 'rotate-180' : ''}`} />
                    </button>
                    {expandedSections[sectionTitle.toLowerCase().replace(' ', '')] && (
                      <div className="pt-1 pb-2 pl-2 pr-1 text-xs text-muted-foreground">
                        Inputs and custom fields for {sectionTitle} to be added here.
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-6">
            <Card>
              <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
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
                                  <a href="https://storage.googleapis.com/msgsndr/AxB6SfBsvJhVRvNHszfZ/media/681d97d3263b9d6b8e6407f5.png" className="underline text-white font-semibold" target="_blank" rel="noopener noreferrer">View Image</a>
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

                      {/* --- MESSAGE INPUT BAR --- */}
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
                          <input className="border rounded px-2 py-1 text-xs w-40" value={customer.phone} readOnly />
                          <span className="text-xs text-gray-500">To:</span>
                          <input className="border rounded px-2 py-1 text-xs w-40" value={customer.phone} readOnly />
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
          
          {/* === Right Column - Transformed === */}
          <div className="lg:col-span-3">
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
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

function ProfilePictureUpload({ customer, customerId }: { customer: any, customerId: string }) {
  const [streetViewUrl, setStreetViewUrl] = useState<string | null>(null);

  // Helper to clean and format the address
  const formatAddress = () => {
    if (!customer) return '';
    // Remove extra spaces and commas, and avoid duplicate suburb
    let address = `${customer.address || ''}, ${customer.city || ''}, ${customer.state || ''} ${customer.zipCode || ''}`;
    address = address.replace(/\\s+,/g, ',').replace(/,+/g, ',').replace(/\\s{2,}/g, ' ').trim();
    return address;
  };

  // Generate Google Street View image URL
  const getStreetViewUrl = () => {
    const address = encodeURIComponent(formatAddress());
<<<<<<< HEAD
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ""; // Use environment variable
=======
    const apiKey = "qbBoQkZzbSYl80ncHWOjHDtEMm0="; // Updated API key
>>>>>>> 36fe2b8b6a4c5197b88aa6f671b0288a98028ae7
    return `https://maps.googleapis.com/maps/api/streetview?size=200x200&location=${address}&key=${apiKey}`;
  };

  useEffect(() => {
    if (customer && customer.address) {
      const url = getStreetViewUrl();
      setStreetViewUrl(url);
      console.log('Street View URL:', url); // For debugging
    }
  }, [customer]);

  return (
    <div className="relative w-20 h-20 mb-2 flex flex-col items-center">
      <Avatar className="w-20 h-20">
        {streetViewUrl ? (
          <AvatarImage
            src={streetViewUrl}
            alt="Street View"
            onError={e => (e.currentTarget.src = '/fallback-image.png')}
          />
        ) : (
          <AvatarFallback>
            <User className="h-10 w-10 text-primary" />
          </AvatarFallback>
        )}
      </Avatar>
    </div>
  );
}

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