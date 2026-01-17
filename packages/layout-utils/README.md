# @lowcode-platform/layout-utils

布局计算和位置工具包，提供位置计算、网格对齐、碰撞检测、响应式布局等功能。

## 安装

```bash
pnpm add @lowcode-platform/layout-utils
```

## 功能

### 位置计算

```ts
import { Position } from "@lowcode-platform/layout-utils";

// 创建位置
const pos = Position.create(100, 200);

// 移动位置
const newPos = pos.move(10, 20);

// 对齐到网格
const snapped = pos.snapToGrid(10);
```

### 网格对齐

```ts
import { snapToGrid, alignToGrid } from "@lowcode-platform/layout-utils";

// 对齐坐标到网格
const snapped = snapToGrid(123, 456, 10);
// { x: 120, y: 460 }

const aligned = alignToGrid(123, 10);
// 120
```

### 碰撞检测

```ts
import { detectCollision, getOverlap } from "@lowcode-platform/layout-utils";

// 检测碰撞
const collides = detectCollision(rect1, rect2);

// 获取重叠区域
const overlap = getOverlap(rect1, rect2);
```

### 响应式布局

```ts
import {
  calculateResponsiveWidth,
  calculateResponsiveLayout,
} from "@lowcode-platform/layout-utils";

// 计算响应式宽度
const width = calculateResponsiveWidth(1920, {
  viewportWidth: 1440,
  baseWidth: 1920,
});

// 计算响应式布局
const layout = calculateResponsiveLayout(component, {
  viewportWidth: 1440,
  baseWidth: 1920,
});
```

## API 参考

详细的 API 文档请参考源代码中的 JSDoc 注释。

## License

MIT
