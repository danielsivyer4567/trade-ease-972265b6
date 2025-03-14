
import { RoofSection } from "../../types/rafterRoof";
import { drawRoofAngles } from "./roofElementsDrawer";
import { drawHeightMarkers } from "./roofElementsDrawer";
import { drawVerticalReferenceLines } from "./roofElementsDrawer";
import { drawPersonSilhouette } from "./roofElementsDrawer";
import { drawWidthMeasurements } from "./widthMeasurements";

/**
 * Draws the main triangular roof visualization
 */
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
  
  // Draw angle lines with labels
  drawRoofAngles(ctx, leftX, rightX, baseY, roofHeight);
  
  // Draw horizontal height markers on left side
  drawHeightMarkers(ctx, leftX, rightX, baseY, roofHeight, maxHeight);
  
  // Draw vertical dotted reference lines
  drawVerticalReferenceLines(ctx, leftX, baseY, roofHeight, roofWidth);
  
  // Draw width measurements at bottom with arrows
  drawWidthMeasurements(ctx, peakX, baseY, roofWidth, sections);
  
  // Add a silhouette of a person to give scale
  drawPersonSilhouette(ctx, peakX, baseY, roofHeight);
  
  // Draw area text at the top
  ctx.font = 'bold 12px Arial';
  ctx.fillStyle = '#000';
  ctx.textAlign = 'right';
  ctx.fillText(`Total Area: ${totalArea.toFixed(2)}m²`, rightX, padding + 15);
};
