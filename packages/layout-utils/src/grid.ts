/**
 * Grid alignment utilities
 */

/**
 * Snap coordinates to grid
 */
export function snapToGrid(
  x: number,
  y: number,
  gridSize: number
): { x: number; y: number } {
  return {
    x: Math.round(x / gridSize) * gridSize,
    y: Math.round(y / gridSize) * gridSize,
  };
}

/**
 * Check if coordinates are on grid
 */
export function isOnGrid(
  x: number,
  y: number,
  gridSize: number
): boolean {
  return x % gridSize === 0 && y % gridSize === 0;
}
