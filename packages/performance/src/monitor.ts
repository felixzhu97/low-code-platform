/**
 * Performance monitoring utility functions
 */

/**
 * Performance mark data
 */
export interface PerformanceMark {
  name: string;
  startTime: number;
  duration?: number;
}

/**
 * Measure function execution time
 * @param fn - Function to measure
 * @param label - Performance label
 * @returns Function result and execution time
 */
export function measure<T>(
  fn: () => T,
  label?: string
): { result: T; duration: number } {
  const start = performance.now();
  const result = fn();
  const duration = performance.now() - start;

  if (label) {
    performance.mark(`${label}-start`);
    performance.mark(`${label}-end`);
    performance.measure(label, `${label}-start`, `${label}-end`);
  }

  return { result, duration };
}

/**
 * Measure async function execution time
 * @param fn - Async function to measure
 * @param label - Performance label
 * @returns Function result and execution time
 */
export async function measureAsync<T>(
  fn: () => Promise<T>,
  label?: string
): Promise<{ result: T; duration: number }> {
  const start = performance.now();
  const result = await fn();
  const duration = performance.now() - start;

  if (label) {
    performance.mark(`${label}-start`);
    performance.mark(`${label}-end`);
    performance.measure(label, `${label}-start`, `${label}-end`);
  }

  return { result, duration };
}

/**
 * Create a performance monitor
 */
export class PerformanceMonitor {
  private marks = new Map<string, PerformanceMark>();

  /**
   * Mark a performance point
   */
  mark(name: string): void {
    this.marks.set(name, {
      name,
      startTime: performance.now(),
    });
  }

  /**
   * Measure time between two marks
   */
  measure(startMark: string, endMark: string): number | null {
    const start = this.marks.get(startMark);
    const end = this.marks.get(endMark);

    if (!start || !end) {
      return null;
    }

    const duration = end.startTime - start.startTime;
    start.duration = duration;
    return duration;
  }

  /**
   * Get all marks
   */
  getMarks(): PerformanceMark[] {
    return Array.from(this.marks.values());
  }

  /**
   * Clear all marks
   */
  clear(): void {
    this.marks.clear();
  }

  /**
   * Get mark by name
   */
  getMark(name: string): PerformanceMark | undefined {
    return this.marks.get(name);
  }
}

/**
 * Monitor memory usage (if available)
 */
export function getMemoryUsage(): {
  used: number;
  total: number;
  percentage: number;
} | null {
  if (typeof (performance as any).memory === "undefined") {
    return null;
  }

  const memory = (performance as any).memory;
  const used = memory.usedJSHeapSize;
  const total = memory.totalJSHeapSize;

  return {
    used,
    total,
    percentage: (used / total) * 100,
  };
}
