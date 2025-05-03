import { drawArrowHead } from './drawingHelpers';

/**
 * Draws width measurements at the bottom of the roof visualization
 */
export const drawWidthMeasurements = (
  ctx: CanvasRenderingContext2D,
  peakX: number, 
  baseY: number,
  roofWidth: number,
  sections: { length: string }[]
) => {
  // Calculate total width based on sections
  const widthMarkers = sections.map(s => parseFloat(s.length) || 0);
  const totalWidth = widthMarkers.reduce((a, b) => a + b, 0);
  
  // Draw measurements at different levels below the beam
  const widthMeasurements = [
    { label: "2.40 M", width: totalWidth * 0.25 },
    { label: "3.55 M", width: totalWidth * 0.375 },
    { label: "4.55 M", width: totalWidth * 0.5 },
    { label: `${totalWidth.toFixed(2)} M`, width: totalWidth }
  ];
  
  const currentYOffset = 10; // Start below the beam
  widthMeasurements.forEach((measurement, index) => {
    const arrowY = baseY + 30 + (currentYOffset * index);
    const scaledWidth = (measurement.width / totalWidth) * roofWidth;
    
    // Draw arrow line
    ctx.beginPath();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1.5;
    ctx.moveTo(peakX - (scaledWidth / 2), arrowY);
    ctx.lineTo(peakX + (scaledWidth / 2), arrowY);
    ctx.stroke();
    
    // Draw arrow heads
    drawArrowHead(ctx, peakX - (scaledWidth / 2), arrowY, 'left');
    drawArrowHead(ctx, peakX + (scaledWidth / 2), arrowY, 'right');
    
    // Draw measurement text
    ctx.fillStyle = '#000';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(measurement.label, peakX, arrowY - 5);
    
    // Connect to vertical lines
    ctx.beginPath();
    ctx.setLineDash([3, 2]);
    ctx.strokeStyle = '#000';
    ctx.moveTo(peakX - (scaledWidth / 2), baseY);
    ctx.lineTo(peakX - (scaledWidth / 2), arrowY);
    ctx.moveTo(peakX + (scaledWidth / 2), baseY);
    ctx.lineTo(peakX + (scaledWidth / 2), arrowY);
    ctx.stroke();
    ctx.setLineDash([]);
  });
};
