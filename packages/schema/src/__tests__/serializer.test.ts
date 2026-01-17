import { describe, it, expect } from "vitest";
import {
  projectDataToSchema,
  schemaToProjectData,
  serializeSchema,
  deserializeSchema,
} from "../serializer";
import type { PageSchema, ProjectData } from "../types";

describe("serializer", () => {
  const projectData: ProjectData = {
    id: "test",
    name: "Test Project",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
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

  describe("projectDataToSchema", () => {
    it("should convert ProjectData to PageSchema", () => {
      const schema = projectDataToSchema(projectData);
      expect(schema.version).toBe("1.0.0");
      expect(schema.metadata.name).toBe(projectData.name);
      expect(schema.components).toEqual(projectData.components);
    });
  });

  describe("schemaToProjectData", () => {
    it("should convert PageSchema to ProjectData", () => {
      const schema = projectDataToSchema(projectData);
      const converted = schemaToProjectData(schema);
      expect(converted.name).toBe(projectData.name);
      expect(converted.components).toEqual(projectData.components);
    });
  });

  describe("serializeSchema", () => {
    it("should serialize schema to JSON", () => {
      const schema = projectDataToSchema(projectData);
      const json = serializeSchema(schema);
      expect(typeof json).toBe("string");
      expect(() => JSON.parse(json)).not.toThrow();
    });
  });

  describe("deserializeSchema", () => {
    it("should deserialize JSON to schema", () => {
      const schema = projectDataToSchema(projectData);
      const json = serializeSchema(schema);
      const deserialized = deserializeSchema(json);
      expect(deserialized.version).toBe(schema.version);
      expect(deserialized.metadata.name).toBe(schema.metadata.name);
    });

    it("should throw on invalid JSON", () => {
      expect(() => deserializeSchema("invalid json")).toThrow();
    });
  });
});
