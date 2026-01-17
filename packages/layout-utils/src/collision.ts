/**
 * Collision detection utilities
 */

export interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Check if two bounds intersect
 */
export function detectCollision(bounds1: Bounds, bounds2: Bounds): boolean {
  return (
    bounds1.x < bounds2.x + bounds2.width &&
    bounds1.x + bounds1.width > bounds2.x &&
    bounds1.y < bounds2.y + bounds2.height &&
    bounds1.y + bounds1.height > bounds2.y
  );
}

/**
 * Get intersection bounds
 */
export function getIntersection(
  bounds1: Bounds,
  bounds2: Bounds
): Bounds | null {
  const x = Math.max(bounds1.x, bounds2.x);
  const y = Math.max(bounds1.y, bounds2.y);
  const width = Math.min(
    bounds1.x + bounds1.width,
    bounds2.x + bounds2.width
  ) - x;
  const height = Math.min(
    bounds1.y + bounds1.height,
    bounds2.y + bounds2.height
  ) - y;

  if (width <= 0 || height <= 0) {
    return null;
  }

  return { x, y, width, height };
}
