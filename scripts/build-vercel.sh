#!/bin/bash
set -e

echo "🚀 开始 Vercel 构建流程..."

# 检查并安装 Rust（如果未安装）
if ! command -v rustc &> /dev/null; then
  echo "📦 安装 Rust..."
  curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
  source $HOME/.cargo/env
else
  echo "✅ Rust 已安装: $(rustc --version)"
fi

# 检查并安装 wasm-pack（如果未安装）
if ! command -v wasm-pack &> /dev/null; then
  echo "📦 安装 wasm-pack..."
  source $HOME/.cargo/env 2>/dev/null || true
  cargo install wasm-pack
else
  echo "✅ wasm-pack 已安装: $(wasm-pack --version)"
fi

# 构建 WASM
echo "🔨 构建 Rust WASM 模块..."
pnpm build:wasm

# 构建 Next.js
echo "🔨 构建 Next.js 应用..."
pnpm --filter @lowcode-platform/web build

echo "✅ 构建完成！"
