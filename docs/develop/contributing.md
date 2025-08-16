# 贡献指南

## 欢迎贡献

感谢你对 Felix 低代码平台的关注！我们欢迎所有形式的贡献，包括但不限于：

- 🐛 Bug 报告
- 💡 功能建议
- 📝 文档改进
- 🔧 代码贡献
- 🎨 UI/UX 改进
- 🌐 国际化翻译

## 贡献方式

### 报告问题

如果你发现了 Bug 或有功能建议，请：

1. 在 [GitHub Issues](https://github.com/your-username/felix-lowcode-platform/issues) 中搜索是否已有相关问题
2. 如果没有，请创建新的 Issue
3. 使用合适的 Issue 模板
4. 提供详细的描述和复现步骤

### 提交代码

1. **Fork 仓库**
   ```bash
   # 点击 GitHub 页面上的 Fork 按钮
   # 然后克隆你的 Fork
   git clone https://github.com/your-username/felix-lowcode-platform.git
   cd felix-lowcode-platform
   ```

2. **创建分支**
   ```bash
   # 从 main 分支创建新分支
   git checkout -b feature/your-feature-name
   # 或
   git checkout -b fix/your-bug-fix
   ```

3. **进行开发**
   ```bash
   # 安装依赖
   pnpm install
   
   # 启动开发服务器
   pnpm dev
   ```

4. **提交更改**
   ```bash
   # 添加更改
   git add .
   
   # 提交更改 (遵循提交规范)
   git commit -m "feat: add new component feature"
   ```

5. **推送分支**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **创建 Pull Request**
   - 在 GitHub 上创建 Pull Request
   - 填写 PR 模板
   - 等待代码审查

## 开发环境设置

### 环境要求

- Node.js 18.0.0+
- pnpm 8.0.0+
- Git 2.0.0+

### 项目结构

```
felix-lowcode-platform/
├── src/                    # 源代码
│   ├── app/               # Next.js App Router
│   └── mvvm/              # MVVM 架构核心
│       ├── models/        # 数据模型
│       ├── viewmodels/    # 视图模型
│       ├── views/         # 视图组件
│       ├── hooks/         # React Hooks
│       └── adapters/      # 适配器
├── docs/                  # 文档
├── test/                  # 测试文件
├── public/                # 静态资源
└── package.json           # 项目配置
```

### 开发流程

1. **安装依赖**
   ```bash
   pnpm install
   ```

2. **启动开发服务器**
   ```bash
   pnpm dev
   ```

3. **运行测试**
   ```bash
   # 运行所有测试
   pnpm test
   
   # 运行测试并生成覆盖率报告
   pnpm test:coverage
   
   # 运行测试 UI
   pnpm test:ui
   ```

4. **代码检查**
   ```bash
   # ESLint 检查
   pnpm lint
   
   # TypeScript 类型检查
   pnpm type-check
   
   # 格式化代码
   pnpm format
   ```

5. **构建项目**
   ```bash
   pnpm build
   ```

## 编码规范

### TypeScript 规范

1. **使用严格的 TypeScript 配置**
   ```typescript
   // 启用严格模式
   "strict": true,
   "noImplicitAny": true,
   "strictNullChecks": true
   ```

2. **接口和类型定义**
   ```typescript
   // 使用 interface 定义对象结构
   interface ComponentProps {
     id: string;
     name: string;
     visible?: boolean;
   }
   
   // 使用 type 定义联合类型
   type ComponentType = 'button' | 'input' | 'text';
   ```

3. **函数类型注解**
   ```typescript
   // 明确的参数和返回值类型
   function createComponent(
     type: ComponentType,
     props: ComponentProps
   ): ComponentModel {
     // 实现
   }
   ```

### React 组件规范

1. **函数组件优先**
   ```typescript
   // 推荐：函数组件 + Hooks
   const MyComponent: React.FC<Props> = ({ prop1, prop2 }) => {
     const [state, setState] = useState(initialState);
     
     return <div>{/* JSX */}</div>;
   };
   ```

2. **Props 接口定义**
   ```typescript
   interface MyComponentProps {
     title: string;
     onClick?: () => void;
     children?: React.ReactNode;
   }
   ```

3. **Hooks 使用规范**
   ```typescript
   // 自定义 Hook 以 use 开头
   function useComponentViewModel() {
     // Hook 逻辑
   }
   
   // 依赖数组要完整
   useEffect(() => {
     // 副作用逻辑
   }, [dependency1, dependency2]);
   ```

### CSS 规范

1. **使用 CSS Modules**
   ```css
   /* Component.module.css */
   .container {
     display: flex;
     flex-direction: column;
   }
   
   .title {
     font-size: 1.5rem;
     font-weight: 600;
   }
   ```

2. **BEM 命名规范**
   ```css
   .component-name {
     /* 块 */
   }
   
   .component-name__element {
     /* 元素 */
   }
   
   .component-name--modifier {
     /* 修饰符 */
   }
   ```

3. **响应式设计**
   ```css
   .component {
     /* 移动端优先 */
     width: 100%;
   }
   
   @media (min-width: 768px) {
     .component {
       width: 50%;
     }
   }
   ```

### 提交规范

使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**类型 (type):**
- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

**示例:**
```bash
feat(components): add drag and drop functionality

Add support for dragging components from the panel to the canvas.
Includes visual feedback and drop zone highlighting.

Closes #123
```

## 测试指南

### 测试策略

1. **单元测试**: 测试独立的函数和组件
2. **集成测试**: 测试组件间的交互
3. **端到端测试**: 测试完整的用户流程

### 编写测试

1. **组件测试**
   ```typescript
   import { render, screen, fireEvent } from '@testing-library/react';
   import { Button } from './Button';
   
   describe('Button Component', () => {
     it('renders with correct text', () => {
       render(<Button>Click me</Button>);
       expect(screen.getByText('Click me')).toBeInTheDocument();
     });
     
     it('calls onClick when clicked', () => {
       const handleClick = jest.fn();
       render(<Button onClick={handleClick}>Click me</Button>);
       
       fireEvent.click(screen.getByText('Click me'));
       expect(handleClick).toHaveBeenCalledTimes(1);
     });
   });
   ```

2. **Hook 测试**
   ```typescript
   import { renderHook, act } from '@testing-library/react';
   import { useCounter } from './useCounter';
   
   describe('useCounter Hook', () => {
     it('should increment counter', () => {
       const { result } = renderHook(() => useCounter());
       
       act(() => {
         result.current.increment();
       });
       
       expect(result.current.count).toBe(1);
     });
   });
   ```

3. **ViewModel 测试**
   ```typescript
   import { PlatformViewModel } from './PlatformViewModel';
   
   describe('PlatformViewModel', () => {
     let viewModel: PlatformViewModel;
     
     beforeEach(() => {
       viewModel = new PlatformViewModel();
     });
     
     it('should add component', () => {
       const component = createMockComponent();
       viewModel.addComponent(component);
       
       expect(viewModel.components).toContain(component);
     });
   });
   ```

### 测试覆盖率

目标测试覆盖率：
- 语句覆盖率: > 80%
- 分支覆盖率: > 75%
- 函数覆盖率: > 85%
- 行覆盖率: > 80%

## 文档贡献

### 文档类型

1. **API 文档**: 接口和函数的详细说明
2. **用户指南**: 面向最终用户的使用说明
3. **开发文档**: 面向开发者的技术文档
4. **示例代码**: 实际使用示例

### 文档规范

1. **Markdown 格式**
   ```markdown
   # 一级标题
   
   ## 二级标题
   
   ### 三级标题
   
   - 列表项
   - 列表项
   
   ```javascript
   // 代码示例
   const example = 'code';
   ```
   
   > 引用文本
   ```

2. **代码示例**
   - 提供完整的、可运行的示例
   - 包含必要的注释
   - 展示最佳实践

3. **图片和图表**
   - 使用 Mermaid 绘制流程图和架构图
   - 图片文件放在 `docs/images/` 目录
   - 使用描述性的文件名

## 发布流程

### 版本管理

使用 [Semantic Versioning](https://semver.org/) 规范：

- **MAJOR**: 不兼容的 API 更改
- **MINOR**: 向后兼容的功能添加
- **PATCH**: 向后兼容的 Bug 修复

### 发布步骤

1. **更新版本号**
   ```bash
   # 自动更新版本号和生成 CHANGELOG
   pnpm version patch  # 或 minor, major
   ```

2. **创建发布分支**
   ```bash
   git checkout -b release/v1.2.3
   ```

3. **运行完整测试**
   ```bash
   pnpm test
   pnpm build
   ```

4. **更新文档**
   - 更新 README.md
   - 更新 CHANGELOG.md
   - 更新 API 文档

5. **创建 Pull Request**
   - 合并到 main 分支
   - 创建 GitHub Release
   - 发布到 npm (如果适用)

## 社区参与

### 讨论和交流

- **GitHub Discussions**: 技术讨论和问答
- **Issues**: Bug 报告和功能请求
- **Pull Requests**: 代码贡献和审查

### 行为准则

我们致力于为所有参与者提供友好、安全和欢迎的环境。请遵守以下原则：

1. **尊重他人**: 尊重不同的观点和经验
2. **建设性反馈**: 提供有用的、建设性的反馈
3. **包容性**: 欢迎所有背景的贡献者
4. **专业性**: 保持专业和礼貌的交流

### 获得帮助

如果你在贡献过程中遇到问题：

1. 查看现有的文档和 FAQ
2. 在 GitHub Discussions 中提问
3. 联系维护者团队

## 认可贡献者

我们感谢所有贡献者的努力！贡献者将被列在：

- README.md 的贡献者部分
- GitHub Contributors 页面
- 发布说明中的特别感谢

### 贡献者类型

- **代码贡献者**: 提交代码的开发者
- **文档贡献者**: 改进文档的作者
- **测试贡献者**: 编写测试的开发者
- **设计贡献者**: 提供 UI/UX 设计的设计师
- **翻译贡献者**: 提供国际化翻译的译者

## 路线图

### 近期目标 (v0.2.0)

- [ ] 增强的动画编辑器
- [ ] 更多内置组件
- [ ] 插件系统基础架构
- [ ] 多语言支持

### 中期目标 (v0.3.0)

- [ ] 实时协作功能
- [ ] 版本控制系统
- [ ] 高级数据可视化组件
- [ ] 移动端编辑器

### 长期目标 (v1.0.0)

- [ ] 企业级权限管理
- [ ] 微服务架构支持
- [ ] AI 辅助设计功能
- [ ] 云端部署服务

## 许可证

通过贡献代码，你同意你的贡献将在与项目相同的许可证下发布。

---

再次感谢你对 Felix 低代码平台的贡献！你的参与让这个项目变得更好。

如果你有任何问题或建议，请随时联系我们。