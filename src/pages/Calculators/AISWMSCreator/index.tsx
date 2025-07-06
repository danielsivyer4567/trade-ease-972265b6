import React, { useState, useEffect, useRef } from 'react';
import { AppLayout } from '@/components/ui/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle, FileText, Brain, Zap, CheckCircle, Plus, X, Download, Search, Building, Users, Clock, Eye, QrCode, FileCheck, Lightbulb, ArrowRight, Check, HardHat, Clipboard, FileSignature, Cpu, Award, BookOpen, Smartphone, Upload, Image, ShieldCheck, CreditCard, Settings } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { BlurText } from '@/components/ui/blur-text';
import { motion } from 'framer-motion';

// Animated Header Component with Check Mark
const AnimatedHeaderWithCheck = () => {
  const [inView, setInView] = useState(false);
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(ref.current as Element);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const words = ["AI", "SWMS", "Generator"];
  
  const handleAnimationComplete = () => {
    setIsAnimationComplete(true);
  };
  
  return (
    <div ref={ref} className="flex items-center gap-2">
      <div className="flex items-center gap-2">
        {words.map((word, index) => (
          <motion.span
            key={index}
            initial={{ filter: "blur(10px)", opacity: 0, y: 50 }}
            animate={inView ? { filter: "blur(0px)", opacity: 1, y: 0 } : { filter: "blur(10px)", opacity: 0, y: 50 }}
            transition={{ 
              duration: 0.7,
              delay: index * 0.15,
              ease: "easeOut"
            }}
            className="text-3xl font-bold text-white inline-block"
          >
            {word}
          </motion.span>
        ))}
        <motion.div
          initial={{ filter: "blur(10px)", opacity: 0, y: 50 }}
          animate={inView ? { filter: "blur(0px)", opacity: 1, y: 0 } : { filter: "blur(10px)", opacity: 0, y: 50 }}
          transition={{ 
            duration: 0.7,
            delay: words.length * 0.15,
            ease: "easeOut"
          }}
          onAnimationComplete={handleAnimationComplete}
          className="inline-block"
        >
                     <motion.div
             initial={{ 
               color: "#ffffff",
               scale: 1,
               filter: "brightness(1)"
             }}
             animate={{ 
               color: isAnimationComplete ? "#4ade80" : "#ffffff",
               scale: isAnimationComplete ? [1, 1.3, 1] : 1,
               filter: isAnimationComplete ? ["brightness(1)", "brightness(2)", "brightness(1)"] : "brightness(1)"
             }}
             transition={{ 
               duration: 0.6, 
               delay: 0.2,
               scale: { duration: 0.6, times: [0, 0.5, 1] },
               filter: { duration: 0.6, times: [0, 0.5, 1] }
             }}
           >
             <Check className={`h-8 w-8 transition-colors duration-500 ${isAnimationComplete ? 'text-green-400' : 'text-white'}`} />
           </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

// Realistic CFMEU Construction Safety Helmet Icon
const RealisticSafetyHelmetIcon = () => (
  <svg
    width="120"
    height="120"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="relative"
  >
    {/* Helmet brim/visor */}
    <ellipse cx="24" cy="36" rx="20" ry="4" fill="#000" stroke="#333" strokeWidth="1"/>
    
    {/* Main helmet shell - made larger and taller */}
    <path
      d="M6 36c0-10 8-18 18-18s18 8 18 18"
      fill="#000"
      stroke="#333"
      strokeWidth="2"
    />
    
    {/* Front sun visor at bottom front */}
    <ellipse cx="24" cy="37" rx="14" ry="2" fill="#000" stroke="#333" strokeWidth="1"/>
    <ellipse cx="24" cy="38" rx="12" ry="1.5" fill="#111" stroke="#333" strokeWidth="1"/>
    
    {/* Helmet ridges for strength */}
    <path d="M8 32c0-8.8 7.2-16 16-16s16 7.2 16 16" fill="none" stroke="#333" strokeWidth="1.5"/>
    <path d="M10 30c0-7.7 6.3-14 14-14s14 6.3 14 14" fill="none" stroke="#444" strokeWidth="1"/>
    
    {/* Side adjustment knobs */}
    <circle cx="10" cy="31" r="2" fill="#444"/>
    <circle cx="38" cy="31" r="2" fill="#444"/>
    
    {/* CFMEU Text */}
    <text x="24" y="24" fontSize="6" fill="#FFF" textAnchor="middle" fontWeight="bold" fontFamily="Arial, sans-serif">CFMEU</text>
    <text x="24" y="30" fontSize="3" fill="#FFF" textAnchor="middle" fontFamily="Arial, sans-serif">CONSTRUCTION</text>
    
    {/* Union logo placeholder areas */}
    <circle cx="14" cy="28" r="3" fill="#C41E3A" stroke="#FFF" strokeWidth="0.5"/>
    <text x="14" y="29" fontSize="2" fill="#FFF" textAnchor="middle" fontWeight="bold">CFMEU</text>
    
    <circle cx="34" cy="28" r="3" fill="#C41E3A" stroke="#FFF" strokeWidth="0.5"/>
    <text x="34" y="29" fontSize="2" fill="#FFF" textAnchor="middle" fontWeight="bold">CFMEU</text>
  </svg>
);

// Realistic Construction Site Icon
const RealisticConstructionSiteIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Building foundation */}
    <rect x="2" y="18" width="20" height="4" fill="#8B4513"/>
    
    {/* Main building structure */}
    <path d="M4 18V8l4-2v12" stroke="#4A5568" strokeWidth="1.5" fill="#E2E8F0"/>
    <path d="M8 6l4-2v14" stroke="#4A5568" strokeWidth="1.5" fill="#CBD5E0"/>
    <path d="M12 4l4 2v12" stroke="#4A5568" strokeWidth="1.5" fill="#A0AEC0"/>
    <path d="M16 6l4 2v10" stroke="#4A5568" strokeWidth="1.5" fill="#718096"/>
    
    {/* Construction crane */}
    <line x1="18" y1="6" x2="18" y2="2" stroke="#FFD700" strokeWidth="2"/>
    <line x1="16" y1="2" x2="22" y2="2" stroke="#FFD700" strokeWidth="2"/>
    <line x1="20" y1="2" x2="20" y2="4" stroke="#FFA500" strokeWidth="1"/>
    
    {/* Windows */}
    <rect x="5" y="10" width="1.5" height="1.5" fill="#87CEEB"/>
    <rect x="5" y="13" width="1.5" height="1.5" fill="#87CEEB"/>
    <rect x="9" y="8" width="1.5" height="1.5" fill="#87CEEB"/>
    <rect x="9" y="11" width="1.5" height="1.5" fill="#87CEEB"/>
    <rect x="13" y="9" width="1.5" height="1.5" fill="#87CEEB"/>
    <rect x="13" y="12" width="1.5" height="1.5" fill="#87CEEB"/>
  </svg>
);

// Realistic Clipboard with Documents Icon
const RealisticClipboardIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Clipboard backing */}
    <rect x="4" y="2" width="16" height="20" rx="2" fill="#8B4513"/>
    <rect x="4" y="2" width="16" height="20" rx="2" stroke="#654321" strokeWidth="1.5" fill="none"/>
    
    {/* Metal clip */}
    <rect x="8" y="0" width="8" height="4" rx="1" fill="#C0C0C0"/>
    <rect x="9" y="1" width="6" height="2" rx="0.5" fill="#FFF"/>
    
    {/* Document lines */}
    <line x1="7" y1="8" x2="17" y2="8" stroke="#4A5568" strokeWidth="1"/>
    <line x1="7" y1="11" x2="17" y2="11" stroke="#4A5568" strokeWidth="1"/>
    <line x1="7" y1="14" x2="15" y2="14" stroke="#4A5568" strokeWidth="1"/>
    <line x1="7" y1="17" x2="13" y2="17" stroke="#4A5568" strokeWidth="1"/>
    
    {/* Checkmarks */}
    <path d="M6 8l1 1 2-2" stroke="#22C55E" strokeWidth="1" fill="none"/>
    <path d="M6 11l1 1 2-2" stroke="#22C55E" strokeWidth="1" fill="none"/>
  </svg>
);

// Realistic Safety Warning Sign Icon
const RealisticSafetyWarningIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Warning triangle border */}
    <path d="M12 2l10 18H2L12 2z" fill="#FFD700"/>
    <path d="M12 2l10 18H2L12 2z" stroke="#FF8C00" strokeWidth="2" fill="none"/>
    
    {/* Exclamation mark */}
    <line x1="12" y1="8" x2="12" y2="13" stroke="#FF0000" strokeWidth="2"/>
    <circle cx="12" cy="16" r="1" fill="#FF0000"/>
    
    {/* Safety stripes */}
    <line x1="8" y1="18" x2="16" y2="18" stroke="#FF0000" strokeWidth="1"/>
    <line x1="9" y1="16" x2="15" y2="16" stroke="#FF0000" strokeWidth="1"/>
  </svg>
);

// Realistic AI Brain Chip Icon
const RealisticAIBrainIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Circuit board base */}
    <rect x="3" y="3" width="18" height="18" rx="2" fill="#1E40AF"/>
    <rect x="3" y="3" width="18" height="18" rx="2" stroke="#3B82F6" strokeWidth="1.5" fill="none"/>
    
    {/* Brain pattern */}
    <path d="M8 7c1-1 2-1 3 0s2 1 3 0" stroke="#00FF00" strokeWidth="1" fill="none"/>
    <path d="M8 10c1-1 2-1 3 0s2 1 3 0" stroke="#00FF00" strokeWidth="1" fill="none"/>
    <path d="M8 13c1-1 2-1 3 0s2 1 3 0" stroke="#00FF00" strokeWidth="1" fill="none"/>
    <path d="M8 16c1-1 2-1 3 0s2 1 3 0" stroke="#00FF00" strokeWidth="1" fill="none"/>
    
    {/* Circuit connections */}
    <circle cx="7" cy="7" r="1" fill="#00FFFF"/>
    <circle cx="17" cy="7" r="1" fill="#00FFFF"/>
    <circle cx="7" cy="17" r="1" fill="#00FFFF"/>
    <circle cx="17" cy="17" r="1" fill="#00FFFF"/>
    
    {/* AI indicator */}
    <circle cx="12" cy="12" r="2" fill="#FF00FF" opacity="0.7"/>
    <circle cx="12" cy="12" r="1" fill="#FFF"/>
  </svg>
);

const AISWMSCreatorPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [businessDetails, setBusinessDetails] = useState({
    businessName: 'Trade Ease Construction',
    abn: '12 345 678 901',
    contactPerson: 'John Smith',
    email: 'john@tradease.com.au',
    phone: '(02) 1234 5678',
    licenseNumber: 'LIC123456789',
    logo: null,
    workCoverPolicy: null,
    publicLiabilityPolicy: null,
    useLogoEverytime: true,
    useCredentialsEverytime: true
  });

  // File upload handlers
  const handleFileUpload = (fileType, file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBusinessDetails(prev => ({
          ...prev,
          [fileType]: {
            name: file.name,
            size: file.size,
            type: file.type,
            data: e.target.result
          }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = (fileType) => {
    setBusinessDetails(prev => ({
      ...prev,
      [fileType]: null
    }));
  };

  // Update project details supervisor when contact person changes
  const updateBusinessDetails = (newDetails) => {
    setBusinessDetails(newDetails);
    if (selectedJob) {
      setProjectDetails(prev => ({
        ...prev,
        supervisor: newDetails.contactPerson
      }));
    }
  };

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

  // Project Details state that will be populated from selected job
  const [projectDetails, setProjectDetails] = useState({
    projectName: '',
    jobNumber: '',
    location: '',
    clientName: '',
    tradeType: '',
    supervisor: businessDetails.contactPerson,
    projectDate: new Date().toISOString().split('T')[0],
    estimatedDuration: '',
    crewSize: '',
    description: ''
  });

  // Function to handle job selection and populate project details
  const handleJobSelection = (job) => {
    setSelectedJob(job);
    // Auto-populate project details from selected job
    setProjectDetails({
      projectName: job.jobName,
      jobNumber: job.jobNumber,
      location: job.location,
      clientName: job.client,
      tradeType: job.tradeType,
      supervisor: businessDetails.contactPerson,
      projectDate: new Date().toISOString().split('T')[0],
      estimatedDuration: job.estimatedDuration || '',
      crewSize: '',
      description: `${job.tradeType} work for ${job.jobName} at ${job.location}`
    });
  };

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
    // Navigate to the actual SWMS generation page with project details
    const params = new URLSearchParams({
      projectName: projectDetails.projectName,
      jobNumber: projectDetails.jobNumber,
      location: projectDetails.location,
      clientName: projectDetails.clientName,
      tradeType: projectDetails.tradeType,
      supervisor: projectDetails.supervisor,
      projectDate: projectDetails.projectDate,
      businessName: businessDetails.businessName,
      abn: businessDetails.abn,
      contactPerson: businessDetails.contactPerson,
      email: businessDetails.email,
      phone: businessDetails.phone
    });
    window.location.href = `/calculators/ai-swms?${params.toString()}`;
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
              <RealisticSafetyHelmetIcon />
              <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                  <AnimatedHeaderWithCheck />
                </h1>
                <BlurText 
                  text="Professional Safe Work Method Statement Creation" 
                  className="text-blue-100 text-lg" 
                  delay={100}
                  animateBy="words"
                  direction="top"
                />
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
                  <RealisticConstructionSiteIcon />
                  Business Details
                </CardTitle>
                <CardDescription>
                  Your business information will be automatically included in all SWMS documents
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Business Information */}
                <div className="space-y-4">
                  <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 uppercase tracking-wide">Basic Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="businessName">Business Name</Label>
                      <Input
                        id="businessName"
                        value={businessDetails.businessName}
                        onChange={(e) => updateBusinessDetails({...businessDetails, businessName: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="abn">ABN</Label>
                      <Input
                        id="abn"
                        value={businessDetails.abn}
                        onChange={(e) => updateBusinessDetails({...businessDetails, abn: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="licenseNumber">License Number</Label>
                      <Input
                        id="licenseNumber"
                        value={businessDetails.licenseNumber}
                        onChange={(e) => updateBusinessDetails({...businessDetails, licenseNumber: e.target.value})}
                        placeholder="e.g., LIC123456789"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contactPerson">Contact Person</Label>
                      <Input
                        id="contactPerson"
                        value={businessDetails.contactPerson}
                        onChange={(e) => updateBusinessDetails({...businessDetails, contactPerson: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={businessDetails.email}
                        onChange={(e) => updateBusinessDetails({...businessDetails, email: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={businessDetails.phone}
                        onChange={(e) => updateBusinessDetails({...businessDetails, phone: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Company Logo Upload */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 uppercase tracking-wide">Company Logo</h4>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="useLogoEverytime"
                        checked={businessDetails.useLogoEverytime}
                        onChange={(e) => updateBusinessDetails({...businessDetails, useLogoEverytime: e.target.checked})}
                        className="rounded"
                      />
                      <Label htmlFor="useLogoEverytime" className="text-sm">Use in all SWMS documents</Label>
                    </div>
                  </div>
                  
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
                    {businessDetails.logo ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Image className="h-8 w-8 text-blue-500" />
                          <div>
                            <p className="text-sm font-medium">{businessDetails.logo.name}</p>
                            <p className="text-xs text-gray-500">{(businessDetails.logo.size / 1024).toFixed(1)} KB</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => removeFile('logo')}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Upload your company logo</p>
                        <p className="text-xs text-gray-500 mb-4">PNG, JPG, SVG up to 2MB</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload('logo', e.target.files[0])}
                          className="hidden"
                          id="logo-upload"
                        />
                        <Label htmlFor="logo-upload" className="cursor-pointer">
                          <Button type="button" className="bg-blue-600 hover:bg-blue-700">
                            Choose File
                          </Button>
                        </Label>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Insurance & Compliance Documents */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 uppercase tracking-wide">Insurance & Compliance</h4>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="useCredentialsEverytime"
                        checked={businessDetails.useCredentialsEverytime}
                        onChange={(e) => updateBusinessDetails({...businessDetails, useCredentialsEverytime: e.target.checked})}
                        className="rounded"
                      />
                      <Label htmlFor="useCredentialsEverytime" className="text-sm">Attach to all SWMS documents</Label>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* WorkCover Policy */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <ShieldCheck className="h-5 w-5 text-green-500" />
                        <h5 className="font-medium">WorkCover Policy</h5>
                      </div>
                      
                      {businessDetails.workCoverPolicy ? (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium">{businessDetails.workCoverPolicy.name}</p>
                              <p className="text-xs text-gray-500">{(businessDetails.workCoverPolicy.size / 1024).toFixed(1)} KB</p>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => removeFile('workCoverPolicy')}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center">
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => handleFileUpload('workCoverPolicy', e.target.files[0])}
                            className="hidden"
                            id="workcover-upload"
                          />
                          <Label htmlFor="workcover-upload" className="cursor-pointer">
                            <Button type="button" variant="outline" size="sm" className="w-full">
                              <Upload className="h-4 w-4 mr-2" />
                              Upload Policy
                            </Button>
                          </Label>
                        </div>
                      )}
                    </div>

                    {/* Public Liability Policy */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <CreditCard className="h-5 w-5 text-blue-500" />
                        <h5 className="font-medium">Public Liability</h5>
                      </div>
                      
                      {businessDetails.publicLiabilityPolicy ? (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium">{businessDetails.publicLiabilityPolicy.name}</p>
                              <p className="text-xs text-gray-500">{(businessDetails.publicLiabilityPolicy.size / 1024).toFixed(1)} KB</p>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => removeFile('publicLiabilityPolicy')}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center">
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => handleFileUpload('publicLiabilityPolicy', e.target.files[0])}
                            className="hidden"
                            id="liability-upload"
                          />
                          <Label htmlFor="liability-upload" className="cursor-pointer">
                            <Button type="button" variant="outline" size="sm" className="w-full">
                              <Upload className="h-4 w-4 mr-2" />
                              Upload Policy
                            </Button>
                          </Label>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </GlowingCard>

            {/* Job Selection */}
            <GlowingCard>
               <CardHeader className="bg-slate-200 dark:bg-slate-800">
                 <CardTitle className="flex items-center gap-2">
                   <RealisticClipboardIcon />
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
                        onClick={() => handleJobSelection(job)}
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
                          const newJob = {
                            id: Date.now(),
                            jobNumber: newJobDetails.jobNumber,
                            jobName: newJobDetails.jobName,
                            location: newJobDetails.location,
                            client: newJobDetails.clientName,
                            tradeType: newJobDetails.tradeType,
                            estimatedDuration: newJobDetails.estimatedDuration,
                            status: 'New'
                          };
                          handleJobSelection(newJob);
                          setShowNewJobForm(false);
                          // Clear the form for next use
                          setNewJobDetails({
                            jobNumber: '',
                            jobName: '',
                            location: '',
                            clientName: '',
                            tradeType: '',
                            startDate: '',
                            estimatedDuration: ''
                          });
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        disabled={!newJobDetails.jobNumber || !newJobDetails.jobName}
                      >
                        Create Job
                      </Button>
                    </CardContent>
                  </GlowingCard>
                )}

                {/* Auto-populated Project Details */}
                {selectedJob && (
                  <div className="pt-4 border-t">
                    <div className="mb-4">
                      <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Project Details Auto-Populated
                      </h4>
                      <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div><span className="font-medium">Project:</span> {projectDetails.projectName}</div>
                          <div><span className="font-medium">Job #:</span> {projectDetails.jobNumber}</div>
                          <div><span className="font-medium">Location:</span> {projectDetails.location}</div>
                          <div><span className="font-medium">Client:</span> {projectDetails.clientName}</div>
                          <div><span className="font-medium">Trade:</span> {projectDetails.tradeType}</div>
                          <div><span className="font-medium">Supervisor:</span> {projectDetails.supervisor}</div>
                        </div>
                        <div className="mt-2 text-xs text-green-700 dark:text-green-300">
                          ✓ All project details have been automatically filled from your job selection
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={proceedToSWMSGeneration}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      size="lg"
                    >
                      <HardHat className="h-5 w-5 mr-2 animate-pulse" />
                      Generate SWMS for {selectedJob.jobName}
                      <ArrowRight className="h-4 w-4 ml-2 animate-bounce" />
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
                 <RealisticSafetyWarningIcon />
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
                 <RealisticAIBrainIcon />
                 AI-Powered Features
               </CardTitle>
             </CardHeader>
             <CardContent className="space-y-4">
               <div className="space-y-3">
                 <div className="flex items-start gap-3">
                   <div className="p-1 bg-blue-100 dark:bg-blue-900 rounded">
                     <Cpu className="h-4 w-4 text-blue-600 dark:text-blue-400 animate-pulse" />
                   </div>
                   <div>
                     <div className="font-medium text-sm">Intelligent Document Generation</div>
                     <div className="text-xs text-gray-600 dark:text-gray-400">AI creates comprehensive, task-specific SWMS documents in minutes</div>
                   </div>
                 </div>
                 
                 <div className="flex items-start gap-3">
                   <div className="p-1 bg-green-100 dark:bg-green-900 rounded">
                     <Clock className="h-4 w-4 text-green-600 dark:text-green-400 animate-pulse" />
                   </div>
                   <div>
                     <div className="font-medium text-sm">Time Efficiency</div>
                     <div className="text-xs text-gray-600 dark:text-gray-400">Reduce hours of manual work to minutes with automated generation</div>
                   </div>
                 </div>
                 
                 <div className="flex items-start gap-3">
                   <div className="p-1 bg-orange-100 dark:bg-orange-900 rounded">
                     <FileSignature className="h-4 w-4 text-orange-600 dark:text-orange-400 animate-pulse" />
                   </div>
                   <div>
                     <div className="font-medium text-sm">Compliance Assurance</div>
                     <div className="text-xs text-gray-600 dark:text-gray-400">Ensures full WHS compliance with current Australian regulations</div>
                   </div>
                 </div>
                 
                 <div className="flex items-start gap-3">
                   <div className="p-1 bg-purple-100 dark:bg-purple-900 rounded">
                     <Smartphone className="h-4 w-4 text-purple-600 dark:text-purple-400 animate-pulse" />
                   </div>
                   <div>
                     <div className="font-medium text-sm">Digital Sign-Off System</div>
                     <div className="text-xs text-gray-600 dark:text-gray-400">QR code integration for quick on-site worker sign-offs</div>
                   </div>
                 </div>
                 
                 <div className="flex items-start gap-3">
                   <div className="p-1 bg-red-100 dark:bg-red-900 rounded">
                     <BookOpen className="h-4 w-4 text-red-600 dark:text-red-400 animate-pulse" />
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
                  <Award className="h-5 w-5 text-yellow-500" />
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