# Felix 低代码平台

一个基于 Next.js 和 React 的现代化低代码开发平台，采用 MVVM 架构设计，提供可视化组件拖拽、实时预览、代码生成等功能。

## ✨ 特性

- 🎨 **可视化设计器** - 拖拽式组件编辑，所见即所得
- 📱 **响应式设计** - 支持桌面、平板、移动端多设备预览
- 🎯 **MVVM 架构** - 清晰的架构分层，易于维护和扩展
- 🧩 **丰富组件库** - 基于 Radix UI 的高质量组件
- 🎨 **主题定制** - 支持自定义主题和样式
- 📊 **数据绑定** - 支持静态数据、API 和数据库连接
- 🔄 **实时协作** - 多人协同编辑功能
- 📝 **代码导出** - 生成可部署的 React 代码
- 🎭 **动画编辑器** - 可视化动画配置
- 📋 **表单构建器** - 快速创建复杂表单
- 🏗️ **模板库** - 预置页面模板，快速开始

## 🚀 快速开始

### 环境要求

- Node.js 18+ 
- pnpm (推荐) 或 npm/yarn

### 安装依赖

```bash
# 使用 pnpm (推荐)
pnpm install

# 或使用 npm
npm install

# 或使用 yarn
yarn install
```

### 启动开发服务器

```bash
# 开发模式
pnpm dev

# 或
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建生产版本

```bash
# 构建
pnpm build

# 启动生产服务器
pnpm start
```

## 🏗️ 项目架构

本项目采用 MVVM (Model-View-ViewModel) 架构模式：

```
src/
├── app/                    # Next.js App Router
├── mvvm/                   # MVVM 架构核心
│   ├── models/            # 数据模型层
│   ├── viewmodels/        # 视图模型层
│   ├── views/             # 视图层
│   ├── hooks/             # React Hooks
│   └── adapters/          # 适配器层
```

### 核心模块

- **Models**: 定义数据结构和业务逻辑
- **ViewModels**: 处理视图状态和用户交互
- **Views**: React 组件，负责 UI 渲染
- **Hooks**: 封装状态管理和副作用
- **Adapters**: 处理数据格式转换和兼容性

## 🧪 测试

```bash
# 运行测试
pnpm test

# 运行测试 UI
pnpm test:ui

# 生成覆盖率报告
pnpm test:coverage
```

## 📚 技术栈

### 核心框架
- **Next.js 15** - React 全栈框架
- **React 19** - 用户界面库
- **TypeScript** - 类型安全的 JavaScript

### UI 组件
- **Radix UI** - 无样式的可访问组件
- **Tailwind CSS** - 实用优先的 CSS 框架
- **Lucide React** - 图标库

### 状态管理
- **React Hook Form** - 表单状态管理
- **Zod** - 模式验证

### 拖拽功能
- **React DnD** - 拖拽功能实现

### 图表组件
- **Recharts** - React 图表库

### 开发工具
- **Vitest** - 单元测试框架
- **Testing Library** - 测试工具

## 🎯 核心功能

### 1. 组件管理
- 拖拽添加组件到画布
- 组件属性实时编辑
- 组件层级管理
- 组件分组功能

### 2. 可视化编辑
- 所见即所得的编辑体验
- 实时预览功能
- 多设备响应式预览
- 撤销/重做操作

### 3. 数据绑定
- 静态数据配置
- API 数据源连接
- 数据字段映射
- 动态数据渲染

### 4. 主题定制
- 颜色主题配置
- 字体样式设置
- 间距和圆角调整
- 实时主题预览

### 5. 代码生成
- 导出 React 组件代码
- 生成完整项目结构
- 支持多种导出格式

## 📖 使用指南

### 创建第一个页面

1. **选择模板**: 从模板库中选择合适的页面模板
2. **添加组件**: 从组件面板拖拽组件到画布
3. **配置属性**: 在属性面板中调整组件样式和行为
4. **绑定数据**: 在数据面板中配置数据源
5. **预览测试**: 使用预览模式查看效果
6. **导出代码**: 生成可部署的代码

### 自定义组件

1. 在组件库管理器中创建新组件
2. 定义组件属性和默认值
3. 配置组件样式和行为
4. 保存到自定义组件库

## 🤝 贡献指南

我们欢迎所有形式的贡献！

### 开发流程

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

### 代码规范

- 使用 TypeScript 进行类型检查
- 遵循 ESLint 配置的代码规范
- 编写单元测试覆盖新功能
- 保持代码注释的完整性

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🔗 相关链接

- [在线演示](https://felix-lowcode-platform.vercel.app)
- [文档中心](./docs)
- [问题反馈](https://github.com/your-username/felix-lowcode-platform/issues)
- [更新日志](./CHANGELOG.md)

⭐ 如果这个项目对你有帮助，请给我们一个 Star！