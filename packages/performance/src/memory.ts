/**
 * 内存管理工具
 */

/**
 * 获取内存使用情况（如果可用）
 *
 * @returns 内存使用情况
 */
export function getMemoryUsage(): {
  usedJSHeapSize?: number;
  totalJSHeapSize?: number;
  jsHeapSizeLimit?: number;
} {
  if (typeof performance !== "undefined" && "memory" in performance) {
    const memory = (performance as { memory?: unknown }).memory as
      | {
          usedJSHeapSize?: number;
          totalJSHeapSize?: number;
          jsHeapSizeLimit?: number;
        }
      | undefined;

    if (memory) {
      return {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit,
      };
    }
  }

  return {};
}

/**
 * 强制垃圾回收（如果可用）
 */
export function forceGarbageCollection(): void {
  // 仅在开发环境下强制 GC（Chrome DevTools）
  if (typeof window !== "undefined" && "gc" in window) {
    (window as { gc?: () => void }).gc?.();
  }
}

/**
 * 检查内存压力
 *
 * @returns 是否内存压力较大
 */
export function isMemoryPressure(): boolean {
  const usage = getMemoryUsage();

  if (usage.usedJSHeapSize && usage.jsHeapSizeLimit) {
    // 如果使用超过 90% 的堆限制，认为内存压力较大
    return usage.usedJSHeapSize / usage.jsHeapSizeLimit > 0.9;
  }

  return false;
}
