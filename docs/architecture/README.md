# 架构文档 (Architecture Documentation)

## 概述

低代码平台采用 **Clean Architecture** 和 **领域驱动设计 (DDD)** 构建，确保代码的可维护性、可扩展性和可测试性。

## C4 模型

C4 模型是一种软件架构可视化方法，通过四个层级展示系统架构：

| 层级 | 描述 | 文件 |
|------|------|------|
| **Context** | 系统全景视图，展示外部参与者和系统关系 | `c4-context.puml` |
| **Container** | 应用容器视图，展示主要组件和技术选择 | `c4-container.puml` |
| **Component** | 组件视图，展示各容器的内部结构 | `components/*.puml` |
| **Code** | 代码视图，展示关键类的设计 | (待实现) |

## 整洁架构 (Clean Architecture)

```
┌─────────────────────────────────────────────────────────────┐
│                      Presentation Layer                     │
│    (React Components, Controllers, API Handlers)            │
├─────────────────────────────────────────────────────────────┤
│                      Application Layer                      │
│         (Use Cases, Commands, Queries, DTOs)               │
├─────────────────────────────────────────────────────────────┤
│                        Domain Layer                         │
│  (Entities, Value Objects, Aggregates, Domain Services,     │
│   Domain Events, Repository Interfaces)                      │
├─────────────────────────────────────────────────────────────┤
│                    Infrastructure Layer                      │
│  (Repository Implementations, External Services, Database,    │
│   Caching, File System)                                     │
└─────────────────────────────────────────────────────────────┘
```

### 核心原则

1. **依赖倒置**: 外层依赖内层，通过接口抽象
2. **单一职责**: 每层只关注自己的职责
3. **稳定依赖**: 内层比外层更稳定
4. **边界清晰**: 层与层之间通过明确定义的接口通信

## 领域驱动设计 (DDD)

### 限界上下文 (Bounded Contexts)

```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│    Canvas    │  │  Component   │  │   Project    │
│   Context    │  │   Context    │  │   Context    │
├──────────────┤  ├──────────────┤  ├──────────────┤
│ - Canvas     │  │ - Component  │  │ - Project    │
│ - Component  │  │ - Category  │  │ - Template   │
│ - Layer      │  │ - Group     │  │ - Version    │
│ - Widget     │  │ - Property  │  │ - Export     │
└──────────────┘  └──────────────┘  └──────────────┘
```

### 领域实体

| 实体 | 职责 | 聚合根 |
|------|------|--------|
| `Canvas` | 管理画布及其组件 | ✓ |
| `Component` | UI 组件定义 | ✓ |
| `Project` | 项目管理 | ✓ |
| `Layer` | 画布层级管理 | ✓ |
| `Template` | 页面模板 | ✓ |

### 值对象

| 值对象 | 描述 |
|--------|------|
| `Position` | 组件位置 (x, y) |
| `Size` | 组件尺寸 (width, height) |
| `Style` | 样式配置 |
| `Color` | 颜色值 |
| `Animation` | 动画配置 |

### 领域事件

| 事件 | 触发时机 |
|------|----------|
| `ComponentAdded` | 组件添加到画布 |
| `ComponentRemoved` | 组件从画布移除 |
| `ComponentMoved` | 组件位置变更 |
| `ComponentResized` | 组件尺寸变更 |
| `PropertyChanged` | 属性值变更 |
| `ThemeChanged` | 主题变更 |

## 目录结构

```
src/
├── domain/                    # 领域层 (核心业务逻辑)
│   ├── entities/            # 实体
│   │   ├── Canvas.ts
│   │   ├── Component.ts
│   │   ├── Project.ts
│   │   └── Layer.ts
│   ├── valueObjects/        # 值对象
│   │   ├── Position.ts
│   │   ├── Size.ts
│   │   └── Style.ts
│   ├── aggregates/          # 聚合
│   │   └── CanvasAggregate.ts
│   ├── events/              # 领域事件
│   │   └── index.ts
│   ├── services/            # 领域服务
│   │   └── CanvasService.ts
│   └── repositories/        # 仓储接口
│       └── ICanvasRepository.ts
│
├── application/              # 应用层 (用例编排)
│   ├── commands/            # 命令 (写操作)
│   │   ├── AddComponentCommand.ts
│   │   ├── RemoveComponentCommand.ts
│   │   └── UpdatePropertyCommand.ts
│   ├── queries/             # 查询 (读操作)
│   │   ├── GetCanvasQuery.ts
│   │   └── GetComponentsQuery.ts
│   ├── useCases/            # 用例
│   │   ├── AddComponentUseCase.ts
│   │   └── ExportCodeUseCase.ts
│   └── dto/                 # 数据传输对象
│       └── CanvasDTO.ts
│
├── infrastructure/           # 基础设施层
│   ├── repositories/        # 仓储实现
│   │   └── CanvasRepository.ts
│   ├── persistence/         # 持久化
│   │   └── LocalStorageAdapter.ts
│   └── services/            # 外部服务
│       └── CodeGeneratorService.ts
│
└── presentation/            # 展示层
    ├── components/          # React 组件
    │   ├── canvas/
    │   ├── property-panel/
    │   └── toolbar/
    ├── hooks/               # 自定义 Hooks
    └── contexts/            # React Context
```

## 技术决策记录 (ADR)

| 编号 | 决策 | 状态 | 日期 |
|------|------|------|------|
| ADR-001 | 采用 Next.js 作为前端框架 | 已采纳 | 2024-01 |
| ADR-002 | 使用 React DnD 实现拖拽 | 已采纳 | 2024-01 |
| ADR-003 | 采用 TypeScript 全栈类型化 | 已采纳 | 2024-01 |
| ADR-004 | 使用本地存储作为主要数据持久化 | 已采纳 | 2024-01 |

## 更新日志

| 日期 | 更新内容 | 负责人 |
|------|----------|--------|
| 2024-01 | 初始架构设计 | Architect |
