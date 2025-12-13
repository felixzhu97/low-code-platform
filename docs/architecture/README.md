# 架构文档

本目录包含 Felix 低代码平台的架构设计文档，使用 PlantUML 格式编写，采用 C4 模型和 ER 图来描述系统架构。

## 目录说明

本目录包含以下类型的架构文档：

- **C4 架构模型**：使用 C4 模型描述系统的不同层级
- **ER 设计图**：数据库实体关系图
- **PlantUML 库文件**：C4 PlantUML 模板文件

## 文件清单

### C4 架构模型

C4 模型是一种用于描述软件架构的层次化方法，包含以下四个层级：

1. **c4-context.puml** - 系统上下文图

   - 展示系统与外部用户和系统的交互关系

- 核心用户：页面设计师、开发者、终端用户、管理员
- 外部系统：CDN 服务、对象存储、认证服务、数据分析、第三方 API、代码托管

2. **c4-container.puml** - 容器架构图

   - 展示系统内部的主要容器和它们之间的关系
   - 核心容器：Web 应用、API 层、实时协作服务、数据库、缓存、文件存储

3. **c4-component.puml** - 组件架构图

   - 展示 Web 应用容器内的组件结构
   - 包含表现层、应用层、领域层和基础设施层的组件

4. **c4-clean-architecture.puml** - 整洁架构组件图

   - 详细展示整洁架构的层次结构和依赖关系
   - 展示各层之间的依赖方向

5. **c4-code.puml** - 代码级别图

   - 展示关键类和方法的具体实现
   - 包含类型定义、服务类、React 组件、用例类等

6. **c4-deployment.puml** - 部署架构图
   - 展示系统的部署拓扑和运行环境
   - 包含客户端环境、边缘网络、云计算平台、外部服务

### ER 设计图

- **er-design.puml** - 数据库实体关系图
  - 展示核心实体及其关系
  - 包含组件、模板、数据源、数据映射、主题配置、项目等实体
  - 定义实体之间的关联关系

### PlantUML 库文件

- **c4-plantuml/** - C4 PlantUML 模板库
  - 包含 C4 模型的 PlantUML 模板文件
  - 用于渲染 C4 架构图

## 使用方法

### 查看图表

这些 PlantUML 文件可以使用以下工具渲染：

- **在线工具**：[PlantUML Online](http://www.plantuml.com/plantuml/)
- **VS Code 插件**：PlantUML
- **命令行工具**：PlantUML CLI

### 命令行生成图片

```bash
# 生成 C4 架构图
plantuml -tpng docs/architecture/c4-context.puml
plantuml -tsvg docs/architecture/c4-container.puml
plantuml -tpng docs/architecture/c4-component.puml
plantuml -tpng docs/architecture/c4-clean-architecture.puml
plantuml -tpng docs/architecture/c4-code.puml
plantuml -tpng docs/architecture/c4-deployment.puml

# 生成 ER 设计图
plantuml -tpng docs/architecture/er-design.puml
```

## 相关文档

更多详细的架构说明和设计原则，请参考：

- [主文档](../README.md) - 完整的架构文档和设计说明

## 维护说明

- 重大架构变更时，请及时更新相应的 C4 图表
- 新增重要组件时，请更新组件架构图
- 数据库结构变更时，请更新 ER 设计图
