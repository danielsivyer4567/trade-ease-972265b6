
import React from 'react';
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Copy, RotateCw, Ruler } from 'lucide-react';
import { toast } from "sonner";

interface MapHeaderProps {
  title: string;
  description: string;
  boundaries: Array<Array<[number, number]>>;
  onReset: () => void;
  measureMode?: boolean;
}

export const MapHeader: React.FC<MapHeaderProps> = ({
  title,
  description,
  boundaries,
  onReset,
  measureMode = false
}) => {
  const handleCopyCoordinates = () => {
    const formattedCoordinates = boundaries.map(boundary => 
      boundary.map(coord => `[${coord[0]}, ${coord[1]}]`).join(',\n  ')
    ).join('\n\n');
    
    navigator.clipboard.writeText(`[\n  ${formattedCoordinates}\n]`);
    toast.success("Coordinates copied to clipboard");
  };
  
  return (
    <CardHeader>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
        <div>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            {title}
            {measureMode && (
              <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                <Ruler className="h-3 w-3 mr-1" />
                Measuring
              </span>
            )}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleCopyCoordinates}
            className="flex items-center gap-1"
          >
            <Copy className="h-4 w-4" />
            <span>Copy Coordinates</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={onReset}
            className="flex items-center gap-1"
          >
            <RotateCw className="h-4 w-4" />
            <span>Reset View</span>
          </Button>
        </div>
      </div>
    </CardHeader>
  );
};
