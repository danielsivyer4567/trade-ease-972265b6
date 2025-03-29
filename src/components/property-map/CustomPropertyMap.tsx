
import React, { useRef, useState } from 'react';
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
  const [showEdgeMeasurements, setShowEdgeMeasurements] = useState(false);
  
  const {
    measurements,
    mapEventHandlers,
    zoomControls
  } = usePropertyMap(canvasRef, containerRef, boundaries);
  
  const handleReset = () => {
    zoomControls.handleReset();
    toast.success("Map view reset");
  };
  
  const handleToggleEdgeMeasurements = () => {
    setShowEdgeMeasurements(prev => !prev);
    toast.success(showEdgeMeasurements 
      ? "Edge measurements hidden" 
      : "Edge measurements shown");
  };
  
  return (
    <Card className="w-full">
      <MapHeader 
        title={title}
        description={description}
        boundaries={boundaries}
        onReset={handleReset}
        onToggleEdgeMeasurements={handleToggleEdgeMeasurements}
        showEdgeMeasurements={showEdgeMeasurements}
        measureMode={measureMode}
      />
      
      <CardContent>
        <MapCanvas
          canvasRef={canvasRef}
          containerRef={containerRef}
          mapEventHandlers={mapEventHandlers}
          zoomControls={zoomControls}
          measureMode={measureMode || showEdgeMeasurements}
        />
        
        <MeasurementsDisplay
          boundaryLength={measurements.boundaryLength}
          boundaryArea={measurements.boundaryArea}
          individualBoundaries={measurements.individualBoundaries}
          highlighted={measureMode}
        />
        
        <BoundaryMeasurements 
          edges={measurements.edges}
          showMeasurements={showEdgeMeasurements}
        />
      </CardContent>
    </Card>
  );
};

export default CustomPropertyMap;
