/**
 * JSON工具服务（WASM版本）
 * 使用 Rust WebAssembly 提供高性能的 JSON 处理功能
 */

import { JsonValidationResult } from "./json-helper.service";

// WASM 模块类型定义
interface WasmModule {
  default: () => Promise<void>;
  validate_json: (json_str: string) => any;
  format_json: (json_str: string, indent: number) => string;
  minify_json: (json_str: string) => string;
}

// WASM 模块加载状态
let wasmModule: WasmModule | null = null;
let isInitializing = false;
let initPromise: Promise<void> | null = null;

/**
 * 初始化 WASM 模块
 * 使用单例模式确保只初始化一次
 */
async function initWasm(): Promise<void> {
  if (wasmModule) {
    return;
  }

  if (isInitializing && initPromise) {
    return initPromise;
  }

  isInitializing = true;
  initPromise = (async () => {
    try {
      const wasm = await import("@lowcode-platform/rust-wasm/pkg/rust_wasm");
      await wasm.default();
      wasmModule = wasm as unknown as WasmModule;
    } catch (error) {
      // WASM 加载失败，将使用降级方案
      wasmModule = null;
    } finally {
      isInitializing = false;
    }
  })();

  return initPromise;
}

/**
 * 确保 WASM 模块已加载
 */
async function ensureWasmLoaded(): Promise<WasmModule | null> {
  await initWasm();
  return wasmModule;
}

/**
 * 将 Map 对象递归转换为普通 JavaScript 对象
 */
function convertMapToObject(value: any): any {
  if (value instanceof Map) {
    const obj: any = {};
    value.forEach((val, key) => {
      obj[key] = convertMapToObject(val);
    });
    return obj;
  } else if (Array.isArray(value)) {
    return value.map(convertMapToObject);
  } else if (value !== null && typeof value === "object") {
    const obj: any = {};
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        obj[key] = convertMapToObject(value[key]);
      }
    }
    return obj;
  }
  return value;
}

/**
 * JSON工具服务类（WASM版本）
 */
export class JsonHelperWasmService {
  /**
   * 预加载 WASM 模块
   */
  static async preload(): Promise<void> {
    await initWasm();
  }

  /**
   * 验证JSON字符串
   */
  static async validateJson(
    jsonString: string
  ): Promise<JsonValidationResult> {
    try {
      const wasm = await ensureWasmLoaded();
      if (!wasm) {
        return JsonHelperWasmService.fallbackValidateJson(jsonString);
      }

      const result = wasm.validate_json(jsonString) as any;

      // 转换 Map 对象为普通 JavaScript 对象
      let convertedData = result?.data;
      if (convertedData !== undefined && convertedData !== null) {
        convertedData = convertMapToObject(convertedData);
      }

      return {
        valid: result?.valid ?? false,
        error: result?.error ?? undefined,
        data: convertedData ?? undefined,
      };
    } catch (error) {
      return JsonHelperWasmService.fallbackValidateJson(jsonString);
    }
  }

  /**
   * 格式化JSON字符串
   */
  static async formatJson(
    jsonString: string,
    indent: number = 2
  ): Promise<string> {
    try {
      const wasm = await ensureWasmLoaded();
      if (!wasm) {
        return JsonHelperWasmService.fallbackFormatJson(jsonString, indent);
      }
      return wasm.format_json(jsonString, indent);
    } catch (error) {
      return JsonHelperWasmService.fallbackFormatJson(jsonString, indent);
    }
  }

  /**
   * 压缩JSON字符串（移除空格和换行）
   */
  static async minifyJson(jsonString: string): Promise<string> {
    try {
      const wasm = await ensureWasmLoaded();
      if (!wasm) {
        return JsonHelperWasmService.fallbackMinifyJson(jsonString);
      }
      return wasm.minify_json(jsonString);
    } catch (error) {
      return JsonHelperWasmService.fallbackMinifyJson(jsonString);
    }
  }

  /**
   * 同步版本的验证（降级方案）
   */
  static validateJsonSync(jsonString: string): JsonValidationResult {
    return JsonHelperWasmService.fallbackValidateJson(jsonString);
  }

  /**
   * 同步版本的格式化（降级方案）
   */
  static formatJsonSync(jsonString: string, indent: number = 2): string {
    return JsonHelperWasmService.fallbackFormatJson(jsonString, indent);
  }

  /**
   * 同步版本的压缩（降级方案）
   */
  static minifyJsonSync(jsonString: string): string {
    return JsonHelperWasmService.fallbackMinifyJson(jsonString);
  }

  /**
   * 降级方案：使用原生 JSON.parse 进行验证
   */
  private static fallbackValidateJson(
    jsonString: string
  ): JsonValidationResult {
    if (!jsonString || !jsonString.trim()) {
      return {
        valid: false,
        error: "JSON字符串不能为空",
      };
    }

    try {
      const data = JSON.parse(jsonString);
      return {
        valid: true,
        data,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "未知错误";
      return {
        valid: false,
        error: `JSON格式错误: ${errorMessage}`,
      };
    }
  }

  /**
   * 降级方案：使用原生 JSON.stringify 进行格式化
   */
  private static fallbackFormatJson(
    jsonString: string,
    indent: number = 2
  ): string {
    const validation = this.fallbackValidateJson(jsonString);
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
   * 降级方案：使用原生 JSON.stringify 进行压缩
   */
  private static fallbackMinifyJson(jsonString: string): string {
    const validation = this.fallbackValidateJson(jsonString);
    if (!validation.valid || !validation.data) {
      return jsonString;
    }

    try {
      return JSON.stringify(validation.data);
    } catch {
      return jsonString;
    }
  }
}
