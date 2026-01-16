#!/bin/bash

# Rust WASM 构建脚本
# 使用 wasm-pack 构建 Rust 项目为 WebAssembly 模块

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
RUST_PROJECT="$PROJECT_ROOT/packages/rust-json-core"
OUTPUT_DIR="$PROJECT_ROOT/apps/web/src/infrastructure/wasm"

echo "🚀 Building Rust WASM module..."

# 检查 wasm-pack 是否安装
if ! command -v wasm-pack &> /dev/null; then
    echo "❌ wasm-pack not found. Installing..."
    curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh
fi

# 检查 Rust 是否安装
if ! command -v cargo &> /dev/null; then
    echo ""
    echo "❌ Rust not found!"
    echo ""
    echo "📝 To install Rust and wasm-pack:"
    echo ""
    echo "   1. Install Rust:"
    echo "      curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh"
    echo ""
    echo "   2. Install wasm-pack:"
    echo "      curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh"
    echo ""
    echo "   3. Restart your terminal or run:"
    echo "      source \$HOME/.cargo/env"
    echo ""
    echo "💡 Note: The application will still work without Rust WASM."
    echo "   It will automatically use the TypeScript implementation instead."
    echo ""
    exit 1
fi

cd "$RUST_PROJECT"

# 清理之前的构建
echo "🧹 Cleaning previous builds..."
rm -rf target/pkg

# 构建 WASM 模块
# --target web: 用于浏览器
# --target nodejs: 用于 Node.js
# --target bundler: 用于 webpack/vite 等打包工具
# 我们使用 bundler 模式，因为它最灵活
echo "🔨 Building WASM module..."
wasm-pack build --target bundler --out-dir pkg --release

# 复制构建产物到目标目录
echo "📦 Copying build artifacts..."
mkdir -p "$OUTPUT_DIR"
cp -r "$RUST_PROJECT/pkg/"* "$OUTPUT_DIR/"

echo "✅ Rust WASM build completed!"
echo "📁 Output directory: $OUTPUT_DIR"
