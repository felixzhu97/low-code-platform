# 低代码平台 DDD 架构实施指南

## 实施步骤

### 第一阶段：准备工作

1. **创建新的目录结构**
   ```bash
   # 创建src目录
   mkdir -p src
   
   # 创建领域目录
   mkdir -p src/domains/{design,component,data,theme,collaboration,export,animation}
   
   # 为每个领域创建子目录
   mkdir -p src/domains/design/{models,services,ui,canvas,properties,component-panel,responsive}
   mkdir -p src/domains/component/{models,services,ui,templates}
   mkdir -p src/domains/data/{models,services,ui}
   mkdir -p src/domains/theme/{models,services,ui}
   mkdir -p src/domains/collaboration/{models,services,ui}
   mkdir -p src/domains/export/{models,services,ui}
   mkdir -p src/domains/animation/{models,services,ui}
   
   # 创建共享目录
   mkdir -p src/shared/{types,utils,hooks,ui,constants}
   
   # 创建应用目录
   mkdir -p src/app
   ```

2. **分析现有代码依赖关系**
   - 分析 `lib/types.ts` 中的类型定义，确定各个领域的核心模型
   - 分析组件间的依赖关系，确定合理的迁移顺序
   - 绘制当前项目的依赖图，明确潜在的循环依赖

3. **制定迁移计划文档**
   - 文件迁移对照表（已完成）
   - 项目里程碑和时间节点

### 第二阶段：核心迁移

1. **迁移共享类型和工具函数**
   ```bash
   # 复制并拆分lib/types.ts到相应领域
   cp lib/types.ts src/shared/types/common-types.ts
   
   # 移动工具函数
   cp lib/utils.ts src/shared/utils/utils.ts
   cp lib/history.ts src/shared/utils/history.ts
   ```

2. **构建领域模型**
   - 为每个领域创建核心模型文件
   - 示例：`src/domains/component/models/component.ts`

3. **迁移UI组件**
   ```bash
   # 示例：迁移设计域组件
   cp components/canvas.tsx src/domains/design/canvas/canvas.tsx
   cp components/properties-panel.tsx src/domains/design/properties/properties-panel.tsx
   cp components/component-panel.tsx src/domains/design/component-panel/component-panel.tsx
   
   # 示例：迁移组件域UI
   cp components/component-tree.tsx src/domains/component/ui/component-tree.tsx
   cp components/component-library-manager.tsx src/domains/component/ui/component-library-manager.tsx
   ```

4. **迁移共享UI组件**
   ```bash
   # 复制UI组件库
   cp -r components/ui/* src/shared/ui/
   ```

5. **迁移应用入口**
   ```bash
   cp app/page.tsx src/app/page.tsx
   cp app/layout.tsx src/app/layout.tsx
   cp app/globals.css src/app/globals.css
   ```

### 第三阶段：重构与优化

1. **更新导入路径**
   - 使用脚本批量更新导入路径
   - 编写脚本示例：
   ```javascript
   // update-imports.js
   const fs = require('fs');
   const path = require('path');
   
   // 定义路径映射关系
   const pathMapping = {
     '@/components/component-panel': '@/domains/design/component-panel/component-panel',
     '@/lib/types': '@/shared/types/common-types',
     // 更多映射...
   };
   
   // 递归处理目录
   function processDirectory(directory) {
     const files = fs.readdirSync(directory);
     
     files.forEach(file => {
       const filePath = path.join(directory, file);
       const stats = fs.statSync(filePath);
       
       if (stats.isDirectory()) {
         processDirectory(filePath);
       } else if (stats.isFile() && (filePath.endsWith('.ts') || filePath.endsWith('.tsx'))) {
         updateImports(filePath);
       }
     });
   }
   
   // 更新文件中的导入路径
   function updateImports(filePath) {
     let content = fs.readFileSync(filePath, 'utf8');
     let modified = false;
     
     for (const [oldPath, newPath] of Object.entries(pathMapping)) {
       const regex = new RegExp(`from ["']${oldPath}["']`, 'g');
       if (regex.test(content)) {
         content = content.replace(regex, `from "${newPath}"`);
         modified = true;
       }
     }
     
     if (modified) {
       fs.writeFileSync(filePath, content, 'utf8');
       console.log(`Updated imports in: ${filePath}`);
     }
   }
   
   // 开始处理
   processDirectory('./src');
   ```

2. **添加领域索引文件**
   - 为每个领域创建 `index.ts` 文件，只暴露必要的公共API

3. **更新配置文件**
   - 修改 `tsconfig.json` 和 `next.config.js` 中的路径别名

4. **领域服务开发**
   - 根据需要创建领域服务，实现领域逻辑

## 迁移注意事项

### 1. 保持项目功能稳定

- **采用增量式迁移**：每次只迁移一个小模块，确保功能正常后再继续
- **编写测试**：为关键组件和功能编写单元测试
- **设置临时兼容层**：在迁移过程中可能需要临时兼容层，让新旧代码共存

### 2. 避免循环依赖

- **依赖注入**：使用依赖注入解决跨领域依赖
- **领域事件**：通过事件机制实现松耦合通信
- **共享类型**：将多个领域依赖的类型放在共享类型目录

### 3. 保持团队同步

- **代码评审**：对每个迁移PR进行严格代码评审
- **文档更新**：及时更新设计文档和开发指南
- **团队培训**：确保所有开发人员理解DDD概念和新的项目结构

## 技术债务处理

1. **识别并记录技术债务**
   - 列出迁移过程中发现的技术债务
   - 使用TODO注释标记需要优化的代码

2. **制定清理计划**
   - 将技术债务按优先级分类
   - 安排专门的时间来解决技术债务

3. **重构指南**
   - 提供重构的最佳实践和模式
   - 确保重构过程不影响功能稳定性

## 迁移后验证清单

- [ ] 所有功能正常工作
- [ ] 没有循环依赖
- [ ] 导入路径全部更新
- [ ] 测试通过
- [ ] 构建过程正常
- [ ] 文档更新完成
- [ ] 性能指标未下降

## DDD实践指南

### 1. 实体与值对象

- **实体**：具有唯一标识的对象（如组件、画布）
- **值对象**：没有唯一标识，通过属性定义的对象（如位置、尺寸）

```typescript
// 实体示例
export class Component {
  readonly id: string;
  // 其他属性和方法...
}

// 值对象示例
export class Position {
  constructor(public readonly x: number, public readonly y: number) {}
  
  static zero(): Position {
    return new Position(0, 0);
  }
  
  translate(dx: number, dy: number): Position {
    return new Position(this.x + dx, this.y + dy);
  }
}
```

### 2. 聚合与聚合根

- **聚合**：一组相关对象的集合，通过聚合根访问
- **聚合根**：聚合的入口点，负责维护聚合的一致性

```typescript
// 聚合根示例
export class ComponentTree {
  private readonly components: Map<string, Component> = new Map();
  
  getComponent(id: string): Component | undefined {
    return this.components.get(id);
  }
  
  addComponent(component: Component): void {
    this.components.set(component.id, component);
  }
  
  // 其他方法...
}
```

### 3. 领域事件

- **定义事件**：为重要的域变化定义事件
- **发布与订阅**：实现事件的发布与订阅机制

```typescript
// 领域事件示例
export interface DomainEvent {
  readonly type: string;
  readonly timestamp: Date;
}

export class ComponentAddedEvent implements DomainEvent {
  readonly type = 'component.added';
  readonly timestamp = new Date();
  
  constructor(public readonly component: Component) {}
}

// 事件总线
export class EventBus {
  private listeners: Map<string, Function[]> = new Map();
  
  subscribe(eventType: string, callback: Function): void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType)!.push(callback);
  }
  
  publish(event: DomainEvent): void {
    const eventListeners = this.listeners.get(event.type) || [];
    for (const listener of eventListeners) {
      listener(event);
    }
  }
}
```

## 结语

DDD架构迁移是一项复杂但值得的工作。通过系统性地将代码组织到明确的领域中，我们将获得更好的可维护性、可扩展性和团队协作效率。请遵循本指南中的步骤，并始终关注功能稳定性和代码质量。 