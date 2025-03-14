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
  const padding = 30;
  const roofWidth = canvasWidth - (padding * 2);
  const maxHeight = Math.max(...sections.map(s => parseFloat(s.height) || 0));
  const roofHeight = Math.min(canvasHeight - (padding * 2), maxHeight * 20);
  
  // Set starting positions
  const baseY = canvasHeight - padding;
  const leftX = padding;
  const rightX = canvasWidth - padding;
  const peakY = baseY - roofHeight;
  const peakX = canvasWidth / 2;
  
  // Draw roof outline
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#5c3d2e'; // Brown color for roof outline
  
  // Draw roof triangle
  ctx.beginPath();
  ctx.moveTo(leftX, baseY);
  ctx.lineTo(peakX, peakY);
  ctx.lineTo(rightX, baseY);
  ctx.stroke();
  
  // Draw horizontal base (beam) with thicker line
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(leftX - 10, baseY);
  ctx.lineTo(rightX + 10, baseY);
  ctx.stroke();
  
  // Draw small vertical supports at ends
  ctx.beginPath();
  ctx.moveTo(leftX, baseY);
  ctx.lineTo(leftX, baseY + 10);
  ctx.moveTo(rightX, baseY);
  ctx.lineTo(rightX, baseY + 10);
  ctx.stroke();
  
  // Reset line width for other elements
  ctx.lineWidth = 1;
  
  // Draw angle lines from base corners to peak
  const anglesToShow = [20, 25, 30, 35, 40, 45, 50];
  const colors = ['#333', '#555', '#777', '#999', '#555', '#333', '#111'];
  
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
    
    // Draw angle text in the middle top
    ctx.fillStyle = '#000';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    const textX = canvasWidth / 2;
    const textY = baseY - lineHeight + 15;
    ctx.fillText(`${angle}°`, textX, textY);
  });
  
  // Draw horizontal height markers on left side
  const heightMarkers = [1, 2, 2.5, 3];
  
  heightMarkers.forEach((height, index) => {
    const markerY = baseY - (height * (roofHeight / maxHeight) * 0.8);
    
    // Draw dashed line across
    ctx.beginPath();
    ctx.setLineDash([5, 3]);
    ctx.strokeStyle = '#555';
    ctx.moveTo(leftX - 5, markerY);
    ctx.lineTo(rightX, markerY);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw height text
    ctx.fillStyle = '#000';
    ctx.font = '12px Arial';
    ctx.textAlign = 'right';
    ctx.fillText(`${height} M`, leftX - 10, markerY + 4);
  });
  
  // Draw width measurements at bottom with arrows
  const widthMarkers = sections.map(s => parseFloat(s.length) || 0);
  const totalWidth = widthMarkers.reduce((a, b) => a + b, 0);
  const scale = roofWidth / totalWidth;
  
  let currentX = leftX;
  widthMarkers.forEach((width, index) => {
    const scaledWidth = width * scale;
    const nextX = currentX + scaledWidth;
    const arrowY = baseY + 25;
    
    // Draw arrow line
    ctx.beginPath();
    ctx.strokeStyle = '#000';
    ctx.moveTo(currentX, arrowY);
    ctx.lineTo(nextX, arrowY);
    ctx.stroke();
    
    // Draw arrow heads
    drawArrowHead(ctx, currentX, arrowY, 'left');
    drawArrowHead(ctx, nextX, arrowY, 'right');
    
    // Draw width text
    ctx.fillStyle = '#000';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${width.toFixed(2)} M`, (currentX + nextX) / 2, arrowY + 15);
    
    // Draw vertical dotted lines from base to arrow
    ctx.beginPath();
    ctx.setLineDash([2, 2]);
    ctx.moveTo(currentX, baseY);
    ctx.lineTo(currentX, arrowY + 20);
    if (index === widthMarkers.length - 1) {
      ctx.moveTo(nextX, baseY);
      ctx.lineTo(nextX, arrowY + 20);
    }
    ctx.stroke();
    ctx.setLineDash([]);
    
    currentX = nextX;
  });
  
  // Draw total width at the bottom
  const totalArrowY = baseY + 50;
  ctx.beginPath();
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 1.5;
  ctx.moveTo(leftX, totalArrowY);
  ctx.lineTo(rightX, totalArrowY);
  ctx.stroke();
  
  // Draw total width arrow heads
  drawArrowHead(ctx, leftX, totalArrowY, 'left');
  drawArrowHead(ctx, rightX, totalArrowY, 'right');
  
  // Draw total width text
  ctx.fillStyle = '#000';
  ctx.font = 'bold 14px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(`${totalWidth.toFixed(2)} M`, (leftX + rightX) / 2, totalArrowY + 16);
  
  // Draw total area at the top
  ctx.font = 'bold 14px Arial';
  ctx.fillStyle = '#000';
  ctx.textAlign = 'left';
  ctx.fillText(`Total Area: ${totalArea.toFixed(2)} m²`, leftX, padding - 10);
};

// Helper function to draw arrow heads
function drawArrowHead(ctx: CanvasRenderingContext2D, x: number, y: number, direction: 'left' | 'right') {
  const arrowSize = 6;
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
  const margin = { top: 40, right: 20, bottom: 50, left: 60 };
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
  ctx.font = 'bold 16px Arial';
  ctx.fillStyle = '#333';
  ctx.textAlign = 'center';
  ctx.fillText('Roof Section Dimensions', canvasWidth / 2, margin.top / 2);
  
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
  
  // Draw Y-axis labels
  const yTickCount = 5;
  ctx.textAlign = 'right';
  ctx.font = '12px Arial';
  for (let i = 0; i <= yTickCount; i++) {
    const value = maxValue * (i / yTickCount);
    const y = canvasHeight - margin.bottom - (i / yTickCount) * chartHeight;
    
    // Draw tick marks
    ctx.beginPath();
    ctx.moveTo(margin.left - 5, y);
    ctx.lineTo(margin.left, y);
    ctx.stroke();
    
    // Draw labels
    ctx.fillText(value.toFixed(1) + 'm', margin.left - 10, y + 4);
  }
  
  // Draw X-axis labels
  ctx.textAlign = 'center';
  ctx.font = '12px Arial';
  
  // Draw legend
  ctx.font = '12px Arial';
  ctx.textAlign = 'left';
  
  // Height legend
  ctx.fillStyle = 'rgba(59, 130, 246, 0.7)'; // Blue
  ctx.fillRect(margin.left + 10, margin.top - 25, 15, 15);
  ctx.fillStyle = '#333';
  ctx.fillText('Height (m)', margin.left + 30, margin.top - 15);
  
  // Length legend
  ctx.fillStyle = 'rgba(245, 158, 11, 0.7)'; // Amber
  ctx.fillRect(margin.left + 110, margin.top - 25, 15, 15);
  ctx.fillStyle = '#333';
  ctx.fillText('Length (m)', margin.left + 130, margin.top - 15);
  
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
        x + barWidth + 5,
        canvasHeight - margin.bottom - lengthBarHeight,
        barWidth,
        lengthBarHeight
      );
      
      // Draw section label
      ctx.fillStyle = '#333';
      ctx.textAlign = 'center';
      ctx.fillText(
        `Section ${index + 1}`,
        x + barWidth + 2.5, 
        canvasHeight - margin.bottom + 15
      );
      
      // Draw values above bars
      ctx.fillText(
        height.toFixed(1),
        x + barWidth / 2,
        canvasHeight - margin.bottom - heightBarHeight - 5
      );
      
      ctx.fillText(
        length.toFixed(1),
        x + barWidth + 5 + barWidth / 2,
        canvasHeight - margin.bottom - lengthBarHeight - 5
      );
    }
  });
  
  // Draw Y-axis title
  ctx.save();
  ctx.translate(15, canvasHeight / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = 'center';
  ctx.font = '14px Arial';
  ctx.fillText('Measurements (m)', 0, 0);
  ctx.restore();
  
  // Draw X-axis title
  ctx.textAlign = 'center';
  ctx.font = '14px Arial';
  ctx.fillText('Roof Sections', canvasWidth / 2, canvasHeight - 10);
};
