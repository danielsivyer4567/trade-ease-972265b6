
/**
 * Utilities for drawing specific roof visualization elements
 */

/**
 * Draws angle lines with labels on the roof visualization
 */
export const drawRoofAngles = (
  ctx: CanvasRenderingContext2D,
  leftX: number,
  rightX: number,
  baseY: number,
  roofHeight: number
) => {
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
};

/**
 * Draws horizontal height markers on the roof visualization
 */
export const drawHeightMarkers = (
  ctx: CanvasRenderingContext2D,
  leftX: number,
  rightX: number,
  baseY: number,
  roofHeight: number,
  maxHeight: number
) => {
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
};

/**
 * Draws vertical dotted reference lines on the roof visualization
 */
export const drawVerticalReferenceLines = (
  ctx: CanvasRenderingContext2D,
  leftX: number,
  baseY: number,
  roofHeight: number,
  roofWidth: number
) => {
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
};

/**
 * Draws a silhouette of a person for scale
 */
export const drawPersonSilhouette = (
  ctx: CanvasRenderingContext2D,
  peakX: number,
  baseY: number,
  roofHeight: number
) => {
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
};
