import { RefObject } from 'react';
import { 
  useMapState, 
  useBoundaryProcessing, 
  useMapRendering,
  useCanvasResize
} from './hooks';

/**
 * Main hook for property map functionality
 */
export function usePropertyMap(
  canvasRef: RefObject<HTMLCanvasElement>,
  containerRef: RefObject<HTMLDivElement>,
  boundaries: Array<Array<[number, number]>>
) {
  // Validate boundaries to ensure they exist and are properly structured
  const validBoundaries = Array.isArray(boundaries) ? 
    boundaries.filter(boundary => 
      Array.isArray(boundary) && 
      boundary.length >= 3 && 
      boundary.every(point => 
        Array.isArray(point) && 
        point.length === 2 && 
        typeof point[0] === 'number' && 
        typeof point[1] === 'number' && 
        !isNaN(point[0]) && 
        !isNaN(point[1])
      )
    ) : [];

  // Process boundaries into the format needed for rendering
  const { propertyBoundaries, measurements } = useBoundaryProcessing(validBoundaries);
  
  // Handle map state (zoom, pan, drag)
  const { mapState, mapEventHandlers, zoomControls } = useMapState();
  
  // Handle canvas resize
  useCanvasResize(canvasRef, containerRef);
  
  // Render the map
  useMapRendering(canvasRef, containerRef, propertyBoundaries, mapState);

  return {
    measurements,
    mapEventHandlers,
    zoomControls
  };
}
