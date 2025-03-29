
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
    if (mapState.isDragging && e.touches.length === 1) {
      e.preventDefault();
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
