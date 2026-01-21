# TOGAF 企业架构文档

本目录包含 Felix 低代码平台的 TOGAF (The Open Group Architecture Framework) 企业架构文档，使用 PlantUML 格式编写，涵盖业务架构、应用架构、数据架构和技术架构四个核心视图。

## 概述

TOGAF 是一个企业架构框架，提供了完整的架构开发方法。本项目的 TOGAF 架构文档从四个维度全面描述了低代码平台的架构设计：

- **业务架构（Business Architecture）**：描述业务角色、业务流程、业务能力和价值流
- **应用架构（Application Architecture）**：描述应用系统、应用组件及其交互关系
- **数据架构（Data Architecture）**：描述数据实体、数据流和数据存储
- **技术架构（Technology Architecture）**：描述技术栈、基础设施和部署架构

## 文件清单

### 1. business-architecture.puml - 业务架构图

业务架构图描述了平台的业务层面设计，包括：

- **业务角色**：

  - 页面设计师（Page Designer）
  - 开发者（Developer）
  - 管理员（Administrator）
  - 终端用户（End User）

- **核心业务流程**：

  - 页面设计与构建流程
  - 模板管理流程
  - 协作编辑流程
  - 代码导出流程
  - Schema 导出流程（生成 Schema JSON、验证格式、下载文件）
  - Schema 导入流程（上传文件、验证版本、迁移旧版本、渲染到画布）
  - 数据管理流程（创建数据源、配置数据连接、测试连接、创建映射、绑定组件、实时更新、监控状态）
  - JSON 快速输入流程（选择组件类型、系统推荐模板、输入或编辑 JSON、验证格式、创建临时数据源、自动渲染到组件）
  - 国际化配置流程（检测浏览器语言、选择界面语言、加载语言资源、应用语言设置、保存语言偏好）
  - 用户认证流程（用户登录、验证身份凭证、生成访问令牌、建立会话、授权访问、用户登出）
  - AI 生成流程（用户输入自然语言描述、选择 AI 提供商、配置 API Key、选择生成类型、AI 生成组件或页面、验证生成结果、应用到画布、预览和调整）

  - **业务能力**：

  - 可视化编辑能力
  - 组件管理能力
  - 数据绑定能力（数据源管理、数据映射、实时数据更新、数据验证、JSON 快速输入、模板推荐、智能渲染、数据结构解析）
  - 协作能力
  - 代码生成能力
  - 模板管理能力
  - Schema 管理能力（Schema 导出、导入、渲染、验证、版本管理）
  - 国际化能力（多语言支持、语言切换、本地化内容管理、日期数字格式化）
  - 认证能力（用户认证、权限管理、会话管理、单点登录）
  - 图表可视化能力（多种图表类型支持、数据可视化、图表配置、实时数据更新）
  - AI 生成能力（自然语言生成、组件 AI 生成、页面 AI 生成、多 AI 提供商支持、生成结果验证、流式生成）

- **价值流**：
  从需求识别到部署交付的完整价值流，包括需求分析、页面设计、数据绑定、效果验证、团队协作、代码导出和部署上线等环节

### 2. application-architecture.puml - 应用架构图

应用架构图描述了平台的应用系统结构和组件交互，采用整洁架构（Clean Architecture）设计：

- **表现层（Presentation Layer）**：

  - 可视化编辑器（Visual Editor）
  - 组件面板（Component Panel）
  - 属性面板（Property Panel）
  - 模板库（Template Library）
  - 数据面板（Data Panel）
  - 数据源选择器（DataSource Selector）
  - JSON 数据输入组件（JSON Data Input）
  - **组件渲染器（Component Renderers）**：
    - 基础组件渲染器（Basic Component Renderer）
    - 图表组件渲染器（Chart Component Renderer）
    - 数据组件渲染器（Data Component Renderer）
    - 表单组件渲染器（Form Component Renderer）
    - 布局组件渲染器（Layout Component Renderer）
  - 认证组件（Auth Components）
  - 项目组件（Projects Components）
  - 表单构建器（Form Builder）
  - AI 生成器组件（AI Generator）

- **应用层（Application Layer）**：

  - 组件管理服务（Component Management Service）
  - 模板管理服务（Template Management Service）
  - 数据绑定服务（Data Binding Service）
  - 数据源服务（DataSource Service）
  - 数据源结构服务（DataSource Structure Service）
  - JSON 工具服务（JSON Helper Service）
  - 画布管理服务（Canvas Management Service）
  - 历史记录服务（History Service）
  - Schema 管理服务（Schema Management Service）
  - 模板命令服务（Template Command Service）
  - AI 生成器适配器（AI Generator Adapter）

- **领域层（Domain Layer）**：

  - 组件实体（Component Entity）
  - 模板实体（Template Entity）
  - 项目实体（Project Entity）
  - 数据源实体（DataSource Entity）
  - 组件工厂（Component Factory）

- **基础设施层（Infrastructure Layer）**：
  - 组件仓储（Component Repository）
  - 模板仓储（Template Repository）
  - 数据源仓储（DataSource Repository）
  - **状态管理（State Management）**：
    - 画布状态（Canvas Store）
    - 组件状态（Component Store）
    - 数据状态（Data Store）
    - 历史状态（History Store）
    - 主题状态（Theme Store）
    - UI 状态（UI Store）
  - **持久化层（Persistence Layer）**：
    - 本地存储适配器（Local Storage Adapter）：浏览器本地存储
    - 数据库适配器（Database Adapter）：数据库持久化
  - 协作服务（Collaboration Service）
  - Schema 导出服务（Schema Export Service）
  - Schema 导入服务（Schema Import Service）
  - Schema 渲染器（Schema Renderer）
  - 持久化管理器（Persistence Manager）
  - **WASM 适配器（WASM Adapter）**：
    - 数据解析适配器（Data Parser Adapter）：CSV/XML 解析、JSON 验证
    - Schema 处理适配器（Schema Processor Adapter）：序列化/反序列化、验证、迁移
    - 数据映射适配器（Data Mapper Adapter）：映射生成、应用、数据转换
    - 布局计算适配器（Layout Calculator Adapter）：布局计算、网格对齐、碰撞检测
  - **AI 生成器包（AI Generator Package）**：
    - AI 客户端（AI Clients）：OpenAI Client、Claude Client、DeepSeek Client
    - 组件生成器（Component Generator）：将 AI 响应转换为 Component 实体
    - 页面生成器（Page Generator）：将 AI 响应转换为 PageSchema
    - 组件验证器（Component Validator）：验证生成的组件结构
    - 页面验证器（Page Validator）：验证生成的页面结构
    - 提示构建器（Prompt Builders）：构建 AI 提示词
    - JSON 解析器（JSON Parser）：解析 AI 返回的 JSON 响应

### 3. data-architecture.puml - 数据架构图

数据架构图描述了平台的数据模型、数据流和数据存储：

- **核心数据实体**：

  - Component（组件，包含 dataSource 和 dataMapping 属性）
  - Template（模板）
  - Project（项目）
  - DataSource（数据源，包含 id、name、type、config、data、status、errorMessage、lastUpdated）
  - DataMapping（数据映射，包含 id、componentId、dataSourceId、field、sourcePath、targetPath、transform、defaultValue）
  - JsonDataTemplate（JSON 数据模板，包含 id、name、description、data、componentTypes、preview）
  - User（用户）
  - ThemeConfig（主题配置）
  - HistoryRecord（历史记录）
  - PageSchema（页面 Schema，包含版本、元数据、组件、画布配置、主题、数据源等）
  - **ChartConfig（图表配置实体）**：包含 type、xField、yField、seriesField、colorField、annotations
  - **TableColumn（表格列实体）**：包含 key、title、dataIndex、width、render
  - **PaginationConfig（分页配置实体）**：包含 current、pageSize、total、showTotal
  - **TreeNode（树节点实体）**：包含 id、title、children、icon、expanded、selected、disabled

- **数据存储**：

  - **PostgreSQL**：关系型数据库，存储结构化数据

    - components 表：组件数据
    - projects 表：项目数据
    - templates 表：模板数据
    - data_sources 表：数据源配置（包含静态数据、API 配置、数据库连接等）
    - data_mappings 表：数据映射关系（可选，现版本已简化为直接绑定）
    - users 表：用户信息
    - history_records 表：操作历史

  - **Redis**：缓存数据库，用于：

    - 会话缓存（session_cache）
    - 项目缓存（project_cache）
    - 协作状态（collaboration_state）

  - **对象存储**：用于文件存储
    - user_files：用户上传的文件
    - exported_code：导出的代码包
    - template_previews：模板预览图
    - schema_files：Schema JSON 文件
  - **Local Storage（浏览器本地存储）**：用于临时数据和用户偏好
    - 临时数据缓存（自动清理）
    - 用户偏好设置（持久化）
    - 组件状态缓存（会话级）
    - 表单草稿数据（定时清理）

- **关键数据流场景**：
  - 组件编辑数据流
  - 数据绑定数据流（用户配置数据源 → 创建 DataSource 实体 → 测试连接 → 创建映射 → 绑定组件 → 实时获取 → 渲染更新）
  - JSON 快速输入数据流（选择组件 → 系统推荐模板 → 用户输入 JSON → 验证格式 → 解析结构 → 创建静态数据源 → 自动渲染到组件属性）
  - 协作同步数据流
  - 代码生成数据流
  - Schema 导出数据流（读取项目数据 → 转换为 PageSchema → WASM 验证格式 → WASM 序列化为 JSON → 下载/存储）
  - Schema 导入数据流（上传文件 → 解析 JSON → WASM 验证版本 → WASM 迁移旧版本 → WASM 转换为 Project 数据 → 导入到状态管理 → 渲染到画布）
  - WASM 数据解析数据流（CSV/XML 文件 → WASM 解析 → 数据源服务 → 数据绑定）
  - WASM 数据映射数据流（源数据 → WASM 映射生成 → WASM 映射应用 → 组件渲染）
  - WASM 布局计算数据流（组件数据 → WASM 布局计算 → WASM 网格对齐 → 组件位置更新）
  - 本地存储数据流（读取/写入本地数据 → 清理过期数据 → 同步到服务器）
  - 状态管理数据流（状态初始化 → 状态更新 → 状态持久化 → 状态恢复）

### 4. technology-architecture.puml - 技术架构图

技术架构图描述了平台的技术栈、基础设施和部署架构：

- **前端技术栈**：

  - React 19：UI 框架
  - Next.js 15：全栈框架
  - TypeScript：类型系统
  - Tailwind CSS：样式框架
  - Radix UI：组件库
  - React DnD：拖拽库
  - Recharts：图表库
  - Zustand：状态管理
  - **i18n（国际化）**：
    - react-i18next：国际化库
    - 语言切换功能
  - **工具包（Utils Packages）**：
    - Component Utils：组件工具
    - Data Binding Utils：数据绑定工具
    - Layout Utils：布局工具
    - Performance Utils：性能工具
    - Schema Utils：Schema 工具
    - Utils：通用工具
  - **Local Storage（浏览器本地存储）**：临时数据和用户偏好
  - **Rust/WASM**：性能优化
    - Rust：系统编程语言
    - WebAssembly：高性能运行时
    - wasm-bindgen：Rust-JavaScript 互操作
    - wasm-pack：WASM 打包工具
    - serde-wasm-bindgen：数据序列化
    - js-sys：JavaScript 系统调用

- **后端技术栈**：

  - NestJS 11：后端框架
  - TypeScript：类型系统
  - Express：HTTP 服务器
  - Socket.IO：WebSocket 实时通信
  - TypeORM：ORM 框架

- **数据存储层**：

  - PostgreSQL：主从数据库集群
  - Redis：缓存和消息队列
  - 对象存储（S3/OSS 兼容）：文件存储
  - Local Storage（浏览器本地存储）：临时数据和用户偏好

- **基础设施层**：

  - 负载均衡器
  - Web 服务器集群
  - API 服务器集群
  - WebSocket 服务器
  - 任务队列
  - **AWS 集成（@lowcode-platform/aws）**：
    - S3 操作：对象存储服务
    - CloudFormation：基础设施即代码
    - Lambda：无服务器函数
    - API Gateway：API 管理
    - CloudFront：CDN 分发
    - IAM：身份和访问管理
  - **协作工具包（@lowcode-platform/collaboration）**：
    - WebSocket 管理：实时连接管理
    - 实时同步：多人协作同步
    - 冲突解决：操作冲突处理

- **网络与安全**：

  - CDN：内容分发网络
  - WAF：Web 应用防火墙
  - SSL/TLS：加密传输
  - 认证服务
  - API 网关

- **监控与运维**：

  - Prometheus：指标监控
  - Grafana：可视化面板
  - ELK Stack：日志分析
  - Sentry：错误追踪
  - 健康检查

- **CI/CD 与部署**：
  - Git 仓库
  - CI/CD 流水线
  - Kubernetes：容器编排
  - Docker：容器化

## 使用方法

### 查看图表

这些 PlantUML 文件可以使用以下工具渲染：

- **在线工具**：[PlantUML Online](http://www.plantuml.com/plantuml/)
- **VS Code 插件**：PlantUML
- **命令行工具**：PlantUML CLI

### 命令行生成图片

```bash
# 生成业务架构图
plantuml -tpng docs/togaf/business-architecture.puml
plantuml -tsvg docs/togaf/business-architecture.puml

# 生成应用架构图
plantuml -tpng docs/togaf/application-architecture.puml
plantuml -tsvg docs/togaf/application-architecture.puml

# 生成数据架构图
plantuml -tpng docs/togaf/data-architecture.puml
plantuml -tsvg docs/togaf/data-architecture.puml

# 生成技术架构图
plantuml -tpng docs/togaf/technology-architecture.puml
plantuml -tsvg docs/togaf/technology-architecture.puml
```

### VS Code 预览

如果使用 VS Code，推荐安装以下插件：

- **PlantUML**：提供 PlantUML 文件的预览和导出功能
- **Markdown Preview Enhanced**：在 Markdown 中嵌入 PlantUML 图表

在 VS Code 中打开 `.puml` 文件后，可以使用快捷键 `Alt + D` 预览图表。

## 架构视图之间的关系

TOGAF 的四个架构视图相互关联，形成了一个完整的架构视图：

1. **业务架构**定义了"做什么"和"为什么做"，为其他架构提供业务目标和需求
2. **应用架构**定义了"如何做"，将业务能力转化为应用系统功能
3. **数据架构**定义了"数据如何组织和流转"，支持应用架构的数据需求
4. **技术架构**定义了"用什么技术实现"，为应用架构和数据架构提供技术基础设施

这四个视图共同构成了低代码平台的企业架构全景图。

## 与 C4 模型的关系

本项目同时使用了 C4 模型和 TOGAF 框架来描述架构：

- **C4 模型**（位于 `docs/architecture/`）：专注于软件系统的层次化视图，从系统上下文到代码级别的详细设计
- **TOGAF 框架**（本目录）：提供企业级架构视图，涵盖业务、应用、数据和技术四个维度

两种方法相互补充：

- C4 模型更适合开发团队理解系统结构和代码组织
- TOGAF 框架更适合企业架构师和业务人员理解整体架构和业务价值

## 最新更新

### 2026-01-XX：AI 生成器集成

- **新增功能**：
  - AI 驱动的组件和页面生成：支持通过自然语言描述生成组件和页面
  - 多 AI 提供商支持：支持 OpenAI、Claude 和 DeepSeek 三种 AI 服务
  - 组件生成：通过自然语言描述生成符合规范的组件
  - 页面生成：一键生成完整的页面结构，包含布局、组件和样式
  - 自动验证：生成的组件和页面自动通过结构验证
  - 流式响应：支持实时流式生成，提供更好的用户体验

- **业务架构增强**：
  - 新增 AI 生成能力（自然语言生成、组件 AI 生成、页面 AI 生成、多 AI 提供商支持、生成结果验证、流式生成）
  - 新增 AI 生成流程（用户输入自然语言描述、选择 AI 提供商、配置 API Key、选择生成类型、AI 生成组件或页面、验证生成结果、应用到画布、预览和调整）

- **应用架构扩展**：
  - 表现层新增：AI 生成器组件（AI Generator UI Component）
  - 应用层新增：AI 生成器适配器（AIGeneratorAdapter）
  - 基础设施层新增：AI 生成器包（@lowcode-platform/ai-generator）
    - AI 客户端（OpenAI Client、Claude Client、DeepSeek Client）
    - 组件生成器（ComponentGenerator）
    - 页面生成器（PageGenerator）
    - 组件验证器（ComponentValidator）
    - 页面验证器（PageValidator）
    - 提示构建器（ComponentPromptBuilder、PagePromptBuilder）
    - JSON 解析器（JSONParser）

- **技术架构更新**：
  - 前端新增 AI 生成器包（@lowcode-platform/ai-generator）
  - 外部系统新增：OpenAI API、Claude API、DeepSeek API
  - 支持通过 API Gateway 调用外部 AI 服务

- **数据流新增**：
  - AI 生成组件数据流：AI 生成器组件 → AI 生成器适配器 → AI 生成器包 → AI 客户端 → AI API → 组件生成器 → 组件验证器 → 模板服务 → 组件渲染器 → 画布渲染
  - AI 生成页面数据流：AI 生成器组件 → AI 生成器适配器 → AI 生成器包 → AI 客户端 → AI API → 页面生成器 → 页面验证器 → 模板服务 → 组件渲染器 → 画布渲染

### 2026-01-XX：Rust/WASM 性能优化

- **新增技术栈**：

  - Rust/WASM：使用 Rust 编译为 WebAssembly，优化性能关键路径
  - wasm-bindgen：Rust 与 JavaScript 互操作
  - serde-wasm-bindgen：数据序列化/反序列化
  - js-sys：JavaScript 系统调用

- **性能优化模块**：

  - **数据解析模块**（WASM）：
    - CSV 解析：高性能 CSV 文件解析
    - XML 解析：快速 XML 数据处理
    - JSON 验证：高效的 JSON 格式验证
  - **Schema 处理模块**（WASM）：
    - Schema 序列化/反序列化：优化的 Schema 转换
    - Schema 验证：快速格式验证
    - Schema 迁移：版本迁移处理
  - **数据映射模块**（WASM）：
    - 映射生成：智能数据映射规则生成
    - 映射应用：高效数据转换
    - 数据转换：复杂数据变换
  - **布局计算模块**（WASM）：
    - 布局计算：响应式布局计算
    - 网格对齐：网格对齐计算
    - 碰撞检测：组件碰撞检测

- **架构设计**：

  - 采用 Port-Adapter 模式：WASM 作为基础设施层实现
  - 整洁架构：WASM 模块遵循 DDD + 分层架构原则
  - 优雅降级：WASM 失败时自动降级到 JavaScript 实现
  - 异步集成：所有 WASM 调用均为异步，不阻塞 UI

- **更新的架构组件**：
  - 基础设施层新增：WASM 适配器（WasmAdapter）
  - 应用层新增：WASM 端口接口（IWasmPort）
  - 技术栈新增：Rust、WebAssembly、wasm-pack

### 2026-01-08：数据绑定功能增强

- **新增功能**：

  - JSON 快速输入：支持根据组件类型自动推荐模板，快速输入 JSON 数据
  - 智能数据渲染：输入 JSON 后自动解析并渲染到组件属性
  - 数据结构解析：自动解析数据源结构，提供路径选择建议
  - JSON 工具服务：提供 JSON 验证、格式化、分析等功能

- **更新的架构组件**：
  - 应用层新增：数据源服务、数据源结构服务、JSON 工具服务
  - 表现层新增：数据源选择器、JSON 数据输入组件
  - 数据实体扩展：DataSource 添加 lastUpdated 字段，DataMapping 添加 defaultValue 字段
  - 新增数据实体：JsonDataTemplate（JSON 数据模板）

### 2026-01-XX：架构同步更新

- **业务架构增强**：

  - 新增国际化能力（多语言支持、语言切换、本地化内容管理）
  - 新增认证能力（用户认证、权限管理、会话管理、单点登录）
  - 新增图表可视化能力（多种图表类型支持、数据可视化、图表配置）
  - 新增国际化配置流程和用户认证流程

- **应用架构细化**：

  - 表现层新增组件渲染器（基础/图表/数据/表单/布局组件渲染器）
  - 表现层新增认证组件、项目组件、表单构建器、AI 生成器组件
  - 应用层新增模板命令服务、AI 生成器适配器
  - 基础设施层细化状态管理（Canvas/Component/Data/History/Theme/UI Store）
  - 基础设施层新增持久化层（本地存储适配器、数据库适配器）
  - 基础设施层新增 AI 生成器包（AI 客户端、生成器、验证器、提示构建器、JSON 解析器）

- **数据架构扩展**：

  - 新增 Chart 实体（ChartConfig、TableColumn、PaginationConfig、TreeNode）
  - 新增 Local Storage 存储层（临时数据缓存、用户偏好设置、组件状态缓存、表单草稿数据）
  - 新增本地存储数据流和状态管理数据流

- **技术架构更新**：
  - 前端新增 i18n 支持（react-i18next、语言切换功能）
  - 前端新增工具包（Component Utils、Data Binding Utils、Layout Utils、Performance Utils、Schema Utils、Utils）
  - 前端新增 AI 生成器包（OpenAI/Claude/DeepSeek 客户端支持）
  - 基础设施层新增 AWS 集成（S3、CloudFormation、Lambda、API Gateway、CloudFront、IAM）
  - 基础设施层新增协作工具包（WebSocket 管理、实时同步、冲突解决）
  - 数据存储层新增 Local Storage（浏览器本地存储）
  - 外部系统新增 AI API 服务（OpenAI API、Claude API、DeepSeek API）

## 维护说明

- 重大架构变更时，请及时更新相应的 TOGAF 架构图
- 新增业务能力时，请更新业务架构图
- 应用系统变更时，请更新应用架构图
- 数据模型变更时，请更新数据架构图
- 技术栈升级时，请更新技术架构图

## 相关文档

更多详细的架构说明和设计原则，请参考：

- [主架构文档](../../README.md) - 完整的架构文档和设计说明
- [C4 架构模型](../architecture/README.md) - 使用 C4 模型的软件架构视图
- [用户旅程图](../user-maps/README.md) - 用户视角的交互流程
- [沃德利地图](../wardley-maps/README.md) - 技术演化和价值网络分析

## 参考资料

- [TOGAF 官网](https://www.opengroup.org/togaf)
- [PlantUML 文档](https://plantuml.com/)
- [C4 模型](https://c4model.com/)
