import React, { useRef, useState, useEffect } from 'react';
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
  return <Card className="w-full">
      <MapHeader title={title} description={description} boundaries={boundaries} onReset={handleReset} onToggleEdgeMeasurements={handleToggleEdgeMeasurements} showEdgeMeasurements={showEdgeMeasurements} measureMode={measureMode} />
      
      
    </Card>;
};
export default CustomPropertyMap;