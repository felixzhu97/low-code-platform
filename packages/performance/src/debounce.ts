/**
 * Debounce utility functions
 */

/**
 * Debounce function - delays execution until after delay time has passed
 * @param fn - Function to debounce
 * @param delay - Delay in milliseconds
 * @param immediate - Whether to execute immediately on first call
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 300,
  immediate: boolean = false
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let isImmediate = immediate;

  return function (this: unknown, ...args: Parameters<T>) {
    const context = this;

    const later = () => {
      timeoutId = null;
      if (!immediate) {
        fn.apply(context, args);
      }
    };

    const callNow = immediate && isImmediate;

    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(later, delay);

    if (callNow) {
      isImmediate = false;
      fn.apply(context, args);
    }
  };
}

/**
 * Create a debounced function with cancel capability
 */
export function debounceWithCancel<T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 300,
  immediate: boolean = false
): {
  (...args: Parameters<T>): void;
  cancel: () => void;
} {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let isImmediate = immediate;

  const debounced = function (this: unknown, ...args: Parameters<T>) {
    const context = this;

    const later = () => {
      timeoutId = null;
      if (!immediate) {
        fn.apply(context, args);
      }
    };

    const callNow = immediate && isImmediate;

    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(later, delay);

    if (callNow) {
      isImmediate = false;
      fn.apply(context, args);
    }
  };

  debounced.cancel = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return debounced as typeof debounced & { cancel: () => void };
}
