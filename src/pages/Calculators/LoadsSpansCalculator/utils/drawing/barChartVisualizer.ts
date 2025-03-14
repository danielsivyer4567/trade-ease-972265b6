
import { RoofSection } from "../../types/rafterRoof";

/**
 * Draws a bar chart visualization of roof dimensions
 */
export const drawBarChart = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  sections: RoofSection[],
  totalArea: number
) => {
  const canvas = canvasRef.current;
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  // Get the display size of the canvas (as set by CSS)
  const displayWidth = canvas.clientWidth;
  const displayHeight = canvas.clientHeight;
  
  // Clear canvas
  ctx.clearRect(0, 0, displayWidth, displayHeight);
  
  // Chart margins
  const margin = { top: 20, right: 30, bottom: 30, left: 50 };
  const chartWidth = displayWidth - margin.left - margin.right;
  const chartHeight = displayHeight - margin.top - margin.bottom;
  
  // Calculate max values for scaling
  const maxHeight = Math.max(...sections.map(s => parseFloat(s.height) || 0));
  const maxLength = Math.max(...sections.map(s => parseFloat(s.length) || 0));
  const maxValue = Math.max(maxHeight, maxLength, 0.1); // Add minimum to avoid division by zero
  
  // Calculate bar width and spacing
  const barCount = sections.length;
  const barWidth = Math.min(50, chartWidth / (barCount * 3)); // Each section has 2 bars + spacing
  const groupSpacing = barWidth / 2;
  
  // Draw chart title
  ctx.font = 'bold 14px Arial';
  ctx.fillStyle = '#333';
  ctx.textAlign = 'center';
  ctx.fillText('Roof Dimensions', displayWidth / 2, margin.top / 2);
  
  // Draw Y-axis
  ctx.beginPath();
  ctx.moveTo(margin.left, margin.top);
  ctx.lineTo(margin.left, displayHeight - margin.bottom);
  ctx.stroke();
  
  // Draw X-axis
  ctx.beginPath();
  ctx.moveTo(margin.left, displayHeight - margin.bottom);
  ctx.lineTo(displayWidth - margin.right, displayHeight - margin.bottom);
  ctx.stroke();
  
  // Draw Y-axis labels
  const yTickCount = 5;
  ctx.textAlign = 'right';
  ctx.font = '12px Arial';
  for (let i = 0; i <= yTickCount; i++) {
    const value = maxValue * (i / yTickCount);
    const y = displayHeight - margin.bottom - (i / yTickCount) * chartHeight;
    
    // Draw tick marks
    ctx.beginPath();
    ctx.moveTo(margin.left - 5, y);
    ctx.lineTo(margin.left, y);
    ctx.stroke();
    
    // Draw labels
    ctx.fillText(value.toFixed(1) + 'm', margin.left - 8, y + 4);
  }
  
  // Draw legend
  ctx.font = '12px Arial';
  ctx.textAlign = 'left';
  
  // Height legend
  ctx.fillStyle = 'rgba(59, 130, 246, 0.7)'; // Blue
  ctx.fillRect(margin.left + 10, margin.top - 15, 15, 15);
  ctx.fillStyle = '#333';
  ctx.fillText('Height (m)', margin.left + 30, margin.top - 5);
  
  // Length legend
  ctx.fillStyle = 'rgba(245, 158, 11, 0.7)'; // Amber
  ctx.fillRect(margin.left + 110, margin.top - 15, 15, 15);
  ctx.fillStyle = '#333';
  ctx.fillText('Length (m)', margin.left + 130, margin.top - 5);
  
  // Calculate the starting point for the bars to center them
  const totalBarsWidth = barCount * (barWidth * 2 + groupSpacing);
  const startX = margin.left + (chartWidth - totalBarsWidth) / 2;
  
  // Draw bars
  sections.forEach((section, index) => {
    const height = parseFloat(section.height) || 0;
    const length = parseFloat(section.length) || 0;
    
    if (height && length) {
      const x = startX + (index * (barWidth * 2 + groupSpacing));
      
      // Calculate heights (scaled)
      const heightBarHeight = (height / maxValue) * chartHeight;
      const lengthBarHeight = (length / maxValue) * chartHeight;
      
      // Draw height bar
      ctx.fillStyle = 'rgba(59, 130, 246, 0.7)'; // Blue
      ctx.fillRect(
        x, 
        displayHeight - margin.bottom - heightBarHeight,
        barWidth,
        heightBarHeight
      );
      
      // Draw length bar
      ctx.fillStyle = 'rgba(245, 158, 11, 0.7)'; // Amber
      ctx.fillRect(
        x + barWidth + 5,
        displayHeight - margin.bottom - lengthBarHeight,
        barWidth,
        lengthBarHeight
      );
      
      // Draw section label
      ctx.fillStyle = '#333';
      ctx.textAlign = 'center';
      ctx.fillText(
        `Section ${index + 1}`,
        x + barWidth + 2.5,
        displayHeight - margin.bottom + 15
      );
      
      // Draw values above bars (only if there's enough space)
      if (heightBarHeight > 15) {
        ctx.fillText(
          height.toFixed(1),
          x + barWidth / 2,
          displayHeight - margin.bottom - heightBarHeight - 5
        );
      }
      
      if (lengthBarHeight > 15) {
        ctx.fillText(
          length.toFixed(1),
          x + barWidth * 1.5 + 5,
          displayHeight - margin.bottom - lengthBarHeight - 5
        );
      }
    }
  });
};
