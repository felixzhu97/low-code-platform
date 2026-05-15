# C4 模型图 & 沃德利地图

本目录包含低代码平台的 C4 架构模型图和沃德利地图。

## 图示层级


| 层级               | 描述                        | 文件                    |
| ---------------- | ------------------------- | --------------------- |
| **C1 Context**   | 系统上下文图，展示系统全景、用户角色和外部系统关系 | `c4-context.puml`     |
| **C2 Container** | 容器图，展示应用的主要容器、技术选型和依赖关系   | `c4-container.puml`   |
| **C3 Component** | 组件图，展示核心组件的详细结构和交互        | `c4-component-*.puml` |
| **Wardley Map**  | 沃德利地图，展示组件演化和依赖关系            | `wardley-map.puml`    |


## 图片文件

图片位于 `images/` 目录：

- `Low-Code Platform C4 Context Diagram.png` - C1 系统上下文图
- `Low-Code Platform C4 Container Diagram.png` - C2 容器图
- `Component Diagram - Canvas Module.png` - C3 画布组件图
- `Component Diagram - Component Panel Module.png` - C3 面板组件图
- `Component Diagram - Properties Panel Module.png` - C3 属性组件图
- `Wardley Map - Low-Code Platform.png` - 沃德利地图

## 架构概览

### C1 系统上下文图

展示低代码平台与外部系统（Web 浏览器、CDN、Git 服务）的关系，以及三类主要用户（开发者、设计师、管理员）的交互。

### C2 容器图

展示低代码平台内部的主要组件：


| 模块          | 描述                                        |
| ----------- | ----------------------------------------- |
| **Web 客户端** | Next.js 单页应用，作为用户界面入口                     |
| **前端组件层**   | 画布引擎、组件管理器、属性面板、主题编辑器、模板库、代码导出、协作服务、表单构建器 |
| **数据管理层**   | 数据面板、历史记录管理器、持久化管理器                       |
| **业务服务层**   | 组件工厂服务、组件管理服务、数据绑定服务、数据源服务                |
| **UI 组件库**  | 基础 UI 组件（Radix UI）、图表组件（Recharts）、布局组件    |


### C3 组件图

展示核心功能的详细组件结构：


| 文件                             | 描述                      |
| ------------------------------ | ----------------------- |
| `c4-component-canvas.puml`     | 画布组件 - 拖拽、缩放、网格、对齐等核心功能 |
| `c4-component-panel.puml`      | 面板组件 - 左侧组件面板、右侧配置面板结构  |
| `c4-component-properties.puml` | 属性组件 - 组件属性配置、样式编辑、数据绑定 |


## 技术栈


| 技术                    | 用途       |
| --------------------- | -------- |
| Next.js 15 + React 19 | 前端框架     |
| Zustand               | 状态管理     |
| React DnD             | 拖拽功能     |
| Radix UI              | 基础 UI 组件 |
| Tailwind CSS          | 样式       |
| Recharts              | 图表组件     |
| React Hook Form + Zod | 表单验证     |


## 生成图片

如需重新生成图片：

```bash
cd docs/c4
plantuml -DRELATIVE_INCLUDE="relative" c4-context.puml c4-container.puml c4-component-*.puml wardley-map.puml
# PNG 文件会直接生成在 images/ 目录
```

## 沃德利地图 (Wardley Map)

沃德利地图是一种展示技术组件演化和依赖关系的图表，帮助理解：
- 哪些组件是定制的差异化竞争力
- 哪些组件是通用产品
- 哪些组件是标准化基础设施

### 演化阶段

| 阶段 | 说明 | 示例组件 |
|------|------|---------|
| **起源 (Genesis)** | 全新技术，需要大量创新和探索 | - |
| **定制 (Custom)** | 业务定制开发，差异化竞争力 | 可视化编辑器、组件工厂、状态存储 |
| **产品 (Product)** | 通用产品，可配置但非标准化 | 画布组件、图表组件、属性面板 |
| **商品化 (Commodity)** | 标准化基础设施，随处可得 | React、Next.js、Zustand、Tailwind |

### 地图解读

- **顶部层**：面向用户的功能组件（可视化编辑器）
- **中间层**：业务逻辑和组件系统
- **底部层**：基础设施和技术栈

## 查看 PUML 源码

使用 VS Code PlantUML 插件或在线工具查看：

- [PlantUML Online Server](http://www.plantuml.com/plantuml/uml/)

