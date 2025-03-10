
import { FileWithPreview } from '@/components/tasks/types';

export interface TeamMember {
  id: string;
  name: string;
}

export interface DocumentUploadProps {
  teamMembers: TeamMember[];
  selectedTeamMember: string;
  setSelectedTeamMember: (id: string) => void;
  jobNumber?: string;
  setJobNumber?: (jobNumber: string) => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>, type: 'insurance' | 'general' | 'jobRelated') => void;
}

export interface UploadSectionProps {
  type: 'insurance' | 'general' | 'jobRelated';
  teamMembers: TeamMember[];
  selectedTeamMember: string;
  setSelectedTeamMember: (id: string) => void;
  jobNumber?: string;
  setJobNumber?: (jobNumber: string) => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>, type: 'insurance' | 'general' | 'jobRelated') => void;
  uploadedFiles: File[];
  handleSubmitFiles: (type: 'insurance' | 'general' | 'jobRelated') => void;
  isSubmitting: boolean;
  isDragging: boolean;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>, type: 'insurance' | 'general' | 'jobRelated') => void;
  extractedText?: string;
  setExtractedText?: (text: string) => void;
}
