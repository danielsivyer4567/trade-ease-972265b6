
import React from 'react';
import { FileUpload } from '@/components/tasks/FileUpload';
import { Input } from '@/components/ui/input';
import { UploadSectionProps } from './types';
import { UploadedFileList } from './UploadedFileList';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export function JobRelatedDocumentUpload({
  type,
  teamMembers,
  selectedTeamMember,
  setSelectedTeamMember,
  jobNumber = '',
  setJobNumber,
  handleFileUpload,
  uploadedFiles,
  handleSubmitFiles,
  isSubmitting,
  isDragging,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  extractedText,
  setExtractedText
}: UploadSectionProps & {
  extractedText?: string;
  setExtractedText?: (text: string) => void;
}) {
  const handleTextExtracted = (text: string, filename: string) => {
    if (setExtractedText) {
      setExtractedText(text);
    }
  };

  return (
    <div 
      className={`border-2 border-black rounded-lg p-4 ${isDragging ? 'bg-gray-50 border-blue-400' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={(e) => handleDrop(e, type)}
    >
      <h4 className="font-medium text-gray-700 mb-2">Job Related Files</h4>
      <div className="space-y-4">
        <Input 
          type="text" 
          placeholder="Enter Job Number" 
          value={jobNumber} 
          onChange={e => setJobNumber?.(e.target.value)} 
          className="mb-4 border-2 border-black" 
        />
        <select 
          className="w-full rounded-md border-2 border-black bg-background px-3 h-10 mb-4" 
          value={selectedTeamMember} 
          onChange={e => setSelectedTeamMember(e.target.value)}
        >
          <option value="">Select team member to notify</option>
          {teamMembers.map(member => (
            <option key={member.id} value={member.id}>{member.name}</option>
          ))}
        </select>
        
        <FileUpload
          onFileUpload={(e) => handleFileUpload(e, type)}
          label="Drag and drop files or click to upload"
          allowGcpVision={true}
          onTextExtracted={handleTextExtracted}
        />
        
        {extractedText && (
          <div className="mt-4">
            <Label htmlFor="extractedText">Extracted Text:</Label>
            <Textarea
              id="extractedText"
              value={extractedText}
              onChange={(e) => setExtractedText?.(e.target.value)}
              className="w-full min-h-[100px] mt-1"
              placeholder="Extracted text from document..."
            />
          </div>
        )}
        
        <UploadedFileList 
          files={uploadedFiles}
          onSubmit={() => handleSubmitFiles(type)}
          isSubmitting={isSubmitting}
          disabled={!jobNumber}
        />
        <p className="text-xs text-gray-500 mt-2">
          Supported formats: PDF, DOC, DOCX, JPG, JPEG, PNG, MP4, MOV. Max file size: 100MB
        </p>
        {!jobNumber && <p className="text-sm text-red-500">Please enter a job number first</p>}
      </div>
    </div>
  );
}
