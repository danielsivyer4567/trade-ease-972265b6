
import { Coordinate, PropertyBoundary } from './types';

// Convert raw boundaries to our Coordinate format
export function convertBoundariesToPropertyBoundaries(boundaries: Array<Array<[number, number]>>): PropertyBoundary[] {
  return boundaries.map((boundary, index) => {
    return {
      points: boundary.map(([lng, lat]) => ({ x: lng, y: lat })),
      name: `Boundary ${index + 1}`
    };
  });
}

// Calculate perimeter and area for all boundaries
export function calculateBoundaryMeasurements(boundaries: PropertyBoundary[]) {
  let totalLength = 0;
  let totalArea = 0;
  
  boundaries.forEach(boundary => {
    const { length, area } = calculateSingleBoundaryMeasurements(boundary.points);
    totalLength += length;
    totalArea += area;
  });
  
  return { totalLength, totalArea };
}

// Calculate perimeter length and area for a single boundary
export function calculateSingleBoundaryMeasurements(points: Coordinate[]) {
  if (points.length < 3) return { length: 0, area: 0 };
  
  let length = 0;
  let area = 0;
  
  // Calculate perimeter (length)
  for (let i = 0; i < points.length; i++) {
    const p1 = points[i];
    const p2 = points[(i + 1) % points.length];
    length += calculateDistance(p1, p2);
  }
  
  // Calculate area using Shoelace formula
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    area += points[i].x * points[j].y;
    area -= points[j].x * points[i].y;
  }
  area = Math.abs(area) / 2;
  
  return { length, area };
}

// Calculate distance between two points using Haversine formula for geographical coordinates
export function calculateDistance(p1: Coordinate, p2: Coordinate) {
  const R = 6371000; // Earth radius in meters
  const φ1 = p1.y * Math.PI / 180;
  const φ2 = p2.y * Math.PI / 180;
  const Δφ = (p2.y - p1.y) * Math.PI / 180;
  const Δλ = (p2.x - p1.x) * Math.PI / 180;
  
  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  
  return R * c;
}

// Format measurements for display
export function formatMeasurements(boundaryLength: number, boundaryArea: number) {
  return {
    length: {
      meters: boundaryLength.toFixed(2),
      kilometers: (boundaryLength / 1000).toFixed(2)
    },
    area: {
      squareMeters: boundaryArea.toFixed(2),
      hectares: (boundaryArea / 10000).toFixed(4)
    }
  };
}
