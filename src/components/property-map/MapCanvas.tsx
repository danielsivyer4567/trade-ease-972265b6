
import React, { RefObject } from 'react';
import { Plus, Minus, RotateCcw } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface MapCanvasProps {
  canvasRef: RefObject<HTMLCanvasElement>;
  containerRef: RefObject<HTMLDivElement>;
  mapEventHandlers: {
    handleMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void;
    handleMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
    handleMouseUp: () => void;
    handleTouchStart: (e: React.TouchEvent<HTMLCanvasElement>) => void;
    handleTouchMove: (e: React.TouchEvent<HTMLCanvasElement>) => void;
    handleTouchEnd: () => void;
  };
  zoomControls: {
    handleZoomIn: () => void;
    handleZoomOut: () => void;
    handleReset: () => void;
  };
  measureMode: boolean;
}

export const MapCanvas: React.FC<MapCanvasProps> = ({
  canvasRef,
  containerRef,
  mapEventHandlers,
  zoomControls,
  measureMode
}) => {
  const {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  } = mapEventHandlers;
  
  const { handleZoomIn, handleZoomOut, handleReset } = zoomControls;
  
  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 touch-none w-full h-full rounded-md border border-gray-200 bg-gray-50"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />
      
      {/* Zoom controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <Button
          variant="secondary"
          size="icon"
          className="h-8 w-8 bg-white shadow-md border"
          onClick={handleZoomIn}
          aria-label="Zoom in"
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon" 
          className="h-8 w-8 bg-white shadow-md border"
          onClick={handleZoomOut}
          aria-label="Zoom out"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="h-8 w-8 bg-white shadow-md border"
          onClick={handleReset}
          aria-label="Reset view"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
      
      {measureMode && (
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-xs font-medium text-primary rounded-full px-2 py-1 shadow-md border border-primary/20">
          Measurement Mode Active
        </div>
      )}
    </>
  );
};
