import type { Component } from "@/domain/component";

export interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: string;
  tags?: string[];
  components: Component[];
}

// 常用模板库
const TEMPLATES: Template[] = [
  // 页面模板
  {
    id: "landing-page",
    name: "产品着陆页",
    description:
      "现代化产品展示页面，包含英雄区、特性展示、客户评价和行动召唤。",
    thumbnail: "/landing-page-template.png",
    category: "页面",
    tags: ["营销", "产品", "转化"],
    components: [
      {
        id: "hero-section",
        type: "container",
        name: "英雄区",
        position: { x: 0, y: 0 },
        properties: {
          width: "100%",
          height: "600px",
          bgColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          padding: "3rem",
          textAlign: "center",
        },
        children: ["hero-title", "hero-description", "cta-button"],
      },
      {
        id: "hero-title",
        type: "text",
        name: "主标题",
        parentId: "hero-section",
        position: { x: 0, y: 100 },
        properties: {
          content: "打造下一代数字体验",
          fontSize: 48,
          fontWeight: "bold",
          color: "#ffffff",
          textAlign: "center",
        },
      },
      {
        id: "hero-description",
        type: "text",
        name: "副标题",
        parentId: "hero-section",
        position: { x: 0, y: 180 },
        properties: {
          content:
            "我们的平台帮助您快速构建和部署现代化的网站和应用程序，无需编写代码",
          fontSize: 20,
          color: "#e5e7eb",
          textAlign: "center",
          maxWidth: "800px",
          margin: "0 auto",
        },
      },
      {
        id: "cta-button",
        type: "button",
        name: "行动按钮",
        parentId: "hero-section",
        position: { x: 0, y: 280 },
        properties: {
          text: "立即开始免费试用",
          variant: "default",
          size: "lg",
          bgColor: "#ffffff",
          color: "#667eea",
          padding: "1rem 2rem",
          borderRadius: "0.5rem",
        },
      },
    ],
  },
  {
    id: "about-page",
    name: "关于我们页面",
    description: "企业介绍页面，包含团队介绍、公司历史和价值观展示。",
    thumbnail: "/placeholder.svg",
    category: "页面",
    tags: ["企业", "介绍", "团队"],
    components: [
      {
        id: "about-hero",
        type: "container",
        name: "关于我们头部",
        position: { x: 0, y: 0 },
        properties: {
          width: "100%",
          height: "400px",
          bgColor: "#f8fafc",
          padding: "4rem 2rem",
          textAlign: "center",
        },
        children: ["about-title", "about-subtitle"],
      },
      {
        id: "about-title",
        type: "text",
        name: "关于标题",
        parentId: "about-hero",
        position: { x: 0, y: 100 },
        properties: {
          content: "关于我们",
          fontSize: 42,
          fontWeight: "bold",
          color: "#1f2937",
        },
      },
      {
        id: "about-subtitle",
        type: "text",
        name: "关于副标题",
        parentId: "about-hero",
        position: { x: 0, y: 160 },
        properties: {
          content: "我们致力于为客户提供最优质的产品和服务",
          fontSize: 18,
          color: "#6b7280",
        },
      },
    ],
  },
  {
    id: "contact-page",
    name: "联系我们页面",
    description: "联系页面模板，包含联系表单、公司信息和地图展示。",
    thumbnail: "/placeholder.svg",
    category: "页面",
    tags: ["联系", "表单", "信息"],
    components: [
      {
        id: "contact-container",
        type: "container",
        name: "联系容器",
        position: { x: 0, y: 0 },
        properties: {
          width: "100%",
          padding: "3rem 2rem",
          bgColor: "#ffffff",
        },
        children: ["contact-title", "contact-form", "contact-info"],
      },
      {
        id: "contact-title",
        type: "text",
        name: "联系标题",
        parentId: "contact-container",
        position: { x: 0, y: 0 },
        properties: {
          content: "联系我们",
          fontSize: 36,
          fontWeight: "bold",
          color: "#1f2937",
          textAlign: "center",
          marginBottom: "2rem",
        },
      },
      {
        id: "contact-form",
        type: "container",
        name: "联系表单",
        parentId: "contact-container",
        position: { x: 0, y: 80 },
        properties: {
          width: "50%",
          padding: "2rem",
          border: "1px solid #e5e7eb",
          borderRadius: "0.5rem",
          bgColor: "#f9fafb",
        },
        children: [
          "form-title",
          "name-input",
          "email-input",
          "message-input",
          "submit-button",
        ],
      },
      {
        id: "form-title",
        type: "text",
        name: "表单标题",
        parentId: "contact-form",
        position: { x: 0, y: 0 },
        properties: {
          content: "发送消息",
          fontSize: 24,
          fontWeight: "bold",
          color: "#1f2937",
          marginBottom: "1.5rem",
        },
      },
      {
        id: "name-input",
        type: "input",
        name: "姓名输入",
        parentId: "contact-form",
        position: { x: 0, y: 60 },
        properties: {
          label: "姓名",
          placeholder: "请输入您的姓名",
          required: true,
          width: "100%",
          marginBottom: "1rem",
        },
      },
      {
        id: "email-input",
        type: "input",
        name: "邮箱输入",
        parentId: "contact-form",
        position: { x: 0, y: 140 },
        properties: {
          label: "邮箱",
          type: "email",
          placeholder: "请输入您的邮箱",
          required: true,
          width: "100%",
          marginBottom: "1rem",
        },
      },
      {
        id: "message-input",
        type: "input",
        name: "消息输入",
        parentId: "contact-form",
        position: { x: 0, y: 220 },
        properties: {
          label: "消息",
          type: "textarea",
          placeholder: "请输入您的消息",
          required: true,
          width: "100%",
          height: "120px",
          marginBottom: "1.5rem",
        },
      },
      {
        id: "submit-button",
        type: "button",
        name: "提交按钮",
        parentId: "contact-form",
        position: { x: 0, y: 360 },
        properties: {
          text: "发送消息",
          variant: "default",
          width: "100%",
        },
      },
    ],
  },

  // 仪表盘模板
  {
    id: "analytics-dashboard",
    name: "数据分析仪表盘",
    description: "完整的数据分析仪表盘，包含KPI卡片、图表和数据表格。",
    thumbnail: "/dashboard-template.png",
    category: "仪表盘",
    tags: ["数据", "分析", "KPI"],
    components: [
      {
        id: "dashboard-header",
        type: "container",
        name: "仪表盘头部",
        position: { x: 0, y: 0 },
        properties: {
          width: "100%",
          height: "80px",
          bgColor: "#ffffff",
          padding: "1rem 2rem",
          borderBottom: "1px solid #e5e7eb",
        },
        children: ["dashboard-title", "user-info"],
      },
      {
        id: "dashboard-title",
        type: "text",
        name: "仪表盘标题",
        parentId: "dashboard-header",
        position: { x: 0, y: 20 },
        properties: {
          content: "数据分析仪表盘",
          fontSize: 28,
          fontWeight: "bold",
          color: "#1f2937",
        },
      },
      {
        id: "kpi-section",
        type: "container",
        name: "KPI区域",
        position: { x: 0, y: 100 },
        properties: {
          width: "100%",
          padding: "2rem",
          bgColor: "#f8fafc",
        },
        children: ["kpi-grid"],
      },
      {
        id: "kpi-grid",
        type: "container",
        name: "KPI网格",
        parentId: "kpi-section",
        position: { x: 0, y: 0 },
        properties: {
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "1.5rem",
        },
        children: ["kpi-card-1", "kpi-card-2", "kpi-card-3", "kpi-card-4"],
      },
      {
        id: "kpi-card-1",
        type: "card",
        name: "总用户数",
        parentId: "kpi-grid",
        position: { x: 0, y: 0 },
        properties: {
          padding: "1.5rem",
          bgColor: "#ffffff",
          borderRadius: "0.5rem",
          border: "1px solid #e5e7eb",
          textAlign: "center",
        },
        children: ["kpi-title-1", "kpi-value-1"],
      },
      {
        id: "kpi-title-1",
        type: "text",
        name: "KPI标题1",
        parentId: "kpi-card-1",
        position: { x: 0, y: 0 },
        properties: {
          content: "总用户数",
          fontSize: 14,
          color: "#6b7280",
          marginBottom: "0.5rem",
        },
      },
      {
        id: "kpi-value-1",
        type: "text",
        name: "KPI数值1",
        parentId: "kpi-card-1",
        position: { x: 0, y: 30 },
        properties: {
          content: "12,345",
          fontSize: 32,
          fontWeight: "bold",
          color: "#1f2937",
        },
      },
    ],
  },
  {
    id: "admin-dashboard",
    name: "管理后台仪表盘",
    description: "企业级管理后台，包含用户管理、系统设置和操作日志。",
    thumbnail: "/placeholder.svg",
    category: "仪表盘",
    tags: ["管理", "后台", "系统"],
    components: [
      {
        id: "admin-sidebar",
        type: "container",
        name: "管理侧边栏",
        position: { x: 0, y: 0 },
        properties: {
          width: "250px",
          height: "100vh",
          bgColor: "#1f2937",
          padding: "1rem",
          position: "fixed",
        },
        children: ["admin-logo", "admin-menu"],
      },
      {
        id: "admin-logo",
        type: "text",
        name: "管理Logo",
        parentId: "admin-sidebar",
        position: { x: 0, y: 0 },
        properties: {
          content: "管理系统",
          fontSize: 20,
          fontWeight: "bold",
          color: "#ffffff",
          marginBottom: "2rem",
        },
      },
    ],
  },

  // 表单模板
  {
    id: "login-form",
    name: "用户登录表单",
    description: "简洁的登录表单，包含用户名、密码和记住我选项。",
    thumbnail: "/simple-login-form.png",
    category: "表单",
    tags: ["认证", "登录", "用户"],
    components: [
      {
        id: "login-container",
        type: "container",
        name: "登录容器",
        position: { x: 0, y: 0 },
        properties: {
          width: "100%",
          height: "100vh",
          bgColor: "#f8fafc",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        children: ["login-card"],
      },
      {
        id: "login-card",
        type: "card",
        name: "登录卡片",
        parentId: "login-container",
        position: { x: 0, y: 0 },
        properties: {
          width: "400px",
          padding: "2rem",
          bgColor: "#ffffff",
          borderRadius: "0.5rem",
          border: "1px solid #e5e7eb",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
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
          fontSize: 28,
          fontWeight: "bold",
          color: "#1f2937",
          textAlign: "center",
          marginBottom: "2rem",
        },
      },
      {
        id: "login-form",
        type: "container",
        name: "登录表单",
        parentId: "login-card",
        position: { x: 0, y: 80 },
        properties: {
          width: "100%",
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
          marginBottom: "1rem",
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
          marginBottom: "1.5rem",
        },
      },
      {
        id: "login-button",
        type: "button",
        name: "登录按钮",
        parentId: "login-form",
        position: { x: 0, y: 180 },
        properties: {
          text: "登录",
          variant: "default",
          width: "100%",
          height: "48px",
        },
      },
    ],
  },
  {
    id: "registration-form",
    name: "用户注册表单",
    description: "完整的用户注册表单，包含个人信息验证和条款确认。",
    thumbnail: "/signup-form-template.png",
    category: "表单",
    tags: ["注册", "用户", "验证"],
    components: [
      {
        id: "register-container",
        type: "container",
        name: "注册容器",
        position: { x: 0, y: 0 },
        properties: {
          width: "100%",
          minHeight: "100vh",
          bgColor: "#f8fafc",
          padding: "2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        children: ["register-card"],
      },
      {
        id: "register-card",
        type: "card",
        name: "注册卡片",
        parentId: "register-container",
        position: { x: 0, y: 0 },
        properties: {
          width: "500px",
          padding: "2rem",
          bgColor: "#ffffff",
          borderRadius: "0.5rem",
          border: "1px solid #e5e7eb",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        },
        children: ["register-title", "register-form"],
      },
      {
        id: "register-title",
        type: "text",
        name: "注册标题",
        parentId: "register-card",
        position: { x: 0, y: 0 },
        properties: {
          content: "创建账户",
          fontSize: 28,
          fontWeight: "bold",
          color: "#1f2937",
          textAlign: "center",
          marginBottom: "2rem",
        },
      },
      {
        id: "register-form",
        type: "container",
        name: "注册表单",
        parentId: "register-card",
        position: { x: 0, y: 80 },
        properties: {
          width: "100%",
        },
        children: [
          "name-input",
          "email-input",
          "password-input",
          "confirm-password-input",
          "register-button",
        ],
      },
      {
        id: "name-input",
        type: "input",
        name: "姓名输入",
        parentId: "register-form",
        position: { x: 0, y: 0 },
        properties: {
          label: "姓名",
          placeholder: "请输入您的姓名",
          required: true,
          width: "100%",
          marginBottom: "1rem",
        },
      },
      {
        id: "email-input",
        type: "input",
        name: "邮箱输入",
        parentId: "register-form",
        position: { x: 0, y: 80 },
        properties: {
          label: "邮箱",
          type: "email",
          placeholder: "请输入您的邮箱",
          required: true,
          width: "100%",
          marginBottom: "1rem",
        },
      },
      {
        id: "password-input",
        type: "input",
        name: "密码输入",
        parentId: "register-form",
        position: { x: 0, y: 160 },
        properties: {
          label: "密码",
          type: "password",
          placeholder: "请输入密码",
          required: true,
          width: "100%",
          marginBottom: "1rem",
        },
      },
      {
        id: "confirm-password-input",
        type: "input",
        name: "确认密码输入",
        parentId: "register-form",
        position: { x: 0, y: 240 },
        properties: {
          label: "确认密码",
          type: "password",
          placeholder: "请再次输入密码",
          required: true,
          width: "100%",
          marginBottom: "1.5rem",
        },
      },
      {
        id: "register-button",
        type: "button",
        name: "注册按钮",
        parentId: "register-form",
        position: { x: 0, y: 340 },
        properties: {
          text: "创建账户",
          variant: "default",
          width: "100%",
          height: "48px",
        },
      },
    ],
  },
  {
    id: "contact-form",
    name: "联系表单",
    description: "通用联系表单，包含姓名、邮箱、主题和消息字段。",
    thumbnail: "/placeholder.svg",
    category: "表单",
    tags: ["联系", "反馈", "沟通"],
    components: [
      {
        id: "contact-form-container",
        type: "container",
        name: "联系表单容器",
        position: { x: 0, y: 0 },
        properties: {
          width: "100%",
          maxWidth: "600px",
          margin: "2rem auto",
          padding: "2rem",
          bgColor: "#ffffff",
          borderRadius: "0.5rem",
          border: "1px solid #e5e7eb",
        },
        children: ["contact-form-title", "contact-form-fields"],
      },
      {
        id: "contact-form-title",
        type: "text",
        name: "联系表单标题",
        parentId: "contact-form-container",
        position: { x: 0, y: 0 },
        properties: {
          content: "联系我们",
          fontSize: 24,
          fontWeight: "bold",
          color: "#1f2937",
          textAlign: "center",
          marginBottom: "2rem",
        },
      },
      {
        id: "contact-form-fields",
        type: "container",
        name: "联系表单字段",
        parentId: "contact-form-container",
        position: { x: 0, y: 80 },
        properties: {
          width: "100%",
        },
        children: [
          "contact-name",
          "contact-email",
          "contact-subject",
          "contact-message",
          "contact-submit",
        ],
      },
      {
        id: "contact-name",
        type: "input",
        name: "联系人姓名",
        parentId: "contact-form-fields",
        position: { x: 0, y: 0 },
        properties: {
          label: "姓名",
          placeholder: "请输入您的姓名",
          required: true,
          width: "100%",
          marginBottom: "1rem",
        },
      },
      {
        id: "contact-email",
        type: "input",
        name: "联系邮箱",
        parentId: "contact-form-fields",
        position: { x: 0, y: 80 },
        properties: {
          label: "邮箱",
          type: "email",
          placeholder: "请输入您的邮箱",
          required: true,
          width: "100%",
          marginBottom: "1rem",
        },
      },
      {
        id: "contact-subject",
        type: "input",
        name: "联系主题",
        parentId: "contact-form-fields",
        position: { x: 0, y: 160 },
        properties: {
          label: "主题",
          placeholder: "请输入消息主题",
          required: true,
          width: "100%",
          marginBottom: "1rem",
        },
      },
      {
        id: "contact-message",
        type: "input",
        name: "联系消息",
        parentId: "contact-form-fields",
        position: { x: 0, y: 240 },
        properties: {
          label: "消息",
          type: "textarea",
          placeholder: "请输入您的消息",
          required: true,
          width: "100%",
          height: "120px",
          marginBottom: "1.5rem",
        },
      },
      {
        id: "contact-submit",
        type: "button",
        name: "提交按钮",
        parentId: "contact-form-fields",
        position: { x: 0, y: 380 },
        properties: {
          text: "发送消息",
          variant: "default",
          width: "100%",
          height: "48px",
        },
      },
    ],
  },

  // 电商模板
  {
    id: "product-showcase",
    name: "产品展示页面",
    description: "电商产品详情页面，包含产品图片、描述、价格和购买按钮。",
    thumbnail: "/placeholder.svg",
    category: "电商",
    tags: ["产品", "电商", "销售"],
    components: [
      {
        id: "product-container",
        type: "container",
        name: "产品容器",
        position: { x: 0, y: 0 },
        properties: {
          width: "100%",
          padding: "2rem",
          bgColor: "#ffffff",
        },
        children: ["product-grid"],
      },
      {
        id: "product-grid",
        type: "container",
        name: "产品网格",
        parentId: "product-container",
        position: { x: 0, y: 0 },
        properties: {
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "3rem",
          maxWidth: "1200px",
          margin: "0 auto",
        },
        children: ["product-images", "product-info"],
      },
      {
        id: "product-images",
        type: "container",
        name: "产品图片",
        parentId: "product-grid",
        position: { x: 0, y: 0 },
        properties: {
          bgColor: "#f8fafc",
          borderRadius: "0.5rem",
          padding: "2rem",
          textAlign: "center",
        },
        children: ["product-main-image"],
      },
      {
        id: "product-main-image",
        type: "text",
        name: "主图占位",
        parentId: "product-images",
        position: { x: 0, y: 0 },
        properties: {
          content: "产品图片",
          fontSize: 18,
          color: "#6b7280",
          padding: "4rem",
        },
      },
      {
        id: "product-info",
        type: "container",
        name: "产品信息",
        parentId: "product-grid",
        position: { x: 0, y: 0 },
        properties: {
          padding: "1rem",
        },
        children: [
          "product-title",
          "product-price",
          "product-description",
          "product-buy-button",
        ],
      },
      {
        id: "product-title",
        type: "text",
        name: "产品标题",
        parentId: "product-info",
        position: { x: 0, y: 0 },
        properties: {
          content: "高质量产品名称",
          fontSize: 32,
          fontWeight: "bold",
          color: "#1f2937",
          marginBottom: "1rem",
        },
      },
      {
        id: "product-price",
        type: "text",
        name: "产品价格",
        parentId: "product-info",
        position: { x: 0, y: 60 },
        properties: {
          content: "¥299.00",
          fontSize: 28,
          fontWeight: "bold",
          color: "#dc2626",
          marginBottom: "1.5rem",
        },
      },
      {
        id: "product-description",
        type: "text",
        name: "产品描述",
        parentId: "product-info",
        position: { x: 0, y: 120 },
        properties: {
          content:
            "这是一个高质量的产品，具有出色的性能和设计。适合各种使用场景，是您的最佳选择。",
          fontSize: 16,
          color: "#4b5563",
          lineHeight: "1.6",
          marginBottom: "2rem",
        },
      },
      {
        id: "product-buy-button",
        type: "button",
        name: "购买按钮",
        parentId: "product-info",
        position: { x: 0, y: 280 },
        properties: {
          text: "立即购买",
          variant: "default",
          size: "lg",
          bgColor: "#dc2626",
          color: "#ffffff",
          padding: "1rem 2rem",
        },
      },
    ],
  },

  // 博客模板
  {
    id: "blog-layout",
    name: "博客文章布局",
    description:
      "标准博客文章页面，包含文章标题、内容、作者信息和相关文章推荐。",
    thumbnail: "/placeholder.svg",
    category: "博客",
    tags: ["文章", "内容", "阅读"],
    components: [
      {
        id: "blog-container",
        type: "container",
        name: "博客容器",
        position: { x: 0, y: 0 },
        properties: {
          width: "100%",
          maxWidth: "800px",
          margin: "0 auto",
          padding: "2rem",
          bgColor: "#ffffff",
        },
        children: ["blog-header", "blog-content", "blog-footer"],
      },
      {
        id: "blog-header",
        type: "container",
        name: "博客头部",
        parentId: "blog-container",
        position: { x: 0, y: 0 },
        properties: {
          width: "100%",
          marginBottom: "3rem",
          textAlign: "center",
        },
        children: ["blog-title", "blog-meta"],
      },
      {
        id: "blog-title",
        type: "text",
        name: "博客标题",
        parentId: "blog-header",
        position: { x: 0, y: 0 },
        properties: {
          content: "如何构建现代化的Web应用",
          fontSize: 36,
          fontWeight: "bold",
          color: "#1f2937",
          lineHeight: "1.2",
          marginBottom: "1rem",
        },
      },
      {
        id: "blog-meta",
        type: "text",
        name: "博客元信息",
        parentId: "blog-header",
        position: { x: 0, y: 80 },
        properties: {
          content: "作者：张三 | 发布时间：2024年1月15日 | 阅读时间：5分钟",
          fontSize: 14,
          color: "#6b7280",
        },
      },
      {
        id: "blog-content",
        type: "container",
        name: "博客内容",
        parentId: "blog-container",
        position: { x: 0, y: 160 },
        properties: {
          width: "100%",
          lineHeight: "1.8",
          color: "#374151",
          fontSize: 16,
        },
        children: ["blog-paragraph-1", "blog-paragraph-2"],
      },
      {
        id: "blog-paragraph-1",
        type: "text",
        name: "博客段落1",
        parentId: "blog-content",
        position: { x: 0, y: 0 },
        properties: {
          content:
            "在当今快速发展的技术环境中，构建现代化的Web应用已经成为每个开发者的必备技能。本文将介绍一些最佳实践和工具，帮助您创建高效、可维护的应用程序。",
          marginBottom: "1.5rem",
        },
      },
      {
        id: "blog-paragraph-2",
        type: "text",
        name: "博客段落2",
        parentId: "blog-content",
        position: { x: 0, y: 100 },
        properties: {
          content:
            "首先，选择合适的框架和库至关重要。React、Vue和Angular都是优秀的选择，每种都有其独特的优势和适用场景。同时，不要忽视性能优化和用户体验的重要性。",
          marginBottom: "1.5rem",
        },
      },
    ],
  },

  // 404页面
  {
    id: "404-page",
    name: "404错误页面",
    description: "友好的404错误页面，包含错误信息和导航链接。",
    thumbnail: "/placeholder.svg",
    category: "错误页面",
    tags: ["错误", "导航", "友好"],
    components: [
      {
        id: "error-container",
        type: "container",
        name: "错误容器",
        position: { x: 0, y: 0 },
        properties: {
          width: "100%",
          height: "100vh",
          bgColor: "#f8fafc",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        },
        children: ["error-code", "error-message", "error-actions"],
      },
      {
        id: "error-code",
        type: "text",
        name: "错误代码",
        parentId: "error-container",
        position: { x: 0, y: 0 },
        properties: {
          content: "404",
          fontSize: 120,
          fontWeight: "bold",
          color: "#dc2626",
          marginBottom: "1rem",
        },
      },
      {
        id: "error-message",
        type: "text",
        name: "错误消息",
        parentId: "error-container",
        position: { x: 0, y: 160 },
        properties: {
          content: "抱歉，您访问的页面不存在",
          fontSize: 24,
          color: "#6b7280",
          textAlign: "center",
          marginBottom: "2rem",
        },
      },
      {
        id: "error-actions",
        type: "container",
        name: "错误操作",
        parentId: "error-container",
        position: { x: 0, y: 240 },
        properties: {
          display: "flex",
          gap: "1rem",
        },
        children: ["home-button", "back-button"],
      },
      {
        id: "home-button",
        type: "button",
        name: "首页按钮",
        parentId: "error-actions",
        position: { x: 0, y: 0 },
        properties: {
          text: "返回首页",
          variant: "default",
          padding: "0.75rem 1.5rem",
        },
      },
      {
        id: "back-button",
        type: "button",
        name: "返回按钮",
        parentId: "error-actions",
        position: { x: 0, y: 0 },
        properties: {
          text: "返回上页",
          variant: "outline",
          padding: "0.75rem 1.5rem",
        },
      },
    ],
  },
];

// 导出所有模板
export const ALL_TEMPLATES: Template[] = TEMPLATES;

// 获取所有类别
export const getAllCategories = (): string[] => {
  return Array.from(
    new Set(ALL_TEMPLATES.map((template) => template.category))
  ).sort();
};

// 获取所有标签
export const getAllTags = (): string[] => {
  return Array.from(
    new Set(ALL_TEMPLATES.flatMap((template) => template.tags || []))
  ).sort();
};

// 按类别获取模板
export const getTemplatesByCategory = (category: string): Template[] => {
  return ALL_TEMPLATES.filter((template) => template.category === category);
};

// 按标签获取模板
export const getTemplatesByTag = (tag: string): Template[] => {
  return ALL_TEMPLATES.filter((template) => template.tags?.includes(tag));
};

// 搜索模板
export const searchTemplates = (query: string): Template[] => {
  const lowerQuery = query.toLowerCase();
  return ALL_TEMPLATES.filter(
    (template) =>
      template.name.toLowerCase().includes(lowerQuery) ||
      template.description.toLowerCase().includes(lowerQuery) ||
      template.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
};
