# 构建脚本说明

## build-vercel.sh

Vercel 部署时的构建脚本，用于：
1. 安装 Rust 工具链（如果未安装）
2. 安装 wasm-pack（如果未安装）
3. 构建 Rust WASM 模块
4. 构建 Next.js 应用

### 使用方法

在 Vercel 项目中，可以在 `vercel.json` 的 `buildCommand` 中使用：

```json
{
  "buildCommand": "./scripts/build-vercel.sh"
}
```

或者直接在命令行使用：

```bash
./scripts/build-vercel.sh
```

### 注意事项

- 脚本会在构建环境中自动检测和安装必要的工具
- 如果 Rust 或 wasm-pack 已安装，会跳过安装步骤以节省时间
- 构建过程会显示详细的状态信息
