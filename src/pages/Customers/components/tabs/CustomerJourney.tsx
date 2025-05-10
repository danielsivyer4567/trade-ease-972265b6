import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileSearch, 
  FileText, 
  ClipboardList, 
  ReceiptText, 
  Image, 
  ChevronRight,
  ChevronDown,
  ChevronUp
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

// Add keyframes for animation
const flowAnimationKeyframes = `
  @keyframes dash {
    to {
      stroke-dashoffset: -20;
    }
  }
  
  @keyframes pulse {
    0% {
      transform: scale(0.8);
      opacity: 0.5;
      box-shadow: 0 0 5px #3b82f6;
    }
    50% {
      transform: scale(1.1);
      opacity: 1;
      box-shadow: 0 0 10px #3b82f6;
    }
    100% {
      transform: scale(0.8);
      opacity: 0.5;
      box-shadow: 0 0 5px #3b82f6;
    }
  }

  @keyframes slideDotVertical {
    0% {
      transform: translateY(-20px);
      opacity: 0;
    }
    30% {
      opacity: 1;
    }
    70% {
      opacity: 1; 
    }
    100% {
      transform: translateY(20px);
      opacity: 0;
    }
  }

  @keyframes slideDotHorizontal {
    0% {
      transform: translateX(-10px);
      opacity: 0;
    }
    30% {
      opacity: 1;
    }
    70% {
      opacity: 1; 
    }
    100% {
      transform: translateX(10px);
      opacity: 0;
    }
  }

  @keyframes electricPulse {
    0% {
      stroke-width: 1.5;
      stroke-opacity: 0.2;
      filter: drop-shadow(0 0 1px #3b82f6);
    }
    50% {
      stroke-width: 2.5;
      stroke-opacity: 0.8;
      filter: drop-shadow(0 0 3px #3b82f6);
    }
    100% {
      stroke-width: 1.5;
      stroke-opacity: 0.2;
      filter: drop-shadow(0 0 1px #3b82f6);
    }
  }

  @keyframes electricFlow {
    0% {
      stroke-dashoffset: 100;
    }
    100% {
      stroke-dashoffset: 0;
    }
  }

  @keyframes sparkleOpacity {
    0%, 100% { opacity: 0; }
    50% { opacity: 1; }
  }

  .electric-path {
    stroke-dasharray: 4, 7;
    animation: electricFlow 1.5s linear infinite;
  }

  .electric-pulse {
    animation: electricPulse 2s ease-in-out infinite;
  }

  .sparkle {
    animation: sparkleOpacity 0.8s infinite;
  }

  .animated-line-vertical {
    stroke-dasharray: 5;
    stroke-dashoffset: 0;
    animation: dash 1s linear infinite;
  }
  
  .animated-dot-vertical {
    animation: slideDotVertical 1.5s ease-in-out infinite;
  }

  .animated-line-horizontal {
    stroke-dasharray: 5;
    stroke-dashoffset: 0;
    animation: dash 1s linear infinite;
  }
  
  .animated-dot-horizontal {
    animation: slideDotHorizontal 1.5s ease-in-out infinite;
  }
`;

interface CustomerJourneyProps {
  customerId: string;
}

export function CustomerJourney({ customerId }: CustomerJourneyProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  
  const [audits, setAudits] = useState<SiteAudit[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [auditPhotos, setAuditPhotos] = useState<Record<string, SiteAuditPhoto[]>>({});
  
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
  
  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
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
  
  // Electric connector component
  const ElectricConnector = ({ 
    label = "", 
    isActive = true, 
    direction = "down"
  }: { 
    label?: string; 
    isActive?: boolean;
    direction?: "down" | "up" | "left" | "right";
  }) => {
    const height = direction === "down" || direction === "up" ? 64 : 4;
    const width = direction === "left" || direction === "right" ? 64 : 4;
    const sparklePositions = [
      { x: width / 2, y: height * 0.2 },
      { x: width / 2, y: height * 0.5 },
      { x: width / 2, y: height * 0.8 }
    ];

    return (
      <div className="relative h-16 flex items-center justify-center mx-auto w-full max-w-[2px]">
        {/* Background line */}
        <div className="absolute h-full w-[2px] bg-gray-200"></div>
        
        {/* Main SVG with animation */}
        <svg width={width} height={height} className="absolute">
          <defs>
            <filter id="electric-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur" />
              <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0.3  0 0 1 0 1  0 0 0 10 -5" result="glow" />
              <feBlend in="SourceGraphic" in2="glow" mode="normal" />
            </filter>
            
            <linearGradient id="electricGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#60a5fa" stopOpacity="1" />
              <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.8" />
            </linearGradient>
          </defs>
          
          {/* Main electric path */}
          {isActive && (
            <>
              <path 
                d={`M2,0 Q2,${height/3} 2,${height/2} Q2,${2*height/3} 2,${height}`}
                stroke="url(#electricGradient)" 
                strokeWidth="2"
                fill="none"
                className="electric-path electric-pulse"
                style={{ filter: 'url(#electric-glow)' }}
              />
              
              {/* Additional decorative sparks */}
              {sparklePositions.map((pos, i) => (
                <circle 
                  key={i}
                  cx={pos.x} 
                  cy={pos.y} 
                  r="1.5"
                  fill="#60a5fa"
                  className="sparkle"
                  style={{ animationDelay: `${i * 0.3}s` }}
                />
              ))}
            </>
          )}
          
          {/* Static line when not active */}
          {!isActive && (
            <line 
              x1="2" 
              y1="0" 
              x2="2" 
              y2={height} 
              stroke="#e2e8f0" 
              strokeWidth="2"
            />
          )}
        </svg>
        
        {/* Center dot */}
        <div 
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-blue-500 z-10 ${isActive ? 'animate-pulse' : ''}`}
          style={{
            boxShadow: isActive ? "0 0 8px rgba(59, 130, 246, 0.8)" : "0 0 4px rgba(59, 130, 246, 0.4)"
          }}
        ></div>
        
        {/* Label if provided */}
        {label && (
          <div 
            className="absolute -right-16 top-1/2 -translate-y-1/2 text-xs bg-blue-50 px-2 py-1 rounded-full text-blue-600 border border-blue-200 z-20"
            style={{
              boxShadow: '0 0 5px rgba(59, 130, 246, 0.2)',
              whiteSpace: 'nowrap'
            }}
          >
            {label}
          </div>
        )}
      </div>
    );
  };

  // Electric horizontal connector
  const ElectricHorizontalConnector = ({ 
    width = 40,
    isActive = true
  }: { 
    width?: number;
    isActive?: boolean;
  }) => {
    const sparklePositions = [
      { x: width * 0.3, y: 2 },
      { x: width * 0.6, y: 2 },
      { x: width * 0.9, y: 2 }
    ];
    
    return (
      <div className="relative h-2 mx-2" style={{ width: `${width}px` }}>
        {/* Background line */}
        <div className="absolute top-1/2 -translate-y-1/2 h-[2px] w-full bg-gray-200"></div>
        
        {/* SVG with animated path */}
        <svg width={width} height="4" className="absolute top-1/2 -translate-y-1/2">
          <defs>
            <filter id="electric-glow-horiz" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="1" result="blur" />
              <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0.3  0 0 1 0 1  0 0 0 8 -5" result="glow" />
              <feBlend in="SourceGraphic" in2="glow" mode="normal" />
            </filter>
            
            <linearGradient id="horizontalElectricGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.8" />
              <stop offset="70%" stopColor="#60a5fa" stopOpacity="1" />
              <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.8" />
            </linearGradient>
          </defs>
          
          {/* Main path with electricity effect */}
          {isActive && (
            <>
              <path 
                d={`M0,2 Q${width/3},2 ${width/2},2 Q${2*width/3},2 ${width-6},2`}
                stroke="url(#horizontalElectricGradient)" 
                strokeWidth="2"
                fill="none"
                className="electric-path electric-pulse"
                style={{ filter: 'url(#electric-glow-horiz)' }}
              />
              
              {/* Arrow tip */}
              <polygon 
                points={`${width-6},0 ${width},2 ${width-6},4`} 
                fill="#60a5fa"
                className={isActive ? "animate-pulse" : ""}
              />
              
              {/* Additional decorative sparks */}
              {sparklePositions.map((pos, i) => (
                <circle 
                  key={i}
                  cx={pos.x} 
                  cy={pos.y} 
                  r="1.2"
                  fill="#60a5fa"
                  className="sparkle"
                  style={{ animationDelay: `${i * 0.3}s` }}
                />
              ))}
            </>
          )}
          
          {/* Static path when not active */}
          {!isActive && (
            <>
              <line 
                x1="0" 
                y1="2" 
                x2={width - 6} 
                y2="2" 
                stroke="#e2e8f0" 
                strokeWidth="2"
              />
              <polygon 
                points={`${width-6},0 ${width},2 ${width-6},4`} 
                fill="#e2e8f0"
              />
            </>
          )}
        </svg>
      </div>
    );
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
            backgroundImage: 'radial-gradient(circle, rgba(0, 0, 0, 0.05) 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        ></div>
      </div>

      {/* Content container with proper z-index */}
      <div className="relative z-10">
        <style>{flowAnimationKeyframes}</style>
        <h3 className="text-lg font-medium mb-6">Customer Journey</h3>
        
        {/* Enhanced workflow layout with a diagram-like appearance */}
        <div className="w-full flex flex-col items-center mb-6">
          <div className="flex flex-row items-center justify-center space-x-2 text-xs text-gray-500">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-600 mr-1"></div>
              <span>Audit</span>
            </div>
            <ElectricHorizontalConnector width={40} isActive={true} />
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-amber-600 mr-1"></div>
              <span>Quote</span>
            </div>
            <ElectricHorizontalConnector width={40} isActive={true} />
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-600 mr-1"></div>
              <span>Job</span>
            </div>
            <ElectricHorizontalConnector width={40} isActive={true} />
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-violet-600 mr-1"></div>
              <span>Invoice</span>
            </div>
          </div>
        </div>
        
        {/* Site Audits Section */}
        <Card className={`border border-gray-200 bg-white hover:border-gray-300 transition-all ${expandedSection === 'audits' ? 'shadow-md' : ''}`}>
          <CardHeader 
            className="bg-slate-50 cursor-pointer flex flex-row items-center justify-between py-3"
            onClick={() => toggleSection('audits')}
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
        
        {/* Animated connector between Audits and Quotes */}
        <ElectricConnector label="Creates" isActive={audits.length > 0} />
        
        {/* Quotes Section */}
        <Card className={`border border-gray-200 bg-white hover:border-gray-300 transition-all ${expandedSection === 'quotes' ? 'shadow-md' : ''}`}>
          <CardHeader 
            className="bg-slate-50 cursor-pointer flex flex-row items-center justify-between py-3"
            onClick={() => toggleSection('quotes')}
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
        
        {/* Animated connector between Quotes and Jobs */}
        <ElectricConnector label="Converts to" isActive={quotes.length > 0} />
        
        {/* Jobs Section */}
        <Card className={`border border-gray-200 bg-white hover:border-gray-300 transition-all ${expandedSection === 'jobs' ? 'shadow-md' : ''}`}>
          <CardHeader 
            className="bg-slate-50 cursor-pointer flex flex-row items-center justify-between py-3"
            onClick={() => toggleSection('jobs')}
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
        
        {/* Animated connector between Jobs and Invoices */}
        <ElectricConnector label="Generates" isActive={jobs.length > 0} />
        
        {/* Invoices Section */}
        <Card className={`border border-gray-200 bg-white hover:border-gray-300 transition-all ${expandedSection === 'invoices' ? 'shadow-md' : ''}`}>
          <CardHeader 
            className="bg-slate-50 cursor-pointer flex flex-row items-center justify-between py-3"
            onClick={() => toggleSection('invoices')}
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
  );
} 