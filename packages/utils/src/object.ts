/**
 * Object utility functions
 */

/**
 * Get object keys as typed array
 */
export function keys<T extends Record<string, unknown>>(obj: T): Array<keyof T> {
  return Object.keys(obj) as Array<keyof T>;
}

/**
 * Get object values as array
 */
export function values<T extends Record<string, unknown>>(obj: T): T[keyof T][] {
  return Object.values(obj);
}

/**
 * Get object entries as array of [key, value] tuples
 */
export function entries<T extends Record<string, unknown>>(
  obj: T
): Array<[keyof T, T[keyof T]]> {
  return Object.entries(obj) as Array<[keyof T, T[keyof T]]>;
}

/**
 * Pick specific keys from object
 */
export function pick<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key];
    }
  }
  return result;
}

/**
 * Omit specific keys from object
 */
export function omit<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj };
  for (const key of keys) {
    delete result[key];
  }
  return result as Omit<T, K>;
}

/**
 * Merge multiple objects (later objects override earlier ones)
 */
export function merge<T extends Record<string, unknown>>(
  ...objects: Partial<T>[]
): T {
  return Object.assign({}, ...objects) as T;
}

/**
 * Get nested value from object using dot notation path
 */
export function get<T>(
  obj: Record<string, unknown>,
  path: string,
  defaultValue?: T
): T | undefined {
  const keys = path.split(".");
  let result: unknown = obj;

  for (const key of keys) {
    if (
      result === null ||
      result === undefined ||
      typeof result !== "object"
    ) {
      return defaultValue;
    }
    result = (result as Record<string, unknown>)[key];
  }

  return (result !== undefined ? result : defaultValue) as T | undefined;
}

/**
 * Set nested value in object using dot notation path
 */
export function set<T extends Record<string, unknown>>(
  obj: T,
  path: string,
  value: unknown
): T {
  const keys = path.split(".");
  const lastKey = keys.pop();
  if (!lastKey) return obj;

  let current: Record<string, unknown> = obj;

  for (const key of keys) {
    if (!(key in current) || typeof current[key] !== "object") {
      current[key] = {};
    }
    current = current[key] as Record<string, unknown>;
  }

  current[lastKey] = value;
  return obj;
}

/**
 * Check if object has nested property using dot notation path
 */
export function has(obj: Record<string, unknown>, path: string): boolean {
  const keys = path.split(".");
  let current: unknown = obj;

  for (const key of keys) {
    if (
      current === null ||
      current === undefined ||
      typeof current !== "object"
    ) {
      return false;
    }
    if (!(key in (current as Record<string, unknown>))) {
      return false;
    }
    current = (current as Record<string, unknown>)[key];
  }

  return true;
}

/**
 * Check if two objects are deeply equal
 */
export function isEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;

  if (a === null || b === null || a === undefined || b === undefined) {
    return false;
  }

  if (typeof a !== typeof b) return false;

  if (typeof a !== "object") return false;

  if (Array.isArray(a) !== Array.isArray(b)) return false;

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!isEqual(a[i], b[i])) return false;
    }
    return true;
  }

  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);

  if (aKeys.length !== bKeys.length) return false;

  for (const key of aKeys) {
    if (!bKeys.includes(key)) return false;
    if (!isEqual((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key])) {
      return false;
    }
  }

  return true;
}
