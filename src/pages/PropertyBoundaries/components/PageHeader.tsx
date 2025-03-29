
import React from 'react';
import { Button } from "@/components/ui/button";
import { Upload as UploadIcon, Plus } from 'lucide-react';

interface PageHeaderProps {
  onFileUploadClick: () => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ onFileUploadClick }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
      <div>
        <h1 className="text-2xl font-bold">Property Boundary Viewer</h1>
        <p className="text-muted-foreground">View and measure property boundaries for job sites</p>
      </div>
      
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={onFileUploadClick}
          className="flex items-center gap-1"
        >
          <UploadIcon className="h-4 w-4" />
          <span>Upload GeoJSON</span>
        </Button>
        
        <Button 
          variant="default" 
          size="sm"
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          <span>New Boundary</span>
        </Button>
      </div>
    </div>
  );
};
