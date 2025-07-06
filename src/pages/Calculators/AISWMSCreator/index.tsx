import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/ui/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle, FileText, Brain, Zap, CheckCircle, Plus, X, Download, Search, Building, Users, Clock, Eye, QrCode, FileCheck, Lightbulb, ArrowRight, Star, HardHat, Clipboard, FileSignature, Cpu, Award, BookOpen, Smartphone } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { GlowingEffect } from '@/components/ui/glowing-effect';

// Realistic Construction Safety Helmet Icon with Electric Pulse
const RealisticSafetyHelmetIcon = () => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="relative"
  >
    {/* Electric pulse rings */}
    <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" className="animate-ping" />
    <circle cx="24" cy="24" r="16" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1" className="animate-ping" style={{animationDelay: '0.5s'}} />
    <circle cx="24" cy="24" r="12" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1" className="animate-ping" style={{animationDelay: '1s'}} />
    
    {/* Helmet brim/visor */}
    <ellipse cx="24" cy="34" rx="18" ry="4" fill="rgba(255,255,255,0.9)" stroke="rgba(255,255,255,0.8)" strokeWidth="1"/>
    
    {/* Main helmet shell */}
    <path
      d="M8 34c0-8.8 7.2-16 16-16s16 7.2 16 16"
      fill="rgba(255,255,255,0.95)"
      stroke="rgba(255,255,255,0.9)"
      strokeWidth="2"
    />
    
    {/* Helmet ridges for strength */}
    <path d="M10 30c0-7.7 6.3-14 14-14s14 6.3 14 14" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5"/>
    <path d="M12 28c0-6.6 5.4-12 12-12s12 5.4 12 12" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1"/>
    
    {/* Side adjustment knobs */}
    <circle cx="12" cy="29" r="2" fill="rgba(255,255,255,0.8)"/>
    <circle cx="36" cy="29" r="2" fill="rgba(255,255,255,0.8)"/>
    
    {/* Front logo/badge area with electric glow */}
    <circle cx="24" cy="26" r="3" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5"/>
    <g>
      <circle cx="24" cy="26" r="2" fill="rgba(255,255,255,0.9)" className="animate-pulse"/>
      <rect x="23" y="25" width="2" height="2" fill="rgba(255,255,255,0.7)" className="animate-pulse"/>
    </g>
    
    {/* Electric sparkles */}
    <g className="animate-pulse">
      <circle cx="16" cy="22" r="0.5" fill="rgb(255,255,255)" className="animate-ping"/>
      <circle cx="32" cy="24" r="0.5" fill="rgb(255,255,255)" className="animate-ping" style={{animationDelay: '0.3s'}}/>
      <circle cx="20" cy="18" r="0.5" fill="rgb(255,255,255)" className="animate-ping" style={{animationDelay: '0.6s'}}/>
      <circle cx="28" cy="20" r="0.5" fill="rgb(255,255,255)" className="animate-ping" style={{animationDelay: '0.9s'}}/>
    </g>
  </svg>
);

// Realistic Construction Site Icon
const RealisticConstructionSiteIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Building foundation */}
    <rect x="2" y="18" width="20" height="4" fill="currentColor" opacity="0.8"/>
    
    {/* Main building structure */}
    <path d="M4 18V8l4-2v12M8 6l4-2v14M12 4l4 2v12M16 6l4 2v10" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    
    {/* Construction crane */}
    <line x1="18" y1="6" x2="18" y2="2" stroke="currentColor" strokeWidth="2"/>
    <line x1="16" y1="2" x2="22" y2="2" stroke="currentColor" strokeWidth="2"/>
    <line x1="20" y1="2" x2="20" y2="4" stroke="currentColor" strokeWidth="1"/>
    
    {/* Windows */}
    <rect x="5" y="10" width="1.5" height="1.5" fill="currentColor"/>
    <rect x="5" y="13" width="1.5" height="1.5" fill="currentColor"/>
    <rect x="9" y="8" width="1.5" height="1.5" fill="currentColor"/>
    <rect x="9" y="11" width="1.5" height="1.5" fill="currentColor"/>
    <rect x="13" y="9" width="1.5" height="1.5" fill="currentColor"/>
    <rect x="13" y="12" width="1.5" height="1.5" fill="currentColor"/>
  </svg>
);

// Realistic Clipboard with Documents Icon
const RealisticClipboardIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Clipboard backing */}
    <rect x="4" y="2" width="16" height="20" rx="2" fill="currentColor" opacity="0.1"/>
    <rect x="4" y="2" width="16" height="20" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    
    {/* Metal clip */}
    <rect x="8" y="0" width="8" height="4" rx="1" fill="currentColor" opacity="0.8"/>
    <rect x="9" y="1" width="6" height="2" rx="0.5" fill="white"/>
    
    {/* Document lines */}
    <line x1="7" y1="8" x2="17" y2="8" stroke="currentColor" strokeWidth="1"/>
    <line x1="7" y1="11" x2="17" y2="11" stroke="currentColor" strokeWidth="1"/>
    <line x1="7" y1="14" x2="15" y2="14" stroke="currentColor" strokeWidth="1"/>
    <line x1="7" y1="17" x2="13" y2="17" stroke="currentColor" strokeWidth="1"/>
    
    {/* Checkmarks */}
    <path d="M6 8l1 1 2-2" stroke="currentColor" strokeWidth="1" fill="none"/>
    <path d="M6 11l1 1 2-2" stroke="currentColor" strokeWidth="1" fill="none"/>
  </svg>
);

// Realistic Safety Warning Sign Icon
const RealisticSafetyWarningIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Warning triangle border */}
    <path d="M12 2l10 18H2L12 2z" fill="currentColor" opacity="0.1"/>
    <path d="M12 2l10 18H2L12 2z" stroke="currentColor" strokeWidth="2" fill="none"/>
    
    {/* Exclamation mark */}
    <line x1="12" y1="8" x2="12" y2="13" stroke="currentColor" strokeWidth="2"/>
    <circle cx="12" cy="16" r="1" fill="currentColor"/>
    
    {/* Safety stripes */}
    <line x1="8" y1="18" x2="16" y2="18" stroke="currentColor" strokeWidth="1" opacity="0.6"/>
    <line x1="9" y1="16" x2="15" y2="16" stroke="currentColor" strokeWidth="1" opacity="0.6"/>
  </svg>
);

// Realistic AI Brain Chip Icon
const RealisticAIBrainIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Circuit board base */}
    <rect x="3" y="3" width="18" height="18" rx="2" fill="currentColor" opacity="0.1"/>
    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    
    {/* Brain pattern */}
    <path d="M8 7c1-1 2-1 3 0s2 1 3 0" stroke="currentColor" strokeWidth="1" fill="none"/>
    <path d="M8 10c1-1 2-1 3 0s2 1 3 0" stroke="currentColor" strokeWidth="1" fill="none"/>
    <path d="M8 13c1-1 2-1 3 0s2 1 3 0" stroke="currentColor" strokeWidth="1" fill="none"/>
    <path d="M8 16c1-1 2-1 3 0s2 1 3 0" stroke="currentColor" strokeWidth="1" fill="none"/>
    
    {/* Circuit connections */}
    <circle cx="7" cy="7" r="1" fill="currentColor"/>
    <circle cx="17" cy="7" r="1" fill="currentColor"/>
    <circle cx="7" cy="17" r="1" fill="currentColor"/>
    <circle cx="17" cy="17" r="1" fill="currentColor"/>
    
    {/* AI indicator */}
    <circle cx="12" cy="12" r="2" fill="currentColor" opacity="0.3"/>
    <circle cx="12" cy="12" r="1" fill="currentColor"/>
  </svg>
);

const AISWMSCreatorPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [businessDetails, setBusinessDetails] = useState({
    businessName: 'Trade Ease Construction',
    abn: '12 345 678 901',
    contactPerson: 'John Smith',
    email: 'john@tradease.com.au',
    phone: '(02) 1234 5678'
  });

  // Dark mode detection
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };

    // Check initially
    checkDarkMode();

    // Watch for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  const [selectedJob, setSelectedJob] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewJobForm, setShowNewJobForm] = useState(false);
  const [newJobDetails, setNewJobDetails] = useState({
    jobNumber: '',
    jobName: '',
    location: '',
    clientName: '',
    tradeType: '',
    startDate: '',
    estimatedDuration: ''
  });

  const [existingJobs] = useState([
    { id: 1, jobNumber: 'JOB001', jobName: 'Residential Extension', location: '123 Main St, Brisbane', client: 'Smith Family', tradeType: 'Carpentry', status: 'Active' },
    { id: 2, jobNumber: 'JOB002', jobName: 'Office Fitout', location: '456 Queen St, Melbourne', client: 'ABC Corp', tradeType: 'General Construction', status: 'Planned' },
    { id: 3, jobNumber: 'JOB003', jobName: 'Kitchen Renovation', location: '789 King St, Sydney', client: 'Johnson Family', tradeType: 'Electrical', status: 'Active' }
  ]);

  const filteredJobs = existingJobs.filter(job => 
    job.jobName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.jobNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const proceedToSWMSGeneration = () => {
    // Navigate to the actual SWMS generation page
    window.location.href = '/calculators/ai-swms';
  };

  // Glowing Card wrapper component
  const GlowingCard = ({ children, className = "", ...props }) => {
    return (
      <div className="relative">
        {isDarkMode && (
          <GlowingEffect
            disabled={false}
            proximity={100}
            spread={30}
            blur={1}
            borderWidth={2}
            movementDuration={1.5}
          />
        )}
        <Card 
          className={`${className} ${isDarkMode ? 'dark:bg-gray-900/50 dark:border-gray-800' : ''} hover:shadow-md transition-shadow`} 
          {...props}
        >
          {children}
        </Card>
      </div>
    );
  };

  return (
    <AppLayout>
      <div className="container mx-auto py-6 px-4 space-y-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-lg mb-6 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }}></div>
            </div>
            <div className="flex items-center gap-4 relative z-10">
              <Shield className="h-8 w-8 text-white" />
              <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                  AI SWMS Generator
                  <Star className="h-6 w-6 text-yellow-300" />
                </h1>
                <p className="text-blue-100 text-lg">Professional Safe Work Method Statement Creation</p>
              </div>
            </div>
          </div>
          
          <Alert className="mb-6 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20">
            <AlertTriangle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <AlertDescription className="text-blue-800 dark:text-blue-300">
              <strong>Legal Requirement:</strong> Safe Work Method Statements (SWMS) are mandatory for high-risk construction work under Australian WHS legislation. 
              Our AI-powered system ensures compliance while saving hours of manual documentation.
            </AlertDescription>
          </Alert>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Business Details & Job Selection */}
          <div className="lg:col-span-2 space-y-6">
            {/* Business Details */}
            <GlowingCard>
              <CardHeader className="bg-slate-200 dark:bg-slate-800">
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-blue-600" />
                  Business Details
                </CardTitle>
                <CardDescription>
                  Your business information will be automatically included in all SWMS documents
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input
                      id="businessName"
                      value={businessDetails.businessName}
                      onChange={(e) => setBusinessDetails({...businessDetails, businessName: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="abn">ABN</Label>
                    <Input
                      id="abn"
                      value={businessDetails.abn}
                      onChange={(e) => setBusinessDetails({...businessDetails, abn: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactPerson">Contact Person</Label>
                    <Input
                      id="contactPerson"
                      value={businessDetails.contactPerson}
                      onChange={(e) => setBusinessDetails({...businessDetails, contactPerson: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={businessDetails.email}
                      onChange={(e) => setBusinessDetails({...businessDetails, email: e.target.value})}
                    />
                  </div>
                </div>
              </CardContent>
            </GlowingCard>

                         {/* Job Selection */}
             <GlowingCard>
               <CardHeader className="bg-slate-200 dark:bg-slate-800">
                 <CardTitle className="flex items-center gap-2">
                   <FileText className="h-5 w-5 text-green-600" />
                   Job Selection
                 </CardTitle>
                 <CardDescription>
                   Select an existing job or create a new one for your SWMS
                 </CardDescription>
               </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search existing jobs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowNewJobForm(!showNewJobForm)}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    New Job
                  </Button>
                </div>

                {/* Existing Jobs List */}
                {!showNewJobForm && (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {filteredJobs.map(job => (
                      <div
                        key={job.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-all ${
                          selectedJob?.id === job.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedJob(job)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">{job.jobName}</div>
                            <div className="text-sm text-gray-600">{job.jobNumber} • {job.location}</div>
                            <div className="text-sm text-gray-500">Client: {job.client}</div>
                          </div>
                          <Badge variant={job.status === 'Active' ? 'default' : 'secondary'}>
                            {job.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* New Job Form */}
                {showNewJobForm && (
                  <GlowingCard className="border-dashed">
                    <CardHeader className="bg-slate-200 dark:bg-slate-800">
                      <CardTitle className="text-lg">Create New Job</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="jobNumber">Job Number</Label>
                          <Input
                            id="jobNumber"
                            value={newJobDetails.jobNumber}
                            onChange={(e) => setNewJobDetails({...newJobDetails, jobNumber: e.target.value})}
                            placeholder="e.g., JOB004"
                          />
                        </div>
                        <div>
                          <Label htmlFor="jobName">Job Name</Label>
                          <Input
                            id="jobName"
                            value={newJobDetails.jobName}
                            onChange={(e) => setNewJobDetails({...newJobDetails, jobName: e.target.value})}
                            placeholder="e.g., Bathroom Renovation"
                          />
                        </div>
                        <div>
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            value={newJobDetails.location}
                            onChange={(e) => setNewJobDetails({...newJobDetails, location: e.target.value})}
                            placeholder="e.g., 123 Main St, Brisbane"
                          />
                        </div>
                        <div>
                          <Label htmlFor="clientName">Client Name</Label>
                          <Input
                            id="clientName"
                            value={newJobDetails.clientName}
                            onChange={(e) => setNewJobDetails({...newJobDetails, clientName: e.target.value})}
                            placeholder="e.g., Smith Family"
                          />
                        </div>
                      </div>
                      <Button 
                        onClick={() => {
                          setSelectedJob({
                            id: Date.now(),
                            jobNumber: newJobDetails.jobNumber,
                            jobName: newJobDetails.jobName,
                            location: newJobDetails.location,
                            client: newJobDetails.clientName,
                            tradeType: newJobDetails.tradeType,
                            status: 'New'
                          });
                          setShowNewJobForm(false);
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        disabled={!newJobDetails.jobNumber || !newJobDetails.jobName}
                      >
                        Create Job
                      </Button>
                    </CardContent>
                  </GlowingCard>
                )}

                {/* Proceed Button */}
                {selectedJob && (
                  <div className="pt-4 border-t">
                    <Button 
                      onClick={proceedToSWMSGeneration}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      size="lg"
                    >
                      <Shield className="h-5 w-5 mr-2" />
                      Generate SWMS for {selectedJob.jobName}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                                 )}
               </CardContent>
             </GlowingCard>
          </div>

          {/* Right Column - Features & Information */}
          <div className="space-y-6">
                       {/* What is SWMS */}
           <GlowingCard>
             <CardHeader className="bg-slate-200 dark:bg-slate-800">
               <CardTitle className="flex items-center gap-2">
                 <Lightbulb className="h-5 w-5 text-yellow-600" />
                 What is SWMS?
               </CardTitle>
             </CardHeader>
             <CardContent className="space-y-3">
               <p className="text-sm text-gray-700 dark:text-gray-300">
                 A Safe Work Method Statement (SWMS) is a document that identifies high-risk construction work and specifies measures to control safety risks.
               </p>
               <div className="space-y-2">
                 <div className="flex items-start gap-2">
                   <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                   <span className="text-sm">Required by Australian WHS legislation</span>
                 </div>
                 <div className="flex items-start gap-2">
                   <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                   <span className="text-sm">Mandatory for high-risk construction work</span>
                 </div>
                 <div className="flex items-start gap-2">
                   <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                   <span className="text-sm">Must be prepared before work begins</span>
                 </div>
                 <div className="flex items-start gap-2">
                   <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                   <span className="text-sm">Requires worker consultation and sign-off</span>
                 </div>
               </div>
             </CardContent>
           </GlowingCard>

                       {/* Key Features */}
           <GlowingCard>
             <CardHeader className="bg-slate-200 dark:bg-slate-800">
               <CardTitle className="flex items-center gap-2">
                 <Star className="h-5 w-5 text-purple-600" />
                 AI-Powered Features
               </CardTitle>
             </CardHeader>
             <CardContent className="space-y-4">
               <div className="space-y-3">
                 <div className="flex items-start gap-3">
                   <div className="p-1 bg-blue-100 dark:bg-blue-900 rounded">
                     <Brain className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                   </div>
                   <div>
                     <div className="font-medium text-sm">Intelligent Document Generation</div>
                     <div className="text-xs text-gray-600 dark:text-gray-400">AI creates comprehensive, task-specific SWMS documents in minutes</div>
                   </div>
                 </div>
                 
                 <div className="flex items-start gap-3">
                   <div className="p-1 bg-green-100 dark:bg-green-900 rounded">
                     <Clock className="h-4 w-4 text-green-600 dark:text-green-400" />
                   </div>
                   <div>
                     <div className="font-medium text-sm">Time Efficiency</div>
                     <div className="text-xs text-gray-600 dark:text-gray-400">Reduce hours of manual work to minutes with automated generation</div>
                   </div>
                 </div>
                 
                 <div className="flex items-start gap-3">
                   <div className="p-1 bg-orange-100 dark:bg-orange-900 rounded">
                     <FileCheck className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                   </div>
                   <div>
                     <div className="font-medium text-sm">Compliance Assurance</div>
                     <div className="text-xs text-gray-600 dark:text-gray-400">Ensures full WHS compliance with current Australian regulations</div>
                   </div>
                 </div>
                 
                 <div className="flex items-start gap-3">
                   <div className="p-1 bg-purple-100 dark:bg-purple-900 rounded">
                     <QrCode className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                   </div>
                   <div>
                     <div className="font-medium text-sm">Digital Sign-Off System</div>
                     <div className="text-xs text-gray-600 dark:text-gray-400">QR code integration for quick on-site worker sign-offs</div>
                   </div>
                 </div>
                 
                 <div className="flex items-start gap-3">
                   <div className="p-1 bg-red-100 dark:bg-red-900 rounded">
                     <Users className="h-4 w-4 text-red-600 dark:text-red-400" />
                   </div>
                   <div>
                     <div className="font-medium text-sm">Centralized Management</div>
                     <div className="text-xs text-gray-600 dark:text-gray-400">Secure cloud storage with version control and team access</div>
                   </div>
                 </div>
               </div>
             </CardContent>
           </GlowingCard>

            {/* Benefits */}
            <GlowingCard>
              <CardHeader className="bg-slate-200 dark:bg-slate-800">
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  Benefits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Save 3-5 hours per SWMS document</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">Reduce compliance risks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm">Improve workplace safety</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-sm">Professional documentation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm">Mobile-friendly access</span>
                  </div>
                </div>
              </CardContent>
            </GlowingCard>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default AISWMSCreatorPage; 