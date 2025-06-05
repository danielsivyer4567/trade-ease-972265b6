import { useState, useCallback, useEffect, useRef } from 'react';
import { Edge } from '@xyflow/react';

interface UseWorkflowAnimationProps {
  edges: Edge[];
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  animationDuration?: number;
}

/**
 * Custom hook for managing animated edge effects in workflow diagrams
 * 
 * @param edges - Array of workflow edges
 * @param setEdges - State setter function for edges
 * @param animationDuration - Duration of animation in ms (default: 5000)
 * @returns Functions to control edge animations
 */
export function useWorkflowAnimation({ 
  edges, 
  setEdges,
  animationDuration = 5000
}: UseWorkflowAnimationProps) {
  // Use a ref to store active edge IDs to avoid state-driven reflows
  const activeEdgesRef = useRef<Set<string>>(new Set());
  // Expose a state version just for tracking in UI
  const [activeEdges, setActiveEdgesState] = useState<Set<string>>(new Set());
  // Track the last update timestamp to prevent race conditions
  const lastUpdateRef = useRef<number>(Date.now());
  // Throttle edge updates to prevent flickering
  const updateThrottleRef = useRef<NodeJS.Timeout | null>(null);
  
  // Apply edge styling directly using DOM manipulation instead of React state
  const applyEdgeStyling = useCallback((edgeId: string, isActive: boolean) => {
    // Find the edge DOM element directly
    requestAnimationFrame(() => {
      try {
        const edgeElement = document.querySelector(`[data-edge-id="${edgeId}"] path`);
        if (edgeElement) {
          if (isActive) {
            edgeElement.classList.add('workflow-edge-active-path');
          } else {
            edgeElement.classList.remove('workflow-edge-active-path');
          }
        }
      } catch (error) {
        console.error('Failed to apply direct edge styling:', error);
      }
    });
  }, []);
  
  // Throttled edge updates to prevent too many state changes
  const scheduleEdgeUpdate = useCallback(() => {
    if (updateThrottleRef.current) {
      clearTimeout(updateThrottleRef.current);
    }
    
    updateThrottleRef.current = setTimeout(() => {
      // Update the state representation for UI tracking
      setActiveEdgesState(new Set(activeEdgesRef.current));
      
      // Apply minimal edge updates through React state
      const timestamp = Date.now();
      lastUpdateRef.current = timestamp;
      
      setEdges(currentEdges => {
        // If a newer update has already happened, skip this one
        if (lastUpdateRef.current > timestamp) return currentEdges;
        
        const updatedEdges = currentEdges.map(edge => {
          const isActive = activeEdgesRef.current.has(edge.id);
          // Only update the data.isActive property, leave everything else unchanged
          return {
            ...edge,
            data: {
              ...edge.data,
              isActive
            }
          };
        });
        
        return updatedEdges;
      });
      
      updateThrottleRef.current = null;
    }, 50); // 50ms throttle delay
  }, [setEdges]);
  
  /**
   * Activate a specific edge by ID
   */
  const activateEdge = useCallback((edgeId: string, duration?: number) => {
    // Directly apply styling
    applyEdgeStyling(edgeId, true);
    
    // Update the ref without causing a re-render
    activeEdgesRef.current.add(edgeId);
    
    // Schedule a throttled state update
    scheduleEdgeUpdate();
    
    // Auto-deactivate after duration
    const actualDuration = duration || animationDuration;
    if (actualDuration > 0) {
      setTimeout(() => {
        // Directly apply styling
        applyEdgeStyling(edgeId, false);
        
        // Update the ref without causing a re-render
        activeEdgesRef.current.delete(edgeId);
        
        // Schedule a throttled state update
        scheduleEdgeUpdate();
      }, actualDuration);
    }
  }, [animationDuration, applyEdgeStyling, scheduleEdgeUpdate]);
  
  /**
   * Deactivate a specific edge by ID
   */
  const deactivateEdge = useCallback((edgeId: string) => {
    // Directly apply styling
    applyEdgeStyling(edgeId, false);
    
    // Update the ref without causing a re-render
    activeEdgesRef.current.delete(edgeId);
    
    // Schedule a throttled state update
    scheduleEdgeUpdate();
  }, [applyEdgeStyling, scheduleEdgeUpdate]);
  
  /**
   * Activate all outgoing edges from a specific node
   */
  const activateNodeOutgoingEdges = useCallback((nodeId: string, duration?: number) => {
    // Find all edges with this node as source
    const outgoingEdges = edges.filter(edge => edge.source === nodeId);
    
    // Activate each edge directly
    outgoingEdges.forEach(edge => {
      applyEdgeStyling(edge.id, true);
      activeEdgesRef.current.add(edge.id);
    });
    
    // Schedule a single throttled state update
    scheduleEdgeUpdate();
    
    // Set up deactivation if duration is provided
    const actualDuration = duration || animationDuration;
    if (actualDuration > 0 && outgoingEdges.length > 0) {
      setTimeout(() => {
        // Deactivate all the edges we just activated
        outgoingEdges.forEach(edge => {
          applyEdgeStyling(edge.id, false);
          activeEdgesRef.current.delete(edge.id);
        });
        
        // Schedule a single throttled state update
        scheduleEdgeUpdate();
      }, actualDuration);
    }
    
    return outgoingEdges.length > 0;
  }, [edges, applyEdgeStyling, scheduleEdgeUpdate, animationDuration]);
  
  /**
   * Activate a path of edges from source to target nodes
   */
  const activateEdgePath = useCallback((sourceNodeId: string, targetNodeId: string, duration?: number) => {
    // Simple direct connection
    const directEdge = edges.find(
      edge => edge.source === sourceNodeId && edge.target === targetNodeId
    );
    
    if (directEdge) {
      // Directly apply styling
      applyEdgeStyling(directEdge.id, true);
      
      // Update the ref without causing a re-render
      activeEdgesRef.current.add(directEdge.id);
      
      // Schedule a throttled state update
      scheduleEdgeUpdate();
      
      // Auto-deactivate after duration
      const actualDuration = duration || animationDuration;
      if (actualDuration > 0) {
        setTimeout(() => {
          // Directly apply styling
          applyEdgeStyling(directEdge.id, false);
          
          // Update the ref without causing a re-render
          activeEdgesRef.current.delete(directEdge.id);
          
          // Schedule a throttled state update
          scheduleEdgeUpdate();
        }, actualDuration);
      }
      
      return true;
    }
    
    return false;
  }, [edges, animationDuration, applyEdgeStyling, scheduleEdgeUpdate]);
  
  /**
   * Deactivate all edges
   */
  const deactivateAllEdges = useCallback(() => {
    // Directly apply styling to all active edges
    activeEdgesRef.current.forEach(edgeId => {
      applyEdgeStyling(edgeId, false);
    });
    
    // Clear the ref without causing a re-render
    activeEdgesRef.current.clear();
    
    // Schedule a throttled state update
    scheduleEdgeUpdate();
  }, [applyEdgeStyling, scheduleEdgeUpdate]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (updateThrottleRef.current) {
        clearTimeout(updateThrottleRef.current);
      }
    };
  }, []);
  
  // Add necessary CSS for direct DOM manipulation
  useEffect(() => {
    // Add stylesheet for direct DOM manipulation if not exists
    if (!document.getElementById('workflow-animation-styles')) {
      const styleEl = document.createElement('style');
      styleEl.id = 'workflow-animation-styles';
      styleEl.textContent = `
        .workflow-edge-active-path {
          animation: electricFlow 1.5s infinite;
        }
        
        @keyframes electricFlow {
          0% {
            filter: drop-shadow(0 0 2px rgba(191, 161, 74, 0.5));
          }
          50% {
            filter: drop-shadow(0 0 5px rgba(191, 161, 74, 0.8));
          }
          100% {
            filter: drop-shadow(0 0 2px rgba(191, 161, 74, 0.5));
          }
        }
      `;
      document.head.appendChild(styleEl);
    }
  }, []);
  
  return {
    activeEdges, // Read-only state representation
    activateEdge,
    deactivateEdge,
    activateNodeOutgoingEdges,
    activateEdgePath,
    deactivateAllEdges
  };
} 