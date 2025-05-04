import { useEffect } from 'react';
import { RefObject } from 'react';
import { PropertyBoundary, MapState, BoundaryEdge } from '../types';

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

    // Add roundRect polyfill if not available
    if (!ctx.roundRect) {
      // @ts-ignore - Polyfill for roundRect
      ctx.roundRect = function(x: number, y: number, width: number, height: number, radius: number) {
        if (width < 2 * radius) radius = width / 2;
        if (height < 2 * radius) radius = height / 2;
        this.beginPath();
        this.moveTo(x + radius, y);
        this.arcTo(x + width, y, x + width, y + height, radius);
        this.arcTo(x + width, y + height, x, y + height, radius);
        this.arcTo(x, y + height, x, y, radius);
        this.arcTo(x, y, x + width, y, radius);
        this.closePath();
        return this;
      };
    }
    
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
    
    // Transform coordinates based on scale and offset
    const transformPoint = (point: { x: number, y: number }) => {
      return {
        x: (point.x - centerX) * autoScale * mapState.scale + canvas.width / 2 + mapState.offset.x,
        y: (centerY - point.y) * autoScale * mapState.scale + canvas.height / 2 + mapState.offset.y
      };
    };
    
    // Draw boundaries
    propertyBoundaries.forEach((boundary, boundaryIndex) => {
      ctx.beginPath();
      
      boundary.points.forEach((point, i) => {
        const transformed = transformPoint(point);
        
        if (i === 0) {
          ctx.moveTo(transformed.x, transformed.y);
        } else {
          ctx.lineTo(transformed.x, transformed.y);
        }
      });
      
      ctx.closePath();
      
      // Fill with semi-transparent color
      ctx.fillStyle = 'rgba(155, 135, 245, 0.3)';
      ctx.fill();
      
      // Draw stroke with higher contrast
      ctx.strokeStyle = '#5D4A9C';
      ctx.lineWidth = 3;
      ctx.stroke();
      
      // Store transformed points for edge labels
      const transformedPoints = boundary.points.map(point => transformPoint(point));
      
      // Draw edges with numbered labels and measurements
      boundary.points.forEach((point, i) => {
        const nextIndex = (i + 1) % boundary.points.length;
        const start = transformedPoints[i];
        const end = transformedPoints[nextIndex];
        
        // Calculate midpoint for label positioning
        const midpoint = {
          x: (start.x + end.x) / 2,
          y: (start.y + end.y) / 2
        };
        
        // Calculate line angle for better positioning of length label
        const angle = Math.atan2(end.y - start.y, end.x - start.x);
        const perpendicular = angle + Math.PI/2;
        const labelOffset = 20; // Distance from line
        
        // Draw edge number label (inside circle)
        ctx.fillStyle = '#333333';
        ctx.beginPath();
        ctx.arc(midpoint.x, midpoint.y, 14, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = 'white';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText((i + 1).toString(), midpoint.x, midpoint.y);
        
        // Calculate length between points
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        const realLength = length / (autoScale * mapState.scale);
        const displayLength = realLength.toFixed(2);
        
        // Position for length label (offset perpendicular to the line)
        const labelX = midpoint.x + Math.cos(perpendicular) * labelOffset;
        const labelY = midpoint.y + Math.sin(perpendicular) * labelOffset;
        
        // Draw length label background
        const textMetrics = ctx.measureText(displayLength + " m");
        const textWidth = textMetrics.width + 10;
        const textHeight = 22;
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.beginPath();
        ctx.roundRect(
          labelX - textWidth/2, 
          labelY - textHeight/2,
          textWidth,
          textHeight,
          5
        );
        ctx.fill();
        
        ctx.strokeStyle = '#5D4A9C';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Draw length text
        ctx.fillStyle = '#333333';
        ctx.font = '11px Arial';
        ctx.fillText(displayLength + " m", labelX, labelY);
      });
      
      // Draw vertices as points with letter labels
      boundary.points.forEach((point, i) => {
        const transformed = transformPoint(point);
        
        // Draw vertex point
        ctx.beginPath();
        ctx.arc(transformed.x, transformed.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#222222';
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw vertex label with letter (A, B, C, etc.)
        const letter = String.fromCharCode(65 + i);
        const labelX = transformed.x;
        const labelY = transformed.y - 18;
        
        // Draw label background
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.beginPath();
        ctx.arc(labelX, labelY, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#333333';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Draw label text
        ctx.fillStyle = '#333333';
        ctx.font = 'bold 11px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(letter, labelX, labelY);
      });
    });
    
    // Draw center marker if no boundaries are present
    if (propertyBoundaries.length === 0) {
      const markerX = canvas.width / 2 + mapState.offset.x;
      const markerY = canvas.height / 2 + mapState.offset.y;
      
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
