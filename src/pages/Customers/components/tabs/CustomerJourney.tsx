import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileSearch, 
  ClipboardList, 
  Image, 
  ChevronRight,
  ChevronDown,
  ChevronUp,
  FileText,
  ReceiptText,
  CheckCircle,
  AlertCircle,
  Package,
  Briefcase
} from "lucide-react";
import { 
  customerService, 
  SiteAudit, 
  Quote, 
  Job, 
  Invoice,
  SiteAuditPhoto
} from "@/services/CustomerService";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import './CustomerJourney.css';

type Step = {
  id: number;
  label: string;
  status: 'completed' | 'current' | 'pending';
  icon: JSX.Element;
  data?: any;
};

interface CustomerJourneyProps {
  customerId: string;
}

// Add these variants for the animation
const containerVariants = {
  initial: { y: 0 },
  active: { y: 20 }
};

const stepVariants = {
  initial: { y: 0 },
  active: { y: 20 }
};

export function CustomerJourney({ customerId }: CustomerJourneyProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [clickedStep, setClickedStep] = useState<number | null>(null);
  
  const [audits, setAudits] = useState<SiteAudit[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [auditPhotos, setAuditPhotos] = useState<Record<string, SiteAuditPhoto[]>>({});
  
  // Convert existing data to steps
  const steps: Step[] = [
    { 
      id: 1, 
      label: 'Site Audit', 
      status: audits.length > 0 ? 'completed' : 'pending',
      icon: <FileSearch className="h-5 w-5" />,
      data: audits
    },
    { 
      id: 2, 
      label: 'Quote', 
      status: quotes.length > 0 ? 'completed' : 'pending',
      icon: <FileText className="h-5 w-5" />,
      data: quotes
    },
    { 
      id: 3, 
      label: 'Job', 
      status: jobs.length > 0 ? 'completed' : 'pending',
      icon: <Briefcase className="h-5 w-5" />,
      data: jobs
    },
    { 
      id: 4, 
      label: 'Invoice', 
      status: invoices.length > 0 ? 'completed' : 'pending',
      icon: <ReceiptText className="h-5 w-5" />,
      data: invoices
    }
  ];

  useEffect(() => {
    async function loadCustomerJourney() {
      try {
        setLoading(true);
        const journey = await customerService.getCustomerJourney(customerId);
        
        setAudits(journey.audits || []);
        setQuotes(journey.quotes || []);
        setJobs(journey.jobs || []);
        setInvoices(journey.invoices || []);
        
        // Load photos for each audit
        const photosMap: Record<string, SiteAuditPhoto[]> = {};
        for (const audit of journey.audits || []) {
          const photos = await customerService.getAuditPhotos(audit.id);
          photosMap[audit.id] = photos;
        }
        setAuditPhotos(photosMap);
      } catch (error) {
        console.error("Error loading customer journey:", error);
        toast({
          title: "Error",
          description: "Failed to load customer journey data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }
    
    loadCustomerJourney();
  }, [customerId, toast]);

  const handleCompleteStep = () => {
    setShowPopup(false);
    if (activeStep < steps.length) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleReverseStep = () => {
    if (activeStep > 1) {
      setActiveStep(prev => prev - 1);
    }
  };

  const triggerPopup = () => {
    setShowPopup(true);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  const handleCreateQuoteFromAudit = async (auditId: string) => {
    try {
      const quote = await customerService.createQuoteFromAudit(auditId, customerId, {
        title: `Quote from audit ${auditId}`,
        amount: 0
      });
      
      if (quote) {
        toast({
          title: "Success",
          description: "Quote created successfully"
        });
        
        // Reload quotes
        const updatedQuotes = await customerService.getCustomerQuotes(customerId);
        setQuotes(updatedQuotes);
      }
    } catch (error) {
      console.error("Error creating quote from audit:", error);
      toast({
        title: "Error",
        description: "Failed to create quote from audit",
        variant: "destructive"
      });
    }
  };
  
  const handleCreateJobFromQuote = async (quoteId: string) => {
    try {
      const job = await customerService.createJobFromQuote(quoteId, customerId);
      
      if (job) {
        toast({
          title: "Success",
          description: "Job created successfully"
        });
        
        // Reload jobs
        const updatedJobs = await customerService.getCustomerJobs(customerId);
        setJobs(updatedJobs);
      }
    } catch (error) {
      console.error("Error creating job from quote:", error);
      toast({
        title: "Error",
        description: "Failed to create job from quote",
        variant: "destructive"
      });
    }
  };
  
  const handleCreateInvoiceFromJob = async (jobId: string, amount: number) => {
    try {
      const invoice = await customerService.createInvoiceFromJob(jobId, customerId, amount);
      
      if (invoice) {
        toast({
          title: "Success",
          description: "Invoice created successfully"
        });
        
        // Reload invoices
        const updatedInvoices = await customerService.getCustomerInvoices(customerId);
        setInvoices(updatedInvoices);
      }
    } catch (error) {
      console.error("Error creating invoice from job:", error);
      toast({
        title: "Error",
        description: "Failed to create invoice from job",
        variant: "destructive"
      });
    }
  };
  
  const handleStepClick = (stepId: number) => {
    setClickedStep(stepId);
    triggerPopup();
  };

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }
  
  return (
    <div className="p-4 space-y-0 relative">
      {/* Background gradient with dotted pattern */}
      <div className="absolute inset-0 z-0 rounded-lg"> 
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: 'none',
          }}
        ></div>
      </div>

      {/* Content container with proper z-index */}
      <div className="relative z-10">
        <h3 className="text-lg font-medium mb-6">Customer Journey</h3>
        
        {/* Enhanced workflow layout with Framer Motion */}
        <motion.div 
          className="flex flex-col items-center mt-10 space-y-6 relative"
          variants={containerVariants}
          animate={clickedStep ? "active" : "initial"}
          transition={{ duration: 0.3 }}
        >
          {steps.map((step, index) => {
            const isActive = activeStep === step.id;
            const isCompleted = step.id < activeStep;
            const isClicked = clickedStep === step.id;

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ 
                  opacity: 1, 
                  y: isClicked ? 20 : 0 
                }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center"
              >
                <motion.div
                  className={`p-6 border-4 w-[200px] h-[100px] flex flex-col items-center justify-center cursor-pointer relative`}
                  style={{ borderRadius: '0 !important' }}
                  onClick={() => handleStepClick(step.id)}
                  variants={stepVariants}
                  animate={isClicked ? "active" : "initial"}
                >
                  <div
                    className="journey-rect-ring"
                    style={{
                      borderColor: isCompleted
                        ? '#22c55e'
                        : isActive
                        ? '#3b82f6'
                        : '#d1d5db',
                      backgroundColor: isCompleted
                        ? '#bbf7d0'
                        : isActive
                        ? '#dbeafe'
                        : '#f3f4f6',
                    }}
                  >
                    {step.icon}
                  </div>
                  <span className="mt-2 text-sm font-medium">{step.label}</span>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Pop-up Confirmation */}
        <AnimatePresence>
          {showPopup && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed bg-white p-6 shadow-xl rounded-xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
            >
              <p className="mb-4 font-medium">Mark this step as completed?</p>
              <div className="flex space-x-4 justify-center">
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded"
                  onClick={() => {
                    handleCompleteStep();
                    setClickedStep(null);
                  }}
                >
                  Yes
                </button>
                <button
                  className="bg-gray-300 px-4 py-2 rounded"
                  onClick={() => {
                    setShowPopup(false);
                    setClickedStep(null);
                  }}
                >
                  No
                </button>
                {activeStep > 1 && (
                  <button
                    className="bg-red-400 text-white px-4 py-2 rounded"
                    onClick={() => {
                      handleReverseStep();
                      setClickedStep(null);
                    }}
                  >
                    Undo
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Existing sections with data */}
        <div className="mt-8 space-y-4">
          {/* Site Audits Section */}
          <Card className={`border border-gray-200 bg-white hover:border-gray-300 transition-all ${expandedSection === 'audits' ? 'shadow-md' : ''}`}>
            <CardHeader 
              className="bg-slate-50 cursor-pointer flex flex-row items-center justify-between py-3"
              onClick={() => setExpandedSection(expandedSection === 'audits' ? null : 'audits')}
            >
              <div className="flex items-center">
                <FileSearch className="h-5 w-5 mr-2 text-blue-600" />
                <CardTitle className="text-md font-medium">Site Audits</CardTitle>
              </div>
              {expandedSection === 'audits' ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </CardHeader>
            
            {expandedSection === 'audits' && (
              <CardContent className="px-4 py-3">
                {audits.length > 0 ? (
                  <div className="space-y-3">
                    {audits.map(audit => (
                      <Card key={audit.id} className="border border-gray-200">
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">{audit.title}</h4>
                              <p className="text-sm text-gray-500">
                                {formatDate(audit.date)} • {audit.location}
                              </p>
                            </div>
                            <Badge
                              variant={
                                audit.status === 'completed' ? 'default' :
                                audit.status === 'in_progress' ? 'secondary' : 'outline'
                              }
                            >
                              {audit.status}
                            </Badge>
                          </div>
                          
                          {/* Audit Photos */}
                          {auditPhotos[audit.id] && auditPhotos[audit.id].length > 0 && (
                            <div className="mt-3">
                              <p className="text-sm font-medium mb-2">Photos:</p>
                              <div className="flex overflow-x-auto gap-2 pb-2">
                                {auditPhotos[audit.id].map(photo => (
                                  <div key={photo.id} className="flex-shrink-0">
                                    <img 
                                      src={photo.photo_url}
                                      alt={photo.caption || "Audit photo"}
                                      className="h-16 w-16 object-cover rounded-md border border-gray-200"
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <div className="mt-3 flex justify-end">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="flex items-center text-blue-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCreateQuoteFromAudit(audit.id);
                              }}
                            >
                              <FileText className="h-4 w-4 mr-1" />
                              Create Quote
                              <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <FileSearch className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No site audits yet</p>
                  </div>
                )}
              </CardContent>
            )}
          </Card>
          
          {/* Quotes Section */}
          <Card className={`border border-gray-200 bg-white hover:border-gray-300 transition-all ${expandedSection === 'quotes' ? 'shadow-md' : ''}`}>
            <CardHeader 
              className="bg-slate-50 cursor-pointer flex flex-row items-center justify-between py-3"
              onClick={() => setExpandedSection(expandedSection === 'quotes' ? null : 'quotes')}
            >
              <div className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-amber-600" />
                <CardTitle className="text-md font-medium">Quotes</CardTitle>
              </div>
              {expandedSection === 'quotes' ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </CardHeader>
            
            {expandedSection === 'quotes' && (
              <CardContent className="px-4 py-3">
                {quotes.length > 0 ? (
                  <div className="space-y-3">
                    {quotes.map(quote => (
                      <Card key={quote.id} className="border border-gray-200">
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">{quote.title}</h4>
                              <p className="text-sm text-gray-500">
                                {formatDate(quote.created_at)} • ${quote.amount.toFixed(2)}
                              </p>
                            </div>
                            <Badge
                              variant={
                                quote.status === 'approved' ? 'default' :
                                quote.status === 'rejected' ? 'destructive' : 'outline'
                              }
                            >
                              {quote.status}
                            </Badge>
                          </div>
                          
                          {!quote.job_id && quote.status === 'approved' && (
                            <div className="mt-3 flex justify-end">
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="flex items-center text-green-600"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCreateJobFromQuote(quote.id);
                                }}
                              >
                                <ClipboardList className="h-4 w-4 mr-1" />
                                Create Job
                                <ChevronRight className="h-4 w-4 ml-1" />
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No quotes yet</p>
                  </div>
                )}
              </CardContent>
            )}
          </Card>
          
          {/* Jobs Section */}
          <Card className={`border border-gray-200 bg-white hover:border-gray-300 transition-all ${expandedSection === 'jobs' ? 'shadow-md' : ''}`}>
            <CardHeader 
              className="bg-slate-50 cursor-pointer flex flex-row items-center justify-between py-3"
              onClick={() => setExpandedSection(expandedSection === 'jobs' ? null : 'jobs')}
            >
              <div className="flex items-center">
                <ClipboardList className="h-5 w-5 mr-2 text-green-600" />
                <CardTitle className="text-md font-medium">Jobs</CardTitle>
              </div>
              {expandedSection === 'jobs' ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </CardHeader>
            
            {expandedSection === 'jobs' && (
              <CardContent className="px-4 py-3">
                {jobs.length > 0 ? (
                  <div className="space-y-3">
                    {jobs.map(job => (
                      <Card key={job.id} className="border border-gray-200">
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">{job.title}</h4>
                              <p className="text-sm text-gray-500">
                                {formatDate(job.created_at)}
                                {job.start_date && ` • Start: ${formatDate(job.start_date)}`}
                                {job.end_date && ` • End: ${formatDate(job.end_date)}`}
                              </p>
                            </div>
                            <Badge
                              variant={
                                job.status === 'completed' ? 'default' :
                                job.status === 'in_progress' ? 'secondary' :
                                job.status === 'cancelled' ? 'destructive' : 'outline'
                              }
                            >
                              {job.status}
                            </Badge>
                          </div>
                          
                          {(job.status === 'completed' || job.status === 'in_progress') && (
                            <div className="mt-3 flex justify-end">
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="flex items-center text-violet-600"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Get the amount from the associated quote if available
                                  const relatedQuote = quotes.find(q => q.id === job.quote_id);
                                  handleCreateInvoiceFromJob(job.id, relatedQuote?.amount || 0);
                                }}
                              >
                                <ReceiptText className="h-4 w-4 mr-1" />
                                Create Invoice
                                <ChevronRight className="h-4 w-4 ml-1" />
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <ClipboardList className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No jobs yet</p>
                  </div>
                )}
              </CardContent>
            )}
          </Card>
          
          {/* Invoices Section */}
          <Card className={`border border-gray-200 bg-white hover:border-gray-300 transition-all ${expandedSection === 'invoices' ? 'shadow-md' : ''}`}>
            <CardHeader 
              className="bg-slate-50 cursor-pointer flex flex-row items-center justify-between py-3"
              onClick={() => setExpandedSection(expandedSection === 'invoices' ? null : 'invoices')}
            >
              <div className="flex items-center">
                <ReceiptText className="h-5 w-5 mr-2 text-violet-600" />
                <CardTitle className="text-md font-medium">Invoices</CardTitle>
              </div>
              {expandedSection === 'invoices' ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </CardHeader>
            
            {expandedSection === 'invoices' && (
              <CardContent className="px-4 py-3">
                {invoices.length > 0 ? (
                  <div className="space-y-3">
                    {invoices.map(invoice => (
                      <Card key={invoice.id} className="border border-gray-200">
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">Invoice #{invoice.id}</h4>
                              <p className="text-sm text-gray-500">
                                {formatDate(invoice.created_at)} • ${invoice.amount.toFixed(2)}
                              </p>
                              <p className="text-xs text-gray-500">
                                Due: {formatDate(invoice.due_date)}
                                {invoice.payment_date && ` • Paid: ${formatDate(invoice.payment_date)}`}
                              </p>
                            </div>
                            <Badge
                              variant={
                                invoice.status === 'paid' ? 'default' :
                                invoice.status === 'overdue' ? 'destructive' :
                                invoice.status === 'sent' ? 'secondary' : 'outline'
                              }
                            >
                              {invoice.status}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <ReceiptText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No invoices yet</p>
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
} 