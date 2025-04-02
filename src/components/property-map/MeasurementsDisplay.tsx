
import React from 'react';
import { IndividualBoundaryMeasurement } from './types';
import { MapPin, Ruler } from 'lucide-react';

interface MeasurementsDisplayProps {
  boundaryLength: number;
  boundaryArea: number;
  individualBoundaries: IndividualBoundaryMeasurement[];
}

export const MeasurementsDisplay: React.FC<MeasurementsDisplayProps> = ({
  boundaryLength,
  boundaryArea,
  individualBoundaries
}) => {
  if (boundaryLength <= 0 && boundaryArea <= 0) {
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
          <div className="font-semibold">{boundaryLength.toFixed(2)} m</div>
          <div className="text-gray-400 text-xs">({(boundaryLength / 1000).toFixed(4)} km)</div>
        </div>
        
        <div className="text-xs">
          <span className="text-gray-500">Total area:</span>
          <div className="font-semibold">{boundaryArea.toFixed(2)} m²</div>
          <div className="text-gray-400 text-xs">({(boundaryArea / 10000).toFixed(4)} hectares)</div>
        </div>
      </div>
      
      {individualBoundaries.length > 1 && (
        <div className="mt-2 pt-2 border-t border-gray-200">
          <h4 className="text-xs font-medium mb-1">Individual Boundaries:</h4>
          <div className="max-h-20 overflow-y-auto">
            {individualBoundaries.map((boundary, index) => (
              <div key={index} className="flex justify-between text-xs mb-1">
                <span>{boundary.name}:</span>
                <span>{boundary.area.toFixed(2)} m²</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
