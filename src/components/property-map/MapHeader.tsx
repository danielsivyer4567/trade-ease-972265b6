
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
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </div>
      <div className="flex space-x-2">
        {onToggleEdgeMeasurements && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onToggleEdgeMeasurements}
            className={showEdgeMeasurements ? "bg-blue-50" : ""}
          >
            <Ruler className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Measurements</span>
          </Button>
        )}
        <Button variant="outline" size="sm" onClick={handleCopyCoordinates}>
          <Copy className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline">Copy</span>
        </Button>
        <Button variant="outline" size="sm" onClick={onReset}>
          <RotateCw className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline">Reset</span>
        </Button>
      </div>
    </CardHeader>
  );
};
