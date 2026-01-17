/**
 * Cache utility functions
 */

/**
 * Simple memory cache with TTL (Time To Live)
 */
export class MemoryCache<K, V> {
  private cache = new Map<K, { value: V; expiresAt: number }>();

  /**
   * Set value in cache with TTL
   * @param key - Cache key
   * @param value - Cache value
   * @param ttl - Time to live in milliseconds
   */
  set(key: K, value: V, ttl: number = 0): void {
    const expiresAt = ttl > 0 ? Date.now() + ttl : Infinity;
    this.cache.set(key, { value, expiresAt });
  }

  /**
   * Get value from cache
   * @param key - Cache key
   * @returns Cached value or undefined
   */
  get(key: K): V | undefined {
    const entry = this.cache.get(key);
    if (!entry) return undefined;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return undefined;
    }

    return entry.value;
  }

  /**
   * Check if key exists in cache
   */
  has(key: K): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Delete value from cache
   */
  delete(key: K): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache size
   */
  size(): number {
    this.cleanExpired();
    return this.cache.size;
  }

  /**
   * Clean expired entries
   */
  cleanExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }
}

/**
 * LRU (Least Recently Used) cache
 */
export class LRUCache<K, V> {
  private cache = new Map<K, V>();
  private readonly maxSize: number;

  constructor(maxSize: number = 100) {
    this.maxSize = maxSize;
  }

  /**
   * Get value from cache (moves to end)
   */
  get(key: K): V | undefined {
    if (!this.cache.has(key)) {
      return undefined;
    }

    const value = this.cache.get(key)!;
    // Move to end (most recently used)
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  /**
   * Set value in cache
   */
  set(key: K, value: V): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      // Remove least recently used (first item)
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, value);
  }

  /**
   * Check if key exists
   */
  has(key: K): boolean {
    return this.cache.has(key);
  }

  /**
   * Delete value from cache
   */
  delete(key: K): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache size
   */
  size(): number {
    return this.cache.size;
  }
}

/**
 * Create a cached version of a function
 */
export function cached<K, V>(
  fn: (key: K) => V,
  cache?: MemoryCache<K, V>
): (key: K) => V {
  const memoCache = cache || new MemoryCache<K, V>();

  return (key: K) => {
    const cachedValue = memoCache.get(key);
    if (cachedValue !== undefined) {
      return cachedValue;
    }

    const value = fn(key);
    memoCache.set(key, value);
    return value;
  };
}
