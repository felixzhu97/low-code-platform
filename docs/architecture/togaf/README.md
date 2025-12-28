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
  - 数据管理流程

- **业务能力**：
  - 可视化编辑能力
  - 组件管理能力
  - 数据绑定能力
  - 协作能力
  - 代码生成能力
  - 模板管理能力

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

- **应用层（Application Layer）**：
  - 组件管理服务（Component Management Service）
  - 模板管理服务（Template Management Service）
  - 数据绑定服务（Data Binding Service）
  - 画布管理服务（Canvas Management Service）
  - 历史记录服务（History Service）

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
  - 代码生成器（Code Generator）

### 3. data-architecture.puml - 数据架构图

数据架构图描述了平台的数据模型、数据流和数据存储：

- **核心数据实体**：
  - Component（组件）
  - Template（模板）
  - Project（项目）
  - DataSource（数据源）
  - DataMapping（数据映射）
  - User（用户）
  - ThemeConfig（主题配置）
  - HistoryRecord（历史记录）

- **数据存储**：
  - **PostgreSQL**：关系型数据库，存储结构化数据
    - components 表：组件数据
    - projects 表：项目数据
    - templates 表：模板数据
    - data_sources 表：数据源配置
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

- **关键数据流场景**：
  - 组件编辑数据流
  - 数据绑定数据流
  - 协作同步数据流
  - 代码生成数据流

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

## 维护说明

- 重大架构变更时，请及时更新相应的 TOGAF 架构图
- 新增业务能力时，请更新业务架构图
- 应用系统变更时，请更新应用架构图
- 数据模型变更时，请更新数据架构图
- 技术栈升级时，请更新技术架构图

## 相关文档

更多详细的架构说明和设计原则，请参考：

- [主架构文档](../README.md) - 完整的架构文档和设计说明
- [C4 架构模型](../architecture/README.md) - 使用 C4 模型的软件架构视图
- [用户旅程图](../user-maps/README.md) - 用户视角的交互流程
- [沃德利地图](../wardley-maps/README.md) - 技术演化和价值网络分析

## 参考资料

- [TOGAF 官网](https://www.opengroup.org/togaf)
- [PlantUML 文档](https://plantuml.com/)
- [C4 模型](https://c4model.com/)

