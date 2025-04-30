import React, { useEffect, useRef } from 'react';
import { BaseEdge, EdgeProps, getBezierPath } from '@xyflow/react';

const AnimatedEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (pathRef.current) {
      const path = pathRef.current;
      const length = path.getTotalLength();
      
      // Reset the dash array and offset
      path.style.strokeDasharray = `${length} ${length}`;
      path.style.strokeDashoffset = `${length}`;
      
      // Animate the dash offset
      path.animate(
        [
          { strokeDashoffset: length },
          { strokeDashoffset: 0 }
        ],
        {
          duration: 1000,
          iterations: Infinity,
          easing: 'linear'
        }
      );
    }
  }, []);

  return (
    <BaseEdge
      path={edgePath}
      markerEnd={markerEnd}
      style={{
        ...style,
        stroke: '#3b82f6',
        strokeWidth: 2,
        strokeDasharray: '5,5',
        animation: 'electricity 1s linear infinite',
      }}
      ref={pathRef}
    />
  );
};

export default AnimatedEdge; 