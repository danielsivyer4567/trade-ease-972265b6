/**
 * Utility functions for rendering property boundaries
 */

export interface BoundaryGeometry {
  rings: number[][][];
  spatialReference?: { wkid: number };
}

export interface BoundarySegment {
  points: [number, number, number, number]; // x1, y1, x2, y2
  length: number;
  label: string;
}

/**
 * Prepares property boundary data for rendering on a canvas
 * @param geometry The boundary geometry from ArcGIS
 * @returns Object with normalized coordinates and calculated dimensions
 */
export function prepareBoundaryData(geometry: BoundaryGeometry) {
  if (!geometry.rings || geometry.rings.length === 0) {
    throw new Error('Invalid geometry: no rings found');
  }

  const ring = geometry.rings[0];
  
  // Extract x and y coordinates
  const xs = ring.map(p => p[0]);
  const ys = ring.map(p => p[1]);
  
  // Calculate bounds
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const maxX = Math.max(...xs);
  const maxY = Math.max(...ys);
  const width = maxX - minX;
  const height = maxY - minY;
  
  // Calculate boundary segments with measurements
  const segments: BoundarySegment[] = [];
  
  for (let i = 0; i < ring.length - 1; i++) {
    const [x1, y1] = ring[i];
    const [x2, y2] = ring[i + 1];
    
    // Calculate length using Euclidean distance
    const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    
    segments.push({
      points: [x1, y1, x2, y2],
      length,
      label: `Side ${i + 1}: ${length.toFixed(2)}m`
    });
  }
  
  return {
    ring,
    bounds: { minX, minY, maxX, maxY, width, height },
    segments
  };
}

/**
 * Renders property boundary data to a canvas context
 * @param ctx Canvas 2D context
 * @param boundaryData Prepared boundary data
 * @param options Rendering options
 */
export function renderBoundaryToContext(
  ctx: CanvasRenderingContext2D, 
  boundaryData: ReturnType<typeof prepareBoundaryData>,
  options: {
    width: number;
    height: number;
    padding: number;
    fillColor: string;
    strokeColor: string;
    labelColor: string;
    lineWidth: number;
    address?: string;
  }
) {
  const { ring, bounds } = boundaryData;
  const { width, height, padding, fillColor, strokeColor, labelColor, lineWidth, address } = options;
  
  // Calculate scaling factors to fit the boundary in the canvas
  const availableWidth = width - (padding * 2);
  const availableHeight = height - (padding * 2);
  
  const scaleX = availableWidth / bounds.width;
  const scaleY = availableHeight / bounds.height;
  const scale = Math.min(scaleX, scaleY); // Use the smaller scale to keep aspect ratio
  
  // Clear canvas
  ctx.clearRect(0, 0, width, height);
  
  // Set transform to scale and center the boundary
  ctx.save();
  ctx.translate(padding, padding);
  
  // Draw the boundary
  ctx.beginPath();
  ring.forEach(([x, y], i) => {
    const px = (x - bounds.minX) * scale;
    const py = height - padding - (y - bounds.minY) * scale;
    
    if (i === 0) {
      ctx.moveTo(px, py);
    } else {
      ctx.lineTo(px, py);
    }
  });
  ctx.closePath();
  
  // Fill and stroke the boundary
  ctx.fillStyle = fillColor;
  ctx.fill();
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
  
  // Draw the segments with labels
  ctx.font = '12px sans-serif';
  ctx.fillStyle = labelColor;
  
  boundaryData.segments.forEach(segment => {
    const [x1, y1, x2, y2] = segment.points;
    const px1 = (x1 - bounds.minX) * scale;
    const py1 = height - padding - (y1 - bounds.minY) * scale;
    const px2 = (x2 - bounds.minX) * scale;
    const py2 = height - padding - (y2 - bounds.minY) * scale;
    
    // Draw length label at the midpoint of the segment
    const midX = (px1 + px2) / 2;
    const midY = (py1 + py2) / 2;
    
    ctx.fillText(segment.label, midX - 30, midY);
  });
  
  // Draw address if provided
  if (address) {
    ctx.font = '14px sans-serif';
    ctx.fillStyle = 'black';
    ctx.fillText(address, 10, 20);
  }
  
  ctx.restore();
} 