
import { useState, useEffect } from 'react';
import { PropertyBoundary, MapMeasurements } from '../types';
import { 
  convertBoundariesToPropertyBoundaries, 
  calculateBoundaryMeasurements 
} from '../mapUtils';

/**
 * Hook for processing boundary data
 */
export function useBoundaryProcessing(boundaries: Array<Array<[number, number]>>) {
  const [propertyBoundaries, setPropertyBoundaries] = useState<PropertyBoundary[]>([]);
  const [measurements, setMeasurements] = useState<MapMeasurements>({
    boundaryLength: 0,
    boundaryArea: 0
  });

  useEffect(() => {
    if (!boundaries.length) return;
    
    const convertedBoundaries = convertBoundariesToPropertyBoundaries(boundaries);
    setPropertyBoundaries(convertedBoundaries);
    
    const { totalLength, totalArea } = calculateBoundaryMeasurements(convertedBoundaries);
    setMeasurements({
      boundaryLength: totalLength,
      boundaryArea: totalArea
    });
  }, [boundaries]);

  return {
    propertyBoundaries,
    measurements
  };
}
