/**
 * Throttle utility functions
 */

/**
 * Throttle function - limits execution to at most once per delay period
 * @param fn - Function to throttle
 * @param delay - Delay in milliseconds
 * @param leading - Whether to execute on leading edge
 * @param trailing - Whether to execute on trailing edge
 * @returns Throttled function
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 300,
  leading: boolean = true,
  trailing: boolean = true
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastExecTime = 0;
  let lastArgs: Parameters<T> | null = null;

  return function (this: unknown, ...args: Parameters<T>) {
    const context = this;
    const currentTime = Date.now();

    const execute = () => {
      lastExecTime = currentTime;
      fn.apply(context, args);
      lastArgs = null;
    };

    if (leading && currentTime - lastExecTime >= delay) {
      execute();
      return;
    }

    lastArgs = args;

    if (trailing) {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        if (lastArgs !== null) {
          execute();
        }
      }, delay - (currentTime - lastExecTime));
    }
  };
}

/**
 * Create a throttled function with cancel capability
 */
export function throttleWithCancel<T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 300,
  leading: boolean = true,
  trailing: boolean = true
): {
  (...args: Parameters<T>): void;
  cancel: () => void;
} {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastExecTime = 0;
  let lastArgs: Parameters<T> | null = null;

  const throttled = function (this: unknown, ...args: Parameters<T>) {
    const context = this;
    const currentTime = Date.now();

    const execute = () => {
      lastExecTime = currentTime;
      fn.apply(context, args);
      lastArgs = null;
    };

    if (leading && currentTime - lastExecTime >= delay) {
      execute();
      return;
    }

    lastArgs = args;

    if (trailing) {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        if (lastArgs !== null) {
          execute();
        }
      }, delay - (currentTime - lastExecTime));
    }
  };

  throttled.cancel = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    lastArgs = null;
  };

  return throttled as typeof throttled & { cancel: () => void };
}
