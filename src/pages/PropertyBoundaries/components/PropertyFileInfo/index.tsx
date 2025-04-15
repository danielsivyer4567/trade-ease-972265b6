
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface PropertyFileInfoProps {
  file: File;
  onRemove: () => void;
}

export const PropertyFileInfo: React.FC<PropertyFileInfoProps> = ({ file, onRemove }) => {
  return (
    <div className="flex items-center justify-between bg-secondary/20 p-2 rounded-md mb-4">
      <span className="text-sm text-muted-foreground truncate">{file.name}</span>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onRemove}
        className="h-6 w-6"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};
