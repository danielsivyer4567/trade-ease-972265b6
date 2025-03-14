
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
};
