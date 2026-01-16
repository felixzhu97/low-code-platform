/**
 * Rust WASM JSON 处理器绑定适配器
 * 提供类型安全的 TypeScript 接口，封装 Rust WASM 实现
 */

import type {
  JsonValidationResult,
  JsonAnalysisResult,
} from "@/application/services/json-helper.service";

// WASM 模块类型定义
interface WasmModule {
  validate_json: (jsonString: string) => JsonValidationResult;
  format_json: (jsonString: string, indent?: number) => string;
  minify_json: (jsonString: string) => string;
  analyze_json_structure: (data: any) => JsonAnalysisResult;
  analyze_json_string: (jsonString: string) => JsonAnalysisResult | null;
  extract_paths: (data: any, prefix?: string) => string[];
  is_array_format: (jsonString: string) => boolean;
  is_object_format: (jsonString: string) => boolean;
}

let wasmModule: WasmModule | null = null;
let isInitializing = false;
let initPromise: Promise<void> | null = null;

/**
 * 动态加载 WASM 模块（类型安全包装）
 */
async function loadWasmModule(): Promise<any> {
  // 在测试环境或 WASM 模块不存在时，返回 null
  // 这样应用会自动使用 TypeScript fallback 实现

  // 使用动态字符串拼接来避免 Vite 在构建时解析导入
  const path1 = "../../../../packages/rust-json-core/pkg/rust_json_core";
  const path2 = "./rust_json_core";
  const ext = ".js";

  try {
    // 尝试从 Rust 项目目录导入（开发环境）
    const module1 = await import(
      /* @vite-ignore */
      /* @ts-ignore - WASM 模块在构建时生成 */
      `${path1}${ext}`
    );
    return module1;
  } catch {
    try {
      // 如果导入失败，尝试从当前目录导入（构建后）
      const module2 = await import(
        /* @vite-ignore */
        /* @ts-ignore - WASM 模块在构建时生成 */
        `${path2}${ext}`
      );
      return module2;
    } catch {
      // 所有路径都失败，返回 null
      // 这样测试环境和生产环境（WASM 未构建）都可以正常运行
      return null;
    }
  }
}

/**
 * 检查 WASM 模块是否已加载（同步检查）
 */
function isWasmLoaded(): boolean {
  return wasmModule !== null;
}

/**
 * 初始化 WASM 模块
 */
async function initWasm(): Promise<void> {
  // 如果已经在初始化，等待初始化完成
  if (isInitializing && initPromise) {
    return initPromise;
  }

  // 如果已经初始化，直接返回
  if (wasmModule) {
    return;
  }

  isInitializing = true;
  initPromise = (async () => {
    try {
      // 动态导入 WASM 模块
      // 在生产环境中，这应该指向编译后的 WASM 文件
      // 注意：WASM 文件路径会在构建时确定
      // 动态导入 WASM 模块（使用类型安全的包装函数）
      // 注意：WASM 模块在构建时生成，TypeScript 无法在编译时识别
      const wasmInit = await loadWasmModule();

      // 如果加载失败，wasmInit 为 null，跳过初始化
      if (!wasmInit) {
        wasmModule = null;
        return;
      }

      // 初始化 WASM
      if (typeof wasmInit.default === "function") {
        await wasmInit.default();
      }

      // 导出函数
      wasmModule = {
        validate_json: wasmInit.validate_json,
        format_json: wasmInit.format_json,
        minify_json: wasmInit.minify_json,
        analyze_json_structure: wasmInit.analyze_json_structure,
        analyze_json_string: wasmInit.analyze_json_string,
        extract_paths: wasmInit.extract_paths,
        is_array_format: wasmInit.is_array_format,
        is_object_format: wasmInit.is_object_format,
      };
    } catch (error) {
      console.warn(
        "Failed to load WASM module, falling back to TypeScript implementation:",
        error
      );
      wasmModule = null;
    } finally {
      isInitializing = false;
    }
  })();

  return initPromise;
}

/**
 * 确保 WASM 模块已初始化
 */
async function ensureWasmReady(): Promise<boolean> {
  try {
    await initWasm();
    return wasmModule !== null;
  } catch (error) {
    console.error("WASM initialization error:", error);
    return false;
  }
}

/**
 * Rust WASM JSON 处理器
 */
export class RustJsonProcessor {
  /**
   * 检查 WASM 模块是否可用（异步）
   */
  static async isAvailable(): Promise<boolean> {
    return await ensureWasmReady();
  }

  /**
   * 检查 WASM 模块是否已加载（同步）
   */
  static isLoaded(): boolean {
    return isWasmLoaded();
  }

  /**
   * 验证 JSON 字符串（同步调用，仅在 WASM 已加载时可用）
   */
  static validateJson(jsonString: string): JsonValidationResult | null {
    if (!isWasmLoaded() || !wasmModule) {
      return null;
    }

    try {
      return wasmModule.validate_json(jsonString);
    } catch (error) {
      console.error("WASM validate_json error:", error);
      return null;
    }
  }

  /**
   * 格式化 JSON 字符串（同步调用，仅在 WASM 已加载时可用）
   */
  static formatJson(jsonString: string, indent: number = 2): string | null {
    if (!isWasmLoaded() || !wasmModule) {
      return null;
    }

    try {
      return wasmModule.format_json(jsonString, indent);
    } catch (error) {
      console.error("WASM format_json error:", error);
      return null;
    }
  }

  /**
   * 压缩 JSON 字符串（同步调用，仅在 WASM 已加载时可用）
   */
  static minifyJson(jsonString: string): string | null {
    if (!isWasmLoaded() || !wasmModule) {
      return null;
    }

    try {
      return wasmModule.minify_json(jsonString);
    } catch (error) {
      console.error("WASM minify_json error:", error);
      return null;
    }
  }

  /**
   * 分析 JSON 数据结构（同步调用，仅在 WASM 已加载时可用）
   */
  static analyzeJsonStructure(data: any): JsonAnalysisResult | null {
    if (!isWasmLoaded() || !wasmModule) {
      return null;
    }

    try {
      return wasmModule.analyze_json_structure(data);
    } catch (error) {
      console.error("WASM analyze_json_structure error:", error);
      return null;
    }
  }

  /**
   * 从 JSON 字符串分析结构（同步调用，仅在 WASM 已加载时可用）
   */
  static analyzeJsonString(jsonString: string): JsonAnalysisResult | null {
    if (!isWasmLoaded() || !wasmModule) {
      return null;
    }

    try {
      const result = wasmModule.analyze_json_string(jsonString);
      // 如果返回 null，说明解析失败
      return result ?? null;
    } catch (error) {
      console.error("WASM analyze_json_string error:", error);
      return null;
    }
  }

  /**
   * 提取所有可用路径（同步调用，仅在 WASM 已加载时可用）
   */
  static extractPaths(data: any, prefix: string = ""): string[] | null {
    if (!isWasmLoaded() || !wasmModule) {
      return null;
    }

    try {
      return wasmModule.extract_paths(data, prefix);
    } catch (error) {
      console.error("WASM extract_paths error:", error);
      return null;
    }
  }

  /**
   * 检查 JSON 是否为数组格式（同步调用，仅在 WASM 已加载时可用）
   */
  static isArrayFormat(jsonString: string): boolean | null {
    if (!isWasmLoaded() || !wasmModule) {
      return null;
    }

    try {
      return wasmModule.is_array_format(jsonString);
    } catch (error) {
      console.error("WASM is_array_format error:", error);
      return null;
    }
  }

  /**
   * 检查 JSON 是否为对象格式（同步调用，仅在 WASM 已加载时可用）
   */
  static isObjectFormat(jsonString: string): boolean | null {
    if (!isWasmLoaded() || !wasmModule) {
      return null;
    }

    try {
      return wasmModule.is_object_format(jsonString);
    } catch (error) {
      console.error("WASM is_object_format error:", error);
      return null;
    }
  }
}
