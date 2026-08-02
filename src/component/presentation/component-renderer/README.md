# 组件渲染器 (Component Renderer)

## 概述

组件渲染器是按照 DDD 架构重构的结果，将原本复杂的 Canvas 组件渲染逻辑分解为多个专门的渲染器模块，大大提高了代码的复用性和可维护性。

## 架构设计

### 主渲染器

- **`index.tsx`** - 主要的组件渲染器，负责分发不同类型的组件到对应的子渲染器

### 子渲染器

- **`basic-component-renderer.tsx`** - 基础组件渲染器
  - 处理: text, button, image, divider
- **`chart-component-renderer.tsx`** - 图表组件渲染器
  - 处理: bar-chart, line-chart, pie-chart, area-chart, gauge 等图表组件
- **`form-component-renderer.tsx`** - 表单组件渲染器
  - 处理: input, textarea, select, checkbox, radio
- **`data-component-renderer.tsx`** - 数据组件渲染器
  - 处理: data-table, data-list, data-card
- **`layout-component-renderer.tsx`** - 布局组件渲染器
  - 处理: container, grid-layout, flex-layout, card, row, column 等容器组件

## 使用方式

```tsx
import { ComponentRenderer } from "@/presentation/components/component-renderer";

<ComponentRenderer
  component={component}
  parentComponent={parentComponent}
  components={components}
  theme={theme}
  isPreviewMode={isPreviewMode}
  selectedId={selectedId}
  dropTargetId={dropTargetId}
  onSelectComponent={handleSelectComponent}
  onMouseDown={handleMouseDown}
  componentData={componentData}
/>;
```

## 优势

1. **单一职责原则** - 每个渲染器只负责特定类型的组件
2. **易于扩展** - 新增组件类型只需创建新的子渲染器
3. **高复用性** - 各个渲染器可以独立使用
4. **易于测试** - 每个渲染器都可以独立测试
5. **清晰的关注点分离** - 不同类型组件的渲染逻辑完全分离

## 扩展指南

要添加新的组件类型：

1. 在对应的子渲染器中添加新的 case
2. 或者创建新的专门渲染器
3. 在主渲染器中添加分发逻辑

## 依赖关系

- 依赖 Domain 层的类型定义
- 依赖 Application 层的工具函数
- 依赖 Presentation 层的 UI 组件
