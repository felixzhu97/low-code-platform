# Felix 低代码平台 - 架构文档

## 概述

Felix 低代码平台是一个基于 Next.js 和 React 的现代化可视化页面搭建平台，采用分层架构设计，支持拖拽式组件编辑、实时协作、代码导出等核心功能。

## 架构设计原则

- **分层架构**：采用 DDD（领域驱动设计）的分层架构，清晰分离业务逻辑和技术实现
- **整洁架构**：遵循 Clean Architecture 原则，确保依赖方向从外到内
- **组件化设计**：高度模块化的组件系统，支持自定义组件和扩展
- **响应式架构**：支持多端适配和响应式设计
- **可扩展性**：插件化的架构设计，便于功能扩展
- **实时协作**：支持多人同时编辑和实时同步

## 整洁架构 UML 图

本项目采用整洁架构（Clean Architecture）设计，以下 UML 图展示了架构的各个层面：

### 1. 包依赖图 (Package Diagram)

- 文件：[clean-architecture-package.puml](./clean-architecture-package.puml)
- 描述：展示各层之间的依赖关系和包结构
- 核心内容：
  - Presentation Layer（表现层）：UI 组件、适配器、Hooks
  - Application Layer（应用层）：用例、DTO、Mapper、端口
  - Domain Layer（领域层）：实体、值对象、仓储接口、领域服务
  - Infrastructure Layer（基础设施层）：持久化实现、状态管理、数据源
  - Shared Layer（共享层）：工具函数、类型定义、常量

### 2. 类图 (Class Diagram)

- 文件：[clean-architecture-class.puml](./clean-architecture-class.puml)
- 描述：展示组件管理功能的类结构和关系
- 核心内容：
  - 领域实体：ComponentEntity、ComponentProperties、Position
  - 仓储接口：IComponentRepository
  - 应用用例：CreateComponentUseCase、UpdateComponentUseCase、DeleteComponentUseCase
  - 基础设施实现：LocalStorageComponentRepository
  - 表现层适配器：ComponentAdapter

### 3. 序列图 (Sequence Diagram)

- 文件：[clean-architecture-sequence.puml](./clean-architecture-sequence.puml)
- 描述：展示创建组件用例的完整执行流程
- 核心流程：
  1. 用户操作触发 UI 组件
  2. 适配器调用应用用例
  3. 用例使用领域服务创建实体
  4. 用例调用仓储接口保存数据
  5. 基础设施层实现持久化
  6. 结果返回并更新 UI

### 4. 层次结构图 (Layers Diagram)

- 文件：[clean-architecture-layers.puml](./clean-architecture-layers.puml)
- 描述：可视化展示各层的组件和依赖关系
- 特点：使用不同颜色区分各层，清晰展示依赖方向

### 5. 组件图 (Component Diagram)

- 文件：[clean-architecture-component.puml](./clean-architecture-component.puml)
- 描述：展示完整系统的组件结构和交互关系
- 包含：画布管理、组件管理、数据源管理等完整功能模块

### 整洁架构文档

详细的架构重构方案和指南请参考：

- [整洁架构重构方案](./CLEAN_ARCHITECTURE_REFACTORING.md) - 详细的重构步骤和目录结构
- [架构对比分析](./ARCHITECTURE_COMPARISON.md) - 当前架构与优化后架构的对比
- [整洁架构快速指南](./CLEAN_ARCHITECTURE_GUIDE.md) - 开发者的快速参考指南

## C4 架构模型

本项目采用 C4 模型来描述系统架构，包含以下四个层级：

### 1. 系统上下文图 (Context)

- 文件：[c4-context.puml](./c4-context.puml)
- 描述：展示系统与外部用户和系统的交互关系
- 核心用户：页面设计师、开发者、终端用户、管理员
- 外部系统：CDN 服务、对象存储、认证服务、数据分析、第三方 API、代码托管

### 2. 容器架构图 (Container)

- 文件：[c4-container.puml](./c4-container.puml)
- 描述：展示系统内部的主要容器和它们之间的关系
- 核心容器：
  - Web 应用 (Next.js 15 + React 19)
  - API 层 (Next.js API Routes)
  - 实时协作 (WebSocket/SSE)
  - 数据存储 (PostgreSQL/MongoDB + Redis)
  - 文件存储 (对象存储/CDN)

### 3. 组件架构图 (Component)

- 前端组件：[c4-component-frontend.puml](./c4-component.puml)
- 后端服务：[c4-component-backend.puml](./c4-component-backend.puml)
- 核心组件：[c4_component.puml](./c4_component.puml)
- 描述：详细展示各个容器内部的组件结构

#### 前端架构层次：

- **领域层**：组件实体、数据源实体、主题实体、组件工厂
- **应用层**：组件管理服务、历史管理服务、工具服务
- **表现层**：
  - 核心编辑器：画布、组件面板、属性面板、组件树
  - 组件渲染器：基础、布局、表单、图表、数据组件渲染器
  - 图表子系统：柱状图、折线图、饼图、面积图、仪表盘、雷达图
  - 高级功能：主题编辑器、动画编辑器、代码导出、协作功能、模板库

#### 后端服务架构：

- **API 服务层**：页面 API、组件 API、模板 API、主题 API、认证 API 等
- **数据存储层**：主数据库、缓存数据库、文件存储
- **外部服务集成**：认证服务、Git 服务、邮件服务、CDN 服务

### 4. 代码级别图 (Code)

- 文件：[c4_code.puml](./c4-code.puml)
- 描述：展示关键类和方法的具体实现
- 包含：类型定义、服务类、React 组件、图表组件、渲染器、自定义 Hooks

### 5. 部署架构图 (Deployment)

- 文件：[c4-deployment.puml](./c4-deployment.puml)
- 描述：展示系统的部署拓扑和运行环境
- 部署环境：
  - 客户端环境：Web 浏览器、移动设备
  - 边缘网络：CDN 缓存、边缘缓存
  - 云计算平台：Kubernetes 集群、数据层、存储层、监控层
  - 外部服务：认证、代码托管、邮件、分析服务

## 技术栈

### 前端技术

- **框架**：Next.js 15 + React 19
- **语言**：TypeScript
- **UI 库**：Radix UI + Tailwind CSS
- **图表库**：Recharts
- **拖拽功能**：react-dnd
- **表单处理**：React Hook Form + Zod
- **状态管理**：React useState + 自定义历史管理

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

## 文档维护

本架构文档会随着项目的演进持续更新，请确保：

1. 重大架构变更时更新相应的 C4 图表
2. 新增重要组件时更新组件架构图
3. 技术栈变更时更新技术文档
4. 部署方式改变时更新部署架构图

---

_最后更新时间：2024 年 12 月_
