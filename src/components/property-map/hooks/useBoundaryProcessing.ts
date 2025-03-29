
import { useState, useEffect } from 'react';
import { PropertyBoundary, MapMeasurements } from '../types';
import { 
  convertBoundariesToPropertyBoundaries, 
  calculateBoundaryMeasurements,
  calculateSingleBoundaryMeasurements
} from '../mapUtils';

/**
 * Hook for processing boundary data
 */
export function useBoundaryProcessing(boundaries: Array<Array<[number, number]>>) {
  const [propertyBoundaries, setPropertyBoundaries] = useState<PropertyBoundary[]>([]);
  const [measurements, setMeasurements] = useState<MapMeasurements>({
    boundaryLength: 0,
    boundaryArea: 0,
    individualBoundaries: []
  });

  useEffect(() => {
    if (!boundaries?.length) {
      // Set default values when no boundaries are present
      setPropertyBoundaries([]);
      setMeasurements({
        boundaryLength: 0,
        boundaryArea: 0,
        individualBoundaries: []
      });
      return;
    }
    
    const convertedBoundaries = convertBoundariesToPropertyBoundaries(boundaries);
    setPropertyBoundaries(convertedBoundaries);
    
    const { totalLength, totalArea } = calculateBoundaryMeasurements(convertedBoundaries);
    
    // Calculate individual boundary measurements
    const individualMeasurements = convertedBoundaries.map((boundary, index) => {
      const { length, area } = calculateSingleBoundaryMeasurements(boundary.points);
      return {
        name: `Boundary ${index + 1}`,
        length,
        area
      };
    });
    
    setMeasurements({
      boundaryLength: totalLength,
      boundaryArea: totalArea,
      individualBoundaries: individualMeasurements
    });
  }, [boundaries]);

  return {
    propertyBoundaries,
    measurements
  };
}
