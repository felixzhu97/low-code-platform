/**
 * Data structure analysis utilities
 */

import { analyzeJsonStructure } from "./json";

export type { JsonAnalysisResult } from "./json";

/**
 * Re-export analyzeJsonStructure for convenience
 */
export { analyzeJsonStructure };

/**
 * Get data type
 */
export function getDataType(data: unknown): string {
  if (data === null) return "null";
  if (data === undefined) return "undefined";
  if (Array.isArray(data)) return "array";
  return typeof data;
}

/**
 * Check if data is primitive
 */
export function isPrimitive(data: unknown): boolean {
  return (
    data === null ||
    data === undefined ||
    (typeof data !== "object" && typeof data !== "function")
  );
}

/**
 * Get structure summary
 */
export function getStructureSummary(data: unknown): {
  type: string;
  size: number;
  depth: number;
} {
  const type = getDataType(data);
  let size = 0;
  let depth = 0;

  function calculateDepth(obj: unknown, currentDepth: number = 0): void {
    depth = Math.max(depth, currentDepth);

    if (Array.isArray(obj)) {
      size += obj.length;
      obj.forEach((item) => {
        if (typeof item === "object" && item !== null) {
          calculateDepth(item, currentDepth + 1);
        }
      });
    } else if (typeof obj === "object" && obj !== null) {
      size += Object.keys(obj).length;
      for (const value of Object.values(obj)) {
        if (typeof value === "object" && value !== null) {
          calculateDepth(value, currentDepth + 1);
        }
      }
    }
  }

  calculateDepth(data);
  return { type, size, depth };
}
