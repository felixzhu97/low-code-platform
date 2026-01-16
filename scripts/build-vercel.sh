#!/bin/bash
set -e

echo "🚀 开始 Vercel 构建流程..."

# 设置 PATH 以确保能找到 cargo 和 rustc
export PATH="$HOME/.cargo/bin:$PATH"

# 检查并安装 Rust（如果未安装）
if ! command -v rustc &> /dev/null; then
  echo "📦 安装 Rust..."
  curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
  export PATH="$HOME/.cargo/bin:$PATH"
else
  echo "✅ Rust 已安装: $(rustc --version)"
fi

# 检查并安装 wasm-pack（如果未安装）
if ! command -v wasm-pack &> /dev/null; then
  echo "📦 安装 wasm-pack..."
  export PATH="$HOME/.cargo/bin:$PATH"
  cargo install wasm-pack
else
  echo "✅ wasm-pack 已安装: $(wasm-pack --version)"
fi

# 构建 WASM
echo "🔨 构建 Rust WASM 模块..."
export PATH="$HOME/.cargo/bin:$PATH"
pnpm build:wasm

# 构建 Next.js
echo "🔨 构建 Next.js 应用..."
pnpm --filter @lowcode-platform/web build

echo "✅ 构建完成！"
