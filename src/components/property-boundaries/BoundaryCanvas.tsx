import React, { useEffect, useRef } from 'react';
import { prepareBoundaryData, renderBoundaryToContext } from '@/integrations/arcgis/boundaryRenderer';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface BoundaryCanvasProps {
  geometry: {
    rings: number[][][];
    spatialReference?: { wkid: number };
  };
  width?: number;
  height?: number;
  address?: string;
  showControls?: boolean;
  className?: string;
}

const BoundaryCanvas: React.FC<BoundaryCanvasProps> = ({
  geometry,
  width = 600,
  height = 400,
  address,
  showControls = true,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const renderBoundary = () => {
      const canvas = canvasRef.current;
      if (!canvas || !geometry || !geometry.rings || geometry.rings.length === 0) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      try {
        const boundaryData = prepareBoundaryData(geometry);
        
        renderBoundaryToContext(ctx, boundaryData, {
          width,
          height,
          padding: 50,
          fillColor: 'rgba(200, 230, 255, 0.3)',
          strokeColor: 'blue',
          labelColor: 'darkblue',
          lineWidth: 2,
          address,
          showMeasurements: true
        });
      } catch (error) {
        console.error('Error rendering boundary:', error);
        
        // Draw error message on canvas
        ctx.clearRect(0, 0, width, height);
        ctx.font = '14px Arial';
        ctx.fillStyle = 'red';
        ctx.textAlign = 'center';
        ctx.fillText('Error rendering property boundary', width / 2, height / 2);
      }
    };

    renderBoundary();
  }, [geometry, width, height, address]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Create a temporary link element
    const link = document.createElement('a');
    link.download = `property-boundary-${address?.replace(/\s+/g, '-') || 'unknown'}.png`;
    
    // Convert canvas to data URL
    link.href = canvas.toDataURL('image/png');
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`relative ${className}`}>
      <canvas 
        ref={canvasRef} 
        width={width} 
        height={height}
        className="border border-gray-300 rounded-lg"
      />
      
      {showControls && (
        <div className="absolute top-2 right-2">
          <Button
            variant="outline"
            size="sm"
            className="bg-white"
            onClick={handleDownload}
            title="Download Property Boundary"
          >
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
        </div>
      )}
      
      {/* Display boundary measurements summary */}
      {geometry?.rings && geometry.rings.length > 0 && (
        <div className="mt-2 text-sm text-gray-600">
          <p className="font-medium">Property Details:</p>
          {(() => {
            try {
              const { measurements } = prepareBoundaryData(geometry);
              return (
                <>
                  <p>Total Perimeter: {measurements.totalPerimeter.toFixed(2)}m</p>
                  <p>Total Area: {measurements.area.toFixed(2)}m²</p>
                </>
              );
            } catch (error) {
              return <p className="text-red-500">Unable to calculate measurements</p>;
            }
          })()}
        </div>
      )}
    </div>
  );
};

export default BoundaryCanvas; 