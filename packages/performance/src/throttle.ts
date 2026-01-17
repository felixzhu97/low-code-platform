/**
 * 节流函数
 */

/**
 * 节流函数类型
 */
export type ThrottledFunction<T extends (...args: unknown[]) => unknown> = (
  ...args: Parameters<T>
) => void;

/**
 * 创建节流函数
 *
 * @param func - 要节流的函数
 * @param delay - 延迟时间（毫秒）
 * @returns 节流后的函数
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number = 300
): ThrottledFunction<T> {
  let lastCallTime = 0;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function throttled(...args: Parameters<T>) {
    const now = Date.now();

    if (now - lastCallTime >= delay) {
      lastCallTime = now;
      func(...args);
    } else {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        lastCallTime = Date.now();
        func(...args);
      }, delay - (now - lastCallTime));
    }
  };
}

/**
 * 节流装饰器（用于类方法）
 */
export function Throttle(delay: number = 300) {
  return function <T extends (...args: unknown[]) => unknown>(
    target: unknown,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<T>
  ) {
    const originalMethod = descriptor.value!;
    descriptor.value = throttle(originalMethod, delay) as T;
    return descriptor;
  };
}
