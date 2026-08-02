import { describe, it, expect } from "vitest";
import type {
  Component,
  ComponentCategory,
  ComponentEventHandler,
  ComponentUpdateHandler,
  ComponentsUpdateHandler,
} from "@/component/types";
import type {
  DataSource,
  DataSourceConfig,
  DataMapping,
  DataField,
  TableColumn,
  TreeNode,
  PaginationConfig,
} from "@/data/types";
import type { CanvasState } from "@/canvas/types";
import type { ThemeConfig } from "@/theme/types";
import type { ChartConfig } from "@/chart/types";
import type { TemplateSelectHandler } from "@/template/types";
import { TemplateApplicationError } from "@/template/types";

describe("Domain Types", () => {
  describe("DataSource", () => {
    it("should create a valid DataSource with all required fields", () => {
      const dataSource: DataSource = {
        id: "ds-1",
        name: "API Data Source",
        type: "api",
        data: [{ id: 1, value: "test" }],
      };

      expect(dataSource.id).toBe("ds-1");
      expect(dataSource.name).toBe("API Data Source");
      expect(dataSource.type).toBe("api");
      expect(dataSource.data).toEqual([{ id: 1, value: "test" }]);
    });

    it("should accept all valid type values", () => {
      const types: DataSource["type"][] = [
        "static",
        "api",
        "database",
        "file",
        "websocket",
      ];

      types.forEach((type) => {
        const dataSource: DataSource = {
          id: "ds-test",
          name: "Test",
          type,
          data: null,
        };
        expect(dataSource.type).toBe(type);
      });
    });

    it("should accept all valid status values", () => {
      const statuses: DataSource["status"][] = ["active", "inactive", "error"];

      statuses.forEach((status) => {
        const dataSource: DataSource = {
          id: "ds-test",
          name: "Test",
          type: "api",
          data: null,
          status,
        };
        expect(dataSource.status).toBe(status);
      });
    });

    it("should allow optional fields to be undefined", () => {
      const dataSource: DataSource = {
        id: "ds-1",
        name: "Minimal DataSource",
        type: "static",
        data: {},
      };

      expect(dataSource.config).toBeUndefined();
      expect(dataSource.lastUpdated).toBeUndefined();
      expect(dataSource.status).toBeUndefined();
      expect(dataSource.error).toBeUndefined();
    });

    it("should accept complex nested data structures", () => {
      const dataSource: DataSource = {
        id: "ds-complex",
        name: "Complex Data",
        type: "database",
        data: {
          nested: {
            array: [1, 2, 3],
            object: { key: "value" },
          },
        },
        config: {
          url: "https://api.example.com",
          method: "POST",
          headers: { Authorization: "Bearer token" },
          params: { page: 1, limit: 10 },
          body: { query: "test" },
          timeout: 5000,
          retryCount: 3,
        },
        lastUpdated: new Date().toISOString(),
        status: "active",
      };

      expect(dataSource.data).toHaveProperty("nested");
      expect(dataSource.config?.url).toBe("https://api.example.com");
      expect(dataSource.config?.method).toBe("POST");
      expect(dataSource.config?.headers?.Authorization).toBe("Bearer token");
    });

    it("should accept error message when status is error", () => {
      const dataSource: DataSource = {
        id: "ds-error",
        name: "Error DataSource",
        type: "api",
        data: null,
        status: "error",
        error: "Connection timeout after 30s",
      };

      expect(dataSource.status).toBe("error");
      expect(dataSource.error).toBe("Connection timeout after 30s");
    });
  });

  describe("DataSourceConfig", () => {
    it("should create valid API config", () => {
      const config: DataSourceConfig = {
        url: "https://api.example.com/endpoint",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        params: { key: "value" },
        body: { data: "test" },
        timeout: 10000,
        retryCount: 5,
      };

      expect(config.url).toBe("https://api.example.com/endpoint");
      expect(config.method).toBe("POST");
      expect(config.headers?.["Content-Type"]).toBe("application/json");
      expect(config.timeout).toBe(10000);
      expect(config.retryCount).toBe(5);
    });

    it("should accept all HTTP methods", () => {
      const methods: DataSourceConfig["method"][] = ["GET", "POST", "PUT", "DELETE"];

      methods.forEach((method) => {
        const config: DataSourceConfig = { method };
        expect(config.method).toBe(method);
      });
    });

    it("should create valid database config", () => {
      const config: DataSourceConfig = {
        connectionString: "postgresql://localhost:5432/db",
        query: "SELECT * FROM users WHERE active = true",
        table: "users",
      };

      expect(config.connectionString).toBe("postgresql://localhost:5432/db");
      expect(config.query).toBe("SELECT * FROM users WHERE active = true");
      expect(config.table).toBe("users");
    });

    it("should create valid file config", () => {
      const config: DataSourceConfig = {
        fileType: "json",
        filePath: "/data/users.json",
      };

      expect(config.fileType).toBe("json");
      expect(config.filePath).toBe("/data/users.json");
    });

    it("should accept all file types", () => {
      const fileTypes: DataSourceConfig["fileType"][] = ["json", "csv", "xml"];

      fileTypes.forEach((fileType) => {
        const config: DataSourceConfig = { fileType };
        expect(config.fileType).toBe(fileType);
      });
    });

    it("should create valid WebSocket config", () => {
      const config: DataSourceConfig = {
        wsUrl: "wss://stream.example.com",
        protocols: ["protocol1", "protocol2"],
      };

      expect(config.wsUrl).toBe("wss://stream.example.com");
      expect(config.protocols).toEqual(["protocol1", "protocol2"]);
    });

    it("should create config with cache settings", () => {
      const config: DataSourceConfig = {
        refreshInterval: 60,
        cacheEnabled: true,
        cacheTTL: 300,
      };

      expect(config.refreshInterval).toBe(60);
      expect(config.cacheEnabled).toBe(true);
      expect(config.cacheTTL).toBe(300);
    });

    it("should allow empty config", () => {
      const config: DataSourceConfig = {};
      expect(config.url).toBeUndefined();
      expect(config.method).toBeUndefined();
    });
  });

  describe("DataMapping", () => {
    it("should create a valid DataMapping", () => {
      const mapping: DataMapping = {
        field: "userName",
        sourcePath: "data.user.name",
        targetPath: "form.username",
      };

      expect(mapping.field).toBe("userName");
      expect(mapping.sourcePath).toBe("data.user.name");
      expect(mapping.targetPath).toBe("form.username");
    });

    it("should accept all transform types", () => {
      const transformTypes: DataMapping["transform"][] = [
        "string",
        "number",
        "boolean",
        "date",
        "json",
      ];

      transformTypes.forEach((transform) => {
        const mapping: DataMapping = {
          field: "test",
          sourcePath: "a",
          targetPath: "b",
          transform,
        };
        expect(mapping.transform).toBe(transform);
      });
    });

    it("should support defaultValue", () => {
      const mapping: DataMapping = {
        field: "status",
        sourcePath: "data.status",
        targetPath: "form.status",
        defaultValue: "pending",
      };

      expect(mapping.defaultValue).toBe("pending");
    });

    it("should allow different defaultValue types", () => {
      const stringMapping: DataMapping = {
        field: "name",
        sourcePath: "a",
        targetPath: "b",
        defaultValue: "default",
      };
      expect(stringMapping.defaultValue).toBe("default");

      const numberMapping: DataMapping = {
        field: "count",
        sourcePath: "a",
        targetPath: "b",
        defaultValue: 0,
      };
      expect(numberMapping.defaultValue).toBe(0);

      const booleanMapping: DataMapping = {
        field: "active",
        sourcePath: "a",
        targetPath: "b",
        defaultValue: false,
      };
      expect(booleanMapping.defaultValue).toBe(false);

      const nullMapping: DataMapping = {
        field: "nullable",
        sourcePath: "a",
        targetPath: "b",
        defaultValue: null,
      };
      expect(nullMapping.defaultValue).toBeNull();
    });
  });

  describe("Component", () => {
    it("should create a valid Component with required fields", () => {
      const component: Component = {
        id: "comp-1",
        type: "button",
        name: "Submit Button",
      };

      expect(component.id).toBe("comp-1");
      expect(component.type).toBe("button");
      expect(component.name).toBe("Submit Button");
    });

    it("should accept position coordinates", () => {
      const component: Component = {
        id: "comp-1",
        type: "text",
        name: "Title",
        position: { x: 100, y: 200 },
      };

      expect(component.position?.x).toBe(100);
      expect(component.position?.y).toBe(200);
    });

    it("should accept properties record", () => {
      const component: Component = {
        id: "comp-1",
        type: "input",
        name: "Email Input",
        properties: {
          placeholder: "Enter email",
          type: "email",
          required: true,
        },
      };

      expect(component.properties?.placeholder).toBe("Enter email");
      expect(component.properties?.type).toBe("email");
      expect(component.properties?.required).toBe(true);
    });

    it("should accept children array with components and strings", () => {
      const childComponent: Component = {
        id: "child-1",
        type: "text",
        name: "Child Text",
      };

      const parent: Component = {
        id: "parent-1",
        type: "container",
        name: "Parent Container",
        children: [childComponent, "Plain text string"],
      };

      expect(parent.children).toHaveLength(2);
      expect(parent.children![0]).toEqual(childComponent);
      expect(parent.children![1]).toBe("Plain text string");
    });

    it("should handle parentId and null values", () => {
      const rootComponent: Component = {
        id: "root",
        type: "container",
        name: "Root",
        parentId: null,
      };

      const childComponent: Component = {
        id: "child",
        type: "button",
        name: "Child",
        parentId: "root",
      };

      expect(rootComponent.parentId).toBeNull();
      expect(childComponent.parentId).toBe("root");
    });

    it("should handle dataSource references", () => {
      const withDataSource: Component = {
        id: "comp-1",
        type: "data-table",
        name: "User Table",
        dataSource: "ds-users",
      };

      const withoutDataSource: Component = {
        id: "comp-2",
        type: "button",
        name: "Button",
        dataSource: null,
      };

      expect(withDataSource.dataSource).toBe("ds-users");
      expect(withoutDataSource.dataSource).toBeNull();
    });

    it("should accept dataMapping array", () => {
      const component: Component = {
        id: "comp-1",
        type: "form",
        name: "User Form",
        dataMapping: [
          { field: "email", sourcePath: "user.email", targetPath: "form.email" },
          { field: "name", sourcePath: "user.name", targetPath: "form.name" },
        ],
      };

      expect(component.dataMapping).toHaveLength(2);
      expect(component.dataMapping![0].field).toBe("email");
      expect(component.dataMapping![1].field).toBe("name");
    });

    it("should allow nested component hierarchy", () => {
      const grandchild: Component = {
        id: "grandchild",
        type: "text",
        name: "Grandchild",
        parentId: "child",
      };

      const child: Component = {
        id: "child",
        type: "card",
        name: "Child Card",
        parentId: "parent",
        children: [grandchild],
      };

      const parent: Component = {
        id: "parent",
        type: "container",
        name: "Parent Container",
        children: [child],
      };

      expect(parent.children![0].id).toBe("child");
      expect((parent.children![0] as Component).children![0].id).toBe("grandchild");
    });
  });

  describe("ComponentCategory", () => {
    it("should create a valid ComponentCategory", () => {
      const category: ComponentCategory = {
        id: "cat-1",
        name: "Basic Components",
        icon: null as any,
        components: [
          { id: "btn-1", name: "Button", type: "button" },
          { id: "inp-1", name: "Input", type: "input" },
        ],
      };

      expect(category.id).toBe("cat-1");
      expect(category.name).toBe("Basic Components");
      expect(category.components).toHaveLength(2);
    });

    it("should mark components as containers", () => {
      const category: ComponentCategory = {
        id: "cat-layout",
        name: "Layout",
        icon: null as any,
        components: [
          { id: "grid", name: "Grid", type: "grid-layout", isContainer: true },
          { id: "btn", name: "Button", type: "button", isContainer: false },
        ],
      };

      expect(category.components[0].isContainer).toBe(true);
      expect(category.components[1].isContainer).toBe(false);
    });
  });

  describe("CanvasState", () => {
    it("should create valid CanvasState", () => {
      const state: CanvasState = {
        components: [],
        selectedId: null,
      };

      expect(state.components).toEqual([]);
      expect(state.selectedId).toBeNull();
    });

    it("should track selected component", () => {
      const component: Component = {
        id: "selected",
        type: "button",
        name: "Selected Button",
      };

      const state: CanvasState = {
        components: [component],
        selectedId: "selected",
      };

      expect(state.selectedId).toBe("selected");
      expect(state.components[0].id).toBe("selected");
    });
  });

  describe("ThemeConfig", () => {
    it("should create a valid ThemeConfig", () => {
      const theme: ThemeConfig = {
        primaryColor: "#1890ff",
        secondaryColor: "#52c41a",
        backgroundColor: "#ffffff",
        textColor: "#000000",
        fontFamily: "Inter, sans-serif",
        borderRadius: "8px",
        spacing: "8px",
      };

      expect(theme.primaryColor).toBe("#1890ff");
      expect(theme.fontFamily).toBe("Inter, sans-serif");
      expect(theme.borderRadius).toBe("8px");
    });

    it("should accept different color formats", () => {
      const theme: ThemeConfig = {
        primaryColor: "rgb(24, 144, 255)",
        secondaryColor: "hsl(210, 100%, 50%)",
        backgroundColor: "#fff",
        textColor: "black",
        fontFamily: "Arial",
        borderRadius: "4px",
        spacing: "4px",
      };

      expect(theme.primaryColor).toBe("rgb(24, 144, 255)");
      expect(theme.secondaryColor).toBe("hsl(210, 100%, 50%)");
    });
  });

  describe("DataField", () => {
    it("should create valid DataField", () => {
      const field: DataField = {
        name: "userEmail",
        type: "string",
        path: "user.profile.email",
      };

      expect(field.name).toBe("userEmail");
      expect(field.type).toBe("string");
      expect(field.path).toBe("user.profile.email");
    });

    it("should accept all field types", () => {
      const types: DataField["type"][] = [
        "string",
        "number",
        "boolean",
        "date",
        "object",
        "array",
      ];

      types.forEach((type) => {
        const field: DataField = { name: "test", type, path: "a.b" };
        expect(field.type).toBe(type);
      });
    });
  });

  describe("ChartConfig", () => {
    it("should create valid ChartConfig", () => {
      const config: ChartConfig = {
        type: "bar",
        xField: "category",
        yField: "value",
      };

      expect(config.type).toBe("bar");
      expect(config.xField).toBe("category");
      expect(config.yField).toBe("value");
    });

    it("should accept all chart types", () => {
      const chartTypes: ChartConfig["type"][] = [
        "bar",
        "line",
        "pie",
        "area",
        "scatter",
        "radar",
        "donut",
      ];

      chartTypes.forEach((type) => {
        const config: ChartConfig = { type, xField: "x", yField: "y" };
        expect(config.type).toBe(type);
      });
    });

    it("should support optional fields", () => {
      const config: ChartConfig = {
        type: "line",
        xField: "date",
        yField: "revenue",
        seriesField: "region",
        colorField: "category",
        annotations: [
          { type: "line", start: "2023-01", end: "2023-12" },
        ],
      };

      expect(config.seriesField).toBe("region");
      expect(config.colorField).toBe("category");
      expect(config.annotations).toHaveLength(1);
    });
  });

  describe("TableColumn", () => {
    it("should create a valid TableColumn", () => {
      const column: TableColumn = {
        title: "Name",
        dataIndex: "name",
        key: "name",
      };

      expect(column.title).toBe("Name");
      expect(column.dataIndex).toBe("name");
      expect(column.key).toBe("name");
    });

    it("should support column customization", () => {
      const column: TableColumn = {
        title: "Age",
        dataIndex: "age",
        key: "age",
        width: 100,
        sortable: true,
        filterable: true,
        render: "number",
      };

      expect(column.width).toBe(100);
      expect(column.sortable).toBe(true);
      expect(column.filterable).toBe(true);
      expect(column.render).toBe("number");
    });
  });

  describe("TreeNode", () => {
    it("should create a valid TreeNode", () => {
      const node: TreeNode = {
        id: "node-1",
        title: "Root Node",
      };

      expect(node.id).toBe("node-1");
      expect(node.title).toBe("Root Node");
    });

    it("should support nested children", () => {
      const tree: TreeNode = {
        id: "root",
        title: "Root",
        children: [
          { id: "child-1", title: "Child 1" },
          { id: "child-2", title: "Child 2", children: [{ id: "grandchild", title: "Grandchild" }] },
        ],
      };

      expect(tree.children).toHaveLength(2);
      expect(tree.children![1].children![0].id).toBe("grandchild");
    });

    it("should support icon and state flags", () => {
      const node: TreeNode = {
        id: "node-1",
        title: "Styled Node",
        icon: "folder",
        expanded: true,
        selected: true,
        disabled: false,
      };

      expect(node.icon).toBe("folder");
      expect(node.expanded).toBe(true);
      expect(node.selected).toBe(true);
      expect(node.disabled).toBe(false);
    });
  });

  describe("PaginationConfig", () => {
    it("should create valid PaginationConfig", () => {
      const pagination: PaginationConfig = {
        currentPage: 1,
        totalPages: 10,
        pageSize: 20,
        total: 200,
      };

      expect(pagination.currentPage).toBe(1);
      expect(pagination.totalPages).toBe(10);
      expect(pagination.pageSize).toBe(20);
      expect(pagination.total).toBe(200);
    });

    it("should support optional controls", () => {
      const pagination: PaginationConfig = {
        currentPage: 3,
        totalPages: 5,
        pageSize: 10,
        total: 50,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: true,
      };

      expect(pagination.showSizeChanger).toBe(true);
      expect(pagination.showQuickJumper).toBe(true);
      expect(pagination.showTotal).toBe(true);
    });

    it("should handle edge cases", () => {
      const firstPage: PaginationConfig = {
        currentPage: 1,
        totalPages: 1,
        pageSize: 10,
        total: 5,
      };

      const lastPage: PaginationConfig = {
        currentPage: 10,
        totalPages: 10,
        pageSize: 10,
        total: 100,
      };

      expect(firstPage.currentPage).toBeLessThanOrEqual(firstPage.totalPages);
      expect(lastPage.currentPage).toBeLessThanOrEqual(lastPage.totalPages);
    });
  });

  describe("Event Handler Types", () => {
    it("should define ComponentEventHandler type", () => {
      const handler: ComponentEventHandler = (component) => {
        return component?.id || null;
      };

      const result = handler({ id: "test", type: "button", name: "Test" });
      expect(result).toBe("test");
    });

    it("should define ComponentUpdateHandler type", () => {
      const handler: ComponentUpdateHandler = (id, properties) => {
        return { id, ...properties };
      };

      const result = handler("comp-1", { visible: true });
      expect(result).toEqual({ id: "comp-1", visible: true });
    });

    it("should define ComponentsUpdateHandler type", () => {
      const handler: ComponentsUpdateHandler = (components) => {
        return components.length;
      };

      const result = handler([{ id: "1", type: "a", name: "A" }]);
      expect(result).toBe(1);
    });

    it("should define TemplateSelectHandler type", () => {
      const handler: TemplateSelectHandler = (templateComponents) => {
        return templateComponents.map((c) => c.type);
      };

      const result = handler([
        { id: "1", type: "button", name: "Btn" },
        { id: "2", type: "input", name: "Inp" },
      ]);
      expect(result).toEqual(["button", "input"]);
    });
  });

  describe("TemplateApplicationError", () => {
    it("should create error with template components", () => {
      const components: Component[] = [
        { id: "1", type: "button", name: "Btn" },
        { id: "2", type: "input", name: "Inp" },
      ];

      const error = new TemplateApplicationError(
        "Failed to apply template",
        components
      );

      expect(error.message).toBe("Failed to apply template");
      expect(error.templateComponents).toEqual(components);
      expect(error.name).toBe("TemplateApplicationError");
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(TemplateApplicationError);
    });

    it("should preserve error stack trace", () => {
      const error = new TemplateApplicationError(
        "Template error",
        []
      );

      expect(error.stack).toBeDefined();
    });

    it("should allow error to be thrown and caught", () => {
      const components: Component[] = [{ id: "1", type: "a", name: "A" }];

      expect(() => {
        throw new TemplateApplicationError(
          "Test error",
          components
        );
      }).toThrow("Test error");
    });
  });
});
