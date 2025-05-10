import React from 'react';
import { IndividualBoundaryMeasurement, MapMeasurements } from './types';
import { MapPin, Ruler } from 'lucide-react';

export interface MeasurementsDisplayProps {
  boundaryLength?: number;
  boundaryArea?: number;
  individualBoundaries?: IndividualBoundaryMeasurement[];
  measurements?: MapMeasurements;
  showEdgeMeasurements?: boolean;
}

export const MeasurementsDisplay: React.FC<MeasurementsDisplayProps> = ({
  boundaryLength,
  boundaryArea,
  individualBoundaries,
  measurements,
  showEdgeMeasurements = false
}) => {
  // Use measurements object if provided, otherwise use individual props
  const length = measurements?.boundaryLength ?? boundaryLength ?? 0;
  const area = measurements?.boundaryArea ?? boundaryArea ?? 0;
  const boundaries = measurements?.individualBoundaries ?? individualBoundaries ?? [];

  if (!length && !area) {
    return null;
  }
  
  return (
    <div className="absolute left-4 bottom-4 right-4 lg:left-auto lg:w-72 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-md border">
      <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
        <Ruler className="h-4 w-4 text-primary" />
        Property Measurements
      </h3>
      
      <div className="grid grid-cols-2 gap-2">
        <div className="text-xs">
          <span className="text-gray-500">Total length:</span>
          <div className="font-semibold">{length.toFixed(2)} m</div>
          <div className="text-gray-400 text-xs">({(length / 1000).toFixed(4)} km)</div>
        </div>
        
        <div className="text-xs">
          <span className="text-gray-500">Total area:</span>
          <div className="font-semibold">{area.toFixed(2)} m²</div>
          <div className="text-gray-400 text-xs">({(area / 10000).toFixed(4)} hectares)</div>
        </div>
      </div>
      
      {boundaries.length > 1 && (
        <div className="mt-2 pt-2 border-t border-gray-200">
          <h4 className="text-xs font-medium mb-1">Individual Boundaries:</h4>
          <div className="max-h-20 overflow-y-auto">
            {boundaries.map((boundary, index) => (
              <div key={index} className="flex justify-between text-xs mb-1">
                <span>{boundary.name}:</span>
                <span>{boundary.area?.toFixed(2) || '0.00'} m²</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
