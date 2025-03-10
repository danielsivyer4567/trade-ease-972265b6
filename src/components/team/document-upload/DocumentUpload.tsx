
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import { DocumentUploadProps } from './types';
import { GeneralDocumentUpload } from './GeneralDocumentUpload';
import { InsuranceDocumentUpload } from './InsuranceDocumentUpload';
import { JobRelatedDocumentUpload } from './JobRelatedDocumentUpload';

export function DocumentUpload({
  teamMembers,
  selectedTeamMember,
  setSelectedTeamMember,
  jobNumber,
  setJobNumber,
  handleFileUpload
}: DocumentUploadProps) {
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  const [extractedText, setExtractedText] = useState<string>("");
  const [uploadedFiles, setUploadedFiles] = useState<{
    general: File[];
    insurance: File[];
    jobRelated: File[];
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
      switch (type) {
        case 'general':
          successMessage = `${uploadedFiles[type].length} general document(s) processed and sent to ${memberName}`;
          break;
        case 'insurance':
          successMessage = `${uploadedFiles[type].length} insurance document(s) processed and sent to ${memberName}`;
          break;
        case 'jobRelated':
          // For job-related files, create a job note with the uploaded files
          const mockJobs = [{
            id: "1",
            jobNumber: "PLM-001",
            title: "Water Heater Installation"
          }, {
            id: "2",
            jobNumber: "HVAC-001",
            title: "HVAC Maintenance"
          }, {
            id: "3",
            jobNumber: "ELE-001",
            title: "Electrical Panel Upgrade"
          }];

          // Find job by job number
          const job = mockJobs.find(j => j.jobNumber === jobNumber);
          if (job) {
            // Create a note for the job containing file information
            const fileNames = uploadedFiles[type].map(file => file.name).join(", ");

            // Create job note entry in local storage
            const existingNotes = localStorage.getItem(`job_notes_${job.id}`);
            const parsedNotes = existingNotes ? JSON.parse(existingNotes) : [];
            const newNote = {
              id: Date.now().toString(),
              text: `Files uploaded by ${memberName}: ${fileNames}${extractedText ? `\n\nExtracted Text:\n${extractedText}` : ''}`,
              timestamp: new Date().toLocaleString(),
              important: true,
              files: uploadedFiles[type].map(file => ({
                name: file.name,
                size: file.size,
                type: file.type,
                lastModified: file.lastModified
              }))
            };
            const updatedNotes = [...parsedNotes, newNote];
            localStorage.setItem(`job_notes_${job.id}`, JSON.stringify(updatedNotes));
            successMessage = `${uploadedFiles[type].length} file(s) processed, added to job #${jobNumber} notes, and sent to ${memberName}`;

            toast.success("Files uploaded to job #" + jobNumber, {
              action: {
                label: "View Job",
                onClick: () => navigate(`/jobs/${job.id}`)
              },
              duration: 10000 // Show for 10 seconds
            });
          } else {
            successMessage = `${uploadedFiles[type].length} job-related document(s) for job #${jobNumber} processed and sent to ${memberName}`;
          }
          break;
      }
      toast.success(successMessage);

      // Clear the uploaded files for this type
      setUploadedFiles(prev => ({
        ...prev,
        [type]: []
      }));
      
      // Clear extracted text after submission
      if (type === 'jobRelated') {
        setExtractedText("");
      }
      
      setIsSubmitting(false);
    }, 1500);
  };
  
  return (
    <Card className="p-4 bg-slate-200">
      <h3 className="text-lg font-semibold mb-3 text-zinc-950">Document Upload</h3>
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 bg-slate-400">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="insurance">Insurance</TabsTrigger>
          <TabsTrigger value="job">Job Related</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <GeneralDocumentUpload 
            type="general" 
            teamMembers={teamMembers} 
            selectedTeamMember={selectedTeamMember} 
            setSelectedTeamMember={setSelectedTeamMember} 
            handleFileUpload={handleFileInputChange} 
            uploadedFiles={uploadedFiles.general} 
            handleSubmitFiles={handleSubmitFiles} 
            isSubmitting={isSubmitting} 
            isDragging={isDragging} 
            handleDragOver={handleDragOver} 
            handleDragLeave={handleDragLeave} 
            handleDrop={handleDrop} 
          />
        </TabsContent>

        <TabsContent value="insurance" className="space-y-4">
          <InsuranceDocumentUpload 
            type="insurance" 
            teamMembers={teamMembers} 
            selectedTeamMember={selectedTeamMember} 
            setSelectedTeamMember={setSelectedTeamMember} 
            handleFileUpload={handleFileInputChange} 
            uploadedFiles={uploadedFiles.insurance} 
            handleSubmitFiles={handleSubmitFiles} 
            isSubmitting={isSubmitting} 
            isDragging={isDragging} 
            handleDragOver={handleDragOver} 
            handleDragLeave={handleDragLeave} 
            handleDrop={handleDrop} 
          />
        </TabsContent>

        <TabsContent value="job" className="space-y-4">
          <JobRelatedDocumentUpload 
            type="jobRelated" 
            teamMembers={teamMembers} 
            selectedTeamMember={selectedTeamMember} 
            setSelectedTeamMember={setSelectedTeamMember} 
            jobNumber={jobNumber} 
            setJobNumber={setJobNumber} 
            handleFileUpload={handleFileInputChange} 
            uploadedFiles={uploadedFiles.jobRelated} 
            handleSubmitFiles={handleSubmitFiles} 
            isSubmitting={isSubmitting} 
            isDragging={isDragging} 
            handleDragOver={handleDragOver} 
            handleDragLeave={handleDragLeave} 
            handleDrop={handleDrop}
            extractedText={extractedText}
            setExtractedText={setExtractedText}
          />
        </TabsContent>
      </Tabs>
    </Card>
  );
}
