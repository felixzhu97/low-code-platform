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

### 开发构建

```bash
pnpm build
```

### 生产构建（优化）

```bash
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

## 注意事项

- WASM 模块需要在浏览器环境中使用
- 首次加载时可能需要初始化时间
- 建议在生产环境中使用优化后的构建版本
