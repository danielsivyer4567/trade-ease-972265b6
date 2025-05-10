import { RefObject } from 'react';

export interface Coordinate {
  x: number;
  y: number;
}

export interface PropertyBoundary {
  name: string;
  points: Array<{ x: number; y: number }>;
}

export interface BoundaryEdge {
  start: { x: number; y: number };
  end: { x: number; y: number };
  length: number;
  bearing: number;
  boundaryIndex: number;
}

export interface CustomPropertyMapProps {
  boundaries?: Array<Array<[number, number]>>;
  title?: string;
  description?: string;
  centerPoint?: [number, number];
  measureMode?: boolean;
}

export interface MapHeaderProps {
  title: string;
  description: string;
  onReset: () => void;
  zoomControls: {
    handleZoomIn: () => void;
    handleZoomOut: () => void;
    handleReset: () => void;
  };
}

export interface MapCanvasProps {
  containerRef: RefObject<HTMLDivElement>;
  onMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseUp: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onTouchStart: (e: React.TouchEvent<HTMLCanvasElement>) => void;
  onTouchMove: (e: React.TouchEvent<HTMLCanvasElement>) => void;
  onTouchEnd: (e: React.TouchEvent<HTMLCanvasElement>) => void;
}

export interface MeasurementsDisplayProps {
  measurements: MapMeasurements;
}

export interface BoundaryMeasurementsProps {
  measurements: MapMeasurements;
  showMeasurements?: boolean;
}

export interface IndividualBoundaryMeasurement {
  name: string;
  length: number;
  area: number;
}

export interface MapMeasurements {
  boundaryLength: number;
  boundaryArea: number;
  individualBoundaries: Array<{
    name: string;
    length: number;
    area: number;
  }>;
  edges: BoundaryEdge[];
}

export interface MapState {
  scale: number;
  offset: { x: number; y: number };
  isDragging: boolean;
  lastMousePosition: { x: number; y: number } | null;
}
