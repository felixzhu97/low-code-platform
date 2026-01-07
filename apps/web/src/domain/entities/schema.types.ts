import type { Component } from "./types";
import type { ProjectData } from "@/infrastructure/state-management/stores/persistence.manager";

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
 * 验证 Schema 格式
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
 * 从 ProjectData 转换为 PageSchema
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
 * 从 PageSchema 转换为 ProjectData
 */
export function schemaToProjectData(schema: PageSchema): ProjectData {
  return {
    id: schema.metadata.name.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now(),
    name: schema.metadata.name,
    description: schema.metadata.description,
    createdAt: schema.metadata.createdAt,
    updatedAt: schema.metadata.updatedAt,
    components: schema.components,
    canvas: schema.canvas,
    theme: schema.theme,
    dataSources: schema.dataSources,
    settings: schema.settings || {},
  };
}

/**
 * 迁移旧版本 Schema 到新版本
 * 目前版本为 1.0.0，未来可以添加迁移逻辑
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
 * Schema 验证错误
 */
export class SchemaValidationError extends Error {
  constructor(message: string, public readonly schema: any) {
    super(message);
    this.name = "SchemaValidationError";
  }
}

