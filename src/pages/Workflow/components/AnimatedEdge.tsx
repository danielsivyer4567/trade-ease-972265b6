import React, { useEffect, useRef, useMemo } from 'react';
import { BaseEdge, EdgeProps, getBezierPath } from '@xyflow/react';

// Constants
const DARK_GOLD = '#bfa14a';

interface ElectricEdgeProps extends EdgeProps {
  isActive?: boolean;
  className?: string;
}

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
  data,
  className,
}: ElectricEdgeProps) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const pathRef = useRef<SVGPathElement>(null);

  // Determine if edge should be animated based on props
  const shouldAnimate = useMemo(() => {
    // First check className for workflow-edge-active
    if (className?.includes('workflow-edge-active')) return true;
    // Then check data.isActive
    if (data?.isActive !== undefined) return data.isActive;
    // Fallback to always animate
    return true;
  }, [data?.isActive, className]);

  useEffect(() => {
    if (!pathRef.current || !shouldAnimate) return;
    
    const path = pathRef.current;
    const length = path.getTotalLength();
    
    // Apply initial state
    path.style.strokeDasharray = `${length} ${length}`;
    
    // Set up particle animation
    if (shouldAnimate) {
      // Create an animated dash pattern for electricity effect
      const particleLength = Math.min(10, length * 0.05); // Small particle size, proportional to path length
      const gap = Math.min(40, length * 0.2); // Gap between particles
      
      path.style.strokeDasharray = `${particleLength} ${gap}`;
      
      // Animate the dash offset for flowing effect
      const animation = path.animate(
        [
          { strokeDashoffset: length },
          { strokeDashoffset: 0 }
        ],
        {
          duration: 1500, // Slightly slower for better visibility
          iterations: Infinity,
          easing: 'linear'
        }
      );
      
      return () => {
        if (animation) animation.cancel();
      };
    }
  }, [shouldAnimate, edgePath]);

  // Calculate gradient ID to ensure uniqueness
  const gradientId = `electric-gradient-${id}`;
  
  // Get stroke width as a number
  const baseStrokeWidth = typeof style.strokeWidth === 'number' ? style.strokeWidth : 2;
  
  // Get colors based on stylesheet or props
  const baseColor = style.stroke || '#3b82f6';
  const edgeClass = shouldAnimate 
    ? className ? `${className} edge-pulse-${baseColor === DARK_GOLD ? 'dark' : 'light'}` 
    : `edge-pulse-${baseColor === DARK_GOLD ? 'dark' : 'light'}`
    : className;

  return (
    <g className={edgeClass}>
      {/* Define gradient for electric effect */}
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={baseColor} stopOpacity="0.3" />
          <stop offset="50%" stopColor={baseColor} stopOpacity="1" />
          <stop offset="100%" stopColor={baseColor} stopOpacity="0.3" />
        </linearGradient>
      </defs>

      {/* Main path with default styling */}
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          strokeWidth: baseStrokeWidth,
        }}
      />
      
      {/* Animated electricity overlay */}
      {shouldAnimate && (
        <path
          d={edgePath}
          ref={pathRef}
          style={{
            stroke: `url(#${gradientId})`,
            strokeWidth: baseStrokeWidth * 0.8, // Slightly thinner
            strokeLinecap: 'round',
            fill: 'none',
            filter: `drop-shadow(0 0 3px ${baseColor === DARK_GOLD ? 'rgba(191, 161, 74, 0.5)' : 'rgba(59, 130, 246, 0.5)'})`, // Glow effect
          }}
        />
      )}

      {/* Add subtle glow effect */}
      {shouldAnimate && (
        <path
          d={edgePath}
          style={{
            stroke: baseColor,
            strokeWidth: baseStrokeWidth * 2.5,
            strokeOpacity: 0.08,
            fill: 'none',
          }}
        />
      )}
    </g>
  );
};

export default AnimatedEdge; 