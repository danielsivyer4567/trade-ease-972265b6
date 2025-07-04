import React, { useRef, useEffect } from 'react';

// Define the types for annotations we can receive from the AI
export interface Annotation {
  type: 'highlight' | 'arrow' | 'label';
  x: number;
  y: number;
  width?: number;
  height?: number;
  toX?: number;
  toY?: number;
  text?: string;
  label?: string;
}

interface AnnotationOverlayProps {
  annotations: Annotation[];
  width: number;
  height: number;
  onClear: () => void;
}

export const AnnotationOverlay: React.FC<AnnotationOverlayProps> = ({ annotations, width, height, onClear }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    // Clear the canvas before drawing new annotations
    context.clearRect(0, 0, width, height);

    // Set a timeout to clear annotations after a delay
    const clearTimer = setTimeout(() => {
      onClear();
    }, 10000); // Annotations disappear after 10 seconds

    // Draw each annotation
    annotations.forEach(annotation => {
      drawAnnotation(context, annotation);
    });

    return () => clearTimeout(clearTimer);

  }, [annotations, width, height, onClear]);

  const drawAnnotation = (ctx: CanvasRenderingContext2D, annotation: Annotation) => {
    switch (annotation.type) {
      case 'highlight':
        drawHighlight(ctx, annotation);
        break;
      case 'arrow':
        drawArrow(ctx, annotation);
        break;
      case 'label':
        drawLabel(ctx, annotation);
        break;
      default:
        console.warn('Unknown annotation type:', annotation.type);
    }
  };

  const drawHighlight = (ctx: CanvasRenderingContext2D, { x, y, width = 0, height = 0, label }: Annotation) => {
    ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)';
    ctx.lineWidth = 4;
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 8;
    ctx.strokeRect(x, y, width, height);
    
    if (label) {
      ctx.fillStyle = 'rgba(255, 0, 0, 1)';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.shadowColor = 'black';
      ctx.shadowBlur = 4;
      ctx.fillText(label, x + width / 2, y - 10);
      ctx.shadowBlur = 0;
    }
  };

  const drawArrow = (ctx: CanvasRenderingContext2D, { x, y, toX = 0, toY = 0 }: Annotation) => {
    const headlen = 10;
    const dx = toX - x;
    const dy = toY - y;
    const angle = Math.atan2(dy, dx);

    ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)';
    ctx.lineWidth = 5;
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 8;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(toX, toY);
    ctx.lineTo(toX - headlen * Math.cos(angle - Math.PI / 6), toY - headlen * Math.sin(angle - Math.PI / 6));
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - headlen * Math.cos(angle + Math.PI / 6), toY - headlen * Math.sin(angle + Math.PI / 6));
    ctx.stroke();
    ctx.shadowBlur = 0;
  };

  const drawLabel = (ctx: CanvasRenderingContext2D, { x, y, text = '' }: Annotation) => {
    ctx.fillStyle = 'rgba(255, 255, 255, 1)';
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.lineWidth = 3;
    
    const textWidth = ctx.measureText(text).width;
    const padding = 10;
    
    ctx.fillStyle = 'rgba(255, 0, 0, 0.9)';
    ctx.roundRect(x - textWidth / 2 - padding, y - 20 - padding, textWidth + padding * 2, 30 + padding, 8);
    ctx.fill();

    ctx.fillStyle = 'white';
    ctx.fillText(text, x, y);
  };

  if (annotations.length === 0) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 100, // Ensure it's on top
        pointerEvents: 'none', // Allow clicks to pass through
      }}
    />
  );
}; 