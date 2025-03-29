
import { useState } from 'react';
import { MapState, Coordinate } from '../types';

/**
 * Hook for managing map state (zoom, pan, dragging)
 */
export function useMapState() {
  const [mapState, setMapState] = useState<MapState>({
    scale: 1,
    offset: { x: 0, y: 0 },
    isDragging: false,
    dragStart: { x: 0, y: 0 }
  });

  // Track pinch zoom state
  const [pinchData, setPinchData] = useState({
    initialDistance: 0,
    isZooming: false
  });

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setMapState(prev => ({
      ...prev,
      isDragging: true,
      dragStart: {
        x: e.clientX - prev.offset.x,
        y: e.clientY - prev.offset.y
      }
    }));
  };
  
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    // Handle pinch zoom start (two fingers)
    if (e.touches.length === 2) {
      // Calculate initial distance between touch points
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      
      setPinchData({
        initialDistance: distance,
        isZooming: true
      });
      return;
    }
    
    // Handle single touch for panning
    if (e.touches.length === 1) {
      setMapState(prev => ({
        ...prev,
        isDragging: true,
        dragStart: {
          x: e.touches[0].clientX - prev.offset.x,
          y: e.touches[0].clientY - prev.offset.y
        }
      }));
    }
  };
  
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (mapState.isDragging) {
      setMapState(prev => ({
        ...prev,
        offset: {
          x: e.clientX - prev.dragStart.x,
          y: e.clientY - prev.dragStart.y
        }
      }));
    }
  };
  
  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    // Handle pinch zoom
    if (e.touches.length === 2 && pinchData.isZooming) {
      e.preventDefault(); // Prevent page scrolling
      
      // Calculate current distance between touch points
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const currentDistance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      
      // Calculate zoom scale factor
      const scale = currentDistance / pinchData.initialDistance;
      
      // Apply zoom only if the change is significant
      if (Math.abs(scale - 1) > 0.01) {
        setMapState(prev => ({
          ...prev,
          scale: Math.max(0.5, Math.min(5, prev.scale * scale))
        }));
        
        setPinchData({
          initialDistance: currentDistance,
          isZooming: true
        });
      }
      
      return;
    }
    
    // Handle standard touch move for panning
    if (mapState.isDragging && e.touches.length === 1) {
      e.preventDefault(); // Prevent page scrolling during pan
      setMapState(prev => ({
        ...prev,
        offset: {
          x: e.touches[0].clientX - prev.dragStart.x,
          y: e.touches[0].clientY - prev.dragStart.y
        }
      }));
    }
  };
  
  const handleMouseUp = () => {
    setMapState(prev => ({
      ...prev,
      isDragging: false
    }));
  };
  
  const handleTouchEnd = () => {
    // Reset touch zooming state
    setPinchData({
      initialDistance: 0,
      isZooming: false
    });
    
    setMapState(prev => ({
      ...prev,
      isDragging: false
    }));
  };
  
  const handleZoomIn = () => {
    setMapState(prev => ({
      ...prev, 
      scale: prev.scale * 1.2
    }));
  };
  
  const handleZoomOut = () => {
    setMapState(prev => ({
      ...prev,
      scale: prev.scale / 1.2
    }));
  };
  
  const handleReset = () => {
    setMapState({
      scale: 1,
      offset: { x: 0, y: 0 },
      isDragging: false,
      dragStart: { x: 0, y: 0 }
    });
  };

  return {
    mapState,
    mapEventHandlers: {
      handleMouseDown,
      handleMouseMove,
      handleMouseUp,
      handleTouchStart,
      handleTouchMove,
      handleTouchEnd
    },
    zoomControls: {
      handleZoomIn,
      handleZoomOut,
      handleReset
    }
  };
}
