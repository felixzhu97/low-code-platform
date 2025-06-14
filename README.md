# 低代码平台 (Low-Code Platform)

基于 Next.js 和 React 构建的可视化低代码开发平台，支持拖拽式页面构建和组件管理。

## ✨ 核心特性

- 🎨 **可视化编辑**: 拖拽式画布，实时预览，组件树视图
- 🧩 **组件系统**: 内置组件库，支持自定义组件
- 📊 **数据管理**: 统一数据源管理，支持多种图表类型
- 🎭 **主题定制**: 可视化主题编辑器，支持响应式设计
- 🚀 **代码导出**: 导出为可部署的前端代码

## 🛠 技术栈

- **前端**: Next.js 15.2.4 + React 19 + TypeScript
- **样式**: Tailwind CSS + Radix UI
- **功能**: React DnD + Recharts + React Hook Form

## 📦 项目结构

```
├── src/                      # 源代码目录
│   ├── app/                  # 应用层
│   ├── domain/               # 领域层
│   ├── application/          # 应用逻辑层
│   ├── infrastructure/       # 基础设施层
│   └── presentation/         # 表现层
├── public/                   # 静态资源
│   ├── *.png                 # 模板预览图
│   └── placeholder.*         # 占位图片
├── docs/                     # 项目文档
│   ├── architecture/         # 架构文档
│   ├── development/          # 开发文档
│   ├── project/              # 项目管理
│   ├── TODOS/                # 待办事项
│   └── QA/                   # 质量保证
├── .github/                  # GitHub 配置
├── components.json           # 组件配置
├── next.config.mjs           # Next.js 配置
├── tailwind.config.ts        # Tailwind 配置
├── tsconfig.json             # TypeScript 配置
└── package.json              # 项目依赖
```

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0

### 安装和运行

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 🎯 基本使用

1. **添加组件**: 从左侧组件面板拖拽组件到画布
2. **配置属性**: 在右侧属性面板修改组件属性
3. **预览导出**: 点击预览按钮查看效果，支持代码导出

## 🤝 贡献

欢迎提交 Issue 和 Pull Request。

## 📄 许可证

[MIT License](LICENSE)

## 🔗 相关链接

- [Next.js 文档](https://nextjs.org/docs)
- [React 文档](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Radix UI](https://www.radix-ui.com)
