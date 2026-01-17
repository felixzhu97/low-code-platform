# @lowcode-platform/test-utils

共享的测试工具和配置库，用于低代码平台的单元测试。

## 功能

- **Vitest 配置预设**: 为 React 和 TypeScript 项目提供开箱即用的 Vitest 配置
- **Jest 配置预设**: 为 NestJS 和 Node.js 项目提供 Jest 配置预设
- **Mock 工具库**: 预配置的浏览器 API 和 React 组件 Mock
- **测试工具函数**: 增强的 render 和等待工具

## 安装

```bash
pnpm add -D @lowcode-platform/test-utils
```

## 使用方法

### Vitest 配置

在 `vitest.config.mjs` 中使用预设配置：

```typescript
import { defineConfig } from "vitest/config";
import { getVitestConfig } from "@lowcode-platform/test-utils/vitest";

export default defineConfig(
  getVitestConfig({
    environment: "jsdom",
    setupFiles: ["./test/setup.ts"],
    alias: {
      "@": "./src",
      "@/domain": "./src/domain",
    },
  })
);
```

在 `test/setup.ts` 中导入 setup 文件（可选，如果使用默认 Mock）：

```typescript
import "@lowcode-platform/test-utils/vitest/setup";
```

或者手动设置：

```typescript
import { setupVitest } from "@lowcode-platform/test-utils/vitest";

setupVitest();
```

### Jest 配置

在 `jest.config.ts` 中使用预设配置：

```typescript
import type { Config } from "jest";
import { getJestConfig } from "@lowcode-platform/test-utils/jest";

export default getJestConfig({
  rootDir: "src",
  testEnvironment: "node",
  testRegex: ".*\\.spec\\.ts$",
}) as Config;
```

### 使用 Mock 工具

#### 浏览器 API Mock

```typescript
import { mockBrowserAPIs } from "@lowcode-platform/test-utils/mocks";
import { vi } from "vitest";

mockBrowserAPIs(vi);
// 现在 window.matchMedia, ResizeObserver, IntersectionObserver 等已被 Mock
```

#### React 组件 Mock

```typescript
import { mockReactIcons } from "@lowcode-platform/test-utils/mocks";
import { vi } from "vitest";

mockReactIcons(vi);
// lucide-react 图标现在已被 Mock
```

### 使用测试工具函数

#### 自定义 Render 函数

```typescript
import { render } from "@lowcode-platform/test-utils/utils";
import { ThemeProvider } from "@/theme";

const Wrapper = ({ children }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

test("renders component with theme", () => {
  const { container } = render(<MyComponent />, {
    wrapper: Wrapper,
  });
  // ...
});
```

#### 等待工具

```typescript
import { waitFor, waitForElementToBeRemoved } from "@lowcode-platform/test-utils/utils";

test("waits for async operation", async () => {
  await waitFor(() => {
    expect(screen.getByText("Loaded")).toBeInTheDocument();
  });
});
```

## API 参考

### Vitest 配置

#### `getVitestConfig(options?: VitestConfigOptions): UserConfig`

获取 Vitest 配置预设。

**选项**:

- `environment?: 'jsdom' | 'node'` - 测试环境，默认为 `'jsdom'`
- `setupFiles?: string[]` - Setup 文件路径数组
- `alias?: Record<string, string>` - 路径别名配置
- `globals?: boolean` - 是否启用全局变量，默认为 `true`
- `test?: UserConfig['test']` - 额外的 Vitest 测试配置

#### `setupVitest(): void`

设置 Vitest 测试环境，包括浏览器 API 和 React 组件的 Mock。

### Jest 配置

#### `getJestConfig(options?: JestConfigOptions): Config`

获取 Jest 配置预设。

**选项**:

- `rootDir?: string` - 根目录，默认为 `'src'`
- `testEnvironment?: 'node' | 'jsdom'` - 测试环境，默认为 `'node'`
- `testRegex?: string` - 测试文件匹配模式，默认为 `'.*\\.spec\\.ts$'`
- `coverageDirectory?: string` - 覆盖率报告目录，默认为 `'../coverage'`
- `collectCoverageFrom?: string[]` - 收集覆盖率的文件模式，默认为 `['**/*.(t|j)s']`

#### `setupJest(): void`

设置 Jest 测试环境。

### Mock 工具

#### `mockBrowserAPIs(vi: any): void`

Mock 浏览器 API（window.matchMedia, ResizeObserver, IntersectionObserver 等）。

#### `mockReactIcons(vi: any): void`

Mock React 图标库（lucide-react）。

### 工具函数

#### `customRender(ui: React.ReactElement, options?: CustomRenderOptions)`

自定义 render 函数，支持 wrapper 组件（如 providers）。

#### `waitFor(callback: () => void | Promise<void>, options?: WaitForOptions)`

等待回调函数通过，默认超时 5 秒。

#### `waitForElementToBeRemoved(element: T | (() => T), options?: WaitForOptions)`

等待元素从 DOM 中移除。

## 导出路径

包支持多个导出路径，方便按需导入：

- `@lowcode-platform/test-utils` - 所有导出
- `@lowcode-platform/test-utils/vitest` - Vitest 相关工具
- `@lowcode-platform/test-utils/jest` - Jest 相关工具
- `@lowcode-platform/test-utils/mocks` - Mock 工具
- `@lowcode-platform/test-utils/utils` - 测试工具函数
- `@lowcode-platform/test-utils/types` - TypeScript 类型定义

## 许可证

MIT
