#!/bin/bash
set -e

echo "🔧 准备安装前环境检查..."

# 确保 pkg 目录存在（如果不存在则创建）
PKG_DIR="packages/rust-wasm/pkg"
if [ ! -d "$PKG_DIR" ]; then
  echo "📁 创建 pkg 目录..."
  mkdir -p "$PKG_DIR"
fi

# 如果 pkg 目录为空，创建最小占位文件以避免 pnpm install 失败
if [ -z "$(ls -A $PKG_DIR 2>/dev/null)" ]; then
  echo "⚠️  警告: pkg 目录为空，创建占位文件..."
  
  # 创建最小占位文件
  cat > "$PKG_DIR/rust_wasm.js" << 'EOF'
// Placeholder file - WASM files should be built locally and committed to Git
// Run: pnpm build:wasm
export default async function init() {
  console.warn('WASM module not found. Please build WASM files locally: pnpm build:wasm');
  return Promise.resolve();
}

export function validate_json() {
  throw new Error('WASM module not loaded. Please build WASM files locally: pnpm build:wasm');
}

export function format_json() {
  throw new Error('WASM module not loaded. Please build WASM files locally: pnpm build:wasm');
}

export function minify_json() {
  throw new Error('WASM module not loaded. Please build WASM files locally: pnpm build:wasm');
}
EOF

  cat > "$PKG_DIR/rust_wasm.d.ts" << 'EOF'
// Placeholder type definitions - WASM files should be built locally
export default function init(): Promise<void>;
export function validate_json(json: string): any;
export function format_json(json: string, indent: number): string;
export function minify_json(json: string): string;
EOF

  cat > "$PKG_DIR/.gitkeep" << 'EOF'
# This file is a placeholder
# Real WASM files should be built locally with: pnpm build:wasm
EOF

  echo "✅ 已创建占位文件，安装将继续进行"
  echo "⚠️  重要: 请在本地运行 'pnpm build:wasm' 并提交真实的 WASM 文件"
else
  echo "✅ pkg 目录已包含文件"
fi
