import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/ui/AppLayout';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle, FileText, Brain, Zap, CheckCircle, Plus, X, Download, Search, Building, Users, Clock, Eye, QrCode, FileCheck, Lightbulb, ArrowRight, Check, HardHat, Clipboard, FileSignature, Cpu, Award, BookOpen, Smartphone, Upload, Image, ShieldCheck, CreditCard, Settings, ArrowLeft } from 'lucide-react';
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
    
    const currentRef = ref.current; // Store ref value to avoid stale closure
    
    try {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.unobserve(entry.target);
          }
        },
        { threshold: 0.1 }
      );
      
      observer.observe(currentRef);
      
      return () => {
        observer.disconnect();
      };
    } catch (error) {
      // Fallback: immediately show animation if IntersectionObserver fails
      console.warn('IntersectionObserver not supported, showing animation immediately:', error);
      setInView(true);
    }
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
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const workCoverInputRef = useRef<HTMLInputElement>(null);
  const liabilityInputRef = useRef<HTMLInputElement>(null);
  
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
    if (!file) return;

    console.log('File upload triggered:', fileType, file.name);

    try {
      // Validate file type for logo
      if (fileType === 'logo') {
        if (!file.type.startsWith('image/')) {
          toast.error("Invalid file type - Please select an image file (PNG, JPG, SVG, etc.)");
          return;
        }
      }

      // Validate file size (2MB limit)
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File too large - File size must be less than 2MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          setBusinessDetails(prev => ({
            ...prev,
            [fileType]: {
              name: file.name,
              size: file.size,
              type: file.type,
              data: e.target?.result
            }
          }));
          
          toast.success(`File uploaded successfully - ${file.name} has been uploaded`);
        } catch (error) {
          console.error('Error setting business details:', error);
          toast.error("Failed to process uploaded file");
        }
      };
      
      reader.onerror = (error) => {
        console.error('FileReader error:', error);
        toast.error("Upload failed - There was an error reading the file");
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('File upload error:', error);
      toast.error("Upload failed - Unexpected error occurred");
    }
  };

  // Handle file input button clicks
  const handleLogoButtonClick = () => {
    console.log('Logo button clicked');
    if (logoInputRef.current) {
      logoInputRef.current.value = ''; // Reset input to allow re-uploading same file
      logoInputRef.current.click();
    }
  };

  const handleWorkCoverButtonClick = () => {
    if (workCoverInputRef.current) {
      workCoverInputRef.current.value = '';
      workCoverInputRef.current.click();
    }
  };

  const handleLiabilityButtonClick = () => {
    if (liabilityInputRef.current) {
      liabilityInputRef.current.value = '';
      liabilityInputRef.current.click();
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
    try {
      // Validate required fields
      if (!projectDetails.projectName?.trim()) {
        toast.error("Project name is required");
        return;
      }
      if (!projectDetails.tradeType?.trim()) {
        toast.error("Trade type is required");
        return;
      }
      
      // Store business details (including logo) in localStorage
      localStorage.setItem('swms_business_details', JSON.stringify(businessDetails));
      
      // Navigate to the actual SWMS generation page with project details
      const params = new URLSearchParams({
        projectName: projectDetails.projectName,
        jobNumber: projectDetails.jobNumber,
        location: projectDetails.location,
        clientName: projectDetails.clientName,
        tradeType: projectDetails.tradeType,
        supervisor: projectDetails.supervisor,
        projectDate: projectDetails.projectDate,
        estimatedDuration: projectDetails.estimatedDuration,
        crewSize: projectDetails.crewSize,
        description: projectDetails.description
      });
      
      console.log('Navigating to SWMS generator with params:', params.toString());
      
      // Use navigate instead of window.location.href for better SPA behavior
      navigate(`/calculators/ai-swms?${params.toString()}`);
      
    } catch (error) {
      console.error('Error proceeding to SWMS generation:', error);
      toast.error("Failed to proceed to SWMS generation. Please try again.");
    }
  };

  // Glowing Card wrapper component
  const GlowingCard = ({ children, className = "", ...props }) => {
    return (
      <Card className={`transition-all duration-300 hover:shadow-lg hover:shadow-blue-200/50 dark:hover:shadow-blue-900/20 ${className}`} {...props}>
        {children}
      </Card>
    );
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Back Button */}
        <div className="pt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/credentials')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Credentials
          </Button>
        </div>
        
        {/* Beautiful Header Section with Blue Gradient and Animated Dots */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 text-white p-4 rounded-lg shadow-2xl">
        {/* Animated Background Dots */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-4 h-4 bg-white/20 rounded-full animate-pulse top-2 left-6"></div>
          <div className="absolute w-3 h-3 bg-white/30 rounded-full animate-pulse top-6 right-12" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute w-2 h-2 bg-white/25 rounded-full animate-pulse bottom-4 left-8" style={{animationDelay: '1s'}}></div>
          <div className="absolute w-5 h-5 bg-white/15 rounded-full animate-pulse top-8 right-24" style={{animationDelay: '1.5s'}}></div>
          <div className="absolute w-3 h-3 bg-white/20 rounded-full animate-pulse bottom-6 right-6" style={{animationDelay: '2s'}}></div>
          <div className="absolute w-4 h-4 bg-white/35 rounded-full animate-pulse top-4 left-1/2" style={{animationDelay: '2.5s'}}></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center mb-3">
            <div className="mr-4" style={{filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'}}>
              <RealisticSafetyHelmetIcon />
            </div>
            <div className="text-left">
              <AnimatedHeaderWithCheck />
              <p className="text-lg text-white/90 mt-1 font-medium">
                Professional Safe Work Method Statement Creation
              </p>
            </div>
          </div>
          
          {/* Legal Requirement Notice */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
            <div className="flex items-center mb-1">
              <AlertTriangle className="h-4 w-4 text-yellow-300 mr-2" />
              <span className="font-semibold text-yellow-100 text-sm">Legal Requirement Notice</span>
            </div>
            <p className="text-xs text-white/90 leading-relaxed">
              Under Australian Work Health and Safety (WHS) legislation, a Safe Work Method Statement (SWMS) is mandatory for high-risk construction work. 
              This document must be prepared before work begins and requires consultation with workers and their representatives.
            </p>
          </div>
        </div>
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
                        onChange={(e) => handleFileUpload('logo', e.target.files?.[0])}
                        className="hidden"
                        ref={logoInputRef}
                      />
                      <Button 
                        type="button" 
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={handleLogoButtonClick}
                      >
                        Choose File
                      </Button>
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
                        <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => handleFileUpload('workCoverPolicy', e.target.files?.[0])}
                          className="hidden"
                          ref={workCoverInputRef}
                        />
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={handleWorkCoverButtonClick}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Policy
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Public Liability Policy */}
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <Shield className="h-5 w-5 text-blue-500" />
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
                        <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => handleFileUpload('publicLiabilityPolicy', e.target.files?.[0])}
                          className="hidden"
                          ref={liabilityInputRef}
                        />
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={handleLiabilityButtonClick}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Policy
                        </Button>
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
                Select Job for SWMS
              </CardTitle>
              <CardDescription>
                Choose an existing job or create a new one to generate the SWMS document
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search Jobs */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search jobs by name, number, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Job List */}
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {filteredJobs.map((job) => (
                  <div
                    key={job.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      selectedJob?.id === job.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                    onClick={() => handleJobSelection(job)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-sm">{job.jobName}</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Job #{job.jobNumber}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">{job.location}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-600 dark:text-gray-400">{job.client}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            job.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {job.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Create New Job */}
              <div className="border-t pt-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowNewJobForm(!showNewJobForm)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Job
                </Button>

                {showNewJobForm && (
                  <GlowingCard className="mt-4">
                    <CardHeader>
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
                            placeholder="e.g., 123 Smith St, Melbourne"
                          />
                        </div>
                        <div>
                          <Label htmlFor="clientName">Client Name</Label>
                          <Input
                            id="clientName"
                            value={newJobDetails.clientName}
                            onChange={(e) => setNewJobDetails({...newJobDetails, clientName: e.target.value})}
                            placeholder="e.g., Jane Doe"
                          />
                        </div>
                        <div>
                          <Label htmlFor="tradeType">Trade Type</Label>
                          <Select value={newJobDetails.tradeType} onValueChange={(value) => setNewJobDetails({...newJobDetails, tradeType: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select trade type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Carpentry">Carpentry</SelectItem>
                              <SelectItem value="Plumbing">Plumbing</SelectItem>
                              <SelectItem value="Electrical">Electrical</SelectItem>
                              <SelectItem value="General Construction">General Construction</SelectItem>
                              <SelectItem value="Roofing">Roofing</SelectItem>
                              <SelectItem value="Painting">Painting</SelectItem>
                              <SelectItem value="Tiling">Tiling</SelectItem>
                              <SelectItem value="Landscaping">Landscaping</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="estimatedDuration">Estimated Duration</Label>
                          <Input
                            id="estimatedDuration"
                            value={newJobDetails.estimatedDuration}
                            onChange={(e) => setNewJobDetails({...newJobDetails, estimatedDuration: e.target.value})}
                            placeholder="e.g., 2 weeks"
                          />
                        </div>
                      </div>
                      <Button
                        onClick={() => {
                          // Validate required fields
                          if (!newJobDetails.jobNumber?.trim()) {
                            toast.error("Job Number is required");
                            return;
                          }
                          if (!newJobDetails.jobName?.trim()) {
                            toast.error("Job Name is required");
                            return;
                          }
                          if (!newJobDetails.location?.trim()) {
                            toast.error("Location is required");
                            return;
                          }
                          if (!newJobDetails.clientName?.trim()) {
                            toast.error("Client Name is required");
                            return;
                          }
                          if (!newJobDetails.tradeType?.trim()) {
                            toast.error("Trade Type is required");
                            return;
                          }

                          try {
                            const newJob = {
                              id: Date.now(),
                              jobNumber: newJobDetails.jobNumber.trim(),
                              jobName: newJobDetails.jobName.trim(),
                              location: newJobDetails.location.trim(),
                              client: newJobDetails.clientName.trim(),
                              tradeType: newJobDetails.tradeType.trim(),
                              status: 'Planned',
                              estimatedDuration: newJobDetails.estimatedDuration?.trim() || ''
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
                            
                            toast.success(`Job "${newJob.jobName}" created successfully!`);
                          } catch (error) {
                            console.error('Error creating job:', error);
                            toast.error("Failed to create job. Please try again.");
                          }
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        disabled={!newJobDetails.jobNumber?.trim() || !newJobDetails.jobName?.trim() || !newJobDetails.location?.trim() || !newJobDetails.clientName?.trim() || !newJobDetails.tradeType?.trim()}
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
              </div>
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