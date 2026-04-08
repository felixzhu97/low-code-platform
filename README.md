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

## 🎯 使用指南

1. **添加组件**：将组件从左侧组件面板拖拽到画布
2. **配置属性**：在右侧属性面板中修改组件属性
3. **使用模板**：从模板库中选择预构建模板快速开始
4. **AI 生成**：通过自然语言描述生成组件或页面（云服务或本地 Ollama）
5. **导出代码**：将设计转换为可部署的前端代码

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
│   │       ├── domain/              # 领域层：实体、仓储接口、值对象、领域服务
│   │       │   ├── component/       # 组件领域：实体、工厂、仓储接口
│   │       │   ├── template/        # 模板领域：实体、仓储接口
│   │       │   ├── datasource/      # 数据源领域：数据源、映射实体
│   │       │   ├── theme/           # 主题领域：主题配置实体
│   │       │   ├── chart/           # 图表领域：图表、表格、树配置
│   │       │   ├── shared/          # 共享：错误类型
│   │       │   ├── value-objects/   # 值对象：位置等
│   │       │   ├── repositories/    # 统一导出仓储接口
│   │       │   └── entities/        # 共享类型定义
│   │       ├── application/         # 应用层：用例、端口、应用服务
│   │       │   ├── use-cases/       # 用例：组件CRUD、模板应用、画布更新
│   │       │   ├── ports/           # 端口接口：仓储、状态管理抽象
│   │       │   └── services/        # 应用服务：组件、数据源、JSON工具、历史
│   │       ├── infrastructure/      # 基础设施层：Zustand状态、持久化、适配器
│   │       │   ├── state-management/  # Zustand stores：component、canvas、theme、data、ui、history、custom-components
│   │       │   └── persistence/       # 仓储实现：component、template、data-source
│   │       ├── presentation/        # 表现层：React组件、Hook、适配器
│   │       │   ├── components/      # 组件：canvas、ui、templates、charts、data-binding、ai
│   │       │   │   ├── canvas/      # 画布：主画布、组件树、预览、属性面板、组件渲染器（basic/form/layout/data）
│   │       │   │   ├── ui/          # UI组件：70+ shadcn/ui风格组件
│   │       │   │   ├── templates/   # 模板：gallery、preview、card、filters
│   │       │   │   ├── charts/      # 图表：bar、line、pie、area、radar
│   │       │   │   └── data-binding/ # 数据绑定：selector、mapping-editor、bound-data-editor
│   │       │   ├── hooks/          # Hook：use-template-gallery
│   │       │   ├── adapters/        # 适配器：template、ai-generator
│   │       │   └── data/           # 模板数据（按类别分文件）
│   │       │       └── templates/   # dashboard、user-management、analytics、settings、billing、onboarding、notifications、profile、team、api
│   │       └── lib/                 # 内部库
│   │           └── ai-generator/    # AI生成器：多模型客户端（OpenAI/Claude/DeepSeek/Gemini/Ollama等）、生成器、验证器、解析器、提示构建器
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

## 🔧 架构设计

采用 **整洁架构（Clean Architecture）** 设计，各层职责清晰、依赖单向：

- **领域层（Domain）**：核心业务实体（Component、Template、DataSource、ThemeConfig 等）、仓储接口、值对象、领域服务（如 ComponentFactoryService）
- **应用层（Application）**：用例编排（组件 CRUD、模板应用、画布更新）、端口接口（抽象仓储与状态管理）、应用服务（组件管理、数据绑定、JSON 工具、历史记录）
- **基础设施层（Infrastructure）**：Zustand stores（component/canvas/theme/data/ui/history/custom-components）、仓储实现（LocalStorage/Zustand）、适配器
- **表现层（Presentation）**：React 组件（canvas、ui、templates、charts、data-binding）、Hook（use-template-gallery）、适配器、模板数据（按类别分文件）
- **内部库（`lib/`）**：`ai-generator/` — 多模型客户端工厂、组件/页面生成器、验证器、JSON 解析器、提示构建器

### 共享包（`packages/`）

前端与后端共享的数据结构包：

- `@lowcode-platform/schema` — Schema 类型定义（Component、PageSchema 等）
- `@lowcode-platform/component-utils` — 组件树操作工具函数
- `@lowcode-platform/utils` — 通用工具函数

### 内部库（`apps/web/src/lib/`）

应用特定的代码：

- `ai-generator/` — AI 驱动的组件和页面生成（支持 OpenAI、Claude、DeepSeek、Gemini、Azure OpenAI、Groq、Mistral、Ollama、SiliconFlow），包含客户端工厂、生成器、验证器、JSON 解析器（含 `flattenPageComponents` 嵌套展平）、提示构建器

## 📝 相关文档

- [平台架构总览](docs/zh/platform-architecture.md)
- [TOGAF 架构文档](docs/zh/architecture/togaf/togaf-overview.md)（业务、应用、数据、技术四视图）
- [C4 模型](docs/zh/architecture/c4/)（系统上下文 → 容器 → 组件 → 代码 → 部署 → 整洁架构）
- [本地大模型配置](docs/zh/local-llm-setup.md)
- [English: Architecture Overview](docs/en/architecture.md) · [TOGAF Overview](docs/en/architecture/togaf/togaf-overview.md) · [Local LLM Setup](docs/en/local-llm-setup.md)

## 📄 协议

[MIT License](LICENSE)

## 🔗 相关链接

- [Next.js](https://nextjs.org/docs) | [React](https://react.dev) | [FastAPI](https://fastapi.tiangolo.com/)
- [Emotion](https://emotion.sh/docs/introduction) | [Radix UI](https://www.radix-ui.com)
