#!/bin/bash
set -e

echo "🚀 开始 Vercel 构建流程..."

# 检查 WASM 文件是否存在
WASM_PKG_DIR="packages/rust-wasm/pkg"
if [ ! -d "$WASM_PKG_DIR" ] || [ -z "$(ls -A $WASM_PKG_DIR 2>/dev/null)" ]; then
  echo "⚠️  警告: WASM 文件未找到 ($WASM_PKG_DIR)"
  echo "   将使用 JavaScript 降级方案"
  echo "   如需使用 WASM，请在本地运行: pnpm build:wasm"
else
  echo "✅ WASM 文件已存在，将使用 WASM 版本"
fi

# 构建 Next.js
echo "🔨 构建 Next.js 应用..."
pnpm --filter @lowcode-platform/web build

echo "✅ 构建完成！"
