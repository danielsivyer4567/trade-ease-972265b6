
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Send } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { FileUpload } from '@/components/tasks/FileUpload';
import { toast } from "sonner";

interface TeamMember {
  id: string;
  name: string;
}

interface DocumentUploadProps {
  teamMembers: TeamMember[];
  selectedTeamMember: string;
  setSelectedTeamMember: (value: string) => void;
  jobNumber: string;
  setJobNumber: (value: string) => void;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>, type: 'insurance' | 'general' | 'jobRelated') => void;
}

export function DocumentUpload({
  teamMembers,
  selectedTeamMember,
  setSelectedTeamMember,
  jobNumber,
  setJobNumber,
  handleFileUpload
}: DocumentUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{
    general: File[],
    insurance: File[],
    jobRelated: File[]
  }>({
    general: [],
    insurance: [],
    jobRelated: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, type: 'insurance' | 'general' | 'jobRelated') => {
    e.preventDefault();
    setIsDragging(false);
    
    if (type === 'jobRelated' && !jobNumber) {
      toast.error("Please enter a job number first");
      return;
    }
    
    const files = Array.from(e.dataTransfer.files);
    
    if (files.length > 0) {
      // Store uploaded files in state
      setUploadedFiles(prev => ({
        ...prev,
        [type]: [...prev[type], ...files]
      }));
      
      // Create a synthetic event to match the onChange interface
      const event = {
        target: {
          files: files as unknown as FileList
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      
      handleFileUpload(event, type);
      toast.success(`${files.length} file(s) uploaded successfully`);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'insurance' | 'general' | 'jobRelated') => {
    if (type === 'jobRelated' && !jobNumber) {
      toast.error("Please enter a job number first");
      return;
    }
    
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      
      // Store uploaded files in state
      setUploadedFiles(prev => ({
        ...prev,
        [type]: [...prev[type], ...files]
      }));
      
      handleFileUpload(e, type);
      toast.success(`${e.target.files.length} file(s) uploaded successfully`);
    }
  };

  const handleSubmitFiles = (type: 'insurance' | 'general' | 'jobRelated') => {
    setIsSubmitting(true);
    
    // Validation
    if (type === 'jobRelated' && !jobNumber) {
      toast.error("Please enter a job number first");
      setIsSubmitting(false);
      return;
    }
    
    if (!selectedTeamMember) {
      toast.error("Please select a team member to notify");
      setIsSubmitting(false);
      return;
    }
    
    if (uploadedFiles[type].length === 0) {
      toast.error("No files have been uploaded");
      setIsSubmitting(false);
      return;
    }
    
    // Simulate processing the files
    setTimeout(() => {
      const memberName = teamMembers.find(m => m.id === selectedTeamMember)?.name || "team member";
      
      let successMessage = "";
      switch(type) {
        case 'general':
          successMessage = `${uploadedFiles[type].length} general document(s) processed and sent to ${memberName}`;
          break;
        case 'insurance':
          successMessage = `${uploadedFiles[type].length} insurance document(s) processed and sent to ${memberName}`;
          break;
        case 'jobRelated':
          successMessage = `${uploadedFiles[type].length} job-related document(s) for job #${jobNumber} processed and sent to ${memberName}`;
          break;
      }
      
      toast.success(successMessage);
      
      // Clear the uploaded files for this type
      setUploadedFiles(prev => ({
        ...prev,
        [type]: []
      }));
      
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-3 text-zinc-950">Document Upload</h3>
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="insurance">Insurance</TabsTrigger>
          <TabsTrigger value="job">Job Related</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <div 
            className={`border rounded-lg p-4 ${isDragging ? 'bg-gray-50 border-blue-400' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, 'general')}
          >
            <h4 className="font-medium text-gray-700 mb-2">General Documents</h4>
            <select 
              className="w-full rounded-md border border-input bg-background px-3 h-10 mb-4" 
              value={selectedTeamMember} 
              onChange={e => setSelectedTeamMember(e.target.value)}
            >
              <option value="">Select team member to notify</option>
              {teamMembers.map(member => (
                <option key={member.id} value={member.id}>{member.name}</option>
              ))}
            </select>
            <FileUpload
              onFileUpload={(e) => handleFileInputChange(e, 'general')}
              label="Drag and drop files or click to upload"
            />
            {uploadedFiles.general.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700">{uploadedFiles.general.length} file(s) ready to submit</p>
                <ul className="text-xs text-gray-500 mt-1 mb-3 max-h-20 overflow-y-auto">
                  {uploadedFiles.general.map((file, index) => (
                    <li key={index} className="truncate">{file.name} ({Math.round(file.size / 1024)} KB)</li>
                  ))}
                </ul>
                <Button 
                  className="w-full" 
                  onClick={() => handleSubmitFiles('general')}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : "Process Uploaded Files"} <Send className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
            <p className="text-xs text-gray-500 mt-2">
              Supported formats: PDF, DOC, DOCX, JPG, JPEG, PNG, MP4, MOV. Max file size: 100MB
            </p>
          </div>
        </TabsContent>

        <TabsContent value="insurance" className="space-y-4">
          <div 
            className={`border rounded-lg p-4 ${isDragging ? 'bg-gray-50 border-blue-400' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, 'insurance')}
          >
            <h4 className="font-medium text-gray-700 mb-2">Insurance Documents</h4>
            <select 
              className="w-full rounded-md border border-input bg-background px-3 h-10 mb-4" 
              value={selectedTeamMember} 
              onChange={e => setSelectedTeamMember(e.target.value)}
            >
              <option value="">Select team member to notify</option>
              {teamMembers.map(member => (
                <option key={member.id} value={member.id}>{member.name}</option>
              ))}
            </select>
            <FileUpload
              onFileUpload={(e) => handleFileInputChange(e, 'insurance')}
              label="Drag and drop files or click to upload"
            />
            {uploadedFiles.insurance.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700">{uploadedFiles.insurance.length} file(s) ready to submit</p>
                <ul className="text-xs text-gray-500 mt-1 mb-3 max-h-20 overflow-y-auto">
                  {uploadedFiles.insurance.map((file, index) => (
                    <li key={index} className="truncate">{file.name} ({Math.round(file.size / 1024)} KB)</li>
                  ))}
                </ul>
                <Button 
                  className="w-full" 
                  onClick={() => handleSubmitFiles('insurance')}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : "Process Uploaded Files"} <Send className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
            <p className="text-xs text-gray-500 mt-2">
              Supported formats: PDF, DOC, DOCX. Max file size: 100MB
            </p>
          </div>
        </TabsContent>

        <TabsContent value="job" className="space-y-4">
          <div 
            className={`border rounded-lg p-4 ${isDragging ? 'bg-gray-50 border-blue-400' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, 'jobRelated')}
          >
            <h4 className="font-medium text-gray-700 mb-2">Job Related Files</h4>
            <div className="space-y-4">
              <Input 
                type="text" 
                placeholder="Enter Job Number" 
                value={jobNumber} 
                onChange={e => setJobNumber(e.target.value)} 
                className="mb-4" 
              />
              <select 
                className="w-full rounded-md border border-input bg-background px-3 h-10 mb-4" 
                value={selectedTeamMember} 
                onChange={e => setSelectedTeamMember(e.target.value)}
              >
                <option value="">Select team member to notify</option>
                {teamMembers.map(member => (
                  <option key={member.id} value={member.id}>{member.name}</option>
                ))}
              </select>
              <FileUpload
                onFileUpload={(e) => handleFileInputChange(e, 'jobRelated')}
                label="Drag and drop files or click to upload"
              />
              {uploadedFiles.jobRelated.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700">{uploadedFiles.jobRelated.length} file(s) ready to submit</p>
                  <ul className="text-xs text-gray-500 mt-1 mb-3 max-h-20 overflow-y-auto">
                    {uploadedFiles.jobRelated.map((file, index) => (
                      <li key={index} className="truncate">{file.name} ({Math.round(file.size / 1024)} KB)</li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full" 
                    onClick={() => handleSubmitFiles('jobRelated')}
                    disabled={isSubmitting || !jobNumber}
                  >
                    {isSubmitting ? "Processing..." : "Process Uploaded Files"} <Send className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-2">
                Supported formats: PDF, DOC, DOCX, JPG, JPEG, PNG, MP4, MOV. Max file size: 100MB
              </p>
              {!jobNumber && <p className="text-sm text-red-500">Please enter a job number first</p>}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
