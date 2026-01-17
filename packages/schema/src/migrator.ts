import { SCHEMA_VERSION } from "./types";
import type { PageSchema, ProjectData } from "./types";
import { validateSchema } from "./validator";
import { projectDataToSchema } from "./serializer";

/**
 * 迁移旧版本 Schema 到新版本（同步版本）
 *
 * @param schema - 旧版本的 Schema 数据（可以是 PageSchema 或 ProjectData）
 * @returns 最新版本的 PageSchema
 * @throws 如果无法识别 Schema 格式
 */
export function migrateSchema(schema: unknown): PageSchema {
  // 如果已经是 PageSchema 格式，直接返回
  if (validateSchema(schema)) {
    return schema;
  }

  // 如果是旧版本的 ProjectData 格式，转换为 PageSchema
  if (
    typeof schema === "object" &&
    schema !== null &&
    "components" in schema &&
    Array.isArray((schema as Record<string, unknown>).components) &&
    "canvas" in schema
  ) {
    return projectDataToSchema(schema as ProjectData);
  }

  throw new Error("无法识别的 Schema 格式");
}

/**
 * 迁移 Schema JSON 字符串
 *
 * @param schemaJson - Schema JSON 字符串
 * @param fromVersion - 源版本（可选，用于版本特定的迁移逻辑）
 * @param toVersion - 目标版本（默认使用 SCHEMA_VERSION）
 * @returns 迁移后的 Schema JSON 字符串
 */
export function migrateSchemaJson(
  schemaJson: string,
  fromVersion?: string,
  toVersion: string = SCHEMA_VERSION
): string {
  try {
    const data = JSON.parse(schemaJson);
    const migrated = migrateSchema(data);

    // 确保版本号正确
    migrated.version = toVersion;
    migrated.metadata.version = toVersion;

    return JSON.stringify(migrated, null, 2);
  } catch (error) {
    throw new Error(
      `Schema migration failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Schema 验证错误
 */
export class SchemaValidationError extends Error {
  constructor(
    message: string,
    public readonly schema: unknown
  ) {
    super(message);
    this.name = "SchemaValidationError";
  }
}
