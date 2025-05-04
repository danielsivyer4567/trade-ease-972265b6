import { Coordinate, PropertyBoundary, BoundaryEdge } from './types';

/**
 * Converts boundary coordinates to PropertyBoundary format
 * Handles different coordinate formats with robust validation
 */
export const convertBoundariesToPropertyBoundaries = (
  boundaries: Array<Array<[number, number]>> = []
): PropertyBoundary[] => {
  if (!boundaries || !Array.isArray(boundaries)) return [];
  
  return boundaries.map((boundary, index) => {
    if (!Array.isArray(boundary)) {
      console.error('Invalid boundary format:', boundary);
      return {
        name: `Boundary ${index + 1}`,
        points: []
      };
    }
    
    // Map and validate each point
    const points = boundary.map(point => {
      if (!Array.isArray(point) || point.length !== 2) {
        console.error('Invalid boundary point format:', point);
        return null;
      }
      
      // Ensure we're working with numbers
      const lat = Number(point[0]);
      const lng = Number(point[1]);
      
      if (isNaN(lat) || isNaN(lng)) {
        console.error('NaN values in boundary point:', point);
        return null;
      }
      
      return { x: lat, y: lng };
    }).filter(Boolean) as Coordinate[]; // Filter out null points
    
    return {
      name: `Boundary ${index + 1}`,
      points
    };
  }).filter(boundary => boundary.points.length >= 3); // Require at least 3 points to form a polygon
};

export const calculateDistance = (point1: Coordinate, point2: Coordinate): number => {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return Math.sqrt(dx * dx + dy * dy);
};

export const calculateSingleBoundaryMeasurements = (points: Coordinate[]) => {
  if (!points || points.length < 3) {
    return { length: 0, area: 0 };
  }

  let length = 0;
  let area = 0;

  // Calculate perimeter length
  for (let i = 0; i < points.length; i++) {
    const nextIndex = (i + 1) % points.length;
    length += calculateDistance(points[i], points[nextIndex]);
  }

  // Calculate area using Shoelace formula
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    area += points[i].x * points[j].y;
    area -= points[j].x * points[i].y;
  }
  area = Math.abs(area) / 2;

  return { length, area };
};

export const calculateBoundaryMeasurements = (boundaries: PropertyBoundary[]) => {
  if (!boundaries || boundaries.length === 0) {
    return { totalLength: 0, totalArea: 0 };
  }

  let totalLength = 0;
  let totalArea = 0;

  boundaries.forEach(boundary => {
    const { length, area } = calculateSingleBoundaryMeasurements(boundary.points);
    totalLength += length;
    totalArea += area;
  });

  return { totalLength, totalArea };
};

export const calculateBoundaryEdges = (points: Coordinate[], boundaryIndex: number): BoundaryEdge[] => {
  if (!points || points.length < 3) return [];
  
  const edges: BoundaryEdge[] = [];
  
  for (let i = 0; i < points.length; i++) {
    const nextIndex = (i + 1) % points.length;
    const start = points[i];
    const end = points[nextIndex];
    const distance = calculateDistance(start, end);
    
    // Calculate midpoint for label positioning
    const midpoint = {
      x: (start.x + end.x) / 2,
      y: (start.y + end.y) / 2
    };
    
    edges.push({
      id: `edge-${boundaryIndex}-${i}`,
      boundaryIndex,
      edgeIndex: i,
      start,
      end,
      midpoint,
      length: distance,
      displayLength: distance.toFixed(2)
    });
  }
  
  return edges;
};

export const formatMeasurements = (length: number, area: number) => {
  // Ensure we don't have NaN or negative values
  const safeLength = isNaN(length) || length < 0 ? 0 : length;
  const safeArea = isNaN(area) || area < 0 ? 0 : area;

  return {
    length: {
      meters: safeLength.toFixed(2),
      kilometers: (safeLength / 1000).toFixed(4)
    },
    area: {
      squareMeters: safeArea.toFixed(2),
      hectares: (safeArea / 10000).toFixed(4)
    }
  };
};
