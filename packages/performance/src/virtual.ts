/**
 * Virtual scrolling utility functions
 */

/**
 * Calculate visible range for virtual scrolling
 * @param scrollTop - Current scroll position
 * @param containerHeight - Container height
 * @param itemHeight - Height of each item
 * @param totalItems - Total number of items
 * @param overscan - Number of items to render outside visible area
 * @returns Object with start and end indices
 */
export function calculateVisibleRange(
  scrollTop: number,
  containerHeight: number,
  itemHeight: number,
  totalItems: number,
  overscan: number = 3
): { start: number; end: number } {
  const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const end = Math.min(
    totalItems - 1,
    start + visibleCount + overscan * 2
  );

  return { start, end };
}

/**
 * Calculate total height for virtual list
 * @param itemCount - Number of items
 * @param itemHeight - Height of each item
 * @returns Total height
 */
export function calculateTotalHeight(
  itemCount: number,
  itemHeight: number
): number {
  return itemCount * itemHeight;
}

/**
 * Calculate offset for virtual list items
 * @param index - Item index
 * @param itemHeight - Height of each item
 * @returns Offset in pixels
 */
export function calculateOffset(index: number, itemHeight: number): number {
  return index * itemHeight;
}

/**
 * Get visible items from a list for virtual scrolling
 */
export function getVisibleItems<T>(
  items: T[],
  scrollTop: number,
  containerHeight: number,
  itemHeight: number,
  overscan: number = 3
): {
  visibleItems: T[];
  startIndex: number;
  endIndex: number;
  offsetY: number;
} {
  const { start, end } = calculateVisibleRange(
    scrollTop,
    containerHeight,
    itemHeight,
    items.length,
    overscan
  );

  const visibleItems = items.slice(start, end + 1);
  const offsetY = calculateOffset(start, itemHeight);

  return {
    visibleItems,
    startIndex: start,
    endIndex: end,
    offsetY,
  };
}
