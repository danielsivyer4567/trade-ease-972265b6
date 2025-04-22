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
  index: number;
  type?: 'street' | 'shared' | 'other';
  sharedWith?: string;
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
  
  // Calculate total perimeter
  let totalPerimeter = 0;
  
  for (let i = 0; i < ring.length - 1; i++) {
    const [x1, y1] = ring[i];
    const [x2, y2] = ring[i + 1];
    
    // Calculate length using Euclidean distance
    // For geographic coordinates, this is an approximation
    // A more accurate calculation would use the Haversine formula
    const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    
    // Convert to meters if using geographic coordinates (approximate)
    // This works for small areas, but is not accurate for large distances
    const lengthInMeters = length * 111319.9; // Approx meters per degree at the equator
    
    totalPerimeter += lengthInMeters;
    
    segments.push({
      points: [x1, y1, x2, y2],
      length: lengthInMeters,
      label: `Side ${i + 1}: ${lengthInMeters.toFixed(2)}m`,
      index: i,
      type: 'other' // Default type
    });
  }
  
  // Calculate area using the Shoelace formula
  let area = 0;
  for (let i = 0; i < ring.length - 1; i++) {
    area += ring[i][0] * ring[i + 1][1] - ring[i + 1][0] * ring[i][1];
  }
  
  // Close the polygon loop
  area += ring[ring.length - 1][0] * ring[0][1] - ring[0][0] * ring[ring.length - 1][1];
  
  // Take the absolute value and scale
  area = Math.abs(area) / 2;
  
  // Convert to square meters (approximate conversion based on coordinate system)
  const areaInSquareMeters = area * 111319.9 * 111319.9; // Square meters per square degree at the equator
  
  return {
    ring,
    bounds: { minX, minY, maxX, maxY, width, height },
    segments,
    measurements: {
      totalPerimeter,
      area: areaInSquareMeters
    }
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
    showMeasurements?: boolean;
  }
) {
  const { ring, bounds, segments, measurements } = boundaryData;
  const { 
    width, 
    height, 
    padding, 
    fillColor, 
    strokeColor, 
    labelColor, 
    lineWidth, 
    address,
    showMeasurements = true
  } = options;
  
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
  
  // Draw title at the top
  ctx.font = 'bold 16px Arial';
  ctx.fillStyle = 'black';
  ctx.textAlign = 'center';
  ctx.fillText(`Property Boundary: ${address || 'Unknown Address'}`, width / 2, 20);
  
  // Draw the boundary
  ctx.beginPath();
  ring.forEach(([x, y], i) => {
    const px = (x - bounds.minX) * scale;
    const py = availableHeight - (y - bounds.minY) * scale;
    
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
  
  if (showMeasurements) {
    // Draw corner points
    ctx.fillStyle = 'orange';
    
    ring.forEach(([x, y]) => {
      const px = (x - bounds.minX) * scale;
      const py = availableHeight - (y - bounds.minY) * scale;
      
      ctx.beginPath();
      ctx.arc(px, py, 4, 0, Math.PI * 2);
      ctx.fill();
    });
    
    // Draw segments with labels in white boxes
    segments.forEach((segment, index) => {
      const [x1, y1, x2, y2] = segment.points;
      const px1 = (x1 - bounds.minX) * scale;
      const py1 = availableHeight - (y1 - bounds.minY) * scale;
      const px2 = (x2 - bounds.minX) * scale;
      const py2 = availableHeight - (y2 - bounds.minY) * scale;
      
      // Calculate angle of the line
      const angle = Math.atan2(py2 - py1, px2 - px1);
      
      // Calculate midpoint of the segment
      const midX = (px1 + px2) / 2;
      const midY = (py1 + py2) / 2;
      
      // Draw length label with a background box
      const labelText = `Side ${index + 1}: ${segment.length.toFixed(2)}m`;
      ctx.font = 'bold 12px Arial';
      
      // Measure text width for box sizing
      const textMetrics = ctx.measureText(labelText);
      const textWidth = textMetrics.width;
      const textHeight = 16; // Approximate height
      
      // Calculate offset perpendicular to the line
      const perpAngle = angle + Math.PI / 2;
      const offsetDistance = 15;
      const offsetX = Math.cos(perpAngle) * offsetDistance;
      const offsetY = Math.sin(perpAngle) * offsetDistance;
      
      // Position for the label
      const labelX = midX + offsetX;
      const labelY = midY + offsetY;
      
      // Draw background box
      ctx.fillStyle = 'white';
      ctx.strokeStyle = 'blue';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(labelX - textWidth / 2 - 5, labelY - textHeight / 2 - 2, textWidth + 10, textHeight + 4, 4);
      ctx.fill();
      ctx.stroke();
      
      // Draw text
      ctx.fillStyle = 'blue';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(labelText, labelX, labelY);
    });
    
    // Add North indicator
    const northX = width - 50;
    const northY = 70;
    
    // Draw the North arrow
    ctx.strokeStyle = 'black';
    ctx.fillStyle = 'white';
    ctx.lineWidth = 2;
    
    // Arrow circle
    ctx.beginPath();
    ctx.arc(northX, northY, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Arrow line
    ctx.beginPath();
    ctx.moveTo(northX, northY + 10);
    ctx.lineTo(northX, northY - 10);
    ctx.stroke();
    
    // Arrow head
    ctx.beginPath();
    ctx.moveTo(northX, northY - 10);
    ctx.lineTo(northX - 5, northY - 5);
    ctx.lineTo(northX + 5, northY - 5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // N label
    ctx.fillStyle = 'black';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('N', northX, northY + 25);
    
    // Draw the total area and perimeter in the bottom corner
    ctx.font = '12px Arial';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'left';
    ctx.fillText(`Total Perimeter: ${measurements.totalPerimeter.toFixed(2)}m`, 10, height - 30);
    ctx.fillText(`Area: ${measurements.area.toFixed(2)}m²`, 10, height - 10);
  }
  
  ctx.restore();
} 