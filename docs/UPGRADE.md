# 升级指南

本文档提供了 Felix 低代码平台各版本间的升级指导，包括破坏性变更、迁移步骤和注意事项。

## 升级前准备

### 1. 备份数据
```bash
# 备份项目文件
cp -r your-project your-project-backup

# 备份数据库（如果使用）
pg_dump your_database > backup.sql

# 备份配置文件
cp .env .env.backup
```

### 2. 检查兼容性
```bash
# 检查 Node.js 版本
node --version

# 检查依赖版本
pnpm outdated

# 运行测试确保当前版本正常
pnpm test
```

### 3. 阅读变更日志
在升级前，请仔细阅读 [CHANGELOG.md](./CHANGELOG.md) 了解版本变更。

## 版本升级指南

### 从 v0.1.x 升级到 v0.2.x（计划中）

#### 破坏性变更

1. **组件 API 变更**
   ```typescript
   // v0.1.x
   interface ComponentProps {
     type: 'primary' | 'secondary';
   }
   
   // v0.2.x
   interface ComponentProps {
     variant: 'primary' | 'secondary'; // type 重命名为 variant
   }
   ```

2. **数据绑定格式变更**
   ```typescript
   // v0.1.x
   const binding = {
     source: 'api-1',
     field: 'data.users'
   };
   
   // v0.2.x
   const binding = {
     sourceId: 'api-1',        // source 重命名为 sourceId
     fieldPath: 'data.users'   // field 重命名为 fieldPath
   };
   ```

#### 升级步骤

1. **更新依赖**
   ```bash
   # 更新到最新版本
   pnpm update felix-lowcode-platform
   
   # 或指定版本
   pnpm add felix-lowcode-platform@^0.2.0
   ```

2. **运行迁移脚本**
   ```bash
   # 自动迁移组件配置
   npx felix-migrate --from=0.1 --to=0.2
   ```

3. **手动更新代码**
   ```typescript
   // 更新自定义组件
   const MyComponent: ComponentDefinition = {
     // ...
     propSchema: {
       variant: { // 从 type 改为 variant
         type: 'string',
         options: [
           { label: '主要', value: 'primary' },
           { label: '次要', value: 'secondary' }
         ]
       }
     }
   };
   ```

4. **更新配置文件**
   ```javascript
   // next.config.mjs
   export default {
     // 新增配置项
     experimental: {
       optimizeCss: true,
       turbo: {
         rules: {
           '*.svg': {
             loaders: ['@svgr/webpack'],
             as: '*.js',
           },
         },
       },
     },
   };
   ```

5. **测试验证**
   ```bash
   # 运行测试套件
   pnpm test
   
   # 启动开发服务器验证
   pnpm dev
   
   # 构建生产版本
   pnpm build
   ```

#### 新功能使用

1. **动画编辑器**
   ```typescript
   // 使用新的动画配置
   const animationConfig = {
     enter: {
       type: 'fadeIn',
       duration: 300,
       delay: 0
     },
     exit: {
       type: 'fadeOut',
       duration: 200
     }
   };
   ```

2. **插件系统**
   ```typescript
   // 注册插件
   import { registerPlugin } from 'felix-lowcode-platform';
   import { ChartPlugin } from './plugins/ChartPlugin';
   
   registerPlugin(ChartPlugin);
   ```

## 常见升级问题

### Q: 升级后组件不显示？

**A:** 检查组件定义中的属性名是否已更新：

```typescript
// 检查并更新组件属性
const component = {
  // 旧版本
  // type: 'primary'
  
  // 新版本
  variant: 'primary'
};
```

### Q: 数据绑定失效？

**A:** 更新数据绑定配置格式：

```typescript
// 旧格式
const oldBinding = {
  source: 'api-1',
  field: 'data.users'
};

// 新格式
const newBinding = {
  sourceId: 'api-1',
  fieldPath: 'data.users'
};
```

### Q: 自定义组件报错？

**A:** 检查组件接口是否符合新版本要求：

```typescript
// 确保实现了新的接口方法
const CustomComponent: ComponentDefinition = {
  // ...
  version: '0.2.0', // 添加版本号
  migrate: (oldProps) => { // 添加迁移函数
    return {
      ...oldProps,
      variant: oldProps.type // 迁移逻辑
    };
  }
};
```

### Q: 构建失败？

**A:** 检查构建配置和依赖版本：

```bash
# 清理缓存
rm -rf .next node_modules
pnpm install

# 检查 TypeScript 配置
npx tsc --noEmit

# 更新构建配置
# 参考新版本的 next.config.mjs
```

## 自动化迁移工具

### 使用迁移 CLI

```bash
# 安装迁移工具
npm install -g @felix/migration-tool

# 运行迁移
felix-migrate --version=0.2.0 --path=./src

# 检查迁移结果
felix-migrate --check --path=./src
```

### 迁移脚本示例

```javascript
// migrate-to-v0.2.js
const fs = require('fs');
const path = require('path');

function migrateComponent(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // 替换 type 为 variant
  content = content.replace(
    /(\w+):\s*{\s*type:/g,
    '$1: { variant:'
  );
  
  // 替换数据绑定格式
  content = content.replace(
    /source:\s*['"]([^'"]+)['"]/g,
    'sourceId: "$1"'
  );
  
  content = content.replace(
    /field:\s*['"]([^'"]+)['"]/g,
    'fieldPath: "$1"'
  );
  
  fs.writeFileSync(filePath, content);
  console.log(`Migrated: ${filePath}`);
}

// 递归处理所有 TypeScript 文件
function migrateDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      migrateDirectory(filePath);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      migrateComponent(filePath);
    }
  });
}

// 运行迁移
migrateDirectory('./src');
console.log('Migration completed!');
```

## 版本兼容性矩阵

| Felix 版本 | Node.js | React | Next.js | TypeScript |
|-----------|---------|-------|---------|------------|
| 0.1.x     | ≥18.0   | ≥19.0 | ≥15.0   | ≥5.0       |
| 0.2.x     | ≥18.0   | ≥19.0 | ≥15.0   | ≥5.0       |
| 1.0.x     | ≥20.0   | ≥19.0 | ≥15.0   | ≥5.2       |

## 回滚指南

如果升级后遇到问题，可以按以下步骤回滚：

### 1. 恢复代码版本

```bash
# 回滚到上一个版本
git checkout previous-version-tag

# 或恢复备份
rm -rf your-project
cp -r your-project-backup your-project
```

### 2. 恢复依赖版本

```bash
# 安装旧版本依赖
pnpm add felix-lowcode-platform@0.1.x

# 或使用备份的 package.json
cp package.json.backup package.json
pnpm install
```

### 3. 恢复配置文件

```bash
# 恢复环境配置
cp .env.backup .env

# 恢复构建配置
cp next.config.mjs.backup next.config.mjs
```

### 4. 验证回滚

```bash
# 运行测试
pnpm test

# 启动应用
pnpm dev
```

## 获取帮助

如果在升级过程中遇到问题：

1. **查看文档**: 阅读相关版本的文档
2. **搜索 Issues**: 在 GitHub Issues 中搜索类似问题
3. **提交 Issue**: 如果问题未解决，请提交新的 Issue
4. **社区讨论**: 在 GitHub Discussions 中寻求帮助

### 提交升级问题时请包含：

- 当前版本和目标版本
- 完整的错误信息
- 复现步骤
- 环境信息（Node.js、操作系统等）
- 相关配置文件

---

**升级愉快！如有问题，我们随时为您提供帮助。** 🚀