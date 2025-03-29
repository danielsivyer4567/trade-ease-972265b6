
import { useState, useEffect, RefObject } from 'react';
import { Coordinate, PropertyBoundary, MapMeasurements, MapState } from './types';
import { calculateBoundaryMeasurements, convertBoundariesToPropertyBoundaries } from './mapUtils';

export function usePropertyMap(
  canvasRef: RefObject<HTMLCanvasElement>,
  containerRef: RefObject<HTMLDivElement>,
  boundaries: Array<Array<[number, number]>>
) {
  const [propertyBoundaries, setPropertyBoundaries] = useState<PropertyBoundary[]>([]);
  const [measurements, setMeasurements] = useState<MapMeasurements>({
    boundaryLength: 0,
    boundaryArea: 0
  });
  
  const [mapState, setMapState] = useState<MapState>({
    scale: 1,
    offset: { x: 0, y: 0 },
    isDragging: false,
    dragStart: { x: 0, y: 0 }
  });

  // Convert input boundaries to our internal format and normalize coordinates
  useEffect(() => {
    if (!boundaries.length) return;
    
    // Convert raw boundaries to our Coordinate format
    const convertedBoundaries = convertBoundariesToPropertyBoundaries(boundaries);
    setPropertyBoundaries(convertedBoundaries);
    
    // Pre-calculate measurements
    const { totalLength, totalArea } = calculateBoundaryMeasurements(convertedBoundaries);
    setMeasurements({
      boundaryLength: totalLength,
      boundaryArea: totalArea
    });
  }, [boundaries]);

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
        const x = (point.x - centerX) * autoScale * mapState.scale + canvas.width / 2 + mapState.offset.x;
        const y = (centerY - point.y) * autoScale * mapState.scale + canvas.height / 2 + mapState.offset.y;
        
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
        const x = (point.x - centerX) * autoScale * mapState.scale + canvas.width / 2 + mapState.offset.x;
        const y = (centerY - point.y) * autoScale * mapState.scale + canvas.height / 2 + mapState.offset.y;
        
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
    const markerX = canvas.width / 2 + mapState.offset.x;
    const markerY = canvas.height / 2 + mapState.offset.y;
    
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
    const realWorldDistance = scaleLineLength / (autoScale * mapState.scale);
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
    
  }, [propertyBoundaries, mapState.scale, mapState.offset]);

  // Mouse/Touch event handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setMapState(prev => ({
      ...prev,
      isDragging: true,
      dragStart: {
        x: e.clientX - prev.offset.x,
        y: e.clientY - prev.offset.y
      }
    }));
  };
  
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1) {
      setMapState(prev => ({
        ...prev,
        isDragging: true,
        dragStart: {
          x: e.touches[0].clientX - prev.offset.x,
          y: e.touches[0].clientY - prev.offset.y
        }
      }));
    }
  };
  
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (mapState.isDragging) {
      setMapState(prev => ({
        ...prev,
        offset: {
          x: e.clientX - prev.dragStart.x,
          y: e.clientY - prev.dragStart.y
        }
      }));
    }
  };
  
  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (mapState.isDragging && e.touches.length === l) {
      e.preventDefault();
      setMapState(prev => ({
        ...prev,
        offset: {
          x: e.touches[0].clientX - prev.dragStart.x,
          y: e.touches[0].clientY - prev.dragStart.y
        }
      }));
    }
  };
  
  const handleMouseUp = () => {
    setMapState(prev => ({
      ...prev,
      isDragging: false
    }));
  };
  
  const handleTouchEnd = () => {
    setMapState(prev => ({
      ...prev,
      isDragging: false
    }));
  };
  
  // Zoom handlers
  const handleZoomIn = () => {
    setMapState(prev => ({
      ...prev, 
      scale: prev.scale * 1.2
    }));
  };
  
  const handleZoomOut = () => {
    setMapState(prev => ({
      ...prev,
      scale: prev.scale / 1.2
    }));
  };
  
  const handleReset = () => {
    setMapState({
      scale: 1,
      offset: { x: 0, y: 0 },
      isDragging: false,
      dragStart: { x: 0, y: 0 }
    });
  };

  return {
    measurements,
    mapEventHandlers: {
      handleMouseDown,
      handleMouseMove,
      handleMouseUp,
      handleTouchStart,
      handleTouchMove,
      handleTouchEnd
    },
    zoomControls: {
      handleZoomIn,
      handleZoomOut,
      handleReset
    }
  };
}
