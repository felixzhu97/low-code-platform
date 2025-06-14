# 分层架构迁移实施指南

## 🚀 第一阶段：核心重构示例

### 1. 创建领域实体

```typescript
// src/domain/entities/Component.ts
export class ComponentId {
  constructor(private readonly value: string) {}
  toString(): string {
    return this.value;
  }
}

export class Component {
  constructor(
    public readonly id: ComponentId,
    public readonly type: ComponentType,
    public properties: ComponentProperties,
    public position: Position,
    public readonly parentId?: ComponentId
  ) {}

  updateProperties(properties: ComponentProperties): Component {
    return new Component(
      this.id,
      this.type,
      properties,
      this.position,
      this.parentId
    );
  }
}
```

### 2. 应用服务层

```typescript
// src/application/services/CanvasService.ts
export class CanvasService {
  constructor(
    private readonly componentRepository: ComponentRepository,
    private readonly historyService: HistoryService
  ) {}

  async addComponent(componentData: CreateComponentData): Promise<Component> {
    const component = new Component(
      new ComponentId(generateId()),
      componentData.type,
      componentData.properties,
      componentData.position
    );

    await this.componentRepository.save(component);
    this.historyService.recordAction("ADD_COMPONENT", component);

    return component;
  }

  async updateComponent(
    id: ComponentId,
    properties: ComponentProperties
  ): Promise<void> {
    const component = await this.componentRepository.findById(id);
    if (!component) throw new Error("组件未找到");

    const updatedComponent = component.updateProperties(properties);
    await this.componentRepository.save(updatedComponent);
    this.historyService.recordAction("UPDATE_COMPONENT", updatedComponent);
  }
}
```

### 3. 重构后的画布组件

```typescript
// src/presentation/components/canvas/Canvas.tsx
import { useCanvasService } from "@/application/hooks/useCanvasService";

export function Canvas() {
  const {
    components,
    selectedComponent,
    addComponent,
    updateComponent,
    selectComponent,
  } = useCanvasService();

  const handleDrop = useCallback(
    (item: any, monitor: any) => {
      const position = monitor.getClientOffset();
      addComponent({
        type: item.type,
        properties: item.defaultProperties,
        position: { x: position.x, y: position.y },
      });
    },
    [addComponent]
  );

  return (
    <div className="canvas-container">
      {components.map((component) => (
        <ComponentRenderer
          key={component.id.toString()}
          component={component}
          onUpdate={updateComponent}
          onSelect={selectComponent}
          isSelected={selectedComponent?.id === component.id}
        />
      ))}
    </div>
  );
}
```

## 🔧 状态管理重构

### Zustand Store 示例

```typescript
// src/application/stores/canvasStore.ts
import { create } from "zustand";
import { CanvasService } from "../services/CanvasService";

interface CanvasState {
  components: Component[];
  selectedComponent: Component | null;
  canvasService: CanvasService;

  // Actions
  addComponent: (data: CreateComponentData) => Promise<void>;
  updateComponent: (
    id: ComponentId,
    properties: ComponentProperties
  ) => Promise<void>;
  selectComponent: (component: Component | null) => void;
}

export const useCanvasStore = create<CanvasState>((set, get) => ({
  components: [],
  selectedComponent: null,
  canvasService: new CanvasService(
    new InMemoryComponentRepository(),
    new HistoryService()
  ),

  addComponent: async (data) => {
    const { canvasService } = get();
    const component = await canvasService.addComponent(data);
    set((state) => ({
      components: [...state.components, component],
    }));
  },

  updateComponent: async (id, properties) => {
    const { canvasService } = get();
    await canvasService.updateComponent(id, properties);
    set((state) => ({
      components: state.components.map((comp) =>
        comp.id === id ? comp.updateProperties(properties) : comp
      ),
    }));
  },

  selectComponent: (component) => {
    set({ selectedComponent: component });
  },
}));
```

## 📝 迁移检查清单

### 阶段 1 完成标准

- [ ] 创建所有分层目录
- [ ] 定义核心领域实体
- [ ] 实现基础应用服务
- [ ] 重构主要组件（canvas.tsx）
- [ ] 集成状态管理

### 阶段 2 完成标准

- [ ] 重构属性面板
- [ ] 优化模板系统
- [ ] 实现完整的 CRUD 操作
- [ ] 添加错误处理机制

### 阶段 3 完成标准

- [ ] 性能优化
- [ ] 单元测试覆盖
- [ ] 文档完整性检查
- [ ] 生产环境验证

## ⚡ 快速命令集

```bash
# 创建分层结构
mkdir -p src/{presentation/{components/{canvas,panels,common,layouts},hooks,providers},application/{services,stores,use-cases},domain/{entities,value-objects,repositories,services},infrastructure/{api,storage,repositories}}

# 迁移现有文件
mv components src/presentation/components/legacy
mv lib src/domain/
mv hooks src/presentation/hooks/

# 安装状态管理库
npm install zustand immer

# 启动开发服务器测试
npm run dev
```

## 🎯 成功指标

### 代码质量指标

- 单个文件行数 < 200 行
- 函数复杂度 < 10
- 测试覆盖率 > 80%

### 性能指标

- 首屏渲染时间 < 2s
- 组件渲染时间 < 100ms
- 内存使用稳定

### 开发体验指标

- 新功能开发时间减少 50%
- Bug 修复时间减少 40%
- 代码审查时间减少 30%

## 📚 参考资源

- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [React 架构最佳实践](https://react.dev/learn/thinking-in-react)
