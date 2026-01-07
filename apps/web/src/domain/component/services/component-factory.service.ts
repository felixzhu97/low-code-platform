import type { Component } from "../entities/component.entity";
import type { ThemeConfig } from "../../theme/entities/theme-config.entity";

/**
 * 组件工厂领域服务
 * 负责组件的创建、默认属性定义和类型判断
 */
export class ComponentFactoryService {
  private static readonly CONTAINER_TYPES = [
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

  /**
   * 判断组件类型是否为容器
   */
  static isContainer(type: string): boolean {
    return this.CONTAINER_TYPES.includes(type as any);
  }

  /**
   * 获取组件默认属性
   */
  static getDefaultProperties(
    type: string,
    theme?: ThemeConfig
  ): Record<string, any> {
    const baseProperties = { visible: true };

    switch (type) {
      case "text":
        return {
          ...baseProperties,
          content: "示例文本",
          fontSize: 16,
          fontWeight: "normal",
          color: theme?.textColor || "#000000",
          alignment: "left",
          lineHeight: 1.5,
          letterSpacing: "normal",
          textTransform: "none",
          textDecoration: "none",
        };
      case "button":
        return {
          ...baseProperties,
          text: "按钮",
          variant: "outline",
          size: "default",
          disabled: false,
          icon: "",
          iconPosition: "left",
          fullWidth: false,
          onClick: "none",
        };
      case "image":
        return {
          ...baseProperties,
          src: "/placeholder.svg?height=200&width=300",
          alt: "示例图片",
          width: 300,
          height: 200,
          objectFit: "cover",
          rounded: false,
          shadow: false,
          border: false,
          caption: "",
        };
      case "divider":
        return {
          ...baseProperties,
          orientation: "horizontal",
          thickness: 1,
          color: "#e2e8f0",
          margin: "1rem 0",
          style: "solid",
        };
      case "input":
        return {
          ...baseProperties,
          placeholder: "请输入...",
          disabled: false,
          required: false,
          type: "text",
          label: "输入框",
          helperText: "",
          defaultValue: "",
        };
      case "textarea":
        return {
          ...baseProperties,
          placeholder: "请输入多行文本...",
          disabled: false,
          required: false,
          rows: 4,
          label: "文本域",
          helperText: "",
          defaultValue: "",
        };
      case "select":
        return {
          ...baseProperties,
          placeholder: "请选择...",
          disabled: false,
          required: false,
          options: ["选项1", "选项2", "选项3"],
          label: "下拉选择",
          helperText: "",
          defaultValue: "",
        };
      case "checkbox":
        return {
          ...baseProperties,
          label: "复选框",
          checked: false,
          disabled: false,
          helperText: "",
        };
      case "radio":
        return {
          ...baseProperties,
          options: ["选项1", "选项2", "选项3"],
          disabled: false,
          label: "单选框组",
          helperText: "",
          defaultValue: "",
        };
      case "card":
        return {
          ...baseProperties,
          title: "卡片标题",
          shadow: true,
          padding: "1rem",
          border: true,
          rounded: true,
        };
      case "data-table":
        return {
          ...baseProperties,
          title: "数据表格",
          dataSource: null,
          columns: [
            {
              title: "列1",
              dataIndex: "field1",
              key: "field1",
              width: 150,
              sortable: true,
              filterable: true,
            },
            {
              title: "列2",
              dataIndex: "field2",
              key: "field2",
              width: 150,
              sortable: false,
              filterable: false,
            },
            {
              title: "列3",
              dataIndex: "field3",
              key: "field3",
              width: 150,
              sortable: false,
              filterable: false,
            },
          ],
          pagination: true,
          pageSize: 10,
          bordered: true,
          striped: true,
          size: "default",
        };
      case "data-list":
        return {
          ...baseProperties,
          title: "数据列表",
          dataSource: null,
          listType: "default",
          itemLayout: "horizontal",
          showActions: true,
          showExtra: true,
          pagination: true,
          pageSize: 5,
        };
      case "data-card":
        return {
          ...baseProperties,
          title: "数据卡片",
          dataSource: null,
          cardType: "default",
          showIcon: true,
          iconPosition: "left",
          showTrend: true,
          trendPosition: "bottom",
        };
      case "pagination":
        return {
          ...baseProperties,
          defaultCurrent: 1,
          total: 50,
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          size: "default",
        };
      case "tree":
        return {
          ...baseProperties,
          dataSource: null,
          defaultExpandAll: false,
          showLine: true,
          showIcon: true,
          selectable: true,
          checkable: false,
        };
      case "bar-chart":
        return {
          ...baseProperties,
          title: "柱状图",
          dataSource: null,
          xField: "name",
          yField: "sales",
          seriesField: "category",
          isGroup: true,
          isStack: false,
          legend: true,
          width: 500,
          height: 300,
        };
      case "line-chart":
        return {
          ...baseProperties,
          title: "折线图",
          dataSource: null,
          xField: "name",
          yField: "y",
          seriesField: "category",
          smooth: true,
          legend: true,
          width: 500,
          height: 300,
        };
      case "pie-chart":
        return {
          ...baseProperties,
          title: "饼图",
          dataSource: null,
          colorField: "category",
          valueField: "value",
          legend: true,
          width: 500,
          height: 300,
        };
      case "area-chart":
        return {
          ...baseProperties,
          title: "面积图",
          dataSource: null,
          xField: "name",
          yField: "uv",
          seriesField: "category",
          smooth: true,
          legend: true,
          width: 500,
          height: 300,
        };
      case "scatter-chart":
        return {
          ...baseProperties,
          title: "散点图",
          dataSource: null,
          xField: "x",
          yField: "y",
          colorField: "category",
          sizeField: "size",
          legend: true,
          width: 500,
          height: 300,
        };
      case "radar-chart":
        return {
          ...baseProperties,
          title: "雷达图",
          dataSource: null,
          angleField: "item",
          radiusField: "value",
          seriesField: "category",
          legend: true,
          width: 500,
          height: 300,
        };
      case "gauge":
        return {
          ...baseProperties,
          title: "仪表盘",
          dataSource: null,
          percent: 0.88,
          range: { color: "l(0) 0:#6B74E6 1:#5DDECF" },
          startAngle: Math.PI * -1.2,
          endAngle: Math.PI * 0.2,
          width: 300,
          height: 300,
        };
      case "radial-bar-chart":
        return {
          ...baseProperties,
          title: "环形图",
          dataSource: null,
          width: 500,
          height: 300,
        };
      case "treemap-chart":
        return {
          ...baseProperties,
          title: "树状图",
          dataSource: null,
          width: 500,
          height: 300,
        };
      case "grid-layout":
        return {
          ...baseProperties,
          columns: 3,
          gap: 2,
          autoRows: false,
          rowHeight: "auto",
          width: "100%",
          height: "auto",
        };
      case "flex-layout":
        return {
          ...baseProperties,
          direction: "row",
          wrap: true,
          justifyContent: "start",
          alignItems: "center",
          gap: 2,
          width: "100%",
          height: "auto",
        };
      case "split-layout":
        return {
          ...baseProperties,
          direction: "horizontal",
          splitRatio: 30,
          minSize: 100,
          width: "100%",
          height: "300px",
        };
      case "tab-layout":
        return {
          ...baseProperties,
          tabs: [
            { id: "tab-1", label: "标签1", content: "标签1内容" },
            { id: "tab-2", label: "标签2", content: "标签2内容" },
          ],
          defaultTab: "tab-1",
          width: "100%",
          height: "auto",
        };
      case "card-group":
        return {
          ...baseProperties,
          columns: 3,
          gap: 2,
          width: "100%",
          height: "auto",
        };
      case "responsive-container":
        return {
          ...baseProperties,
          breakpoints: {
            sm: 640,
            md: 768,
            lg: 1024,
            xl: 1280,
          },
          width: "100%",
          height: "auto",
        };
      case "collapse":
        return {
          ...baseProperties,
          title: "折叠面板",
          defaultOpen: false,
          width: "100%",
          height: "auto",
        };
      case "tabs":
        return {
          ...baseProperties,
          tabs: [
            { id: "tab-1", label: "标签1", content: "标签1内容" },
            { id: "tab-2", label: "标签2", content: "标签2内容" },
          ],
          defaultTab: "tab-1",
          width: "100%",
          height: "auto",
        };
      case "modal":
        return {
          ...baseProperties,
          title: "模态框标题",
          description: "模态框描述",
          triggerText: "打开模态框",
          width: "100%",
          height: "auto",
        };
      case "drawer":
        return {
          ...baseProperties,
          title: "抽屉标题",
          description: "抽屉描述",
          triggerText: "打开抽屉",
          width: "100%",
          height: "auto",
        };
      case "popover":
        return {
          ...baseProperties,
          title: "弹出框标题",
          description: "弹出框描述",
          triggerText: "打开弹出框",
          width: "100%",
          height: "auto",
        };
      case "tooltip":
        return {
          ...baseProperties,
          content: "这是一个提示框",
          triggerText: "悬停查看提示",
          width: "100%",
          height: "auto",
        };
      case "carousel":
        return {
          ...baseProperties,
          loop: false,
          showArrows: true,
          autoplay: false,
          autoplayDelay: 3000,
          width: "100%",
          height: "auto",
        };
      case "steps":
        return {
          ...baseProperties,
          currentStep: 1,
          steps: [
            { title: "步骤1", description: "第一步描述" },
            { title: "步骤2", description: "第二步描述" },
            { title: "步骤3", description: "第三步描述" },
          ],
          direction: "horizontal",
          width: "100%",
          height: "auto",
        };
      case "progress":
        return {
          ...baseProperties,
          value: 50,
          max: 100,
          label: "进度",
          description: "进度描述",
          showValue: true,
          size: "default",
          width: "100%",
          height: "auto",
        };
      case "avatar":
        return {
          ...baseProperties,
          src: "",
          alt: "头像",
          fallback: "U",
          size: "default",
          showInfo: false,
          name: "用户名",
          description: "用户描述",
          width: "auto",
          height: "auto",
        };
      case "badge":
        return {
          ...baseProperties,
          text: "徽章",
          variant: "default",
          showClose: false,
          width: "auto",
          height: "auto",
        };
      case "tag":
        return {
          ...baseProperties,
          tags: ["标签1", "标签2", "标签3"],
          variant: "default",
          closable: false,
          width: "100%",
          height: "auto",
        };
      case "timeline":
        return {
          ...baseProperties,
          items: [
            { title: "事件1", description: "事件描述1", time: "2023-01-01" },
            { title: "事件2", description: "事件描述2", time: "2023-01-02" },
            { title: "事件3", description: "事件描述3", time: "2023-01-03" },
          ],
          direction: "vertical",
          width: "100%",
          height: "auto",
        };
      case "rating":
        return {
          ...baseProperties,
          rating: 0,
          maxRating: 5,
          size: "default",
          readonly: false,
          showValue: false,
          allowHalf: false,
          width: "auto",
          height: "auto",
        };
      default:
        return baseProperties;
    }
  }

  /**
   * 创建新组件
   */
  static createComponent(
    type: string,
    position: { x: number; y: number },
    parentId?: string | null,
    theme?: ThemeConfig
  ): Component {
    return {
      id: `${type}-${Date.now()}`,
      type,
      name: type,
      position,
      properties: this.getDefaultProperties(type, theme),
      parentId: parentId || null,
    };
  }
}

