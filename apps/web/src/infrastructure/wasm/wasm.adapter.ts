/**
 * WASM 适配器
 * 实现 WASM 端口接口，封装 WASM 调用，处理错误和类型转换
 */

import type {
  IWasmPort,
  IWasmDataParserPort,
  IWasmSchemaProcessorPort,
  IWasmDataMapperPort,
  IWasmLayoutCalculatorPort,
  SchemaValidationResult,
  Position,
} from "@/application/ports/wasm.port";
import { initWasm } from "@/shared/wasm";

let wasmModule: any = null;
let isInitialized = false;

/**
 * 初始化 WASM 模块
 */
async function ensureWasmInitialized(): Promise<void> {
  if (isInitialized && wasmModule) {
    return;
  }

  await initWasm();

  // 动态导入 WASM 模块
  wasmModule = await import("@lowcode-platform/wasm");
  isInitialized = true;
}

/**
 * WASM 数据解析适配器
 */
class WasmDataParserAdapter implements IWasmDataParserPort {
  async parseCsv(csvText: string): Promise<any[]> {
    console.log("[WASM Adapter] parseCsv called, text length:", csvText.length);
    await ensureWasmInitialized();
    try {
      const result = wasmModule.parse_csv(csvText);
      console.log(
        "[WASM Adapter] parseCsv success, result rows:",
        Array.isArray(result) ? result.length : "N/A"
      );
      return result;
    } catch (error) {
      console.error("WASM CSV parsing failed, falling back to JS:", error);
      throw error;
    }
  }

  async parseXml(xmlText: string): Promise<any> {
    await ensureWasmInitialized();
    try {
      const result = wasmModule.parse_xml(xmlText);
      return result;
    } catch (error) {
      console.error("WASM XML parsing failed, falling back to JS:", error);
      throw error;
    }
  }

  async validateJson(jsonText: string): Promise<boolean> {
    await ensureWasmInitialized();
    try {
      return wasmModule.validate_json(jsonText);
    } catch (error) {
      console.error("WASM JSON validation failed, falling back to JS:", error);
      // 降级到 JavaScript 实现
      try {
        JSON.parse(jsonText);
        return true;
      } catch {
        return false;
      }
    }
  }
}

/**
 * WASM Schema 处理适配器
 */
class WasmSchemaProcessorAdapter implements IWasmSchemaProcessorPort {
  async serializeSchema(projectData: any): Promise<string> {
    console.log("[WASM Adapter] serializeSchema called");
    await ensureWasmInitialized();
    try {
      const result = wasmModule.serialize_schema(projectData);
      console.log(
        "[WASM Adapter] serializeSchema success, result length:",
        result.length
      );
      return result;
    } catch (error) {
      console.error(
        "WASM schema serialization failed, falling back to JS:",
        error
      );
      throw error;
    }
  }

  async deserializeSchema(schemaJson: string): Promise<any> {
    console.log(
      "[WASM Adapter] deserializeSchema called, json length:",
      schemaJson.length
    );
    await ensureWasmInitialized();
    try {
      const result = wasmModule.deserialize_schema(schemaJson);
      console.log("[WASM Adapter] deserializeSchema success");
      console.log("[WASM Adapter] result type:", typeof result);
      console.log(
        "[WASM Adapter] result keys:",
        result ? Object.keys(result) : "null"
      );
      console.log("[WASM Adapter] result.canvas:", result?.canvas);
      console.log("[WASM Adapter] result.canvas type:", typeof result?.canvas);
      if (result && !result.canvas) {
        console.warn(
          "[WASM Adapter] WARNING: result does not have canvas field!"
        );
        console.log(
          "[WASM Adapter] Full result:",
          JSON.stringify(result, null, 2)
        );
      }
      return result;
    } catch (error) {
      console.error(
        "WASM schema deserialization failed, falling back to JS:",
        error
      );
      throw error;
    }
  }

  async validateSchema(schemaJson: string): Promise<SchemaValidationResult> {
    console.log(
      "[WASM Adapter] validateSchema called, json length:",
      schemaJson.length
    );
    await ensureWasmInitialized();
    try {
      const result = wasmModule.validate_schema(schemaJson);
      console.log(
        "[WASM Adapter] validateSchema result:",
        result.valid,
        "errors:",
        result.errors?.length || 0
      );
      return {
        valid: result.valid,
        errors: result.errors || [],
      };
    } catch (error) {
      console.error(
        "WASM schema validation failed, falling back to JS:",
        error
      );
      throw error;
    }
  }

  async migrateSchema(
    schemaJson: string,
    fromVersion: string,
    toVersion: string
  ): Promise<string> {
    await ensureWasmInitialized();
    try {
      return wasmModule.migrate_schema(schemaJson, fromVersion, toVersion);
    } catch (error) {
      console.error("WASM schema migration failed, falling back to JS:", error);
      throw error;
    }
  }
}

/**
 * WASM 数据映射适配器
 */
class WasmDataMapperAdapter implements IWasmDataMapperPort {
  async generateMapping(sourceData: any, targetStructure: any): Promise<any[]> {
    console.log("[WASM Adapter] generateMapping called");
    await ensureWasmInitialized();
    try {
      const result = wasmModule.generate_mapping(sourceData, targetStructure);
      console.log(
        "[WASM Adapter] generateMapping success, mappings:",
        Array.isArray(result) ? result.length : "N/A"
      );
      return result;
    } catch (error) {
      console.error(
        "WASM mapping generation failed, falling back to JS:",
        error
      );
      throw error;
    }
  }

  async applyMapping(data: any, mappings: any[]): Promise<any> {
    await ensureWasmInitialized();
    try {
      return wasmModule.apply_mapping(data, mappings);
    } catch (error) {
      console.error(
        "WASM mapping application failed, falling back to JS:",
        error
      );
      throw error;
    }
  }

  async transformData(data: any, transformRules: any): Promise<any> {
    await ensureWasmInitialized();
    try {
      return wasmModule.transform_data(data, transformRules);
    } catch (error) {
      console.error(
        "WASM data transformation failed, falling back to JS:",
        error
      );
      throw error;
    }
  }
}

/**
 * WASM 布局计算适配器
 */
class WasmLayoutCalculatorAdapter implements IWasmLayoutCalculatorPort {
  async calculateLayout(
    components: any[],
    viewportWidth: number
  ): Promise<any[]> {
    await ensureWasmInitialized();
    try {
      return wasmModule.calculate_layout(components, viewportWidth);
    } catch (error) {
      console.error(
        "WASM layout calculation failed, falling back to JS:",
        error
      );
      throw error;
    }
  }

  async snapToGrid(x: number, y: number, gridSize: number): Promise<Position> {
    await ensureWasmInitialized();
    try {
      const result = wasmModule.snap_to_grid(x, y, gridSize);
      return {
        x: result.x,
        y: result.y,
      };
    } catch (error) {
      console.error("WASM grid snapping failed, falling back to JS:", error);
      // 降级到 JavaScript 实现
      const snappedX = Math.round(x / gridSize) * gridSize;
      const snappedY = Math.round(y / gridSize) * gridSize;
      return { x: snappedX, y: snappedY };
    }
  }

  async detectCollision(component1: any, component2: any): Promise<boolean> {
    await ensureWasmInitialized();
    try {
      return wasmModule.detect_collision(component1, component2);
    } catch (error) {
      console.error(
        "WASM collision detection failed, falling back to JS:",
        error
      );
      throw error;
    }
  }
}

/**
 * WASM 端口实现
 */
class WasmAdapter implements IWasmPort {
  dataParser: IWasmDataParserPort;
  schemaProcessor: IWasmSchemaProcessorPort;
  dataMapper: IWasmDataMapperPort;
  layoutCalculator: IWasmLayoutCalculatorPort;

  constructor() {
    this.dataParser = new WasmDataParserAdapter();
    this.schemaProcessor = new WasmSchemaProcessorAdapter();
    this.dataMapper = new WasmDataMapperAdapter();
    this.layoutCalculator = new WasmLayoutCalculatorAdapter();
  }
}

// 单例实例
let wasmAdapterInstance: IWasmPort | null = null;

/**
 * 获取 WASM 适配器实例
 */
export function getWasmAdapter(): IWasmPort {
  if (!wasmAdapterInstance) {
    wasmAdapterInstance = new WasmAdapter();
  }
  return wasmAdapterInstance;
}

/**
 * 重置 WASM 适配器（用于测试）
 */
export function resetWasmAdapter(): void {
  wasmAdapterInstance = null;
  wasmModule = null;
  isInitialized = false;
}
