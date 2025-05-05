import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  FileText, 
  Calendar, 
  Clock, 
  Box, 
  MessageSquare, 
  BarChart4, 
  Settings, 
  Check,
  Trash2,
  Info,
  Edit,
  Upload,
  Camera
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Job } from "@/types/job";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import JobMap from "@/components/JobMap";

interface JobDetailProps {
  job: Job;
}

type JobPhoto = {
  id: string;
  url: string;
  caption: string;
  dateAdded: string;
  section?: string;
};

export const SimpleJobDetail = ({ job }: JobDetailProps) => {
  const [activeTab, setActiveTab] = useState("details");
  const [showProcessSettingsDialog, setShowProcessSettingsDialog] = useState(false);
  const [maxSteps, setMaxSteps] = useState(5);
  const [requireAllSteps, setRequireAllSteps] = useState(false);
  
  // Photo management
  const [selectedPhoto, setSelectedPhoto] = useState<JobPhoto | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [photoCaption, setPhotoCaption] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Sample photos state - in a real implementation, this would be loaded from the job data
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
    },
    {
      id: "p4",
      url: "https://images.unsplash.com/photo-1503387837-b154d5074bd2",
      caption: "Exterior wiring",
      dateAdded: "2023-03-16",
    },
    {
      id: "p5",
      url: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4",
      caption: "Completed installation",
      dateAdded: "2023-03-17",
    }
  ]);
  
  // Function to save process settings
  const saveProcessSettings = () => {
    // Here we would typically save settings to backend
    toast.success("Process settings saved successfully");
    setShowProcessSettingsDialog(false);
  };
  
  // Function to handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
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
      };
    });
    
    // Add to photos collection
    setPhotos(prev => [...prev, ...newPhotos]);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    
    toast.success(`${newPhotos.length} photo${newPhotos.length > 1 ? 's' : ''} uploaded successfully`);
  };
  
  // Function to remove a photo
  const removePhoto = (photoId: string) => {
    setPhotos(prev => prev.filter(photo => photo.id !== photoId));
    if (selectedPhoto?.id === photoId) {
      setSelectedPhoto(null);
    }
    toast.success("Photo removed");
  };
  
  // Function to update photo caption
  const updatePhotoCaption = (photoId: string, caption: string) => {
    setPhotos(prev => prev.map(photo => 
      photo.id === photoId ? { ...photo, caption } : photo
    ));
    
    setSelectedPhoto(null);
    toast.success("Photo caption updated");
  };
  
  return (
    <div className="w-full h-full bg-gray-100">
      {/* Map/Location header section */}
      <div className="relative h-64 bg-gray-300">
        <div className="absolute inset-0">
          {/* Real Google Maps component instead of static image */}
          <JobMap 
            jobs={[job]}
            center={job.location}
            zoom={15}
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
            
            {/* Job address information */}
            <div className="mt-3 text-sm text-gray-600">
              <p>
                <strong>Address:</strong> {job.address || 'N/A'}
                {job.city && job.state && job.zipCode && (
                  <span>, {job.city}, {job.state} {job.zipCode}</span>
                )}
              </p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center"
              onClick={() => setShowProcessSettingsDialog(true)}
            >
              <Settings className="h-4 w-4 mr-1" /> Process Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 md:grid-cols-7 bg-white border-t border-b border-gray-200">
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
          <TabsTrigger value="financials" className="text-xs md:text-sm py-2 data-[state=active]:border-b-2 data-[state=active]:border-blue-500">
            <BarChart4 className="h-4 w-4 md:mr-1 md:inline hidden" /> Financials
          </TabsTrigger>
          <TabsTrigger value="conversations" className="text-xs md:text-sm py-2 data-[state=active]:border-b-2 data-[state=active]:border-blue-500">
            <MessageSquare className="h-4 w-4 md:mr-1 md:inline hidden" /> Conversations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
            
            <Card>
              <CardHeader>
                <CardTitle>Job Process</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {job.job_steps && job.job_steps.length > 0 ? (
                    job.job_steps.map((step, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          step.isCompleted ? 'bg-green-500 text-white' : 'border border-gray-300'
                        }`}>
                          {step.isCompleted && '✓'}
                        </div>
                        <span>{step.title}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No process steps defined for this job</p>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Photos Gallery */}
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>Photos Gallery</CardTitle>
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
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Site (Audit) Photos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div 
                      key={`site-${i}`} 
                      className="relative group rounded-md overflow-hidden border border-gray-200"
                    >
                      <img 
                        src={`https://source.unsplash.com/random/300x200?site,${i}`} 
                        alt={`Site (Audit) photo ${i}`} 
                        className="w-full h-32 object-cover" 
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-1">
                        <p className="text-xs text-white truncate">{`Site photo ${i}`}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notes" className="p-4">
          <div className="text-center py-10 text-gray-500">
            Notes content will be displayed here.
          </div>
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

        <TabsContent value="financials" className="p-4">
          <div className="text-center py-10 text-gray-500">Financials content will be displayed here</div>
        </TabsContent>

        <TabsContent value="conversations" className="p-4">
          <div className="text-center py-10 text-gray-500">Conversations content will be displayed here</div>
        </TabsContent>
      </Tabs>
      
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
                  
                  <div className="flex justify-end space-x-2 pt-2">
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
                        removePhoto(selectedPhoto.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Process Settings Dialog */}
      <Dialog open={showProcessSettingsDialog} onOpenChange={setShowProcessSettingsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Job Process Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="max-steps">Maximum Number of Steps</Label>
              <Input
                id="max-steps"
                type="number"
                min={1}
                max={20}
                value={maxSteps}
                onChange={(e) => setMaxSteps(parseInt(e.target.value))}
              />
              <p className="text-sm text-gray-500">Maximum 20 steps allowed</p>
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="require-all-steps">Require All Steps to Complete Job</Label>
              <Switch
                id="require-all-steps"
                checked={requireAllSteps}
                onCheckedChange={setRequireAllSteps}
              />
            </div>
            
            <div className="pt-4 flex justify-end">
              <Button onClick={saveProcessSettings} className="w-full">
                <Check className="h-4 w-4 mr-1" /> Save Settings
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}; 