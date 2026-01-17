/**
 * JSON utility functions
 */

export interface JsonValidationResult {
  valid: boolean;
  error?: string;
  data?: unknown;
}

export interface JsonAnalysisResult {
  type: "array" | "object" | "primitive" | "null" | "undefined";
  structure: unknown;
  paths: string[];
  sample?: unknown;
}

/**
 * Validate JSON string
 */
export function validateJson(jsonString: string): JsonValidationResult {
  if (!jsonString || !jsonString.trim()) {
    return {
      valid: false,
      error: "JSON string cannot be empty",
    };
  }

  try {
    const data = JSON.parse(jsonString);
    return {
      valid: true,
      data,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return {
      valid: false,
      error: `JSON format error: ${errorMessage}`,
    };
  }
}

/**
 * Format JSON string
 */
export function formatJson(jsonString: string, indent: number = 2): string {
  const validation = validateJson(jsonString);
  if (!validation.valid || !validation.data) {
    return jsonString;
  }

  try {
    return JSON.stringify(validation.data, null, indent);
  } catch {
    return jsonString;
  }
}

/**
 * Minify JSON string
 */
export function minifyJson(jsonString: string): string {
  const validation = validateJson(jsonString);
  if (!validation.valid || !validation.data) {
    return jsonString;
  }

  try {
    return JSON.stringify(validation.data);
  } catch {
    return jsonString;
  }
}

/**
 * Analyze JSON structure
 */
export function analyzeJsonStructure(data: unknown): JsonAnalysisResult {
  if (data === null) {
    return {
      type: "null",
      structure: null,
      paths: [],
    };
  }

  if (data === undefined) {
    return {
      type: "undefined",
      structure: undefined,
      paths: [],
    };
  }

  if (Array.isArray(data)) {
    const paths: string[] = ["[]"];
    let sample: unknown = null;

    if (data.length > 0) {
      sample = data[0];
      const itemAnalysis = analyzeJsonStructure(data[0]);
      itemAnalysis.paths.forEach((path) => {
        paths.push(`[0]${path.startsWith(".") ? path : "." + path}`);
      });
    }

    return {
      type: "array",
      structure: Array.isArray(sample) ? "array[]" : typeof sample,
      paths,
      sample,
    };
  }

  if (typeof data === "object") {
    const paths: string[] = [];
    const structure: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(data)) {
      paths.push(`.${key}`);
      structure[key] = typeof value;

      if (value !== null && typeof value === "object") {
        const nestedAnalysis = analyzeJsonStructure(value);
        nestedAnalysis.paths.forEach((path) => {
          paths.push(`.${key}${path}`);
        });
      }
    }

    return {
      type: "object",
      structure,
      paths,
    };
  }

  return {
    type: "primitive",
    structure: typeof data,
    paths: [],
    sample: data,
  };
}

/**
 * Analyze JSON string structure
 */
export function analyzeJsonString(jsonString: string): JsonAnalysisResult | null {
  const validation = validateJson(jsonString);
  if (!validation.valid || validation.data === undefined) {
    return null;
  }

  return analyzeJsonStructure(validation.data);
}

/**
 * Check if JSON is array format
 */
export function isArrayFormat(jsonString: string): boolean {
  const validation = validateJson(jsonString);
  if (!validation.valid || !validation.data) {
    return false;
  }
  return Array.isArray(validation.data);
}

/**
 * Check if JSON is object format
 */
export function isObjectFormat(jsonString: string): boolean {
  const validation = validateJson(jsonString);
  if (!validation.valid || !validation.data) {
    return false;
  }
  return typeof validation.data === "object" && !Array.isArray(validation.data);
}
