
import { useState, useEffect } from 'react';
import { PropertyBoundary, MapMeasurements, BoundaryEdge } from '../types';
import { 
  convertBoundariesToPropertyBoundaries, 
  calculateBoundaryMeasurements,
  calculateSingleBoundaryMeasurements,
  calculateBoundaryEdges
} from '../mapUtils';

/**
 * Hook for processing boundary data
 */
export function useBoundaryProcessing(boundaries: Array<Array<[number, number]>> = []) {
  const [propertyBoundaries, setPropertyBoundaries] = useState<PropertyBoundary[]>([]);
  const [measurements, setMeasurements] = useState<MapMeasurements>({
    boundaryLength: 0,
    boundaryArea: 0,
    individualBoundaries: [],
    edges: []
  });

  useEffect(() => {
    // Check if boundaries is null, undefined, or empty
    if (!boundaries || !Array.isArray(boundaries) || boundaries.length === 0) {
      // Set default values when no boundaries are present
      setPropertyBoundaries([]);
      setMeasurements({
        boundaryLength: 0,
        boundaryArea: 0,
        individualBoundaries: [],
        edges: []
      });
      return;
    }
    
    // Process boundaries and convert to property boundaries format
    try {
      const convertedBoundaries = convertBoundariesToPropertyBoundaries(boundaries);
      setPropertyBoundaries(convertedBoundaries);
      
      // Calculate total measurements
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
      
      // Calculate boundary edges with measurements
      const edges = convertedBoundaries.flatMap((boundary, boundaryIndex) => 
        calculateBoundaryEdges(boundary.points, boundaryIndex)
      );
      
      // Update measurements state
      setMeasurements({
        boundaryLength: totalLength,
        boundaryArea: totalArea,
        individualBoundaries: individualMeasurements,
        edges
      });
      
      console.log('Boundary measurements calculated:', {
        totalLength,
        totalArea,
        individualMeasurements,
        edgesCount: edges.length
      });
    } catch (error) {
      console.error('Error processing boundaries:', error);
      
      // Set default values on error
      setPropertyBoundaries([]);
      setMeasurements({
        boundaryLength: 0,
        boundaryArea: 0,
        individualBoundaries: [],
        edges: []
      });
    }
  }, [boundaries]);

  return {
    propertyBoundaries,
    measurements
  };
}
