/**
 * Utility functions for formatting values in the PropertyBoundaries feature
 */

/**
 * Format a coordinate value to a more readable format
 * @param value The coordinate value to format
 * @returns Formatted coordinate string
 */
export const formatCoordinate = (value: number): string => {
  if (value === null || value === undefined) return 'N/A';
  return value.toFixed(6);
};
