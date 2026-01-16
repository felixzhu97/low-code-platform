#!/bin/bash
# 不使用 set -e，以便在 WASM 构建失败时仍能继续

echo "🚀 开始 Vercel 构建流程..."

# 设置 PATH 以确保能找到 cargo 和 rustc
export PATH="$HOME/.cargo/bin:$PATH"

# 检查并安装 Rust（如果未安装）- 使用最小化安装以加快速度
if ! command -v rustc &> /dev/null; then
  echo "📦 安装 Rust（最小化版本）..."
  if curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y --default-toolchain stable --profile minimal; then
    export PATH="$HOME/.cargo/bin:$PATH"
    rustc --version || {
      echo "❌ Rust 安装失败"
      exit 1
    }
  else
    echo "❌ Rust 安装失败"
    exit 1
  fi
else
  echo "✅ Rust 已安装: $(rustc --version)"
fi

# 检查并安装 wasm-pack（使用预编译二进制，比 cargo install 快得多）
if ! command -v wasm-pack &> /dev/null; then
  echo "📦 安装 wasm-pack（使用预编译二进制）..."
  export PATH="$HOME/.cargo/bin:$PATH"
  
  # 下载预编译的 wasm-pack 二进制（比 cargo install 快很多）
  WASM_PACK_VERSION="0.12.1"
  ARCH=$(uname -m)
  OS=$(uname -s | tr '[:upper:]' '[:lower:]')
  
  INSTALLED=false
  
  if [ "$OS" = "linux" ]; then
    if [ "$ARCH" = "x86_64" ]; then
      ARCH="x86_64"
    elif [ "$ARCH" = "aarch64" ] || [ "$ARCH" = "arm64" ]; then
      ARCH="aarch64"
    else
      ARCH="x86_64"  # 默认使用 x86_64
    fi
    
    DOWNLOAD_URL="https://github.com/rustwasm/wasm-pack/releases/download/v${WASM_PACK_VERSION}/wasm-pack-v${WASM_PACK_VERSION}-${ARCH}-unknown-linux-musl.tar.gz"
    echo "📥 从 $DOWNLOAD_URL 下载 wasm-pack..."
    
    if curl -L --fail --max-time 300 "$DOWNLOAD_URL" -o /tmp/wasm-pack.tar.gz 2>/dev/null; then
      if tar -xzf /tmp/wasm-pack.tar.gz -C /tmp 2>/dev/null; then
        mkdir -p "$HOME/.cargo/bin"
        if [ -f "/tmp/wasm-pack-v${WASM_PACK_VERSION}-${ARCH}-unknown-linux-musl/wasm-pack" ]; then
          mv /tmp/wasm-pack-v${WASM_PACK_VERSION}-${ARCH}-unknown-linux-musl/wasm-pack "$HOME/.cargo/bin/" 2>/dev/null
          chmod +x "$HOME/.cargo/bin/wasm-pack" 2>/dev/null
          rm -rf /tmp/wasm-pack* 2>/dev/null
          INSTALLED=true
        fi
      fi
    fi
  fi
  
  # 如果预编译二进制安装失败，使用 cargo install（较慢但更可靠）
  if [ "$INSTALLED" = false ]; then
    echo "⚠️  预编译二进制安装失败，使用 cargo install wasm-pack..."
    if cargo install wasm-pack --version "$WASM_PACK_VERSION" --locked 2>&1 | head -100; then
      INSTALLED=true
    fi
  fi
  
  export PATH="$HOME/.cargo/bin:$PATH"
  if [ "$INSTALLED" = true ] && wasm-pack --version >/dev/null 2>&1; then
    echo "✅ wasm-pack 安装成功: $(wasm-pack --version)"
  else
    echo "❌ wasm-pack 安装失败，WASM 构建将跳过"
  fi
else
  echo "✅ wasm-pack 已安装: $(wasm-pack --version)"
fi

# 构建 WASM（添加超时保护，失败时继续）
echo "🔨 构建 Rust WASM 模块..."
export PATH="$HOME/.cargo/bin:$PATH"

WASM_BUILD_SUCCESS=false
if command -v wasm-pack &> /dev/null; then
  # 设置 WASM 构建超时为 8 分钟
  if timeout 480 pnpm build:wasm 2>&1; then
    WASM_BUILD_SUCCESS=true
    echo "✅ WASM 构建成功"
  else
    echo "⚠️  WASM 构建超时或失败，将使用 JavaScript 降级方案"
  fi
else
  echo "⚠️  wasm-pack 不可用，跳过 WASM 构建，将使用 JavaScript 降级方案"
fi

# 构建 Next.js（必须成功）
echo "🔨 构建 Next.js 应用..."
if pnpm --filter @lowcode-platform/web build; then
  echo "✅ Next.js 构建成功"
else
  echo "❌ Next.js 构建失败"
  exit 1
fi

if [ "$WASM_BUILD_SUCCESS" = true ]; then
  echo "✅ 构建完成！(包含 WASM)"
else
  echo "✅ 构建完成！(使用 JavaScript 降级方案)"
fi
