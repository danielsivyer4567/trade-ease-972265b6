
import React from 'react';
import { MapPin, Ruler } from 'lucide-react';
import { formatMeasurements } from './mapUtils';

interface MeasurementsDisplayProps {
  boundaryLength: number;
  boundaryArea: number;
  highlighted?: boolean;
}

export const MeasurementsDisplay: React.FC<MeasurementsDisplayProps> = ({
  boundaryLength,
  boundaryArea,
  highlighted = false
}) => {
  const formattedMeasurements = formatMeasurements(boundaryLength, boundaryArea);
  
  const baseClasses = "bg-secondary/10 rounded-lg p-4";
  const highlightedClasses = highlighted ? "ring-2 ring-primary/50 bg-primary/5" : "";
  
  return (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className={`${baseClasses} ${highlightedClasses} transition-all`}>
        <h3 className="text-sm font-medium mb-1 flex items-center gap-2">
          <Ruler className={`h-4 w-4 ${highlighted ? "text-primary" : ""}`} />
          Boundary Length
        </h3>
        <div className={`text-2xl font-bold ${highlighted ? "text-primary" : ""}`}>
          {formattedMeasurements.length.meters} m
        </div>
        <div className="text-sm text-muted-foreground">
          ({formattedMeasurements.length.kilometers} km)
        </div>
      </div>
      
      <div className={`${baseClasses} ${highlightedClasses} transition-all`}>
        <h3 className="text-sm font-medium mb-1 flex items-center gap-2">
          <MapPin className={`h-4 w-4 ${highlighted ? "text-primary" : ""}`} />
          Property Area
        </h3>
        <div className={`text-2xl font-bold ${highlighted ? "text-primary" : ""}`}>
          {formattedMeasurements.area.squareMeters} m²
        </div>
        <div className="text-sm text-muted-foreground">
          ({formattedMeasurements.area.hectares} hectares)
        </div>
      </div>
    </div>
  );
};
