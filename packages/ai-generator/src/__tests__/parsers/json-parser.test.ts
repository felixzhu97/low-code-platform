import { describe, it, expect } from "vitest";
import { JSONParser } from "../../parsers";
import { ParseError } from "../../types";

describe("JSONParser", () => {
  describe("parseComponent()", () => {
    it("should parse valid component JSON", () => {
      // Given
      const parser = new JSONParser();
      const jsonString = JSON.stringify({
        id: "comp_123",
        type: "button",
        name: "Test Button",
        properties: { text: "Click me" },
      });

      // When
      const component = parser.parseComponent(jsonString);

      // Then
      expect(component.id).toBe("comp_123");
      expect(component.type).toBe("button");
      expect(component.name).toBe("Test Button");
      expect(component.properties?.text).toBe("Click me");
    });

    it("should parse component with markdown code block", () => {
      // Given
      const parser = new JSONParser();
      const jsonString = "```json\n" + JSON.stringify({
        id: "comp_123",
        type: "button",
        name: "Test Button",
      }) + "\n```";

      // When
      const component = parser.parseComponent(jsonString);

      // Then
      expect(component.id).toBe("comp_123");
      expect(component.type).toBe("button");
    });

    it("should generate id when missing", () => {
      // Given
      const parser = new JSONParser();
      const jsonString = JSON.stringify({
        type: "button",
        name: "Test Button",
      });

      // When
      const component = parser.parseComponent(jsonString);

      // Then
      expect(component.id).toBeDefined();
      expect(typeof component.id).toBe("string");
    });

    it("should throw ParseError for invalid JSON", () => {
      // Given
      const parser = new JSONParser();
      const invalidJson = "{ invalid json }";

      // When/Then
      expect(() => parser.parseComponent(invalidJson)).toThrow(ParseError);
    });
  });

  describe("parsePage()", () => {
    it("should parse valid page JSON", () => {
      // Given
      const parser = new JSONParser();
      const jsonString = JSON.stringify({
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
      });

      // When
      const page = parser.parsePage(jsonString);

      // Then
      expect(page.version).toBe("1.0.0");
      expect(page.metadata.name).toBe("Test Page");
      expect(Array.isArray(page.components)).toBe(true);
    });

    it("should add default values for missing fields", () => {
      // Given
      const parser = new JSONParser();
      const jsonString = JSON.stringify({
        components: [],
        canvas: {
          showGrid: false,
          snapToGrid: false,
          viewportWidth: 1920,
          activeDevice: "desktop",
        },
        theme: {},
        dataSources: [],
      });

      // When
      const page = parser.parsePage(jsonString);

      // Then
      expect(page.version).toBeDefined();
      expect(page.metadata.name).toBeDefined();
      expect(page.metadata.createdAt).toBeDefined();
    });

    it("should throw ParseError for invalid page JSON", () => {
      // Given
      const parser = new JSONParser();
      const invalidJson = "not a valid page";

      // When/Then
      expect(() => parser.parsePage(invalidJson)).toThrow(ParseError);
    });
  });

  describe("parseJSON()", () => {
    it("should fix common JSON issues", () => {
      // Given
      const parser = new JSONParser();
      const jsonWithTrailingComma = '{"id": "123", "type": "button",}';

      // When
      const result = parser.parseJSON(jsonWithTrailingComma);

      // Then
      expect(result).toEqual({ id: "123", type: "button" });
    });
  });
});
