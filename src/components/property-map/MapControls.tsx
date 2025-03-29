
import React from 'react';
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, RotateCw, Move } from 'lucide-react';

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

export const MapControls: React.FC<MapControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onReset
}) => {
  return (
    <>
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <Button 
          variant="outline" 
          size="icon" 
          className="bg-white shadow-md h-10 w-10"
          onClick={onZoomIn}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          className="bg-white shadow-md h-10 w-10"
          onClick={onZoomOut}
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          className="bg-white shadow-md h-10 w-10"
          onClick={onReset}
        >
          <RotateCw className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="absolute top-4 left-4 p-2 bg-white/80 backdrop-blur-sm rounded-md shadow-md">
        <div className="flex items-center gap-2 text-sm">
          <Move className="h-4 w-4 text-muted-foreground" />
          <span>Drag to pan, use buttons to zoom</span>
        </div>
      </div>
    </>
  );
};
