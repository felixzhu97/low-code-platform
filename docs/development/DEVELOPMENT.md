# 开发指南

## 🛠️ 环境配置

1. Node.js v18+
2. pnpm 8+
3. VS Code (推荐)

## 📝 代码规范

- TypeScript 严格模式
- ESLint + Prettier
- 2 空格缩进
- 组件使用 PascalCase 命名
- 工具函数使用 camelCase 命名

## 🏗️ 构建流程

```bash
# 开发模式
pnpm dev

# 生产构建
pnpm build

# 启动生产服务器
pnpm start
```

## 🧪 测试

```bash
# 运行单元测试
pnpm test

# 运行端到端测试
pnpm test:e2e
```

## 🐛 调试

1. 使用 VS Code 调试器
2. 添加`debugger`语句
3. 检查浏览器开发者工具
