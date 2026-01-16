# Rust WASM 集成指南

本文档说明如何在低代码平台中使用 Rust WebAssembly 模块进行性能优化。

## 概述

项目集成了 Rust 编写的 WASM 模块来优化 JSON 处理性能。Rust 实现位于基础设施层，遵循整洁架构原则，对应用层和领域层透明。

## 架构设计

```
packages/rust-json-core/          # Rust WASM 模块
  └── src/                         # Rust 源代码
      ├── lib.rs                   # WASM 入口
      ├── json_validator.rs        # JSON 验证
      ├── json_formatter.rs        # JSON 格式化
      └── json_analyzer.rs         # JSON 结构分析

apps/web/src/
  └── infrastructure/
      └── wasm/                    # WASM 基础设施层
          ├── json-processor.ts    # WASM 绑定适配器
          └── rust_json_core.*     # 构建产物（自动生成）

  └── application/
      └── services/
          └── json-helper.service.ts  # 应用服务（自动使用 WASM）
```

## 快速开始

### 1. 构建 Rust WASM 模块

```bash
# 从项目根目录
pnpm build:rust
```

这将：
- 编译 Rust 代码为 WebAssembly
- 生成 JavaScript 绑定和 TypeScript 类型
- 复制构建产物到 `apps/web/src/infrastructure/wasm/`

### 2. 使用 JSON 处理服务

```typescript
import { JsonHelperService } from "@/application/services/json-helper.service";

// 自动使用 WASM（如果可用），否则使用 TypeScript 实现
const result = JsonHelperService.validateJson('{"name": "test"}');
const formatted = JsonHelperService.formatJson(jsonString, 2);
const paths = JsonHelperService.extractPaths(dataObject);
```

### 3. 验证集成

```bash
# 运行测试
pnpm test

# 启动开发服务器
pnpm dev
```

## 开发工作流

### 修改 Rust 代码

1. 编辑 `packages/rust-json-core/src/` 下的 Rust 文件
2. 运行 `pnpm build:rust` 重新构建
3. 重新启动开发服务器

### 使用 Watch 模式（可选）

```bash
# 安装 cargo-watch
cargo install cargo-watch

# 使用 watch 模式自动重建
pnpm build:rust:watch
```

## 故障排除

### WASM 模块未找到

**错误**: `WASM module not found. Please run 'pnpm build:rust' first.`

**解决**: 
```bash
pnpm build:rust
```

### TypeScript 类型错误

**原因**: WASM 模块尚未构建，TypeScript 无法找到类型定义。

**解决**: 
1. 运行 `pnpm build:rust` 构建 WASM 模块
2. 或者忽略该错误（应用会自动降级到 TypeScript 实现）

### 性能未提升

**检查**:
1. 确认 WASM 模块已成功加载（查看浏览器控制台）
2. 确认使用的是大型 JSON 数据（小数据可能看不出差异）
3. 检查浏览器是否支持 WebAssembly

## 性能优化建议

1. **预构建**: 在 CI/CD 中预构建 WASM 模块
2. **预加载**: 在应用启动时预加载 WASM 模块
3. **缓存**: 利用浏览器缓存 WASM 文件
4. **懒加载**: 仅在需要时加载 WASM 模块

## 扩展 Rust 功能

### 添加新的 JSON 处理函数

1. 在相应的 Rust 模块中添加函数（如 `json_validator.rs`）
2. 使用 `#[wasm_bindgen]` 标记导出函数
3. 在 `lib.rs` 中重新导出
4. 在 `json-processor.ts` 中添加 TypeScript 绑定
5. 在 `JsonHelperService` 中集成新功能
6. 运行 `pnpm build:rust` 重新构建

### 示例：添加新函数

**Rust 代码** (`src/json_validator.rs`):
```rust
#[wasm_bindgen]
pub fn new_function(input: &str) -> String {
    // 实现逻辑
    input.to_uppercase()
}
```

**TypeScript 绑定** (`json-processor.ts`):
```typescript
static newFunction(input: string): string | null {
  if (!isWasmLoaded() || !wasmModule) return null;
  try {
    return wasmModule.new_function(input);
  } catch (error) {
    return null;
  }
}
```

**服务集成** (`json-helper.service.ts`):
```typescript
static newFunction(input: string): string {
  if (checkWasmLoaded()) {
    const result = RustJsonProcessor.newFunction(input);
    if (result) return result;
  }
  // TypeScript fallback
  return this.newFunctionTs(input);
}
```

## 参考资源

- [wasm-pack 文档](https://rustwasm.github.io/wasm-pack/)
- [wasm-bindgen 文档](https://rustwasm.github.io/wasm-bindgen/)
- [WebAssembly 标准](https://webassembly.org/)
- [Rust 官方文档](https://doc.rust-lang.org/)
