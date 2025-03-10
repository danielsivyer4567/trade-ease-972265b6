
import React from 'react';
import { FileUpload } from '@/components/tasks/FileUpload';
import { UploadSectionProps } from './types';
import { UploadedFileList } from './UploadedFileList';

export function InsuranceDocumentUpload({
  type,
  teamMembers,
  selectedTeamMember,
  setSelectedTeamMember,
  handleFileUpload,
  uploadedFiles,
  handleSubmitFiles,
  isSubmitting,
  isDragging,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  handleDeleteFile
}: UploadSectionProps) {
  return (
    <div 
      className={`border-2 border-black rounded-lg p-4 ${isDragging ? 'bg-gray-50 border-blue-400' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={(e) => handleDrop(e, type)}
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
        onFileUpload={(e) => handleFileUpload(e, type)}
        label="Drag and drop files or click to upload"
      />
      <UploadedFileList 
        files={uploadedFiles}
        onSubmit={() => handleSubmitFiles(type)}
        isSubmitting={isSubmitting}
        onDeleteFile={handleDeleteFile}
      />
      <p className="text-xs text-gray-500 mt-2">
        Supported formats: PDF, DOC, DOCX. Max file size: 100MB
      </p>
    </div>
  );
}
