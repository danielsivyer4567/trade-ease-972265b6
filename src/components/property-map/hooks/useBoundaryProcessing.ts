import { useState, useEffect, useMemo } from 'react';
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

  // Memoize the validation of boundaries to prevent unnecessary processing
  const validBoundaries = useMemo(() => {
    if (!boundaries || !Array.isArray(boundaries) || boundaries.length === 0) {
      return [];
    }
    
    return boundaries.filter(boundary => {
      if (!Array.isArray(boundary)) return false;
      if (boundary.length < 3) return false; // Need at least 3 points to form a polygon
      
      // Check each point is a valid [number, number] tuple
      return boundary.every(point => {
        if (!Array.isArray(point) || point.length !== 2) return false;
        
        const lat = Number(point[0]);
        const lng = Number(point[1]);
        
        return !isNaN(lat) && !isNaN(lng);
      });
    });
  }, [boundaries]);

  // Process boundaries only when validBoundaries changes
  useEffect(() => {
    if (validBoundaries.length === 0) {
      setPropertyBoundaries([]);
      setMeasurements({
        boundaryLength: 0,
        boundaryArea: 0,
        individualBoundaries: [],
        edges: []
      });
      return;
    }
    
    try {
      // Convert valid boundaries to standard number format
      const normalizedBoundaries = validBoundaries.map(boundary => 
        boundary.map(point => [Number(point[0]), Number(point[1])] as [number, number])
      );
      
      // Process boundaries and convert to property boundaries format
      const convertedBoundaries = convertBoundariesToPropertyBoundaries(normalizedBoundaries);
      
      // Calculate measurements only if we have valid boundaries
      if (convertedBoundaries.length > 0) {
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
        
        // Update state with new values
        setPropertyBoundaries(convertedBoundaries);
        setMeasurements({
          boundaryLength: totalLength,
          boundaryArea: totalArea,
          individualBoundaries: individualMeasurements,
          edges
        });
      } else {
        // Reset state if no valid boundaries after conversion
        setPropertyBoundaries([]);
        setMeasurements({
          boundaryLength: 0,
          boundaryArea: 0,
          individualBoundaries: [],
          edges: []
        });
      }
    } catch (error) {
      console.error('Error processing boundaries:', error);
      
      // Reset state on error
      setPropertyBoundaries([]);
      setMeasurements({
        boundaryLength: 0,
        boundaryArea: 0,
        individualBoundaries: [],
        edges: []
      });
    }
  }, [validBoundaries]); // Only re-run when validBoundaries changes

  return {
    propertyBoundaries,
    measurements
  };
}
