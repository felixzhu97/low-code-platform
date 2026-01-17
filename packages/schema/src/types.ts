/**
 * Schema type definitions
 */

/**
 * Schema version constant
 */
export const SCHEMA_VERSION = "1.0.0";

/**
 * Schema metadata
 */
export interface SchemaMetadata {
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  version: string;
}

/**
 * Component interface (simplified)
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
  dataMapping?: unknown[];
}

/**
 * Project data interface (simplified)
 */
export interface ProjectData {
  id?: string;
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
 * Page Schema interface
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
 * Schema validation result
 */
export interface SchemaValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Schema validation error
 */
export class SchemaValidationError extends Error {
  constructor(message: string, public readonly schema: unknown) {
    super(message);
    this.name = "SchemaValidationError";
  }
}
