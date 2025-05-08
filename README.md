# 低代码平台项目

基于 Next.js 和 React 19 构建的现代化低代码平台，提供拖拽式 UI 构建、主题定制和实时协作功能。

## ✨ 功能特性

- 🏗️ 拖拽式组件构建器
- 🎨 带颜色选择器的主题编辑器
- ✨ 交互式组件动画编辑器
- 🤝 实时协作功能
- 📱 响应式设计控制
- 📦 快速开始的模板库
- 📊 使用 Recharts 的数据可视化
- 🎭 基于 Radix UI 的组件库

## 🛠️ 技术栈

- **框架**: Next.js 15.2
- **UI 组件**: Radix UI + Tailwind CSS
- **状态管理**: React 19
- **表单处理**: react-hook-form + Zod 验证
- **样式系统**: Tailwind CSS + tailwind-merge + tailwindcss-animate
- **工具库**: date-fns, clsx, class-variance-authority
- **组件**: 50+预制组件

## 🚀 快速开始

1. 安装依赖:

```bash
pnpm install
```

2. 启动开发服务器:

```bash
pnpm dev
```

3. 在浏览器中打开 [http://localhost:3000](http://localhost:3000)

## 📂 项目结构

```
.
├── app/               # Next.js应用路由
├── components/        # UI组件
│   ├── ui/            # Radix基础组件
│   ├── form-builder/  # 拖拽表单构建器
│   ├── theme-editor/  # 主题定制
│   └── ...            # 其他功能组件
├── hooks/             # 自定义Hook
├── lib/               # 工具函数和类型
├── public/            # 静态资源
└── styles/            # 全局样式
```

## ⚙️ 配置说明

- 构建时忽略 ESLint 和 TypeScript 错误
- 禁用图片优化(参见`next.config.mjs`)

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/新特性`)
3. 提交更改 (`git commit -m '添加新特性'`)
4. 推送分支 (`git push origin feature/新特性`)
5. 提交 Pull Request

## 📄 许可证

MIT
