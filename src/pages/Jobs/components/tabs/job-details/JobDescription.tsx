import { useState } from "react";
import { FileText, Edit, X, Check, Download, Upload, FilePlus, MapPin, Clock, Briefcase, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import type { Job } from "@/types/job";

interface JobDescriptionProps {
  job: Job;
}

export const JobDescription = ({ job }: JobDescriptionProps) => {
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [descriptionText, setDescriptionText] = useState(job.description || "");
  
  // New states for additional details
  const [siteAddress, setSiteAddress] = useState(job.address || "");
  const [suburb, setSuburb] = useState(job.suburb || "");
  const [duration, setDuration] = useState(job.duration || "");
  const [jobType, setJobType] = useState(job.jobType || job.type || "");
  const [whatsInvolved, setWhatsInvolved] = useState(job.whatsInvolved || "");
  const [selectedTeam, setSelectedTeam] = useState(job.selectedTeam || job.assignedTeam || "");
  
  // Template functionality
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [showTemplateUpload, setShowTemplateUpload] = useState(false);
  const [templateFile, setTemplateFile] = useState<File | null>(null);

  const handleSaveDescription = () => {
    // In a real app, this would update the job description via an API call
    console.log("Saving description:", descriptionText);
    console.log("Additional details:", {
      siteAddress,
      suburb,
      duration,
      jobType,
      whatsInvolved,
      selectedTeam
    });
    setIsEditingDescription(false);
  };

  const handleCancelDescription = () => {
    setDescriptionText(job.description || "");
    setSiteAddress(job.address || "");
    setSuburb(job.suburb || "");
    setDuration(job.duration || "");
    setJobType(job.jobType || job.type || "");
    setWhatsInvolved(job.whatsInvolved || "");
    setSelectedTeam(job.selectedTeam || job.assignedTeam || "");
    setIsEditingDescription(false);
  };

  const handleCreateTemplate = () => {
    if (!templateName.trim()) {
      toast.error("Please enter a template name");
      return;
    }
    
    // Save template logic would go here
    const template = {
      name: templateName,
      description: descriptionText,
      siteAddress,
      suburb,
      duration,
      jobType,
      whatsInvolved,
      selectedTeam
    };
    
    console.log("Saving template:", template);
    toast.success(`Template "${templateName}" created successfully`);
    setIsTemplateDialogOpen(false);
    setTemplateName("");
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setTemplateFile(file);
      // In a real app, you would read the file and populate the fields
      toast.success(`Template file "${file.name}" uploaded successfully`);
      
      // Mock data - in a real app this would come from the file
      const reader = new FileReader();
      reader.onload = () => {
        try {
          // This is a simplified implementation - in a real app you would properly parse the file
          setDescriptionText("Template description from file: " + file.name);
        } catch (err) {
          toast.error("Failed to parse template file");
        }
      };
      reader.readAsText(file);
    }
  };

  // Get a shorter preview of the description for the button
  const shortDescription = descriptionText 
    ? (descriptionText.length > 20 ? descriptionText.substring(0, 20) + "..." : descriptionText)
    : "No description";

  return (
    <div className="rounded-lg overflow-hidden border border-gray-200 bg-white">
      <Button 
        variant="ghost" 
        className="w-full flex justify-between items-center px-3 py-2 rounded-none hover:bg-gray-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <FileText className="mr-2 h-4 w-4 text-gray-500" />
          <span className="font-medium text-sm">Job Description</span>
        </div>
        <span className="text-xs text-gray-500">{shortDescription}</span>
      </Button>
      
      {isExpanded && (
        <div className="border-t">
          {isEditingDescription ? (
            <div className="p-3 pt-2 space-y-4">
              {/* Additional fields for site details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="site-address" className="flex items-center text-sm">
                    <MapPin className="h-3.5 w-3.5 mr-1 text-gray-500" />
                    Site Address
                  </Label>
                  <Input 
                    id="site-address" 
                    value={siteAddress} 
                    onChange={(e) => setSiteAddress(e.target.value)} 
                    placeholder="Enter site address" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="suburb" className="flex items-center text-sm">
                    <MapPin className="h-3.5 w-3.5 mr-1 text-gray-500" />
                    Suburb
                  </Label>
                  <Input 
                    id="suburb" 
                    value={suburb} 
                    onChange={(e) => setSuburb(e.target.value)} 
                    placeholder="Enter suburb" 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration" className="flex items-center text-sm">
                    <Clock className="h-3.5 w-3.5 mr-1 text-gray-500" />
                    Duration
                  </Label>
                  <Input 
                    id="duration" 
                    value={duration} 
                    onChange={(e) => setDuration(e.target.value)} 
                    placeholder="e.g., 2 days, 4 hours" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="job-type" className="flex items-center text-sm">
                    <Briefcase className="h-3.5 w-3.5 mr-1 text-gray-500" />
                    Job Type
                  </Label>
                  <Input 
                    id="job-type" 
                    value={jobType} 
                    onChange={(e) => setJobType(e.target.value)} 
                    placeholder="Type of job" 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="selected-team" className="flex items-center text-sm">
                  <Users className="h-3.5 w-3.5 mr-1 text-gray-500" />
                  Selected Team
                </Label>
                <Input 
                  id="selected-team" 
                  value={selectedTeam} 
                  onChange={(e) => setSelectedTeam(e.target.value)} 
                  placeholder="Team members" 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="whats-involved" className="flex items-center text-sm">
                  <FileText className="h-3.5 w-3.5 mr-1 text-gray-500" />
                  What's Involved
                </Label>
                <Textarea 
                  id="whats-involved" 
                  value={whatsInvolved} 
                  onChange={(e) => setWhatsInvolved(e.target.value)} 
                  placeholder="Details of what's involved in the job" 
                  rows={3} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description" className="flex items-center text-sm">
                  <FileText className="h-3.5 w-3.5 mr-1 text-gray-500" />
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={descriptionText}
                  onChange={(e) => setDescriptionText(e.target.value)}
                  className="min-h-[80px] text-sm"
                  rows={4}
                />
              </div>
              
              {/* Template buttons */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsTemplateDialogOpen(true)}
                  className="h-8"
                  type="button"
                >
                  <FilePlus className="h-4 w-4 mr-1" />
                  Save as Template
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowTemplateUpload(true)}
                  className="h-8"
                  type="button"
                >
                  <Upload className="h-4 w-4 mr-1" />
                  Load Template
                </Button>
              </div>
              
              {showTemplateUpload && (
                <div className="space-y-2 p-2 border rounded border-dashed">
                  <Label htmlFor="template-file" className="text-sm">Upload Template File</Label>
                  <Input 
                    id="template-file" 
                    type="file" 
                    onChange={handleFileUpload} 
                    accept=".txt,.json" 
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowTemplateUpload(false)}
                    className="h-8 mt-1"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                </div>
              )}
              
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancelDescription}
                  className="h-8"
                  type="button"
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleSaveDescription}
                  className="h-8"
                  type="button"
                >
                  <Check className="h-4 w-4 mr-1" />
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-3 pt-2">
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-4 w-full">
                  {(siteAddress || suburb) && (
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium flex items-center">
                        <MapPin className="h-3.5 w-3.5 mr-1 text-gray-500" />
                        Site Location
                      </h4>
                      <p className="text-sm text-gray-700">
                        {siteAddress}{siteAddress && suburb && ', '}{suburb}
                      </p>
                    </div>
                  )}
                  
                  {(duration || jobType) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {duration && (
                        <div className="space-y-1">
                          <h4 className="text-sm font-medium flex items-center">
                            <Clock className="h-3.5 w-3.5 mr-1 text-gray-500" />
                            Duration
                          </h4>
                          <p className="text-sm text-gray-700">{duration}</p>
                        </div>
                      )}
                      
                      {jobType && (
                        <div className="space-y-1">
                          <h4 className="text-sm font-medium flex items-center">
                            <Briefcase className="h-3.5 w-3.5 mr-1 text-gray-500" />
                            Job Type
                          </h4>
                          <p className="text-sm text-gray-700">{jobType}</p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {selectedTeam && (
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium flex items-center">
                        <Users className="h-3.5 w-3.5 mr-1 text-gray-500" />
                        Selected Team
                      </h4>
                      <p className="text-sm text-gray-700">{selectedTeam}</p>
                    </div>
                  )}
                  
                  {whatsInvolved && (
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium flex items-center">
                        <FileText className="h-3.5 w-3.5 mr-1 text-gray-500" />
                        What's Involved
                      </h4>
                      <p className="text-sm text-gray-700">{whatsInvolved}</p>
                    </div>
                  )}
                  
                  {descriptionText && (
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium flex items-center">
                        <FileText className="h-3.5 w-3.5 mr-1 text-gray-500" />
                        Description
                      </h4>
                      <p className="text-sm text-gray-700">{descriptionText}</p>
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditingDescription(true);
                  }}
                  className="h-8 px-2 ml-2 flex-shrink-0"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Template Dialog */}
      <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save as Template</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="template-name">Template Name</Label>
              <Input 
                id="template-name" 
                value={templateName} 
                onChange={(e) => setTemplateName(e.target.value)} 
                placeholder="Enter a name for this template" 
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTemplateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTemplate}>
              Save Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
