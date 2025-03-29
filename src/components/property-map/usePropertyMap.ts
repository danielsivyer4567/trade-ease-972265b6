
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
  // Process boundaries into the format needed for rendering
  const { propertyBoundaries, measurements } = useBoundaryProcessing(boundaries);
  
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
