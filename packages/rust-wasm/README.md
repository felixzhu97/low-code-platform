# @lowcode-platform/rust-wasm

Rust WebAssembly 包，提供高性能的 JSON 处理功能。

## 功能

- **JSON 验证**：快速验证 JSON 字符串的有效性
- **JSON 格式化**：格式化 JSON 字符串，支持自定义缩进
- **JSON 压缩**：压缩 JSON 字符串，移除不必要的空格

## 构建要求

### 安装 Rust

请先安装 Rust 和 Cargo：

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

### 安装 wasm-pack

```bash
cargo install wasm-pack
```

## 构建

### 本地构建（推荐）

**重要**: WASM 文件需要在本地构建并提交到 Git，Vercel 部署时使用预构建的文件。

#### 方式一：使用脚本（推荐）

```bash
# 从项目根目录运行
./scripts/build-wasm.sh
```

#### 方式二：使用 pnpm 命令

```bash
# 从项目根目录运行
pnpm build:wasm
```

#### 方式三：在 rust-wasm 目录中构建

```bash
cd packages/rust-wasm
pnpm build:release
```

### 构建后提交

构建完成后，**必须**将 `pkg/` 目录提交到 Git：

```bash
git add packages/rust-wasm/pkg/
git commit -m "build: update WASM files"
```

### 开发构建

```bash
cd packages/rust-wasm
pnpm build
```

### 生产构建（优化）

```bash
cd packages/rust-wasm
pnpm build:release
```

构建完成后，WASM 文件和相关绑定会生成在 `pkg/` 目录中。

## 使用方法

在 Next.js 项目中使用：

```typescript
import init, { validate_json, format_json, minify_json } from '@lowcode-platform/rust-wasm/pkg/rust_wasm';

// 初始化 WASM 模块（只需调用一次）
await init();

// 验证 JSON
const result = validate_json('{"key": "value"}');
console.log(result); // { valid: true, data: {...}, error: undefined }

// 格式化 JSON
const formatted = format_json('{"key":"value"}', 2);
console.log(formatted); // {\n  "key": "value"\n}

// 压缩 JSON
const minified = minify_json('{\n  "key": "value"\n}');
console.log(minified); // {"key":"value"}
```

## 开发

### 运行测试

```bash
pnpm test
```

## 部署说明

### Vercel 部署

- Vercel 部署时**不会**构建 WASM 文件
- 部署使用 Git 仓库中已构建的 `pkg/` 目录
- 如果 `pkg/` 目录不存在或为空，应用会使用 JavaScript 降级方案

### 工作流程

1. **本地开发**：修改 Rust 代码后，运行 `pnpm build:wasm` 构建
2. **提交代码**：将构建好的 `pkg/` 目录提交到 Git
3. **Vercel 部署**：自动使用已构建的 WASM 文件

## 注意事项

- WASM 模块需要在浏览器环境中使用
- 首次加载时可能需要初始化时间
- 建议在生产环境中使用优化后的构建版本（`build:release`）
- **重要**：修改 Rust 代码后必须重新构建并提交 `pkg/` 目录
