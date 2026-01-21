#!/bin/bash
set -e

# 在 Vercel 构建环境中修复 HOME 环境变量问题
if [ -z "$HOME" ] || [ "$HOME" = "/vercel" ]; then
  export HOME="/root"
fi

# 设置 Rust 工具链的安装路径（避免 HOME 问题）
export CARGO_HOME="${CARGO_HOME:-$HOME/.cargo}"
export RUSTUP_HOME="${RUSTUP_HOME:-$HOME/.rustup}"

# 确保目录存在
mkdir -p "$CARGO_HOME" "$RUSTUP_HOME"

# 检查 Rust 是否已安装
if ! command -v rustc &> /dev/null && [ ! -f "$CARGO_HOME/bin/rustc" ]; then
  echo "Installing Rust..."
  # 使用 --default-toolchain 和 --profile 参数，避免依赖 HOME
  curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y --default-toolchain stable --profile default
  # 将 cargo 和 rustup 添加到 PATH
  export PATH="$CARGO_HOME/bin:$PATH"
  # 添加 wasm32 目标
  rustup target add wasm32-unknown-unknown
else
  # 即使 Rust 已安装，也确保 PATH 包含 cargo bin 目录
  export PATH="$CARGO_HOME/bin:$PATH"
fi

# 检查 wasm-pack 是否已安装
if ! command -v wasm-pack &> /dev/null && [ ! -f "$CARGO_HOME/bin/wasm-pack" ]; then
  echo "Installing wasm-pack..."
  cargo install wasm-pack --locked
fi

# 构建 WASM
echo "Building WASM..."
cd packages/wasm

# 使用完整路径调用 wasm-pack（如果 PATH 中没有）
if command -v wasm-pack &> /dev/null; then
  wasm-pack build --target web --out-dir pkg
else
  "$CARGO_HOME/bin/wasm-pack" build --target web --out-dir pkg
fi

cd ../..

echo "WASM build completed!"
