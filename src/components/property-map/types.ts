
export interface Coordinate {
  x: number;
  y: number;
}

export interface PropertyBoundary {
  points: Coordinate[];
  name: string;
}

export interface BoundaryEdge {
  id: string;
  boundaryIndex: number;
  edgeIndex: number;
  start: Coordinate;
  end: Coordinate;
  midpoint: Coordinate;
  length: number;
  displayLength: string;
}

export interface CustomPropertyMapProps {
  boundaries: Array<Array<[number, number]>>; // Array of polygon coordinates
  title?: string;
  description?: string;
  centerPoint?: [number, number];
  measureMode?: boolean;
}

export interface IndividualBoundaryMeasurement {
  name: string;
  length: number;
  area: number;
}

export interface MapMeasurements {
  boundaryLength: number;
  boundaryArea: number;
  individualBoundaries: IndividualBoundaryMeasurement[];
  edges: BoundaryEdge[];
}

export interface MapState {
  scale: number;
  offset: Coordinate;
  isDragging: boolean;
  dragStart: Coordinate;
}
