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

- **业务能力**：

  - 可视化编辑能力
  - 组件管理能力
  - 数据绑定能力（数据源管理、数据映射、实时数据更新、数据验证、JSON快速输入、模板推荐、智能渲染、数据结构解析）
  - 协作能力
  - 代码生成能力
  - 模板管理能力
  - Schema 管理能力（Schema 导出、导入、渲染、验证、版本管理）

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
  - Schema 导出组件（Schema Export）
  - Schema 导入组件（Schema Import）
  - Schema 渲染器（Schema Renderer）

- **应用层（Application Layer）**：

  - 组件管理服务（Component Management Service）
  - 模板管理服务（Template Management Service）
  - 模板命令服务（Template Command Service）：命令模式实现
  - 数据绑定服务（Data Binding Service）
  - 数据源服务（DataSource Service）
  - 数据源结构服务（DataSource Structure Service）
  - JSON 工具服务（JSON Helper Service）
  - 用例层（Use Cases Layer）：
    - 画布用例（Canvas Use Cases）：画布状态管理
    - 组件用例（Component Use Cases）：组件操作
    - 模板用例（Template Use Cases）：模板应用
  - 历史记录工具（History Utils）：函数式实现，提供 undo/redo 等功能

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
  - 状态管理（State Management）
  - 协作服务（Collaboration Service）
  - 持久化管理器（Persistence Manager）：负责项目数据持久化、Schema 导出/导入、localStorage 存储管理
  - **Schema 包（@lowcode-platform/schema）**：Schema 验证、序列化/反序列化、迁移工具包，支持 WASM 和 JavaScript 降级
  - **WASM 适配器（WASM Adapter）**：
    - 数据解析适配器（Data Parser Adapter）：CSV/XML 解析、JSON 验证
    - Schema 处理适配器（Schema Processor Adapter）：序列化/反序列化、验证、迁移
    - 数据映射适配器（Data Mapper Adapter）：映射生成、应用、数据转换
    - 布局计算适配器（Layout Calculator Adapter）：布局计算、网格对齐、碰撞检测

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

- **数据存储**：

  - **PostgreSQL**：关系型数据库，存储结构化数据

    - components 表：组件数据
    - projects 表：项目数据
    - templates 表：模板数据
    - data_sources 表：数据源配置（包含静态数据、API配置、数据库连接等）
    - data_mappings 表：数据映射关系（可选，现版本已简化为直接绑定）
    - users 表：用户信息
    - history_records 表：操作历史

  - **Redis**：缓存数据库，用于：

    - 会话缓存（session_cache）
    - 项目缓存（project_cache）
    - 协作状态（collaboration_state）

  - **LocalStorage**：浏览器本地存储（当前开发环境实现）
    - 项目数据存储（Project Data Store）
    - 当前项目 ID（Current Project ID）
    - Schema 文件存储（可选）

  - **对象存储**：用于文件存储（生产环境可选）
    - user_files：用户上传的文件
    - exported_code：导出的代码包
    - template_previews：模板预览图
    - schema_files：Schema JSON 文件

- **关键数据流场景**：
  - 组件编辑数据流
  - 数据绑定数据流（用户配置数据源 → 创建 DataSource 实体 → 测试连接 → 创建映射 → 绑定组件 → 实时获取 → 渲染更新）
  - JSON 快速输入数据流（选择组件 → 系统推荐模板 → 用户输入 JSON → 验证格式 → 解析结构 → 创建静态数据源 → 自动渲染到组件属性）
  - 协作同步数据流
  - 代码生成数据流
  - Schema 导出数据流（PersistenceManager 导出项目数据 → @lowcode-platform/schema → WASM 序列化为 JSON → 文件下载/存储到 localStorage，降级路径：JavaScript 序列化）
  - Schema 导入数据流（上传文件 → PersistenceManager 读取文件 → 解析 JSON → @lowcode-platform/schema → WASM 验证版本/迁移/转换为 Project 数据 → PersistenceManager 导入数据 → 状态管理 → 画布渲染，降级路径：JavaScript 验证/迁移/转换）
  - WASM 数据解析数据流（CSV/XML 文件 → WASM 解析 → 数据源服务 → 数据绑定）
  - WASM 数据映射数据流（源数据 → WASM 映射生成 → WASM 映射应用 → 组件渲染）
  - WASM 布局计算数据流（组件数据 → WASM 布局计算 → WASM 网格对齐 → 组件位置更新）

### 4. technology-architecture.puml - 技术架构图

技术架构图描述了平台的技术栈、基础设施和部署架构：

- **前端技术栈**：

  - React 19：UI 框架
  - Next.js 15.2.8：全栈框架
  - TypeScript 5：类型系统
  - Tailwind CSS：样式框架
  - Radix UI：组件库
  - React DnD：拖拽库
  - Recharts：图表库
  - Zustand 5.0.8：状态管理
  - **Rust/WASM**：性能优化
    - Rust：系统编程语言
    - WebAssembly：高性能运行时
    - wasm-bindgen：Rust-JavaScript 互操作
    - wasm-pack：WASM 打包工具
    - serde-wasm-bindgen：数据序列化
    - js-sys：JavaScript 系统调用
  - **测试框架**：
    - Vitest 3.2.4：前端测试框架
    - Testing Library：React 组件测试

- **后端技术栈**：

  - NestJS 11.0.1：后端框架
  - TypeScript 5：类型系统
  - Express：HTTP 服务器
  - Socket.IO：WebSocket 实时通信
  - TypeORM：ORM 框架
  - **测试框架**：
    - Jest 30.0.0：后端测试框架

- **核心包**：

  - **@lowcode-platform/schema**：Schema 验证、序列化/反序列化、迁移工具包，支持 WASM 和 JavaScript 降级

- **数据存储层**：

  - PostgreSQL：主从数据库集群
  - Redis：缓存和消息队列
  - 对象存储（S3/OSS 兼容）：文件存储

- **基础设施层**：

  - 负载均衡器
  - Web 服务器集群
  - API 服务器集群
  - WebSocket 服务器
  - 任务队列

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

### 2026-01-XX：架构文档同步更新

- **应用架构修正**：
  - History Service：更新为函数式实现（`history.ts`），而非类服务
  - Template Management：更新为命令模式实现（`TemplateCommandService` + `TemplateService`）
  - Canvas Management：更新为用例（Use Cases）实现，位于 `application/use-cases/canvas/`
  - Schema 管理：实际由 `PersistenceManager` 实现，而非独立的 Schema 服务
  - 表现层新增：Schema 渲染器组件（Schema Renderer）

- **数据架构修正**：
  - Schema 导出/导入流程：通过 `PersistenceManager` 实现，使用 `@lowcode-platform/schema` 包进行 Schema 操作
  - 数据存储：`PersistenceManager` 使用 localStorage 进行项目持久化（当前开发环境实现）
  - 数据流：添加 WASM 降级路径说明

- **技术架构更新**：
  - 技术栈版本：Next.js 15.2.8、NestJS 11.0.1、Zustand 5.0.8、TypeScript 5
  - 测试框架：Vitest 3.2.4（前端）、Jest 30.0.0（后端）
  - 核心包：添加 `@lowcode-platform/schema` 包说明

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
