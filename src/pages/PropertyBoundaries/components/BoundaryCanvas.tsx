import { useEffect, useRef } from 'react';
import { Property } from '../types';
import { prepareBoundaryData, renderBoundaryToContext } from '@/integrations/arcgis/boundaryRenderer';

interface BoundaryCanvasProps {
  property: Property | null;
  width?: number;
  height?: number;
}

export function BoundaryCanvas({ property, width = 800, height = 600 }: BoundaryCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !property || !property.boundaries || property.boundaries.length === 0) {
      return;
    }
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    try {
      // Prepare the boundary data for rendering
      const boundaryData = prepareBoundaryData({
        rings: property.boundaries,
        spatialReference: { wkid: 4326 } // WGS 84 coordinate system
      });
      
      // Render the boundary to the canvas
      renderBoundaryToContext(ctx, boundaryData, {
        width,
        height,
        padding: 40,
        fillColor: 'rgba(255, 255, 0, 0.4)',
        strokeColor: 'blue',
        labelColor: 'black',
        lineWidth: 2,
        address: property.address
      });
    } catch (error) {
      console.error('Error rendering property boundary:', error);
    }
  }, [property, width, height]);
  
  if (!property) {
    return (
      <div className="border border-dashed border-gray-300 flex items-center justify-center rounded-md" style={{ width, height }}>
        <p className="text-gray-500">Select a property to view boundary</p>
      </div>
    );
  }
  
  return (
    <div className="relative">
      <canvas 
        ref={canvasRef}
        width={width}
        height={height}
        className="border rounded-md bg-white"
      />
      <div className="absolute top-2 left-2 bg-white/80 p-2 rounded text-sm">
        <p><strong>{property.name}</strong></p>
        {property.address && <p className="text-xs">{property.address}</p>}
      </div>
    </div>
  );
} 