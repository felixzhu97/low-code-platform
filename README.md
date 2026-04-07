# Low-Code Platform

可视化低代码开发平台，基于 Next.js 和 React 构建，支持拖拽页面搭建、组件管理、主题定制和代码导出。

## ✨ 功能特性

- **🎨 可视化编辑**：拖拽画布、实时预览、组件树视图、属性面板
- **🧩 组件系统**：基于 Radix UI 的内置组件库，支持自定义组件和组件导入导出
- **🤖 AI 生成**：通过自然语言描述生成组件和页面；支持云服务商（OpenAI、Claude、DeepSeek 等）和 **本地 Ollama**（无需 API Key）
- **📊 数据与图表**：数据绑定工具、图表组件（Recharts）、表单构建器
- **🎭 主题与动画**：主题编辑器、动画编辑器、响应式设计、暗色模式
- **🌐 国际化**：多语言支持（中文/英文）、语言切换器
- **🤝 实时协作**：WebSocket 实时同步、冲突解决、协作者光标、历史合并
- **☁️ 云服务集成**：AWS 集成（S3、Lambda、API Gateway 等），一键部署
- **⚡ 性能优化**：性能工具集、优化数据解析和 Schema 处理

## 📸 截图

### 编辑器

<p align="center">
  <img src="./screenshots/platform-editor-overview.png" width="600" alt="平台编辑器概览" />
</p>

## 🛠 技术栈

**前端**：Next.js 15 + React 19 + TypeScript + **Emotion**（`@emotion/react` / `@emotion/styled`） + Radix UI + React DnD + Recharts + Zustand + react-i18next

**后端**：Python + FastAPI（`apps/server`）

**Monorepo**：pnpm 10 workspaces + Vitest/Jest + ESLint/Prettier

## 📦 项目结构

```text
low-code-platform/
├── apps/
│   ├── web/           # Next.js 前端应用（整洁架构）
│   │   └── src/
│   │       ├── domain/              # 领域层：实体、值对象、领域服务
│   │       ├── application/         # 应用层：用例、DTO、端口
│   │       ├── infrastructure/      # 基础设施层：状态、HTTP、持久化
│   │       ├── presentation/        # 表现层：React 组件、受控视图
│   │       └── lib/                 # 内部库（如 ai-generator）
│   └── server/        # FastAPI 后端应用
└── packages/          # Monorepo 共享包
    ├── schema/        # Schema 类型定义与校验
    ├── component-utils/ # 组件树工具函数
    └── utils/         # 通用工具函数
```

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- pnpm >= 10.0.0

### 安装与运行

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev               # 启动前端和后端
pnpm dev:web           # 仅启动前端（http://localhost:3000）
pnpm dev:server        # 仅启动后端（http://localhost:8000）

# 生产构建
pnpm build

# 运行测试
pnpm test              # 前端测试
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

### 本地大模型（Ollama）

使用 **本地模型** 生成页面（无需 API Key）：

1. 安装 [Ollama](https://ollama.com) 并运行 `ollama serve`
2. 拉取模型：`ollama pull codellama`（或 `ollama pull qwen2.5-coder:32b` 等）
3. 在编辑器中打开 **AI 生成** → 选择 **Ollama (本地)** → API Key 留空 → 输入描述并生成

详细说明请参阅 [docs/zh/local-llm-setup.md](docs/zh/local-llm-setup.md)。

## 🎯 使用指南

1. **添加组件**：将组件从左侧组件面板拖拽到画布
2. **配置属性**：在右侧属性面板中修改组件属性
3. **使用模板**：从模板库中选择预构建模板快速开始
4. **AI 生成**：通过自然语言描述生成组件或页面（云服务或本地 Ollama）
5. **导出代码**：将设计转换为可部署的前端代码

## 🔧 架构设计

采用 **整洁架构（Clean Architecture）** 设计：

- **领域层（Domain）**：核心业务逻辑、实体与值对象
- **应用层（Application）**：用例编排、业务流程
- **基础设施层（Infrastructure）**：技术实现（状态管理、持久化、外部接口）
- **表现层（Presentation）**：React 组件、受控视图

### 共享包（`packages/`）

前端与后端共享的数据结构包：

- `@lowcode-platform/schema` — Schema 类型定义（Component、PageSchema 等）
- `@lowcode-platform/component-utils` — 组件树操作工具
- `@lowcode-platform/utils` — 通用工具函数

### 内部库（`apps/web/src/lib/`）

应用特定的代码：

- `ai-generator/` — AI 驱动的组件和页面生成（支持 OpenAI、Claude、DeepSeek、Gemini、Azure OpenAI、Groq、Mistral、Ollama、SiliconFlow）

## 📝 相关文档

- [平台架构总览](docs/zh/platform-architecture.md)
- [TOGAF 架构文档](docs/zh/architecture/togaf/togaf-overview.md)（业务、应用、数据、技术四视图）
- [C4 模型](docs/zh/architecture/c4/c4-context.puml)（系统上下文 → 容器 → 组件 → 代码）
- [本地大模型配置](docs/zh/local-llm-setup.md)
- [English: Architecture Overview](docs/en/architecture.md) · [TOGAF Overview](docs/en/architecture/togaf/togaf-overview.md) · [Local LLM Setup](docs/en/local-llm-setup.md)

## 📄 协议

[MIT License](LICENSE)

## 🔗 相关链接

- [Next.js](https://nextjs.org/docs) | [React](https://react.dev) | [FastAPI](https://fastapi.tiangolo.com/)
- [Emotion](https://emotion.sh/docs/introduction) | [Radix UI](https://www.radix-ui.com)
