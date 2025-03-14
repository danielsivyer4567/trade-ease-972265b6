
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
  const padding = 6; // Reduced 5x from 30
  const roofWidth = canvasWidth - (padding * 2);
  const maxHeight = Math.max(...sections.map(s => parseFloat(s.height) || 0));
  const roofHeight = Math.min(canvasHeight - (padding * 2), maxHeight * 4); // Reduced 5x from 20 to 4
  
  // Set starting positions
  const baseY = canvasHeight - padding;
  const leftX = padding;
  const rightX = canvasWidth - padding;
  const peakY = baseY - roofHeight;
  const peakX = canvasWidth / 2;
  
  // Draw roof outline
  ctx.lineWidth = 1; // Reduced 3x from 3
  ctx.strokeStyle = '#5c3d2e'; // Brown color for roof outline
  
  // Draw roof triangle
  ctx.beginPath();
  ctx.moveTo(leftX, baseY);
  ctx.lineTo(peakX, peakY);
  ctx.lineTo(rightX, baseY);
  ctx.stroke();
  
  // Draw horizontal base (beam) with thicker line
  ctx.lineWidth = 1.2; // Reduced 5x from 6
  ctx.beginPath();
  ctx.moveTo(leftX - 2, baseY); // Reduced 5x from -10
  ctx.lineTo(rightX + 2, baseY); // Reduced 5x from +10
  ctx.stroke();
  
  // Draw small vertical supports at ends
  ctx.beginPath();
  ctx.moveTo(leftX, baseY);
  ctx.lineTo(leftX, baseY + 2); // Reduced 5x from 10
  ctx.moveTo(rightX, baseY);
  ctx.lineTo(rightX, baseY + 2); // Reduced 5x from 10
  ctx.stroke();
  
  // Reset line width for other elements
  ctx.lineWidth = 0.5; // Reduced from 1
  
  // Draw angle lines from base corners to peak
  const anglesToShow = [30, 45]; // Reduced number of angles to show
  const colors = ['#333', '#777'];
  
  // Draw angle lines
  anglesToShow.forEach((angle, index) => {
    // Calculate angle in radians
    const radian = (angle * Math.PI) / 180;
    const heightRatio = index / (anglesToShow.length - 1);
    const lineHeight = roofHeight * (0.3 + (heightRatio * 0.7));
    
    // Draw left angle line
    ctx.beginPath();
    ctx.strokeStyle = colors[index % colors.length];
    ctx.moveTo(leftX, baseY);
    const leftEndX = leftX + (Math.tan(radian) * lineHeight);
    const leftEndY = baseY - lineHeight;
    ctx.lineTo(leftEndX, leftEndY);
    
    // Draw right angle line
    ctx.moveTo(rightX, baseY);
    const rightEndX = rightX - (Math.tan(radian) * lineHeight);
    const rightEndY = baseY - lineHeight;
    ctx.lineTo(rightEndX, rightEndY);
    ctx.stroke();
    
    // Only show angle text for smaller number of angles
    if (index < 2) {
      ctx.fillStyle = '#000';
      ctx.font = '7px Arial'; // Reduced from 12px
      ctx.textAlign = 'center';
      const textX = canvasWidth / 2;
      const textY = baseY - lineHeight + 3; // Reduced from 15
      ctx.fillText(`${angle}°`, textX, textY);
    }
  });
  
  // Draw horizontal height markers on left side
  const heightMarkers = [2, 3]; // Reduced number of markers
  
  heightMarkers.forEach((height, index) => {
    const markerY = baseY - (height * (roofHeight / maxHeight) * 0.8);
    
    // Draw dashed line across
    ctx.beginPath();
    ctx.setLineDash([2, 1]); // Reduced from [5, 3]
    ctx.strokeStyle = '#555';
    ctx.moveTo(leftX - 1, markerY); // Reduced from -5
    ctx.lineTo(rightX, markerY);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw height text
    ctx.fillStyle = '#000';
    ctx.font = '6px Arial'; // Reduced from 12px
    ctx.textAlign = 'right';
    ctx.fillText(`${height}M`, leftX - 2, markerY + 1); // Reduced space and position
  });
  
  // Draw width measurements at bottom with arrows
  const widthMarkers = sections.map(s => parseFloat(s.length) || 0);
  const totalWidth = widthMarkers.reduce((a, b) => a + b, 0);
  const scale = roofWidth / totalWidth;
  
  let currentX = leftX;
  widthMarkers.forEach((width, index) => {
    const scaledWidth = width * scale;
    const nextX = currentX + scaledWidth;
    const arrowY = baseY + 5; // Reduced from 25
    
    // Draw arrow line
    ctx.beginPath();
    ctx.strokeStyle = '#000';
    ctx.moveTo(currentX, arrowY);
    ctx.lineTo(nextX, arrowY);
    ctx.stroke();
    
    // Draw arrow heads
    drawArrowHead(ctx, currentX, arrowY, 'left');
    drawArrowHead(ctx, nextX, arrowY, 'right');
    
    // Only show width text for sections with sufficient width
    if (scaledWidth > 30) {
      ctx.fillStyle = '#000';
      ctx.font = '5px Arial'; // Reduced from 12px
      ctx.textAlign = 'center';
      ctx.fillText(`${width.toFixed(1)}`, (currentX + nextX) / 2, arrowY + 3); // Reduced space and simplified text
    }
    
    // Draw vertical dotted lines from base to arrow
    ctx.beginPath();
    ctx.setLineDash([1, 1]); // Reduced from [2, 2]
    ctx.moveTo(currentX, baseY);
    ctx.lineTo(currentX, arrowY + 4); // Reduced from +20
    if (index === widthMarkers.length - 1) {
      ctx.moveTo(nextX, baseY);
      ctx.lineTo(nextX, arrowY + 4); // Reduced from +20
    }
    ctx.stroke();
    ctx.setLineDash([]);
    
    currentX = nextX;
  });
  
  // Draw total width at the bottom
  const totalArrowY = baseY + 10; // Reduced from 50
  ctx.beginPath();
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 0.3; // Reduced from 1.5
  ctx.moveTo(leftX, totalArrowY);
  ctx.lineTo(rightX, totalArrowY);
  ctx.stroke();
  
  // Draw total width arrow heads
  drawArrowHead(ctx, leftX, totalArrowY, 'left');
  drawArrowHead(ctx, rightX, totalArrowY, 'right');
  
  // Draw total width text
  ctx.fillStyle = '#000';
  ctx.font = 'bold 6px Arial'; // Reduced from 14px
  ctx.textAlign = 'center';
  ctx.fillText(`${totalWidth.toFixed(1)}M`, (leftX + rightX) / 2, totalArrowY + 4); // Reduced space and simplified text
  
  // Draw total area at the top
  ctx.font = 'bold 6px Arial'; // Reduced from 14px
  ctx.fillStyle = '#000';
  ctx.textAlign = 'left';
  ctx.fillText(`Area: ${totalArea.toFixed(1)}m²`, leftX, padding - 1); // Reduced space and simplified text
};

// Helper function to draw arrow heads
function drawArrowHead(ctx: CanvasRenderingContext2D, x: number, y: number, direction: 'left' | 'right') {
  const arrowSize = 1.2; // Reduced 5x from 6
  ctx.beginPath();
  if (direction === 'right') {
    ctx.moveTo(x - arrowSize, y - arrowSize);
    ctx.lineTo(x, y);
    ctx.lineTo(x - arrowSize, y + arrowSize);
  } else {
    ctx.moveTo(x + arrowSize, y - arrowSize);
    ctx.lineTo(x, y);
    ctx.lineTo(x + arrowSize, y + arrowSize);
  }
  ctx.stroke();
}

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

