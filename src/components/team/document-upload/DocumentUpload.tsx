
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { GeneralDocumentUpload } from './GeneralDocumentUpload';
import { InsuranceDocumentUpload } from './InsuranceDocumentUpload';
import { JobRelatedDocumentUpload } from './JobRelatedDocumentUpload';
import { useIsMobile } from '@/hooks/use-mobile';
import { DocumentUploadProps } from './types';

export const DocumentUpload: React.FC<DocumentUploadProps> = ({ 
  teamMembers, 
  selectedTeamMember, 
  setSelectedTeamMember,
  jobNumber,
  setJobNumber,
  handleFileUpload 
}) => {
  const [activeTab, setActiveTab] = useState('general');
  const isMobile = useIsMobile();
  
  // State for file uploads
  const [generalFiles, setGeneralFiles] = useState<File[]>([]);
  const [insuranceFiles, setInsuranceFiles] = useState<File[]>([]);
  const [jobRelatedFiles, setJobRelatedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [extractedText, setExtractedText] = useState<string>('');

  // Handle file upload with type
  const handleLocalFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'insurance' | 'general' | 'jobRelated') => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      
      // Update local state
      if (type === 'general') {
        setGeneralFiles([...generalFiles, ...newFiles]);
      } else if (type === 'insurance') {
        setInsuranceFiles([...insuranceFiles, ...newFiles]);
      } else if (type === 'jobRelated') {
        setJobRelatedFiles([...jobRelatedFiles, ...newFiles]);
      }
      
      // Call parent handler
      handleFileUpload(e, type);
    }
  };

  // Handle drag events
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
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      
      if (type === 'general') {
        setGeneralFiles([...generalFiles, ...newFiles]);
      } else if (type === 'insurance') {
        setInsuranceFiles([...insuranceFiles, ...newFiles]);
      } else if (type === 'jobRelated') {
        setJobRelatedFiles([...jobRelatedFiles, ...newFiles]);
      }
      
      // Create a synthetic event to pass to the parent handler
      const syntheticEvent = {
        target: {
          files: e.dataTransfer.files
        }
      } as React.ChangeEvent<HTMLInputElement>;
      
      handleFileUpload(syntheticEvent, type);
    }
  };

  // Handle file submissions
  const handleSubmitFiles = (type: 'insurance' | 'general' | 'jobRelated') => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      if (type === 'general') {
        setGeneralFiles([]);
      } else if (type === 'insurance') {
        setInsuranceFiles([]);
      } else if (type === 'jobRelated') {
        setJobRelatedFiles([]);
      }
      setIsSubmitting(false);
    }, 1500);
  };

  // Handle file deletion
  const handleDeleteFile = (index: number, type: 'insurance' | 'general' | 'jobRelated') => {
    if (type === 'general') {
      const updatedFiles = [...generalFiles];
      updatedFiles.splice(index, 1);
      setGeneralFiles(updatedFiles);
    } else if (type === 'insurance') {
      const updatedFiles = [...insuranceFiles];
      updatedFiles.splice(index, 1);
      setInsuranceFiles(updatedFiles);
    } else if (type === 'jobRelated') {
      const updatedFiles = [...jobRelatedFiles];
      updatedFiles.splice(index, 1);
      setJobRelatedFiles(updatedFiles);
    }
  };
  
  return (
    <div className={`w-full ${isMobile ? 'p-2' : 'p-4'} bg-white rounded-lg shadow-md`}>
      <h2 className={`${isMobile ? 'text-lg mb-2' : 'text-xl mb-4'} font-semibold text-gray-800`}>
        Document Management
      </h2>
      
      <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className={`grid ${isMobile ? 'grid-cols-1 gap-1' : 'grid-cols-3'} w-full mb-4`}>
          <TabsTrigger value="general" className={`${isMobile ? 'py-1' : 'py-2'}`}>
            General Documents
          </TabsTrigger>
          <TabsTrigger value="insurance" className={`${isMobile ? 'py-1' : 'py-2'}`}>
            Insurance
          </TabsTrigger>
          <TabsTrigger value="job" className={`${isMobile ? 'py-1' : 'py-2'}`}>
            Job Related
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <GeneralDocumentUpload 
            type="general"
            teamMembers={teamMembers}
            selectedTeamMember={selectedTeamMember}
            setSelectedTeamMember={setSelectedTeamMember}
            handleFileUpload={handleLocalFileUpload}
            uploadedFiles={generalFiles}
            handleSubmitFiles={handleSubmitFiles}
            isSubmitting={isSubmitting}
            isDragging={isDragging}
            handleDragOver={handleDragOver}
            handleDragLeave={handleDragLeave}
            handleDrop={handleDrop}
            handleDeleteFile={(index) => handleDeleteFile(index, 'general')}
          />
        </TabsContent>
        
        <TabsContent value="insurance" className="space-y-4">
          <InsuranceDocumentUpload 
            type="insurance"
            teamMembers={teamMembers}
            selectedTeamMember={selectedTeamMember}
            setSelectedTeamMember={setSelectedTeamMember}
            handleFileUpload={handleLocalFileUpload}
            uploadedFiles={insuranceFiles}
            handleSubmitFiles={handleSubmitFiles}
            isSubmitting={isSubmitting}
            isDragging={isDragging}
            handleDragOver={handleDragOver}
            handleDragLeave={handleDragLeave}
            handleDrop={handleDrop}
            handleDeleteFile={(index) => handleDeleteFile(index, 'insurance')}
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
            handleFileUpload={handleLocalFileUpload}
            uploadedFiles={jobRelatedFiles}
            handleSubmitFiles={handleSubmitFiles}
            isSubmitting={isSubmitting}
            isDragging={isDragging}
            handleDragOver={handleDragOver}
            handleDragLeave={handleDragLeave}
            handleDrop={handleDrop}
            extractedText={extractedText}
            setExtractedText={setExtractedText}
            handleDeleteFile={(index) => handleDeleteFile(index, 'jobRelated')}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
