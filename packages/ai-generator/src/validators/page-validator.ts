import type { PageSchema } from "@lowcode-platform/schema/types";
import { validateSchema, validateSchemaAsync } from "@lowcode-platform/schema/validator";
import { ValidationError } from "../types";

/**
 * 页面验证器
 */
export class PageValidator {
  /**
   * 验证页面 Schema（同步）
   */
  validate(schema: unknown): asserts schema is PageSchema {
    if (!validateSchema(schema)) {
      const errors = this.getValidationErrors(schema);
      throw new ValidationError(
        "Page schema validation failed",
        errors
      );
    }
  }

  /**
   * 验证页面 Schema（异步，提供详细错误信息）
   */
  async validateAsync(schema: unknown): Promise<void> {
    try {
      const schemaJson =
        typeof schema === "string" ? schema : JSON.stringify(schema);
      const result = await validateSchemaAsync(schemaJson);

      if (!result.valid) {
        throw new ValidationError(
          "Page schema validation failed",
          result.errors
        );
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new ValidationError(
        `Validation error: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * 获取验证错误详情
   */
  private getValidationErrors(schema: unknown): string[] {
    const errors: string[] = [];

    if (!schema || typeof schema !== "object") {
      return ["Page schema must be an object"];
    }

    const obj = schema as Record<string, unknown>;

    if (typeof obj.version !== "string" || !obj.version) {
      errors.push("Missing or invalid 'version' field");
    }

    if (!obj.metadata || typeof obj.metadata !== "object") {
      errors.push("Missing or invalid 'metadata' field");
    } else {
      const metadata = obj.metadata as Record<string, unknown>;
      if (typeof metadata.name !== "string" || !metadata.name) {
        errors.push("Missing or invalid 'metadata.name' field");
      }
      if (typeof metadata.version !== "string") {
        errors.push("Missing or invalid 'metadata.version' field");
      }
      if (typeof metadata.createdAt !== "string") {
        errors.push("Missing or invalid 'metadata.createdAt' field");
      }
      if (typeof metadata.updatedAt !== "string") {
        errors.push("Missing or invalid 'metadata.updatedAt' field");
      }
    }

    if (!Array.isArray(obj.components)) {
      errors.push("Missing or invalid 'components' field (must be an array)");
    }

    if (!obj.canvas || typeof obj.canvas !== "object") {
      errors.push("Missing or invalid 'canvas' field");
    } else {
      const canvas = obj.canvas as Record<string, unknown>;
      if (typeof canvas.showGrid !== "boolean") {
        errors.push("Missing or invalid 'canvas.showGrid' field");
      }
      if (typeof canvas.snapToGrid !== "boolean") {
        errors.push("Missing or invalid 'canvas.snapToGrid' field");
      }
      if (typeof canvas.viewportWidth !== "number") {
        errors.push("Missing or invalid 'canvas.viewportWidth' field");
      }
      if (typeof canvas.activeDevice !== "string") {
        errors.push("Missing or invalid 'canvas.activeDevice' field");
      }
    }

    if (obj.theme === undefined || obj.theme === null) {
      errors.push("Missing 'theme' field");
    }

    if (!Array.isArray(obj.dataSources)) {
      errors.push("Missing or invalid 'dataSources' field (must be an array)");
    }

    return errors;
  }
}