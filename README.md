# 低代码平台 (Low-Code Platform)

一个基于 Next.js 和 React 构建的可视化低代码开发平台，支持拖拽式页面构建、组件管理、主题定制和代码导出等功能。

## ✨ 功能特性

### 🎨 可视化编辑

- **拖拽式画布**: 直观的拖拽操作，快速构建页面布局
- **实时预览**: 即时查看设计效果，支持响应式预览
- **组件树视图**: 层级化管理页面组件结构
- **属性面板**: 丰富的属性配置选项

### 🧩 组件系统

- **内置组件库**: 包含按钮、表单、图表等常用组件
- **自定义组件**: 支持创建和管理自定义组件
- **组件分组**: 灵活的组件分类和组织管理
- **组件导入导出**: 跨项目共享组件资源

### 📊 数据与图表

- **数据面板**: 统一管理数据源和数据绑定
- **图表组件**: 支持柱状图、折线图、饼图等多种图表类型
- **表单构建器**: 快速创建表单和数据收集页面

### 🎭 主题与动画

- **主题编辑器**: 可视化定制界面主题和样式
- **动画编辑器**: 为组件添加动画效果
- **响应式设计**: 适配不同屏幕尺寸

### 🚀 协作与导出

- **实时协作**: 多人协同编辑功能
- **代码导出**: 导出为可部署的前端代码
- **模板库**: 预置页面模板，快速开始项目

## 🛠 技术栈

- **框架**: Next.js 15.2.4 + React 19
- **语言**: TypeScript
- **样式**: Tailwind CSS + CSS 变量主题系统
- **UI 组件库**: Radix UI
- **拖拽**: React DnD
- **图表**: Recharts
- **表单**: React Hook Form + Zod 验证
- **状态管理**: React Hooks + 历史记录系统
- **构建工具**: Next.js 构建系统

## 📦 项目结构

```
├── app/                    # Next.js App Router
│   ├── page.tsx           # 主页面 - 低代码编辑器
│   ├── layout.tsx         # 根布局
│   └── globals.css        # 全局样式
├── components/            # 组件目录
│   ├── ui/               # 基础UI组件库
│   ├── charts/           # 图表组件
│   ├── templates/        # 页面模板
│   ├── canvas.tsx        # 主画布组件
│   ├── component-panel.tsx    # 组件面板
│   ├── properties-panel.tsx   # 属性配置面板
│   ├── template-gallery.tsx   # 模板库
│   ├── theme-editor.tsx       # 主题编辑器
│   ├── form-builder.tsx       # 表单构建器
│   ├── code-export.tsx        # 代码导出
│   └── ...               # 其他功能组件
├── lib/                  # 工具库
│   ├── types.ts          # TypeScript类型定义
│   ├── utils.ts          # 工具函数
│   └── history.ts        # 历史记录管理
├── hooks/                # 自定义Hooks
├── styles/               # 样式文件
├── public/               # 静态资源
└── src/                  # 业务逻辑
    ├── domains/          # 领域模型
    └── shared/           # 共享模块
```

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm/yarn/pnpm

### 安装依赖

```bash
# 使用 npm
npm install

# 或使用 yarn
yarn install

# 或使用 pnpm
pnpm install
```

### 启动开发服务器

```bash
# 使用 npm
npm run dev

# 或使用 yarn
yarn dev

# 或使用 pnpm
pnpm dev
```

### 构建生产版本

```bash
# 构建
npm run build

# 启动生产服务器
npm run start
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 🎯 使用指南

### 1. 基础操作

1. **添加组件**: 从左侧组件面板拖拽组件到画布
2. **选择组件**: 点击画布中的组件进行选择
3. **配置属性**: 在右侧属性面板修改组件属性
4. **预览效果**: 点击预览按钮查看最终效果

### 2. 高级功能

- **使用模板**: 从模板库选择预制模板快速开始
- **自定义主题**: 通过主题编辑器定制界面风格
- **添加动画**: 使用动画编辑器为组件添加动效
- **数据绑定**: 在数据面板管理数据源和绑定关系
- **导出代码**: 将设计转换为可部署的前端代码

### 3. 协作开发

- 支持多人实时协作编辑
- 版本历史记录和回滚功能
- 组件库共享和管理

## 🔧 开发

### 添加新组件

1. 在 `components/ui/` 目录下创建新组件
2. 在 `components/component-panel.tsx` 中注册组件
3. 在 `lib/types.ts` 中定义相关类型

### 自定义主题

主题配置在 `lib/types.ts` 的 `ThemeConfig` 接口中定义，可以通过主题编辑器进行可视化配置。

### 扩展功能

- **数据源**: 在 `components/data-panel.tsx` 中添加新的数据连接方式
- **图表类型**: 在 `components/charts/` 目录下添加新的图表组件
- **导出格式**: 在 `components/code-export.tsx` 中添加新的导出格式

## 📝 待办事项

- [ ] 增加更多图表类型支持
- [ ] 实现数据库连接功能
- [ ] 添加移动端组件库
- [ ] 支持自定义 CSS 样式编辑
- [ ] 实现项目管理和版本控制
- [ ] 添加更多页面模板

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进项目。

## 📄 许可证

[MIT License](LICENSE)

## 🔗 相关链接

- [Next.js 文档](https://nextjs.org/docs)
- [React 文档](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Radix UI](https://www.radix-ui.com)
