import { SCHEMA_VERSION } from "./types";
import type { PageSchema, ProjectData } from "./types";
import { validateSchema } from "./validator";

/**
 * 从 ProjectData 转换为 PageSchema（同步版本）
 *
 * @param projectData - 项目数据
 * @param version - Schema 版本（默认使用 SCHEMA_VERSION）
 * @returns PageSchema 对象
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
 * 从 ProjectData 转换为 Schema JSON 字符串
 *
 * @param projectData - 项目数据
 * @param version - Schema 版本（默认使用 SCHEMA_VERSION）
 * @param indent - JSON 缩进（默认 2）
 * @returns Schema JSON 字符串
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
 * 从 PageSchema 转换为 ProjectData（同步版本）
 *
 * @param schema - PageSchema 对象
 * @returns ProjectData 对象
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
 * 从 Schema JSON 字符串转换为 ProjectData
 *
 * @param schemaJson - Schema JSON 字符串
 * @returns ProjectData 对象
 * @throws 如果 JSON 无效或 Schema 格式错误
 */
export function schemaJsonToProjectData(schemaJson: string): ProjectData {
  const data = JSON.parse(schemaJson);

  if (!validateSchema(data)) {
    throw new Error("Invalid schema format");
  }

  return schemaToProjectData(data);
}

/**
 * 序列化 PageSchema 为 JSON 字符串
 *
 * @param schema - PageSchema 对象
 * @param indent - JSON 缩进（默认 2）
 * @returns JSON 字符串
 */
export function serializeSchema(
  schema: PageSchema,
  indent: number = 2
): string {
  return JSON.stringify(schema, null, indent);
}

/**
 * 反序列化 JSON 字符串为 PageSchema
 *
 * @param schemaJson - Schema JSON 字符串
 * @returns PageSchema 对象
 * @throws 如果 JSON 无效或 Schema 格式错误
 */
export function deserializeSchema(schemaJson: string): PageSchema {
  const data = JSON.parse(schemaJson);

  if (!validateSchema(data)) {
    throw new Error("Invalid schema format");
  }

  return data;
}
