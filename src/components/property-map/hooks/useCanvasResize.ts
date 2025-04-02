
import { useEffect, RefObject } from 'react';

/**
 * Hook to handle canvas resizing based on container size
 */
export function useCanvasResize(
  canvasRef: RefObject<HTMLCanvasElement>,
  containerRef: RefObject<HTMLDivElement>
) {
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current || !canvasRef.current) return;
      
      // Set canvas dimensions to match container
      canvasRef.current.width = containerRef.current.clientWidth;
      canvasRef.current.height = containerRef.current.clientHeight;
    };
    
    // Call once to initialize
    handleResize();
    
    // Add resize event listener
    window.addEventListener('resize', handleResize);
    
    // Handle orientation changes on mobile
    window.addEventListener('orientationchange', handleResize);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [canvasRef, containerRef]);
}
