import React, { useRef, useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Circle, 
  Square, 
  Pencil, 
  Type, 
  ArrowUpRight, 
  Trash2,
  Save,
  Eraser,
  Check,
  X,
  ExternalLink
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';

export interface DrawingToolsProps {
  onSaveDrawing: (dataUrl: string) => void;
  onCancel: () => void;
  initialImage?: string;
  enableExternalDrawing?: boolean;
  onRequestExternalDrawing?: () => void;
}

type Tool = 'pen' | 'eraser' | 'text' | 'circle' | 'rectangle' | 'arrow';

export const DrawingTools: React.FC<DrawingToolsProps> = ({
  onSaveDrawing,
  onCancel,
  initialImage,
  enableExternalDrawing = false,
  onRequestExternalDrawing
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#ff3333');
  const [lineWidth, setLineWidth] = useState(5);
  const [selectedTool, setSelectedTool] = useState<Tool>('pen');
  const [textInput, setTextInput] = useState('');
  const [showTextInput, setShowTextInput] = useState(false);
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });
  const [isFullPage, setIsFullPage] = useState(false);

  // Setup canvas context
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Set canvas to full width of its container
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    const context = canvas.getContext('2d');
    if (context) {
      context.lineCap = 'round';
      context.lineJoin = 'round';
      context.strokeStyle = color;
      context.lineWidth = lineWidth;
      setCtx(context);
      
      // Fill with white background
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

  // Update stroke style when color or width changes
  useEffect(() => {
    if (ctx) {
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
    }
  }, [color, lineWidth, ctx]);

  // Load initial image if provided
  useEffect(() => {
    if (initialImage && ctx && canvasRef.current) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvasRef.current!.width, canvasRef.current!.height);
      };
      img.src = initialImage;
    }
  }, [initialImage, ctx]);

  // Start drawing
  const startDrawing = (e: React.MouseEvent) => {
    if (!ctx) return;
    
    const pos = getPosition(e);
    
    if (selectedTool === 'text') {
      setTextPosition({ x: pos.x, y: pos.y });
      setShowTextInput(true);
      return;
    }
    
    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  // Draw
  const draw = (e: React.MouseEvent) => {
    if (!isDrawing || !ctx) return;
    
    const pos = getPosition(e);
    
    if (selectedTool === 'pen') {
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    } else if (selectedTool === 'eraser') {
      // Store current stroke style
      const currentStyle = ctx.strokeStyle;
      ctx.strokeStyle = '#ffffff';
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      // Restore stroke style
      ctx.strokeStyle = currentStyle;
    }
  };

  // Stop drawing
  const stopDrawing = () => {
    setIsDrawing(false);
    if (ctx) {
      ctx.closePath();
    }
  };

  // Get mouse position relative to canvas
  const getPosition = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  // Handle text input confirmation
  const confirmTextInput = () => {
    if (!ctx || !textInput.trim()) {
      setShowTextInput(false);
      return;
    }
    
    ctx.font = `${lineWidth * 3}px sans-serif`;
    ctx.fillStyle = color;
    ctx.fillText(textInput, textPosition.x, textPosition.y);
    
    setTextInput('');
    setShowTextInput(false);
  };

  // Clear canvas
  const clearCanvas = () => {
    if (!ctx || !canvasRef.current) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  // Save drawing
  const saveDrawing = () => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL('image/png');
    onSaveDrawing(dataUrl);
  };

  // Handle drawing outside request
  const handleDrawOutside = () => {
    if (onRequestExternalDrawing) {
      onRequestExternalDrawing();
    }
  };

  // Draw outside tag directly on the document
  const enableFullPageDrawing = () => {
    setIsFullPage(true);
    // Additional logic to enable drawing on the full page
  };

  // Tool buttons
  const toolButtons = [
    { tool: 'pen' as Tool, icon: <Pencil className="h-4 w-4" /> },
    { tool: 'eraser' as Tool, icon: <Eraser className="h-4 w-4" /> },
    { tool: 'text' as Tool, icon: <Type className="h-4 w-4" /> },
    { tool: 'circle' as Tool, icon: <Circle className="h-4 w-4" /> },
    { tool: 'rectangle' as Tool, icon: <Square className="h-4 w-4" /> },
    { tool: 'arrow' as Tool, icon: <ArrowUpRight className="h-4 w-4" /> }
  ];

  // Color options
  const colorOptions = [
    '#ff3333', '#ff9933', '#ffff33', '#33ff33', 
    '#33ffff', '#3333ff', '#9933ff', '#ff33ff'
  ];

  return (
    <Card className="w-full">
      <CardContent className="p-3">
        <div className="mb-3 flex flex-wrap gap-1">
          {toolButtons.map(({ tool, icon }) => (
            <Button
              key={tool}
              variant={selectedTool === tool ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTool(tool)}
              className="h-8 w-8 p-0"
            >
              {icon}
            </Button>
          ))}
          
          <Button
            variant="outline"
            size="sm"
            onClick={clearCanvas}
            className="h-8 w-8 p-0 ml-auto"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="mb-3 flex items-center gap-2">
          <div className="grid grid-cols-8 gap-1">
            {colorOptions.map((c) => (
              <button
                key={c}
                className={`h-6 w-6 rounded-full ${color === c ? 'ring-2 ring-offset-2 ring-primary' : ''}`}
                style={{ backgroundColor: c }}
                onClick={() => setColor(c)}
              />
            ))}
          </div>
        </div>
        
        <div className="mb-3 flex items-center gap-2">
          <span className="text-xs">Size:</span>
          <Slider
            value={[lineWidth]}
            min={1}
            max={20}
            step={1}
            className="w-full"
            onValueChange={(values) => setLineWidth(values[0])}
          />
        </div>
        
        <div className="relative">
          <canvas
            ref={canvasRef}
            className="border rounded-md w-full h-[300px] bg-white touch-none"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />
          
          {showTextInput && (
            <div 
              className="absolute bg-white border rounded p-2 shadow-md flex gap-2"
              style={{ 
                left: textPosition.x, 
                top: textPosition.y + 10,
                transform: 'translateY(-100%)'
              }}
            >
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="border rounded px-2 py-1 text-sm w-[200px]"
                autoFocus
              />
              <Button size="sm" variant="ghost" onClick={confirmTextInput} className="p-1 h-auto">
                <Check className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setShowTextInput(false)} className="p-1 h-auto">
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        
        <div className="mt-3 flex justify-between gap-2">
          {enableExternalDrawing && (
            <Button variant="outline" size="sm" onClick={handleDrawOutside} className="mr-auto">
              <ExternalLink className="h-4 w-4 mr-1" />
              Draw Outside Tag
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={onCancel}>
            Cancel
          </Button>
          <Button size="sm" onClick={saveDrawing}>
            <Save className="h-4 w-4 mr-1" />
            Save
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DrawingTools; 