#!/bin/bash
set -e

echo "🔨 开始构建 Rust WASM 模块..."

# 检查 Rust 是否已安装
if ! command -v rustc &> /dev/null; then
  echo "❌ 错误: Rust 未安装"
  echo ""
  echo "请先安装 Rust:"
  echo "  curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh"
  exit 1
fi

echo "✅ Rust 已安装: $(rustc --version)"

# 检查 wasm-pack 是否已安装
if ! command -v wasm-pack &> /dev/null; then
  echo "❌ 错误: wasm-pack 未安装"
  echo ""
  echo "请先安装 wasm-pack:"
  echo "  cargo install wasm-pack"
  exit 1
fi

echo "✅ wasm-pack 已安装: $(wasm-pack --version)"

# 进入 rust-wasm 目录
cd "$(dirname "$0")/../packages/rust-wasm"

# 执行构建
echo ""
echo "📦 构建 WASM 模块（release 模式）..."
if pnpm build:release; then
  echo ""
  echo "✅ WASM 构建成功！"
  echo ""
  echo "构建文件位置: packages/rust-wasm/pkg/"
  echo ""
  echo "⚠️  重要: 请将 pkg/ 目录提交到 Git，以便 Vercel 部署时使用"
  echo "  git add packages/rust-wasm/pkg/"
  echo "  git commit -m 'build: update WASM files'"
else
  echo ""
  echo "❌ WASM 构建失败"
  exit 1
fi
