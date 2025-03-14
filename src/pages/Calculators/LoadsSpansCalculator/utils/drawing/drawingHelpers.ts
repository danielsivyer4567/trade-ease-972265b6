
/**
 * Helper utilities for canvas drawing operations
 */

/**
 * Draw an arrow head at the specified position and direction
 */
export function drawArrowHead(
  ctx: CanvasRenderingContext2D, 
  x: number, 
  y: number, 
  direction: 'left' | 'right'
) {
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
