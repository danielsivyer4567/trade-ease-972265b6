
import React from 'react';
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, RotateCw, Ruler } from 'lucide-react';
import { toast } from "sonner";

interface MapHeaderProps {
  title: string;
  description: string;
  boundaries: Array<Array<[number, number]>>;
  onReset: () => void;
  onToggleEdgeMeasurements: () => void;
  showEdgeMeasurements: boolean;
  measureMode: boolean;
}

export const MapHeader: React.FC<MapHeaderProps> = ({
  title,
  description,
  boundaries,
  onReset,
  onToggleEdgeMeasurements,
  showEdgeMeasurements,
  measureMode
}) => {
  const handleCopyCoordinates = () => {
    const formattedCoordinates = JSON.stringify(boundaries, null, 2);
    navigator.clipboard.writeText(formattedCoordinates);
    toast.success("Coordinates copied to clipboard");
  };
  
  return (
    <CardHeader className="pb-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 pb-2">
        <div>
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline"
            size="sm"
            onClick={onToggleEdgeMeasurements}
            className="flex items-center gap-1"
            disabled={boundaries.length === 0}
          >
            <Ruler className="h-3.5 w-3.5" />
            <span>{showEdgeMeasurements ? "Hide" : "Show"} Measurements</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleCopyCoordinates}
            className="flex items-center gap-1"
            disabled={boundaries.length === 0}
          >
            <Copy className="h-3.5 w-3.5" />
            <span>Copy Coordinates</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={onReset}
            className="flex items-center gap-1"
          >
            <RotateCw className="h-3.5 w-3.5" />
            <span>Reset View</span>
          </Button>
        </div>
      </div>
    </CardHeader>
  );
};
