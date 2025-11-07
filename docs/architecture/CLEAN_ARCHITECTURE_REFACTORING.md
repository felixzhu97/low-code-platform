# 整洁架构目录优化建议

## 📋 当前问题分析

### 1. 依赖方向混乱

- ❌ `shared/stores` 被多个层直接使用，违反了依赖规则
- ❌ `infrastructure/state-management/stores` 和 `application/stores` 和 `shared/stores` 同时存在，职责不清
- ❌ `presentation` 层可能直接依赖了 `shared/stores`，应该通过接口依赖

### 2. 层职责不清晰

- ❌ `application/services` 和 `domain/services` 职责重叠
- ❌ `application/stores`、`shared/stores`、`infrastructure/state-management/stores` 三处都有状态管理，职责不清
- ❌ `domain/repositories` 目录为空，缺少仓储接口定义

### 3. 目录结构问题

- ❌ `presentation/components` 包含过多内容，缺少模块化
- ❌ `application/use-cases` 目录存在但可能为空，用例未实现
- ❌ `infrastructure/data-sources` 和 `application/services/data-source.service.ts` 职责重叠

## 🎯 优化后的目录结构

```
src/
├── domain/                          # 领域层（最内层，不依赖任何外部层）
│   ├── entities/                    # 实体（业务对象）
│   │   ├── component.entity.ts      # 组件实体
│   │   ├── data-source.entity.ts    # 数据源实体
│   │   ├── template.entity.ts       # 模板实体
│   │   └── index.ts
│   ├── value-objects/               # 值对象
│   │   ├── component-properties.vo.ts
│   │   ├── data-mapping.vo.ts
│   │   ├── position.vo.ts
│   │   └── index.ts
│   ├── repositories/                # 仓储接口（定义，不实现）
│   │   ├── component.repository.ts
│   │   ├── data-source.repository.ts
│   │   ├── template.repository.ts
│   │   └── index.ts
│   ├── services/                    # 领域服务（纯业务逻辑）
│   │   ├── component-factory.service.ts
│   │   ├── component-validator.service.ts
│   │   └── index.ts
│   └── index.ts
│
├── application/                     # 应用层（用例和编排）
│   ├── use-cases/                   # 用例（每个用例一个文件）
│   │   ├── component/
│   │   │   ├── create-component.use-case.ts
│   │   │   ├── update-component.use-case.ts
│   │   │   ├── delete-component.use-case.ts
│   │   │   ├── move-component.use-case.ts
│   │   │   └── index.ts
│   │   ├── canvas/
│   │   │   ├── initialize-canvas.use-case.ts
│   │   │   ├── save-canvas.use-case.ts
│   │   │   ├── load-canvas.use-case.ts
│   │   │   └── index.ts
│   │   ├── data-source/
│   │   │   ├── create-data-source.use-case.ts
│   │   │   ├── fetch-data-source.use-case.ts
│   │   │   └── index.ts
│   │   ├── template/
│   │   │   ├── apply-template.use-case.ts
│   │   │   ├── save-template.use-case.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── dto/                         # 数据传输对象
│   │   ├── component.dto.ts
│   │   ├── canvas.dto.ts
│   │   └── index.ts
│   ├── mappers/                     # 实体与DTO转换
│   │   ├── component.mapper.ts
│   │   ├── canvas.mapper.ts
│   │   └── index.ts
│   ├── ports/                       # 端口（接口定义）
│   │   ├── repositories/            # 仓储端口（继承domain/repositories）
│   │   │   └── index.ts
│   │   ├── services/                # 外部服务端口
│   │   │   ├── storage.port.ts
│   │   │   ├── event-bus.port.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   └── index.ts
│
├── infrastructure/                  # 基础设施层（最外层，实现所有接口）
│   ├── persistence/                 # 持久化实现
│   │   ├── local-storage/
│   │   │   ├── component.repository.impl.ts
│   │   │   ├── data-source.repository.impl.ts
│   │   │   ├── template.repository.impl.ts
│   │   │   └── index.ts
│   │   ├── indexed-db/              # 未来可扩展
│   │   └── api/                     # 未来可扩展
│   ├── state-management/            # 状态管理实现
│   │   ├── zustand/                 # Zustand实现
│   │   │   ├── canvas.store.impl.ts
│   │   │   ├── component.store.impl.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── data-sources/               # 数据源实现
│   │   ├── api-data-source.impl.ts
│   │   ├── static-data-source.impl.ts
│   │   ├── websocket-data-source.impl.ts
│   │   └── index.ts
│   ├── event-bus/                  # 事件总线实现
│   │   ├── event-bus.impl.ts
│   │   └── index.ts
│   └── index.ts
│
├── presentation/                    # 表现层（UI和适配器）
│   ├── adapters/                    # 适配器（连接UI和用例）
│   │   ├── component.adapter.ts
│   │   ├── canvas.adapter.ts
│   │   ├── data-source.adapter.ts
│   │   └── index.ts
│   ├── components/                  # UI组件（按功能模块划分）
│   │   ├── canvas/                  # 画布相关
│   │   │   ├── canvas.tsx
│   │   │   ├── component-panel.tsx
│   │   │   ├── component-tree.tsx
│   │   │   ├── properties-panel.tsx
│   │   │   └── index.ts
│   │   ├── component-renderer/      # 组件渲染器
│   │   │   ├── basic-component-renderer.tsx
│   │   │   ├── chart-component-renderer.tsx
│   │   │   ├── form-component-renderer.tsx
│   │   │   └── index.ts
│   │   ├── charts/                  # 图表组件
│   │   │   ├── area-chart.tsx
│   │   │   ├── bar-chart.tsx
│   │   │   └── index.ts
│   │   ├── forms/                   # 表单组件
│   │   │   ├── form-builder.tsx
│   │   │   └── index.ts
│   │   ├── templates/               # 模板相关
│   │   │   ├── template-gallery.tsx
│   │   │   ├── template-card.tsx
│   │   │   └── index.ts
│   │   └── ui/                      # 基础UI组件（shadcn/ui）
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       └── index.ts
│   ├── hooks/                       # React Hooks（UI相关）
│   │   ├── use-canvas-drag.ts
│   │   ├── use-component-interaction.ts
│   │   └── index.ts
│   ├── providers/                   # Context Providers
│   │   ├── canvas.provider.tsx
│   │   ├── theme.provider.tsx
│   │   └── index.ts
│   └── index.ts
│
├── shared/                          # 共享层（工具和类型）
│   ├── constants/                   # 常量
│   │   ├── breakpoints.ts
│   │   ├── component-types.ts
│   │   └── index.ts
│   ├── types/                       # 共享类型（不涉及业务逻辑）
│   │   ├── common.types.ts
│   │   └── index.ts
│   ├── utils/                       # 工具函数（纯函数）
│   │   ├── validation.utils.ts
│   │   ├── format.utils.ts
│   │   └── index.ts
│   └── index.ts
│
└── app/                             # Next.js App Router（框架层）
    ├── layout.tsx
    ├── page.tsx
    └── globals.css
```

## 🔄 重构步骤

### 阶段 1：领域层重构

1. **拆分实体**

   - 将 `domain/entities/types.ts` 拆分为多个实体文件
   - 每个实体一个文件，包含实体类和业务方法

2. **定义仓储接口**

   - 在 `domain/repositories/` 中定义所有仓储接口
   - 例如：`IComponentRepository`、`IDataSourceRepository`

3. **提取值对象**
   - 将复杂的数据结构提取为值对象
   - 例如：`Position`、`ComponentProperties`

### 阶段 2：应用层重构

1. **实现用例**

   - 将 `application/services` 中的逻辑重构为用例
   - 每个用例负责一个具体的业务操作

2. **定义端口**

   - 在 `application/ports` 中定义外部依赖的接口
   - 例如：存储端口、事件总线端口

3. **创建 DTO 和 Mapper**
   - 定义 DTO 用于层间数据传输
   - 创建 Mapper 进行实体和 DTO 转换

### 阶段 3：基础设施层重构

1. **实现仓储**

   - 在 `infrastructure/persistence` 中实现所有仓储接口
   - 使用依赖注入，让应用层依赖接口而非实现

2. **重构状态管理**

   - 将 `shared/stores` 和 `infrastructure/state-management/stores` 合并
   - 所有状态管理实现放在 `infrastructure/state-management`

3. **实现数据源**
   - 将数据源实现移到 `infrastructure/data-sources`
   - 实现数据源接口

### 阶段 4：表现层重构

1. **创建适配器**

   - 在 `presentation/adapters` 中创建适配器
   - 适配器负责调用用例，并将结果转换为 UI 所需格式

2. **重组组件**
   - 按功能模块重新组织 `presentation/components`
   - 保持组件职责单一

### 阶段 5：清理共享层

1. **移除业务逻辑**

   - 确保 `shared` 层只包含工具函数和类型定义
   - 不包含任何业务逻辑

2. **类型定义**
   - 将纯类型定义移到 `shared/types`
   - 业务相关的类型定义应该在 `domain` 层

## 📐 依赖规则

### 依赖方向（从外到内）

```
app → presentation → application → domain
                    ↓
              infrastructure → domain
```

### 各层职责

1. **Domain（领域层）**

   - ✅ 包含业务实体、值对象、领域服务
   - ✅ 定义仓储接口（不实现）
   - ❌ 不依赖任何外部层
   - ❌ 不包含框架代码

2. **Application（应用层）**

   - ✅ 包含用例（Use Cases）
   - ✅ 定义端口（Ports）接口
   - ✅ 编排领域服务
   - ❌ 不包含 UI 代码
   - ❌ 不包含框架实现

3. **Infrastructure（基础设施层）**

   - ✅ 实现所有接口（仓储、端口等）
   - ✅ 包含框架相关代码（Zustand、LocalStorage 等）
   - ❌ 不包含业务逻辑

4. **Presentation（表现层）**

   - ✅ 包含 UI 组件和适配器
   - ✅ 通过适配器调用用例
   - ❌ 不直接调用基础设施层
   - ❌ 不包含业务逻辑

5. **Shared（共享层）**
   - ✅ 包含纯工具函数
   - ✅ 包含共享类型定义
   - ❌ 不包含业务逻辑
   - ❌ 不包含框架代码

## 🎨 示例：组件创建用例

### Domain 层 - 实体

```typescript
// domain/entities/component.entity.ts
export class ComponentEntity {
  constructor(
    public readonly id: string,
    public readonly type: string,
    public readonly name: string,
    public readonly properties: ComponentProperties,
    public readonly position?: Position
  ) {}

  updateProperties(properties: Partial<ComponentProperties>): ComponentEntity {
    return new ComponentEntity(
      this.id,
      this.type,
      this.name,
      { ...this.properties, ...properties },
      this.position
    );
  }
}
```

### Domain 层 - 仓储接口

```typescript
// domain/repositories/component.repository.ts
export interface IComponentRepository {
  save(component: ComponentEntity): Promise<void>;
  findById(id: string): Promise<ComponentEntity | null>;
  findAll(): Promise<ComponentEntity[]>;
  delete(id: string): Promise<void>;
}
```

### Application 层 - 用例

```typescript
// application/use-cases/component/create-component.use-case.ts
export class CreateComponentUseCase {
  constructor(
    private componentRepository: IComponentRepository,
    private componentFactory: ComponentFactoryService
  ) {}

  async execute(command: CreateComponentCommand): Promise<ComponentEntity> {
    const component = this.componentFactory.create(
      command.type,
      command.name,
      command.properties
    );

    await this.componentRepository.save(component);
    return component;
  }
}
```

### Infrastructure 层 - 仓储实现

```typescript
// infrastructure/persistence/local-storage/component.repository.impl.ts
export class LocalStorageComponentRepository implements IComponentRepository {
  async save(component: ComponentEntity): Promise<void> {
    // 实现保存逻辑
  }

  async findById(id: string): Promise<ComponentEntity | null> {
    // 实现查找逻辑
  }

  // ... 其他方法
}
```

### Presentation 层 - 适配器

```typescript
// presentation/adapters/component.adapter.ts
export class ComponentAdapter {
  constructor(private createComponentUseCase: CreateComponentUseCase) {}

  async createComponent(type: string, name: string) {
    const component = await this.createComponentUseCase.execute({
      type,
      name,
      properties: {},
    });
    return component;
  }
}
```

## ✅ 检查清单

重构完成后，检查以下事项：

- [ ] Domain 层不依赖任何外部层
- [ ] Application 层只依赖 Domain 层
- [ ] Infrastructure 层实现所有接口
- [ ] Presentation 层通过适配器调用用例
- [ ] 所有业务逻辑在 Domain 或 Application 层
- [ ] 没有循环依赖
- [ ] 每个用例职责单一
- [ ] 仓储接口在 Domain 层定义，实现在 Infrastructure 层

## 📚 参考资源

- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Hexagonal Architecture (Ports & Adapters)](https://alistair.cockburn.us/hexagonal-architecture/)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
