/**
 * JSON数据模板
 * 包含常用的JSON数据格式模板，用于快速输入数据
 */

export interface JsonDataTemplate {
  id: string;
  name: string;
  description: string;
  data: any;
  preview?: string;
  componentTypes?: string[]; // 适用的组件类型
}

/**
 * JSON数据模板列表
 */
export const JSON_DATA_TEMPLATES: JsonDataTemplate[] = [
  // 文本组件模板
  {
    id: "text-simple",
    name: "文本内容",
    description: "简单的文本字符串",
    componentTypes: ["text"],
    data: "这是一段示例文本内容",
    preview: "文本字符串",
  },
  {
    id: "text-object",
    name: "文本对象",
    description: "包含文本字段的对象",
    componentTypes: ["text"],
    data: {
      content: "这是标题文本",
      description: "这是描述文本",
    },
    preview: "对象格式",
  },
  // 按钮组件模板
  {
    id: "button-text",
    name: "按钮文本",
    description: "按钮显示的文本",
    componentTypes: ["button"],
    data: "点击我",
    preview: "文本字符串",
  },
  {
    id: "button-object",
    name: "按钮对象",
    description: "包含按钮文本的对象",
    componentTypes: ["button"],
    data: {
      text: "提交",
      label: "确认按钮",
    },
    preview: "对象格式",
  },
  // 图片组件模板
  {
    id: "image-url",
    name: "图片URL",
    description: "图片地址字符串",
    componentTypes: ["image"],
    data: "https://via.placeholder.com/400x300",
    preview: "URL字符串",
  },
  {
    id: "image-object",
    name: "图片对象",
    description: "包含图片信息的对象",
    componentTypes: ["image"],
    data: {
      src: "https://via.placeholder.com/400x300",
      alt: "示例图片",
      url: "https://via.placeholder.com/400x300",
    },
    preview: "对象格式",
  },
  // 数据表格模板
  {
    id: "table-users",
    name: "用户表格",
    description: "用户数据表格，包含ID、姓名、年龄、角色等字段",
    componentTypes: ["data-table"],
    data: [
      {
        id: 1,
        name: "张三",
        age: 28,
        role: "管理员",
        email: "zhangsan@example.com",
      },
      { id: 2, name: "李四", age: 32, role: "编辑", email: "lisi@example.com" },
      {
        id: 3,
        name: "王五",
        age: 24,
        role: "用户",
        email: "wangwu@example.com",
      },
      {
        id: 4,
        name: "赵六",
        age: 30,
        role: "管理员",
        email: "zhaoliu@example.com",
      },
    ],
    preview: "4条用户记录",
  },
  {
    id: "table-products",
    name: "产品表格",
    description: "产品数据表格，包含ID、名称、价格、库存等字段",
    componentTypes: ["data-table"],
    data: [
      { id: 1, name: "产品A", price: 99.99, stock: 100, category: "电子产品" },
      { id: 2, name: "产品B", price: 199.99, stock: 50, category: "家居用品" },
      { id: 3, name: "产品C", price: 299.99, stock: 75, category: "服装" },
      { id: 4, name: "产品D", price: 149.99, stock: 200, category: "食品" },
    ],
    preview: "4条产品记录",
  },
  // 数据列表模板
  {
    id: "list-items",
    name: "列表项数据",
    description: "列表组件数据，包含标题和描述",
    componentTypes: ["data-list"],
    data: [
      {
        id: 1,
        title: "列表项1",
        description: "这是第一项的描述",
        status: "active",
      },
      {
        id: 2,
        title: "列表项2",
        description: "这是第二项的描述",
        status: "active",
      },
      {
        id: 3,
        title: "列表项3",
        description: "这是第三项的描述",
        status: "inactive",
      },
    ],
    preview: "3个列表项",
  },
  // 图表组件模板
  {
    id: "bar-chart",
    name: "柱状图数据",
    description: "柱状图数据，包含月份、销售额、收入等字段",
    componentTypes: ["bar-chart"],
    data: [
      { name: "1月", sales: 8500, revenue: 6200 },
      { name: "2月", sales: 9200, revenue: 7300 },
      { name: "3月", sales: 10800, revenue: 8600 },
      { name: "4月", sales: 9800, revenue: 7900 },
      { name: "5月", sales: 10200, revenue: 8100 },
      { name: "6月", sales: 9500, revenue: 7600 },
    ],
    preview: "6个月的数据",
  },
  {
    id: "line-chart",
    name: "折线图数据",
    description: "折线图数据，适用于趋势展示",
    componentTypes: ["line-chart"],
    data: [
      { name: "1月", value: 4000, target: 3000 },
      { name: "2月", value: 3000, target: 3500 },
      { name: "3月", value: 5000, target: 4000 },
      { name: "4月", value: 4500, target: 4500 },
      { name: "5月", value: 6000, target: 5000 },
      { name: "6月", value: 5500, target: 5500 },
    ],
    preview: "6个数据点",
  },
  {
    id: "pie-chart",
    name: "饼图数据",
    description: "饼图数据，包含分类和数值",
    componentTypes: ["pie-chart"],
    data: [
      { category: "移动端", value: 45 },
      { category: "桌面端", value: 32 },
      { category: "平板端", value: 18 },
      { category: "其他", value: 5 },
    ],
    preview: "4个分类",
  },
  {
    id: "area-chart",
    name: "面积图数据",
    description: "面积图数据，适用于趋势展示",
    componentTypes: ["area-chart"],
    data: [
      { month: "1月", sales: 1200, target: 1000 },
      { month: "2月", sales: 1900, target: 1300 },
      { month: "3月", sales: 1300, target: 1400 },
      { month: "4月", sales: 1600, target: 1500 },
      { month: "5月", sales: 1200, target: 1600 },
      { month: "6月", sales: 1900, target: 1700 },
    ],
    preview: "6个月的数据",
  },
  // 输入框组件模板
  {
    id: "input-value",
    name: "输入框值",
    description: "输入框的默认值",
    componentTypes: ["input", "textarea"],
    data: "请输入内容...",
    preview: "文本字符串",
  },
  {
    id: "input-object",
    name: "输入框对象",
    description: "包含输入框值的对象",
    componentTypes: ["input", "textarea"],
    data: {
      value: "默认值",
      placeholder: "请输入...",
    },
    preview: "对象格式",
  },
  // 通用数组模板（用于data-table和data-list）
  {
    id: "user-list",
    name: "用户列表",
    description: "用户信息列表，包含ID、姓名、年龄和角色",
    componentTypes: ["data-table", "data-list"],
    data: [
      { id: 1, name: "张三", age: 28, role: "管理员" },
      { id: 2, name: "李四", age: 32, role: "编辑" },
      { id: 3, name: "王五", age: 24, role: "用户" },
    ],
    preview: "3个用户记录",
  },
  {
    id: "product-list",
    name: "产品列表",
    description: "产品信息列表，包含ID、名称、价格和库存",
    componentTypes: ["data-table", "data-list"],
    data: [
      { id: 1, name: "产品A", price: 99.99, stock: 100, category: "电子产品" },
      { id: 2, name: "产品B", price: 199.99, stock: 50, category: "家居用品" },
      { id: 3, name: "产品C", price: 299.99, stock: 75, category: "服装" },
    ],
    preview: "3个产品记录",
  },
  // 通用图表模板
  {
    id: "chart-data",
    name: "通用图表数据",
    description: "适用于各种图表的通用数据格式",
    componentTypes: ["bar-chart", "line-chart", "area-chart"],
    data: [
      { name: "类别A", value: 4000, sales: 2400 },
      { name: "类别B", value: 3000, sales: 1398 },
      { name: "类别C", value: 2000, sales: 980 },
      { name: "类别D", value: 2780, sales: 1408 },
      { name: "类别E", value: 1890, sales: 980 },
    ],
    preview: "5个数据点",
  },
];

/**
 * 根据ID获取模板
 */
export function getTemplateById(id: string): JsonDataTemplate | undefined {
  return JSON_DATA_TEMPLATES.find((t) => t.id === id);
}

/**
 * 获取模板的JSON字符串
 */
export function getTemplateJson(id: string): string {
  const template = getTemplateById(id);
  if (!template) {
    return "{}";
  }
  return JSON.stringify(template.data, null, 2);
}

/**
 * 根据组件类型获取推荐的模板
 */
export function getTemplatesByComponentType(
  componentType?: string
): JsonDataTemplate[] {
  if (!componentType) {
    return JSON_DATA_TEMPLATES;
  }

  return JSON_DATA_TEMPLATES.filter((template) => {
    if (!template.componentTypes || template.componentTypes.length === 0) {
      return true; // 没有指定组件类型的模板适用于所有组件
    }
    return template.componentTypes.includes(componentType);
  });
}

/**
 * 获取默认模板（根据组件类型）
 */
export function getDefaultTemplate(componentType?: string): JsonDataTemplate {
  if (componentType) {
    const templates = getTemplatesByComponentType(componentType);
    if (templates.length > 0) {
      return templates[0];
    }
  }
  return JSON_DATA_TEMPLATES[0];
}

/**
 * 获取默认模板的JSON字符串（根据组件类型）
 */
export function getDefaultTemplateJson(componentType?: string): string {
  const template = getDefaultTemplate(componentType);
  return getTemplateJson(template.id);
}
