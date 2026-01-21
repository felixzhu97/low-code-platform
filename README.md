# 低代码平台 (Low-Code Platform)

一个基于 Next.js 和 React 构建的可视化低代码开发平台，支持拖拽式页面构建、组件管理、主题定制和代码导出等功能。

## ✨ 功能特性

- **🎨 可视化编辑**: 拖拽式画布、实时预览、组件树视图、属性面板
- **🧩 组件系统**: 基于 Radix UI 的内置组件库，支持自定义组件和组件导入导出
- **🤖 AI 生成**: 通过自然语言生成组件和页面，支持 OpenAI、Claude、DeepSeek 等多种 AI 服务
- **📊 数据与图表**: 数据绑定工具、图表组件（Recharts）、表单构建器（React Hook Form + Zod）
- **🎭 主题与动画**: 主题编辑器、动画编辑器、响应式设计、暗色模式
- **🌐 国际化**: 多语言支持（中文/英文）、语言切换组件、本地化工具
- **🤝 实时协作**: WebSocket 实时同步、冲突解决、协同游标、历史合并
- **☁️ 云服务集成**: AWS 集成（S3、Lambda、API Gateway 等）、一键部署
- **⚡ 性能优化**: Rust/WASM 加速（数据解析、Schema 处理、布局计算）、性能工具集、优雅降级

## 🛠 技术栈

**前端**: Next.js 15 + React 19 + TypeScript + Tailwind CSS + Radix UI + React DnD + Recharts + Zustand

**后端**: NestJS 11 + TypeScript + Clean Architecture

**Monorepo**: pnpm 10 workspaces + Vitest/Jest + ESLint/Prettier

**性能优化**: Rust + WebAssembly

## 📦 项目结构

```text
low-code-platform/
├── apps/
│   ├── web/          # Next.js 前端应用（Clean Architecture）
│   └── server/        # NestJS 后端应用
├── packages/          # 共享包
│   ├── ai-generator/  # AI 生成器
│   ├── aws/           # AWS 集成
│   ├── collaboration/ # 协作工具
│   ├── component-utils/ # 组件工具
│   ├── data-binding/  # 数据绑定
│   ├── i18n/          # 国际化
│   ├── layout-utils/  # 布局工具
│   ├── performance/   # 性能优化
│   ├── schema/        # Schema 工具
│   ├── test-utils/    # 测试工具
│   ├── utils/         # 通用工具
│   └── wasm/          # Rust/WASM 模块
└── docs/              # 文档
```

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- pnpm >= 10.0.0
- Rust >= 1.70.0（仅开发 WASM 时需要）

### 安装与运行

```bash
# 安装依赖
pnpm install

# 构建 WASM 模块（首次运行或 WASM 代码更新后）
pnpm build:wasm

# 启动开发服务器
pnpm dev              # 同时启动前端和后端
pnpm dev:web          # 仅前端 (http://localhost:3000)
pnpm dev:server       # 仅后端 (http://localhost:8000)

# 构建生产版本
pnpm build

# 运行测试
pnpm test             # 前端测试
pnpm test:server       # 后端测试
```

### 环境变量

创建 `.env.local` 文件（可选）：

```env
# AI 服务
OPENAI_API_KEY=your_key
ANTHROPIC_API_KEY=your_key
DEEPSEEK_API_KEY=your_key

# AWS
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_key
AWS_REGION=us-east-1
```

## 🎯 使用指南

1. **添加组件**: 从左侧组件面板拖拽组件到画布
2. **配置属性**: 在右侧属性面板修改组件属性
3. **使用模板**: 从模板库选择预制模板快速开始
4. **AI 生成**: 通过自然语言描述生成组件或页面
5. **导出代码**: 将设计转换为可部署的前端代码

## 🔧 开发

### 架构

采用**整洁架构（Clean Architecture）**设计：

- **领域层**: 核心业务逻辑
- **应用层**: 应用用例和业务流程
- **基础设施层**: 技术实现（WASM 适配器等）
- **表现层**: UI 组件和用户交互

WASM 模块采用 **Port-Adapter 模式**，确保优雅降级和类型安全。

### 共享包

- `@lowcode-platform/ai-generator` - AI 生成
- `@lowcode-platform/collaboration` - 实时协作
- `@lowcode-platform/aws` - AWS 集成
- `@lowcode-platform/data-binding` - 数据绑定
- `@lowcode-platform/i18n` - 国际化
- `@lowcode-platform/layout-utils` - 布局工具
- `@lowcode-platform/performance` - 性能优化
- `@lowcode-platform/schema` - Schema 工具
- `@lowcode-platform/component-utils` - 组件工具
- `@lowcode-platform/wasm` - WASM 模块
- `@lowcode-platform/utils` - 通用工具
- `@lowcode-platform/test-utils` - 测试工具

### WASM 开发

```bash
# 安装 Rust 和 wasm-pack
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh
rustup target add wasm32-unknown-unknown

# 开发流程
# 1. 修改 packages/wasm/src/ 下的 Rust 代码
# 2. 运行 pnpm build:wasm 编译
# 3. 在浏览器中测试
```

## 📝 待办事项

**进行中**: 完善后端 API、增加图表类型、添加页面模板

**计划中**: 数据库连接、移动端组件库、自定义 CSS、项目管理和版本控制、WASM 优化

## 🤝 贡献

欢迎提交 Issue 和 Pull Request。

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

**代码规范**: TypeScript + ESLint/Prettier + 单元测试 + 整洁架构原则

**提交规范**: 遵循 [Conventional Commits](https://www.conventionalcommits.org/)

## 📄 许可证

[MIT License](LICENSE)

## 🔗 相关链接

- [Next.js](https://nextjs.org/docs) | [React](https://react.dev) | [NestJS](https://docs.nestjs.com)
- [Tailwind CSS](https://tailwindcss.com) | [Radix UI](https://www.radix-ui.com)
- [Rust](https://www.rust-lang.org/learn) | [WebAssembly](https://webassembly.org/)
- [架构文档](docs/architecture/README.md) | [产品文档](docs/product/) | [项目文档](docs/project/)
