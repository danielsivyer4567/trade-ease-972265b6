
import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Ruler, Copy, RotateCw, ZoomIn, ZoomOut, Move } from 'lucide-react';
import { toast } from "sonner";

interface Coordinate {
  x: number;
  y: number;
}

interface PropertyBoundary {
  points: Coordinate[];
  name: string;
}

interface CustomPropertyMapProps {
  boundaries: Array<Array<[number, number]>>; // Array of polygon coordinates
  title?: string;
  description?: string;
  centerPoint?: [number, number];
}

const CustomPropertyMap = ({
  boundaries = [],
  title = "Property Boundary Viewer",
  description = "View and measure property boundaries",
  centerPoint = [0, 0]
}: CustomPropertyMapProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [boundaryLength, setBoundaryLength] = useState<number>(0);
  const [boundaryArea, setBoundaryArea] = useState<number>(0);
  const [scale, setScale] = useState<number>(1);
  const [offset, setOffset] = useState<Coordinate>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<Coordinate>({ x: 0, y: 0 });
  const [propertyBoundaries, setPropertyBoundaries] = useState<PropertyBoundary[]>([]);

  // Convert input boundaries to our internal format and normalize coordinates
  useEffect(() => {
    if (!boundaries.length) return;
    
    // Convert raw boundaries to our Coordinate format
    const convertedBoundaries: PropertyBoundary[] = boundaries.map((boundary, index) => {
      return {
        points: boundary.map(([lng, lat]) => ({ x: lng, y: lat })),
        name: `Boundary ${index + 1}`
      };
    });
    
    setPropertyBoundaries(convertedBoundaries);
    
    // Pre-calculate measurements
    calculateMeasurements(convertedBoundaries);
  }, [boundaries]);
  
  // Calculate perimeter and area for all boundaries
  const calculateMeasurements = (boundaries: PropertyBoundary[]) => {
    let totalLength = 0;
    let totalArea = 0;
    
    boundaries.forEach(boundary => {
      const { length, area } = calculateBoundaryMeasurements(boundary.points);
      totalLength += length;
      totalArea += area;
    });
    
    setBoundaryLength(totalLength);
    setBoundaryArea(totalArea);
  };
  
  // Calculate perimeter length and area for a single boundary
  const calculateBoundaryMeasurements = (points: Coordinate[]) => {
    if (points.length < 3) return { length: 0, area: 0 };
    
    let length = 0;
    let area = 0;
    
    // Calculate perimeter (length)
    for (let i = 0; i < points.length; i++) {
      const p1 = points[i];
      const p2 = points[(i + 1) % points.length];
      length += calculateDistance(p1, p2);
    }
    
    // Calculate area using Shoelace formula
    for (let i = 0; i < points.length; i++) {
      const j = (i + 1) % points.length;
      area += points[i].x * points[j].y;
      area -= points[j].x * points[i].y;
    }
    area = Math.abs(area) / 2;
    
    return { length, area };
  };
  
  // Calculate distance between two points using Haversine formula for geographical coordinates
  const calculateDistance = (p1: Coordinate, p2: Coordinate) => {
    const R = 6371000; // Earth radius in meters
    const φ1 = p1.y * Math.PI / 180;
    const φ2 = p2.y * Math.PI / 180;
    const Δφ = (p2.y - p1.y) * Math.PI / 180;
    const Δλ = (p2.x - p1.x) * Math.PI / 180;
    
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    
    return R * c;
  };
  
  // Draw the map on canvas
  useEffect(() => {
    if (!canvasRef.current || propertyBoundaries.length === 0) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size to match container
    if (containerRef.current) {
      canvas.width = containerRef.current.clientWidth;
      canvas.height = containerRef.current.clientHeight;
    }
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Find bounds to center map
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    
    propertyBoundaries.forEach(boundary => {
      boundary.points.forEach(point => {
        minX = Math.min(minX, point.x);
        maxX = Math.max(maxX, point.x);
        minY = Math.min(minY, point.y);
        maxY = Math.max(maxY, point.y);
      });
    });
    
    // Calculate center and scale to fit
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    const rangeX = maxX - minX;
    const rangeY = maxY - minY;
    
    // Adjust scale to fit boundaries
    const scaleX = rangeX ? (canvas.width * 0.8) / rangeX : 1;
    const scaleY = rangeY ? (canvas.height * 0.8) / rangeY : 1;
    const autoScale = Math.min(scaleX, scaleY);
    
    // Draw each boundary
    propertyBoundaries.forEach((boundary, index) => {
      ctx.beginPath();
      
      boundary.points.forEach((point, i) => {
        // Transform coordinates to canvas space
        const x = (point.x - centerX) * autoScale * scale + canvas.width / 2 + offset.x;
        const y = (centerY - point.y) * autoScale * scale + canvas.height / 2 + offset.y;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      
      ctx.closePath();
      
      // Fill with semi-transparent color
      ctx.fillStyle = 'rgba(155, 135, 245, 0.3)';
      ctx.fill();
      
      // Draw stroke
      ctx.strokeStyle = '#6E59A5';
      ctx.lineWidth = 3;
      ctx.stroke();
      
      // Draw points at vertices
      boundary.points.forEach(point => {
        const x = (point.x - centerX) * autoScale * scale + canvas.width / 2 + offset.x;
        const y = (centerY - point.y) * autoScale * scale + canvas.height / 2 + offset.y;
        
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#1A1F2C';
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1;
        ctx.stroke();
      });
    });
    
    // Draw center marker
    const markerX = canvas.width / 2 + offset.x;
    const markerY = canvas.height / 2 + offset.y;
    
    // Draw location pin only if no boundaries
    if (propertyBoundaries.length === 0) {
      // Pin head
      ctx.beginPath();
      ctx.arc(markerX, markerY - 15, 10, 0, Math.PI * 2);
      ctx.fillStyle = '#9b87f5';
      ctx.fill();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Pin point
      ctx.beginPath();
      ctx.moveTo(markerX, markerY - 5);
      ctx.lineTo(markerX - 8, markerY + 10);
      ctx.lineTo(markerX + 8, markerY + 10);
      ctx.closePath();
      ctx.fillStyle = '#9b87f5';
      ctx.fill();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    
    // Add scale indicator
    const scaleLineLength = 100; // pixels
    const realWorldDistance = scaleLineLength / (autoScale * scale);
    const roundedDistance = Math.round(realWorldDistance * 10) / 10;
    
    ctx.beginPath();
    ctx.moveTo(20, canvas.height - 20);
    ctx.lineTo(20 + scaleLineLength, canvas.height - 20);
    
    // Draw vertical lines at ends
    ctx.moveTo(20, canvas.height - 15);
    ctx.lineTo(20, canvas.height - 25);
    ctx.moveTo(20 + scaleLineLength, canvas.height - 15);
    ctx.lineTo(20 + scaleLineLength, canvas.height - 25);
    
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Add text for scale
    ctx.font = '12px Arial';
    ctx.fillStyle = '#333';
    ctx.fillText(`${roundedDistance.toFixed(1)} units`, 20, canvas.height - 30);
    
  }, [propertyBoundaries, scale, offset]);
  
  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current || !containerRef.current) return;
      
      canvasRef.current.width = containerRef.current.clientWidth;
      canvasRef.current.height = containerRef.current.clientHeight;
      
      // Redraw on resize
      const event = new Event('resize');
      window.dispatchEvent(event);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Mouse/Touch event handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - offset.x,
      y: e.clientY - offset.y
    });
  };
  
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - offset.x,
        y: e.touches[0].clientY - offset.y
      });
    }
  };
  
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      setOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };
  
  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (isDragging && e.touches.length === 1) {
      e.preventDefault();
      setOffset({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y
      });
    }
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  const handleTouchEnd = () => {
    setIsDragging(false);
  };
  
  // Zoom handlers
  const handleZoomIn = () => {
    setScale(prevScale => prevScale * 1.2);
  };
  
  const handleZoomOut = () => {
    setScale(prevScale => prevScale / 1.2);
  };
  
  const handleReset = () => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
    toast.success("Map view reset");
  };
  
  const handleCopyCoordinates = () => {
    const formattedCoordinates = boundaries.map(boundary => 
      boundary.map(coord => `[${coord[0]}, ${coord[1]}]`).join(',\n  ')
    ).join('\n\n');
    
    navigator.clipboard.writeText(`[\n  ${formattedCoordinates}\n]`);
    toast.success("Coordinates copied to clipboard");
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              {title}
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleCopyCoordinates}
              className="flex items-center gap-1"
            >
              <Copy className="h-4 w-4" />
              <span>Copy Coordinates</span>
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleReset}
              className="flex items-center gap-1"
            >
              <RotateCw className="h-4 w-4" />
              <span>Reset View</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
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
            
            <div className="absolute bottom-4 right-4 flex flex-col gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                className="bg-white shadow-md h-10 w-10"
                onClick={handleZoomIn}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="bg-white shadow-md h-10 w-10"
                onClick={handleZoomOut}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="bg-white shadow-md h-10 w-10"
                onClick={handleReset}
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
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-secondary/10 rounded-lg p-4">
            <h3 className="text-sm font-medium mb-1 flex items-center gap-2">
              <Ruler className="h-4 w-4" />
              Boundary Length
            </h3>
            <div className="text-2xl font-bold">
              {(boundaryLength).toFixed(2)} m
            </div>
            <div className="text-sm text-muted-foreground">
              ({(boundaryLength / 1000).toFixed(2)} km)
            </div>
          </div>
          
          <div className="bg-secondary/10 rounded-lg p-4">
            <h3 className="text-sm font-medium mb-1 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Property Area
            </h3>
            <div className="text-2xl font-bold">
              {(boundaryArea).toFixed(2)} m²
            </div>
            <div className="text-sm text-muted-foreground">
              ({(boundaryArea / 10000).toFixed(4)} hectares)
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomPropertyMap;
