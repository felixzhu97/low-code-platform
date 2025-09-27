import type { Component } from "@/domain/entities/types";

export interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: string;
  tags?: string[];
  components: Component[];
}

// 基础模板数据
const BASE_TEMPLATES: Template[] = [
  {
    id: "landing-page",
    name: "着陆页模板",
    description: "一个现代化的产品着陆页，包含英雄区、特性展示和行动召唤。",
    thumbnail: "/landing-page-template.png",
    category: "页面",
    tags: ["营销", "产品"],
    components: [
      {
        id: "hero-section",
        type: "container",
        name: "英雄区",
        position: { x: 0, y: 0 },
        properties: {
          width: "100%",
          height: "500px",
          bgColor: "#f9fafb",
          padding: "2rem",
        },
        children: ["hero-title", "hero-description", "cta-button"],
      },
      {
        id: "hero-title",
        type: "text",
        name: "标题",
        parentId: "hero-section",
        position: { x: 20, y: 50 },
        properties: {
          content: "打造下一代数字体验",
          fontSize: 36,
          fontWeight: "bold",
          color: "#111827",
        },
      },
      {
        id: "hero-description",
        type: "text",
        name: "描述",
        parentId: "hero-section",
        position: { x: 20, y: 120 },
        properties: {
          content:
            "我们的平台帮助您快速构建和部署现代化的网站和应用程序，无需编写代码。",
          fontSize: 18,
          color: "#4b5563",
          width: "600px",
        },
      },
      {
        id: "cta-button",
        type: "button",
        name: "按钮",
        parentId: "hero-section",
        position: { x: 20, y: 200 },
        properties: {
          text: "立即开始",
          variant: "default",
          size: "lg",
        },
      },
    ],
  },
  {
    id: "dashboard-template",
    name: "仪表盘模板",
    description: "现代化的管理仪表盘布局，包含数据卡片、图表和表格。",
    thumbnail: "/dashboard-template.png",
    category: "仪表盘",
    tags: ["数据", "分析"],
    components: [
      {
        id: "dashboard-container",
        type: "container",
        name: "仪表盘容器",
        position: { x: 0, y: 0 },
        properties: {
          width: "100%",
          padding: "1.5rem",
          bgColor: "#f9fafb",
        },
        children: ["dashboard-header"],
      },
      {
        id: "dashboard-header",
        type: "container",
        name: "仪表盘标题",
        parentId: "dashboard-container",
        position: { x: 0, y: 0 },
        properties: {
          width: "100%",
          marginBottom: "1.5rem",
        },
        children: ["dashboard-title"],
      },
      {
        id: "dashboard-title",
        type: "text",
        name: "仪表盘标题",
        parentId: "dashboard-header",
        position: { x: 0, y: 0 },
        properties: {
          content: "分析仪表盘",
          fontSize: 28,
          fontWeight: "bold",
        },
      },
    ],
  },
  {
    id: "login-form",
    name: "登录表单",
    description: "简洁的用户登录表单，包含用户名/密码字段和记住我选项。",
    thumbnail: "/simple-login-form.png",
    category: "表单",
    tags: ["认证", "用户"],
    components: [
      {
        id: "login-card",
        type: "card",
        name: "登录卡片",
        position: { x: 0, y: 0 },
        properties: {
          width: "400px",
          border: true,
          borderRadius: "0.5rem",
        },
        children: ["login-title", "login-form"],
      },
      {
        id: "login-title",
        type: "text",
        name: "登录标题",
        parentId: "login-card",
        position: { x: 0, y: 0 },
        properties: {
          content: "账户登录",
          fontSize: 24,
          fontWeight: "bold",
          textAlign: "center",
          padding: "1rem",
        },
      },
      {
        id: "login-form",
        type: "container",
        name: "登录表单",
        parentId: "login-card",
        position: { x: 0, y: 60 },
        properties: {
          width: "100%",
          padding: "1rem",
        },
        children: ["username-input", "password-input", "login-button"],
      },
      {
        id: "username-input",
        type: "input",
        name: "用户名输入",
        parentId: "login-form",
        position: { x: 0, y: 0 },
        properties: {
          label: "用户名或邮箱",
          placeholder: "请输入您的用户名或邮箱",
          required: true,
          width: "100%",
        },
      },
      {
        id: "password-input",
        type: "input",
        name: "密码输入",
        parentId: "login-form",
        position: { x: 0, y: 80 },
        properties: {
          label: "密码",
          type: "password",
          placeholder: "请输入您的密码",
          required: true,
          width: "100%",
        },
      },
      {
        id: "login-button",
        type: "button",
        name: "登录按钮",
        parentId: "login-form",
        position: { x: 0, y: 200 },
        properties: {
          text: "登录",
          variant: "default",
          width: "100%",
        },
      },
    ],
  },
];

// 生成更多模板数据
const generateMoreTemplates = (count: number): Template[] => {
  const categories = ["页面", "表单", "仪表盘", "组件", "布局"];
  const tags = [
    "营销",
    "产品",
    "数据",
    "分析",
    "用户",
    "认证",
    "管理",
    "报表",
    "KPI",
    "业务",
    "图表",
  ];

  return Array.from({ length: count }, (_, i) => {
    const categoryIndex = i % categories.length;
    const tagIndex1 = i % tags.length;
    const tagIndex2 = (i + 3) % tags.length;

    return {
      id: `template-${i + 1}`,
      name: `模板 ${i + 1}`,
      description: `这是模板 ${i + 1} 的描述，属于 ${
        categories[categoryIndex]
      } 类别。`,
      thumbnail:
        i % 2 === 0 ? "/landing-page-template.png" : "/dashboard-template.png",
      category: categories[categoryIndex],
      tags: [tags[tagIndex1], tags[tagIndex2]],
      components: [
        {
          id: `component-${i}-1`,
          type: "container",
          name: "容器",
          position: { x: 0, y: 0 },
          properties: {
            width: "100%",
            height: "500px",
            bgColor: "#f9fafb",
            padding: "2rem",
          },
          children: [`component-${i}-2`, `component-${i}-3`],
        },
        {
          id: `component-${i}-2`,
          type: "text",
          name: "标题",
          parentId: `component-${i}-1`,
          position: { x: 20, y: 50 },
          properties: {
            content: `模板 ${i + 1} 标题`,
            fontSize: 36,
            fontWeight: "bold",
            color: "#111827",
          },
        },
        {
          id: `component-${i}-3`,
          type: "text",
          name: "描述",
          parentId: `component-${i}-1`,
          position: { x: 20, y: 120 },
          properties: {
            content: `这是模板 ${i + 1} 的详细描述内容。`,
            fontSize: 18,
            color: "#4b5563",
            width: "600px",
          },
        },
      ],
    };
  });
};

// 导出所有模板
export const ALL_TEMPLATES: Template[] = [
  ...BASE_TEMPLATES,
  ...generateMoreTemplates(20),
];

// 获取所有类别
export const getAllCategories = (): string[] => {
  return Array.from(
    new Set(ALL_TEMPLATES.map((template) => template.category))
  );
};

// 获取所有标签
export const getAllTags = (): string[] => {
  return Array.from(
    new Set(ALL_TEMPLATES.flatMap((template) => template.tags || []))
  );
};
