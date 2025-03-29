
import React, { useEffect } from 'react';
import { MapControls } from './MapControls';
import { useCanvasResize } from './hooks';

interface MapCanvasProps {
  containerRef: React.RefObject<HTMLDivElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
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
}

export const MapCanvas: React.FC<MapCanvasProps> = ({
  containerRef,
  canvasRef,
  mapEventHandlers,
  zoomControls
}) => {
  const {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  } = mapEventHandlers;
  
  const {
    handleZoomIn,
    handleZoomOut,
    handleReset
  } = zoomControls;
  
  // Use the canvas resize hook
  useCanvasResize(canvasRef, containerRef);
  
  // Prevent default touch behavior to avoid browser gestures interfering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const preventDefaultTouchAction = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };
    
    // Add event listener with passive: false to allow preventDefault
    canvas.addEventListener('touchstart', preventDefaultTouchAction, { passive: false });
    
    return () => {
      canvas.removeEventListener('touchstart', preventDefaultTouchAction);
    };
  }, [canvasRef]);
  
  return (
    <div className="relative w-full bg-gray-50 rounded-lg" style={{ height: '500px' }}>
      <div ref={containerRef} className="w-full h-full relative overflow-hidden rounded-lg border border-gray-200">
        <canvas 
          ref={canvasRef} 
          className="w-full h-full touch-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />
        
        <MapControls 
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onReset={handleReset}
        />
        
        <div className="absolute top-4 left-4 p-2 bg-white/80 backdrop-blur-sm rounded-md shadow-md">
          <div className="flex items-center gap-2 text-sm">
            <span>Drag to pan, pinch to zoom</span>
          </div>
        </div>
      </div>
    </div>
  );
};
