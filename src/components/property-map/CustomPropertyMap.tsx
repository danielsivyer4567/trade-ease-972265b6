import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { CustomPropertyMapProps } from './types';
import { MapCanvas } from './MapCanvas';
import { MapHeader } from './MapHeader';
import { MeasurementsDisplay } from './MeasurementsDisplay';
import { BoundaryMeasurements } from './BoundaryMeasurements';
import { usePropertyMap } from './usePropertyMap';

const CustomPropertyMap = ({
  boundaries = [],
  title = "Property Boundary Viewer",
  description = "View and measure property boundaries",
  centerPoint = [0, 0],
  measureMode = false
}: CustomPropertyMapProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showEdgeMeasurements, setShowEdgeMeasurements] = useState(measureMode);
  
  // Memoize boundary validation to prevent unnecessary re-renders
  const hasValidBoundaries = useMemo(() => {
    if (!Array.isArray(boundaries)) {
      console.error("Boundaries is not an array:", boundaries);
      return false;
    }
    
    return boundaries.some(boundary => 
      Array.isArray(boundary) && 
      boundary.length >= 3 && 
      boundary.every(point => 
        Array.isArray(point) && 
        point.length === 2 && 
        !isNaN(Number(point[0])) && 
        !isNaN(Number(point[1]))
      )
    );
  }, [boundaries]);
  
  const {
    measurements,
    mapEventHandlers,
    zoomControls
  } = usePropertyMap(canvasRef, containerRef, boundaries);

  // Update showEdgeMeasurements when measureMode prop changes
  useEffect(() => {
    setShowEdgeMeasurements(measureMode);
  }, [measureMode]);

  const handleReset = () => {
    zoomControls.handleReset();
    toast.success("Map view reset");
  };

  const handleToggleEdgeMeasurements = () => {
    setShowEdgeMeasurements(prev => !prev);
    toast.success(showEdgeMeasurements ? "Edge measurements hidden" : "Edge measurements shown");
  };

  // If there are no valid boundaries, show a message
  if (!hasValidBoundaries) {
    return (
      <Card className="w-full">
        <MapHeader 
          title={title} 
          description={description} 
          boundaries={[]} 
          onReset={handleReset} 
          onToggleEdgeMeasurements={handleToggleEdgeMeasurements} 
          showEdgeMeasurements={false} 
          measureMode={false} 
        />
        <CardContent className="p-4 flex items-center justify-center min-h-[400px]">
          <div className="text-center text-muted-foreground">
            <p className="mb-2">No valid boundary data available for this property.</p>
            <p className="text-sm">Please select a different property or upload a valid GeoJSON file.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full h-full flex flex-col">
      <MapHeader 
        title={title}
        description={description}
        onReset={handleReset}
        boundaries={boundaries}
        onToggleEdgeMeasurements={handleToggleEdgeMeasurements}
        showEdgeMeasurements={showEdgeMeasurements}
        measureMode={measureMode}
      />
      <CardContent className="flex-1 p-0 relative">
        <MapCanvas
          ref={canvasRef}
          containerRef={containerRef}
          {...mapEventHandlers}
        />
        {hasValidBoundaries && (
          <>
            <MeasurementsDisplay measurements={measurements} />
            {showEdgeMeasurements && (
              <BoundaryMeasurements measurements={measurements} />
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CustomPropertyMap;
