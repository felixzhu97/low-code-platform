# 低代码平台 DDD 架构迁移计划

## 背景介绍

本文档描述了将低代码平台项目从当前结构调整为领域驱动设计(Domain-Driven Design, DDD)架构的计划。这一迁移的目的是让项目结构更加清晰，便于团队理解业务领域，促进代码的可维护性和可扩展性。

## 当前项目结构

目前项目采用了功能分组的结构，主要包含以下目录：

```
/app                 # Next.js 应用入口
/components          # 所有UI组件
/lib                 # 工具函数和类型定义
/public              # 静态资源
/styles              # 全局样式
/hooks               # 自定义React Hooks
```

这种结构对于小型项目来说很有效，但随着项目复杂度增加，会面临以下问题：

1. 难以区分不同业务领域的边界
2. 组件之间的依赖关系不明确
3. 代码重用性较低
4. 团队成员难以理解大局

## 领域划分

通过分析当前代码，我们可以将低代码平台划分为以下核心领域：

### 1. 设计域 (Design Domain)

负责处理与设计画布相关的所有功能：
- 画布渲染与交互
- 组件拖放
- 响应式预览
- 属性面板

### 2. 组件域 (Component Domain)

专注于组件的管理和操作：
- 组件定义与类型
- 组件树管理
- 组件库管理
- 自定义组件构建
- 组件模板

### 3. 数据域 (Data Domain)

处理数据相关的所有方面：
- 数据源定义与管理
- 数据绑定与映射
- 数据验证
- 数据面板UI

### 4. 主题域 (Theme Domain)

负责处理样式和主题相关功能：
- 主题配置
- 颜色管理
- 样式编辑
- 样式应用

### 5. 协作域 (Collaboration Domain)

多人协作功能：
- 用户会话管理
- 实时协作
- 变更冲突解决

### 6. 导出域 (Export Domain)

代码导出与预览：
- 代码生成
- 预览功能
- 导出配置

### 7. 动画域 (Animation Domain)

处理动画相关功能：
- 动画定义
- 动画编辑
- 动画应用

### 8. 共享域 (Shared Domain)

整个应用共享的基础设施：
- 通用类型
- 工具函数
- 共享UI组件
- 常量和配置

## 新的目录结构

```
/src
  /domains
    /design
      /canvas
        canvas.tsx
        canvas-events.ts
        canvas-state.ts
      /properties
        properties-panel.tsx
        property-controls.tsx
      /component-panel
        component-panel.tsx
        component-category.tsx
      /responsive
        responsive-controls.tsx
      /index.ts (导出公共API)

    /component
      /models
        component.ts
        component-types.ts
      /services
        component-registry.ts
        component-factory.ts
      /ui
        component-tree.tsx
        component-library-manager.tsx
        component-grouping.tsx
        custom-component-builder.tsx
      /templates
        templates/
        template-gallery.tsx
        template-preview.tsx
      /index.ts

    /data
      /models
        data-source.ts
        data-mapping.ts
      /services
        data-binding-service.ts
      /ui
        data-panel.tsx
      /index.ts

    /theme
      /models
        theme-config.ts
      /services
        theme-service.ts
      /ui
        theme-editor.tsx
        theme-provider.tsx
        color-picker.tsx
      /index.ts

    /collaboration
      /models
        user.ts
        session.ts
      /services
        collaboration-service.ts
      /ui
        collaboration.tsx
      /index.ts

    /export
      /services
        code-export-service.ts
      /ui
        code-export.tsx
        preview-canvas.tsx
      /index.ts

    /animation
      /models
        animation-types.ts
      /services
        animation-service.ts
      /ui
        animation-editor.tsx
      /index.ts

  /shared
    /types
      common-types.ts
    /utils
      history.ts
      id-generator.ts
      dom-utils.ts
    /hooks
      use-components.ts
      use-history.ts
      use-drag-drop.ts
    /ui
      ui/ (共享UI组件)
    /constants
      defaults.ts

  /app
    layout.tsx
    page.tsx
    globals.css

  /public
    /assets
    /images
```

## 领域模型设计示例

### 组件域模型示例

```typescript
// src/domains/component/models/component.ts
export interface Component {
  id: string;
  type: string;
  name: string;
  position?: {
    x: number;
    y: number;
  };
  properties?: Record<string, any>;
  children?: Component[];
  parentId?: string | null;
  dataSource?: string | null;
  dataMapping?: Record<string, string>;
}

// 值对象
export interface ComponentPosition {
  x: number;
  y: number;
}

// 聚合根
export class ComponentEntity {
  private _component: Component;
  
  constructor(component: Component) {
    this._component = component;
  }
  
  get id(): string {
    return this._component.id;
  }
  
  // 更多属性和方法...
  
  addChild(child: Component): void {
    if (!this._component.children) {
      this._component.children = [];
    }
    child.parentId = this._component.id;
    this._component.children.push(child);
  }
  
  toJSON(): Component {
    return { ...this._component };
  }
}
```

### 设计域服务示例

```typescript
// src/domains/design/canvas/canvas-state.ts
import { Component } from '@/domains/component/models/component';

export interface CanvasState {
  components: Component[];
  selectedId: string | null;
  scale: number;
  position: { x: number, y: number };
}

export interface CanvasStateManager {
  getState(): CanvasState;
  selectComponent(id: string | null): void;
  addComponent(component: Component): void;
  updateComponent(id: string, updates: Partial<Component>): void;
  removeComponent(id: string): void;
  moveComponent(id: string, parentId: string | null): void;
}
```

## 迁移策略

### 1. 建立新目录结构

```bash
mkdir -p src/domains/{design,component,data,theme,collaboration,export,animation}/{models,services,ui}
mkdir -p src/shared/{types,utils,hooks,ui,constants}
mkdir -p src/app
```

### 2. 迁移顺序

1. **共享模块**：首先迁移共享类型和工具函数
2. **核心领域模型**：迁移各个领域的核心模型和实体
3. **领域服务**：迁移或重构领域服务
4. **UI组件**：迁移各个领域的UI组件
5. **应用层**：最后迁移应用入口页面和布局

### 3. 文件迁移对照表

| 原始路径 | 新路径 |
|---------|-------|
| `lib/types.ts` | 拆分到各个领域的 models 目录 |
| `lib/utils.ts` | `src/shared/utils/utils.ts` |
| `lib/history.ts` | `src/shared/utils/history.ts` |
| `components/canvas.tsx` | `src/domains/design/canvas/canvas.tsx` |
| `components/properties-panel.tsx` | `src/domains/design/properties/properties-panel.tsx` |
| `components/component-panel.tsx` | `src/domains/design/component-panel/component-panel.tsx` |
| `components/responsive-controls.tsx` | `src/domains/design/responsive/responsive-controls.tsx` |
| `components/component-tree.tsx` | `src/domains/component/ui/component-tree.tsx` |
| `components/component-library-manager.tsx` | `src/domains/component/ui/component-library-manager.tsx` |
| `components/template-gallery.tsx` | `src/domains/component/templates/template-gallery.tsx` |
| `components/template-preview.tsx` | `src/domains/component/templates/template-preview.tsx` |
| `components/data-panel.tsx` | `src/domains/data/ui/data-panel.tsx` |
| `components/theme-editor.tsx` | `src/domains/theme/ui/theme-editor.tsx` |
| `components/theme-provider.tsx` | `src/domains/theme/ui/theme-provider.tsx` |
| `components/color-picker.tsx` | `src/domains/theme/ui/color-picker.tsx` |
| `components/collaboration.tsx` | `src/domains/collaboration/ui/collaboration.tsx` |
| `components/code-export.tsx` | `src/domains/export/ui/code-export.tsx` |
| `components/preview-canvas.tsx` | `src/domains/export/ui/preview-canvas.tsx` |
| `components/animation-editor.tsx` | `src/domains/animation/ui/animation-editor.tsx` |
| `components/ui/*` | `src/shared/ui/*` |
| `app/page.tsx` | `src/app/page.tsx` |
| `app/layout.tsx` | `src/app/layout.tsx` |
| `app/globals.css` | `src/app/globals.css` |

## 技术注意事项

### 1. 导入路径更新

所有的导入路径都需要更新，例如：

```typescript
// 之前
import { ComponentPanel } from "@/components/component-panel";
import type { Component } from "@/lib/types";

// 之后
import { ComponentPanel } from "@/domains/design/component-panel/component-panel";
import type { Component } from "@/domains/component/models/component";
```

### 2. 循环依赖问题

注意避免领域之间的循环依赖。如果出现，考虑以下解决方案：
- 创建接口并使用依赖注入
- 使用领域事件进行松耦合通信
- 重新思考领域边界，可能需要调整

### 3. 领域边界保护

每个领域都应该通过 `index.ts` 文件只暴露必要的API，隐藏实现细节：

```typescript
// src/domains/component/index.ts
export type { Component } from './models/component';
export { ComponentRegistry } from './services/component-registry';
export { ComponentTree } from './ui/component-tree';
// 不导出内部实现细节
```

### 4. 配置文件更新

需要更新 `tsconfig.json` 和 `next.config.js` 中的路径别名：

```json
// tsconfig.json paths 示例
{
  "paths": {
    "@/*": ["./src/*"],
    "@/domains/*": ["./src/domains/*"],
    "@/shared/*": ["./src/shared/*"],
    "@/app/*": ["./src/app/*"]
  }
}
```

## 迁移检查清单

- [ ] 创建新的目录结构
- [ ] 迁移共享类型和工具函数
- [ ] 迁移领域模型和实体
- [ ] 迁移或创建领域服务
- [ ] 迁移UI组件
- [ ] 更新所有导入路径
- [ ] 添加领域索引文件
- [ ] 更新配置文件
- [ ] 运行测试确保功能正常
- [ ] 检查潜在的循环依赖
- [ ] 代码审查与重构
- [ ] 文档更新

## 迁移后的设计原则

### 1. 领域完整性

每个领域应尽可能自包含，拥有自己的模型、服务和UI组件。

### 2. 松耦合

领域之间应该通过定义良好的接口进行通信，避免紧耦合。

### 3. 领域事件

考虑引入领域事件机制，让不同领域可以在保持低耦合的前提下响应其他领域的变化。

### 4. 聚合根

识别每个领域中的聚合根，通过它们来控制对领域对象的访问。

### 5. 领域服务

对于不属于任何实体的逻辑，创建领域服务来处理。

## 项目发展路线图

完成DDD迁移后，可以考虑以下发展方向：

1. **微前端架构**：将各个领域进一步解耦为独立的微前端
2. **插件系统**：基于DDD结构开发插件系统，让平台更具扩展性
3. **多租户支持**：利用清晰的领域边界添加多租户支持
4. **云原生部署**：将各个领域作为独立服务进行部署

## 结论

领域驱动设计为低代码平台提供了一个清晰的结构，有助于团队更好地理解和开发复杂功能。这种架构不仅提高了代码的可维护性，还为未来的扩展奠定了坚实的基础。

## 参考资料

- 《领域驱动设计：软件核心复杂性应对之道》- Eric Evans
- 《实现领域驱动设计》- Vaughn Vernon
- [领域驱动设计参考](https://www.domainlanguage.com/ddd/reference/) 