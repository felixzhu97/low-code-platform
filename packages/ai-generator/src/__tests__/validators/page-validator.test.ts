import { describe, it, expect } from "vitest";
import { PageValidator } from "../../validators";
import { ValidationError } from "../../types";

describe("PageValidator", () => {
  describe("validate()", () => {
    it("should pass validation for valid page schema", () => {
      // Given
      const validator = new PageValidator();
      const page = {
        version: "1.0.0",
        metadata: {
          name: "Test Page",
          description: "Test",
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
          version: "1.0.0",
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

      // When/Then
      expect(() => validator.validate(page)).not.toThrow();
    });

    it("should throw ValidationError for missing version", () => {
      // Given
      const validator = new PageValidator();
      const page = {
        metadata: {
          name: "Test Page",
          version: "1.0.0",
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
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

      // When/Then
      expect(() => validator.validate(page)).toThrow(ValidationError);
    });

    it("should throw ValidationError for missing metadata", () => {
      // Given
      const validator = new PageValidator();
      const page = {
        version: "1.0.0",
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

      // When/Then
      expect(() => validator.validate(page)).toThrow(ValidationError);
    });

    it("should throw ValidationError for invalid canvas", () => {
      // Given
      const validator = new PageValidator();
      const page = {
        version: "1.0.0",
        metadata: {
          name: "Test Page",
          version: "1.0.0",
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
        },
        components: [],
        canvas: {
          showGrid: "invalid", // should be boolean
          snapToGrid: false,
          viewportWidth: 1920,
          activeDevice: "desktop",
        },
        theme: {},
        dataSources: [],
      };

      // When/Then
      expect(() => validator.validate(page)).toThrow(ValidationError);
    });
  });

  describe("validateAsync()", () => {
    it("should pass async validation for valid page", async () => {
      // Given
      const validator = new PageValidator();
      const page = {
        version: "1.0.0",
        metadata: {
          name: "Test Page",
          description: "Test",
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
          version: "1.0.0",
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

      // When/Then
      await expect(validator.validateAsync(page)).resolves.not.toThrow();
    });

    it("should reject with ValidationError for invalid page", async () => {
      // Given
      const validator = new PageValidator();
      const invalidPage = {
        version: "1.0.0",
        // missing required fields
      };

      // When/Then
      await expect(validator.validateAsync(invalidPage)).rejects.toThrow(
        ValidationError
      );
    });
  });
});
