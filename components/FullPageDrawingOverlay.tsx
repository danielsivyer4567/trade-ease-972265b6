
import React, { useState, useEffect, useRef, useCallback } from 'react';
import DrawingCanvas, { DrawingToolbar } from './DrawingCanvas';
import { DrawingState, Point } from '../types';
import { X, Check, Eraser, Brush } from 'lucide-react';
import { DEFAULT_DRAWING_STATE, DRAWING_COLORS, DRAWING_LINE_WIDTHS } from '../constants';

interface FullPageDrawingOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dataUrl: string) => void;
  initialDrawingState?: Partial<DrawingState>;
}

const FullPageDrawingOverlay: React.FC<FullPageDrawingOverlayProps> = ({
  isOpen,
  onClose,
  onSave,
  initialDrawingState = {},
}) => {
  const [drawingState, setDrawingState] = useState<DrawingState>({
    ...DEFAULT_DRAWING_STATE,
    ...initialDrawingState,
    isDrawingOnPage: true,
  });
  const [canvasSize, setCanvasSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const canvasDataUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleResize = () => {
      setCanvasSize({ width: window.innerWidth, height: window.innerHeight });
    };
    
    setDrawingState(prev => ({ ...prev, ...initialDrawingState, isDrawingOnPage: true })); // Reset state on open

    window.addEventListener('resize', handleResize);
    document.body.style.overflow = 'hidden'; // Prevent scrolling while overlay is open

    return () => {
      window.removeEventListener('resize', handleResize);
      document.body.style.overflow = '';
    };
  }, [isOpen, initialDrawingState]);

  const handleDrawingStateChange = <K extends keyof DrawingState>(key: K, value: DrawingState[K]) => {
    setDrawingState(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveDrawing = () => {
    if (canvasDataUrlRef.current) {
      onSave(canvasDataUrlRef.current);
    }
    onClose();
  };
  
  const handleCanvasDrawEnd = useCallback((dataUrl: string) => {
    canvasDataUrlRef.current = dataUrl;
  }, []);


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center full-page-drawing-overlay z-[60]"> {/* Ensure overlay is on top */}
      <div className="absolute inset-0 w-full h-full">
        <DrawingCanvas
          width={canvasSize.width}
          height={canvasSize.height}
          drawingState={drawingState}
          onDrawEnd={handleCanvasDrawEnd}
          className="bg-transparent border-none rounded-none" // Make canvas transparent for overlay effect
        />
      </div>

      {/* Toolbar positioned at the top */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 p-0 rounded-lg shadow-2xl bg-white/90 backdrop-blur-md z-[61]">
        <DrawingToolbar
          drawingState={drawingState}
          onStateChange={handleDrawingStateChange}
          colorOptions={DRAWING_COLORS}
          lineWidthOptions={DRAWING_LINE_WIDTHS}
          className="border-none bg-transparent shadow-none"
        />
      </div>
      
      {/* Action Buttons (Done/Cancel) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4 z-[61]">
        <button
          onClick={onClose}
          className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg shadow-lg hover:bg-gray-700 transition-colors text-sm font-medium"
        >
          <X className="h-5 w-5" /> Cancel
        </button>
        <button
          onClick={handleSaveDrawing}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          <Check className="h-5 w-5" /> Done & Save Drawing
        </button>
      </div>
    </div>
  );
};

export default FullPageDrawingOverlay;