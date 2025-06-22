
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Point, DrawingState, DrawingTool } from '../types';
import { Edit3, Eraser, Minus, ArrowUpRight, Square, Circle as CircleIcon, Star as StarIcon } from 'lucide-react'; // Renamed Circle to CircleIcon

interface DrawingCanvasProps {
  width: number;
  height: number;
  drawingState: DrawingState;
  onDrawEnd?: (dataUrl: string) => void; // Callback when drawing action (like shape) is completed
  initialDrawingDataUrl?: string; // To load an existing drawing
  className?: string;
  style?: React.CSSProperties;
  isReadOnly?: boolean; // If true, disable drawing
}

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  width,
  height,
  drawingState,
  onDrawEnd,
  initialDrawingDataUrl,
  className = '',
  style = {},
  isReadOnly = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState<Point | null>(null);

  const getCanvasContext = useCallback(() => {
    return canvasRef.current?.getContext('2d') || null;
  }, []);
  
  // Initialize canvas with existing drawing or clear it
   useEffect(() => {
    const ctx = getCanvasContext();
    if (!ctx || !canvasRef.current) return;

    // Clear canvas before drawing anything new
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    if (initialDrawingDataUrl) {
      const image = new Image();
      image.onload = () => {
        ctx.drawImage(image, 0, 0, canvasRef.current!.width, canvasRef.current!.height);
      };
      image.src = initialDrawingDataUrl;
    }
  }, [initialDrawingDataUrl, width, height, getCanvasContext]);


  const getPointFromEvent = (e: React.MouseEvent<HTMLCanvasElement>): Point => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isReadOnly) return;
    const ctx = getCanvasContext();
    if (!ctx) return;

    const point = getPointFromEvent(e);
    setIsDrawing(true);
    setLastPoint(point);

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = drawingState.color;
    ctx.fillStyle = drawingState.color; // For filled shapes like star
    ctx.lineWidth = drawingState.lineWidth;
    
    if (drawingState.tool === 'pencil') {
        ctx.beginPath();
        ctx.moveTo(point.x, point.y);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isReadOnly || !isDrawing || !lastPoint) return;
    const ctx = getCanvasContext();
    if (!ctx) return;

    const currentPoint = getPointFromEvent(e);

    ctx.strokeStyle = drawingState.color; // Ensure color is updated mid-draw for pencil
    ctx.lineWidth = drawingState.lineWidth; // Ensure lineWidth is updated

    switch (drawingState.tool) {
      case 'pencil':
        ctx.lineTo(currentPoint.x, currentPoint.y);
        ctx.stroke();
        break;
      case 'eraser':
        // Eraser paints with background color, or use clearRect for transparency
        // For simplicity, using clearRect
        const eraserSize = drawingState.lineWidth * 2 + 8; // Make eraser a bit larger
        ctx.clearRect(currentPoint.x - eraserSize / 2, currentPoint.y - eraserSize / 2, eraserSize, eraserSize);
        break;
      // Other tools like line, rectangle typically draw on mouseUp
    }
    // For pencil, update lastPoint continuously for smoother lines
    if (drawingState.tool === 'pencil' || drawingState.tool === 'eraser') {
      setLastPoint(currentPoint);
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isReadOnly || !isDrawing || !lastPoint) {
      setIsDrawing(false);
      setLastPoint(null);
      return;
    }
    
    const ctx = getCanvasContext();
    if (!ctx) return;

    const currentPoint = getPointFromEvent(e);
    
    // Finalize drawing for shape tools
    ctx.strokeStyle = drawingState.color;
    ctx.fillStyle = drawingState.color;
    ctx.lineWidth = drawingState.lineWidth;

    switch (drawingState.tool) {
      case 'line':
        ctx.beginPath();
        ctx.moveTo(lastPoint.x, lastPoint.y);
        ctx.lineTo(currentPoint.x, currentPoint.y);
        ctx.stroke();
        break;
      case 'arrow':
        drawArrow(ctx, lastPoint, currentPoint, drawingState.color, drawingState.lineWidth);
        break;
      case 'rectangle':
        ctx.beginPath();
        ctx.rect(lastPoint.x, lastPoint.y, currentPoint.x - lastPoint.x, currentPoint.y - lastPoint.y);
        ctx.stroke();
        break;
      case 'circle':
        const radius = Math.sqrt(Math.pow(currentPoint.x - lastPoint.x, 2) + Math.pow(currentPoint.y - lastPoint.y, 2));
        ctx.beginPath();
        ctx.arc(lastPoint.x, lastPoint.y, radius, 0, 2 * Math.PI);
        ctx.stroke();
        break;
      case 'star':
        const starRadius = Math.sqrt(Math.pow(currentPoint.x - lastPoint.x, 2) + Math.pow(currentPoint.y - lastPoint.y, 2)) / 2;
        drawStar(ctx, (lastPoint.x + currentPoint.x) / 2, (lastPoint.y + currentPoint.y) / 2, 5, starRadius, drawingState.color, drawingState.lineWidth, true);
        break;
    }

    setIsDrawing(false);
    setLastPoint(null);

    if (onDrawEnd && canvasRef.current) {
      onDrawEnd(canvasRef.current.toDataURL('image/png'));
    }
  };
  
  const handleMouseLeave = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDrawing) {
        // If drawing and mouse leaves, treat it like mouse up for tools that finalize on mouse up
        if (drawingState.tool !== 'pencil' && drawingState.tool !== 'eraser') {
            handleMouseUp(e);
        } else { // For pencil/eraser, just stop drawing
            setIsDrawing(false);
            setLastPoint(null);
            if (onDrawEnd && canvasRef.current) {
              onDrawEnd(canvasRef.current.toDataURL('image/png'));
            }
        }
    }
  };


  const drawArrow = (
    context: CanvasRenderingContext2D,
    from: Point,
    to: Point,
    color: string,
    lineWidth: number
  ) => {
    const headLength = Math.max(10, lineWidth * 2.5); // Arrow head size based on line width
    const angle = Math.atan2(to.y - from.y, to.x - from.x);

    context.beginPath();
    context.moveTo(from.x, from.y);
    context.lineTo(to.x, to.y);
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    context.stroke();

    context.beginPath();
    context.moveTo(to.x, to.y);
    context.lineTo(to.x - headLength * Math.cos(angle - Math.PI / 6), to.y - headLength * Math.sin(angle - Math.PI / 6));
    context.lineTo(to.x - headLength * Math.cos(angle + Math.PI / 6), to.y - headLength * Math.sin(angle + Math.PI / 6));
    context.closePath();
    context.fillStyle = color;
    context.fill();
  };

  const drawStar = (
    context: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    points: number,
    outerRadius: number,
    color: string,
    lineWidth: number,
    filled: boolean = false
  ) => {
    const innerRadius = outerRadius / 2; // Standard star proportion
    context.beginPath();
    for (let i = 0; i < 2 * points; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (Math.PI / points) * i - Math.PI / 2; // Start from top
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      if (i === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    }
    context.closePath();
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    context.stroke();
    if (filled) {
      context.fillStyle = color;
      context.fill();
    }
  };


  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={`${className} ${isReadOnly ? 'cursor-not-allowed' : 'cursor-crosshair'} bg-white border border-gray-300 rounded-md`}
      style={{ touchAction: 'none', display: 'block', ...style }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave} // Important to stop drawing if mouse leaves canvas
    />
  );
};

interface DrawingToolbarProps {
  drawingState: DrawingState;
  onStateChange: <K extends keyof DrawingState>(key: K, value: DrawingState[K]) => void;
  colorOptions?: string[];
  lineWidthOptions?: number[];
  className?: string;
}

export const DrawingToolbar: React.FC<DrawingToolbarProps> = ({
  drawingState,
  onStateChange,
  colorOptions = ['#FF0000', '#0000FF', '#00FF00', '#FFFF00', '#000000', '#FFFFFF'],
  lineWidthOptions = [1, 3, 5, 8, 12],
  className = "",
}) => {
  const basicTools: { name: DrawingTool; icon: React.ReactNode; label: string }[] = [
    { name: 'pencil', icon: <Edit3 className="h-4 w-4" />, label: 'Pencil' },
    { name: 'eraser', icon: <Eraser className="h-4 w-4" />, label: 'Eraser' },
  ];
  const shapeTools: { name: DrawingTool; icon: React.ReactNode; label: string }[] = [
    { name: 'line', icon: <Minus className="h-4 w-4 transform rotate-45" />, label: 'Line' },
    { name: 'arrow', icon: <ArrowUpRight className="h-4 w-4" />, label: 'Arrow' },
    { name: 'rectangle', icon: <Square className="h-4 w-4" />, label: 'Rectangle' },
    { name: 'circle', icon: <CircleIcon className="h-4 w-4" />, label: 'Circle' },
    { name: 'star', icon: <StarIcon className="h-4 w-4" />, label: 'Star' },
  ];

  const renderToolButton = (tool: { name: DrawingTool; icon: React.ReactNode; label: string }) => (
    <button
      key={tool.name}
      title={tool.label}
      onClick={() => onStateChange('tool', tool.name)}
      className={`p-1.5 rounded-md hover:bg-gray-200 transition-colors ${
        drawingState.tool === tool.name ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-white text-gray-700 border border-gray-300'
      }`}
    >
      {tool.icon}
    </button>
  );

  return (
    <div className={`flex flex-col gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50 ${className}`}>
      {/* Basic Tools */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-gray-600 mr-1 min-w-[70px]">Draw Mode:</span>
        <div className="flex flex-wrap gap-1.5">
            {basicTools.map(renderToolButton)}
        </div>
      </div>
      
      {/* Shape Tools */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-gray-600 mr-1 min-w-[70px]">Shapes:</span>
        <div className="flex flex-wrap gap-1.5">
            {shapeTools.map(renderToolButton)}
        </div>
      </div>


      {/* Line Width and Colors in one row for compactness */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        {/* Line Width */}
        <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-600 mr-1 min-w-[70px] sm:min-w-0">Size:</span>
            <div className="flex flex-wrap gap-1.5">
            {lineWidthOptions.map(width => (
            <button
                key={`width-${width}`}
                title={`${width}px`}
                onClick={() => onStateChange('lineWidth', width)}
                className={`p-1.5 rounded-md hover:bg-gray-200 transition-colors h-8 min-w-[2rem] flex items-center justify-center ${
                drawingState.lineWidth === width ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-white text-gray-700 border border-gray-300'
                }`}
            >
                <span className="block bg-black rounded-full" style={{ width: `${width}px`, height: `${width}px`, minWidth: '2px', minHeight: '2px', maxWidth: '16px', maxHeight: '16px' }}></span>
            </button>
            ))}
            </div>
        </div>
        
        {/* Colors */}
        <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-600 mr-1 min-w-[70px] sm:min-w-0">Color:</span>
            <div className="flex flex-wrap gap-1.5 items-center">
            {colorOptions.map(color => (
            <button
                key={color}
                title={color}
                onClick={() => onStateChange('color', color)}
                className={`h-6 w-6 rounded-full border-2 transition-all duration-150 ease-in-out
                ${drawingState.color === color ? 'ring-2 ring-offset-1 ring-blue-500 scale-110' : 'hover:scale-110'}
                ${color === '#FFFFFF' ? 'border-gray-400' : 'border-transparent'}`}
                style={{ backgroundColor: color }}
            />
            ))}
            <input
                type="color"
                value={drawingState.color}
                onChange={(e) => onStateChange('color', e.target.value)}
                className="h-7 w-9 rounded-md border border-gray-300 cursor-pointer p-0.5"
                title="Custom Color"
            />
            </div>
        </div>
      </div>
    </div>
  );
};


export default DrawingCanvas;
