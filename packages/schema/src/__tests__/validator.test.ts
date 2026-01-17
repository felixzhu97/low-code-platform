import { describe, it, expect } from "vitest";
import { validateSchema, validateSchemaJson, validateSchemaDetailed } from "../validator";
import type { PageSchema } from "../types";

describe("validator", () => {
  const validSchema: PageSchema = {
    version: "1.0.0",
    metadata: {
      name: "Test",
      version: "1.0.0",
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01",
    },
    components: [],
    canvas: {
      showGrid: false,
      snapToGrid: false,
      viewportWidth: 1920,
      activeDevice: "desktop",
    },
    theme: {},
    dataSources: [],
  };

  describe("validateSchema", () => {
    it("should validate valid schema", () => {
      expect(validateSchema(validSchema)).toBe(true);
    });

    it("should reject invalid schema", () => {
      expect(validateSchema({})).toBe(false);
      expect(validateSchema(null)).toBe(false);
      expect(validateSchema(undefined)).toBe(false);
    });
  });

  describe("validateSchemaJson", () => {
    it("should validate valid JSON", () => {
      const result = validateSchemaJson(JSON.stringify(validSchema));
      expect(result.valid).toBe(true);
    });

    it("should reject invalid JSON", () => {
      const result = validateSchemaJson("invalid json");
      expect(result.valid).toBe(false);
    });
  });

  describe("validateSchemaDetailed", () => {
    it("should return detailed errors", () => {
      const result = validateSchemaDetailed({});
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });
});
