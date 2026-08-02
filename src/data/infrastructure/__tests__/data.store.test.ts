import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { act } from "react";
import { renderHook } from "@testing-library/react";
import { useDataStore } from "../data.store";
import type { DataSource, DataMapping } from "@/data/domain/types";

// Mock zustand/middleware
vi.mock("zustand/middleware", async () => {
  const actual = await vi.importActual("zustand/middleware");
  return {
    ...actual,
    devtools: (fn: any) => fn,
    persist: (fn: any) => fn,
  };
});

// Mock DataBindingService
vi.mock("@/data/application/data-binding.service", () => ({
  DataBindingService: {
    previewDataMapping: vi.fn((data, mappings, limit) => {
      if (!Array.isArray(data)) return [data];
      return data.slice(0, limit);
    }),
  },
}));

describe("useDataStore", () => {
  const createMockDataSource = (overrides: Partial<DataSource> = {}): DataSource => ({
    id: `ds-${Math.random().toString(36).substr(2, 9)}`,
    name: "Test Data Source",
    type: "static",
    data: { items: [] },
    config: {},
    lastUpdated: new Date().toISOString(),
    status: "active",
    ...overrides,
  });

  const createMockMapping = (overrides: Partial<DataMapping> = {}): DataMapping => ({
    field: "name",
    sourcePath: "data.name",
    targetPath: "component.name",
    transform: "string",
    defaultValue: undefined,
    ...overrides,
  });

  beforeEach(() => {
    useDataStore.setState({
      dataSources: [],
      activeDataSource: null,
      dataBindings: {},
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Initial State", () => {
    it("should have correct initial values", () => {
      const { result } = renderHook(() => useDataStore());

      expect(result.current.dataSources).toEqual([]);
      expect(result.current.activeDataSource).toBeNull();
      expect(result.current.dataBindings).toEqual({});
    });
  });

  describe("addDataSource", () => {
    it("should add a data source", () => {
      const { result } = renderHook(() => useDataStore());
      const dataSource = createMockDataSource({ id: "ds-1", name: "Users API" });

      act(() => {
        result.current.addDataSource(dataSource);
      });

      expect(result.current.dataSources).toHaveLength(1);
      expect(result.current.dataSources[0]).toEqual(dataSource);
    });

    it("should add multiple data sources", () => {
      const { result } = renderHook(() => useDataStore());
      const ds1 = createMockDataSource({ id: "ds-1" });
      const ds2 = createMockDataSource({ id: "ds-2" });
      const ds3 = createMockDataSource({ id: "ds-3" });

      act(() => {
        result.current.addDataSource(ds1);
        result.current.addDataSource(ds2);
        result.current.addDataSource(ds3);
      });

      expect(result.current.dataSources).toHaveLength(3);
    });

    it("should preserve existing data sources", () => {
      const { result } = renderHook(() => useDataStore());
      const existing = createMockDataSource({ id: "existing" });
      const newDs = createMockDataSource({ id: "new" });

      act(() => {
        result.current.addDataSource(existing);
      });

      act(() => {
        result.current.addDataSource(newDs);
      });

      expect(result.current.dataSources).toHaveLength(2);
    });
  });

  describe("updateDataSource", () => {
    it("should update a data source", () => {
      const { result } = renderHook(() => useDataStore());
      const dataSource = createMockDataSource({ 
        id: "ds-1", 
        name: "Original Name",
        status: "active"
      });

      act(() => {
        result.current.addDataSource(dataSource);
        result.current.updateDataSource("ds-1", { 
          name: "Updated Name",
          status: "inactive"
        });
      });

      expect(result.current.dataSources[0].name).toBe("Updated Name");
      expect(result.current.dataSources[0].status).toBe("inactive");
    });

    it("should handle partial updates", () => {
      const { result } = renderHook(() => useDataStore());
      const dataSource = createMockDataSource({ 
        id: "ds-1",
        data: { old: "data" },
        config: { url: "http://old.com" }
      });

      act(() => {
        result.current.addDataSource(dataSource);
        result.current.updateDataSource("ds-1", { 
          name: "New Name" 
        });
      });

      expect(result.current.dataSources[0].name).toBe("New Name");
      expect(result.current.dataSources[0].data).toEqual({ old: "data" });
    });

    it("should not update non-existent data source", () => {
      const { result } = renderHook(() => useDataStore());
      const dataSource = createMockDataSource({ id: "ds-1" });

      act(() => {
        result.current.addDataSource(dataSource);
        result.current.updateDataSource("non-existent", { name: "New Name" });
      });

      expect(result.current.dataSources[0].name).toBe("Test Data Source");
    });
  });

  describe("deleteDataSource", () => {
    it("should delete a data source by id", () => {
      const { result } = renderHook(() => useDataStore());
      const dataSource = createMockDataSource({ id: "ds-1" });

      act(() => {
        result.current.addDataSource(dataSource);
      });

      expect(result.current.dataSources).toHaveLength(1);

      act(() => {
        result.current.deleteDataSource("ds-1");
      });

      expect(result.current.dataSources).toHaveLength(0);
    });

    it("should clear active data source if deleted", () => {
      const { result } = renderHook(() => useDataStore());
      const dataSource = createMockDataSource({ id: "ds-1" });

      act(() => {
        result.current.addDataSource(dataSource);
        result.current.setActiveDataSource("ds-1");
      });

      expect(result.current.activeDataSource).toBe("ds-1");

      act(() => {
        result.current.deleteDataSource("ds-1");
      });

      expect(result.current.activeDataSource).toBeNull();
    });

    it("should clean up data bindings referencing deleted data source", () => {
      const { result } = renderHook(() => useDataStore());
      const dataSource = createMockDataSource({ id: "ds-1" });
      const mapping = createMockMapping({ sourcePath: "ds-1.field" });

      act(() => {
        result.current.addDataSource(dataSource);
        result.current.bindComponentToDataSource("comp-1", "ds-1", [mapping]);
      });

      expect(result.current.dataBindings["comp-1"]).toBeDefined();

      act(() => {
        result.current.deleteDataSource("ds-1");
      });

      // The binding should be cleaned up
      expect(result.current.dataBindings["comp-1"]).toBeUndefined();
    });

    it("should preserve other data sources when deleting one", () => {
      const { result } = renderHook(() => useDataStore());
      const ds1 = createMockDataSource({ id: "ds-1" });
      const ds2 = createMockDataSource({ id: "ds-2" });

      act(() => {
        result.current.addDataSource(ds1);
        result.current.addDataSource(ds2);
      });

      act(() => {
        result.current.deleteDataSource("ds-1");
      });

      expect(result.current.dataSources).toHaveLength(1);
      expect(result.current.dataSources[0].id).toBe("ds-2");
    });
  });

  describe("setActiveDataSource", () => {
    it("should set active data source", () => {
      const { result } = renderHook(() => useDataStore());
      const dataSource = createMockDataSource({ id: "ds-1" });

      act(() => {
        result.current.addDataSource(dataSource);
        result.current.setActiveDataSource("ds-1");
      });

      expect(result.current.activeDataSource).toBe("ds-1");
    });

    it("should set active data source to null", () => {
      useDataStore.setState({ activeDataSource: "ds-1" });
      const { result } = renderHook(() => useDataStore());

      act(() => {
        result.current.setActiveDataSource(null);
      });

      expect(result.current.activeDataSource).toBeNull();
    });

    it("should handle non-existent data source id", () => {
      const { result } = renderHook(() => useDataStore());

      act(() => {
        result.current.setActiveDataSource("non-existent");
      });

      expect(result.current.activeDataSource).toBe("non-existent");
    });
  });

  describe("refreshDataSource", () => {
    it("should refresh data source and update timestamp", async () => {
      const { result } = renderHook(() => useDataStore());
      const originalDate = "2024-01-01T00:00:00.000Z";
      const dataSource = createMockDataSource({ 
        id: "ds-1",
        lastUpdated: originalDate
      });

      act(() => {
        result.current.addDataSource(dataSource);
      });

      await act(async () => {
        await result.current.refreshDataSource("ds-1");
      });

      expect(result.current.dataSources[0].lastUpdated).not.toBe(originalDate);
      expect(result.current.dataSources[0].status).toBe("active");
    });

    it("should not throw for non-existent data source", async () => {
      const { result } = renderHook(() => useDataStore());

      let error: Error | undefined;
      await act(async () => {
        try {
          await result.current.refreshDataSource("non-existent");
        } catch (e) {
          error = e as Error;
        }
      });

      expect(error).toBeUndefined();
    });

    it("should handle refresh error", async () => {
      const { result } = renderHook(() => useDataStore());
      const dataSource = createMockDataSource({ id: "ds-1" });

      act(() => {
        result.current.addDataSource(dataSource);
      });

      await act(async () => {
        await result.current.refreshDataSource("ds-1");
      });

      expect(result.current.dataSources[0].status).toBeDefined();
    });
  });

  describe("bindComponentToDataSource", () => {
    it("should bind component to data source with mappings", () => {
      const { result } = renderHook(() => useDataStore());
      const mappings = [
        createMockMapping({ field: "name" }),
        createMockMapping({ field: "age" }),
      ];

      act(() => {
        result.current.bindComponentToDataSource("comp-1", "ds-1", mappings);
      });

      expect(result.current.dataBindings["comp-1"]).toEqual(mappings);
    });

    it("should bind component with empty mappings", () => {
      const { result } = renderHook(() => useDataStore());

      act(() => {
        result.current.bindComponentToDataSource("comp-1", "ds-1");
      });

      expect(result.current.dataBindings["comp-1"]).toEqual([]);
    });

    it("should update existing binding", () => {
      const { result } = renderHook(() => useDataStore());
      const mappings1 = [createMockMapping({ field: "name" })];
      const mappings2 = [createMockMapping({ field: "email" })];

      act(() => {
        result.current.bindComponentToDataSource("comp-1", "ds-1", mappings1);
      });

      act(() => {
        result.current.bindComponentToDataSource("comp-1", "ds-2", mappings2);
      });

      expect(result.current.dataBindings["comp-1"]).toEqual(mappings2);
    });

    it("should allow multiple components to bind same data source", () => {
      const { result } = renderHook(() => useDataStore());

      act(() => {
        result.current.bindComponentToDataSource("comp-1", "ds-1");
        result.current.bindComponentToDataSource("comp-2", "ds-1");
      });

      expect(result.current.dataBindings["comp-1"]).toEqual([]);
      expect(result.current.dataBindings["comp-2"]).toEqual([]);
    });
  });

  describe("unbindComponentFromDataSource", () => {
    it("should unbind component from data source", () => {
      const { result } = renderHook(() => useDataStore());

      act(() => {
        result.current.bindComponentToDataSource("comp-1", "ds-1", [
          createMockMapping()
        ]);
      });

      expect(result.current.dataBindings["comp-1"]).toBeDefined();

      act(() => {
        result.current.unbindComponentFromDataSource("comp-1");
      });

      expect(result.current.dataBindings["comp-1"]).toBeUndefined();
    });

    it("should not throw for non-existent binding", () => {
      const { result } = renderHook(() => useDataStore());

      act(() => {
        result.current.unbindComponentFromDataSource("non-existent");
      });

      expect(result.current.dataBindings["non-existent"]).toBeUndefined();
    });

    it("should only remove specified component binding", () => {
      const { result } = renderHook(() => useDataStore());

      act(() => {
        result.current.bindComponentToDataSource("comp-1", "ds-1");
        result.current.bindComponentToDataSource("comp-2", "ds-1");
        result.current.unbindComponentFromDataSource("comp-1");
      });

      expect(result.current.dataBindings["comp-1"]).toBeUndefined();
      expect(result.current.dataBindings["comp-2"]).toEqual([]);
    });
  });

  describe("updateDataMappings", () => {
    it("should update data mappings for component", () => {
      const { result } = renderHook(() => useDataStore());
      const newMappings = [
        createMockMapping({ field: "updated" }),
        createMockMapping({ field: "field2" }),
      ];

      act(() => {
        result.current.bindComponentToDataSource("comp-1", "ds-1");
        result.current.updateDataMappings("comp-1", newMappings);
      });

      expect(result.current.dataBindings["comp-1"]).toEqual(newMappings);
    });

    it("should add mappings if none existed", () => {
      const { result } = renderHook(() => useDataStore());
      const mappings = [createMockMapping()];

      act(() => {
        result.current.updateDataMappings("comp-1", mappings);
      });

      expect(result.current.dataBindings["comp-1"]).toEqual(mappings);
    });
  });

  describe("getComponentData", () => {
    it("should return null when no bindings exist", () => {
      const { result } = renderHook(() => useDataStore());

      const data = result.current.getComponentData("comp-1");

      expect(data).toBeNull();
    });

    it("should return null when bindings exist but are empty", () => {
      const { result } = renderHook(() => useDataStore());

      act(() => {
        result.current.bindComponentToDataSource("comp-1", "ds-1");
      });

      const data = result.current.getComponentData("comp-1");

      expect(data).toBeNull();
    });

    it("should return data when bindings exist", () => {
      const { result } = renderHook(() => useDataStore());

      act(() => {
        result.current.bindComponentToDataSource("comp-1", "ds-1", [
          createMockMapping()
        ]);
      });

      const data = result.current.getComponentData("comp-1");

      expect(data).not.toBeNull();
    });
  });

  describe("getDataSourceById", () => {
    it("should return data source by id", () => {
      const { result } = renderHook(() => useDataStore());
      const dataSource = createMockDataSource({ id: "ds-1", name: "Users" });

      act(() => {
        result.current.addDataSource(dataSource);
      });

      const found = result.current.getDataSourceById("ds-1");

      expect(found).toEqual(dataSource);
    });

    it("should return null for non-existent id", () => {
      const { result } = renderHook(() => useDataStore());

      const found = result.current.getDataSourceById("non-existent");

      expect(found).toBeNull();
    });

    it("should return null when no data sources exist", () => {
      const { result } = renderHook(() => useDataStore());

      const found = result.current.getDataSourceById("ds-1");

      expect(found).toBeNull();
    });
  });

  describe("getComponentsByDataSource", () => {
    it("should return component ids using data source", () => {
      const { result } = renderHook(() => useDataStore());
      const mapping = createMockMapping({ sourcePath: "ds-1.field" });

      act(() => {
        result.current.bindComponentToDataSource("comp-1", "ds-1", [mapping]);
        result.current.bindComponentToDataSource("comp-2", "ds-1", [mapping]);
        result.current.bindComponentToDataSource("comp-3", "ds-2", [createMockMapping()]);
      });

      const components = result.current.getComponentsByDataSource("ds-1");

      expect(components).toContain("comp-1");
      expect(components).toContain("comp-2");
      expect(components).not.toContain("comp-3");
    });

    it("should return empty array for data source with no bindings", () => {
      const { result } = renderHook(() => useDataStore());

      const components = result.current.getComponentsByDataSource("ds-1");

      expect(components).toEqual([]);
    });
  });

  describe("clearAllDataBindings", () => {
    it("should clear all data bindings", () => {
      const { result } = renderHook(() => useDataStore());

      act(() => {
        result.current.bindComponentToDataSource("comp-1", "ds-1");
        result.current.bindComponentToDataSource("comp-2", "ds-1");
        result.current.bindComponentToDataSource("comp-3", "ds-2");
      });

      expect(Object.keys(result.current.dataBindings)).toHaveLength(3);

      act(() => {
        result.current.clearAllDataBindings();
      });

      expect(result.current.dataBindings).toEqual({});
    });

    it("should do nothing when no bindings exist", () => {
      const { result } = renderHook(() => useDataStore());

      act(() => {
        result.current.clearAllDataBindings();
      });

      expect(result.current.dataBindings).toEqual({});
    });
  });

  describe("Edge Cases", () => {
    it("should handle data source with complex config", () => {
      const { result } = renderHook(() => useDataStore());
      const dataSource = createMockDataSource({
        id: "ds-1",
        config: {
          url: "https://api.example.com",
          method: "POST" as const,
          headers: { "Content-Type": "application/json" },
          params: { page: 1, limit: 10 },
          timeout: 5000,
          retryCount: 3,
        },
      });

      act(() => {
        result.current.addDataSource(dataSource);
      });

      expect(result.current.dataSources[0].config).toBeDefined();
      expect(result.current.dataSources[0].config?.url).toBe("https://api.example.com");
    });

    it("should handle data source with database type", () => {
      const { result } = renderHook(() => useDataStore());
      const dataSource = createMockDataSource({
        id: "ds-1",
        type: "database" as const,
        config: {
          connectionString: "mongodb://localhost:27017",
          query: "SELECT * FROM users",
          table: "users",
        },
      });

      act(() => {
        result.current.addDataSource(dataSource);
      });

      expect(result.current.dataSources[0].type).toBe("database");
    });

    it("should handle data source with websocket type", () => {
      const { result } = renderHook(() => useDataStore());
      const dataSource = createMockDataSource({
        id: "ds-1",
        type: "websocket" as const,
        config: {
          wsUrl: "wss://stream.example.com",
          protocols: ["protocol-v1"],
        },
      });

      act(() => {
        result.current.addDataSource(dataSource);
      });

      expect(result.current.dataSources[0].type).toBe("websocket");
    });

    it("should handle rapid add/delete operations", async () => {
      const { result } = renderHook(() => useDataStore());

      act(() => {
        for (let i = 0; i < 50; i++) {
          result.current.addDataSource(createMockDataSource({ id: `ds-${i}` }));
        }
      });

      expect(result.current.dataSources).toHaveLength(50);

      await act(async () => {
        for (let i = 0; i < 25; i++) {
          result.current.deleteDataSource(`ds-${i}`);
        }
      });

      expect(result.current.dataSources).toHaveLength(25);
    });

    it("should handle mapping with all transform types", () => {
      const { result } = renderHook(() => useDataStore());

      const mappings: DataMapping[] = [
        { field: "stringField", sourcePath: "data.str", targetPath: "comp.str", transform: "string" },
        { field: "numberField", sourcePath: "data.num", targetPath: "comp.num", transform: "number" },
        { field: "boolField", sourcePath: "data.bool", targetPath: "comp.bool", transform: "boolean" },
        { field: "dateField", sourcePath: "data.date", targetPath: "comp.date", transform: "date" },
        { field: "jsonField", sourcePath: "data.json", targetPath: "comp.json", transform: "json" },
      ];

      act(() => {
        result.current.bindComponentToDataSource("comp-1", "ds-1", mappings);
      });

      expect(result.current.dataBindings["comp-1"]).toHaveLength(5);
    });
  });
});
