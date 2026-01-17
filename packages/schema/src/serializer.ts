/**
 * Schema serialization utilities
 */
import { SCHEMA_VERSION } from "./types";
import type { PageSchema, ProjectData } from "./types";

/**
 * Convert ProjectData to PageSchema (synchronous version)
 * @param projectData - Project data to convert
 * @param version - Schema version (default: SCHEMA_VERSION)
 * @returns PageSchema
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
 * Convert ProjectData to Schema JSON (synchronous version)
 * @param projectData - Project data to convert
 * @param version - Schema version (default: SCHEMA_VERSION)
 * @param indent - JSON indentation (default: 2)
 * @returns Schema JSON string
 */
export function projectDataToSchemaJson(
  projectData: ProjectData,
  version: string = SCHEMA_VERSION,
  indent: number = 2
): string {
  const schema = projectDataToSchema(projectData, version);
  return JSON.stringify(schema, null, indent);
}

/**
 * Convert PageSchema to ProjectData (synchronous version)
 * @param schema - PageSchema to convert
 * @returns ProjectData
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
 * Convert Schema JSON to ProjectData (synchronous version)
 * @param schemaJson - Schema JSON string
 * @returns ProjectData
 */
export function schemaJsonToProjectData(schemaJson: string): ProjectData {
  const schema = JSON.parse(schemaJson) as PageSchema;
  return schemaToProjectData(schema);
}

/**
 * Serialize schema to JSON string
 * @param schema - PageSchema to serialize
 * @param indent - JSON indentation (default: 2)
 * @returns Schema JSON string
 */
export function serializeSchema(
  schema: PageSchema,
  indent: number = 2
): string {
  return JSON.stringify(schema, null, indent);
}

/**
 * Deserialize JSON string to schema
 * @param schemaJson - Schema JSON string
 * @returns PageSchema
 */
export function deserializeSchema(schemaJson: string): PageSchema {
  return JSON.parse(schemaJson) as PageSchema;
}
