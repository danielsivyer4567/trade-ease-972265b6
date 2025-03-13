
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
  
  // Find max height and length for scaling
  const maxHeight = Math.max(...sections.map(s => parseFloat(s.height) || 0));
  const totalLength = sections.reduce((sum, s) => sum + (parseFloat(s.length) || 0), 0);
  
  // Scale factors
  const heightScale = (canvasHeight - 60) / (maxHeight || 1);
  const lengthScale = (canvasWidth - 60) / (totalLength || 1);
  
  // Start position
  let x = 30;
  const baseY = canvasHeight - 30;
  
  // Draw sections
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#333';
  ctx.fillStyle = 'rgba(255, 193, 7, 0.2)';
  
  // Draw baseline
  ctx.beginPath();
  ctx.moveTo(30, baseY);
  ctx.lineTo(canvasWidth - 30, baseY);
  ctx.stroke();
  
  // Draw roof sections
  for (const section of sections) {
    const height = parseFloat(section.height) || 0;
    const length = parseFloat(section.length) || 0;
    
    if (height && length) {
      const scaledHeight = height * heightScale;
      const scaledLength = length * lengthScale;
      
      // Draw the section
      ctx.beginPath();
      ctx.moveTo(x, baseY);
      ctx.lineTo(x, baseY - scaledHeight);
      ctx.lineTo(x + scaledLength, baseY - scaledHeight);
      ctx.lineTo(x + scaledLength, baseY);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      
      // Draw area label
      ctx.fillStyle = '#333';
      ctx.font = '12px Arial';
      ctx.fillText(
        `${section.area.toFixed(1)} m²`, 
        x + scaledLength / 2 - 20, 
        baseY - scaledHeight / 2
      );
      
      x += scaledLength;
    }
  }
  
  // Reset fill style for next drawing
  ctx.fillStyle = 'rgba(255, 193, 7, 0.2)';
  
  // Draw total area
  ctx.font = '14px Arial';
  ctx.fillStyle = '#000';
  ctx.fillText(`Total Area: ${totalArea.toFixed(2)} m²`, 30, 20);
};

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
