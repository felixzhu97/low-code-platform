# Felix 低代码平台 - 架构文档

## 概述

Felix 低代码平台是一个基于 Next.js 和 React 的现代化可视化页面搭建平台，采用**整洁架构（Clean Architecture）**和**领域驱动设计（DDD）**的分层架构设计，支持拖拽式组件编辑、实时协作、代码导出等核心功能。

## 架构设计原则

- **分层架构**：采用 DDD（领域驱动设计）的分层架构，清晰分离业务逻辑和技术实现
- **整洁架构**：遵循 Clean Architecture 原则，确保依赖方向从外到内
- **依赖倒置**：高层模块不依赖低层模块，都依赖于抽象（接口）
- **单一职责**：每个模块、类、函数都有明确的单一职责
- **开闭原则**：对扩展开放，对修改关闭
- **组件化设计**：高度模块化的组件系统，支持自定义组件和扩展
- **响应式架构**：支持多端适配和响应式设计
- **可扩展性**：插件化的架构设计，便于功能扩展
- **实时协作**：支持多人同时编辑和实时同步

## 项目结构

基于整洁架构重构后的项目结构：

```text
src/
├── domain/                    # 领域层（Domain Layer）
│   ├── entities/             # 实体
│   │   └── types.ts         # 组件、模板、数据源等实体类型
│   ├── value-objects/       # 值对象
│   │   ├── position.ts      # 位置值对象
│   │   ├── style.ts         # 样式值对象
│   │   └── index.ts
│   ├── repositories/         # 仓储接口
│   │   ├── component.repository.ts
│   │   ├── template.repository.ts
│   │   ├── data-source.repository.ts
│   │   └── index.ts
│   └── services/            # 领域服务
│       └── component-factory.service.ts
│
├── application/              # 应用层（Application Layer）
│   ├── use-cases/           # 用例
│   │   ├── component/      # 组件相关用例
│   │   │   ├── create-component.use-case.ts
│   │   │   ├── update-component.use-case.ts
│   │   │   ├── delete-component.use-case.ts
│   │   │   ├── get-components.use-case.ts
│   │   │   └── update-component-position.use-case.ts
│   │   ├── template/       # 模板相关用例
│   │   │   └── apply-template.use-case.ts
│   │   ├── canvas/         # 画布相关用例
│   │   │   └── update-canvas-state.use-case.ts
│   │   └── index.ts
│   ├── ports/              # 应用端口（接口）
│   │   ├── component.repository.port.ts
│   │   ├── template.repository.port.ts
│   │   ├── data-source.repository.port.ts
│   │   ├── state-management.port.ts
│   │   └── index.ts
│   ├── services/            # 应用服务
│   │   ├── component-management.service.ts
│   │   ├── template-command.service.ts
│   │   ├── data-binding.service.ts
│   │   └── data-source.service.ts
│   ├── dto/                 # 数据传输对象
│   └── mappers/             # 对象映射器
│
├── infrastructure/          # 基础设施层（Infrastructure Layer）
│   ├── persistence/         # 持久化实现
│   │   └── repositories/   # 仓储实现
│   │       ├── component.repository.impl.ts
│   │       ├── template.repository.impl.ts
│   │       ├── data-source.repository.impl.ts
│   │       └── index.ts
│   └── state-management/    # 状态管理
│       ├── stores/         # Zustand Stores
│       │   ├── component.store.ts
│       │   ├── canvas.store.ts
│       │   ├── theme.store.ts
│       │   ├── data.store.ts
│       │   ├── history.store.ts
│       │   ├── ui.store.ts
│       │   ├── custom-components.store.ts
│       │   └── index.ts
│       └── adapters/       # 状态管理适配器
│           ├── zustand-state-adapter.ts
│           └── index.ts
│
├── presentation/            # 表现层（Presentation Layer）
│   ├── components/          # React 组件
│   │   ├── canvas/         # 画布相关组件
│   │   ├── charts/         # 图表组件
│   │   ├── forms/          # 表单组件
│   │   ├── templates/      # 模板组件
│   │   └── ui/             # UI 组件库
│   ├── adapters/            # 表现层适配器
│   │   ├── component.adapter.ts
│   │   ├── canvas.adapter.ts
│   │   ├── template.adapter.ts
│   │   ├── adapter-factory.ts
│   │   └── index.ts
│   ├── hooks/              # React Hooks
│   │   ├── use-adapters.ts
│   │   ├── use-component-interaction.ts
│   │   ├── use-canvas-drag.ts
│   │   └── index.ts
│   └── data/               # 表现层数据
│       └── templates.ts
│
└── shared/                  # 共享层（Shared Layer）
    ├── constants/          # 常量
    ├── types/              # 共享类型
    ├── utils/              # 工具函数
    └── hooks/              # 共享 Hooks
```

## 架构层次说明

### 领域层（Domain Layer）

**职责**：包含核心业务逻辑和业务规则，不依赖任何其他层。

- **实体（Entities）**：核心业务对象，如 `Component`、`Template`、`DataSource`
- **值对象（Value Objects）**：不可变的值对象，如 `Position`、`Style`
- **仓储接口（Repository Interfaces）**：定义数据持久化的抽象接口
- **领域服务（Domain Services）**：封装领域逻辑，如 `ComponentFactoryService`

### 应用层（Application Layer）

**职责**：协调领域对象完成应用用例，定义应用服务和端口。

- **用例（Use Cases）**：封装应用特定的业务规则和流程
  - `CreateComponentUseCase`：创建组件
  - `UpdateComponentUseCase`：更新组件
  - `DeleteComponentUseCase`：删除组件
  - `GetComponentsUseCase`：获取组件列表
  - `ApplyTemplateUseCase`：应用模板
- **端口（Ports）**：定义应用层需要的接口
  - `IComponentRepositoryPort`：组件仓储端口
  - `IStateManagementPort`：状态管理端口
- **应用服务（Application Services）**：协调多个用例或提供复杂业务逻辑

### 基础设施层（Infrastructure Layer）

**职责**：提供技术实现，实现领域层和应用层定义的接口。

- **持久化实现（Persistence）**：
  - `ComponentRepositoryImpl`：实现组件仓储接口
  - `TemplateRepositoryImpl`：实现模板仓储接口
- **状态管理（State Management）**：
  - Zustand Stores：管理应用状态
  - `ZustandStateAdapter`：实现状态管理端口
- **外部服务集成**：API 调用、文件系统操作等

### 表现层（Presentation Layer）

**职责**：处理用户界面和用户交互，只依赖应用层。

- **React 组件**：UI 组件，如 `Canvas`、`ComponentPanel`、`PropertiesPanel`
- **适配器（Adapters）**：将应用层用例适配为表现层可用的接口
  - `ComponentAdapter`：组件操作适配器
  - `CanvasAdapter`：画布操作适配器
  - `TemplateAdapter`：模板操作适配器
- **Hooks**：自定义 React Hooks，如 `useAdapters`、`useAllStores`

## 依赖关系

```text
表现层 (Presentation)
    ↓ 依赖
应用层 (Application)
    ↓ 依赖
领域层 (Domain)
    ↑ 实现
基础设施层 (Infrastructure)
```

**关键原则**：

- 依赖方向只能从外到内
- 领域层不依赖任何其他层
- 应用层只依赖领域层
- 基础设施层实现领域层和应用层定义的接口
- 表现层只依赖应用层，通过适配器访问用例

## 整洁架构 UML 图

本项目采用整洁架构（Clean Architecture）设计，以下 UML 图展示了架构的各个层面：

### 1. 包依赖图 (Package Diagram)

- 文件：[clean-architecture-package.puml](./architecture/clean-architecture-package.puml)
- 描述：展示各层之间的依赖关系和包结构
- 核心内容：
  - Presentation Layer（表现层）：UI 组件、适配器、Hooks
  - Application Layer（应用层）：用例、DTO、Mapper、端口
  - Domain Layer（领域层）：实体、值对象、仓储接口、领域服务
  - Infrastructure Layer（基础设施层）：持久化实现、状态管理、数据源
  - Shared Layer（共享层）：工具函数、类型定义、常量

### 2. 类图 (Class Diagram)

- 文件：[clean-architecture-class.puml](./architecture/clean-architecture-class.puml)
- 描述：展示组件管理功能的类结构和关系
- 核心内容：
  - 领域实体：ComponentEntity、ComponentProperties、Position
  - 仓储接口：IComponentRepository
  - 应用用例：CreateComponentUseCase、UpdateComponentUseCase、DeleteComponentUseCase
  - 基础设施实现：LocalStorageComponentRepository
  - 表现层适配器：ComponentAdapter

### 3. 序列图 (Sequence Diagram)

- 文件：[clean-architecture-sequence.puml](./architecture/clean-architecture-sequence.puml)
- 描述：展示创建组件用例的完整执行流程
- 核心流程：
  1. 用户操作触发 UI 组件
  2. 适配器调用应用用例
  3. 用例使用领域服务创建实体
  4. 用例调用仓储接口保存数据
  5. 基础设施层实现持久化
  6. 结果返回并更新 UI

### 4. 层次结构图 (Layers Diagram)

- 文件：[clean-architecture-layers.puml](./architecture/clean-architecture-layers.puml)
- 描述：可视化展示各层的组件和依赖关系
- 特点：使用不同颜色区分各层，清晰展示依赖方向

### 5. 组件图 (Component Diagram)

- 文件：[clean-architecture-component.puml](./architecture/clean-architecture-component.puml)
- 描述：展示完整系统的组件结构和交互关系
- 包含：画布管理、组件管理、数据源管理等完整功能模块

### 整洁架构文档

详细的架构重构方案和指南请参考：

- [整洁架构重构方案](./architecture/CLEAN_ARCHITECTURE_REFACTORING.md) - 详细的重构步骤和目录结构
- [架构对比分析](./architecture/ARCHITECTURE_COMPARISON.md) - 当前架构与优化后架构的对比
- [整洁架构快速指南](./architecture/CLEAN_ARCHITECTURE_GUIDE.md) - 开发者的快速参考指南

## C4 架构模型

本项目采用 C4 模型来描述系统架构，包含以下四个层级：

### 1. 系统上下文图 (Context)

- 文件：[c4-context.puml](./architecture/c4-context.puml)
- 描述：展示系统与外部用户和系统的交互关系
- 核心用户：页面设计师、开发者、终端用户、管理员
- 外部系统：CDN 服务、对象存储、认证服务、数据分析、第三方 API、代码托管

### 2. 容器架构图 (Container)

- 文件：[c4-container.puml](./architecture/c4-container.puml)
- 描述：展示系统内部的主要容器和它们之间的关系
- 核心容器：
  - Web 应用 (Next.js 15 + React 19)
  - API 层 (Next.js API Routes)
  - 实时协作 (WebSocket/SSE)
  - 数据存储 (PostgreSQL/MongoDB + Redis)
  - 文件存储 (对象存储/CDN)

### 3. 组件架构图 (Component)

- 前端组件架构：[c4-component.puml](./architecture/c4-component.puml) - 展示 Web 应用容器内的组件结构
- 整洁架构层次：[c4-clean-architecture.puml](./architecture/c4-clean-architecture.puml) - 详细展示整洁架构的层次结构和依赖关系
- 描述：详细展示各个容器内部的组件结构，包括表现层、应用层、领域层和基础设施层

#### 前端架构层次

- **领域层**：组件实体、数据源实体、主题实体、组件工厂
- **应用层**：组件管理服务、历史管理服务、工具服务
- **表现层**：
  - 核心编辑器：画布、组件面板、属性面板、组件树
  - 组件渲染器：基础、布局、表单、图表、数据组件渲染器
  - 图表子系统：柱状图、折线图、饼图、面积图、仪表盘、雷达图
  - 高级功能：主题编辑器、动画编辑器、代码导出、协作功能、模板库

#### 后端服务架构

- **API 服务层**：页面 API、组件 API、模板 API、主题 API、认证 API 等
- **数据存储层**：主数据库、缓存数据库、文件存储
- **外部服务集成**：认证服务、Git 服务、邮件服务、CDN 服务

### 4. 代码级别图 (Code)

- 文件：[c4-code.puml](./architecture/c4-code.puml)
- 描述：展示关键类和方法的具体实现
- 包含：类型定义、服务类、React 组件、用例类、仓储接口和实现、状态管理

### 5. 部署架构图 (Deployment)

- 文件：[c4-deployment.puml](./architecture/c4-deployment.puml)
- 描述：展示系统的部署拓扑和运行环境
- 部署环境：
  - 客户端环境：Web 浏览器、移动设备
  - 边缘网络：CDN 缓存、边缘缓存
  - 云计算平台：Kubernetes 集群、数据层、存储层、监控层
  - 外部服务：认证、代码托管、邮件、分析服务

## C4 模型文件清单

所有 C4 模型文件位于 `architecture/` 目录：

1. **c4-context.puml** - 系统上下文图，展示系统与外部用户和系统的关系
2. **c4-container.puml** - 容器架构图，展示系统内部的主要容器
3. **c4-component.puml** - 组件架构图，展示 Web 应用容器内的组件结构
4. **c4-clean-architecture.puml** - 整洁架构组件图，详细展示分层架构和依赖关系
5. **c4-code.puml** - 代码级别图，展示关键类和方法的具体实现
6. **c4-deployment.puml** - 部署架构图，展示系统的部署拓扑

### 使用说明

这些 PlantUML 文件可以使用以下工具渲染：

- **在线工具**：[PlantUML Online](http://www.plantuml.com/plantuml/)
- **VS Code 插件**：PlantUML
- **命令行工具**：PlantUML CLI
- **CI/CD 集成**：在构建流程中自动生成架构图

### 查看方式

```bash
# 使用 PlantUML CLI 生成图片
plantuml -tpng docs/architecture/c4-context.puml
plantuml -tsvg docs/architecture/c4-container.puml
plantuml -tpng docs/architecture/c4-component.puml
plantuml -tpng docs/architecture/c4-clean-architecture.puml
plantuml -tpng docs/architecture/c4-code.puml
plantuml -tpng docs/architecture/c4-deployment.puml
```

## 用户地图文档

用户地图文档帮助理解平台的不同用户角色、使用流程、协作关系和用户特征，为产品设计和开发提供重要参考。

### 1. 用户角色/权限地图

- 文件：[user-role-permission-map.puml](./user-maps/user-role-permission-map.puml)
- 描述：展示四种用户角色（页面设计师、开发者、终端用户、管理员）及其权限范围
- 核心内容：
  - 用户角色定义和职责说明
  - 功能权限矩阵（项目管理、页面编辑、模板管理、代码导出、协作功能等）
  - 角色之间的权限层级关系
  - 各角色的权限说明和限制

### 2. 用户旅程图

- 文件：[user-journey-map.puml](./user-maps/user-journey-map.puml)
- 描述：展示用户从注册到使用平台的完整流程
- 核心内容：
  - 页面设计师旅程：从注册到导出代码的完整流程
  - 开发者旅程：从登录到二次开发的流程
  - 终端用户旅程：访问和使用生成页面的流程
  - 管理员旅程：系统管理和配置的流程
  - 关键触点和用户情绪点标注

### 3. 用户协作关系图

- 文件：[user-collaboration-map.puml](./user-maps/user-collaboration-map.puml)
- 描述：展示多人协作时的用户关系和交互流程
- 核心内容：
  - 邀请协作者的流程
  - 实时协作编辑的场景和同步机制
  - 冲突检测和解决流程（最后写入优先、手动合并、操作回滚）
  - 权限管理和变更通知
  - 操作历史同步机制

### 4. 用户画像地图

- 文件：[user-persona-map.puml](./user-maps/user-persona-map.puml)
- 描述：展示不同用户角色的特征、需求和使用场景
- 核心内容：
  - 页面设计师画像：背景、目标、痛点、使用场景和使用习惯
  - 开发者画像：技术背景、开发目标、痛点和使用习惯
  - 终端用户画像：基本信息、使用目标和体验需求
  - 管理员画像：管理职责、系统管理需求和使用习惯
  - 用户与平台功能的映射关系

### 用户地图文件清单

所有用户地图文件位于 `user-maps/` 目录：

1. **user-role-permission-map.puml** - 用户角色/权限地图，定义用户角色和权限矩阵
2. **user-journey-map.puml** - 用户旅程图，展示不同角色的使用流程
3. **user-collaboration-map.puml** - 用户协作关系图，展示多人协作场景
4. **user-persona-map.puml** - 用户画像地图，展示用户特征和需求

### 用户地图使用说明

这些用户地图文件可以使用以下工具渲染：

- **在线工具**：[PlantUML Online](http://www.plantuml.com/plantuml/)
- **VS Code 插件**：PlantUML
- **命令行工具**：PlantUML CLI

### 用户地图查看方式

```bash
# 使用 PlantUML CLI 生成图片
plantuml -tpng docs/user-maps/user-role-permission-map.puml
plantuml -tpng docs/user-maps/user-journey-map.puml
plantuml -tpng docs/user-maps/user-collaboration-map.puml
plantuml -tpng docs/user-maps/user-persona-map.puml
```

## 沃德利地图文档

沃德利地图（Wardley Map）是一种战略地图，用于可视化价值网络和组件演化阶段，帮助理解平台各组件在演化图谱中的位置，为技术决策和战略规划提供重要参考。

### 沃德利地图

- 文件：[wardley-map.puml](./wardley-maps/wardley-map.puml)
- 描述：展示平台的价值网络和组件演化阶段
- 核心内容：
  - **价值网络（Y 轴）**：从用户需求层到基础设施层的完整价值链条
    - 用户需求层：页面设计师、开发者、终端用户的需求
    - 应用层：可视化编辑器、模板系统、协作功能
    - 平台层：组件系统、数据绑定、主题系统、代码生成引擎
    - 基础设施层：部署服务、存储服务、CDN 服务、数据库服务、认证服务
  - **演化阶段（X 轴）**：各组件的演化位置
    - **Genesis（创新）**：AI 辅助设计、智能布局推荐等新兴技术
    - **Custom Built（定制构建）**：可视化编辑器、实时协作等平台核心差异化能力
    - **Product（产品化）**：组件系统、模板系统、代码生成等标准化产品
    - **Commodity（商品化）**：CDN、存储、数据库、认证等标准化云服务
  - **依赖关系**：展示组件之间的依赖和价值流动

### 沃德利地图使用说明

沃德利地图文件可以使用以下工具渲染：

- **在线工具**：[PlantUML Online](http://www.plantuml.com/plantuml/)
- **VS Code 插件**：PlantUML
- **命令行工具**：PlantUML CLI

### 沃德利地图查看方式

```bash
# 使用 PlantUML CLI 生成图片
plantuml -tpng docs/wardley-maps/wardley-map.puml
```

## 技术栈

### 前端技术

- **框架**：Next.js 15 + React 19
- **语言**：TypeScript
- **UI 库**：Radix UI + Tailwind CSS
- **图表库**：Recharts
- **拖拽功能**：react-dnd
- **表单处理**：React Hook Form + Zod
- **状态管理**：Zustand（基础设施层）+ React Hooks（表现层）
- **架构模式**：整洁架构（Clean Architecture）+ DDD（领域驱动设计）

### 后端技术

- **API**：Next.js API Routes
- **实时通信**：WebSocket/Server-Sent Events
- **数据库**：PostgreSQL/MongoDB
- **缓存**：Redis
- **文件存储**：云对象存储 (S3/OSS)

### 开发工具

- **测试**：Vitest + Testing Library
- **代码质量**：ESLint + TypeScript
- **构建工具**：Next.js + Turbopack
- **包管理**：pnpm

## 核心功能模块

### 1. 可视化编辑器

- 拖拽式组件添加和排列
- 实时预览和编辑
- 多层级组件嵌套
- 智能网格对齐

### 2. 组件系统

- 50+ 预制 UI 组件
- 10+ 图表组件 (基于 Recharts)
- 自定义组件开发
- 组件分组和管理

### 3. 数据绑定

- 静态数据源
- API 数据源
- 数据库连接
- 实时数据更新

### 4. 主题系统

- 可视化主题编辑
- 预设主题模板
- 响应式设计支持
- 深色/浅色模式

### 5. 模板库

- 预设页面模板
- 模板预览和应用
- 自定义模板保存
- 模板分享机制

### 6. 协作功能

- 多人实时编辑
- 操作历史记录
- 撤销/重做功能
- 冲突解决机制

### 7. 代码导出

- React 组件代码生成
- Next.js 项目导出
- Git 仓库集成
- 部署脚本生成

## 性能优化

- **虚拟化渲染**：大量组件时使用虚拟列表
- **懒加载**：按需加载组件和模板
- **缓存策略**：本地存储和 CDN 缓存
- **代码分割**：动态导入和路由级分割

## 安全性

- **输入验证**：表单数据验证和清理
- **XSS 防护**：内容过滤和转义
- **CSRF 防护**：请求令牌验证
- **权限控制**：基于角色的访问控制

## 可扩展性

- **插件系统**：支持第三方组件和功能扩展
- **API 开放**：提供完整的 REST API
- **Webhook 支持**：事件通知和集成
- **多租户架构**：支持 SaaS 模式部署

## 监控和运维

- **性能监控**：Prometheus + Grafana
- **日志系统**：ELK Stack
- **错误追踪**：Sentry 集成
- **健康检查**：系统状态监控

## 部署方案

### 开发环境

```bash
npm run dev
```

### 生产部署

- **容器化**：Docker + Kubernetes
- **CI/CD**：GitHub Actions
- **负载均衡**：Nginx + CDN
- **数据库**：托管数据库服务
- **监控**：完整的可观测性方案

## 未来规划

1. **AI 辅助设计**：集成 AI 生成组件和布局
2. **移动端支持**：React Native 版本
3. **企业级功能**：工作流、审批、权限管理
4. **国际化**：多语言支持
5. **插件市场**：社区组件和模板

## 架构优势

采用整洁架构带来的优势：

1. **可测试性**：各层独立，易于单元测试和集成测试
2. **可维护性**：清晰的层次结构，职责分明，易于理解和维护
3. **可扩展性**：通过接口和适配器，易于扩展新功能
4. **技术无关性**：领域层和应用层不依赖具体技术实现
5. **团队协作**：不同团队可以并行开发不同层次
6. **代码复用**：领域逻辑可以在不同表现层复用

## 开发指南

### 添加新功能

1. **定义领域实体**：在 `domain/entities/` 中定义实体类型
2. **定义仓储接口**：在 `domain/repositories/` 中定义接口
3. **实现用例**：在 `application/use-cases/` 中实现业务逻辑
4. **实现仓储**：在 `infrastructure/persistence/repositories/` 中实现接口
5. **创建适配器**：在 `presentation/adapters/` 中创建适配器
6. **创建组件**：在 `presentation/components/` 中创建 UI 组件

### 代码规范

- **命名规范**：使用清晰的命名，体现层次和职责
- **依赖规则**：严格遵守依赖方向，禁止反向依赖
- **接口优先**：优先定义接口，再实现具体类
- **单一职责**：每个类、函数只做一件事
- **类型安全**：充分利用 TypeScript 类型系统

## 文档维护

本架构文档会随着项目的演进持续更新，请确保：

1. 重大架构变更时更新相应的 C4 图表
2. 新增重要组件时更新组件架构图
3. 技术栈变更时更新技术文档
4. 部署方式改变时更新部署架构图
5. 重构完成后及时更新项目结构说明

## 相关文档

- [整洁架构重构方案](./architecture/CLEAN_ARCHITECTURE_REFACTORING.md) - 详细的重构步骤和目录结构
- [架构对比分析](./architecture/ARCHITECTURE_COMPARISON.md) - 当前架构与优化后架构的对比
- [整洁架构快速指南](./architecture/CLEAN_ARCHITECTURE_GUIDE.md) - 开发者的快速参考指南
- [ER 设计图](./architecture/er-design.puml) - 数据库实体关系图
- [用户角色/权限地图](./user-maps/user-role-permission-map.puml) - 用户角色和权限定义
- [用户旅程图](./user-maps/user-journey-map.puml) - 用户使用流程
- [用户协作关系图](./user-maps/user-collaboration-map.puml) - 多人协作场景
- [用户画像地图](./user-maps/user-persona-map.puml) - 用户特征和需求
- [沃德利地图](./wardley-maps/wardley-map.puml) - 价值网络和组件演化阶段

---

**最后更新时间**：2024 年 12 月
