# 整洁架构快速参考指南

## 🎯 核心原则

### 依赖规则

**依赖方向必须从外到内**，内层不能依赖外层。

```
外层 → 内层 ✅
内层 → 外层 ❌
```

### 层职责

| 层                 | 职责     | 可以包含                         | 不能包含                    |
| ------------------ | -------- | -------------------------------- | --------------------------- |
| **Domain**         | 业务核心 | 实体、值对象、领域服务、仓储接口 | 框架代码、UI 代码、具体实现 |
| **Application**    | 用例编排 | 用例、DTO、Mapper、端口接口      | UI 代码、框架实现           |
| **Infrastructure** | 技术实现 | 仓储实现、状态管理、数据源实现   | 业务逻辑                    |
| **Presentation**   | 用户界面 | UI 组件、适配器、Hooks           | 业务逻辑、直接调用基础设施  |

## 📂 文件放置决策树

### 问题：这个代码应该放在哪里？

```
开始
  │
  ├─ 是业务实体或业务规则？
  │   └─ 是 → domain/entities/
  │
  ├─ 是值对象（不可变数据结构）？
  │   └─ 是 → domain/value-objects/
  │
  ├─ 是仓储接口定义？
  │   └─ 是 → domain/repositories/
  │
  ├─ 是纯业务逻辑服务？
  │   └─ 是 → domain/services/
  │
  ├─ 是具体的业务用例？
  │   └─ 是 → application/use-cases/
  │
  ├─ 是数据传输对象？
  │   └─ 是 → application/dto/
  │
  ├─ 是实体和DTO的转换？
  │   └─ 是 → application/mappers/
  │
  ├─ 是外部依赖的接口定义？
  │   └─ 是 → application/ports/
  │
  ├─ 是仓储的具体实现？
  │   └─ 是 → infrastructure/persistence/
  │
  ├─ 是状态管理实现？
  │   └─ 是 → infrastructure/state-management/
  │
  ├─ 是数据源实现？
  │   └─ 是 → infrastructure/data-sources/
  │
  ├─ 是UI组件？
  │   └─ 是 → presentation/components/
  │
  ├─ 是连接UI和用例的适配器？
  │   └─ 是 → presentation/adapters/
  │
  ├─ 是React Hook（UI相关）？
  │   └─ 是 → presentation/hooks/
  │
  └─ 是纯工具函数或共享类型？
      └─ 是 → shared/utils/ 或 shared/types/
```

## 🔍 常见场景示例

### 场景 1：创建组件功能

**需求**：用户点击按钮，创建一个新组件

**实现步骤**：

1. **Domain 层** - 定义实体和仓储接口

```typescript
// domain/entities/component.entity.ts
export class ComponentEntity {
  // 实体定义
}

// domain/repositories/component.repository.ts
export interface IComponentRepository {
  save(component: ComponentEntity): Promise<void>;
}
```

2. **Application 层** - 实现用例

```typescript
// application/use-cases/component/create-component.use-case.ts
export class CreateComponentUseCase {
  constructor(private repository: IComponentRepository) {}

  async execute(command: CreateComponentCommand) {
    // 用例逻辑
  }
}
```

3. **Infrastructure 层** - 实现仓储

```typescript
// infrastructure/persistence/local-storage/component.repository.impl.ts
export class LocalStorageComponentRepository implements IComponentRepository {
  // 实现接口
}
```

4. **Presentation 层** - 创建适配器和 UI

```typescript
// presentation/adapters/component.adapter.ts
export class ComponentAdapter {
  constructor(private createComponentUseCase: CreateComponentUseCase) {}

  async createComponent(type: string) {
    return this.createComponentUseCase.execute({ type });
  }
}

// presentation/components/canvas/component-panel.tsx
export function ComponentPanel() {
  const adapter = useComponentAdapter();

  const handleCreate = async () => {
    await adapter.createComponent("button");
  };

  return <button onClick={handleCreate}>创建组件</button>;
}
```

### 场景 2：数据源获取

**需求**：组件需要从 API 获取数据

**实现步骤**：

1. **Domain 层** - 定义实体

```typescript
// domain/entities/data-source.entity.ts
export class DataSourceEntity {
  // 数据源实体
}
```

2. **Application 层** - 定义端口和用例

```typescript
// application/ports/services/http-client.port.ts
export interface IHttpClient {
  get<T>(url: string): Promise<T>;
}

// application/use-cases/data-source/fetch-data-source.use-case.ts
export class FetchDataSourceUseCase {
  constructor(private httpClient: IHttpClient) {}

  async execute(id: string) {
    return this.httpClient.get(`/api/data-sources/${id}`);
  }
}
```

3. **Infrastructure 层** - 实现端口

```typescript
// infrastructure/data-sources/http-client.impl.ts
export class FetchHttpClient implements IHttpClient {
  async get<T>(url: string): Promise<T> {
    // 使用 fetch 实现
  }
}
```

### 场景 3：状态管理

**需求**：管理画布状态（是否预览模式、网格显示等）

**实现步骤**：

1. **Application 层** - 定义状态端口（可选）

```typescript
// application/ports/services/state-store.port.ts
export interface IStateStore<T> {
  getState(): T;
  setState(state: Partial<T>): void;
  subscribe(callback: (state: T) => void): () => void;
}
```

2. **Infrastructure 层** - 使用 Zustand 实现

```typescript
// infrastructure/state-management/zustand/canvas.store.impl.ts
import { create } from "zustand";
import type { IStateStore } from "@/application/ports/services/state-store.port";

export const useCanvasStore = create<CanvasState>((set) => ({
  isPreviewMode: false,
  setPreviewMode: (preview) => set({ isPreviewMode: preview }),
}));
```

3. **Presentation 层** - 在组件中使用

```typescript
// presentation/components/canvas/canvas.tsx
export function Canvas() {
  const isPreviewMode = useCanvasStore((s) => s.isPreviewMode);
  // 使用状态
}
```

## ⚠️ 常见错误

### ❌ 错误 1：Presentation 直接调用 Infrastructure

```typescript
// ❌ 错误
import { LocalStorageComponentRepository } from "@/infrastructure/persistence";

export function ComponentPanel() {
  const repo = new LocalStorageComponentRepository();
  // 直接使用基础设施层
}
```

```typescript
// ✅ 正确
import { ComponentAdapter } from "@/presentation/adapters";

export function ComponentPanel() {
  const adapter = useComponentAdapter();
  // 通过适配器调用
}
```

### ❌ 错误 2：Domain 依赖外部层

```typescript
// ❌ 错误
// domain/entities/component.entity.ts
import { useStore } from "zustand"; // 依赖框架

export class ComponentEntity {
  // ...
}
```

```typescript
// ✅ 正确
// domain/entities/component.entity.ts
export class ComponentEntity {
  // 纯业务逻辑，无外部依赖
}
```

### ❌ 错误 3：业务逻辑在 Infrastructure

```typescript
// ❌ 错误
// infrastructure/persistence/local-storage/component.repository.impl.ts
export class LocalStorageComponentRepository {
  async save(component: ComponentEntity) {
    // ❌ 业务逻辑不应该在这里
    if (component.type === "button" && !component.name) {
      throw new Error("Button must have name");
    }
    // ...
  }
}
```

```typescript
// ✅ 正确
// domain/services/component-validator.service.ts
export class ComponentValidatorService {
  validate(component: ComponentEntity): void {
    if (component.type === "button" && !component.name) {
      throw new Error("Button must have name");
    }
  }
}

// application/use-cases/component/create-component.use-case.ts
export class CreateComponentUseCase {
  constructor(
    private validator: ComponentValidatorService,
    private repository: IComponentRepository
  ) {}

  async execute(command: CreateComponentCommand) {
    const component = new ComponentEntity(/* ... */);
    this.validator.validate(component); // 业务逻辑在用例中
    await this.repository.save(component);
  }
}
```

## 🧪 测试策略

### Domain 层测试

- 单元测试，不依赖外部
- 测试业务规则和实体方法

### Application 层测试

- 使用 Mock 仓储和端口
- 测试用例逻辑

### Infrastructure 层测试

- 集成测试
- 测试具体实现

### Presentation 层测试

- 组件测试
- 使用测试工具（React Testing Library）

## 📚 命名规范

### 文件命名

- 实体：`*.entity.ts`
- 值对象：`*.vo.ts`
- 仓储接口：`*.repository.ts`
- 仓储实现：`*.repository.impl.ts`
- 用例：`*.use-case.ts`
- 适配器：`*.adapter.ts`
- DTO：`*.dto.ts`

### 类命名

- 实体：`ComponentEntity`
- 仓储接口：`IComponentRepository`
- 仓储实现：`LocalStorageComponentRepository`
- 用例：`CreateComponentUseCase`
- 适配器：`ComponentAdapter`

## 🔗 相关文档

- [详细重构方案](./CLEAN_ARCHITECTURE_REFACTORING.md)
- [架构对比](./ARCHITECTURE_COMPARISON.md)
- [C4 架构图](../architecture/README.md)
