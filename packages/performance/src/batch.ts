/**
 * Batch operation utility functions
 */

/**
 * Process items in batches
 * @param items - Items to process
 * @param batchSize - Size of each batch
 * @param processor - Function to process each batch
 * @returns Promise that resolves when all batches are processed
 */
export async function batchProcess<T, R>(
  items: T[],
  batchSize: number,
  processor: (batch: T[]) => Promise<R> | R
): Promise<R[]> {
  const results: R[] = [];

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const result = await processor(batch);
    results.push(result);
  }

  return results;
}

/**
 * Process items in batches with concurrency limit
 * @param items - Items to process
 * @param batchSize - Size of each batch
 * @param processor - Function to process each batch
 * @param concurrency - Maximum number of concurrent batches
 * @returns Promise that resolves when all batches are processed
 */
export async function batchProcessWithConcurrency<T, R>(
  items: T[],
  batchSize: number,
  processor: (batch: T[]) => Promise<R> | R,
  concurrency: number = 3
): Promise<R[]> {
  const results: R[] = [];
  const batches: T[][] = [];

  for (let i = 0; i < items.length; i += batchSize) {
    batches.push(items.slice(i, i + batchSize));
  }

  for (let i = 0; i < batches.length; i += concurrency) {
    const concurrentBatches = batches.slice(i, i + concurrency);
    const batchResults = await Promise.all(
      concurrentBatches.map((batch) => processor(batch))
    );
    results.push(...batchResults);
  }

  return results;
}

/**
 * Debounce batch operations
 * @param items - Items to process
 * @param processor - Function to process items
 * @param delay - Delay in milliseconds
 * @returns Promise that resolves when batch is processed
 */
export function debounceBatch<T, R>(
  processor: (items: T[]) => Promise<R> | R,
  delay: number = 300
): {
  add: (item: T) => void;
  flush: () => Promise<R | null>;
  cancel: () => void;
} {
  let items: T[] = [];
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let resolve: ((value: R | null) => void) | null = null;

  const flush = (): Promise<R | null> => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }

    if (items.length === 0) {
      return Promise.resolve(null);
    }

    const batch = [...items];
    items = [];
    return Promise.resolve(processor(batch));
  };

  const add = (item: T): void => {
    items.push(item);

    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      flush().then((result) => {
        if (resolve) {
          resolve(result);
          resolve = null;
        }
      });
    }, delay);
  };

  const cancel = (): void => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    items = [];
    if (resolve) {
      resolve(null);
      resolve = null;
    }
  };

  return { add, flush, cancel };
}
