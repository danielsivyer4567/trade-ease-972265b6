
import React from 'react';
import { MapPin, Ruler } from 'lucide-react';
import { formatMeasurements } from './mapUtils';
import { IndividualBoundaryMeasurement } from './types';

interface MeasurementsDisplayProps {
  boundaryLength: number;
  boundaryArea: number;
  individualBoundaries: IndividualBoundaryMeasurement[];
  highlighted?: boolean;
}

export const MeasurementsDisplay: React.FC<MeasurementsDisplayProps> = ({
  boundaryLength,
  boundaryArea,
  individualBoundaries = [],
  highlighted = false
}) => {
  const formattedMeasurements = formatMeasurements(boundaryLength, boundaryArea);
  
  const baseClasses = "bg-secondary/10 rounded-lg p-4";
  const highlightedClasses = highlighted ? "ring-2 ring-primary/50 bg-primary/5" : "";
  
  return (
    <div className="space-y-4 mt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`${baseClasses} ${highlightedClasses} transition-all`}>
          <h3 className="text-sm font-medium mb-1 flex items-center gap-2">
            <Ruler className={`h-4 w-4 ${highlighted ? "text-primary" : ""}`} />
            Total Boundary Length
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
            Total Property Area
          </h3>
          <div className={`text-2xl font-bold ${highlighted ? "text-primary" : ""}`}>
            {formattedMeasurements.area.squareMeters} m²
          </div>
          <div className="text-sm text-muted-foreground">
            ({formattedMeasurements.area.hectares} hectares)
          </div>
        </div>
      </div>
      
      {individualBoundaries && individualBoundaries.length > 0 && (
        <div className={`${baseClasses} ${highlightedClasses} transition-all`}>
          <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
            <Ruler className={`h-4 w-4 ${highlighted ? "text-primary" : ""}`} />
            Individual Boundary Measurements
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {individualBoundaries.map((boundary, index) => {
              const formattedArea = boundary.area.toFixed(2);
              const formattedLength = boundary.length.toFixed(2);
              
              return (
                <div key={index} className="bg-white/50 p-3 rounded-md border border-gray-200">
                  <h4 className="text-sm font-medium mb-1">{boundary.name}</h4>
                  <div className="flex items-center gap-1">
                    <Ruler className="h-3 w-3 text-muted-foreground" /> 
                    <span className="text-lg font-semibold">{formattedLength} m</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> Area: {formattedArea} m²
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
