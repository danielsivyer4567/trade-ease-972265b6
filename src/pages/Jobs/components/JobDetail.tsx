import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Mic, Coffee, PackageCheck, Share, Clock, Calendar, FileText, Box, BarChart4, MessageSquare, 
  Upload, X, Camera, PlusCircle, Trash2, Info, Edit, Save, ArrowLeft, Image as ImageIcon, CheckCircle, RotateCcw, Settings, AlertTriangle, Check, FilePlus, Book, Plus, SaveAll, Smartphone, Mail, Facebook, Instagram, Globe, Phone, Play, Share2, Search, MessageCircle, ArrowDown, Send, ExternalLink, Link2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Job } from "@/types/job";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "sonner";
import JobMap from "@/components/JobMap";
import { customerService } from "@/services/CustomerService";
import { geocodingService } from "@/services"; // Import through the services index
import { supabase } from "@/integrations/supabase/client";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { JobDocumentation } from "./form-sections/JobDocumentation";
import { useFileUpload } from "./document-approval/hooks/useFileUpload";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import JobStreetView from "../JobStreetView";

interface JobDetailProps {
  job: Job;
}

interface JobStreetViewProps {
  address: string;
  city?: string;
  state?: string;
  zipCode?: string;
  height?: string;
  className?: string;
}

type JobSection = {
  id: string;
  title: string;
  description: string;
  photos: JobPhoto[];
};

type JobPhoto = {
  id: string;
  url: string;
  caption: string;
  dateAdded: string;
  section?: string;
};

type ProcessStep = {
  id: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  photos: JobPhoto[];
  completedDate?: string;
};

// Define job template types
type JobTemplateField = {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'checkbox';
  placeholder?: string;
};

type JobTemplate = {
  id: string;
  name: string;
  fields: JobTemplateField[];
  isCustom?: boolean;
};

// Mock quote type
type Quote = {
  id: string;
  quoteNumber: string;
  customerName: string;
  amount: number;
};

export const JobDetail = ({ job }: JobDetailProps) => {
  const [activeTab, setActiveTab] = useState("details");
  const [note, setNote] = useState("");
  const [isImportant, setIsImportant] = useState(false);
  const [notes, setNotes] = useState<{text: string, isImportant: boolean, date: string}[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<JobPhoto | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Job process steps state
  const [processSteps, setProcessSteps] = useState<ProcessStep[]>([]);
  const [maxSteps, setMaxSteps] = useState(5);
  const [requireAllSteps, setRequireAllSteps] = useState(false);
  const [jobCompleted, setJobCompleted] = useState(false);
  const [showCompleteJobDialog, setShowCompleteJobDialog] = useState(false);
  const [showProcessSettingsDialog, setShowProcessSettingsDialog] = useState(false);
  const [editingStepId, setEditingStepId] = useState<string | null>(null);
  const [editingStepTitle, setEditingStepTitle] = useState("");
  const [stepToAddDescription, setStepToAddDescription] = useState<ProcessStep | null>(null);
  const [newStepDescription, setNewStepDescription] = useState("");
  
  // Computed properties for steps
  const completedStepsCount = processSteps.filter(step => step.isCompleted).length;
  const canCompleteJob = !requireAllSteps || completedStepsCount === processSteps.length;
  
  // Job sections state
  const [sections, setSections] = useState<JobSection[]>([
    {
      id: "job-scope",
      title: "Job Scope",
      description: "Comprehensive electrical repair and maintenance for the entire property, including panel upgrades and rewiring where needed.",
      photos: []
    },
    {
      id: "specifications",
      title: "Technical Specifications",
      description: "Using 12-gauge copper wiring for all circuits. New panel is a 200-amp Square D with AFCI protection on all bedroom circuits as required by code.",
      photos: []
    }
  ]);
  
  // Photos state
  const [photos, setPhotos] = useState<JobPhoto[]>([
    {
      id: "p1",
      url: "https://images.unsplash.com/photo-1558402529-d2638a7023e9",
      caption: "Main electrical panel before replacement",
      dateAdded: "2023-03-15",
    },
    {
      id: "p2",
      url: "https://images.unsplash.com/photo-1565608438257-fac3c27beb36",
      caption: "Kitchen wiring assessment",
      dateAdded: "2023-03-15",
    },
    {
      id: "p3",
      url: "https://images.unsplash.com/photo-1544724569-5f546fd6f2b6",
      caption: "Living room outlets inspection",
      dateAdded: "2023-03-16",
    }
  ]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newSection, setNewSection] = useState({
    title: "",
    description: ""
  });
  const [editingSection, setEditingSection] = useState<JobSection | null>(null);
  const [photoCaption, setPhotoCaption] = useState("");
  
  // Add template related states
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [showCreateTemplateDialog, setShowCreateTemplateDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<JobTemplate | null>(null);
  const [templateValues, setTemplateValues] = useState<Record<string, string>>({});
  const [customTemplates, setCustomTemplates] = useState<JobTemplate[]>([]);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateFields, setNewTemplateFields] = useState<JobTemplateField[]>([]);
  
  // States for Communications tab
  const [messageText, setMessageText] = useState("");
  const [fromNumber, setFromNumber] = useState("0491388575");
  const [toNumber, setToNumber] = useState("0491388575");
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Quote[]>([]);
  const [attachedQuotes, setAttachedQuotes] = useState<Quote[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Financials State
  const [contractors, setContractors] = useState([
    { id: 'c1', name: 'Sparky & Co.', cost: 1200 },
    { id: 'c2', name: 'Plumb Perfect', cost: 850 },
  ]);
  const [materials, setMaterials] = useState([
    { id: 'm1', name: 'Copper Wiring (50m)', cost: 350 },
    { id: 'm2', name: 'Circuit Breaker Panel', cost: 450 },
    { id: 'm3', name: 'PVC Pipes (20m)', cost: 150 },
  ]);
  const [newContractor, setNewContractor] = useState({ name: '', cost: '' });
  const [newMaterial, setNewMaterial] = useState({ name: '', cost: '' });

  const navigate = useNavigate();

  // Pre-defined job templates
  const predefinedTemplates: JobTemplate[] = [
    {
      id: 'fencing',
      name: 'Fencing',
      fields: [
        { id: 'fence-description', label: 'Fence Description', type: 'textarea', placeholder: 'Describe the fence type and materials' },
        { id: 'meterage', label: 'Meterage', type: 'text', placeholder: 'Length of fencing required' },
        { id: 'colour', label: 'Colour', type: 'text', placeholder: 'Color of the fence' },
        { id: 'sleepers', label: 'Sleepers', type: 'text', placeholder: 'Type and number of sleepers' },
        { id: 'gates', label: 'Gates', type: 'text', placeholder: 'Number and type of gates required' },
        { id: 'removal', label: 'Removal', type: 'text', placeholder: 'Details about old fence removal' },
        { id: 'disposal', label: 'Disposal', type: 'text', placeholder: 'How to dispose of old materials' },
        { id: 'customer-request', label: 'Customer request', type: 'textarea', placeholder: 'Any special requests from the customer' },
        { id: 'access-issues', label: 'Issues with Access', type: 'textarea', placeholder: 'Describe any access issues' },
        { id: 'parking-issues', label: 'Issues with Parking', type: 'textarea', placeholder: 'Describe any parking issues' },
        { id: 'obstacles', label: 'Any potential obstacles that need to be cautious of?', type: 'textarea', placeholder: 'List any potential obstacles or hazards' }
      ]
    },
    {
      id: 'electrical',
      name: 'Electrical Work',
      fields: [
        { id: 'electrical-scope', label: 'Scope of Work', type: 'textarea', placeholder: 'Describe the electrical work needed' },
        { id: 'circuit-requirements', label: 'Circuit Requirements', type: 'text', placeholder: 'Number and type of circuits' },
        { id: 'fixture-count', label: 'Fixtures', type: 'text', placeholder: 'Number and type of fixtures' },
        { id: 'special-requirements', label: 'Special Requirements', type: 'textarea', placeholder: 'Any special electrical requirements' }
      ]
    },
    {
      id: 'plumbing',
      name: 'Plumbing',
      fields: [
        { id: 'plumbing-description', label: 'Plumbing Description', type: 'textarea', placeholder: 'Describe the plumbing work needed' },
        { id: 'fixtures', label: 'Fixtures', type: 'text', placeholder: 'List fixtures to be installed/repaired' },
        { id: 'pipe-materials', label: 'Pipe Materials', type: 'text', placeholder: 'Type of pipes to be used' },
        { id: 'water-pressure', label: 'Water Pressure Issues', type: 'text', placeholder: 'Any water pressure concerns' }
      ]
    }
  ];

  // Combine predefined and custom templates
  const jobTemplates = [...predefinedTemplates, ...customTemplates];
  
  // Process steps functions
  const initializeProcessSteps = () => {
    const newSteps: ProcessStep[] = [];
    
    // Create default steps (initial, in progress, final)
    newSteps.push({
      id: `step-${Date.now()}-1`,
      title: "Initial Assessment",
      description: "Evaluate site conditions and requirements",
      isCompleted: false,
      photos: []
    });
    
    newSteps.push({
      id: `step-${Date.now()}-2`,
      title: "Material Acquisition",
      description: "Procure all necessary materials and equipment",
      isCompleted: false,
      photos: []
    });
    
    newSteps.push({
      id: `step-${Date.now()}-3`,
      title: "Implementation",
      description: "Execute primary job tasks",
      isCompleted: false,
      photos: []
    });
    
    setProcessSteps(newSteps);
    toast.success("Process steps initialized");
  };
  
  const addProcessStep = () => {
    if (processSteps.length >= maxSteps) {
      toast.error(`Maximum ${maxSteps} steps allowed`);
      return;
    }
    
    const newStep: ProcessStep = {
      id: `step-${Date.now()}`,
      title: "",
      isCompleted: false,
      photos: []
    };
    
    setProcessSteps([...processSteps, newStep]);
    
    // Start editing the new step
    setEditingStepId(newStep.id);
    setEditingStepTitle("");
  };
  
  const toggleStepCompletion = (stepId: string) => {
    setProcessSteps(prevSteps => {
      const stepIndex = prevSteps.findIndex(s => s.id === stepId);
      if (stepIndex === -1) return prevSteps;
      
      const newSteps = [...prevSteps];
      const isCompleted = !newSteps[stepIndex].isCompleted;
      
      newSteps[stepIndex] = {
        ...newSteps[stepIndex],
        isCompleted,
        completedDate: isCompleted ? new Date().toISOString() : undefined
      };
      
      return newSteps;
    });
    
    toast.success("Step status updated");
  };
  
  const updateStepTitle = (stepId: string, title: string) => {
    if (!title.trim()) {
      toast.error("Step title cannot be empty");
      return;
    }
    
    setProcessSteps(prevSteps => 
      prevSteps.map(step => 
        step.id === stepId ? { ...step, title } : step
      )
    );
    
    setEditingStepId(null);
    toast.success("Step title updated");
  };
  
  const addStepDescription = (stepId: string) => {
    const step = processSteps.find(s => s.id === stepId);
    if (!step) return;
    
    setStepToAddDescription(step);
    setNewStepDescription(step.description || "");
  };
  
  const saveStepDescription = () => {
    if (!stepToAddDescription) return;
    
    setProcessSteps(prevSteps => 
      prevSteps.map(step => 
        step.id === stepToAddDescription.id 
          ? { ...step, description: newStepDescription.trim() } 
          : step
      )
    );
    
    setStepToAddDescription(null);
    setNewStepDescription("");
    toast.success("Step description updated");
  };
  
  const addPhotoToStep = (stepId: string) => {
    // Implementation would be similar to section photo upload
    // We could reuse the file input and simply associate photos with steps
    toast.info("Photo upload functionality for steps would be implemented here");
  };
  
  const completeJob = () => {
    if (!canCompleteJob && requireAllSteps) {
      toast.error("All steps must be completed first");
      return;
    }
    
    setJobCompleted(true);
    setShowCompleteJobDialog(false);
    toast.success("Job marked as completed");
  };
  
  const addNote = () => {
    if (note.trim()) {
      setNotes([...notes, {
        text: note,
        isImportant,
        date: new Date().toISOString()
      }]);
      setNote("");
      setIsImportant(false);
    }
  };
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, sectionId?: string) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    // In a real app, this would upload to a server
    // Mock file upload for demo purposes
    const newPhotos = Array.from(files).map((file, index) => {
      const photoId = `new-${Date.now()}-${index}`;
      const url = URL.createObjectURL(file);
      
      return {
        id: photoId,
        url,
        caption: file.name,
        dateAdded: new Date().toISOString(),
        section: sectionId
      };
    });
    
    if (sectionId) {
      // Add to specific section
      setSections(prev => prev.map(section => 
        section.id === sectionId 
          ? { ...section, photos: [...section.photos, ...newPhotos] } 
          : section
      ));
    }
    
    // Also add to general photos collection
    setPhotos(prev => [...prev, ...newPhotos]);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    
    toast.success(`${newPhotos.length} photo${newPhotos.length > 1 ? 's' : ''} uploaded successfully`);
  };
  
  const removePhoto = (photoId: string, sectionId?: string) => {
    if (sectionId) {
      setSections(prev => prev.map(section => 
        section.id === sectionId 
          ? { ...section, photos: section.photos.filter(photo => photo.id !== photoId) } 
          : section
      ));
    }
    
    setPhotos(prev => prev.filter(photo => photo.id !== photoId));
    toast.success("Photo removed");
  };
  
  const addNewSection = () => {
    if (!newSection.title.trim()) return;
    
    const sectionId = `section-${Date.now()}`;
    setSections([...sections, {
      id: sectionId,
      title: newSection.title,
      description: newSection.description,
      photos: []
    }]);
    
    setNewSection({ title: "", description: "" });
    toast.success("New section added");
  };
  
  const updateSection = (section: JobSection) => {
    setSections(prev => prev.map(s => 
      s.id === section.id ? section : s
    ));
    setEditingSection(null);
    toast.success("Section updated");
  };
  
  const deleteSection = (sectionId: string) => {
    setSections(prev => prev.filter(s => s.id !== sectionId));
    toast.success("Section deleted");
  };
  
  const assignPhotoToSection = (photoId: string, sectionId: string) => {
    const photo = photos.find(p => p.id === photoId);
    if (!photo) return;
    
    setSections(prev => prev.map(section => 
      section.id === sectionId 
        ? { ...section, photos: [...section.photos, { ...photo, section: sectionId }] } 
        : section
    ));
    
    toast.success("Photo assigned to section");
  };
  
  const updatePhotoCaption = (photoId: string, caption: string) => {
    setPhotos(prev => prev.map(photo => 
      photo.id === photoId ? { ...photo, caption } : photo
    ));
    
    // Also update in sections if needed
    setSections(prev => prev.map(section => ({
      ...section,
      photos: section.photos.map(photo => 
        photo.id === photoId ? { ...photo, caption } : photo
      )
    })));
    
    setSelectedPhoto(null);
    toast.success("Photo caption updated");
  };
  
  // Function to save process settings
  const saveProcessSettings = () => {
    // Here we would typically save settings to backend
    // For now just showing feedback to the user
    toast.success("Process settings saved successfully");
    setShowProcessSettingsDialog(false);
  };

  // Handle applying a template
  const applyTemplate = (template: JobTemplate) => {
    setSelectedTemplate(template);
    setShowTemplateDialog(true);
    // Initialize empty values for all fields
    const initialValues: Record<string, string> = {};
    template.fields.forEach(field => {
      initialValues[field.id] = '';
    });
    setTemplateValues(initialValues);
  };

  // Handle template field change
  const handleTemplateFieldChange = (fieldId: string, value: string) => {
    setTemplateValues(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  // Add template section to job
  const addTemplateSection = () => {
    if (!selectedTemplate) return;
    
    const templateId = `template-${Date.now()}`;
    const templateContent = selectedTemplate.fields.map(field => 
      `${field.label}: ${templateValues[field.id] || 'N/A'}`
    ).join('\n\n');
    
    setSections([...sections, {
      id: templateId,
      title: `${selectedTemplate.name} Details`,
      description: templateContent,
      photos: []
    }]);
    
    setShowTemplateDialog(false);
    setSelectedTemplate(null);
    toast.success(`${selectedTemplate.name} template added`);
  };

  // Create new template functions
  const startCreateTemplate = () => {
    setShowCreateTemplateDialog(true);
    setNewTemplateName('');
    setNewTemplateFields([
      { id: `field-${Date.now()}`, label: 'Field 1', type: 'text', placeholder: '' }
    ]);
  };

  const addTemplateField = () => {
    setNewTemplateFields([
      ...newTemplateFields,
      { id: `field-${Date.now()}`, label: `Field ${newTemplateFields.length + 1}`, type: 'text', placeholder: '' }
    ]);
  };

  const updateTemplateField = (index: number, field: Partial<JobTemplateField>) => {
    setNewTemplateFields(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], ...field };
      return updated;
    });
  };

  const removeTemplateField = (index: number) => {
    setNewTemplateFields(prev => prev.filter((_, i) => i !== index));
  };

  const saveNewTemplate = () => {
    if (!newTemplateName.trim()) {
      toast.error('Template name is required');
      return;
    }

    if (newTemplateFields.length === 0) {
      toast.error('At least one field is required');
      return;
    }

    const newTemplate: JobTemplate = {
      id: `custom-${Date.now()}`,
      name: newTemplateName,
      fields: newTemplateFields,
      isCustom: true
    };

    setCustomTemplates(prev => [...prev, newTemplate]);
    setShowCreateTemplateDialog(false);
    toast.success(`Template "${newTemplateName}" created`);
  };

  // Add state for customer details
  const [jobData, setJobData] = useState<Job>(job);
  
  // Function to update job on the server
  const updateJobDetails = async (jobId: string, updates: Partial<Job>) => {
    try {
      const { error } = await supabase
        .from('jobs')
        .update(updates)
        .eq('id', jobId);
      
      if (error) {
        throw error;
      }
      
      toast.success("Job details updated");
      return true;
    } catch (error) {
      console.error("Error updating job details:", error);
      toast.error("Failed to update job details");
      return false;
    }
  };
  
  // Effect to fetch customer details when customer name is available
  useEffect(() => {
    const fetchCustomerDetails = async () => {
      if (job.customer && (!job.address || job.address === 'N/A')) {
        try {
          // Use the customerService singleton instance
          const customerDetails = await customerService.getCustomerDetails(job.customer);
          if (customerDetails && customerDetails.address) {
            // Update local state
            setJobData(prev => ({
              ...prev,
              address: customerDetails.address
            }));
            
            // Update job on the server if we have a job ID
            if (job.id) {
              await updateJobDetails(job.id, { 
                address: customerDetails.address,
                // Include other address components if needed
                city: customerDetails.city,
                state: customerDetails.state,
                zipCode: customerDetails.zipCode
              });
            }
          }
        } catch (error) {
          console.error("Error fetching customer details:", error);
        }
      }
    };

    fetchCustomerDetails();
  }, [job.customer, job.id]);

  // Update the geocoding useEffect for better handling of address changes
  useEffect(() => {
    const geocodeAddress = async () => {
      // Only try to geocode if we have an address and don't have coordinates
      const address = jobData.address || job.address;
      const hasLocation = jobData.location?.[0] && jobData.location?.[1];
      const shouldGeocode = address && 
                            address !== 'N/A' && 
                            (!hasLocation || jobData.address !== job.address);
      
      if (shouldGeocode) {
        try {
          console.log(`Geocoding address: ${address}`);
          const coordinates = await geocodingService.geocodeAddress(address);
          if (coordinates) {
            console.log(`Geocoded coordinates: [${coordinates[0]}, ${coordinates[1]}]`);
            // Update local state with the coordinates
            setJobData(prev => ({
              ...prev,
              location: coordinates
            }));
            
            // Update job on the server if we have a job ID
            if (job.id) {
              await updateJobDetails(job.id, { 
                location: coordinates
              });
            }
          }
        } catch (error) {
          console.error("Error geocoding address:", error);
        }
      }
    };

    geocodeAddress();
  }, [jobData.address, job.address, job.id]);

  const [documentationFiles, setDocumentationFiles] = useState<any[]>([]);
  const [documentationNotes, setDocumentationNotes] = useState("");
  const { uploadFileToStorage, isUploading } = useFileUpload(job.id);

  // Load documentation files and notes from job on mount
  useEffect(() => {
    if (job.documents && Array.isArray(job.documents)) {
      setDocumentationFiles(job.documents);
    }
    if (job.documentationNotes) {
      setDocumentationNotes(job.documentationNotes);
    }
  }, [job.documents, job.documentationNotes]);

  // Handle file upload for documentation
  const handleDocumentationFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const files = Array.from(e.target.files);
    const uploadedDocs: any[] = [];
    for (const file of files) {
      try {
        const filePath = await uploadFileToStorage(file);
        const publicUrl = supabase.storage.from('job-documents').getPublicUrl(filePath).data.publicUrl;
        uploadedDocs.push({
          name: file.name,
          url: publicUrl,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified
        });
      } catch (err) {
        toast.error(`Failed to upload ${file.name}`);
      }
    }
    const newDocs = [...documentationFiles, ...uploadedDocs];
    setDocumentationFiles(newDocs);
    await updateJobDetails(job.id, { documents: newDocs });
    toast.success("Documentation files uploaded and saved");
  };

  // Handle documentation notes change and save to backend
  const handleDocumentationNotesChange = async (notes: string) => {
    setDocumentationNotes(notes);
    await updateJobDetails(job.id, { documentationNotes: notes });
    toast.success("Documentation notes saved");
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    // Mock search delay
    setTimeout(() => {
      setSearchResults([
        { id: 'q1', quoteNumber: 'Q-2025-001', customerName: 'John Doe', amount: 1500 },
        { id: 'q2', quoteNumber: 'Q-2025-002', customerName: job.customer, amount: 2500 },
      ]);
      setIsSearching(false);
    }, 1000);
  };

  const attachQuote = (quote: Quote) => {
    if (!attachedQuotes.find(q => q.id === quote.id)) {
      setAttachedQuotes(prev => [...prev, quote]);
      // Remove from search results to avoid duplication
      setSearchResults(prev => prev.filter(r => r.id !== quote.id));
    }
  };
  
  const handleAddNewQuote = () => {
    // Navigate to a new quote page, passing the job ID to link it back
    navigate(`/quotes/new?jobId=${job.id}`);
  };

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    // Add logic to send message
    setMessageText("");
  };

  const handleCallCustomer = () => {
    // Add logic to initiate call
    console.log("Calling customer...");
  };

  const communicationChannels = [
    { icon: MessageSquare, label: "SMS", active: true },
    { icon: Smartphone, label: "WhatsApp" },
    { icon: Mail, label: "Email" },
    { icon: Facebook, label: "Facebook" },
    { icon: Instagram, label: "TikTok" },
    { icon: Instagram, label: "Instagram" },
    { icon: Globe, label: "GBP" },
    { icon: Globe, label: "Website" }
  ];

   const quickActions = [
    { label: "new client form", type: "form" },
    { label: "basic contract", type: "form" },
    { label: "defect form", type: "form" },
    { label: "variation approval", type: "form" },
    { label: "job preference form", type: "form" }
  ];

  const smsMessages = [
    {
      id: 1,
      sender: "AR",
      message: "Hi Sajad. This is Ana from Affordable Fencing Gold Coast. I need to confirm which colour sleeper you would like for your retaining wall?",
      time: "15:52 EAST",
      date: "9th May, 2025",
      type: "received",
      hasImage: true
    },
    {
      id: 2,
      sender: "N",
      message: "Hi, could we please get monument? thanks",
      time: "17:07 EAST", 
      date: "9th May, 2025",
      type: "sent"
    },
    {
      id: 3,
      sender: "AR",
      message: "You sure can. Thank you",
      time: "17:41 EAST",
      date: "9th May, 2025", 
      type: "received"
    }
  ];

  const callRecords = [
    {
      id: 1,
      type: "outgoing",
      duration: "12:45",
      date: "2 days ago",
      time: "15:23 EAST",
      status: "completed"
    },
    {
      id: 2,
      type: "incoming", 
      duration: "05:12",
      date: "1 week ago",
      time: "08:45 EAST",
      status: "completed"
    }
  ];

  // Financial Calculations
  const totalContractorCost = contractors.reduce((acc, c) => acc + c.cost, 0);
  const totalMaterialCost = materials.reduce((acc, m) => acc + m.cost, 0);
  const totalExpenses = totalContractorCost + totalMaterialCost;
  const totalRevenue = 5000; // Example static total revenue for a job
  const grossProfit = totalRevenue - totalExpenses;
  const gst = totalRevenue * 0.1; // 10% GST
  const taxToPutAway = grossProfit * 0.3; // Assuming a 30% tax rate on profit
  const netProfit = grossProfit - taxToPutAway;

  const handleAddItem = (type: 'contractor' | 'material') => {
    if (type === 'contractor' && newContractor.name && newContractor.cost) {
      setContractors(prev => [...prev, { id: `c${Date.now()}`, name: newContractor.name, cost: parseFloat(newContractor.cost) }]);
      setNewContractor({ name: '', cost: '' });
    } else if (type === 'material' && newMaterial.name && newMaterial.cost) {
      setMaterials(prev => [...prev, { id: `m${Date.now()}`, name: newMaterial.name, cost: parseFloat(newMaterial.cost) }]);
      setNewMaterial({ name: '', cost: '' });
    }
  };

  const handleDeleteItem = (type: 'contractor' | 'material', id: string) => {
    if (type === 'contractor') {
      setContractors(prev => prev.filter(item => item.id !== id));
    } else {
      setMaterials(prev => prev.filter(item => item.id !== id));
    }
  };

  return (
    <>
      <div className="w-full h-full bg-gray-100">
        {/* Map/Location header section with updated map data handling */}
        <div className="relative h-64 bg-gray-300">
          <div className="absolute inset-0">
          {job.location && Array.isArray(job.location) && job.location.length === 2 && (
  <JobStreetView location={job.location} height="350px" className="mt-4 rounded-xl" />
)}

          </div>
        </div>

        {/* Customer info and action buttons */}
        <div className="bg-gray-100 p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 lowercase">{jobData.customer || job.customer}</h1>
              <p className="text-gray-600">{jobData.type || job.type}</p>
              <div className="flex items-center mt-1">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500 text-white">
                  {jobData.status || job.status}
                </span>
                <span className="ml-2 text-sm text-gray-500">{jobData.date || job.date}</span>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button variant="outline" size="icon" className="rounded-full h-10 w-10 bg-gray-200">
                <Mic className="h-5 w-5 text-gray-700" />
              </Button>
              
              <div className="flex space-x-2">
                <Button className="bg-green-500 hover:bg-green-600 text-white font-medium rounded-md">
                  <Mic className="h-4 w-4 mr-2" /> WALKIE TALKIE
                </Button>
                
                <Button className="bg-red-500 hover:bg-red-600 text-white font-medium rounded-md">
                  <Coffee className="h-4 w-4 mr-2" /> SMOKO
                </Button>
                
                <Button className="bg-red-500 hover:bg-red-600 text-white font-medium rounded-md">
                  <PackageCheck className="h-4 w-4 mr-2" /> PACK HER UP
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end mt-4">
            <Button variant="outline" className="text-sm">
              <Share className="h-4 w-4 mr-1" /> Share Photos
            </Button>
          </div>
        </div>

        {/* Navigation tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 md:grid-cols-11 bg-white border-t border-b border-gray-200">
            <TabsTrigger value="details" className="text-xs md:text-sm py-2 data-[state=active]:border-b-2 data-[state=active]:border-blue-500">
              Details
            </TabsTrigger>
            <TabsTrigger value="templates" className="text-xs md:text-sm py-2 data-[state=active]:border-b-2 data-[state=active]:border-blue-500">
              <Book className="h-4 w-4 md:mr-1 md:inline hidden" /> Templates
            </TabsTrigger>
            <TabsTrigger value="notes" className="text-xs md:text-sm py-2 data-[state=active]:border-b-2 data-[state=active]:border-blue-500">
              <FileText className="h-4 w-4 md:mr-1 md:inline hidden" /> Notes
            </TabsTrigger>
            <TabsTrigger value="calendar" className="text-xs md:text-sm py-2 data-[state=active]:border-b-2 data-[state=active]:border-blue-500">
              <Calendar className="h-4 w-4 md:mr-1 md:inline hidden" /> Calendar
            </TabsTrigger>
            <TabsTrigger value="timer" className="text-xs md:text-sm py-2 data-[state=active]:border-b-2 data-[state=active]:border-blue-500">
              <Clock className="h-4 w-4 md:mr-1 md:inline hidden" /> Timer
            </TabsTrigger>
            <TabsTrigger value="materials" className="text-xs md:text-sm py-2 data-[state=active]:border-b-2 data-[state=active]:border-blue-500">
              <Box className="h-4 w-4 md:mr-1 md:inline hidden" /> Materials
            </TabsTrigger>
            <TabsTrigger value="progress" className="text-xs md:text-sm py-2 data-[state=active]:border-b-2 data-[state=active]:border-blue-500">
              Progress
            </TabsTrigger>
            <TabsTrigger value="bills" className="text-xs md:text-sm py-2 data-[state=active]:border-b-2 data-[state=active]:border-blue-500">
              Bills
            </TabsTrigger>
            <TabsTrigger value="costs" className="text-xs md:text-sm py-2 data-[state=active]:border-b-2 data-[state=active]:border-blue-500">
              Costs
            </TabsTrigger>
            <TabsTrigger value="financials" className="text-xs md:text-sm py-2 data-[state=active]:border-b-2 data-[state=active]:border-blue-500">
              <BarChart4 className="h-4 w-4 md:mr-1 md:inline hidden" /> Financials
            </TabsTrigger>
            <TabsTrigger value="conversations" className="text-xs md:text-sm py-2 data-[state=active]:border-b-2 data-[state=active]:border-blue-500">
              <MessageSquare className="h-4 w-4 md:mr-1 md:inline hidden" /> Conversations
            </TabsTrigger>
            <TabsTrigger value="quotes" className="text-xs md:text-sm py-2 data-[state=active]:border-b-2 data-[state=active]:border-blue-500">
              Quotes
            </TabsTrigger>
            <TabsTrigger value="jobs" className="text-xs md:text-sm py-2 data-[state=active]:border-b-2 data-[state=active]:border-blue-500">
              Jobs
            </TabsTrigger>
            <TabsTrigger value="documentation" className="text-xs md:text-sm py-2 data-[state=active]:border-b-2 data-[state=active]:border-blue-500">
              Documentation
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="p-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Job Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Job Number</p>
                        <p>{jobData.job_number || job.job_number}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Customer</p>
                        <p>{jobData.customer || job.customer}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Address</p>
                        <p>{jobData.address || job.address || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Type</p>
                        <p>{jobData.type || job.type}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Team</p>
                        <p>{jobData.assignedTeam || job.assignedTeam || 'Not assigned'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Date</p>
                        <p>{jobData.date || job.date}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Standalone Job Templates Section */}
                <Card className="bg-blue-50 border border-blue-100">
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center text-center">
                      <Book className="h-10 w-10 mb-2 text-blue-700" />
                      <h3 className="text-lg font-bold text-blue-800 mb-1">Job Templates</h3>
                      <p className="text-sm text-blue-600 mb-4">Add structured job details with pre-defined templates</p>
                      
                      <div className="flex flex-wrap gap-2 justify-center w-full">
                        <Button
                          className="bg-blue-600 hover:bg-blue-700"
                          onClick={() => {
                            const fencingTemplate = predefinedTemplates.find(t => t.id === 'fencing');
                            if (fencingTemplate) applyTemplate(fencingTemplate);
                          }}
                        >
                          Fencing Template
                        </Button>
                        <Button
                          className="bg-blue-600 hover:bg-blue-700"
                          onClick={() => {
                            const electricalTemplate = predefinedTemplates.find(t => t.id === 'electrical');
                            if (electricalTemplate) applyTemplate(electricalTemplate);
                          }}
                        >
                          Electrical Template
                        </Button>
                        <Button
                          className="bg-blue-600 hover:bg-blue-700"
                          onClick={() => {
                            const plumbingTemplate = predefinedTemplates.find(t => t.id === 'plumbing');
                            if (plumbingTemplate) applyTemplate(plumbingTemplate);
                          }}
                        >
                          Plumbing Template
                        </Button>
                        <Button
                          variant="outline"
                          className="text-blue-700 border-blue-300"
                          onClick={() => setShowTemplateDialog(true)}
                        >
                          Browse All Templates
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Job Sections */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle>Job Sections</CardTitle>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <PlusCircle className="h-4 w-4 mr-1" /> Add Section
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add New Job Section</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-2">
                          <div className="space-y-2">
                            <Label htmlFor="section-title">Section Title</Label>
                            <Input 
                              id="section-title" 
                              value={newSection.title}
                              onChange={(e) => setNewSection({...newSection, title: e.target.value})}
                              placeholder="e.g., Electrical Requirements"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="section-description">Description</Label>
                            <Textarea 
                              id="section-description" 
                              value={newSection.description}
                              onChange={(e) => setNewSection({...newSection, description: e.target.value})}
                              placeholder="Enter details about this section..."
                              rows={4}
                            />
                          </div>
                          <Button onClick={addNewSection} className="w-full">
                            Add Section
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {sections.map((section) => (
                        <AccordionItem key={section.id} value={section.id}>
                          <AccordionTrigger className="hover:no-underline">
                            <div className="flex items-center justify-between w-full pr-4">
                              <span>{section.title}</span>
                              <div className="flex items-center text-xs text-gray-500">
                                <ImageIcon className="h-3 w-3 mr-1" />
                                <span>{section.photos.length}</span>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            {editingSection?.id === section.id ? (
                              <div className="space-y-4 p-2">
                                <Input 
                                  value={editingSection.title}
                                  onChange={(e) => setEditingSection({...editingSection, title: e.target.value})}
                                  className="mb-2"
                                />
                                <Textarea 
                                  value={editingSection.description}
                                  onChange={(e) => setEditingSection({...editingSection, description: e.target.value})}
                                  rows={3}
                                  className="mb-2"
                                />
                                <div className="flex justify-end space-x-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => setEditingSection(null)}
                                  >
                                    Cancel
                                  </Button>
                                  <Button 
                                    size="sm"
                                    onClick={() => updateSection(editingSection)}
                                  >
                                    Save Changes
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <p className="text-sm mb-4">{section.description}</p>
                                
                                <div className="flex justify-between items-center mb-4">
                                  <div className="flex space-x-2">
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => setEditingSection(section)}
                                    >
                                      <Edit className="h-3 w-3 mr-1" /> Edit
                                    </Button>
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className="text-red-600 border-red-200 hover:bg-red-50"
                                      onClick={() => deleteSection(section.id)}
                                    >
                                      <Trash2 className="h-3 w-3 mr-1" /> Delete
                                    </Button>
                                  </div>
                                  <div>
                                    <label htmlFor={`photo-upload-${section.id}`} className="cursor-pointer">
                                      <div className="flex items-center text-xs text-blue-600 hover:text-blue-800">
                                        <Camera className="h-3 w-3 mr-1" />
                                        <span>Add Photos</span>
                                      </div>
                                      <input 
                                        id={`photo-upload-${section.id}`}
                                        type="file"
                                        multiple
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => handleFileUpload(e, section.id)}
                                      />
                                    </label>
                                  </div>
                                </div>
                                
                                {section.photos.length > 0 ? (
                                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {section.photos.map((photo) => (
                                      <div 
                                        key={photo.id} 
                                        className="relative group rounded-md overflow-hidden border border-gray-200"
                                      >
                                        <img 
                                          src={photo.url} 
                                          alt={photo.caption} 
                                          className="w-full h-48 object-cover cursor-pointer" 
                                          onClick={() => setSelectedPhoto(photo)}
                                        />
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                          <div className="flex space-x-1">
                                            <Button 
                                              variant="ghost" 
                                              size="icon" 
                                              className="h-7 w-7 rounded-full bg-white text-gray-700 hover:text-black"
                                              onClick={() => setSelectedPhoto(photo)}
                                            >
                                              <Info className="h-3 w-3" />
                                            </Button>
                                            <Button 
                                              variant="ghost" 
                                              size="icon" 
                                              className="h-7 w-7 rounded-full bg-white text-red-500 hover:text-red-700"
                                              onClick={() => removePhoto(photo.id, section.id)}
                                            >
                                              <Trash2 className="h-3 w-3" />
                                            </Button>
                                          </div>
                                        </div>
                                        <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-1">
                                          <p className="text-xs text-white truncate">{photo.caption}</p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-xs text-gray-500 italic">No photos added to this section yet.</p>
                                )}
                              </>
                            )}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                    
                    {sections.length === 0 && (
                      <div className="text-center py-6">
                        <p className="text-gray-500 mb-2">No job sections added yet</p>
                        <Button variant="outline" onClick={() => null}>
                          <PlusCircle className="h-4 w-4 mr-2" /> Add your first section
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* Job Process Steps */}
                <Card className="mt-6">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div>
                      <CardTitle>Job Process Steps</CardTitle>
                      <CardDescription>Track progress through job completion</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      {canCompleteJob && !jobCompleted && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-600 border-green-200 hover:bg-green-50"
                          onClick={() => setShowCompleteJobDialog(true)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" /> Complete Job
                        </Button>
                      )}
                      <Dialog
                        open={showProcessSettingsDialog}
                        onOpenChange={setShowProcessSettingsDialog}
                      >
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm"
                            onClick={() => setShowProcessSettingsDialog(true)}
                          >
                            <Settings className="h-4 w-4 mr-1" /> Process Settings
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Job Process Settings</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-2">
                            <div className="space-y-2">
                              <Label htmlFor="max-steps">Number of Steps</Label>
                              <div className="flex items-center space-x-2">
                                <Input
                                  id="max-steps"
                                  type="number"
                                  min="1"
                                  max="20"
                                  value={maxSteps}
                                  onChange={(e) => setMaxSteps(Math.min(20, Math.max(1, parseInt(e.target.value) || 1)))}
                                  className="w-20"
                                />
                                <span className="text-sm text-gray-500">Maximum 20 steps</span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id="require-all-steps"
                                  checked={requireAllSteps}
                                  onCheckedChange={(checked) => setRequireAllSteps(!!checked)}
                                />
                                <Label htmlFor="require-all-steps">Require all steps to complete job</Label>
                              </div>
                              <p className="text-xs text-gray-500 pl-6">
                                If unchecked, job can be marked as complete at any step
                              </p>
                            </div>
                            <Button
                              onClick={() => {
                                // Save settings to state or backend
                                toast.success("Process settings saved successfully");
                                setShowProcessSettingsDialog(false);
                              }}
                              className="w-full"
                            >
                              Save Settings
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {processSteps.length > 0 ? (
                      <div className="space-y-3">
                        {jobCompleted && (
                          <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-4 flex items-center justify-between">
                            <div className="flex items-center">
                              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                              <span className="font-medium text-green-700">Job Completed</span>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setJobCompleted(false)}
                              className="text-xs"
                            >
                              Reopen Job
                            </Button>
                          </div>
                        )}
                        
                        <div className="relative mb-8">
                          <div className="absolute left-0 right-0 h-1 bg-gray-200 top-3"></div>
                          <div 
                            className="absolute left-0 h-1 bg-blue-500 top-3" 
                            style={{ width: `${(completedStepsCount / processSteps.length) * 100}%` }}
                          ></div>
                          <div className="flex justify-between relative">
                            {processSteps.map((step, index) => (
                              <div 
                                key={step.id}
                                className="flex flex-col items-center relative"
                                style={{ width: `${100 / processSteps.length}%` }}
                              >
                                <div 
                                  className={`z-10 flex items-center justify-center w-6 h-6 rounded-full border-2 ${
                                    step.isCompleted
                                      ? 'bg-blue-500 border-blue-500 text-white' 
                                      : 'bg-white border-gray-300'
                                  }`}
                                >
                                  {step.isCompleted && <Check className="h-3 w-3" />}
                                </div>
                                <span className="text-xs mt-2 text-center">{step.title || `Step ${index + 1}`}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {processSteps.map((step, index) => (
                          <div 
                            key={step.id}
                            className={`border rounded-md p-3 ${
                              step.isCompleted ? 'border-blue-200 bg-blue-50' : 'border-gray-200'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div 
                                  className={`flex items-center justify-center w-6 h-6 rounded-full ${
                                    step.isCompleted
                                      ? 'bg-blue-500 text-white'
                                      : 'border border-gray-300'
                                  }`}
                                >
                                  {step.isCompleted ? (
                                    <Check className="h-3 w-3" />
                                  ) : (
                                    <span className="text-xs">{index + 1}</span>
                                  )}
                                </div>
                                {editingStepId === step.id ? (
                                  <Input
                                    value={editingStepTitle}
                                    onChange={(e) => setEditingStepTitle(e.target.value)}
                                    className="h-8 text-sm"
                                    placeholder="Step title"
                                    autoFocus
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        updateStepTitle(step.id, editingStepTitle);
                                      } else if (e.key === 'Escape') {
                                        setEditingStepId(null);
                                      }
                                    }}
                                  />
                                ) : (
                                  <span className="font-medium">{step.title || `Step ${index + 1}`}</span>
                                )}
                              </div>
                              <div className="flex items-center space-x-2">
                                {!jobCompleted && (
                                  <>
                                    {editingStepId === step.id ? (
                                      <>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => updateStepTitle(step.id, editingStepTitle)}
                                          className="h-8 px-2"
                                        >
                                          <Check className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => setEditingStepId(null)}
                                          className="h-8 px-2"
                                        >
                                          <X className="h-4 w-4" />
                                        </Button>
                                      </>
                                    ) : (
                                      <>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => {
                                            setEditingStepId(step.id);
                                            setEditingStepTitle(step.title);
                                          }}
                                          className="h-8 px-2 text-gray-500"
                                        >
                                          <Edit className="h-4 w-4" />
                                        </Button>
                                        {step.isCompleted ? (
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => toggleStepCompletion(step.id)}
                                            className="h-8 px-2 text-yellow-500"
                                          >
                                            <RotateCcw className="h-4 w-4" />
                                          </Button>
                                        ) : (
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => toggleStepCompletion(step.id)}
                                            className="h-8 px-2 text-blue-500"
                                          >
                                            <CheckCircle className="h-4 w-4" />
                                          </Button>
                                        )}
                                      </>
                                    )}
                                  </>
                                )}
                              </div>
                            </div>
                            
                            {step.description && (
                              <div className="ml-9 mt-2">
                                <p className="text-sm text-gray-600">{step.description}</p>
                              </div>
                            )}
                            
                            {!editingStepId && !jobCompleted && (
                              <div className="flex mt-3 ml-9 space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-7 text-xs"
                                  onClick={() => addStepDescription(step.id)}
                                >
                                  <FileText className="h-3 w-3 mr-1" /> {step.description ? 'Edit' : 'Add'} Description
                                </Button>
                                
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-7 text-xs"
                                  onClick={() => addPhotoToStep(step.id)}
                                >
                                  <Camera className="h-3 w-3 mr-1" /> Add Photo
                                </Button>
                              </div>
                            )}
                          </div>
                        ))}
                        
                        {!jobCompleted && processSteps.length < maxSteps && (
                          <Button
                            variant="outline"
                            className="w-full mt-4"
                            onClick={addProcessStep}
                          >
                            <PlusCircle className="h-4 w-4 mr-2" /> Add Step
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto mb-2" />
                        <p className="text-gray-500 mb-4">No process steps defined for this job</p>
                        <Button onClick={initializeProcessSteps}>
                          <PlusCircle className="h-4 w-4 mr-2" /> Add Process Steps
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              {/* Photos Gallery */}
              <div>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle>Photos Gallery /Plans</CardTitle>
                    <div>
                      <label htmlFor="photo-upload-main" className="cursor-pointer">
                        <Button variant="outline" size="sm" asChild>
                          <div>
                            <Upload className="h-4 w-4 mr-1" /> Upload Photos
                          </div>
                        </Button>
                        <input 
                          id="photo-upload-main"
                          type="file"
                          multiple
                          className="hidden"
                          accept="image/*"
                          onChange={handleFileUpload}
                          ref={fileInputRef}
                        />
                      </label>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {photos.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {photos.map((photo) => (
                          <div 
                            key={photo.id} 
                            className="relative group rounded-md overflow-hidden border border-gray-200"
                          >
                            <img 
                              src={photo.url} 
                              alt={photo.caption} 
                              className="w-full h-48 object-cover cursor-pointer" 
                              onClick={() => setSelectedPhoto(photo)}
                            />
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="flex space-x-2">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 rounded-full bg-white text-gray-700 hover:text-black"
                                  onClick={() => setSelectedPhoto(photo)}
                                >
                                  <Info className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 rounded-full bg-white text-red-500 hover:text-red-700"
                                  onClick={() => removePhoto(photo.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-1">
                              <p className="text-xs text-white truncate">{photo.caption}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                        <Camera className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                        <p className="text-gray-500 mb-2">No photos uploaded yet</p>
                        <label htmlFor="photo-upload-empty" className="cursor-pointer">
                          <Button variant="outline">
                            <Upload className="h-4 w-4 mr-2" /> Upload Photos
                          </Button>
                          <input 
                            id="photo-upload-empty"
                            type="file"
                            multiple
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileUpload}
                          />
                        </label>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* Site (Audit) Photos */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Site (Audit) Photos</CardTitle>
                    <CardDescription>
                      Photos taken during initial site assessment
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div 
                          key={`site-${i}`} 
                          className="relative group rounded-md overflow-hidden border border-gray-200"
                        >
                          <img 
                            src={`https://source.unsplash.com/random/300x200?electrical,${i}`} 
                            alt={`Site (Audit) photo ${i}`} 
                            className="w-full h-32 object-cover" 
                          />
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="flex space-x-2">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 rounded-full bg-white text-blue-600 hover:text-blue-800"
                              >
                                <ArrowLeft className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-1">
                            <p className="text-xs text-white truncate">{`Site photo ${i}`}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            {/* Photo Detail Dialog */}
            <Dialog open={!!selectedPhoto} onOpenChange={(open) => !open && setSelectedPhoto(null)}>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Photo Details</DialogTitle>
                </DialogHeader>
                {selectedPhoto && (
                  <div className="space-y-4">
                    <div className="rounded-md overflow-hidden">
                      <img 
                        src={selectedPhoto.url} 
                        alt={selectedPhoto.caption} 
                        className="w-full max-h-[500px] object-contain" 
                      />
                    </div>
                    
                    {isEditing ? (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="photo-caption">Caption</Label>
                          <Textarea 
                            id="photo-caption"
                            value={photoCaption}
                            onChange={(e) => setPhotoCaption(e.target.value)}
                            rows={2}
                          />
                        </div>
                        
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="outline" 
                            onClick={() => {
                              setIsEditing(false);
                              setPhotoCaption("");
                            }}
                          >
                            Cancel
                          </Button>
                          <Button onClick={() => {
                            updatePhotoCaption(selectedPhoto.id, photoCaption);
                            setIsEditing(false);
                          }}>
                            Save Changes
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Caption</h3>
                          <p>{selectedPhoto.caption}</p>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Date Added</h3>
                          <p>{new Date(selectedPhoto.dateAdded).toLocaleDateString()}</p>
                        </div>
                        
                        <div className="flex justify-between pt-2">
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-1">Assign to Section</h3>
                            <select 
                              className="rounded-md border-gray-300 text-sm"
                              onChange={(e) => assignPhotoToSection(selectedPhoto.id, e.target.value)}
                              defaultValue=""
                            >
                              <option value="" disabled>Select a section</option>
                              {sections.map(section => (
                                <option key={section.id} value={section.id}>
                                  {section.title}
                                </option>
                              ))}
                            </select>
                          </div>
                          
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline"
                              onClick={() => {
                                setPhotoCaption(selectedPhoto.caption);
                                setIsEditing(true);
                              }}
                            >
                              <Edit className="h-4 w-4 mr-1" /> Edit
                            </Button>
                            <Button 
                              variant="outline"
                              className="text-red-600 border-red-200 hover:bg-red-50"
                              onClick={() => {
                                removePhoto(selectedPhoto.id, selectedPhoto.section);
                                setSelectedPhoto(null);
                              }}
                            >
                              <Trash2 className="h-4 w-4 mr-1" /> Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="templates" className="p-4">
            <div className="max-w-4xl mx-auto">
              <Card className="bg-blue-50 border border-blue-200 mb-6">
                <CardHeader>
                  <CardTitle className="text-blue-800">Job Templates</CardTitle>
                  <CardDescription className="text-blue-700">
                    Apply pre-made templates or create your own to standardize job details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button 
                      size="lg" 
                      className="h-auto py-6 flex flex-col items-center justify-center bg-white border-2 border-blue-300 text-blue-700 hover:bg-blue-50"
                      onClick={() => setShowTemplateDialog(true)}
                    >
                      <Book className="h-8 w-8 mb-2" />
                      <span className="text-lg font-medium">Select Template</span>
                      <span className="text-sm mt-1">Choose from available templates</span>
                    </Button>
                    
                    <Button 
                      size="lg" 
                      className="h-auto py-6 flex flex-col items-center justify-center bg-white border-2 border-green-300 text-green-700 hover:bg-green-50"
                      onClick={startCreateTemplate}
                    >
                      <Plus className="h-8 w-8 mb-2" />
                      <span className="text-lg font-medium">Create New Template</span>
                      <span className="text-sm mt-1">Design a custom template</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <h2 className="text-xl font-bold mb-4">Available Templates</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {jobTemplates.map(template => (
                  <Card key={template.id} className={template.isCustom ? 'border-green-200' : 'border-blue-200'}>
                    <CardHeader className={`pb-2 ${template.isCustom ? 'bg-green-50' : 'bg-blue-50'}`}>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-base">{template.name}</CardTitle>
                        {template.isCustom && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                            Custom
                          </span>
                        )}
                      </div>
                      <CardDescription>
                        {template.fields.length} fields
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-1 mb-4 text-sm text-gray-500">
                        {/* Show first 3 fields as preview */}
                        {template.fields.slice(0, 3).map(field => (
                          <div key={field.id} className="flex items-center">
                            <Check className="h-3 w-3 mr-1 text-gray-400" />
                            <span>{field.label}</span>
                          </div>
                        ))}
                        {template.fields.length > 3 && (
                          <div className="text-xs text-gray-400 italic pl-4">
                            +{template.fields.length - 3} more fields
                          </div>
                        )}
                      </div>
                      <Button 
                        className="w-full" 
                        onClick={() => applyTemplate(template)}
                        variant={template.isCustom ? "outline" : "default"}
                      >
                        Apply Template
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notes" className="p-4">
            <Card className="p-4 mb-4">
              <h2 className="text-lg font-semibold mb-2">Add New Note</h2>
              <Textarea 
                placeholder="Add job notes here..." 
                className="w-full mb-3"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="important" 
                    checked={isImportant}
                    onCheckedChange={(checked) => setIsImportant(!!checked)}
                  />
                  <label htmlFor="important" className="text-sm">Mark as important</label>
                </div>
                <Button onClick={addNote}>Add Note</Button>
              </div>
            </Card>

            {notes.length > 0 ? (
              <div className="space-y-3">
                {notes.map((note, index) => (
                  <Card key={index} className={`p-3 ${note.isImportant ? 'border-l-4 border-l-yellow-500' : ''}`}>
                    <p>{note.text}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(note.date).toLocaleString()}
                    </p>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-10">No notes added yet</p>
            )}
          </TabsContent>

          <TabsContent value="calendar" className="p-4">
            <div className="text-center py-10 text-gray-500">Calendar content will be displayed here</div>
          </TabsContent>

          <TabsContent value="timer" className="p-4">
            <div className="text-center py-10 text-gray-500">Timer content will be displayed here</div>
          </TabsContent>

          <TabsContent value="materials" className="p-4">
            <div className="text-center py-10 text-gray-500">Materials content will be displayed here</div>
          </TabsContent>

          <TabsContent value="progress" className="p-4">
            <div className="text-center py-10 text-gray-500">Progress content will be displayed here</div>
          </TabsContent>

          <TabsContent value="bills" className="p-4">
            <div className="text-center py-10 text-gray-500">Bills content will be displayed here</div>
          </TabsContent>

          <TabsContent value="costs" className="p-4">
            <div className="text-center py-10 text-gray-500">Costs content will be displayed here</div>
          </TabsContent>

          <TabsContent value="financials" className="p-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content: Costs Breakdown */}
              <div className="lg:col-span-2 space-y-6">
                {/* Contractors */}
                <Card>
                  <CardHeader>
                    <CardTitle>Contractors</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead className="text-right">Cost</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {contractors.map(c => (
                          <TableRow key={c.id}>
                            <TableCell>{c.name}</TableCell>
                            <TableCell className="text-right">${c.cost.toFixed(2)}</TableCell>
                            <TableCell>
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteItem('contractor', c.id)}>
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                  <CardFooter className="flex items-center gap-2 p-4 border-t">
                    <Input placeholder="Contractor Name" value={newContractor.name} onChange={(e) => setNewContractor({...newContractor, name: e.target.value})} />
                    <Input placeholder="Cost" type="number" value={newContractor.cost} onChange={(e) => setNewContractor({...newContractor, cost: e.target.value})} />
                    <Button onClick={() => handleAddItem('contractor')}><PlusCircle className="h-4 w-4" /></Button>
                  </CardFooter>
                </Card>

                {/* Materials */}
                <Card>
                  <CardHeader>
                    <CardTitle>Materials</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Item</TableHead>
                          <TableHead className="text-right">Cost</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {materials.map(m => (
                          <TableRow key={m.id}>
                            <TableCell>{m.name}</TableCell>
                            <TableCell className="text-right">${m.cost.toFixed(2)}</TableCell>
                            <TableCell>
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteItem('material', m.id)}>
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                   <CardFooter className="flex items-center gap-2 p-4 border-t">
                    <Input placeholder="Material Name" value={newMaterial.name} onChange={(e) => setNewMaterial({...newMaterial, name: e.target.value})} />
                    <Input placeholder="Cost" type="number" value={newMaterial.cost} onChange={(e) => setNewMaterial({...newMaterial, cost: e.target.value})} />
                    <Button onClick={() => handleAddItem('material')}><PlusCircle className="h-4 w-4" /></Button>
                  </CardFooter>
                </Card>
              </div>

              {/* Sidebar: Financial Summary */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Financial Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Revenue</span>
                      <span className="font-medium text-lg">${totalRevenue.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Expenses</span>
                      <span className="font-medium text-lg text-red-600">-${totalExpenses.toFixed(2)}</span>
                    </div>
                    <hr />
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-semibold">Gross Profit</span>
                      <span className="font-semibold text-xl text-blue-600">${grossProfit.toFixed(2)}</span>
                    </div>
                  </CardContent>
                </Card>

                 <Card>
                  <CardHeader>
                    <CardTitle>Tax & Net Profit</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">GST (10%)</span>
                      <span className="font-medium">${gst.toFixed(2)}</span>
                    </div>
                     <div className="flex justify-between items-center">
                      <span className="text-gray-600">Tax to Put Away (30%)</span>
                      <span className="font-medium text-orange-600">-${taxToPutAway.toFixed(2)}</span>
                    </div>
                    <hr />
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-700">Net Profit</span>
                      <span className="font-bold text-2xl text-green-600">${netProfit.toFixed(2)}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="conversations" className="p-4">
            <div className="space-y-6 max-h-[calc(100vh-400px)] overflow-y-auto">
              {/* Call Records */}
              {callRecords.map((call) => (
                <Card key={call.id} className="shadow-sm border-gray-300">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-blue-500" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {call.type === 'outgoing' ? 'Outgoing Call' : 'Incoming Call'}
                          </p>
                          <p className="text-sm text-gray-500">
                            Duration: {call.duration} • {call.date}
                          </p>
                        </div>
                      </div>
                      <div className="text-gray-500 font-medium">
                        {call.time}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-3">
                      <Button variant="outline" size="sm" className="gap-2">
                        <Play className="h-4 w-4" />
                        Play Recording
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Save className="h-4 w-4" />
                        Save to Vault
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Share2 className="h-4 w-4" />
                        Share
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Date Separator */}
              <div className="flex items-center justify-center py-4">
                <div className="bg-gray-200 rounded-full px-4 py-2">
                  <p className="text-sm font-medium text-gray-600">9th May, 2025</p>
                </div>
              </div>

              {/* SMS Messages */}
              <div className="space-y-4">
                {smsMessages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === 'sent' ? 'justify-start' : 'justify-end'}`}>
                    <div className={`flex items-start gap-2 max-w-md ${message.type === 'sent' ? 'flex-row' : 'flex-row-reverse'}`}>
                      <Avatar className="h-6 w-6 text-xs">
                        <AvatarFallback className="bg-gray-300 text-gray-700">
                          {message.sender}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className={`rounded-lg px-4 py-3 border ${
                        message.type === 'sent' 
                          ? 'bg-gray-100 text-gray-900 border-gray-200' 
                          : 'bg-blue-500 text-white border-blue-600'
                      }`}>
                        <p className="text-sm">{message.message}</p>
                        {message.hasImage && (
                          <Button variant="link" className="text-blue-200 p-0 h-auto text-xs underline mt-1">
                            View Image
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500 mt-2 ml-2">
                      {message.time} {message.sender}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="quotes">
            <div className="space-y-6 max-w-4xl mx-auto">
              <Card className="border-gray-300">
                <CardHeader>
                  <CardTitle>Attach Existing Quote</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Search by customer name or job number..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Button onClick={handleSearch} disabled={isSearching}>
                      <Search className="h-4 w-4 mr-2" />
                      {isSearching ? 'Searching...' : 'Search'}
                    </Button>
                  </div>

                  {searchResults.length > 0 && (
                    <div className="border rounded-md p-2 space-y-2">
                      {searchResults.map(quote => (
                        <div key={quote.id} className="flex justify-between items-center p-2 rounded-md hover:bg-gray-50">
                          <div>
                            <p className="font-medium">{quote.quoteNumber}</p>
                            <p className="text-sm text-gray-500">{quote.customerName} - ${quote.amount}</p>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => attachQuote(quote)}>
                            <Link2 className="h-4 w-4 mr-2" />
                            Attach
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <div>
                <Button className="w-full" onClick={handleAddNewQuote}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add New Quote
                </Button>
              </div>

              <Card className="border-gray-300">
                <CardHeader>
                  <CardTitle>Attached Quotes</CardTitle>
                </CardHeader>
                <CardContent>
                  {attachedQuotes.length > 0 ? (
                    <div className="space-y-2">
                      {attachedQuotes.map(quote => (
                        <div key={quote.id} className="flex justify-between items-center p-3 border rounded-md bg-gray-50">
                           <div>
                            <p className="font-medium">{quote.quoteNumber}</p>
                            <p className="text-sm text-gray-500">{quote.customerName} - ${quote.amount}</p>
                          </div>
                          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">No quotes attached to this job yet.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="jobs">
            <div className="text-center text-gray-500 py-8">Jobs content will go here</div>
          </TabsContent>

          <TabsContent value="documentation" className="p-4">
            <JobDocumentation
              documents={documentationFiles}
              setDocuments={setDocumentationFiles}
              notes={documentationNotes}
              setNotes={handleDocumentationNotesChange}
              onFileUpload={handleDocumentationFileUpload}
              isUploading={isUploading}
            />
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Step Description Dialog */}
      <Dialog 
        open={!!stepToAddDescription} 
        onOpenChange={(open) => !open && setStepToAddDescription(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {stepToAddDescription?.description ? 'Edit' : 'Add'} Step Description
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="step-description">Description</Label>
              <Textarea
                id="step-description"
                value={newStepDescription}
                onChange={(e) => setNewStepDescription(e.target.value)}
                placeholder="Enter details about this step..."
                rows={4}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setStepToAddDescription(null)}
              >
                Cancel
              </Button>
              <Button onClick={saveStepDescription}>
                Save Description
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Complete Job Dialog */}
      <AlertDialog 
        open={showCompleteJobDialog} 
        onOpenChange={setShowCompleteJobDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Complete Job</AlertDialogTitle>
            <AlertDialogDescription>
              {requireAllSteps && completedStepsCount < processSteps.length ? (
                <>
                  <div className="text-red-500 mb-2">
                    Warning: Not all steps are completed ({completedStepsCount} of {processSteps.length})
                  </div>
                  <p>
                    Your job settings require all steps to be completed before marking the job as complete.
                    Please complete all steps first.
                  </p>
                </>
              ) : (
                <>
                  Are you sure you want to mark this job as complete? 
                  {completedStepsCount < processSteps.length && (
                    <div className="mt-2 text-amber-500">
                      Note: {processSteps.length - completedStepsCount} steps are not marked as completed.
                    </div>
                  )}
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={completeJob}
              disabled={requireAllSteps && completedStepsCount < processSteps.length}
              className={requireAllSteps && completedStepsCount < processSteps.length ? 'opacity-50 cursor-not-allowed' : ''}
            >
              Complete Job
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Template Selection Dialog */}
      <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Select Job Template</DialogTitle>
            <DialogDescription>
              Choose a template to add pre-defined job details
            </DialogDescription>
          </DialogHeader>
          
          {!selectedTemplate ? (
            // Template selection view
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-1 gap-3">
                {jobTemplates.map(template => (
                  <Button
                    key={template.id}
                    variant="outline"
                    className={`justify-start h-auto py-3 px-4 ${template.isCustom ? 'border-green-200 bg-green-50' : ''}`}
                    onClick={() => applyTemplate(template)}
                  >
                    <Book className={`h-4 w-4 mr-2 ${template.isCustom ? 'text-green-600' : 'text-blue-600'}`} />
                    <div className="text-left">
                      <div className="flex items-center">
                        <p className="font-medium">{template.name}</p>
                        {template.isCustom && (
                          <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Custom</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">{template.fields.length} fields</p>
                    </div>
                  </Button>
                ))}
              </div>
              
              <div className="flex justify-between pt-4 border-t border-gray-200">
                <Button 
                  variant="outline" 
                  onClick={() => setShowTemplateDialog(false)}
                >
                  Cancel
                </Button>
                <Button 
                  variant="outline"
                  onClick={startCreateTemplate}
                >
                  <Plus className="h-4 w-4 mr-1" /> Create New Template
                </Button>
              </div>
            </div>
          ) : (
            // Template field filling view
            <>
              <div className="space-y-4 py-2 max-h-[60vh] overflow-y-auto">
                {selectedTemplate.fields.map(field => (
                  <div key={field.id} className="space-y-2">
                    <Label htmlFor={field.id}>{field.label}</Label>
                    {field.type === 'textarea' ? (
                      <Textarea
                        id={field.id}
                        placeholder={field.placeholder}
                        value={templateValues[field.id] || ''}
                        onChange={(e) => handleTemplateFieldChange(field.id, e.target.value)}
                        rows={3}
                      />
                    ) : (
                      <Input
                        id={field.id}
                        type={field.type === 'number' ? 'number' : 'text'}
                        placeholder={field.placeholder}
                        value={templateValues[field.id] || ''}
                        onChange={(e) => handleTemplateFieldChange(field.id, e.target.value)}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between space-x-2 pt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={() => setSelectedTemplate(null)}
                >
                  Back
                </Button>
                <Button onClick={addTemplateSection}>
                  Add to Job
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Create Template Dialog */}
      <Dialog open={showCreateTemplateDialog} onOpenChange={setShowCreateTemplateDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Create New Template</DialogTitle>
            <DialogDescription>
              Design a custom template for your job details
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="template-name">Template Name</Label>
              <Input
                id="template-name"
                placeholder="e.g., Roofing Template"
                value={newTemplateName}
                onChange={(e) => setNewTemplateName(e.target.value)}
              />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Template Fields</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addTemplateField}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Field
                </Button>
              </div>
              
              <div className="space-y-4 max-h-[40vh] overflow-y-auto">
                {newTemplateFields.map((field, index) => (
                  <div key={field.id} className="border border-gray-200 rounded-md p-3 space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-sm">Field {index + 1}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-red-500"
                        onClick={() => removeTemplateField(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor={`field-label-${index}`}>Field Label</Label>
                        <Input
                          id={`field-label-${index}`}
                          value={field.label}
                          onChange={(e) => updateTemplateField(index, { label: e.target.value })}
                          placeholder="e.g., Material Type"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`field-type-${index}`}>Field Type</Label>
                        <select
                          id={`field-type-${index}`}
                          value={field.type}
                          onChange={(e) => updateTemplateField(index, { type: e.target.value as 'text' | 'textarea' | 'number' | 'checkbox' })}
                          className="w-full rounded-md border border-gray-300 p-2"
                        >
                          <option value="text">Text (Single line)</option>
                          <option value="textarea">Text Area (Multiple lines)</option>
                          <option value="number">Number</option>
                          <option value="checkbox">Checkbox</option>
                        </select>
                      </div>
                      
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor={`field-placeholder-${index}`}>Placeholder Text</Label>
                        <Input
                          id={`field-placeholder-${index}`}
                          value={field.placeholder || ''}
                          onChange={(e) => updateTemplateField(index, { placeholder: e.target.value })}
                          placeholder="e.g., Enter material specifications..."
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex justify-between pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={() => setShowCreateTemplateDialog(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={saveNewTemplate}
              className="bg-green-600 hover:bg-green-700"
            >
              <SaveAll className="h-4 w-4 mr-1" /> Save Template
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bottom Communication Interface - only shown for conversations tab */}
      {activeTab === 'conversations' && (
        <div className="sticky bottom-0 bg-white border-t p-4 mt-auto">
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="flex flex-wrap gap-2 justify-center">
              {communicationChannels.map((channel, index) => {
                const Icon = channel.icon;
                return (
                  <Button
                    key={index}
                    variant={channel.active ? "default" : "outline"}
                    size="sm"
                    className={`gap-2 ${channel.active ? 'bg-blue-500 hover:bg-blue-600' : ''}`}
                  >
                    <Icon className="h-4 w-4" />
                    {channel.label}
                  </Button>
                );
              })}
            </div>

            <div className="flex gap-4 items-center justify-center text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-600">From:</span>
                <Input 
                  value={fromNumber} 
                  onChange={(e) => setFromNumber(e.target.value)}
                  className="w-32 h-8 text-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">To:</span>
                <Input 
                  value={toNumber} 
                  onChange={(e) => setToNumber(e.target.value)}
                  className="w-32 h-8 text-sm"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Type a message"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button variant="outline" size="icon">
                <MessageCircle className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <ArrowDown className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                className="text-red-500 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  {action.label}
                </Button>
              ))}
            </div>

            <div className="flex gap-2 justify-center">
              <Button 
                onClick={handleCallCustomer}
                variant="outline"
                className="gap-2"
              >
                Call Customer
              </Button>
              <Button 
                variant="outline"
              >
                Clear
              </Button>
              <Button 
                onClick={handleSendMessage}
                className="bg-blue-500 hover:bg-blue-600 gap-2"
              >
                <Send className="h-4 w-4" />
                Send
              </Button>
            </div>

            <div className="text-center">
              <span className="text-xs text-gray-400">Internal Comment</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}; 