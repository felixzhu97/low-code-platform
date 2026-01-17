/**
 * Data mapping utilities
 */

export interface DataMapping {
  sourcePath: string;
  targetPath: string;
  transform?: (value: unknown) => unknown;
  defaultValue?: unknown;
}

/**
 * Apply data mapping
 */
export function applyMapping(
  sourceData: unknown,
  mappings: DataMapping[]
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const mapping of mappings) {
    let value = getValueFromPath(sourceData, mapping.sourcePath);
    if (value === undefined && mapping.defaultValue !== undefined) {
      value = mapping.defaultValue;
    }
    if (mapping.transform) {
      value = mapping.transform(value);
    }
    setValueToPath(result, mapping.targetPath, value);
  }

  return result;
}

/**
 * Generate mapping from source and target structures
 */
export function generateMapping(
  sourceData: unknown,
  targetStructure: Record<string, unknown>
): DataMapping[] {
  const mappings: DataMapping[] = [];

  function traverse(
    source: unknown,
    target: Record<string, unknown>,
    basePath: string = ""
  ): void {
    for (const [key, targetValue] of Object.entries(target)) {
      const targetPath = basePath ? `${basePath}.${key}` : key;

      if (typeof targetValue === "object" && targetValue !== null && !Array.isArray(targetValue)) {
        const sourceValue = getValueFromPath(source, targetPath);
        if (typeof sourceValue === "object" && sourceValue !== null) {
          traverse(sourceValue as Record<string, unknown>, targetValue, targetPath);
        }
      } else {
        mappings.push({
          sourcePath: targetPath,
          targetPath: targetPath,
        });
      }
    }
  }

  traverse(sourceData, targetStructure);
  return mappings;
}

/**
 * Get value from path (internal helper)
 */
function getValueFromPath(data: unknown, path: string): unknown {
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
 * Set value to path (internal helper)
 */
function setValueToPath(data: Record<string, unknown>, path: string, value: unknown): void {
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
