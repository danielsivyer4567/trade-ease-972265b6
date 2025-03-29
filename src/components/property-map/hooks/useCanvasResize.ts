
import { useEffect, RefObject } from 'react';

/**
 * Hook for handling canvas resize operations
 */
export function useCanvasResize(
  canvasRef: RefObject<HTMLCanvasElement>,
  containerRef: RefObject<HTMLDivElement>
) {
  useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current || !containerRef.current) return;
      
      canvasRef.current.width = containerRef.current.clientWidth;
      canvasRef.current.height = containerRef.current.clientHeight;
      
      // Trigger a redraw
      const event = new Event('resize');
      window.dispatchEvent(event);
    };
    
    // Initial resize
    handleResize();
    
    // Add resize listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, [canvasRef, containerRef]);
}
