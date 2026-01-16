#!/bin/bash
set -e

# 检查 Rust 是否已安装
if ! command -v rustc &> /dev/null; then
  echo "Installing Rust..."
  curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
  source "$HOME/.cargo/env"
fi

# 检查 wasm-pack 是否已安装
if ! command -v wasm-pack &> /dev/null; then
  echo "Installing wasm-pack..."
  cargo install wasm-pack
fi

# 构建 WASM
echo "Building WASM..."
cd packages/wasm
wasm-pack build --target web --out-dir pkg
cd ../..

echo "WASM build completed!"
