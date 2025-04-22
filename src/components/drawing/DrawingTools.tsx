import React, { useRef, useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PenTool, Eraser, Download, ArrowUp, Square, Circle, Star, Trash2 } from 'lucide-react';

interface DrawingToolsProps {
  onSave?: (dataUrl: string) => void;
  initialColor?: string;
  initialThickness?: number;
  isInModal?: boolean;
  showTitle?: boolean;
  onClose?: () => void;
}

const colorOptions = [
  { color: '#FF0000', label: 'Red' },
  { color: '#000000', label: 'Black' },
  { color: '#808080', label: 'Gray' },
  { color: '#C0C0C0', label: 'Silver' },
  { color: '#FFFF00', label: 'Yellow' },
  { color: '#00FF00', label: 'Green' },
  { color: '#0000FF', label: 'Blue' },
  { color: '#FF00FF', label: 'Magenta' },
  { color: '#00FFFF', label: 'Cyan' },
];

const thicknessOptions = [
  { value: 'thin', label: 'Thin', size: 2 },
  { value: 'medium', label: 'Medium', size: 5 },
  { value: 'thick', label: 'Thick', size: 10 },
];

const shapeOptions = [
  { value: 'line', icon: PenTool, label: 'Line' },
  { value: 'square', icon: Square, label: 'Square' },
  { value: 'circle', icon: Circle, label: 'Circle' },
  { value: 'star', icon: Star, label: 'Star' },
];

export const DrawingTools: React.FC<DrawingToolsProps> = ({
  onSave,
  initialColor = '#FF0000',
  initialThickness = 2,
  isInModal = false,
  showTitle = true,
  onClose
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState(initialColor);
  const [currentThickness, setCurrentThickness] = useState(initialThickness);
  const [currentTool, setCurrentTool] = useState('pen');
  const [prevPosition, setPrevPosition] = useState<{ x: number, y: number } | null>(null);
  
  // Setup canvas context and clear it
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas with white background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Set default line style
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = currentThickness;
  }, []);
  
  // Update context when color or thickness changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = currentThickness;
  }, [currentColor, currentThickness]);
  
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setIsDrawing(true);
    setPrevPosition({ x, y });
  };
  
  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !prevPosition) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(prevPosition.x, prevPosition.y);
    ctx.lineTo(x, y);
    ctx.stroke();
    
    setPrevPosition({ x, y });
  };
  
  const endDrawing = () => {
    setIsDrawing(false);
    setPrevPosition(null);
  };
  
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };
  
  const downloadDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const dataUrl = canvas.toDataURL('image/png');
    
    if (onSave) {
      onSave(dataUrl);
    } else {
      const link = document.createElement('a');
      link.download = 'drawing.png';
      link.href = dataUrl;
      link.click();
    }
  };
  
  return (
    <div className="drawing-tools-container">
      <Card className={`w-full ${isInModal ? '' : 'shadow-md'}`}>
        {showTitle && (
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center justify-between">
              <span>Create Tag</span>
              {onClose && (
                <button 
                  onClick={onClose} 
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              )}
            </CardTitle>
          </CardHeader>
        )}
      
        <CardContent className="pb-2">
          {/* Canvas for drawing */}
          <div className="border rounded overflow-hidden mb-3">
            <canvas
              ref={canvasRef}
              width={500}
              height={300}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={endDrawing}
              onMouseLeave={endDrawing}
              className="w-full h-auto bg-white cursor-crosshair"
            />
          </div>
          
          {/* Tools */}
          <div className="mb-3">
            <div className="flex flex-col space-y-3">
              {/* Color selection */}
              <div className="flex items-center space-x-2">
                {colorOptions.map((option) => (
                  <button
                    key={option.color}
                    onClick={() => setCurrentColor(option.color)}
                    className={`w-6 h-6 rounded-full ${currentColor === option.color ? 'ring-2 ring-offset-2 ring-primary' : ''}`}
                    style={{ backgroundColor: option.color }}
                    title={option.label}
                  />
                ))}
              </div>
              
              {/* Thickness selection */}
              <div className="flex items-center space-x-2">
                {thicknessOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setCurrentThickness(option.size)}
                    className={`px-3 py-1 border rounded text-sm ${currentThickness === option.size ? 'bg-primary text-white' : 'bg-white text-gray-700'}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between pt-0">
          <Button variant="outline" onClick={clearCanvas}>
            <Trash2 className="h-4 w-4 mr-1" /> Cancel
          </Button>
          <Button onClick={downloadDrawing}>
            <ArrowUp className="h-4 w-4 mr-1" /> Save Tag
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DrawingTools; 