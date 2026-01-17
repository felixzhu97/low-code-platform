/**
 * 虚拟滚动工具
 */

/**
 * 虚拟滚动选项
 */
export interface VirtualScrollOptions {
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

/**
 * 虚拟滚动结果
 */
export interface VirtualScrollResult {
  startIndex: number;
  endIndex: number;
  visibleItems: number;
  totalHeight: number;
  offsetY: number;
}

/**
 * 计算虚拟滚动范围
 *
 * @param scrollTop - 滚动位置
 * @param totalItems - 总项目数
 * @param options - 虚拟滚动选项
 * @returns 虚拟滚动结果
 */
export function calculateVirtualScroll(
  scrollTop: number,
  totalItems: number,
  options: VirtualScrollOptions
): VirtualScrollResult {
  const { itemHeight, containerHeight, overscan = 3 } = options;

  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const startIndex = Math.max(
    0,
    Math.floor(scrollTop / itemHeight) - overscan
  );
  const endIndex = Math.min(
    totalItems - 1,
    startIndex + visibleCount + overscan * 2
  );

  const visibleItems = endIndex - startIndex + 1;
  const totalHeight = totalItems * itemHeight;
  const offsetY = startIndex * itemHeight;

  return {
    startIndex,
    endIndex,
    visibleItems,
    totalHeight,
    offsetY,
  };
}

/**
 * 获取可见项目的索引范围
 *
 * @param scrollTop - 滚动位置
 * @param containerHeight - 容器高度
 * @param itemHeight - 项目高度
 * @param totalItems - 总项目数
 * @returns 可见项目的起始和结束索引
 */
export function getVisibleRange(
  scrollTop: number,
  containerHeight: number,
  itemHeight: number,
  totalItems: number
): { start: number; end: number } {
  const start = Math.floor(scrollTop / itemHeight);
  const end = Math.min(
    totalItems - 1,
    start + Math.ceil(containerHeight / itemHeight)
  );

  return { start, end };
}
