# @lowcode-platform/performance

性能优化工具包，提供防抖、节流、懒加载、虚拟滚动、缓存、性能监控等功能。

## 安装

```bash
pnpm add @lowcode-platform/performance
```

## 功能

### 防抖和节流

```ts
import { debounce, throttle } from "@lowcode-platform/performance";

// 防抖
const debouncedFn = debounce(() => {
  console.log("Debounced");
}, 300);

// 节流
const throttledFn = throttle(() => {
  console.log("Throttled");
}, 300);
```

### 懒加载

```ts
import { lazyLoadImage, createLazyLoadObserver } from "@lowcode-platform/performance";

// 懒加载图像
const cleanup = lazyLoadImage(imgElement, "image.jpg");

// 懒加载观察器
const cleanup2 = createLazyLoadObserver(element, async () => {
  // 加载内容
});
```

### 虚拟滚动

```ts
import { calculateVirtualScroll } from "@lowcode-platform/performance";

const result = calculateVirtualScroll(scrollTop, totalItems, {
  itemHeight: 50,
  containerHeight: 500,
});
```

### 缓存管理

```ts
import { MemoryCache } from "@lowcode-platform/performance";

const cache = new MemoryCache<string>();

// 设置缓存（5分钟过期）
cache.set("key", "value", 5 * 60 * 1000);

// 获取缓存
const value = cache.get("key");
```

### 性能监控

```ts
import { PerformanceMonitor } from "@lowcode-platform/performance";

const monitor = new PerformanceMonitor();

// 测量函数执行时间
const result = monitor.measure("operation", () => {
  // 执行操作
});

// 获取指标统计
const stats = monitor.getMetricStats("operation");
```

## API 参考

详细的 API 文档请参考源代码中的 JSDoc 注释。

## License

MIT
