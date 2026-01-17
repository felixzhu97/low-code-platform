/**
 * Responsive layout utilities
 */

/**
 * Calculate responsive position based on viewport width
 */
export function calculateResponsivePosition(
  x: number,
  baseWidth: number = 1920,
  viewportWidth: number
): number {
  return (x / baseWidth) * viewportWidth;
}

/**
 * Calculate responsive dimensions
 */
export function calculateResponsiveDimensions(
  width: number,
  height: number,
  baseWidth: number = 1920,
  viewportWidth: number
): { width: number; height: number } {
  const ratio = viewportWidth / baseWidth;
  return {
    width: width * ratio,
    height: height * ratio,
  };
}
