/**
 * Schema validation utilities
 */
import type { PageSchema } from "./types";

/**
 * Validate schema format (synchronous version, for type guard)
 * @param data - Data to validate
 * @returns Whether data is a valid PageSchema
 */
export function validateSchema(data: unknown): data is PageSchema {
  if (!data || typeof data !== "object") {
    return false;
  }

  const obj = data as Record<string, unknown>;

  // Validate version
  if (typeof obj.version !== "string" || !obj.version) {
    return false;
  }

  // Validate metadata
  if (!obj.metadata || typeof obj.metadata !== "object") {
    return false;
  }
  const metadata = obj.metadata as Record<string, unknown>;
  if (typeof metadata.name !== "string" || !metadata.name) {
    return false;
  }
  if (typeof metadata.version !== "string") {
    return false;
  }

  // Validate components array
  if (!Array.isArray(obj.components)) {
    return false;
  }

  // Validate canvas config
  if (!obj.canvas || typeof obj.canvas !== "object") {
    return false;
  }
  const canvas = obj.canvas as Record<string, unknown>;
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

  // Validate theme (allow any type)
  if (obj.theme === undefined || obj.theme === null) {
    return false;
  }

  // Validate dataSources array
  if (!Array.isArray(obj.dataSources)) {
    return false;
  }

  return true;
}

/**
 * Validate schema format (async version with detailed errors)
 * @param schemaJson - Schema JSON string
 * @returns Validation result with errors
 */
export async function validateSchemaAsync(
  schemaJson: string
): Promise<{ valid: boolean; errors: string[] }> {
  const errors: string[] = [];

  try {
    const data = JSON.parse(schemaJson);

    if (!data || typeof data !== "object") {
      errors.push("Schema must be an object");
      return { valid: false, errors };
    }

    const obj = data as Record<string, unknown>;

    // Validate version
    if (typeof obj.version !== "string" || !obj.version) {
      errors.push("Missing or invalid 'version' field");
    }

    // Validate metadata
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
    }

    // Validate components array
    if (!Array.isArray(obj.components)) {
      errors.push("Missing or invalid 'components' field (must be an array)");
    }

    // Validate canvas config
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

    // Validate theme
    if (obj.theme === undefined || obj.theme === null) {
      errors.push("Missing 'theme' field");
    }

    // Validate dataSources array
    if (!Array.isArray(obj.dataSources)) {
      errors.push("Missing or invalid 'dataSources' field (must be an array)");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : "Unknown error";
    return {
      valid: false,
      errors: [`Invalid JSON: ${errorMessage}`],
    };
  }
}
