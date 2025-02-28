
import { ChangeEvent } from 'react';

export interface TeamMember {
  id: string;
  name: string;
}

export interface DocumentUploadProps {
  teamMembers: TeamMember[];
  selectedTeamMember: string;
  setSelectedTeamMember: (value: string) => void;
  jobNumber: string;
  setJobNumber: (value: string) => void;
  handleFileUpload: (event: ChangeEvent<HTMLInputElement>, type: 'insurance' | 'general' | 'jobRelated') => void;
}

export interface UploadSectionProps {
  type: 'insurance' | 'general' | 'jobRelated';
  teamMembers: TeamMember[];
  selectedTeamMember: string;
  setSelectedTeamMember: (value: string) => void;
  jobNumber?: string;
  setJobNumber?: (value: string) => void;
  handleFileUpload: (event: ChangeEvent<HTMLInputElement>, type: 'insurance' | 'general' | 'jobRelated') => void;
  uploadedFiles: File[];
  handleSubmitFiles: (type: 'insurance' | 'general' | 'jobRelated') => void;
  isSubmitting: boolean;
  isDragging: boolean;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>, type: 'insurance' | 'general' | 'jobRelated') => void;
}

export interface UploadedFileListProps {
  files: File[];
  onSubmit: () => void;
  isSubmitting: boolean;
  disabled?: boolean;
}
