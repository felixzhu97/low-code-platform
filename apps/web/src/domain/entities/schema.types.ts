import type { Component } from "./types";
import type { ProjectData } from "@/infrastructure/state-management/stores/persistence.manager";
import { getWasmAdapter } from "@/infrastructure/wasm";

/**
 * Schema 版本号
 */
export const SCHEMA_VERSION = "1.0.0";

/**
 * Schema 元数据
 */
export interface SchemaMetadata {
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  version: string;
}

/**
 * 页面 Schema 接口
 * 基于 ProjectData，但添加了版本号和更明确的类型定义
 */
export interface PageSchema {
  version: string;
  metadata: SchemaMetadata;
  components: Component[];
  canvas: {
    showGrid: boolean;
    snapToGrid: boolean;
    viewportWidth: number;
    activeDevice: string;
  };
  theme: any;
  dataSources: any[];
  settings?: {
    activeTab?: string;
    sidebarCollapsed?: boolean;
    rightPanelCollapsed?: boolean;
    leftPanelCollapsed?: boolean;
  };
}

/**
 * 验证 Schema 格式（同步版本，用于类型守卫）
 */
export function validateSchema(data: any): data is PageSchema {
  if (!data || typeof data !== "object") {
    return false;
  }

  // 验证版本号
  if (typeof data.version !== "string" || !data.version) {
    return false;
  }

  // 验证元数据
  if (!data.metadata || typeof data.metadata !== "object") {
    return false;
  }
  if (typeof data.metadata.name !== "string" || !data.metadata.name) {
    return false;
  }
  if (typeof data.metadata.version !== "string") {
    return false;
  }

  // 验证组件数组
  if (!Array.isArray(data.components)) {
    return false;
  }

  // 验证画布配置
  if (!data.canvas || typeof data.canvas !== "object") {
    return false;
  }
  if (typeof data.canvas.showGrid !== "boolean") {
    return false;
  }
  if (typeof data.canvas.snapToGrid !== "boolean") {
    return false;
  }
  if (typeof data.canvas.viewportWidth !== "number") {
    return false;
  }
  if (typeof data.canvas.activeDevice !== "string") {
    return false;
  }

  // 验证主题（允许任何类型）
  if (data.theme === undefined || data.theme === null) {
    return false;
  }

  // 验证数据源数组
  if (!Array.isArray(data.dataSources)) {
    return false;
  }

  return true;
}

/**
 * 验证 Schema 格式（异步版本，使用 WASM）
 */
export async function validateSchemaAsync(
  schemaJson: string
): Promise<{ valid: boolean; errors: string[] }> {
  try {
    const wasm = getWasmAdapter();
    return await wasm.schemaProcessor.validateSchema(schemaJson);
  } catch (error) {
    console.warn("WASM schema validation failed, using fallback:", error);
    // 降级到同步验证
    try {
      const data = JSON.parse(schemaJson);
      const valid = validateSchema(data);
      return {
        valid,
        errors: valid ? [] : ["Schema validation failed"],
      };
    } catch (e) {
      return {
        valid: false,
        errors: [`Invalid JSON: ${e}`],
      };
    }
  }
}

/**
 * 从 ProjectData 转换为 PageSchema（同步版本）
 */
export function projectDataToSchema(
  projectData: ProjectData,
  version: string = SCHEMA_VERSION
): PageSchema {
  return {
    version,
    metadata: {
      name: projectData.name,
      description: projectData.description,
      createdAt: projectData.createdAt,
      updatedAt: projectData.updatedAt,
      version: SCHEMA_VERSION,
    },
    components: projectData.components,
    canvas: projectData.canvas,
    theme: projectData.theme,
    dataSources: projectData.dataSources,
    settings: projectData.settings,
  };
}

/**
 * 从 ProjectData 转换为 Schema JSON（异步版本，使用 WASM）
 */
export async function projectDataToSchemaJson(
  projectData: ProjectData
): Promise<string> {
  try {
    const wasm = getWasmAdapter();
    return await wasm.schemaProcessor.serializeSchema(projectData);
  } catch (error) {
    console.warn("WASM schema serialization failed, using fallback:", error);
    // 降级到同步版本
    const schema = projectDataToSchema(projectData);
    return JSON.stringify(schema, null, 2);
  }
}

/**
 * 从 PageSchema 转换为 ProjectData（同步版本）
 */
export function schemaToProjectData(schema: PageSchema): ProjectData {
  return {
    id:
      schema.metadata.name.toLowerCase().replace(/\s+/g, "-") +
      "-" +
      Date.now(),
    name: schema.metadata.name,
    description: schema.metadata.description,
    createdAt: schema.metadata.createdAt,
    updatedAt: schema.metadata.updatedAt,
    components: schema.components || [],
    canvas: schema.canvas || {
      showGrid: false,
      snapToGrid: false,
      viewportWidth: 1920,
      activeDevice: "desktop",
    },
    theme: schema.theme || {},
    dataSources: schema.dataSources || [],
    settings: schema.settings || {
      activeTab: "components",
      sidebarCollapsed: false,
      rightPanelCollapsed: false,
      leftPanelCollapsed: false,
    },
  };
}

/**
 * 从 Schema JSON 转换为 ProjectData（异步版本，使用 WASM）
 */
export async function schemaJsonToProjectData(
  schemaJson: string
): Promise<ProjectData> {
  try {
    const wasm = getWasmAdapter();
    return await wasm.schemaProcessor.deserializeSchema(schemaJson);
  } catch (error) {
    console.warn("WASM schema deserialization failed, using fallback:", error);
    // 降级到同步版本
    const schema = JSON.parse(schemaJson) as PageSchema;
    return schemaToProjectData(schema);
  }
}

/**
 * 迁移旧版本 Schema 到新版本（同步版本）
 */
export function migrateSchema(schema: any): PageSchema {
  // 如果已经是 PageSchema 格式，直接返回
  if (validateSchema(schema)) {
    return schema;
  }

  // 如果是旧版本的 ProjectData 格式，转换为 PageSchema
  if (schema.components && Array.isArray(schema.components) && schema.canvas) {
    return projectDataToSchema(schema as ProjectData);
  }

  throw new Error("无法识别的 Schema 格式");
}

/**
 * 迁移 Schema 版本（异步版本，使用 WASM）
 */
export async function migrateSchemaAsync(
  schemaJson: string,
  fromVersion: string,
  toVersion: string
): Promise<string> {
  try {
    const wasm = getWasmAdapter();
    return await wasm.schemaProcessor.migrateSchema(
      schemaJson,
      fromVersion,
      toVersion
    );
  } catch (error) {
    console.warn("WASM schema migration failed, using fallback:", error);
    // 降级到同步版本
    const schema = JSON.parse(schemaJson);
    const migrated = migrateSchema(schema);
    return JSON.stringify(migrated, null, 2);
  }
}

/**
 * Schema 验证错误
 */
export class SchemaValidationError extends Error {
  constructor(message: string, public readonly schema: any) {
    super(message);
    this.name = "SchemaValidationError";
  }
}
