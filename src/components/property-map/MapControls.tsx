
import React from 'react';
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, RotateCw, Move, Smartphone, Ruler } from 'lucide-react';

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  measureMode?: boolean;
}

export const MapControls: React.FC<MapControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onReset,
  measureMode = false
}) => {
  return (
    <div className="absolute bottom-4 right-4 flex flex-col gap-2">
      <Button 
        variant="outline" 
        size="icon" 
        className="bg-white shadow-md h-10 w-10 hover:bg-primary/10"
        onClick={onZoomIn}
        aria-label="Zoom in"
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
      <Button 
        variant="outline" 
        size="icon" 
        className="bg-white shadow-md h-10 w-10 hover:bg-primary/10"
        onClick={onZoomOut}
        aria-label="Zoom out"
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
      <Button 
        variant="outline" 
        size="icon" 
        className="bg-white shadow-md h-10 w-10 hover:bg-primary/10"
        onClick={onReset}
        aria-label="Reset view"
      >
        <RotateCw className="h-4 w-4" />
      </Button>
      
      {measureMode && (
        <Button 
          variant="default" 
          size="icon" 
          className="h-10 w-10 animate-pulse"
          aria-label="Measuring mode active"
        >
          <Ruler className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
