import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import type { Component } from "@/domain/entities/types";
import { DataBindingService } from "../data-binding.service";
import { DataSourceService } from "../data-source.service";

vi.mock("../data-source.service", () => ({
  DataSourceService: {
    getDataSourceData: vi.fn(),
  },
}));

describe("DataBindingService", () => {
  const mockComponent: Component = {
    id: "comp-1",
    type: "text",
    name: "Test Text",
  };

  const mockDataSource = {
    id: "ds-1",
    name: "Test DataSource",
    type: "static" as const,
    data: { users: [{ name: "Alice", age: 30 }] },
  };

  const mockDataSources = [mockDataSource];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("bindDataSource", () => {
    it("should bind data source to component", () => {
      const result = DataBindingService.bindDataSource(mockComponent, "ds-1");

      expect(result.dataSource).toBe("ds-1");
      expect(result.dataMapping).toEqual([]);
    });

    it("should bind data source with data mappings", () => {
      const mappings = [
        { field: "name", sourcePath: "user.name", targetPath: "display.name" },
      ];
      const result = DataBindingService.bindDataSource(
        mockComponent,
        "ds-1",
        mappings
      );

      expect(result.dataSource).toBe("ds-1");
      expect(result.dataMapping).toEqual(mappings);
    });

    it("should preserve other component properties", () => {
      const componentWithProps = {
        ...mockComponent,
        position: { x: 100, y: 200 },
        properties: { visible: true },
      };
      const result = DataBindingService.bindDataSource(
        componentWithProps,
        "ds-1"
      );

      expect(result.position).toEqual({ x: 100, y: 200 });
      expect(result.properties).toEqual({ visible: true });
    });

    it("should not mutate original component", () => {
      const originalComponent = { ...mockComponent };
      DataBindingService.bindDataSource(mockComponent, "ds-1");

      expect(mockComponent.dataSource).toBeUndefined();
    });
  });

  describe("unbindDataSource", () => {
    it("should remove dataSource and dataMapping from component", () => {
      const componentWithBinding = {
        ...mockComponent,
        dataSource: "ds-1",
        dataMapping: [{ field: "name", sourcePath: "a", targetPath: "b" }],
      };
      const result = DataBindingService.unbindDataSource(componentWithBinding);

      expect(result.dataSource).toBeUndefined();
      expect(result.dataMapping).toBeUndefined();
    });

    it("should preserve other properties", () => {
      const componentWithBinding = {
        ...mockComponent,
        dataSource: "ds-1",
        dataMapping: [],
        position: { x: 50, y: 100 },
        properties: { visible: false },
      };
      const result = DataBindingService.unbindDataSource(componentWithBinding);

      expect(result.id).toBe("comp-1");
      expect(result.position).toEqual({ x: 50, y: 100 });
      expect(result.properties).toEqual({ visible: false });
    });

    it("should handle component without data binding", () => {
      const result = DataBindingService.unbindDataSource(mockComponent);

      expect(result.id).toBe("comp-1");
      expect(result.dataSource).toBeUndefined();
    });
  });

  describe("getComponentData", () => {
    it("should return null when component has no data source", async () => {
      const result = await DataBindingService.getComponentData(
        mockComponent,
        mockDataSources
      );

      expect(result).toBeNull();
    });

    it("should return null when data source not found", async () => {
      const componentWithDs = { ...mockComponent, dataSource: "non-existent" };
      const result = await DataBindingService.getComponentData(
        componentWithDs,
        mockDataSources
      );

      expect(result).toBeNull();
    });

    it("should return raw data when no mappings", async () => {
      const componentWithDs = { ...mockComponent, dataSource: "ds-1" };
      vi.mocked(DataSourceService.getDataSourceData).mockResolvedValue({
        users: [{ name: "Alice" }],
      });

      const result = await DataBindingService.getComponentData(
        componentWithDs,
        mockDataSources
      );

      expect(result).toEqual({ users: [{ name: "Alice" }] });
    });

    it("should apply data mappings when present", async () => {
      const componentWithDsAndMappings = {
        ...mockComponent,
        dataSource: "ds-1",
        dataMapping: [
          { field: "name", sourcePath: "users[0].name", targetPath: "name" },
        ],
      };
      vi.mocked(DataSourceService.getDataSourceData).mockResolvedValue({
        users: [{ name: "Alice", age: 30 }],
      });

      const result = await DataBindingService.getComponentData(
        componentWithDsAndMappings,
        mockDataSources
      );

      expect(result).toHaveProperty("name");
    });

    it("should handle error from data source service", async () => {
      const componentWithDs = { ...mockComponent, dataSource: "ds-1" };
      vi.mocked(DataSourceService.getDataSourceData).mockRejectedValue(
        new Error("Network error")
      );

      const result = await DataBindingService.getComponentData(
        componentWithDs,
        mockDataSources
      );

      expect(result).toBeNull();
    });

    it("should use default value when mapping fails", async () => {
      const componentWithDsAndMappings = {
        ...mockComponent,
        dataSource: "ds-1",
        dataMapping: [
          {
            field: "missing",
            sourcePath: "nonexistent.path",
            targetPath: "result",
            defaultValue: "fallback",
          },
        ],
      };
      vi.mocked(DataSourceService.getDataSourceData).mockResolvedValue({
        users: [{ name: "Alice" }],
      });

      const result = await DataBindingService.getComponentData(
        componentWithDsAndMappings,
        mockDataSources
      );

      expect(result.result).toBe("fallback");
    });
  });

  describe("createDataMapping", () => {
    it("should create a data mapping with all fields", () => {
      const result = DataBindingService.createDataMapping(
        "username",
        "user.name",
        "display.username",
        "string",
        "default"
      );

      expect(result).toEqual({
        field: "username",
        sourcePath: "user.name",
        targetPath: "display.username",
        transform: "string",
        defaultValue: "default",
      });
    });

    it("should create mapping without optional fields", () => {
      const result = DataBindingService.createDataMapping(
        "username",
        "user.name",
        "display.username"
      );

      expect(result).toEqual({
        field: "username",
        sourcePath: "user.name",
        targetPath: "display.username",
      });
    });

    it("should handle different transform types", () => {
      const transforms: Array<"string" | "number" | "boolean" | "date" | "json"> = [
        "string",
        "number",
        "boolean",
        "date",
        "json",
      ];

      transforms.forEach((transform) => {
        const result = DataBindingService.createDataMapping(
          "field",
          "source",
          "target",
          transform
        );
        expect(result.transform).toBe(transform);
      });
    });
  });

  describe("generateDataMapping", () => {
    it("should generate mappings for array data", () => {
      const sourceData = [{ name: "Alice", age: 30 }];
      const targetStructure = { name: "", age: 0 };

      const result = DataBindingService.generateDataMapping(
        sourceData,
        targetStructure
      );

      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty("field");
      expect(result[0]).toHaveProperty("sourcePath");
      expect(result[0]).toHaveProperty("targetPath");
    });

    it("should generate mappings for object data", () => {
      const sourceData = { name: "Alice", age: 30 };
      const targetStructure = { name: "", age: 0 };

      const result = DataBindingService.generateDataMapping(
        sourceData,
        targetStructure
      );

      expect(result.length).toBe(2);
    });

    it("should handle empty array", () => {
      const result = DataBindingService.generateDataMapping([], { name: "" });
      expect(result).toEqual([]);
    });

    it("should handle null source data", () => {
      const result = DataBindingService.generateDataMapping(null, { name: "" });
      expect(result).toEqual([]);
    });

    it("should handle nested structures", () => {
      const sourceData = { user: { name: "Alice" }, age: 30 };
      const targetStructure = { user: { name: "" }, age: 0 };

      const result = DataBindingService.generateDataMapping(
        sourceData,
        targetStructure
      );

      expect(result.length).toBeGreaterThanOrEqual(0);
    });

    it("should infer correct transform types", () => {
      const sourceData = {
        str: "hello",
        num: 42,
        bool: true,
        date: "2024-01-01",
      };
      const targetStructure = {
        str: "",
        num: 0,
        bool: false,
        date: new Date(),
      };

      const result = DataBindingService.generateDataMapping(
        sourceData,
        targetStructure
      );

      const strMapping = result.find((m) => m.field === "str");
      const numMapping = result.find((m) => m.field === "num");
      const boolMapping = result.find((m) => m.field === "bool");

      expect(strMapping?.transform).toBe("string");
      expect(numMapping?.transform).toBe("number");
      expect(boolMapping?.transform).toBe("boolean");
    });
  });

  describe("validateDataMapping", () => {
    it("should return valid for correct mapping", () => {
      const mapping = {
        field: "name",
        sourcePath: "user.name",
        targetPath: "display.name",
      };
      const sourceData = { user: { name: "Alice" } };

      const result = DataBindingService.validateDataMapping(mapping, sourceData);

      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it("should return error for empty field", () => {
      const mapping = {
        field: "",
        sourcePath: "user.name",
        targetPath: "display.name",
      };
      const sourceData = { user: { name: "Alice" } };

      const result = DataBindingService.validateDataMapping(mapping, sourceData);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain("字段名不能为空");
    });

    it("should return error for empty source path", () => {
      const mapping = {
        field: "name",
        sourcePath: "",
        targetPath: "display.name",
      };
      const sourceData = { user: { name: "Alice" } };

      const result = DataBindingService.validateDataMapping(mapping, sourceData);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain("源路径不能为空");
    });

    it("should return error for empty target path", () => {
      const mapping = {
        field: "name",
        sourcePath: "user.name",
        targetPath: "",
      };
      const sourceData = { user: { name: "Alice" } };

      const result = DataBindingService.validateDataMapping(mapping, sourceData);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain("目标路径不能为空");
    });

    it("should return error for non-existent source path", () => {
      const mapping = {
        field: "name",
        sourcePath: "nonexistent.path",
        targetPath: "display.name",
      };
      const sourceData = { user: { name: "Alice" } };

      const result = DataBindingService.validateDataMapping(mapping, sourceData);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes("不存在"))).toBe(true);
    });

    it("should return multiple errors", () => {
      const mapping = {
        field: "",
        sourcePath: "",
        targetPath: "",
      };
      const sourceData = { user: { name: "Alice" } };

      const result = DataBindingService.validateDataMapping(mapping, sourceData);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
    });
  });

  describe("previewDataMapping", () => {
    it("should preview mapping for array data with limit", () => {
      const sourceData = [
        { name: "Alice", age: 30 },
        { name: "Bob", age: 25 },
        { name: "Charlie", age: 35 },
        { name: "Diana", age: 28 },
        { name: "Eve", age: 32 },
        { name: "Frank", age: 27 },
      ];
      const mappings = [
        { field: "name", sourcePath: "name", targetPath: "displayName" },
        { field: "age", sourcePath: "age", targetPath: "displayAge" },
      ];

      const result = DataBindingService.previewDataMapping(
        sourceData,
        mappings,
        3
      );

      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({ displayName: "Alice", displayAge: 30 });
      expect(result[1]).toEqual({ displayName: "Bob", displayAge: 25 });
      expect(result[2]).toEqual({ displayName: "Charlie", displayAge: 35 });
    });

    it("should handle non-array data", () => {
      const sourceData = { name: "Alice", age: 30 };
      const mappings = [
        { field: "name", sourcePath: "name", targetPath: "displayName" },
      ];

      const result = DataBindingService.previewDataMapping(sourceData, mappings);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({ displayName: "Alice" });
    });

    it("should use default limit of 5", () => {
      const sourceData = Array.from({ length: 10 }, (_, i) => ({
        name: `User ${i}`,
      }));
      const mappings = [
        { field: "name", sourcePath: "name", targetPath: "displayName" },
      ];

      const result = DataBindingService.previewDataMapping(sourceData, mappings);

      expect(result).toHaveLength(5);
    });

    it("should handle empty array", () => {
      const result = DataBindingService.previewDataMapping([], []);
      expect(result).toEqual([]);
    });
  });

  describe("value transformations", () => {
    it("should transform string values", () => {
      const component: any = { id: "1" };
      const mapping = {
        field: "num",
        sourcePath: "value",
        targetPath: "result",
        transform: "string" as const,
      };
      const mappings = [mapping];
      const sourceData = { value: 42 };

      // Test through preview which uses applyDataMapping
      const result = DataBindingService.previewDataMapping(
        sourceData,
        mappings
      );

      expect(result[0].result).toBe("42");
    });

    it("should transform number values", () => {
      const sourceData = { value: "42" };
      const mappings = [
        { field: "num", sourcePath: "value", targetPath: "result", transform: "number" as const },
      ];

      const result = DataBindingService.previewDataMapping(
        sourceData,
        mappings
      );

      expect(result[0].result).toBe(42);
    });

    it("should transform boolean values", () => {
      const sourceData = { value: "true" };
      const mappings = [
        { field: "bool", sourcePath: "value", targetPath: "result", transform: "boolean" as const },
      ];

      const result = DataBindingService.previewDataMapping(
        sourceData,
        mappings
      );

      expect(result[0].result).toBe(true);
    });

    it("should handle boolean string '1' as true", () => {
      const sourceData = { value: "1" };
      const mappings = [
        { field: "bool", sourcePath: "value", targetPath: "result", transform: "boolean" as const },
      ];

      const result = DataBindingService.previewDataMapping(
        sourceData,
        mappings
      );

      expect(result[0].result).toBe(true);
    });

    it("should transform date values", () => {
      const sourceData = { value: "2024-01-01" };
      const mappings = [
        { field: "date", sourcePath: "value", targetPath: "result", transform: "date" as const },
      ];

      const result = DataBindingService.previewDataMapping(
        sourceData,
        mappings
      );

      expect(result[0].result).toBeInstanceOf(Date);
    });

    it("should transform JSON string values", () => {
      const sourceData = { value: '{"name":"Alice"}' };
      const mappings = [
        { field: "json", sourcePath: "value", targetPath: "result", transform: "json" as const },
      ];

      const result = DataBindingService.previewDataMapping(
        sourceData,
        mappings
      );

      expect(result[0].result).toEqual({ name: "Alice" });
    });

    it("should use default value when source is null", () => {
      const sourceData = { value: null };
      const mappings = [
        { field: "val", sourcePath: "value", targetPath: "result", defaultValue: "default" },
      ];

      const result = DataBindingService.previewDataMapping(
        sourceData,
        mappings
      );

      expect(result[0].result).toBe("default");
    });

    it("should use default value when source is undefined", () => {
      const sourceData = {};
      const mappings = [
        { field: "val", sourcePath: "value", targetPath: "result", defaultValue: "default" },
      ];

      const result = DataBindingService.previewDataMapping(
        sourceData,
        mappings
      );

      expect(result[0].result).toBe("default");
    });
  });

  describe("nested value access", () => {
    it("should handle dot notation paths", () => {
      const sourceData = { user: { profile: { name: "Alice" } } };
      const mappings = [
        { field: "name", sourcePath: "user.profile.name", targetPath: "result" },
      ];

      const result = DataBindingService.previewDataMapping(
        sourceData,
        mappings
      );

      expect(result[0].result).toBe("Alice");
    });

    it("should handle array index notation", () => {
      const sourceData = { users: [{ name: "Alice" }, { name: "Bob" }] };
      const mappings = [
        { field: "first", sourcePath: "users[0].name", targetPath: "result" },
      ];

      const result = DataBindingService.previewDataMapping(
        sourceData,
        mappings
      );

      expect(result[0].result).toBe("Alice");
    });

    it("should handle nested array notation", () => {
      const sourceData = { data: [[{ value: 42 }]] };
      const mappings = [
        { field: "val", sourcePath: "data[0]", targetPath: "result" },
      ];

      const result = DataBindingService.previewDataMapping(
        sourceData,
        mappings
      );

      expect(result[0].result).toBeDefined();
    });

    it("should handle mixed dot and array notation", () => {
      const sourceData = { items: [{ values: [1, 2, 3] }] };
      const mappings = [
        { field: "val", sourcePath: "items[0].values[1]", targetPath: "result" },
      ];

      const result = DataBindingService.previewDataMapping(
        sourceData,
        mappings
      );

      expect(result[0].result).toBe(2);
    });
  });
});
