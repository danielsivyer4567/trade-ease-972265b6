
import React, { useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { CustomPropertyMapProps } from './types';
import { MapCanvas } from './MapCanvas';
import { MapHeader } from './MapHeader';
import { MeasurementsDisplay } from './MeasurementsDisplay';
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
  
  const {
    measurements,
    mapEventHandlers,
    zoomControls
  } = usePropertyMap(canvasRef, containerRef, boundaries);
  
  const handleReset = () => {
    zoomControls.handleReset();
    toast.success("Map view reset");
  };
  
  return (
    <Card className="w-full">
      <MapHeader 
        title={title}
        description={description}
        boundaries={boundaries}
        onReset={handleReset}
        measureMode={measureMode}
      />
      
      <CardContent>
        <MapCanvas
          canvasRef={canvasRef}
          containerRef={containerRef}
          mapEventHandlers={mapEventHandlers}
          zoomControls={zoomControls}
          measureMode={measureMode}
        />
        
        <MeasurementsDisplay
          boundaryLength={measurements.boundaryLength}
          boundaryArea={measurements.boundaryArea}
          individualBoundaries={measurements.individualBoundaries}
          highlighted={measureMode}
        />
      </CardContent>
    </Card>
  );
};

export default CustomPropertyMap;
