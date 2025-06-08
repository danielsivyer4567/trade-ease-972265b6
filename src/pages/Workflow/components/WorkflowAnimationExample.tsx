import React, { useEffect, useState } from 'react';
import { useWorkflowAnimation } from '@/hooks/useWorkflowAnimation';
import { Edge } from '@xyflow/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Zap, PauseCircle, PlayCircle, RefreshCw } from 'lucide-react';

interface WorkflowAnimationExampleProps {
  edges: Edge[];
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  nodes: any[];
}

/**
 * Component demonstrating animated connections in the workflow
 */
export function WorkflowAnimationExample({ 
  edges, 
  setEdges,
  nodes
}: WorkflowAnimationExampleProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentNodeIndex, setCurrentNodeIndex] = useState(0);
  const [animationSpeed, setAnimationSpeed] = useState(1000); // ms between steps
  
  // Initialize animation hook
  const {
    activateEdge,
    deactivateAllEdges,
    activateNodeOutgoingEdges
  } = useWorkflowAnimation({
    edges,
    setEdges,
    animationDuration: animationSpeed * 0.9 // Slightly less than the animation speed
  });
  
  // Animation controller
  useEffect(() => {
    if (!isAnimating || !nodes.length) return;
    
    // Create an animation sequence
    const interval = setInterval(() => {
      // Get the current node
      const currentNode = nodes[currentNodeIndex];
      if (currentNode) {
        // Activate all outgoing edges from this node
        activateNodeOutgoingEdges(currentNode.id);
        
        // Move to the next node in the sequence
        setCurrentNodeIndex(prev => {
          const nextIndex = prev + 1;
          // Reset to beginning when we reach the end
          return nextIndex >= nodes.length ? 0 : nextIndex;
        });
      }
    }, animationSpeed);
    
    return () => clearInterval(interval);
  }, [isAnimating, currentNodeIndex, nodes, activateNodeOutgoingEdges, animationSpeed]);
  
  // Handle play/pause toggle
  const toggleAnimation = () => {
    if (isAnimating) {
      setIsAnimating(false);
      deactivateAllEdges();
    } else {
      setIsAnimating(true);
      setCurrentNodeIndex(0); // Reset to beginning
    }
  };
  
  // Handle speed change
  const cycleSpeed = () => {
    // Cycle through speeds: 1000ms -> 500ms -> 2000ms -> back to 1000ms
    const speeds = [1000, 500, 2000];
    const currentIndex = speeds.indexOf(animationSpeed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    setAnimationSpeed(speeds[nextIndex]);
  };
  
  return (
    <Card className="p-3 flex flex-col space-y-2 absolute bottom-4 left-4 z-10">
      <div className="flex items-center space-x-2">
        <Zap className="h-4 w-4 text-amber-500" />
        <span className="text-sm font-medium">Connection Animation</span>
      </div>
      
      <div className="flex space-x-2">
        <Button 
          size="sm" 
          variant="outline" 
          onClick={toggleAnimation}
          className="flex items-center space-x-1"
        >
          {isAnimating ? (
            <>
              <PauseCircle className="h-4 w-4" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <PlayCircle className="h-4 w-4" />
              <span>Flow</span>
            </>
          )}
        </Button>
        
        <Button 
          size="sm" 
          variant="outline" 
          onClick={cycleSpeed}
          className="flex items-center space-x-1"
        >
          <RefreshCw className="h-4 w-4" />
          <span>{animationSpeed}ms</span>
        </Button>
      </div>
      
      <div className="text-xs text-muted-foreground">
        {isAnimating ? 'Animating node connections...' : 'Click Play to start animation'}
      </div>
    </Card>
  );
} 