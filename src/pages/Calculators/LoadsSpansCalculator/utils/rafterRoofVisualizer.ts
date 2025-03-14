
/**
 * Roof Visualization utilities index file
 * This file re-exports the drawing functions from their respective modules
 */

// Export main drawing functions
export { drawRoofVisualization } from './drawing/roofVisualizer';
export { drawBarChart } from './drawing/barChartVisualizer';

// Export helper functions for direct access if needed
export { drawArrowHead } from './drawing/drawingHelpers';
export { 
  drawRoofAngles, 
  drawHeightMarkers, 
  drawVerticalReferenceLines,
  drawPersonSilhouette 
} from './drawing/roofElementsDrawer';
export { drawWidthMeasurements } from './drawing/widthMeasurements';
