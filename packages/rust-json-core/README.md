# Rust JSON Core

高性能 JSON 处理库，编译为 WebAssembly 模块，用于优化低代码平台的 JSON 处理性能。

## 功能

- ✅ JSON 验证
- ✅ JSON 格式化（支持自定义缩进）
- ✅ JSON 压缩（移除空格和换行）
- ✅ JSON 结构分析
- ✅ 路径提取
- ✅ 类型检测（数组/对象）

## 开发

### 前置要求

- Rust >= 1.70.0
- wasm-pack

### 安装依赖

```bash
# 安装 Rust（如果尚未安装）
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# 安装 wasm-pack
curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh
```

### 构建

```bash
# 从项目根目录运行
pnpm build:rust

# 或直接使用 wasm-pack
cd packages/rust-json-core
wasm-pack build --target bundler --out-dir pkg --release
```

### 运行测试

```bash
cd packages/rust-json-core
cargo test
```

### 目录结构

```
rust-json-core/
├── src/
│   ├── lib.rs              # WASM 入口
│   ├── json_validator.rs   # JSON 验证
│   ├── json_formatter.rs   # JSON 格式化
│   └── json_analyzer.rs    # JSON 结构分析
├── Cargo.toml              # Rust 项目配置
└── README.md
```

## 构建产物

构建完成后，会在 `pkg/` 目录生成以下文件：

- `rust_json_core.js` - JavaScript 绑定
- `rust_json_core_bg.wasm` - WebAssembly 二进制文件
- `*.d.ts` - TypeScript 类型定义

这些文件会被复制到 `apps/web/src/infrastructure/wasm/` 目录供前端使用。

## 使用

在 TypeScript 中通过 `RustJsonProcessor` 使用：

```typescript
import { RustJsonProcessor } from "@/infrastructure/wasm";

// 检查 WASM 是否可用
const isAvailable = await RustJsonProcessor.isAvailable();

// 使用 WASM 实现（同步调用，需要先确保已加载）
if (RustJsonProcessor.isLoaded()) {
  const result = RustJsonProcessor.validateJson(jsonString);
  // ...
}
```

或者在 `JsonHelperService` 中自动使用（推荐）：

```typescript
import { JsonHelperService } from "@/application/services/json-helper.service";

// 自动使用 WASM（如果可用），否则降级到 TypeScript 实现
const result = JsonHelperService.validateJson(jsonString);
```

## 性能

Rust WASM 实现相比纯 TypeScript 实现有以下优势：

- 🚀 更快的 JSON 解析速度（特别是大型 JSON）
- 💾 更小的内存占用
- ⚡ 更高效的字符串处理
- 🔒 类型安全的操作

## 注意事项

- WASM 模块需要在运行时动态加载，首次调用可能有轻微延迟
- 如果 WASM 加载失败，会自动降级到 TypeScript 实现
- 在生产环境中，建议预构建 WASM 模块以获得最佳性能
