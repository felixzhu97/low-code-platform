/**
 * Schema 相关类型定义
 */

/**
 * Schema 版本号
 */
export const SCHEMA_VERSION = "1.0.0";

/**
 * 组件基础接口
 */
export interface Component {
  id: string;
  type: string;
  name: string;
  position?: {
    x: number;
    y: number;
  };
  properties?: Record<string, unknown>;
  children?: (Component | string)[];
  parentId?: string | null;
  dataSource?: string | null;
  dataMapping?: Array<{
    source: string;
    target: string;
    transform?: string;
    defaultValue?: unknown;
  }>;
}

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
  theme: unknown;
  dataSources: unknown[];
  settings?: {
    activeTab?: string;
    sidebarCollapsed?: boolean;
    rightPanelCollapsed?: boolean;
    leftPanelCollapsed?: boolean;
  };
}

/**
 * 项目数据接口（用于转换）
 */
export interface ProjectData {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  components: Component[];
  canvas: {
    showGrid: boolean;
    snapToGrid: boolean;
    viewportWidth: number;
    activeDevice: string;
  };
  theme: unknown;
  dataSources: unknown[];
  settings?: {
    activeTab?: string;
    sidebarCollapsed?: boolean;
    rightPanelCollapsed?: boolean;
    leftPanelCollapsed?: boolean;
  };
}

/**
 * Schema 验证结果
 */
export interface SchemaValidationResult {
  valid: boolean;
  errors: string[];
}
