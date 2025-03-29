
import { Coordinate, PropertyBoundary } from './types';

export const convertBoundariesToPropertyBoundaries = (
  boundaries: Array<Array<[number, number]>> = []
): PropertyBoundary[] => {
  if (!boundaries || !Array.isArray(boundaries)) return [];
  
  return boundaries.map((boundary, index) => {
    return {
      name: `Boundary ${index + 1}`,
      points: boundary.map(([x, y]) => ({ x, y }))
    };
  });
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
