
import React from 'react';
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, MapPin, RotateCw, Ruler } from 'lucide-react';
import { toast } from "sonner";

interface MapHeaderProps {
  title: string;
  description: string;
  boundaries: Array<Array<[number, number]>>;
  onReset: () => void;
  onToggleEdgeMeasurements?: () => void;
  showEdgeMeasurements?: boolean;
  measureMode?: boolean;
}

export const MapHeader: React.FC<MapHeaderProps> = ({
  title,
  description,
  boundaries,
  onReset,
  onToggleEdgeMeasurements,
  showEdgeMeasurements = false,
  measureMode = false
}) => {
  const handleCopyCoordinates = () => {
    const formattedCoordinates = boundaries.map(boundary => boundary.map(coord => `[${coord[0]}, ${coord[1]}]`).join(',\n  ')).join('\n\n');
    navigator.clipboard.writeText(`[\n  ${formattedCoordinates}\n]`);
    toast.success("Coordinates copied to clipboard");
  };
  
  return (
    <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </div>
      <div className="flex items-center gap-2 mt-4 md:mt-0">
        {boundaries.length > 0 && (
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1" 
            onClick={handleCopyCoordinates}
          >
            <Copy className="h-3.5 w-3.5" />
            <span>Copy</span>
          </Button>
        )}
        {onToggleEdgeMeasurements && (
          <Button 
            variant={showEdgeMeasurements ? "default" : "outline"} 
            size="sm" 
            className="flex items-center gap-1" 
            onClick={onToggleEdgeMeasurements}
          >
            <Ruler className="h-3.5 w-3.5" />
            <span>Measurements</span>
          </Button>
        )}
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1" 
          onClick={onReset}
        >
          <RotateCw className="h-3.5 w-3.5" />
          <span>Reset</span>
        </Button>
      </div>
    </CardHeader>
  );
};
