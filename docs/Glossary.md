# Glossary | 领域术语表

> Low-Code Platform — Ubiquitous Language（统一语言）

---

## 1. Purpose | 文档说明

This document defines the project **Ubiquitous Language**. English terms are the **preferred canonical names** and must align with code and architecture naming. Chinese labels are for localization and stakeholder communication only.

### Maintenance Principles

1. **Glossary first**: Add or update terms here before implementing code
2. **Code sync**: Domain model changes (entity, value object, enum) must update the corresponding glossary entry
3. **Preferred term**: Use the **Preferred Term (English)** column for code, commits, and technical docs

### Reference Rules

| Scenario | Rule |
| -------- | ---- |
| TypeScript / commits | Use Preferred Term (English) |
| Jira / user stories | English preferred; Chinese may appear in parentheses for clarity |
| UI copy | Map English preferred terms to localized UI copy |
| Cross-team communication | Lead with English; add Chinese when needed |

---

## 2. Business Domains | 业务域总览

| Preferred Term | 中文 | Code Path | UI Area | Notes |
| -------------- | ---- | --------- | ------- | ----- |
| Canvas | 画布 | `presentation/components/canvas/` | Center editor | Drag-drop layout, preview, component tree |
| Component | 组件 | `domain/entities/`, `domain/services/` | Left panel + canvas nodes | Built-in + custom components |
| Properties | 属性配置 | `presentation/components/canvas/properties-panel.tsx` | Right panel | Style / data / interaction props |
| Template | 模板 | `presentation/components/templates/` | Template gallery | Prefabricated page layouts |
| Theme | 主题 | `shared/stores/theme.store.ts` | Theme editor | Colors, typography, CSS variables |
| Animation | 动画 | `presentation/components/ui/animation-editor.tsx` | Animation editor | Motion presets for components |
| Data Binding | 数据绑定 | `application/services/data-binding.service.ts` | Data panel | Bind components to data sources |
| Data Source | 数据源 | `application/services/data-source.service.ts` | Data panel | Fetch / cache / refresh |
| Form Builder | 表单构建 | `presentation/components/forms/` | Form builder | React Hook Form + Zod |
| Chart | 图表 | `presentation/components/charts/` | Canvas charts | Recharts-based visualizations |
| Code Export | 代码导出 | `presentation/components/` (code export UI) | Export dialog | Generate deployable frontend code |
| History | 历史记录 | `shared/stores/history.store.ts`, `application/services/history.ts` | Undo/redo | Operation history |
| Persistence | 持久化 | `shared/stores/persistence.manager.ts` | LocalStorage | Browser-local project state |
| Collaboration | 协作 | `presentation/components/ui/collaboration.tsx` | Collaboration UI | Planned / partial real-time sync |
| Common | 横切 | `shared/` | — | Hooks, utils, cross-cutting stores |

**Architecture layers (canonical)**

| Layer | Path | Responsibility |
| ----- | ---- | -------------- |
| Domain | `src/domain/` | Entities, domain services (factory, types) |
| Application | `src/application/` | Use-case services (management, binding, history) |
| Presentation | `src/presentation/` | React UI, canvas, panels, templates |
| Shared | `src/shared/` | Zustand stores, hooks, persistence |

```mermaid
flowchart TB
  subgraph contexts [BusinessDomains]
    Canvas[Canvas]
    Component[Component]
    Properties[Properties]
    Template[Template]
    Theme[Theme]
    Data[DataBinding]
    Chart[Chart]
    Export[CodeExport]
    History[History]
  end
  User[User] --> Canvas
  User --> Component
  User --> Template
  Canvas --> Component
  Canvas --> Properties
  Component --> Data
  Component --> Chart
  Canvas --> History
  Template --> Canvas
  Theme --> Canvas
  Export --> Component
```

---

## 3. Core Terms | 核心术语

| Preferred Term | 中文 | Definition | Code Anchors |
| -------------- | ---- | ---------- | ------------ |
| Component Instance | 组件实例 | A placed node on the canvas with type, props, and position | `domain/entities/types.ts` |
| Component Factory | 组件工厂 | Creates component instances with defaults by type | `domain/services/` → factory service |
| Component Management | 组件管理 | CRUD / move / select operations over instances | `application/services/component-management.service.ts` |
| Component Panel | 组件面板 | Palette of draggable component types | `presentation/components/canvas/component-panel.tsx` |
| Component Tree | 组件树 | Hierarchical view of canvas instances | `presentation/components/canvas/component-tree.tsx` |
| Component Renderer | 组件渲染器 | Recursively renders layout / data / chart / form nodes | `presentation/components/canvas/component-renderer/` |
| Preview Canvas | 预览画布 | Read-only rendering of the designed page | `presentation/components/canvas/preview-canvas.tsx` |
| Device Preview | 设备预览 | Responsive viewport simulation (desktop/tablet/mobile) | `canvas.store` device type |
| Custom Component | 自定义组件 | User-defined reusable component definition | `shared/stores/custom-components.store.ts` |
| Template Gallery | 模板库 | Browse and apply page templates | `presentation/components/templates/template-gallery.tsx` |
| Theme Config | 主题配置 | Token set for colors, fonts, radii | `ThemeConfig` in domain types / theme store |
| Undo / Redo | 撤销 / 重做 | Walk history stack of canvas mutations | `history.store` |
| Local Persistence | 本地持久化 | Save/load editor state in LocalStorage | `persistence.manager.ts` |

---

## 4. Terms to Avoid | 避免使用的说法

| Avoid | Prefer | Reason |
| ----- | ------ | ------ |
| Page Builder (as domain name) | Canvas + Component | Align with package/UI naming |
| Widget (ambiguous) | Component Instance | Prefer explicit instance term |
| Store (alone) | named store (`ComponentStore`, …) | Disambiguate Zustand modules |
| Backend / API (for core editor) | Local Persistence | Editor is client-side; no first-party REST API today |

---

## 5. Related Living Docs | 关联文档

| Document | Path |
| -------- | ---- |
| Quick Start | [developer/QUICKSTART.md](./developer/QUICKSTART.md) |
| C4 Model | [developer/c4-model/README.md](./developer/c4-model/README.md) |
| User Story Map | [product-owner/User-Story-Map.md](./product-owner/User-Story-Map.md) |
