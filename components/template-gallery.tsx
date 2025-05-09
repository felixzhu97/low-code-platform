"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Search, Filter, X } from "lucide-react"
import { TemplatePreview } from "@/components/template-preview"
import { EnhancedTemplatePreview } from "@/components/enhanced-template-preview"
import type { Component, ThemeConfig } from "@/lib/types"
import { VirtualList } from "@/components/virtual-list"

interface TemplateGalleryProps {
  onSelectTemplate: (components: Component[]) => void
  theme: ThemeConfig
}

// 模板数据类型
interface Template {
  id: string
  name: string
  description: string
  thumbnail: string
  category: string
  tags?: string[]
  components: Component[]
}

// 模拟模板数据
const TEMPLATES: Template[] = [
  {
    id: "landing-page",
    name: "着陆页模板",
    description: "一个现代化的产品着陆页，包含英雄区、特性展示和行动召唤。",
    thumbnail: "/landing-page-template.png",
    category: "页面",
    tags: ["营销", "产品"],
    components: [
      // 组件数据
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
          content: "我们的平台帮助您快速构建和部署现代化的网站和应用程序，无需编写代码。",
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
      {
        id: "features-section",
        type: "grid-layout",
        name: "特性区",
        position: { x: 0, y: 520 },
        properties: {
          width: "100%",
          padding: "2rem",
          columns: 3,
          gap: 6,
        },
        children: ["feature-1", "feature-2", "feature-3"],
      },
      {
        id: "feature-1",
        type: "card",
        name: "特性1",
        parentId: "features-section",
        position: { x: 0, y: 0 },
        properties: {
          title: "简单易用",
          width: "100%",
        },
        children: ["feature-1-desc"],
      },
      {
        id: "feature-1-desc",
        type: "text",
        name: "特性1描述",
        parentId: "feature-1",
        position: { x: 0, y: 0 },
        properties: {
          content: "直观的拖放界面，让任何人都能轻松创建专业级网站。",
          fontSize: 16,
        },
      },
      {
        id: "feature-2",
        type: "card",
        name: "特性2",
        parentId: "features-section",
        position: { x: 0, y: 0 },
        properties: {
          title: "响应式设计",
          width: "100%",
        },
        children: ["feature-2-desc"],
      },
      {
        id: "feature-2-desc",
        type: "text",
        name: "特性2描述",
        parentId: "feature-2",
        position: { x: 0, y: 0 },
        properties: {
          content: "自动适应各种屏幕尺寸，确保在所有设备上都有出色的用户体验。",
          fontSize: 16,
        },
      },
      {
        id: "feature-3",
        type: "card",
        name: "特性3",
        parentId: "features-section",
        position: { x: 0, y: 0 },
        properties: {
          title: "强大的集成",
          width: "100%",
        },
        children: ["feature-3-desc"],
      },
      {
        id: "feature-3-desc",
        type: "text",
        name: "特性3描述",
        parentId: "feature-3",
        position: { x: 0, y: 0 },
        properties: {
          content: "与您喜爱的工具和服务无缝集成，扩展您的网站功能。",
          fontSize: 16,
        },
      },
    ],
  },
  {
    id: "pricing-page",
    name: "定价页面",
    description: "展示产品或服务定价计划的页面模板。",
    thumbnail: "/pricing-page-template.png",
    category: "页面",
    tags: ["营销", "销售"],
    components: [
      // 组件数据
      {
        id: "pricing-header",
        type: "container",
        name: "定价标题",
        position: { x: 0, y: 0 },
        properties: {
          width: "100%",
          padding: "2rem",
          textAlign: "center",
        },
        children: ["pricing-title", "pricing-subtitle"],
      },
      {
        id: "pricing-title",
        type: "text",
        name: "标题",
        parentId: "pricing-header",
        position: { x: 0, y: 0 },
        properties: {
          content: "简单透明的定价",
          fontSize: 36,
          fontWeight: "bold",
          color: "#111827",
        },
      },
      {
        id: "pricing-subtitle",
        type: "text",
        name: "副标题",
        parentId: "pricing-header",
        position: { x: 0, y: 60 },
        properties: {
          content: "选择最适合您需求的计划，随时可以升级或降级。",
          fontSize: 18,
          color: "#4b5563",
        },
      },
      {
        id: "pricing-plans",
        type: "grid-layout",
        name: "定价计划",
        position: { x: 0, y: 150 },
        properties: {
          width: "100%",
          padding: "2rem",
          columns: 3,
          gap: 6,
        },
        children: ["basic-plan", "pro-plan", "enterprise-plan"],
      },
      {
        id: "basic-plan",
        type: "card",
        name: "基础计划",
        parentId: "pricing-plans",
        position: { x: 0, y: 0 },
        properties: {
          width: "100%",
          border: true,
          borderRadius: "0.5rem",
        },
        children: ["basic-plan-header", "basic-plan-price", "basic-plan-features", "basic-plan-button"],
      },
      {
        id: "basic-plan-header",
        type: "text",
        name: "基础计划标题",
        parentId: "basic-plan",
        position: { x: 0, y: 0 },
        properties: {
          content: "基础版",
          fontSize: 24,
          fontWeight: "bold",
          textAlign: "center",
          padding: "1rem",
        },
      },
      {
        id: "basic-plan-price",
        type: "text",
        name: "基础计划价格",
        parentId: "basic-plan",
        position: { x: 0, y: 50 },
        properties: {
          content: "¥99/月",
          fontSize: 36,
          fontWeight: "bold",
          textAlign: "center",
          padding: "1rem",
        },
      },
      {
        id: "basic-plan-features",
        type: "text",
        name: "基础计划特性",
        parentId: "basic-plan",
        position: { x: 0, y: 120 },
        properties: {
          content: "• 最多5个项目\n• 基础分析\n• 社区支持\n• 1GB存储空间",
          fontSize: 16,
          padding: "1rem",
        },
      },
      {
        id: "basic-plan-button",
        type: "button",
        name: "基础计划按钮",
        parentId: "basic-plan",
        position: { x: 0, y: 250 },
        properties: {
          text: "选择基础版",
          variant: "outline",
          width: "100%",
        },
      },
      // 专业版和企业版类似结构...
      {
        id: "pro-plan",
        type: "card",
        name: "专业计划",
        parentId: "pricing-plans",
        position: { x: 0, y: 0 },
        properties: {
          width: "100%",
          border: true,
          borderRadius: "0.5rem",
          bgColor: "#f9fafb",
        },
        children: ["pro-plan-header", "pro-plan-price", "pro-plan-features", "pro-plan-button"],
      },
      {
        id: "pro-plan-header",
        type: "text",
        name: "专业计划标题",
        parentId: "pro-plan",
        position: { x: 0, y: 0 },
        properties: {
          content: "专业版",
          fontSize: 24,
          fontWeight: "bold",
          textAlign: "center",
          padding: "1rem",
        },
      },
      {
        id: "pro-plan-price",
        type: "text",
        name: "专业计划价格",
        parentId: "pro-plan",
        position: { x: 0, y: 50 },
        properties: {
          content: "¥299/月",
          fontSize: 36,
          fontWeight: "bold",
          textAlign: "center",
          padding: "1rem",
        },
      },
      {
        id: "pro-plan-features",
        type: "text",
        name: "专业计划特性",
        parentId: "pro-plan",
        position: { x: 0, y: 120 },
        properties: {
          content: "• 无限项目\n• 高级分析\n• 优先支持\n• 10GB存储空间\n• 自定义域名",
          fontSize: 16,
          padding: "1rem",
        },
      },
      {
        id: "pro-plan-button",
        type: "button",
        name: "专业计划按钮",
        parentId: "pro-plan",
        position: { x: 0, y: 280 },
        properties: {
          text: "选择专业版",
          variant: "default",
          width: "100%",
        },
      },
      {
        id: "enterprise-plan",
        type: "card",
        name: "企业计划",
        parentId: "pricing-plans",
        position: { x: 0, y: 0 },
        properties: {
          width: "100%",
          border: true,
          borderRadius: "0.5rem",
        },
        children: [
          "enterprise-plan-header",
          "enterprise-plan-price",
          "enterprise-plan-features",
          "enterprise-plan-button",
        ],
      },
      {
        id: "enterprise-plan-header",
        type: "text",
        name: "企业计划标题",
        parentId: "enterprise-plan",
        position: { x: 0, y: 0 },
        properties: {
          content: "企业版",
          fontSize: 24,
          fontWeight: "bold",
          textAlign: "center",
          padding: "1rem",
        },
      },
      {
        id: "enterprise-plan-price",
        type: "text",
        name: "企业计划价格",
        parentId: "enterprise-plan",
        position: { x: 0, y: 50 },
        properties: {
          content: "¥999/月",
          fontSize: 36,
          fontWeight: "bold",
          textAlign: "center",
          padding: "1rem",
        },
      },
      {
        id: "enterprise-plan-features",
        type: "text",
        name: "企业计划特性",
        parentId: "enterprise-plan",
        position: { x: 0, y: 120 },
        properties: {
          content: "• 无限项目\n• 企业级分析\n• 专属客户经理\n• 100GB存储空间\n• 自定义域名\n• SSO集成\n• SLA保障",
          fontSize: 16,
          padding: "1rem",
        },
      },
      {
        id: "enterprise-plan-button",
        type: "button",
        name: "企业计划按钮",
        parentId: "enterprise-plan",
        position: { x: 0, y: 320 },
        properties: {
          text: "联系销售",
          variant: "outline",
          width: "100%",
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
      // 组件数据
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
        children: ["username-input", "password-input", "remember-me", "login-button", "forgot-password"],
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
        id: "remember-me",
        type: "checkbox",
        name: "记住我",
        parentId: "login-form",
        position: { x: 0, y: 160 },
        properties: {
          label: "记住我",
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
      {
        id: "forgot-password",
        type: "text",
        name: "忘记密码",
        parentId: "login-form",
        position: { x: 0, y: 250 },
        properties: {
          content: "忘记密码？",
          fontSize: 14,
          color: "#3b82f6",
          textAlign: "center",
          padding: "0.5rem",
        },
      },
    ],
  },
  {
    id: "signup-form",
    name: "注册表单",
    description: "新用户注册表单，包含基本信息字段和条款同意选项。",
    thumbnail: "/signup-form-template.png",
    category: "表单",
    tags: ["认证", "用户"],
    components: [
      // 组件数据
      {
        id: "signup-card",
        type: "card",
        name: "注册卡片",
        position: { x: 0, y: 0 },
        properties: {
          width: "450px",
          border: true,
          borderRadius: "0.5rem",
        },
        children: ["signup-title", "signup-form"],
      },
      {
        id: "signup-title",
        type: "text",
        name: "注册标题",
        parentId: "signup-card",
        position: { x: 0, y: 0 },
        properties: {
          content: "创建新账户",
          fontSize: 24,
          fontWeight: "bold",
          textAlign: "center",
          padding: "1rem",
        },
      },
      {
        id: "signup-form",
        type: "container",
        name: "注册表单",
        parentId: "signup-card",
        position: { x: 0, y: 60 },
        properties: {
          width: "100%",
          padding: "1rem",
        },
        children: [
          "name-input",
          "email-input",
          "new-password-input",
          "confirm-password-input",
          "terms-checkbox",
          "signup-button",
          "login-link",
        ],
      },
      {
        id: "name-input",
        type: "input",
        name: "姓名输入",
        parentId: "signup-form",
        position: { x: 0, y: 0 },
        properties: {
          label: "姓名",
          placeholder: "请输入您的姓名",
          required: true,
          width: "100%",
        },
      },
      {
        id: "email-input",
        type: "input",
        name: "邮箱输入",
        parentId: "signup-form",
        position: { x: 0, y: 80 },
        properties: {
          label: "电子邮箱",
          type: "email",
          placeholder: "请输入您的电子邮箱",
          required: true,
          width: "100%",
        },
      },
      {
        id: "new-password-input",
        type: "input",
        name: "新密码输入",
        parentId: "signup-form",
        position: { x: 0, y: 160 },
        properties: {
          label: "密码",
          type: "password",
          placeholder: "请设置您的密码",
          required: true,
          width: "100%",
          helperText: "密码长度至少为8位，包含字母和数字",
        },
      },
      {
        id: "confirm-password-input",
        type: "input",
        name: "确认密码输入",
        parentId: "signup-form",
        position: { x: 0, y: 250 },
        properties: {
          label: "确认密码",
          type: "password",
          placeholder: "请再次输入您的密码",
          required: true,
          width: "100%",
        },
      },
      {
        id: "terms-checkbox",
        type: "checkbox",
        name: "条款复选框",
        parentId: "signup-form",
        position: { x: 0, y: 330 },
        properties: {
          label: "我已阅读并同意服务条款和隐私政策",
          required: true,
        },
      },
      {
        id: "signup-button",
        type: "button",
        name: "注册按钮",
        parentId: "signup-form",
        position: { x: 0, y: 380 },
        properties: {
          text: "创建账户",
          variant: "default",
          width: "100%",
        },
      },
      {
        id: "login-link",
        type: "text",
        name: "登录链接",
        parentId: "signup-form",
        position: { x: 0, y: 430 },
        properties: {
          content: "已有账户？登录",
          fontSize: 14,
          color: "#3b82f6",
          textAlign: "center",
          padding: "0.5rem",
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
      // 组件数据
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
        children: ["dashboard-header", "stats-grid", "charts-row", "data-table-section"],
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
        children: ["dashboard-title", "dashboard-subtitle"],
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
      {
        id: "dashboard-subtitle",
        type: "text",
        name: "仪表盘副标题",
        parentId: "dashboard-header",
        position: { x: 0, y: 40 },
        properties: {
          content: "查看您的业务表现和关键指标",
          fontSize: 16,
          color: "#6b7280",
        },
      },
      {
        id: "stats-grid",
        type: "grid-layout",
        name: "统计卡片网格",
        parentId: "dashboard-container",
        position: { x: 0, y: 80 },
        properties: {
          width: "100%",
          columns: 4,
          gap: 4,
          marginBottom: "1.5rem",
        },
        children: ["users-card", "active-users-card", "revenue-card", "conversion-card"],
      },
      {
        id: "users-card",
        type: "data-card",
        name: "用户数卡片",
        parentId: "stats-grid",
        position: { x: 0, y: 0 },
        properties: {
          title: "总用户",
          showTrend: true,
          width: "100%",
        },
      },
      {
        id: "active-users-card",
        type: "data-card",
        name: "活跃用户卡片",
        parentId: "stats-grid",
        position: { x: 0, y: 0 },
        properties: {
          title: "活跃用户",
          showTrend: true,
          width: "100%",
        },
      },
      {
        id: "revenue-card",
        type: "data-card",
        name: "收入卡片",
        parentId: "stats-grid",
        position: { x: 0, y: 0 },
        properties: {
          title: "收入",
          showTrend: true,
          width: "100%",
        },
      },
      {
        id: "conversion-card",
        type: "data-card",
        name: "转化率卡片",
        parentId: "stats-grid",
        position: { x: 0, y: 0 },
        properties: {
          title: "转化率",
          showTrend: true,
          width: "100%",
        },
      },
      {
        id: "charts-row",
        type: "grid-layout",
        name: "图表行",
        parentId: "dashboard-container",
        position: { x: 0, y: 200 },
        properties: {
          width: "100%",
          columns: 2,
          gap: 4,
          marginBottom: "1.5rem",
        },
        children: ["sales-chart", "users-chart"],
      },
      {
        id: "sales-chart",
        type: "line-chart",
        name: "销售图表",
        parentId: "charts-row",
        position: { x: 0, y: 0 },
        properties: {
          title: "销售趋势",
          height: 300,
          width: "100%",
        },
        dataSource: "static-1",
      },
      {
        id: "users-chart",
        type: "bar-chart",
        name: "用户图表",
        parentId: "charts-row",
        position: { x: 0, y: 0 },
        properties: {
          title: "用户增长",
          height: 300,
          width: "100%",
        },
        dataSource: "static-1",
      },
      {
        id: "data-table-section",
        type: "container",
        name: "数据表格区域",
        parentId: "dashboard-container",
        position: { x: 0, y: 520 },
        properties: {
          width: "100%",
        },
        children: ["orders-table"],
      },
      {
        id: "orders-table",
        type: "data-table",
        name: "订单表格",
        parentId: "data-table-section",
        position: { x: 0, y: 0 },
        properties: {
          title: "最近订单",
          width: "100%",
          columns: [
            { title: "订单ID", dataIndex: "id", width: 100 },
            { title: "客户", dataIndex: "customer", width: 150 },
            { title: "产品", dataIndex: "product", width: 200 },
            { title: "金额", dataIndex: "amount", width: 100 },
            { title: "状态", dataIndex: "status", width: 100 },
            { title: "日期", dataIndex: "date", width: 120 },
          ],
        },
        dataSource: "static-1",
      },
    ],
  },
  // 更多模板...
  {
    id: "user-management",
    name: "用户管理界面",
    description: "用户管理界面，包含用户列表、搜索和过滤功能。",
    thumbnail: "/user-management-template.png",
    category: "仪表盘",
    tags: ["管理", "用户"],
    components: [
      // 组件数据
      {
        id: "user-management-container",
        type: "container",
        name: "用户管理容器",
        position: { x: 0, y: 0 },
        properties: {
          width: "100%",
          padding: "1.5rem",
          bgColor: "#f9fafb",
        },
        children: ["user-management-header", "user-management-tools", "user-table-section"],
      },
      // 其他组件...
    ],
  },
  {
    id: "data-analysis",
    name: "数据分析界面",
    description: "数据分析界面，包含多种图表和数据可视化组件。",
    thumbnail: "/data-analysis-template.png",
    category: "仪表盘",
    tags: ["数据", "分析", "图表"],
    components: [
      // 组件数据
      {
        id: "data-analysis-container",
        type: "container",
        name: "数据分析容器",
        position: { x: 0, y: 0 },
        properties: {
          width: "100%",
          padding: "1.5rem",
          bgColor: "#f9fafb",
        },
        children: ["data-analysis-header", "data-analysis-filters", "charts-grid"],
      },
      // 其他组件...
    ],
  },
  {
    id: "report-dashboard",
    name: "报表仪表盘",
    description: "报表仪表盘，用于展示业务报告和关键绩效指标。",
    thumbnail: "/report-dashboard-template.png",
    category: "仪表盘",
    tags: ["报表", "KPI", "业务"],
    components: [
      // 组件数据
      {
        id: "report-dashboard-container",
        type: "container",
        name: "报表仪表盘容器",
        position: { x: 0, y: 0 },
        properties: {
          width: "100%",
          padding: "1.5rem",
          bgColor: "#f9fafb",
        },
        children: ["report-header", "kpi-grid", "report-charts", "report-tables"],
      },
      // 其他组件...
    ],
  },
]

// 生成更多模板数据
const generateMoreTemplates = (count: number): Template[] => {
  const result: Template[] = []
  const categories = ["页面", "表单", "仪表盘", "组件", "布局"]
  const tags = ["营销", "产品", "数据", "分析", "用户", "认证", "管理", "报表", "KPI", "业务", "图表"]

  for (let i = 0; i < count; i++) {
    const categoryIndex = i % categories.length
    const tagIndex1 = i % tags.length
    const tagIndex2 = (i + 3) % tags.length

    result.push({
      id: `template-${i + 1}`,
      name: `模板 ${i + 1}`,
      description: `这是模板 ${i + 1} 的描述，属于 ${categories[categoryIndex]} 类别。`,
      thumbnail: i % 2 === 0 ? "/landing-page-template.png" : "/dashboard-template.png",
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
    })
  }

  return result
}

// 合并原始模板和生成的模板
const ALL_TEMPLATES = [...TEMPLATES, ...generateMoreTemplates(50)]

export function TemplateGallery({ onSelectTemplate, theme }: TemplateGalleryProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [activeCategory, setActiveCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [favorites, setFavorites] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [previewTemplateId, setPreviewTemplateId] = useState<string | null>(null)

  // 分页设置
  const itemsPerPage = 8
  const filteredTemplates = ALL_TEMPLATES.filter((template) => {
    // 类别过滤
    if (activeCategory !== "all" && template.category !== activeCategory) {
      return false
    }

    // 标签过滤
    if (selectedTags.length > 0) {
      const templateTags = template.tags || []
      if (!selectedTags.some((tag) => templateTags.includes(tag))) {
        return false
      }
    }

    // 搜索过滤
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        template.name.toLowerCase().includes(query) ||
        template.description.toLowerCase().includes(query) ||
        template.category.toLowerCase().includes(query) ||
        (template.tags || []).some((tag) => tag.toLowerCase().includes(query))
      )
    }

    return true
  })
  const totalPages = Math.ceil(filteredTemplates.length / itemsPerPage)

  // 获取所有可用的标签
  const allTags = Array.from(new Set(ALL_TEMPLATES.flatMap((template) => template.tags || [])))

  // 获取所有可用的类别
  const categories = Array.from(new Set(ALL_TEMPLATES.map((template) => template.category)))

  // 获取当前页的模板

  const paginatedTemplates = filteredTemplates.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // 处理模板选择
  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template)
    setIsOpen(true)
  }

  // 处理使用模板
  const handleUseTemplate = (components: Component[]) => {
    onSelectTemplate(components)
    setIsOpen(false)
  }

  // 处理收藏切换
  const handleToggleFavorite = (templateId: string) => {
    setFavorites((prev) => {
      if (prev.includes(templateId)) {
        return prev.filter((id) => id !== templateId)
      } else {
        return [...prev, templateId]
      }
    })
  }

  // 处理标签选择
  const handleTagSelect = (tag: string) => {
    setSelectedTags((prev) => {
      if (prev.includes(tag)) {
        return prev.filter((t) => t !== tag)
      } else {
        return [...prev, tag]
      }
    })
  }

  // 处理增强预览
  const handleEnhancedPreview = (templateId: string) => {
    setPreviewTemplateId(templateId)
    setIsPreviewOpen(true)
  }

  // 重置过滤器
  const resetFilters = () => {
    setActiveCategory("all")
    setSearchQuery("")
    setSelectedTags([])
    setCurrentPage(1)
  }

  // 当过滤条件改变时，重置页码
  useEffect(() => {
    setCurrentPage(1)
  }, [activeCategory, searchQuery, selectedTags])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          浏览模板库
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>模板库</DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索模板..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-9 w-9"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? "bg-muted" : ""}
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {showFilters && (
          <div className="mb-4 p-4 border rounded-md bg-muted/50">
            <div className="mb-3">
              <h4 className="text-sm font-medium mb-2">类别</h4>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={activeCategory === "all" ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setActiveCategory("all")}
                >
                  全部
                </Badge>
                {categories.map((category) => (
                  <Badge
                    key={category}
                    variant={activeCategory === category ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">标签</h4>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleTagSelect(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="mt-3 flex justify-end">
              <Button variant="ghost" size="sm" onClick={resetFilters}>
                重置过滤器
              </Button>
            </div>
          </div>
        )}

        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">全部模板</TabsTrigger>
            <TabsTrigger value="favorites">我的收藏</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="overflow-auto" style={{ maxHeight: "60vh" }}>
            <VirtualList
              items={filteredTemplates}
              height={500}
              itemHeight={280}
              renderItem={(template, index) => (
                <div className="p-2">
                  <Card className="overflow-hidden h-64">
                    <div className="relative h-40 cursor-pointer" onClick={() => handleSelectTemplate(template)}>
                      <img
                        src={template.thumbnail || "/placeholder.svg"}
                        alt={template.name}
                        className="w-full h-full object-cover"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 bg-background/80 hover:bg-background"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleToggleFavorite(template.id)
                        }}
                      >
                        <Star
                          className={`h-4 w-4 ${
                            favorites.includes(template.id) ? "fill-yellow-400 text-yellow-400" : ""
                          }`}
                        />
                      </Button>
                    </div>
                    <CardContent className="p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium truncate">{template.name}</h3>
                          <p className="text-sm text-muted-foreground truncate">{template.description}</p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => handleEnhancedPreview(template.id)}>
                          预览
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            />

            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-muted-foreground">
                显示 {filteredTemplates.length} 个模板中的{" "}
                {Math.min(currentPage * itemsPerPage, filteredTemplates.length) - (currentPage - 1) * itemsPerPage} 个
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  上一页
                </Button>
                <span className="text-sm">
                  {currentPage} / {Math.max(1, totalPages)}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages || totalPages === 0}
                >
                  下一页
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="favorites" className="overflow-auto" style={{ maxHeight: "60vh" }}>
            {favorites.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>您还没有收藏任何模板</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {ALL_TEMPLATES.filter((template) => favorites.includes(template.id)).map((template) => (
                  <Card key={template.id} className="overflow-hidden">
                    <div className="relative h-40 cursor-pointer" onClick={() => handleSelectTemplate(template)}>
                      <img
                        src={template.thumbnail || "/placeholder.svg"}
                        alt={template.name}
                        className="w-full h-full object-cover"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 bg-background/80 hover:bg-background"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleToggleFavorite(template.id)
                        }}
                      >
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      </Button>
                    </div>
                    <CardContent className="p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium truncate">{template.name}</h3>
                          <p className="text-sm text-muted-foreground truncate">{template.description}</p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => handleEnhancedPreview(template.id)}>
                          预览
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>

      {/* 模板预览对话框 */}
      <TemplatePreview
        template={selectedTemplate}
        isOpen={isOpen && !!selectedTemplate}
        onClose={() => setSelectedTemplate(null)}
        onUse={handleUseTemplate}
        isFavorite={selectedTemplate ? favorites.includes(selectedTemplate.id) : false}
        onToggleFavorite={handleToggleFavorite}
      />

      {/* 增强预览对话框 */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-5xl">
          <DialogHeader>
            <DialogTitle>
              {previewTemplateId
                ? ALL_TEMPLATES.find((t) => t.id === previewTemplateId)?.name || "模板预览"
                : "模板预览"}
            </DialogTitle>
          </DialogHeader>
          {previewTemplateId && (
            <EnhancedTemplatePreview templateId={previewTemplateId} templates={ALL_TEMPLATES} theme={theme} />
          )}
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => {
                const template = ALL_TEMPLATES.find((t) => t.id === previewTemplateId)
                if (template) {
                  handleToggleFavorite(template.id)
                }
              }}
            >
              <Star
                className={`mr-2 h-4 w-4 ${
                  previewTemplateId && favorites.includes(previewTemplateId) ? "fill-yellow-400 text-yellow-400" : ""
                }`}
              />
              {previewTemplateId && favorites.includes(previewTemplateId) ? "取消收藏" : "收藏"}
            </Button>
            <Button
              onClick={() => {
                const template = ALL_TEMPLATES.find((t) => t.id === previewTemplateId)
                if (template) {
                  handleUseTemplate(template.components)
                  setIsPreviewOpen(false)
                }
              }}
            >
              使用此模板
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  )
}
