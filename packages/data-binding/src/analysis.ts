/**
 * 数据结构分析工具
 */

/**
 * JSON 分析结果
 */
export interface JsonAnalysisResult {
  type: "array" | "object" | "primitive" | "null" | "undefined";
  structure: unknown;
  paths: string[];
  sample?: unknown;
}

/**
 * 分析 JSON 数据结构
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
      // 分析第一个元素的结构
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

      // 递归分析嵌套结构
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

  // 原始类型
  return {
    type: "primitive",
    structure: typeof data,
    paths: [],
    sample: data,
  };
}

/**
 * 从 JSON 字符串分析结构
 */
export function analyzeJsonString(
  jsonString: string
): JsonAnalysisResult | null {
  try {
    const data = JSON.parse(jsonString);
    return analyzeJsonStructure(data);
  } catch {
    return null;
  }
}
