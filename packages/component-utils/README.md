# @lowcode-platform/component-utils

组件树操作工具包，提供组件树的构建、查找、验证等功能。

## 安装

```bash
pnpm add @lowcode-platform/component-utils
```

## 功能

### 组件树构建

```ts
import { buildComponentTree, flattenComponentTree } from "@lowcode-platform/component-utils";

// 构建组件树
const tree = buildComponentTree(components);

// 扁平化组件树
const flat = flattenComponentTree(tree);
```

### 组件查找

```ts
import {
  findComponentById,
  findComponentsByType,
  findRootComponents,
} from "@lowcode-platform/component-utils";

// 根据 ID 查找
const component = findComponentById(components, "id");

// 根据类型查找
const buttons = findComponentsByType(components, "button");

// 查找根组件
const roots = findRootComponents(components);
```

### 子组件操作

```ts
import {
  getChildComponents,
  getAllChildIds,
  getAllChildComponents,
} from "@lowcode-platform/component-utils";

// 获取直接子组件
const children = getChildComponents(components, "parentId");

// 获取所有子组件 ID
const childIds = getAllChildIds("parentId", components);

// 获取所有子组件
const allChildren = getAllChildComponents("parentId", components);
```

### 组件验证

```ts
import {
  isValidComponent,
  isValidComponentTree,
} from "@lowcode-platform/component-utils";

// 验证单个组件
const isValid = isValidComponent(component);

// 验证组件树
const isValidTree = isValidComponentTree(components);
```

## API 参考

详细的 API 文档请参考源代码中的 JSDoc 注释。

## License

MIT
