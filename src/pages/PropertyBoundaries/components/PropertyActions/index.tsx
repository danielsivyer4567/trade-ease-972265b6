
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileUp, Ruler } from 'lucide-react';

interface PropertyActionsProps {
  isMeasuring: boolean;
  onToggleMeasurement: () => void;
  onUploadClick?: () => void;
}

export const PropertyActions: React.FC<PropertyActionsProps> = ({
  isMeasuring,
  onToggleMeasurement,
  onUploadClick
}) => {
  return (
    <div className="flex flex-col gap-2">
      <Button variant="outline" className="w-full justify-start gap-2" onClick={onUploadClick}>
        <FileUp className="h-4 w-4" />
        Upload Property
      </Button>
      <Button 
        variant={isMeasuring ? "default" : "outline"} 
        className="w-full justify-start gap-2"
        onClick={onToggleMeasurement}
      >
        <Ruler className="h-4 w-4" />
        {isMeasuring ? "Stop Measuring" : "Measure"}
      </Button>
    </div>
  );
};
