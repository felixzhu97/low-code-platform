# @lowcode-platform/performance

性能优化工具库，提供防抖、节流、缓存、虚拟滚动、懒加载、性能监控等性能优化工具。

## 功能

- **防抖/节流**: 限制函数执行频率
- **缓存管理**: 内存缓存和 LRU 缓存
- **虚拟滚动**: 计算可见区域，优化长列表渲染
- **懒加载**: 图片和模块懒加载
- **性能监控**: Performance API 封装
- **批量操作**: 批量处理工具

## 安装

```bash
pnpm add @lowcode-platform/performance
```

## 使用方法

### 防抖/节流

```typescript
import { debounce, throttle } from "@lowcode-platform/performance";

// 防抖：延迟执行，直到停止调用一段时间后
const debouncedSearch = debounce((query: string) => {
  console.log("Search:", query);
}, 300);

// 节流：限制执行频率，最多每 300ms 执行一次
const throttledScroll = throttle(() => {
  console.log("Scroll event");
}, 300);
```

### 缓存

```typescript
import { MemoryCache, LRUCache, cached } from "@lowcode-platform/performance";

// 内存缓存（带 TTL）
const cache = new MemoryCache<string, string>();
cache.set("key", "value", 5000); // 5 秒过期
const value = cache.get("key");

// LRU 缓存
const lruCache = new LRUCache<string, number>(100); // 最多 100 项

// 函数缓存
const expensiveFunction = cached((n: number) => {
  // 复杂计算
  return n * n;
});
```

### 虚拟滚动

```typescript
import {
  calculateVisibleRange,
  getVisibleItems,
} from "@lowcode-platform/performance";

const { start, end } = calculateVisibleRange(
  scrollTop,
  containerHeight,
  itemHeight,
  totalItems
);

const { visibleItems, offsetY } = getVisibleItems(
  allItems,
  scrollTop,
  containerHeight,
  itemHeight
);
```

### 懒加载

```typescript
import {
  lazyLoadImage,
  createLazyLoader,
  lazyLoadModule,
} from "@lowcode-platform/performance";

// 懒加载图片
await lazyLoadImage("/path/to/image.jpg");

// Intersection Observer 懒加载
const loader = createLazyLoader((entry) => {
  const img = entry.target as HTMLImageElement;
  img.src = img.dataset.src || "";
});

loader.observe(imageElement);

// 懒加载模块
const module = await lazyLoadModule("./my-module");
```

### 性能监控

```typescript
import {
  measure,
  measureAsync,
  PerformanceMonitor,
  getMemoryUsage,
} from "@lowcode-platform/performance";

// 测量同步函数
const { result, duration } = measure(() => {
  // 执行操作
}, "operation-label");

// 测量异步函数
const { result, duration } = await measureAsync(async () => {
  // 异步操作
}, "async-operation");

// 使用监控器
const monitor = new PerformanceMonitor();
monitor.mark("start");
// ... 执行操作
monitor.mark("end");
const duration = monitor.measure("start", "end");

// 获取内存使用情况
const memory = getMemoryUsage();
if (memory) {
  console.log(`Memory: ${memory.percentage.toFixed(2)}%`);
}
```

### 批量操作

```typescript
import {
  batchProcess,
  batchProcessWithConcurrency,
  debounceBatch,
} from "@lowcode-platform/performance";

// 批量处理
await batchProcess(items, 10, async (batch) => {
  // 处理每个批次
});

// 并发批量处理
await batchProcessWithConcurrency(
  items,
  10,
  async (batch) => {
    // 处理每个批次
  },
  3 // 最多 3 个并发批次
);

// 防抖批量处理
const batchProcessor = debounceBatch(async (items) => {
  // 处理批量数据
}, 300);

batchProcessor.add(item1);
batchProcessor.add(item2);
// 300ms 后自动处理
await batchProcessor.flush(); // 立即处理
```

## API 参考

### 防抖/节流

- `debounce<T>(fn: T, delay?: number, immediate?: boolean): T`
- `debounceWithCancel<T>(fn: T, delay?: number, immediate?: boolean): T & { cancel: () => void }`
- `throttle<T>(fn: T, delay?: number, leading?: boolean, trailing?: boolean): T`
- `throttleWithCancel<T>(fn: T, delay?: number, leading?: boolean, trailing?: boolean): T & { cancel: () => void }`

### 缓存

- `MemoryCache<K, V>` - 内存缓存类（支持 TTL）
- `LRUCache<K, V>` - LRU 缓存类
- `cached<K, V>(fn: (key: K) => V, cache?: MemoryCache<K, V>): (key: K) => V`

### 虚拟滚动

- `calculateVisibleRange(scrollTop, containerHeight, itemHeight, totalItems, overscan?): { start: number; end: number }`
- `calculateTotalHeight(itemCount, itemHeight): number`
- `calculateOffset(index, itemHeight): number`
- `getVisibleItems<T>(items, scrollTop, containerHeight, itemHeight, overscan?): { visibleItems: T[]; startIndex: number; endIndex: number; offsetY: number }`

### 懒加载

- `lazyLoadImage(src: string): Promise<HTMLImageElement>`
- `createLazyLoader(callback, options?): { observe, unobserve, disconnect }`
- `lazyLoadModule<T>(modulePath: string): Promise<T>`
- `createLazyComponent<T>(importFn): () => Promise<T>`
- `batchLoad<T>(loaders, batchSize?): Promise<T[]>`

### 性能监控

- `measure<T>(fn: () => T, label?): { result: T; duration: number }`
- `measureAsync<T>(fn: () => Promise<T>, label?): Promise<{ result: T; duration: number }>`
- `PerformanceMonitor` - 性能监控器类
- `getMemoryUsage(): { used: number; total: number; percentage: number } | null`

### 批量操作

- `batchProcess<T, R>(items, batchSize, processor): Promise<R[]>`
- `batchProcessWithConcurrency<T, R>(items, batchSize, processor, concurrency?): Promise<R[]>`
- `debounceBatch<T, R>(processor, delay?): { add, flush, cancel }`

## 导出路径

包支持多个导出路径，方便按需导入：

- `@lowcode-platform/performance` - 所有导出
- `@lowcode-platform/performance/debounce` - 防抖工具
- `@lowcode-platform/performance/throttle` - 节流工具
- `@lowcode-platform/performance/cache` - 缓存工具
- `@lowcode-platform/performance/virtual` - 虚拟滚动工具
- `@lowcode-platform/performance/lazy-load` - 懒加载工具
- `@lowcode-platform/performance/monitor` - 性能监控工具
- `@lowcode-platform/performance/batch` - 批量操作工具

## 许可证

MIT
