import { describe, it, expect, beforeEach, vi } from "vitest";
import type { DataSource } from "@/data/types";
import { DataSourceService } from "../data-source.service";

describe("DataSourceService", () => {
  const createMockDataSource = (overrides: Partial<DataSource> = {}): DataSource => ({
    id: "ds-1",
    name: "Test DataSource",
    type: "static",
    data: { items: [] },
    ...overrides,
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createDataSource", () => {
    it("should create a static data source", () => {
      const result = DataSourceService.createDataSource(
        "My DataSource",
        "static",
        [{ id: 1, name: "Item 1" }]
      );

      expect(result.name).toBe("My DataSource");
      expect(result.type).toBe("static");
      expect(result.data).toEqual([{ id: 1, name: "Item 1" }]);
      expect(result.status).toBe("active");
      expect(result.id).toBeDefined();
      expect(result.lastUpdated).toBeDefined();
    });

    it("should create data source with config", () => {
      const config = {
        cacheEnabled: true,
        cacheTTL: 600,
        refreshInterval: 30,
      };
      const result = DataSourceService.createDataSource(
        "Cached DataSource",
        "api",
        null,
        config
      );

      expect(result.config).toEqual(config);
    });

    it("should generate unique IDs for multiple data sources", () => {
      const ds1 = DataSourceService.createDataSource("DS 1", "static", {});
      const ds2 = DataSourceService.createDataSource("DS 2", "static", {});

      expect(ds1.id).not.toBe(ds2.id);
    });

    it("should create data source with different types", () => {
      const types: DataSource["type"][] = ["static", "api", "database", "file", "websocket"];

      types.forEach((type) => {
        const result = DataSourceService.createDataSource(`${type} DS`, type, null);
        expect(result.type).toBe(type);
      });
    });
  });

  describe("updateDataSource", () => {
    it("should update data source properties", () => {
      const original = createMockDataSource({ name: "Original" });
      const result = DataSourceService.updateDataSource(original, { name: "Updated" });

      expect(result.name).toBe("Updated");
      expect(result.id).toBe(original.id);
      expect(result.lastUpdated).toBeDefined();
    });

    it("should update multiple properties", () => {
      const original = createMockDataSource();
      const updates = {
        name: "New Name",
        status: "inactive" as const,
        data: { items: [1, 2, 3] },
      };
      const result = DataSourceService.updateDataSource(original, updates);

      expect(result.name).toBe("New Name");
      expect(result.status).toBe("inactive");
      expect(result.data).toEqual({ items: [1, 2, 3] });
    });

    it("should not mutate original data source", () => {
      const original = createMockDataSource({ name: "Original" });
      DataSourceService.updateDataSource(original, { name: "Updated" });

      expect(original.name).toBe("Original");
    });

    it("should update lastUpdated timestamp", () => {
      const original = createMockDataSource();

      const result = DataSourceService.updateDataSource(original, { name: "New" });

      expect(result.lastUpdated).toBeDefined();
    });
  });

  describe("deleteDataSource", () => {
    it("should remove data source from array", () => {
      const dataSources = [
        createMockDataSource({ id: "ds-1" }),
        createMockDataSource({ id: "ds-2" }),
        createMockDataSource({ id: "ds-3" }),
      ];
      const result = DataSourceService.deleteDataSource("ds-2", dataSources);

      expect(result).toHaveLength(2);
      expect(result.find((ds) => ds.id === "ds-2")).toBeUndefined();
    });

    it("should return unchanged array if id not found", () => {
      const dataSources = [
        createMockDataSource({ id: "ds-1" }),
        createMockDataSource({ id: "ds-2" }),
      ];
      const result = DataSourceService.deleteDataSource("non-existent", dataSources);

      expect(result).toHaveLength(2);
    });
  });

  describe("getDataSourceData", () => {
    it("should return static data directly", async () => {
      const dataSource = createMockDataSource({
        type: "static",
        data: { items: ["a", "b", "c"] },
      });

      const result = await DataSourceService.getDataSourceData(dataSource);

      expect(result).toEqual({ items: ["a", "b", "c"] });
    });

    it("should throw error for unsupported data source type", async () => {
      const dataSource = createMockDataSource({
        type: "static",
        data: null,
      });
      // @ts-expect-error - intentionally invalid type
      dataSource.type = "unsupported";

      await expect(DataSourceService.getDataSourceData(dataSource)).rejects.toThrow(
        "不支持的数据源类型"
      );
    });
  });

  describe("fetchApiData", () => {
    beforeEach(() => {
      global.fetch = vi.fn();
    });

    it("should throw error when URL is missing", async () => {
      const dataSource = createMockDataSource({
        type: "api",
        config: {},
      });

      await expect(DataSourceService.getDataSourceData(dataSource)).rejects.toThrow(
        "API数据源缺少URL配置"
      );
    });

    it("should throw error on non-ok response", async () => {
      const dataSource = createMockDataSource({
        type: "api",
        config: { url: "https://api.example.com/data" },
      });

      vi.mocked(global.fetch).mockResolvedValue({
        ok: false,
        status: 404,
        statusText: "Not Found",
      } as Response);

      await expect(DataSourceService.getDataSourceData(dataSource)).rejects.toThrow(
        "HTTP 404: Not Found"
      );
    });
  });

  describe("fetchDatabaseData", () => {
    it("should throw error when connection string is missing", async () => {
      const dataSource = createMockDataSource({
        type: "database",
        config: { query: "SELECT * FROM users" },
      });

      await expect(DataSourceService.getDataSourceData(dataSource)).rejects.toThrow(
        "数据库数据源缺少连接字符串或查询语句"
      );
    });

    it("should throw error when query is missing", async () => {
      const dataSource = createMockDataSource({
        type: "database",
        config: { connectionString: "postgres://..." },
      });

      await expect(DataSourceService.getDataSourceData(dataSource)).rejects.toThrow(
        "数据库数据源缺少连接字符串或查询语句"
      );
    });
  });

  describe("fetchFileData", () => {
    beforeEach(() => {
      global.fetch = vi.fn();
    });

    it("should throw error when file path is missing", async () => {
      const dataSource = createMockDataSource({
        type: "file",
        config: {},
      });

      await expect(DataSourceService.getDataSourceData(dataSource)).rejects.toThrow(
        "文件数据源缺少文件路径"
      );
    });
  });

  describe("fetchWebSocketData", () => {
    it("should throw error when wsUrl is missing", async () => {
      const dataSource = createMockDataSource({
        type: "websocket",
        config: {},
      });

      await expect(DataSourceService.getDataSourceData(dataSource)).rejects.toThrow(
        "WebSocket数据源缺少URL配置"
      );
    });
  });

  describe("validateDataSource", () => {
    it("should validate static data source with data", () => {
      const dataSource = createMockDataSource({
        type: "static",
        data: { items: [] },
      });

      const result = DataSourceService.validateDataSource(dataSource);

      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it("should reject static data source without data", () => {
      const dataSource = createMockDataSource({
        type: "static",
        data: undefined,
      });

      const result = DataSourceService.validateDataSource(dataSource);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain("静态数据源必须提供数据");
    });

    it("should validate API data source with URL", () => {
      const dataSource = createMockDataSource({
        type: "api",
        config: { url: "https://api.example.com" },
      });

      const result = DataSourceService.validateDataSource(dataSource);

      expect(result.valid).toBe(true);
    });

    it("should reject API data source without URL", () => {
      const dataSource = createMockDataSource({
        type: "api",
        config: {},
      });

      const result = DataSourceService.validateDataSource(dataSource);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain("API数据源必须配置URL");
    });

    it("should validate database data source with connection and query", () => {
      const dataSource = createMockDataSource({
        type: "database",
        config: {
          connectionString: "postgres://localhost",
          query: "SELECT * FROM users",
        },
      });

      const result = DataSourceService.validateDataSource(dataSource);

      expect(result.valid).toBe(true);
    });

    it("should reject database data source without connection string", () => {
      const dataSource = createMockDataSource({
        type: "database",
        config: { query: "SELECT * FROM users" },
      });

      const result = DataSourceService.validateDataSource(dataSource);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain("数据库数据源必须配置连接字符串");
    });

    it("should reject database data source without query", () => {
      const dataSource = createMockDataSource({
        type: "database",
        config: { connectionString: "postgres://localhost" },
      });

      const result = DataSourceService.validateDataSource(dataSource);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain("数据库数据源必须配置查询语句");
    });

    it("should validate file data source with file path", () => {
      const dataSource = createMockDataSource({
        type: "file",
        config: { filePath: "/data.json" },
      });

      const result = DataSourceService.validateDataSource(dataSource);

      expect(result.valid).toBe(true);
    });

    it("should reject file data source without file path", () => {
      const dataSource = createMockDataSource({
        type: "file",
        config: {},
      });

      const result = DataSourceService.validateDataSource(dataSource);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain("文件数据源必须配置文件路径");
    });

    it("should validate websocket data source with wsUrl", () => {
      const dataSource = createMockDataSource({
        type: "websocket",
        config: { wsUrl: "wss://ws.example.com" },
      });

      const result = DataSourceService.validateDataSource(dataSource);

      expect(result.valid).toBe(true);
    });

    it("should reject websocket data source without wsUrl", () => {
      const dataSource = createMockDataSource({
        type: "websocket",
        config: {},
      });

      const result = DataSourceService.validateDataSource(dataSource);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain("WebSocket数据源必须配置URL");
    });

    it("should reject data source with empty name", () => {
      const dataSource = createMockDataSource({ name: "" });

      const result = DataSourceService.validateDataSource(dataSource);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain("数据源名称不能为空");
    });

    it("should reject data source with whitespace-only name", () => {
      const dataSource = createMockDataSource({ name: "   " });

      const result = DataSourceService.validateDataSource(dataSource);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain("数据源名称不能为空");
    });

    it("should collect multiple validation errors", () => {
      const dataSource = createMockDataSource({
        name: "",
        type: "api",
        config: {},
      });

      const result = DataSourceService.validateDataSource(dataSource);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
    });
  });

  describe("cache management", () => {
    it("should clear all cached entries", () => {
      DataSourceService.clearCache();
      expect(DataSourceService.getCacheStatus().size).toBe(0);
    });

    it("should clear specific cache entry", () => {
      DataSourceService.clearDataSourceCache("ds-1");
      expect(() => DataSourceService.clearDataSourceCache("non-existent")).not.toThrow();
    });

    it("should return empty status for empty cache", () => {
      DataSourceService.clearCache();
      const status = DataSourceService.getCacheStatus();

      expect(status.size).toBe(0);
      expect(status.entries).toEqual([]);
    });
  });
});
