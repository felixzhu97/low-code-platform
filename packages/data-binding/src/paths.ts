/**
 * Data path extraction utilities
 */

/**
 * Extract all available paths from data
 */
export function extractPaths(data: unknown, prefix: string = ""): string[] {
  const paths: string[] = [];

  if (data === null || data === undefined) {
    return paths;
  }

  if (Array.isArray(data)) {
    if (prefix) {
      paths.push(prefix);
    }

    if (data.length > 0) {
      paths.push(`${prefix}[0]`);
      const firstItemPaths = extractPaths(data[0], `${prefix}[0]`);
      paths.push(...firstItemPaths);
    }
  } else if (typeof data === "object") {
    if (prefix && Object.keys(data).length > 0) {
      paths.push(prefix);
    }

    for (const [key, value] of Object.entries(data)) {
      const currentPath = prefix ? `${prefix}.${key}` : key;

      if (value === null || value === undefined) {
        paths.push(currentPath);
      } else if (Array.isArray(value)) {
        paths.push(currentPath);
        if (value.length > 0) {
          paths.push(`${currentPath}[0]`);
          const itemPaths = extractPaths(value[0], `${currentPath}[0]`);
          paths.push(...itemPaths);
        }
      } else if (typeof value === "object") {
        const nestedPaths = extractPaths(value, currentPath);
        paths.push(...nestedPaths);
      } else {
        paths.push(currentPath);
      }
    }
  } else {
    if (prefix) {
      paths.push(prefix);
    }
  }

  return paths;
}

/**
 * Get value by path from data
 */
export function getValueByPath(data: unknown, path: string): unknown {
  const keys = path.split(/[\.\[\]]/).filter((key) => key !== "");

  let current: unknown = data;
  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== "object") {
      return undefined;
    }

    if (Array.isArray(current)) {
      const index = parseInt(key, 10);
      if (isNaN(index)) {
        return undefined;
      }
      current = current[index];
    } else {
      current = (current as Record<string, unknown>)[key];
    }
  }

  return current;
}

/**
 * Set value by path in data
 */
export function setValueByPath(data: Record<string, unknown>, path: string, value: unknown): void {
  const keys = path.split(/[\.\[\]]/).filter((key) => key !== "");
  const lastKey = keys.pop();
  if (!lastKey) return;

  let current: Record<string, unknown> = data;
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (!(key in current) || typeof current[key] !== "object") {
      const nextKey = keys[i + 1];
      current[key] = nextKey && !isNaN(parseInt(nextKey, 10)) ? [] : {};
    }
    current = current[key] as Record<string, unknown>;
  }

  current[lastKey] = value;
}
