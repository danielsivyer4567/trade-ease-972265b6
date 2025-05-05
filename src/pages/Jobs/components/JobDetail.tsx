import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Mic, Coffee, PackageCheck, Share, Clock, Calendar, FileText, Box, BarChart4, MessageSquare, 
  Upload, X, Camera, PlusCircle, Trash2, Info, Edit, Save, ArrowLeft, Image as ImageIcon, CheckCircle, RotateCcw, Settings, AlertTriangle, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Job } from "@/types/job";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "sonner";
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

interface JobDetailProps {
  job: Job;
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

  return (
    <>
      <div className="w-full h-full bg-gray-100">
        {/* Map/Location header section */}
        <div className="relative h-64 bg-gray-300">
          <div className="absolute inset-0">
            {/* This would be a map component */}
            <img 
              src="https://maps.googleapis.com/maps/api/staticmap?center=-33.8688,151.2093&zoom=14&size=800x250&key=YOUR_API_KEY" 
              alt="Location map"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Customer info and action buttons */}
        <div className="bg-gray-100 p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 lowercase">{job.customer}</h1>
              <p className="text-gray-600">{job.type}</p>
              <div className="flex items-center mt-1">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500 text-white">
                  {job.status}
                </span>
                <span className="ml-2 text-sm text-gray-500">{job.date}</span>
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
          <TabsList className="grid grid-cols-5 md:grid-cols-10 bg-white border-t border-b border-gray-200">
            <TabsTrigger value="details" className="text-xs md:text-sm py-2 data-[state=active]:border-b-2 data-[state=active]:border-blue-500">
              Details
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
                        <p>{job.jobNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Customer</p>
                        <p>{job.customer}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Address</p>
                        <p>{job.address || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Type</p>
                        <p>{job.type}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Team</p>
                        <p>{job.assignedTeam || 'Not assigned'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Date</p>
                        <p>{job.date}</p>
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
                                          className="w-full h-24 object-cover" 
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
                              className="w-full h-32 object-cover cursor-pointer" 
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
            <div className="text-center py-10 text-gray-500">Financials content will be displayed here</div>
          </TabsContent>

          <TabsContent value="conversations" className="p-4">
            <div className="text-center py-10 text-gray-500">Conversations content will be displayed here</div>
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
    </>
  );
}; 