
import React, { forwardRef } from 'react';
import { Plus, Minus, RotateCcw } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface MapCanvasProps {
  onMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseUp: () => void;
  onWheel?: (e: React.WheelEvent<HTMLCanvasElement>) => void;
  onTouchStart?: (e: React.TouchEvent<HTMLCanvasElement>) => void;
  onTouchMove?: (e: React.TouchEvent<HTMLCanvasElement>) => void;
  onTouchEnd?: () => void;
}

export const MapCanvas = forwardRef<HTMLCanvasElement, MapCanvasProps>(
  ({ onMouseDown, onMouseMove, onMouseUp, onWheel, onTouchStart, onTouchMove, onTouchEnd }, ref) => {
    return (
      <canvas
        ref={ref}
        className="absolute inset-0 touch-none w-full h-full rounded-md border border-gray-200 bg-gray-50"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onWheel={onWheel}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      />
    );
  }
);

MapCanvas.displayName = 'MapCanvas';
