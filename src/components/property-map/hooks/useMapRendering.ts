
import { useEffect } from 'react';
import { RefObject } from 'react';
import { PropertyBoundary, MapState } from '../types';

/**
 * Hook for rendering the map on canvas
 */
export function useMapRendering(
  canvasRef: RefObject<HTMLCanvasElement>,
  containerRef: RefObject<HTMLDivElement>,
  propertyBoundaries: PropertyBoundary[],
  mapState: MapState
) {
  useEffect(() => {
    if (!canvasRef.current || propertyBoundaries.length === 0) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions based on container
    if (containerRef.current) {
      canvas.width = containerRef.current.clientWidth;
      canvas.height = containerRef.current.clientHeight;
    }
    
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Calculate bounding box of all boundaries
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    
    propertyBoundaries.forEach(boundary => {
      boundary.points.forEach(point => {
        minX = Math.min(minX, point.x);
        maxX = Math.max(maxX, point.x);
        minY = Math.min(minY, point.y);
        maxY = Math.max(maxY, point.y);
      });
    });
    
    // Calculate center and scale
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    const rangeX = maxX - minX;
    const rangeY = maxY - minY;
    
    const scaleX = rangeX ? (canvas.width * 0.8) / rangeX : 1;
    const scaleY = rangeY ? (canvas.height * 0.8) / rangeY : 1;
    const autoScale = Math.min(scaleX, scaleY);
    
    // Draw boundaries
    propertyBoundaries.forEach((boundary) => {
      ctx.beginPath();
      
      boundary.points.forEach((point, i) => {
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
      
      // Draw points
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
    
    // Draw center marker if no boundaries are present
    const markerX = canvas.width / 2 + mapState.offset.x;
    const markerY = canvas.height / 2 + mapState.offset.y;
    
    if (propertyBoundaries.length === 0) {
      ctx.beginPath();
      ctx.arc(markerX, markerY - 15, 10, 0, Math.PI * 2);
      ctx.fillStyle = '#9b87f5';
      ctx.fill();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.stroke();
      
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
    
    // Draw scale line
    const scaleLineLength = 100;
    const realWorldDistance = scaleLineLength / (autoScale * mapState.scale);
    const roundedDistance = Math.round(realWorldDistance * 10) / 10;
    
    ctx.beginPath();
    ctx.moveTo(20, canvas.height - 20);
    ctx.lineTo(20 + scaleLineLength, canvas.height - 20);
    
    ctx.moveTo(20, canvas.height - 15);
    ctx.lineTo(20, canvas.height - 25);
    ctx.moveTo(20 + scaleLineLength, canvas.height - 15);
    ctx.lineTo(20 + scaleLineLength, canvas.height - 25);
    
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.font = '12px Arial';
    ctx.fillStyle = '#333';
    ctx.fillText(`${roundedDistance.toFixed(1)} units`, 20, canvas.height - 30);
  }, [propertyBoundaries, mapState.scale, mapState.offset, canvasRef, containerRef]);
}
