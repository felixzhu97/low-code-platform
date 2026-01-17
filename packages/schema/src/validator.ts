import type { PageSchema, SchemaValidationResult } from "./types";

/**
 * 验证 Schema 格式（同步版本，用于类型守卫）
 *
 * @param data - 要验证的数据
 * @returns 是否为有效的 PageSchema
 */
export function validateSchema(data: unknown): data is PageSchema {
  if (!data || typeof data !== "object") {
    return false;
  }

  const schema = data as Record<string, unknown>;

  // 验证版本号
  if (typeof schema.version !== "string" || !schema.version) {
    return false;
  }

  // 验证元数据
  if (!schema.metadata || typeof schema.metadata !== "object") {
    return false;
  }
  const metadata = schema.metadata as Record<string, unknown>;
  if (typeof metadata.name !== "string" || !metadata.name) {
    return false;
  }
  if (typeof metadata.version !== "string") {
    return false;
  }

  // 验证组件数组
  if (!Array.isArray(schema.components)) {
    return false;
  }

  // 验证画布配置
  if (!schema.canvas || typeof schema.canvas !== "object") {
    return false;
  }
  const canvas = schema.canvas as Record<string, unknown>;
  if (typeof canvas.showGrid !== "boolean") {
    return false;
  }
  if (typeof canvas.snapToGrid !== "boolean") {
    return false;
  }
  if (typeof canvas.viewportWidth !== "number") {
    return false;
  }
  if (typeof canvas.activeDevice !== "string") {
    return false;
  }

  // 验证主题（允许任何类型，但不允许 undefined/null）
  if (schema.theme === undefined || schema.theme === null) {
    return false;
  }

  // 验证数据源数组
  if (!Array.isArray(schema.dataSources)) {
    return false;
  }

  return true;
}

/**
 * 验证 Schema JSON 字符串
 *
 * @param schemaJson - Schema JSON 字符串
 * @returns 验证结果
 */
export function validateSchemaJson(
  schemaJson: string
): SchemaValidationResult {
  try {
    const data = JSON.parse(schemaJson);
    const valid = validateSchema(data);

    if (valid) {
      return {
        valid: true,
        errors: [],
      };
    }

    return {
      valid: false,
      errors: ["Schema validation failed: missing required fields"],
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return {
      valid: false,
      errors: [`Invalid JSON: ${errorMessage}`],
    };
  }
}

/**
 * 详细验证 Schema，返回所有错误信息
 *
 * @param data - 要验证的数据
 * @returns 验证结果和错误列表
 */
export function validateSchemaDetailed(
  data: unknown
): SchemaValidationResult {
  const errors: string[] = [];

  if (!data || typeof data !== "object") {
    return {
      valid: false,
      errors: ["Schema must be an object"],
    };
  }

  const schema = data as Record<string, unknown>;

  // 验证版本号
  if (typeof schema.version !== "string" || !schema.version) {
    errors.push("Missing or invalid 'version' field");
  }

  // 验证元数据
  if (!schema.metadata || typeof schema.metadata !== "object") {
    errors.push("Missing or invalid 'metadata' field");
  } else {
    const metadata = schema.metadata as Record<string, unknown>;
    if (typeof metadata.name !== "string" || !metadata.name) {
      errors.push("Missing or invalid 'metadata.name' field");
    }
    if (typeof metadata.version !== "string") {
      errors.push("Missing or invalid 'metadata.version' field");
    }
  }

  // 验证组件数组
  if (!Array.isArray(schema.components)) {
    errors.push("Missing or invalid 'components' field (must be an array)");
  }

  // 验证画布配置
  if (!schema.canvas || typeof schema.canvas !== "object") {
    errors.push("Missing or invalid 'canvas' field");
  } else {
    const canvas = schema.canvas as Record<string, unknown>;
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

  // 验证主题
  if (schema.theme === undefined || schema.theme === null) {
    errors.push("Missing 'theme' field");
  }

  // 验证数据源数组
  if (!Array.isArray(schema.dataSources)) {
    errors.push("Missing or invalid 'dataSources' field (must be an array)");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
