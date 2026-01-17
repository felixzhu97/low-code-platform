/**
 * Schema migration utilities
 */
import type { PageSchema, ProjectData } from "./types";
import { validateSchema } from "./validator";
import { projectDataToSchema } from "./serializer";

/**
 * Migrate old version schema to new version (synchronous version)
 * @param schema - Schema to migrate
 * @returns Migrated PageSchema
 */
export function migrateSchema(schema: unknown): PageSchema {
  // If already in PageSchema format, return as is
  if (validateSchema(schema)) {
    return schema;
  }

  // If in old ProjectData format, convert to PageSchema
  const obj = schema as Record<string, unknown>;
  if (
    obj.components &&
    Array.isArray(obj.components) &&
    obj.canvas &&
    typeof obj.name === "string"
  ) {
    return projectDataToSchema(schema as ProjectData);
  }

  throw new Error("Unable to recognize schema format");
}

/**
 * Migrate schema version (synchronous version)
 * @param schemaJson - Schema JSON string
 * @param fromVersion - Source version
 * @param toVersion - Target version
 * @returns Migrated schema JSON string
 */
export function migrateSchemaVersion(
  schemaJson: string,
  fromVersion: string,
  toVersion: string
): string {
  const schema = JSON.parse(schemaJson);
  const migrated = migrateSchema(schema);

  // Update version in metadata
  if (migrated.metadata) {
    migrated.metadata.version = toVersion;
  }
  migrated.version = toVersion;

  return JSON.stringify(migrated, null, 2);
}

/**
 * Check if schema needs migration
 * @param schema - Schema to check
 * @param targetVersion - Target version (default: "1.0.0")
 * @returns Whether schema needs migration
 */
export function needsMigration(
  schema: unknown,
  targetVersion: string = "1.0.0"
): boolean {
  if (!validateSchema(schema)) {
    return true; // Invalid schema, needs migration
  }

  const pageSchema = schema as PageSchema;
  return pageSchema.version !== targetVersion;
}
