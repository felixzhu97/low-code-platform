# UML 图查看指南

## 📋 概述

本项目包含多个 PlantUML 格式的 UML 图，用于展示整洁架构的各个层面。本文档说明如何查看这些图表。

## 🛠️ 查看方式

### 方式 1：使用 VS Code 插件（推荐）

1. 安装 PlantUML 插件：

   - 在 VS Code 中搜索并安装 "PlantUML" 插件（作者：jebbs）
   - 或者安装 "Markdown Preview Mermaid Support" 插件

2. 查看图表：
   - 打开 `.puml` 文件
   - 按 `Alt + D` 或右键选择 "Preview PlantUML"
   - 图表会在预览窗口中显示

### 方式 2：使用在线工具

1. 访问 [PlantUML Online Server](http://www.plantuml.com/plantuml/uml/)
2. 复制 `.puml` 文件内容
3. 粘贴到在线编辑器中
4. 自动生成图表

### 方式 3：使用本地工具

1. 安装 PlantUML：

   ```bash
   # 使用 Homebrew (macOS)
   brew install plantuml

   # 或使用 npm
   npm install -g node-plantuml
   ```

2. 生成图片：

   ```bash
   # 生成 PNG
   plantuml clean-architecture-package.puml

   # 生成 SVG
   plantuml -tsvg clean-architecture-package.puml
   ```

### 方式 4：使用 Docker

```bash
docker run -d -p 8080:8080 plantuml/plantuml-server:jetty
# 然后访问 http://localhost:8080
```

## 📊 UML 图列表

### 1. 包依赖图

- **文件**：`clean-architecture-package.puml`
- **类型**：Package Diagram
- **用途**：展示各层之间的依赖关系和包结构
- **关键信息**：
  - 依赖方向（从外到内）
  - 各层的职责划分
  - 共享层的使用

### 2. 类图

- **文件**：`clean-architecture-class.puml`
- **类型**：Class Diagram
- **用途**：展示组件管理功能的类结构和关系
- **关键信息**：
  - 实体类结构
  - 接口定义
  - 用例实现
  - 适配器模式

### 3. 序列图

- **文件**：`clean-architecture-sequence.puml`
- **类型**：Sequence Diagram
- **用途**：展示创建组件用例的完整执行流程
- **关键信息**：
  - 方法调用顺序
  - 各层之间的交互
  - 数据流向

### 4. 层次结构图

- **文件**：`clean-architecture-layers.puml`
- **类型**：Component Diagram (Layers)
- **用途**：可视化展示各层的组件和依赖关系
- **关键信息**：
  - 颜色编码的各层
  - 组件分布
  - 依赖关系

### 5. 组件图

- **文件**：`clean-architecture-component.puml`
- **类型**：Component Diagram
- **用途**：展示完整系统的组件结构和交互关系
- **关键信息**：
  - 完整功能模块
  - 组件交互
  - 接口实现关系

## 🎨 图表说明

### 颜色编码

- 🟢 **绿色**：Domain Layer（领域层）- 业务核心
- 🔵 **蓝色**：Application Layer（应用层）- 用例编排
- 🟠 **橙色**：Infrastructure Layer（基础设施层）- 技术实现
- 🟣 **紫色**：Presentation Layer（表现层）- 用户界面
- ⚪ **灰色**：Shared Layer（共享层）- 工具和类型

### 箭头含义

- `-->`：依赖关系（实线箭头）
- `..|>`：实现关系（虚线箭头，带三角形）
- `..>`：使用关系（虚线箭头）

### 注释说明

图表中的 `note` 用于说明关键概念和注意事项。

## 🔍 使用建议

1. **理解架构**：先看包依赖图和层次结构图，理解整体架构
2. **深入细节**：再看类图和组件图，了解具体实现
3. **流程追踪**：使用序列图追踪具体的业务用例流程
4. **对比学习**：结合架构文档（CLEAN_ARCHITECTURE_REFACTORING.md）一起阅读

## 📝 更新图表

当架构发生变化时，请及时更新相应的 UML 图：

1. 修改 `.puml` 文件
2. 重新生成预览或图片
3. 更新相关文档说明

## 🔗 相关资源

- [PlantUML 官方文档](https://plantuml.com/)
- [PlantUML 语法参考](https://plantuml.com/guide)
- [整洁架构文档](./CLEAN_ARCHITECTURE_REFACTORING.md)

## ❓ 常见问题

### Q: 图表显示不正常？

A: 确保安装了正确的 PlantUML 插件，并检查 `.puml` 文件语法是否正确。

### Q: 如何导出为图片？

A: 使用 PlantUML 命令行工具或在线服务器可以导出为 PNG、SVG 等格式。

### Q: 可以修改图表样式吗？

A: 可以，修改 `.puml` 文件中的 `skinparam` 配置即可自定义样式。
