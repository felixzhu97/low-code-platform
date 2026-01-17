/**
 * 性能监控工具
 */

/**
 * 性能指标接口
 */
export interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
}

/**
 * 性能监控类
 */
export class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];

  /**
   * 测量函数执行时间
   *
   * @param name - 指标名称
   * @param fn - 要测量的函数
   * @returns 函数执行结果
   */
  measure<T>(name: string, fn: () => T): T {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    const duration = end - start;

    this.recordMetric(name, duration);

    return result;
  }

  /**
   * 异步测量函数执行时间
   *
   * @param name - 指标名称
   * @param fn - 要测量的异步函数
   * @returns 函数执行结果
   */
  async measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now();
    const result = await fn();
    const end = performance.now();
    const duration = end - start;

    this.recordMetric(name, duration);

    return result;
  }

  /**
   * 记录性能指标
   *
   * @param name - 指标名称
   * @param value - 指标值
   */
  recordMetric(name: string, value: number): void {
    this.metrics.push({
      name,
      value,
      timestamp: Date.now(),
    });
  }

  /**
   * 获取所有性能指标
   *
   * @returns 性能指标数组
   */
  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  /**
   * 获取特定指标的统计信息
   *
   * @param name - 指标名称
   * @returns 统计信息
   */
  getMetricStats(name: string): {
    count: number;
    avg: number;
    min: number;
    max: number;
    total: number;
  } | null {
    const metrics = this.metrics.filter((m) => m.name === name);

    if (metrics.length === 0) {
      return null;
    }

    const values = metrics.map((m) => m.value);
    const total = values.reduce((sum, val) => sum + val, 0);
    const avg = total / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);

    return {
      count: metrics.length,
      avg,
      min,
      max,
      total,
    };
  }

  /**
   * 清空所有指标
   */
  clear(): void {
    this.metrics = [];
  }
}
