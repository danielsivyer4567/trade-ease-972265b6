
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface PropertyFileInfoProps {
  file: File;
  onRemove: () => void;
}

export const PropertyFileInfo: React.FC<PropertyFileInfoProps> = ({
  file,
  onRemove
}) => {
  return (
    <div className="bg-secondary/20 p-3 rounded-md mb-4">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="font-medium text-sm">Uploaded File</h4>
          <p className="text-xs text-muted-foreground truncate max-w-[180px]">
            {file.name}
          </p>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onRemove}
          className="h-7 w-7"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
