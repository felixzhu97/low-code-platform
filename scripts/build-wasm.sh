#!/bin/bash
set -e

# 启用详细输出以便调试
set -x

# 错误处理函数
error_exit() {
  echo "ERROR: $1" >&2
  exit 1
}

# 在 Vercel 构建环境中修复 HOME 环境变量问题
if [ -z "$HOME" ] || [ "$HOME" = "/vercel" ]; then
  export HOME="/root"
fi

# 设置 Rust 工具链的安装路径（避免 HOME 问题）
export CARGO_HOME="${CARGO_HOME:-$HOME/.cargo}"
export RUSTUP_HOME="${RUSTUP_HOME:-$HOME/.rustup}"

# 确保目录存在
mkdir -p "$CARGO_HOME" "$RUSTUP_HOME" || error_exit "Failed to create Rust directories"

# 检查 Rust 是否已安装
if ! command -v rustc &> /dev/null && [ ! -f "$CARGO_HOME/bin/rustc" ]; then
  echo "Installing Rust..."
  # 使用 --default-toolchain 和 --profile 参数，避免依赖 HOME
  curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y --default-toolchain stable --profile default || error_exit "Failed to install Rust"
  # 将 cargo 和 rustup 添加到 PATH
  export PATH="$CARGO_HOME/bin:$PATH"
  # 验证 Rust 安装
  if ! command -v rustc &> /dev/null && [ ! -f "$CARGO_HOME/bin/rustc" ]; then
    error_exit "Rust installation completed but rustc not found"
  fi
  # 添加 wasm32 目标
  echo "Adding wasm32-unknown-unknown target..."
  rustup target add wasm32-unknown-unknown || error_exit "Failed to add wasm32 target"
else
  # 即使 Rust 已安装，也确保 PATH 包含 cargo bin 目录
  export PATH="$CARGO_HOME/bin:$PATH"
  echo "Rust already installed, version:"
  rustc --version || echo "Warning: rustc not found in PATH"
fi

# 检查 wasm-pack 是否已安装
if ! command -v wasm-pack &> /dev/null && [ ! -f "$CARGO_HOME/bin/wasm-pack" ]; then
  echo "Installing wasm-pack..."
  cargo install wasm-pack --locked || error_exit "Failed to install wasm-pack"
else
  echo "wasm-pack already installed"
fi

# 验证 wasm-pack 可用
if ! command -v wasm-pack &> /dev/null && [ ! -f "$CARGO_HOME/bin/wasm-pack" ]; then
  error_exit "wasm-pack installation completed but wasm-pack not found"
fi

# 构建 WASM
echo "Building WASM..."
cd packages/wasm || error_exit "Failed to change to packages/wasm directory"

# 检查 Cargo.toml 是否存在
if [ ! -f "Cargo.toml" ]; then
  error_exit "Cargo.toml not found in packages/wasm"
fi

# 使用完整路径调用 wasm-pack（如果 PATH 中没有）
WASM_PACK_CMD=""
if command -v wasm-pack &> /dev/null; then
  WASM_PACK_CMD="wasm-pack"
elif [ -f "$CARGO_HOME/bin/wasm-pack" ]; then
  WASM_PACK_CMD="$CARGO_HOME/bin/wasm-pack"
else
  error_exit "wasm-pack not found"
fi

echo "Using wasm-pack: $WASM_PACK_CMD"
$WASM_PACK_CMD --version || error_exit "wasm-pack version check failed"

# 执行构建
echo "Running: $WASM_PACK_CMD build --target web --out-dir pkg"
$WASM_PACK_CMD build --target web --out-dir pkg || error_exit "WASM build failed"

# 验证构建产物
if [ ! -d "pkg" ]; then
  error_exit "WASM build completed but pkg directory not found"
fi

if [ ! -f "pkg/lowcode_platform_wasm.js" ]; then
  error_exit "WASM build completed but pkg/lowcode_platform_wasm.js not found"
fi

cd ../..

echo "WASM build completed successfully!"
echo "Build artifacts in packages/wasm/pkg:"
ls -la packages/wasm/pkg/ || echo "Warning: Could not list pkg directory"
