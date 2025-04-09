
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
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </div>
      <div className="flex space-x-2">
        {boundaries.length > 0 && (
          <Button variant="outline" size="sm" onClick={handleCopyCoordinates}>
            <Copy className="h-4 w-4 mr-2" />
            Copy Coordinates
          </Button>
        )}
        <Button variant="outline" size="sm" onClick={onReset}>
          <RotateCw className="h-4 w-4 mr-2" />
          Reset View
        </Button>
        {measureMode && (
          <Button 
            variant={showEdgeMeasurements ? "default" : "outline"} 
            size="sm" 
            onClick={onToggleEdgeMeasurements}
          >
            <Ruler className="h-4 w-4 mr-2" />
            {showEdgeMeasurements ? "Hide Measurements" : "Show Measurements"}
          </Button>
        )}
      </div>
    </CardHeader>
  );
};
