import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  ComponentFactoryService,
} from "../component-factory.service";
import type { ThemeConfig, Component } from "../../entities/types";

describe("ComponentFactoryService", () => {
  const defaultPosition = { x: 0, y: 0 };
  const sampleTheme: ThemeConfig = {
    primaryColor: "#1890ff",
    secondaryColor: "#52c41a",
    backgroundColor: "#ffffff",
    textColor: "#333333",
    fontFamily: "Inter, sans-serif",
    borderRadius: "8px",
    spacing: "8px",
  };

  describe("isContainer", () => {
    const containerTypes = [
      "container",
      "grid-layout",
      "flex-layout",
      "split-layout",
      "tab-layout",
      "card-group",
      "responsive-container",
      "row",
      "column",
      "card",
      "collapse",
      "tabs",
      "modal",
      "drawer",
      "popover",
      "tooltip",
    ] as const;

    it("should return true for all container types", () => {
      containerTypes.forEach((type) => {
        expect(ComponentFactoryService.isContainer(type)).toBe(true);
      });
    });

    it("should return false for non-container component types", () => {
      const nonContainerTypes = [
        "text",
        "button",
        "image",
        "divider",
        "input",
        "textarea",
        "select",
        "checkbox",
        "radio",
        "data-table",
        "data-list",
        "data-card",
        "pagination",
        "tree",
        "bar-chart",
        "line-chart",
        "pie-chart",
        "area-chart",
        "scatter-chart",
        "radar-chart",
        "gauge",
        "radial-bar-chart",
        "treemap-chart",
        "carousel",
        "steps",
        "progress",
        "avatar",
        "badge",
        "tag",
        "timeline",
        "rating",
      ];

      nonContainerTypes.forEach((type) => {
        expect(ComponentFactoryService.isContainer(type)).toBe(false);
      });
    });

    it("should return false for unknown types", () => {
      expect(ComponentFactoryService.isContainer("unknown-component")).toBe(false);
      expect(ComponentFactoryService.isContainer("")).toBe(false);
      expect(ComponentFactoryService.isContainer("CUSTOM_TYPE")).toBe(false);
    });

    it("should be case sensitive for exact matches only", () => {
      // The implementation uses exact string matching
      expect(ComponentFactoryService.isContainer("container")).toBe(true);
      expect(ComponentFactoryService.isContainer("grid-layout")).toBe(true);
    });
  });

  describe("getDefaultProperties", () => {
    describe("text component", () => {
      it("should return correct default properties for text without theme", () => {
        const props = ComponentFactoryService.getDefaultProperties("text");

        expect(props.visible).toBe(true);
        expect(props.content).toBe("示例文本");
        expect(props.fontSize).toBe(16);
        expect(props.fontWeight).toBe("normal");
        expect(props.color).toBe("#000000");
        expect(props.alignment).toBe("left");
        expect(props.lineHeight).toBe(1.5);
        expect(props.letterSpacing).toBe("normal");
        expect(props.textTransform).toBe("none");
        expect(props.textDecoration).toBe("none");
      });

      it("should use theme text color when provided", () => {
        const props = ComponentFactoryService.getDefaultProperties(
          "text",
          sampleTheme
        );

        expect(props.color).toBe(sampleTheme.textColor);
      });
    });

    describe("button component", () => {
      it("should return correct default properties for button", () => {
        const props = ComponentFactoryService.getDefaultProperties("button");

        expect(props.visible).toBe(true);
        expect(props.text).toBe("按钮");
        expect(props.variant).toBe("outline");
        expect(props.size).toBe("default");
        expect(props.disabled).toBe(false);
        expect(props.icon).toBe("");
        expect(props.iconPosition).toBe("left");
        expect(props.fullWidth).toBe(false);
        expect(props.onClick).toBe("none");
      });
    });

    describe("image component", () => {
      it("should return correct default properties for image", () => {
        const props = ComponentFactoryService.getDefaultProperties("image");

        expect(props.visible).toBe(true);
        expect(props.src).toContain("/placeholder.svg");
        expect(props.alt).toBe("示例图片");
        expect(props.width).toBe(300);
        expect(props.height).toBe(200);
        expect(props.objectFit).toBe("cover");
        expect(props.rounded).toBe(false);
        expect(props.shadow).toBe(false);
        expect(props.border).toBe(false);
        expect(props.caption).toBe("");
      });
    });

    describe("divider component", () => {
      it("should return correct default properties for divider", () => {
        const props = ComponentFactoryService.getDefaultProperties("divider");

        expect(props.visible).toBe(true);
        expect(props.orientation).toBe("horizontal");
        expect(props.thickness).toBe(1);
        expect(props.color).toBe("#e2e8f0");
        expect(props.margin).toBe("1rem 0");
        expect(props.style).toBe("solid");
      });
    });

    describe("input component", () => {
      it("should return correct default properties for input", () => {
        const props = ComponentFactoryService.getDefaultProperties("input");

        expect(props.visible).toBe(true);
        expect(props.placeholder).toBe("请输入...");
        expect(props.disabled).toBe(false);
        expect(props.required).toBe(false);
        expect(props.type).toBe("text");
        expect(props.label).toBe("输入框");
        expect(props.helperText).toBe("");
        expect(props.defaultValue).toBe("");
      });
    });

    describe("textarea component", () => {
      it("should return correct default properties for textarea", () => {
        const props = ComponentFactoryService.getDefaultProperties("textarea");

        expect(props.visible).toBe(true);
        expect(props.placeholder).toBe("请输入多行文本...");
        expect(props.disabled).toBe(false);
        expect(props.required).toBe(false);
        expect(props.rows).toBe(4);
        expect(props.label).toBe("文本域");
        expect(props.helperText).toBe("");
        expect(props.defaultValue).toBe("");
      });
    });

    describe("select component", () => {
      it("should return correct default properties for select", () => {
        const props = ComponentFactoryService.getDefaultProperties("select");

        expect(props.visible).toBe(true);
        expect(props.placeholder).toBe("请选择...");
        expect(props.disabled).toBe(false);
        expect(props.required).toBe(false);
        expect(props.options).toEqual(["选项1", "选项2", "选项3"]);
        expect(props.label).toBe("下拉选择");
        expect(props.helperText).toBe("");
        expect(props.defaultValue).toBe("");
      });
    });

    describe("checkbox component", () => {
      it("should return correct default properties for checkbox", () => {
        const props = ComponentFactoryService.getDefaultProperties("checkbox");

        expect(props.visible).toBe(true);
        expect(props.label).toBe("复选框");
        expect(props.checked).toBe(false);
        expect(props.disabled).toBe(false);
        expect(props.helperText).toBe("");
      });
    });

    describe("radio component", () => {
      it("should return correct default properties for radio", () => {
        const props = ComponentFactoryService.getDefaultProperties("radio");

        expect(props.visible).toBe(true);
        expect(props.options).toEqual(["选项1", "选项2", "选项3"]);
        expect(props.disabled).toBe(false);
        expect(props.label).toBe("单选框组");
        expect(props.helperText).toBe("");
        expect(props.defaultValue).toBe("");
      });
    });

    describe("card component", () => {
      it("should return correct default properties for card", () => {
        const props = ComponentFactoryService.getDefaultProperties("card");

        expect(props.visible).toBe(true);
        expect(props.title).toBe("卡片标题");
        expect(props.shadow).toBe(true);
        expect(props.padding).toBe("1rem");
        expect(props.border).toBe(true);
        expect(props.rounded).toBe(true);
      });
    });

    describe("data-table component", () => {
      it("should return correct default properties for data-table", () => {
        const props = ComponentFactoryService.getDefaultProperties("data-table");

        expect(props.visible).toBe(true);
        expect(props.title).toBe("数据表格");
        expect(props.dataSource).toBeNull();
        expect(props.columns).toHaveLength(3);
        expect(props.columns[0].title).toBe("列1");
        expect(props.columns[0].sortable).toBe(true);
        expect(props.columns[0].filterable).toBe(true);
        expect(props.pagination).toBe(true);
        expect(props.pageSize).toBe(10);
        expect(props.bordered).toBe(true);
        expect(props.striped).toBe(true);
        expect(props.size).toBe("default");
      });
    });

    describe("data-list component", () => {
      it("should return correct default properties for data-list", () => {
        const props = ComponentFactoryService.getDefaultProperties("data-list");

        expect(props.visible).toBe(true);
        expect(props.title).toBe("数据列表");
        expect(props.dataSource).toBeNull();
        expect(props.listType).toBe("default");
        expect(props.itemLayout).toBe("horizontal");
        expect(props.showActions).toBe(true);
        expect(props.showExtra).toBe(true);
        expect(props.pagination).toBe(true);
        expect(props.pageSize).toBe(5);
      });
    });

    describe("data-card component", () => {
      it("should return correct default properties for data-card", () => {
        const props = ComponentFactoryService.getDefaultProperties("data-card");

        expect(props.visible).toBe(true);
        expect(props.title).toBe("数据卡片");
        expect(props.dataSource).toBeNull();
        expect(props.cardType).toBe("default");
        expect(props.showIcon).toBe(true);
        expect(props.iconPosition).toBe("left");
        expect(props.showTrend).toBe(true);
        expect(props.trendPosition).toBe("bottom");
      });
    });

    describe("pagination component", () => {
      it("should return correct default properties for pagination", () => {
        const props = ComponentFactoryService.getDefaultProperties("pagination");

        expect(props.visible).toBe(true);
        expect(props.defaultCurrent).toBe(1);
        expect(props.total).toBe(50);
        expect(props.pageSize).toBe(10);
        expect(props.showSizeChanger).toBe(true);
        expect(props.showQuickJumper).toBe(true);
        expect(props.size).toBe("default");
      });
    });

    describe("tree component", () => {
      it("should return correct default properties for tree", () => {
        const props = ComponentFactoryService.getDefaultProperties("tree");

        expect(props.visible).toBe(true);
        expect(props.dataSource).toBeNull();
        expect(props.defaultExpandAll).toBe(false);
        expect(props.showLine).toBe(true);
        expect(props.showIcon).toBe(true);
        expect(props.selectable).toBe(true);
        expect(props.checkable).toBe(false);
      });
    });

    describe("chart components", () => {
      it("should return correct default properties for bar-chart", () => {
        const props = ComponentFactoryService.getDefaultProperties("bar-chart");

        expect(props.visible).toBe(true);
        expect(props.title).toBe("柱状图");
        expect(props.dataSource).toBeNull();
        expect(props.xField).toBe("name");
        expect(props.yField).toBe("sales");
        expect(props.seriesField).toBe("category");
        expect(props.isGroup).toBe(true);
        expect(props.isStack).toBe(false);
        expect(props.legend).toBe(true);
        expect(props.width).toBe(500);
        expect(props.height).toBe(300);
      });

      it("should return correct default properties for line-chart", () => {
        const props = ComponentFactoryService.getDefaultProperties("line-chart");

        expect(props.visible).toBe(true);
        expect(props.title).toBe("折线图");
        expect(props.xField).toBe("name");
        expect(props.yField).toBe("y");
        expect(props.smooth).toBe(true);
        expect(props.legend).toBe(true);
      });

      it("should return correct default properties for pie-chart", () => {
        const props = ComponentFactoryService.getDefaultProperties("pie-chart");

        expect(props.visible).toBe(true);
        expect(props.title).toBe("饼图");
        expect(props.colorField).toBe("category");
        expect(props.valueField).toBe("value");
        expect(props.legend).toBe(true);
      });

      it("should return correct default properties for area-chart", () => {
        const props = ComponentFactoryService.getDefaultProperties("area-chart");

        expect(props.visible).toBe(true);
        expect(props.title).toBe("面积图");
        expect(props.smooth).toBe(true);
        expect(props.legend).toBe(true);
      });

      it("should return correct default properties for scatter-chart", () => {
        const props = ComponentFactoryService.getDefaultProperties("scatter-chart");

        expect(props.visible).toBe(true);
        expect(props.title).toBe("散点图");
        expect(props.xField).toBe("x");
        expect(props.yField).toBe("y");
        expect(props.legend).toBe(true);
      });

      it("should return correct default properties for radar-chart", () => {
        const props = ComponentFactoryService.getDefaultProperties("radar-chart");

        expect(props.visible).toBe(true);
        expect(props.title).toBe("雷达图");
        expect(props.angleField).toBe("item");
        expect(props.radiusField).toBe("value");
        expect(props.legend).toBe(true);
      });

      it("should return correct default properties for gauge", () => {
        const props = ComponentFactoryService.getDefaultProperties("gauge");

        expect(props.visible).toBe(true);
        expect(props.title).toBe("仪表盘");
        expect(props.percent).toBe(0.88);
        expect(props.width).toBe(300);
        expect(props.height).toBe(300);
      });

      it("should return correct default properties for radial-bar-chart", () => {
        const props = ComponentFactoryService.getDefaultProperties("radial-bar-chart");

        expect(props.visible).toBe(true);
        expect(props.title).toBe("环形图");
        expect(props.width).toBe(500);
        expect(props.height).toBe(300);
      });

      it("should return correct default properties for treemap-chart", () => {
        const props = ComponentFactoryService.getDefaultProperties("treemap-chart");

        expect(props.visible).toBe(true);
        expect(props.title).toBe("树状图");
        expect(props.width).toBe(500);
        expect(props.height).toBe(300);
      });
    });

    describe("layout components", () => {
      it("should return correct default properties for grid-layout", () => {
        const props = ComponentFactoryService.getDefaultProperties("grid-layout");

        expect(props.visible).toBe(true);
        expect(props.columns).toBe(3);
        expect(props.gap).toBe(2);
        expect(props.autoRows).toBe(false);
        expect(props.rowHeight).toBe("auto");
        expect(props.width).toBe("100%");
        expect(props.height).toBe("auto");
      });

      it("should return correct default properties for flex-layout", () => {
        const props = ComponentFactoryService.getDefaultProperties("flex-layout");

        expect(props.visible).toBe(true);
        expect(props.direction).toBe("row");
        expect(props.wrap).toBe(true);
        expect(props.justifyContent).toBe("start");
        expect(props.alignItems).toBe("center");
        expect(props.gap).toBe(2);
      });

      it("should return correct default properties for split-layout", () => {
        const props = ComponentFactoryService.getDefaultProperties("split-layout");

        expect(props.visible).toBe(true);
        expect(props.direction).toBe("horizontal");
        expect(props.splitRatio).toBe(30);
        expect(props.minSize).toBe(100);
        expect(props.width).toBe("100%");
        expect(props.height).toBe("300px");
      });

      it("should return correct default properties for tab-layout", () => {
        const props = ComponentFactoryService.getDefaultProperties("tab-layout");

        expect(props.visible).toBe(true);
        expect(props.tabs).toHaveLength(2);
        expect(props.defaultTab).toBe("tab-1");
        expect(props.width).toBe("100%");
      });

      it("should return correct default properties for card-group", () => {
        const props = ComponentFactoryService.getDefaultProperties("card-group");

        expect(props.visible).toBe(true);
        expect(props.columns).toBe(3);
        expect(props.gap).toBe(2);
        expect(props.width).toBe("100%");
      });

      it("should return correct default properties for responsive-container", () => {
        const props = ComponentFactoryService.getDefaultProperties(
          "responsive-container"
        );

        expect(props.visible).toBe(true);
        expect(props.breakpoints).toEqual({
          sm: 640,
          md: 768,
          lg: 1024,
          xl: 1280,
        });
      });

      it("should return correct default properties for collapse", () => {
        const props = ComponentFactoryService.getDefaultProperties("collapse");

        expect(props.visible).toBe(true);
        expect(props.title).toBe("折叠面板");
        expect(props.defaultOpen).toBe(false);
      });

      it("should return correct default properties for tabs", () => {
        const props = ComponentFactoryService.getDefaultProperties("tabs");

        expect(props.visible).toBe(true);
        expect(props.tabs).toHaveLength(2);
        expect(props.defaultTab).toBe("tab-1");
      });

      it("should return correct default properties for modal", () => {
        const props = ComponentFactoryService.getDefaultProperties("modal");

        expect(props.visible).toBe(true);
        expect(props.title).toBe("模态框标题");
        expect(props.description).toBe("模态框描述");
        expect(props.triggerText).toBe("打开模态框");
      });

      it("should return correct default properties for drawer", () => {
        const props = ComponentFactoryService.getDefaultProperties("drawer");

        expect(props.visible).toBe(true);
        expect(props.title).toBe("抽屉标题");
        expect(props.description).toBe("抽屉描述");
        expect(props.triggerText).toBe("打开抽屉");
      });

      it("should return correct default properties for popover", () => {
        const props = ComponentFactoryService.getDefaultProperties("popover");

        expect(props.visible).toBe(true);
        expect(props.title).toBe("弹出框标题");
        expect(props.description).toBe("弹出框描述");
        expect(props.triggerText).toBe("打开弹出框");
      });

      it("should return correct default properties for tooltip", () => {
        const props = ComponentFactoryService.getDefaultProperties("tooltip");

        expect(props.visible).toBe(true);
        expect(props.content).toBe("这是一个提示框");
        expect(props.triggerText).toBe("悬停查看提示");
      });
    });

    describe("other components", () => {
      it("should return correct default properties for carousel", () => {
        const props = ComponentFactoryService.getDefaultProperties("carousel");

        expect(props.visible).toBe(true);
        expect(props.loop).toBe(false);
        expect(props.showArrows).toBe(true);
        expect(props.autoplay).toBe(false);
        expect(props.autoplayDelay).toBe(3000);
      });

      it("should return correct default properties for steps", () => {
        const props = ComponentFactoryService.getDefaultProperties("steps");

        expect(props.visible).toBe(true);
        expect(props.currentStep).toBe(1);
        expect(props.steps).toHaveLength(3);
        expect(props.direction).toBe("horizontal");
      });

      it("should return correct default properties for progress", () => {
        const props = ComponentFactoryService.getDefaultProperties("progress");

        expect(props.visible).toBe(true);
        expect(props.value).toBe(50);
        expect(props.max).toBe(100);
        expect(props.label).toBe("进度");
        expect(props.showValue).toBe(true);
        expect(props.size).toBe("default");
      });

      it("should return correct default properties for avatar", () => {
        const props = ComponentFactoryService.getDefaultProperties("avatar");

        expect(props.visible).toBe(true);
        expect(props.src).toBe("");
        expect(props.alt).toBe("头像");
        expect(props.fallback).toBe("U");
        expect(props.size).toBe("default");
        expect(props.showInfo).toBe(false);
        expect(props.name).toBe("用户名");
      });

      it("should return correct default properties for badge", () => {
        const props = ComponentFactoryService.getDefaultProperties("badge");

        expect(props.visible).toBe(true);
        expect(props.text).toBe("徽章");
        expect(props.variant).toBe("default");
        expect(props.showClose).toBe(false);
      });

      it("should return correct default properties for tag", () => {
        const props = ComponentFactoryService.getDefaultProperties("tag");

        expect(props.visible).toBe(true);
        expect(props.tags).toEqual(["标签1", "标签2", "标签3"]);
        expect(props.variant).toBe("default");
        expect(props.closable).toBe(false);
      });

      it("should return correct default properties for timeline", () => {
        const props = ComponentFactoryService.getDefaultProperties("timeline");

        expect(props.visible).toBe(true);
        expect(props.items).toHaveLength(3);
        expect(props.direction).toBe("vertical");
      });

      it("should return correct default properties for rating", () => {
        const props = ComponentFactoryService.getDefaultProperties("rating");

        expect(props.visible).toBe(true);
        expect(props.rating).toBe(0);
        expect(props.maxRating).toBe(5);
        expect(props.size).toBe("default");
        expect(props.readonly).toBe(false);
        expect(props.showValue).toBe(false);
        expect(props.allowHalf).toBe(false);
      });
    });

    describe("default case", () => {
      it("should return base properties for unknown component types", () => {
        const props = ComponentFactoryService.getDefaultProperties(
          "unknown-component"
        );

        expect(props).toEqual({ visible: true });
      });

      it("should return base properties for empty string type", () => {
        const props = ComponentFactoryService.getDefaultProperties("");

        expect(props).toEqual({ visible: true });
      });

      it("should not affect base properties when extending for unknown types", () => {
        const props = ComponentFactoryService.getDefaultProperties(
          "CUSTOM_TYPE"
        );

        expect(props.visible).toBe(true);
        expect(props.content).toBeUndefined();
        expect(props.text).toBeUndefined();
      });
    });

    describe("all component types coverage", () => {
      const allComponentTypes = [
        "text",
        "button",
        "image",
        "divider",
        "input",
        "textarea",
        "select",
        "checkbox",
        "radio",
        "card",
        "data-table",
        "data-list",
        "data-card",
        "pagination",
        "tree",
        "bar-chart",
        "line-chart",
        "pie-chart",
        "area-chart",
        "scatter-chart",
        "radar-chart",
        "gauge",
        "radial-bar-chart",
        "treemap-chart",
        "grid-layout",
        "flex-layout",
        "split-layout",
        "tab-layout",
        "card-group",
        "responsive-container",
        "collapse",
        "tabs",
        "modal",
        "drawer",
        "popover",
        "tooltip",
        "carousel",
        "steps",
        "progress",
        "avatar",
        "badge",
        "tag",
        "timeline",
        "rating",
      ];

      it("should return properties with visible: true for all component types", () => {
        allComponentTypes.forEach((type) => {
          const props = ComponentFactoryService.getDefaultProperties(type);
          expect(props.visible).toBe(true);
        });
      });

      it("should not throw for any known component type", () => {
        allComponentTypes.forEach((type) => {
          expect(() => {
            ComponentFactoryService.getDefaultProperties(type);
          }).not.toThrow();
        });
      });
    });
  });

  describe("createComponent", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    it("should create a component with correct structure", () => {
      vi.setSystemTime(new Date("2024-01-01T00:00:00.000Z"));

      const component = ComponentFactoryService.createComponent(
        "button",
        defaultPosition
      );

      expect(component).toMatchObject({
        id: "button-1704067200000",
        type: "button",
        name: "button",
        position: defaultPosition,
        parentId: null,
      });
      expect(component.properties).toBeDefined();
    });

    it("should create component with default properties for the type", () => {
      const component = ComponentFactoryService.createComponent(
        "input",
        { x: 100, y: 200 }
      );

      expect(component.properties.placeholder).toBe("请输入...");
      expect(component.properties.type).toBe("text");
      expect(component.properties.label).toBe("输入框");
    });

    it("should create container component correctly", () => {
      const container = ComponentFactoryService.createComponent(
        "grid-layout",
        { x: 0, y: 0 }
      );

      expect(container.type).toBe("grid-layout");
      expect(container.properties.columns).toBe(3);
    });

    it("should accept parentId as string", () => {
      const child = ComponentFactoryService.createComponent(
        "button",
        { x: 50, y: 50 },
        "parent-123"
      );

      expect(child.parentId).toBe("parent-123");
    });

    it("should handle parentId as null", () => {
      const root = ComponentFactoryService.createComponent(
        "container",
        { x: 0, y: 0 },
        null
      );

      expect(root.parentId).toBeNull();
    });

    it("should handle parentId as undefined", () => {
      const orphan = ComponentFactoryService.createComponent(
        "text",
        { x: 0, y: 0 }
      );

      expect(orphan.parentId).toBeNull();
    });

    it("should generate unique IDs when time advances between calls", () => {
      vi.setSystemTime(new Date("2024-01-01T00:00:00.000Z"));

      const component1 = ComponentFactoryService.createComponent(
        "button",
        { x: 0, y: 0 }
      );

      // Advance time by 1ms to ensure different IDs
      vi.advanceTimersByTime(1);

      const component2 = ComponentFactoryService.createComponent(
        "button",
        { x: 10, y: 10 }
      );

      expect(component1.id).not.toBe(component2.id);
    });

    it("should use theme for default properties when provided", () => {
      const component = ComponentFactoryService.createComponent(
        "text",
        { x: 0, y: 0 },
        undefined,
        sampleTheme
      );

      expect(component.properties.color).toBe(sampleTheme.textColor);
    });

    it("should create chart components with correct defaults", () => {
      const barChart = ComponentFactoryService.createComponent(
        "bar-chart",
        { x: 0, y: 0 }
      );

      expect(barChart.properties.title).toBe("柱状图");
      expect(barChart.properties.legend).toBe(true);
    });

    it("should create form components with correct defaults", () => {
      const input = ComponentFactoryService.createComponent("input", { x: 0, y: 0 });
      const select = ComponentFactoryService.createComponent("select", { x: 0, y: 0 });
      const checkbox = ComponentFactoryService.createComponent("checkbox", { x: 0, y: 0 });

      expect(input.properties.label).toBe("输入框");
      expect(select.properties.label).toBe("下拉选择");
      expect(checkbox.properties.label).toBe("复选框");
    });

    it("should create data components with correct defaults", () => {
      const dataTable = ComponentFactoryService.createComponent("data-table", {
        x: 0,
        y: 0,
      });
      const dataList = ComponentFactoryService.createComponent("data-list", {
        x: 0,
        y: 0,
      });
      const dataCard = ComponentFactoryService.createComponent("data-card", {
        x: 0,
        y: 0,
      });

      expect(dataTable.properties.dataSource).toBeNull();
      expect(dataTable.properties.pagination).toBe(true);
      expect(dataList.properties.listType).toBe("default");
      expect(dataCard.properties.cardType).toBe("default");
    });

    it("should create layout components with correct defaults", () => {
      const grid = ComponentFactoryService.createComponent("grid-layout", {
        x: 0,
        y: 0,
      });
      const flex = ComponentFactoryService.createComponent("flex-layout", {
        x: 0,
        y: 0,
      });

      expect(grid.properties.columns).toBe(3);
      expect(flex.properties.direction).toBe("row");
    });

    it("should create media components with correct defaults", () => {
      const image = ComponentFactoryService.createComponent("image", { x: 0, y: 0 });
      const avatar = ComponentFactoryService.createComponent("avatar", { x: 0, y: 0 });
      const carousel = ComponentFactoryService.createComponent("carousel", {
        x: 0,
        y: 0,
      });

      expect(image.properties.width).toBe(300);
      expect(avatar.properties.fallback).toBe("U");
      expect(carousel.properties.autoplay).toBe(false);
    });

    it("should create unknown type component with base properties", () => {
      const unknown = ComponentFactoryService.createComponent(
        "unknown-type",
        { x: 0, y: 0 }
      );

      expect(unknown.type).toBe("unknown-type");
      expect(unknown.properties).toEqual({ visible: true });
    });

    it("should create component at different positions", () => {
      const positions = [
        { x: 0, y: 0 },
        { x: 100, y: 200 },
        { x: -50, y: -100 },
        { x: 9999, y: 9999 },
      ];

      positions.forEach((pos) => {
        const component = ComponentFactoryService.createComponent("text", pos);
        expect(component.position).toEqual(pos);
      });
    });

    it("should create multiple components with same type", () => {
      const button1 = ComponentFactoryService.createComponent("button", { x: 0, y: 0 });

      // Advance time to ensure different IDs
      vi.advanceTimersByTime(1);

      const button2 = ComponentFactoryService.createComponent("button", { x: 10, y: 10 });

      expect(button1.type).toBe(button2.type);
      expect(button1.properties.text).toBe(button2.properties.text);
      expect(button1.id).not.toBe(button2.id);
    });
  });
});
