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
      console.log('No boundaries to process or boundaries is invalid:', boundaries);
      return;
    }
    
    // Validate boundaries format and ensure each boundary point is a valid coordinate
    const validBoundaries = boundaries.filter(boundary => {
      if (!Array.isArray(boundary)) return false;
      if (boundary.length < 3) return false; // Need at least 3 points to form a polygon
      
      // Check each point is a valid [number, number] tuple
      return boundary.every(point => 
        Array.isArray(point) && 
        point.length === 2 && 
        typeof point[0] === 'number' && 
        typeof point[1] === 'number' &&
        !isNaN(point[0]) && 
        !isNaN(point[1])
      );
    });
    
    if (validBoundaries.length === 0) {
      console.error('No valid boundaries found after validation. Original boundaries:', boundaries);
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
      const convertedBoundaries = convertBoundariesToPropertyBoundaries(validBoundaries);
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
