import { useState, useCallback, useEffect } from 'react';
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
  const [activeEdges, setActiveEdges] = useState<Set<string>>(new Set());
  
  // Update edge styles when activeEdges changes
  useEffect(() => {
    if (!edges.length) return;
    
    const updatedEdges = edges.map(edge => {
      const isActive = activeEdges.has(edge.id);
      
      // Only update if the active state changed
      if (isActive !== edge.data?.isActive) {
        return {
          ...edge,
          data: {
            ...edge.data,
            isActive
          },
          className: isActive ? 'workflow-edge-active' : ''
        };
      }
      return edge;
    });
    
    // Only update if there were changes
    const edgesChanged = JSON.stringify(updatedEdges) !== JSON.stringify(edges);
    if (edgesChanged) {
      setEdges(updatedEdges);
    }
  }, [edges, activeEdges, setEdges]);
  
  /**
   * Activate a specific edge by ID
   */
  const activateEdge = useCallback((edgeId: string, duration?: number) => {
    setActiveEdges(prev => {
      const newSet = new Set(prev);
      newSet.add(edgeId);
      return newSet;
    });
    
    // Auto-deactivate after duration
    const actualDuration = duration || animationDuration;
    if (actualDuration > 0) {
      setTimeout(() => {
        setActiveEdges(prev => {
          const newSet = new Set(prev);
          newSet.delete(edgeId);
          return newSet;
        });
      }, actualDuration);
    }
  }, [animationDuration]);
  
  /**
   * Deactivate a specific edge by ID
   */
  const deactivateEdge = useCallback((edgeId: string) => {
    setActiveEdges(prev => {
      const newSet = new Set(prev);
      newSet.delete(edgeId);
      return newSet;
    });
  }, []);
  
  /**
   * Activate all outgoing edges from a specific node
   */
  const activateNodeOutgoingEdges = useCallback((nodeId: string, duration?: number) => {
    // Find all edges with this node as source
    const outgoingEdges = edges.filter(edge => edge.source === nodeId);
    
    // Activate each edge
    outgoingEdges.forEach(edge => {
      activateEdge(edge.id, duration);
    });
    
    return outgoingEdges.length > 0;
  }, [edges, activateEdge]);
  
  /**
   * Activate a path of edges from source to target nodes
   */
  const activateEdgePath = useCallback((sourceNodeId: string, targetNodeId: string, duration?: number) => {
    // Simple direct connection
    const directEdge = edges.find(
      edge => edge.source === sourceNodeId && edge.target === targetNodeId
    );
    
    if (directEdge) {
      activateEdge(directEdge.id, duration);
      return true;
    }
    
    return false;
  }, [edges, activateEdge]);
  
  /**
   * Deactivate all edges
   */
  const deactivateAllEdges = useCallback(() => {
    setActiveEdges(new Set());
  }, []);
  
  return {
    activeEdges,
    activateEdge,
    deactivateEdge,
    activateNodeOutgoingEdges,
    activateEdgePath,
    deactivateAllEdges
  };
} 