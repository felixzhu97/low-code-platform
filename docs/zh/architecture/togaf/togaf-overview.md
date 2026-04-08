# TOGAF 企业架构文档

**English summary:** [TOGAF (English)](../../../en/architecture/togaf/togaf-overview.md)

本目录包含 Felix 低代码平台的 TOGAF (The Open Group Architecture Framework) 企业架构文档，使用 PlantUML 格式编写，涵盖业务架构、应用架构、数据架构和技术架构四个核心视图。

## 概述

TOGAF 是一个企业架构框架，提供了完整的架构开发方法。本项目的 TOGAF 架构文档从四个维度全面描述了低代码平台的架构设计：

- **业务架构（Business Architecture）**：描述业务角色、业务流程、业务能力和价值流
- **应用架构（Application Architecture）**：描述应用系统、应用组件及其交互关系，采用整洁架构设计
- **数据架构（Data Architecture）**：描述数据实体、数据流和数据存储
- **技术架构（Technology Architecture）**：描述技术栈、基础设施和部署架构

## 文件清单

### 1. business-architecture.puml - 业务架构图

业务架构图描述了平台的业务层面设计，包括：

- **业务角色**：页面设计师、开发者、管理员、终端用户
- **核心业���流程**：页面设计与构建、模板管理（浏览/分类/搜索/预览/应用）、协作编辑、代码导出、Schema 管理（导入/导出）、数据管理、国际化配置、用户认证、AI 生成
- **业务能力**：可视化编辑、组件管理、数据绑定、协作、代码生成、Schema 管理、模板管理（含分类浏览与筛选搜索）、国际化、认证、图表可视化、AI 生成
- **价值流**：从需求识别到部署交付的完整价值流

### 2. application-architecture.puml - 应用架构图

应用架构图描述了平台的应用系统结构和组件交互，采用整洁架构（Clean Architecture）设计：

- **表现层（Presentation Layer）**：

  - 编辑器外壳、组件面板、属性面板、模板库（TemplateGallery）、模板预览（TemplatePreview）、数据面板、数据源选择器、JSON数据输入
  - **组件渲染器**：基础（BasicRenderer）、布局（LayoutRenderer）、表单（FormRenderer）、数据（DataRenderer）、图表（ChartRenderer）渲染器
  - **AI 对话与生成**：AIChat 组件、AIGenerator UI、主题编辑器、表单构建器
  - Hook 层（use-template-gallery）、表现层适配器（template.adapter、ai-generator.adapter）

- **应用层（Application Layer）**：

  - 组件管理服务、数据绑定服务、数据源服务、JSON工具服务、画布管理服务、历史记录服务、Schema管理服务
  - AI生成器适配器（AIGeneratorAdapter）
  - 应用模板用例（ApplyTemplateUseCase）、创建组件用例、更新组件用例、删除组件用例、更新画布状态用例
  - 模板管理服务

- **领域层（Domain Layer）**：

  - Component、Template、Project、DataSource、DataMapping、ThemeConfig、ChartConfig 实体
  - ComponentFactoryService 组件工厂服务
  - 仓储接口：ComponentRepository、TemplateRepository、DataSourceRepository

- **基础设施层（Infrastructure Layer）**：

  - Zustand 状态管理（CanvasStore、ComponentStore、DataStore、HistoryStore、ThemeStore、UIStore、CustomComponentsStore）
  - 持久化（ComponentRepositoryImpl、TemplateRepositoryImpl、DataSourceRepositoryImpl、LocalStorageAdapter）
  - **AI 生成器内部库**（`lib/ai-generator`）：
    - AIClientFactory 客户端工厂
    - AI 客户端：OpenAI / Claude / DeepSeek / Gemini / Ollama / Groq / Mistral / SiliconFlow / Azure OpenAI
    - ComponentGenerator 组件生成器、PageGenerator 页面生成器
    - JSONParser（含 `flattenPageComponents()` 将嵌套 children 展平为扁平列表）
    - ComponentPromptBuilder / PagePromptBuilder 提示构建器
    - ComponentValidator / PageValidator 验证器

### 3. data-architecture.puml - 数据架构图

数据架构图描述了平台的数据模型、数据流和数据存储：

- **核心数据实体**：Component（`children: string[]` + `parentId`）、Template（含 `category`、`tags`、`description`）、Project、DataSource、DataMapping、ThemeConfig、HistoryRecord、PageSchema、ChartConfig
- **数据存储**：LocalStorage（浏览器本地，模板数据在 `presentation/data/templates/`）、PostgreSQL（按部署）、Redis（按部署）、对象存储（按部署）
- **关键数据流**：

  - **AI 生成组件数据流**：用户输入 → AI 返回嵌套 JSON → `JSONParser.flattenPageComponents()` 展平 → ApplyTemplateUseCase 应用 → Zustand stores 更新 → 画布渲染
  - **Schema 导入数据流**：上传 JSON → 解析 → 展平嵌套 children → 渲染到画布
  - **模板应用数据流**（`appendTemplateFromComponents`）：浏览模板库 → 选择模板 → ApplyTemplateUseCase → ComponentFactory 创建组件 → 批量添加 → 画布渲染
  - 数据绑定、组件编辑、协作同步等数据流

- **关键设计**：Component 采用**扁平 `components` 数组 + `parentId`** 父子关联；AI 生成的嵌套 `children`（含完整对象）在 `JSONParser.flattenPageComponents()` 中被展平为扁平列表，确保 Zustand stores 正确渲染。

### 4. technology-architecture.puml - 技术架构图

技术架构图描述了平台的技术栈、基础设施和部署架构：

- **前端技术栈**：Next.js 15 + React 19 + TypeScript + Emotion + Radix UI + React DnD + Recharts + Zustand + react-i18next
- **AI 生成器内部库**（`lib/ai-generator`）：多模型客户端工厂、带重试和超时的 BaseAIClient、JSON 解析器、组件/页面生成器、验证器、提示构建器
- **后端技术栈**：FastAPI + Python 3 + Uvicorn + Pydantic（按部署启用）
- **开发模式**：前端独立运行，无需后端；AI 直连浏览器（Ollama localhost 或云 API）；Zustand 状态存 LocalStorage；模板数据本地加载（`presentation/data/templates/`）
- **数据存储**：LocalStorage、PostgreSQL、Redis、对象存储（按部署选择）

## 使用方法

### 查看图表

PlantUML 文件可使用以下工具渲染：

- **在线工具**：[PlantUML Online](http://www.plantuml.com/plantuml/)
- **VS Code 插件**：PlantUML
- **命令行工具**：PlantUML CLI

### 命令行生成图片

```bash
plantuml -tpng docs/zh/architecture/togaf/business-architecture.puml
plantuml -tpng docs/zh/architecture/togaf/application-architecture.puml
plantuml -tpng docs/zh/architecture/togaf/data-architecture.puml
plantuml -tpng docs/zh/architecture/togaf/technology-architecture.puml
```

## 架构视图之间的关系

TOGAF 的四个架构视图相互关联：

1. **业务架构**定义了"做什么"，为其他架构提供业务目标和需求
2. **应用架构**将业务能力转化为应用系统功能
3. **数据架构**定义了"数据如何组织和流转"
4. **技术架构**提供了技术基础设施

## 与 C4 模型的关系

- **C4 模型**（位于 `docs/zh/architecture/c4/`）：从系统上下文到代码级别的层次化视图
- **TOGAF 框架**（本目录）：企业级架构视图，涵盖业务、应用、数据和技术四个维度

## 最新更新

### 2026-04-08：文档与架构同步更新

- **README.md**：更新项目结构，精确描述 domain（component/template/datasource/theme/chart/shared/value-objects/repositories/entities）、application（use-cases/ports/services）、infrastructure（state-management/persistence）、presentation（components/hooks/adapters/data）、lib（ai-generator）
- **C4 图表**：更新 c4-component（新增 UI组件库、模板库、图表组件、数据绑定、Hook层）、c4-container（补充前端独立运行说明）、c4-context（区分云端与本地大模型）、c4-clean-architecture（详细注释各层职责）
- **TOGAF 图表**：全面更新业务架构（模板管理细分为浏览/分类/搜索/预览/应用）、应用架构（新增用例、应用层端口）、数据架构（新增模板应用数据流）、技术架构（补充模板数据本地加载说明）

### 2026-04-07：AI 生成嵌套组件展平修复

- **问题**：AI（大模型如 Ollama qwen3-coder）返回嵌套 JSON���`children` 含完整子组件对象），展平逻辑缺失导致子组件未入库，只显示根节点
- **修复**：新增 `JSONParser.flattenPageComponents()` 方法，将嵌套 `children` 展平为扁平 `components` 数组 + `parentId` 关联；`PageGenerator.generate()` 和 `ComponentGenerator.generate()` 均调用该方法
- **Ollama 超时优化**：`OllamaClient` 默认超时从 30s 提升至 10 分钟
- **文件更改**：`json-parser.ts`、`page-generator.ts`、`component-generator.ts`、`generator.ts`、适配器与 Hook 层

### 2026-01：AI 生成器集成

- 支持 OpenAI、Claude、DeepSeek、Gemini、Azure OpenAI、Groq、Mistral、Ollama、SiliconFlow 等多 AI 提供商
- 组件和页面生成、自动验证、流式响应
- AI 对话组件（AIChat）与生成器 UI（AIGenerator）分离

## 相关文档

- [主架构文档](../../platform-architecture.md)
- [C4（中文目录）](../c4/) · [C4（English）](../../../en/architecture/c4/)

## 参考资料

- [TOGAF 官网](https://www.opengroup.org/togaf)
- [PlantUML 文档](https://plantuml.com/)
- [C4 模型](https://c4model.com/)
