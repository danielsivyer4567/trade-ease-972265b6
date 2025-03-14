import { RoofSection } from "../types/rafterRoof";

export const drawRoofVisualization = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  sections: RoofSection[],
  totalArea: number
) => {
  const canvas = canvasRef.current;
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Set canvas size
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;
  
  // Calculate dimensions for the roof
  const padding = 20;
  const roofWidth = canvasWidth - (padding * 2);
  const maxHeight = Math.max(...sections.map(s => parseFloat(s.height) || 0));
  const roofHeight = Math.min(canvasHeight - (padding * 2), maxHeight * 15);
  
  // Set starting positions
  const baseY = canvasHeight - padding - 10; // Move up a bit for dimensions below
  const leftX = padding;
  const rightX = canvasWidth - padding;
  const peakY = baseY - roofHeight;
  const peakX = canvasWidth / 2;
  
  // Draw roof outline - thicker brown outline like in reference
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#5c3d2e'; // Brown color for roof outline
  
  // Draw roof triangle - thick outline
  ctx.beginPath();
  ctx.moveTo(leftX, baseY);
  ctx.lineTo(peakX, peakY);
  ctx.lineTo(rightX, baseY);
  ctx.stroke();
  
  // Draw horizontal base (beam) with wood-like appearance
  ctx.fillStyle = '#8B4513'; // Saddle brown for the beam
  ctx.fillRect(leftX - 10, baseY, roofWidth + 20, 15); // Beam below the roof
  
  // Draw small vertical supports at ends - wood-like appearance
  ctx.fillStyle = '#8B4513'; // Same brown color
  ctx.fillRect(leftX - 10, baseY, 15, 18); // Left support
  ctx.fillRect(rightX - 5, baseY, 15, 18); // Right support
  
  // Add more angle lines to match reference image
  const anglesToShow = [20, 25, 30, 40, 45, 50, 55]; // All angles from reference image
  
  // Draw angle lines
  ctx.lineWidth = 1;
  anglesToShow.forEach((angle) => {
    // Calculate angle in radians
    const radian = (angle * Math.PI) / 180;
    const angleHeight = roofHeight * 0.9; // All angles go almost to the peak
    
    // Draw left angle line
    ctx.beginPath();
    ctx.strokeStyle = '#000';
    ctx.moveTo(leftX, baseY);
    const leftEndX = leftX + (Math.tan(radian) * angleHeight);
    const leftEndY = baseY - angleHeight;
    ctx.lineTo(leftEndX, leftEndY);
    
    // Draw right angle line
    ctx.moveTo(rightX, baseY);
    const rightEndX = rightX - (Math.tan(radian) * angleHeight);
    const rightEndY = baseY - angleHeight;
    ctx.lineTo(rightEndX, rightEndY);
    ctx.stroke();
    
    // Show angle text at peak of each angle line
    const textX = angle < 35 ? leftEndX + (rightEndX - leftEndX) / 2 : leftEndX + (rightEndX - leftEndX) / 2;
    const textY = leftEndY - 5; // Position slightly above the line
    
    ctx.fillStyle = '#000';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${angle}°`, textX, textY);
  });
  
  // Draw horizontal height markers on left side - match reference with multiple levels
  const heightMarkers = [1, 2, 2.5, 3]; // Height markers from reference image
  
  heightMarkers.forEach((height) => {
    const markerY = baseY - (height * (roofHeight / maxHeight) * 0.7);
    
    // Draw dashed line across
    ctx.beginPath();
    ctx.setLineDash([5, 3]);
    ctx.strokeStyle = '#000';
    ctx.moveTo(leftX - 5, markerY);
    ctx.lineTo(rightX, markerY);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw height text
    ctx.fillStyle = '#000';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'right';
    ctx.fillText(`${height} M`, leftX - 10, markerY + 4);
  });
  
  // Draw vertical dotted lines - match the reference image pattern
  const verticalLinePositions = [0.25, 0.375, 0.5, 0.625, 0.75]; // Positions for vertical lines
  
  verticalLinePositions.forEach((pos) => {
    const x = leftX + (roofWidth * pos);
    
    ctx.beginPath();
    ctx.setLineDash([3, 3]);
    ctx.strokeStyle = '#000';
    ctx.moveTo(x, baseY);
    ctx.lineTo(x, baseY - roofHeight * 0.9); // Go up to meet the angle lines
    ctx.stroke();
    ctx.setLineDash([]);
  });
  
  // Draw width measurements at bottom with arrows - multiple measurements like reference
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
  
  let currentYOffset = 10; // Start below the beam
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
  
  // Add a silhouette of a person to give scale like in the reference image
  const personHeight = roofHeight * 0.15;
  const personWidth = personHeight * 0.4;
  const personX = peakX;
  const personY = baseY - personHeight;
  
  ctx.fillStyle = '#333';
  // Draw simplified person silhouette
  ctx.beginPath();
  // Head
  ctx.arc(personX, personY, personWidth * 0.3, 0, Math.PI * 2);
  ctx.fill();
  // Body
  ctx.fillRect(personX - personWidth * 0.25, personY, personWidth * 0.5, personHeight * 0.7);
  // Arms
  ctx.fillRect(personX - personWidth * 0.6, personY + personHeight * 0.2, personWidth * 0.4, personWidth * 0.2);
  ctx.fillRect(personX + personWidth * 0.2, personY + personHeight * 0.2, personWidth * 0.4, personWidth * 0.2);
  // Legs
  ctx.fillRect(personX - personWidth * 0.2, personY + personHeight * 0.7, personWidth * 0.15, personHeight * 0.3);
  ctx.fillRect(personX + personWidth * 0.05, personY + personHeight * 0.7, personWidth * 0.15, personHeight * 0.3);
  
  // Draw area text at the top
  ctx.font = 'bold 12px Arial';
  ctx.fillStyle = '#000';
  ctx.textAlign = 'right';
  ctx.fillText(`Total Area: ${totalArea.toFixed(2)}m²`, rightX, padding + 15);
};

// Helper function to draw arrow heads
function drawArrowHead(ctx: CanvasRenderingContext2D, x: number, y: number, direction: 'left' | 'right') {
  const arrowSize = 6;
  ctx.beginPath();
  if (direction === 'right') {
    ctx.moveTo(x - arrowSize, y - arrowSize / 2);
    ctx.lineTo(x, y);
    ctx.lineTo(x - arrowSize, y + arrowSize / 2);
  } else {
    ctx.moveTo(x + arrowSize, y - arrowSize / 2);
    ctx.lineTo(x, y);
    ctx.lineTo(x + arrowSize, y + arrowSize / 2);
  }
  ctx.stroke();
}

// Keep the existing drawBarChart function
export const drawBarChart = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  sections: RoofSection[],
  totalArea: number
) => {
  const canvas = canvasRef.current;
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Set canvas size
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;
  
  // Chart margins
  const margin = { top: 8, right: 4, bottom: 10, left: 12 }; // All values reduced 5x
  const chartWidth = canvasWidth - margin.left - margin.right;
  const chartHeight = canvasHeight - margin.top - margin.bottom;
  
  // Calculate max values for scaling
  const maxHeight = Math.max(...sections.map(s => parseFloat(s.height) || 0));
  const maxLength = Math.max(...sections.map(s => parseFloat(s.length) || 0));
  const maxValue = Math.max(maxHeight, maxLength);
  
  // Calculate bar width and spacing
  const barCount = sections.length;
  const barWidth = chartWidth / (barCount * 3); // Each section has 2 bars + spacing
  const groupSpacing = barWidth / 2;
  
  // Draw chart title
  ctx.font = 'bold 5px Arial'; // Reduced from 16px
  ctx.fillStyle = '#333';
  ctx.textAlign = 'center';
  ctx.fillText('Roof Dimensions', canvasWidth / 2, margin.top / 2);
  
  // Draw Y-axis
  ctx.beginPath();
  ctx.moveTo(margin.left, margin.top);
  ctx.lineTo(margin.left, canvasHeight - margin.bottom);
  ctx.stroke();
  
  // Draw X-axis
  ctx.beginPath();
  ctx.moveTo(margin.left, canvasHeight - margin.bottom);
  ctx.lineTo(canvasWidth - margin.right, canvasHeight - margin.bottom);
  ctx.stroke();
  
  // Draw Y-axis labels (reduced to just 3 ticks)
  const yTickCount = 2;
  ctx.textAlign = 'right';
  ctx.font = '4px Arial'; // Reduced from 12px
  for (let i = 0; i <= yTickCount; i++) {
    const value = maxValue * (i / yTickCount);
    const y = canvasHeight - margin.bottom - (i / yTickCount) * chartHeight;
    
    // Draw tick marks
    ctx.beginPath();
    ctx.moveTo(margin.left - 1, y); // Reduced from -5
    ctx.lineTo(margin.left, y);
    ctx.stroke();
    
    // Draw labels
    ctx.fillText(value.toFixed(1), margin.left - 2, y + 1); // Reduced spacing and simplified
  }
  
  // Draw legend (simplified)
  ctx.font = '4px Arial'; // Reduced from 12px
  ctx.textAlign = 'left';
  
  // Height legend
  ctx.fillStyle = 'rgba(59, 130, 246, 0.7)'; // Blue
  ctx.fillRect(margin.left + 2, margin.top - 5, 3, 3); // Reduced from 10,15,15,15
  ctx.fillStyle = '#333';
  ctx.fillText('H(m)', margin.left + 6, margin.top - 3); // Reduced space and simplified
  
  // Length legend
  ctx.fillStyle = 'rgba(245, 158, 11, 0.7)'; // Amber
  ctx.fillRect(margin.left + 22, margin.top - 5, 3, 3); // Reduced from 110,25,15,15
  ctx.fillStyle = '#333';
  ctx.fillText('L(m)', margin.left + 26, margin.top - 3); // Reduced space and simplified
  
  // Draw bars
  sections.forEach((section, index) => {
    const height = parseFloat(section.height) || 0;
    const length = parseFloat(section.length) || 0;
    
    if (height && length) {
      const x = margin.left + (index * 3 + 1) * barWidth + groupSpacing * index;
      
      // Calculate heights (scaled)
      const heightBarHeight = (height / maxValue) * chartHeight;
      const lengthBarHeight = (length / maxValue) * chartHeight;
      
      // Draw height bar
      ctx.fillStyle = 'rgba(59, 130, 246, 0.7)'; // Blue
      ctx.fillRect(
        x, 
        canvasHeight - margin.bottom - heightBarHeight,
        barWidth,
        heightBarHeight
      );
      
      // Draw length bar
      ctx.fillStyle = 'rgba(245, 158, 11, 0.7)'; // Amber
      ctx.fillRect(
        x + barWidth + 1, // Reduced from +5
        canvasHeight - margin.bottom - lengthBarHeight,
        barWidth,
        lengthBarHeight
      );
      
      // Draw section label (simplified)
      ctx.fillStyle = '#333';
      ctx.textAlign = 'center';
      if (index < 3) { // Only show for first 3 sections to avoid clutter
        ctx.fillText(
          `S${index + 1}`,
          x + barWidth + 0.5, // Reduced from +2.5
          canvasHeight - margin.bottom + 3 // Reduced from +15
        );
      }
      
      // Draw values above bars (only if there's enough space)
      if (heightBarHeight > 4) {
        ctx.fillText(
          height.toFixed(1),
          x + barWidth / 2,
          canvasHeight - margin.bottom - heightBarHeight - 1 // Reduced from -5
        );
      }
      
      if (lengthBarHeight > 4) {
        ctx.fillText(
          length.toFixed(1),
          x + barWidth + 1 + barWidth / 2, // Reduced spacing
          canvasHeight - margin.bottom - lengthBarHeight - 1 // Reduced from -5
        );
      }
    }
  });
  
  // Simplify by removing axis titles - they take too much space in mini version
};
