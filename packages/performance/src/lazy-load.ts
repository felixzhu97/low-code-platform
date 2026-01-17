/**
 * Lazy loading utility functions
 */

/**
 * Lazy load an image
 * @param src - Image source URL
 * @returns Promise that resolves when image is loaded
 */
export function lazyLoadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Intersection Observer options
 */
export interface IntersectionObserverOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
}

/**
 * Create a lazy loader using Intersection Observer
 * @param callback - Callback when element enters viewport
 * @param options - Intersection Observer options
 * @returns Function to observe/unobserve elements
 */
export function createLazyLoader(
  callback: (entry: IntersectionObserverEntry) => void,
  options: IntersectionObserverOptions = {}
): {
  observe: (element: Element) => void;
  unobserve: (element: Element) => void;
  disconnect: () => void;
} {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        callback(entry);
      }
    });
  }, options);

  return {
    observe: (element: Element) => observer.observe(element),
    unobserve: (element: Element) => observer.unobserve(element),
    disconnect: () => observer.disconnect(),
  };
}

/**
 * Lazy load a module using dynamic import
 * @param modulePath - Module path
 * @returns Promise that resolves to the module
 */
export async function lazyLoadModule<T = unknown>(
  modulePath: string
): Promise<T> {
  return import(modulePath) as Promise<T>;
}

/**
 * Create a lazy loaded component factory
 */
export function createLazyComponent<T = unknown>(
  importFn: () => Promise<{ default: T }>
): () => Promise<T> {
  return async () => {
    const module = await importFn();
    return module.default;
  };
}

/**
 * Batch load resources
 * @param loaders - Array of loader functions
 * @param batchSize - Number of resources to load concurrently
 * @returns Promise that resolves when all resources are loaded
 */
export async function batchLoad<T>(
  loaders: (() => Promise<T>)[],
  batchSize: number = 3
): Promise<T[]> {
  const results: T[] = [];

  for (let i = 0; i < loaders.length; i += batchSize) {
    const batch = loaders.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map((loader) => loader()));
    results.push(...batchResults);
  }

  return results;
}
