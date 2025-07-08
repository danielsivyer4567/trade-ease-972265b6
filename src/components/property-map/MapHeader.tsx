import React from 'react';
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, RotateCcw, Ruler, Map } from 'lucide-react';
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
    <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            <Map className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-xl font-semibold text-gray-900">{title}</CardTitle>
            <CardDescription className="text-gray-600">{description}</CardDescription>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {boundaries.length > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleCopyCoordinates}
              className="bg-white hover:bg-gray-50 border-gray-200 text-gray-700 hover:text-gray-900"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Coordinates
            </Button>
          )}
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onReset}
            className="bg-white hover:bg-gray-50 border-gray-200 text-gray-700 hover:text-gray-900"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset View
          </Button>
          
          {measureMode && (
            <Button 
              variant={showEdgeMeasurements ? "default" : "outline"} 
              size="sm" 
              onClick={onToggleEdgeMeasurements}
              className={showEdgeMeasurements 
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-white hover:bg-gray-50 border-gray-200 text-gray-700 hover:text-gray-900"
              }
            >
              <Ruler className="h-4 w-4 mr-2" />
              {showEdgeMeasurements ? "Hide Measurements" : "Show Measurements"}
            </Button>
          )}
        </div>
      </div>
    </CardHeader>
  );
};
