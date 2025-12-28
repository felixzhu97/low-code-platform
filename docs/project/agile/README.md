# 敏捷方法论文档

本目录包含 Felix 低代码平台的敏捷方法论文档，使用 PlantUML 格式编写，涵盖 Scrum 框架的核心流程、角色职责、Sprint 生命周期、用户故事到交付的完整流程以及各个敏捷仪式的详细说明。

## 概述

敏捷方法论文档提供了完整的 Scrum 框架实施指南，帮助团队理解和使用敏捷开发方法。这些文档从多个维度描述了敏捷开发的核心要素：

- **Scrum 流程**：Scrum 框架的核心流程和仪式
- **角色职责**：敏捷开发中的角色定义和职责分工
- **Sprint 生命周期**：一个 Sprint 的完整生命周期
- **用户故事到交付**：从用户故事到产品交付的完整流程
- **敏捷仪式**：各个敏捷仪式的详细流程和最佳实践

## 文件清单

### 1. scrum-process.puml - Scrum 流程总览图

Scrum 流程总览图展示了 Scrum 框架的核心要素，包括：

- **三个角色**：
  - Product Owner（产品负责人）：管理产品待办事项，最大化产品价值
  - Scrum Master：促进 Scrum 流程，移除团队阻碍
  - Development Team（开发团队）：交付可工作的软件

- **三个工件**：
  - Product Backlog（产品待办事项）：按优先级排序的需求列表
  - Sprint Backlog（Sprint 待办事项）：本 Sprint 要完成的工作
  - Increment（增量）：可工作的软件增量

- **五个仪式**：
  - Sprint Planning（Sprint 规划）：选择待办事项，制定 Sprint 目标
  - Daily Standup（每日站会）：每日同步进度和阻碍
  - Sprint Review（Sprint 评审）：演示完成的功能，收集反馈
  - Sprint Retrospective（Sprint 回顾）：回顾过程，制定改进计划
  - Backlog Refinement（待办事项细化）：持续细化用户故事

- **Sprint 循环**：展示从 Sprint Planning 到 Retrospective 的完整循环

### 2. agile-roles.puml - 敏捷角色和职责图

敏捷角色和职责图详细描述了敏捷开发中的各个角色：

- **Scrum 核心角色**：
  - Product Owner：产品管理和沟通协调职责
  - Scrum Master：流程促进和团队发展职责
  - Development Team：交付和协作职责

- **利益相关者**：
  - 业务方：提供业务需求和反馈
  - 最终用户：使用产品并提供反馈
  - 管理层：提供资源支持和战略目标

- **角色协作场景**：展示各角色之间的协作方式
- **技能要求**：各角色需要的核心技能

### 3. sprint-lifecycle.puml - Sprint 生命周期图

Sprint 生命周期图详细展示了一个 Sprint 的完整生命周期：

- **Sprint Planning**：Sprint 规划阶段，选择待办事项，制定目标
- **Sprint 执行阶段**：
  - 每日站会：每日同步进度
  - 开发工作：需求澄清、设计、编码、测试、代码审查
  - 持续集成：自动化构建和测试
- **Sprint Review**：Sprint 评审，演示功能，收集反馈
- **Sprint Retrospective**：Sprint 回顾，识别改进机会
- **交付增量**：交付可工作的软件增量

- **Sprint 时间线**：展示典型 2 周 Sprint 的时间安排
- **各阶段活动**：详细展示每个阶段的具体活动
- **Sprint 产出物**：Sprint Backlog、增量、Sprint 报告

### 4. user-story-to-delivery.puml - 用户故事到交付流程

用户故事到交付流程图展示了从用户故事到产品交付的完整流程：

- **需求来源**：业务需求和技术需求
- **Epic 和 User Story**：Epic 分解为 User Story，遵循标准格式
- **Product Backlog 管理**：用户故事添加到 Backlog，持续细化
- **Sprint Planning**：选择待办事项，任务分解
- **开发阶段**：需求澄清、设计、编码、单元测试、代码审查
- **测试和集成**：集成测试、验收测试、持续集成
- **部署流程**：测试环境、预发布环境、生产环境部署
- **Sprint Review 和反馈**：功能演示、收集反馈、更新 Backlog
- **关键指标**：开发指标、质量指标、交付指标

该流程图与项目的 [用户故事文档](../../product/user-stories.md) 关联，展示了用户故事从定义到交付的完整路径。

### 5. agile-ceremonies.puml - 敏捷仪式详细图

敏捷仪式详细图展示了各个敏捷仪式的详细流程和最佳实践：

- **Sprint Planning**：
  - 第一部分：做什么（选择待办事项，确定 Sprint 目标）
  - 第二部分：怎么做（任务分解，估算工作量）
  - 产出：Sprint 目标、Sprint Backlog

- **Daily Standup**：
  - 站会前准备：更新任务状态，识别阻碍
  - 站会进行中：分享进度，讨论阻碍
  - 站会后行动：解决阻碍，继续开发

- **Sprint Review**：
  - 准备演示：准备演示环境和内容
  - 功能演示：演示完成的功能
  - 收集反馈：收集利益相关者反馈
  - 讨论和调整：更新 Product Backlog

- **Sprint Retrospective**：
  - 回顾准备：准备回顾材料和方法
  - 识别改进点：做得好的地方和需要改进的地方
  - 制定行动项：制定改进行动项，分配责任人

- **Backlog Refinement**：
  - 细化用户故事：添加验收标准，估算故事点
  - 调整优先级：根据业务价值和技术依赖调整

- **最佳实践**：各仪式的最佳实践建议
- **时间安排**：2 周 Sprint 的时间安排示例

## 使用方法

### 查看图表

这些 PlantUML 文件可以使用以下工具渲染：

- **在线工具**：[PlantUML Online](http://www.plantuml.com/plantuml/)
- **VS Code 插件**：PlantUML
- **命令行工具**：PlantUML CLI

### 命令行生成图片

```bash
# 生成 Scrum 流程总览图
plantuml -tpng docs/project/agile/scrum-process.puml
plantuml -tsvg docs/project/agile/scrum-process.puml

# 生成敏捷角色和职责图
plantuml -tpng docs/project/agile/agile-roles.puml
plantuml -tsvg docs/project/agile/agile-roles.puml

# 生成 Sprint 生命周期图
plantuml -tpng docs/project/agile/sprint-lifecycle.puml
plantuml -tsvg docs/project/agile/sprint-lifecycle.puml

# 生成用户故事到交付流程图
plantuml -tpng docs/project/agile/user-story-to-delivery.puml
plantuml -tsvg docs/project/agile/user-story-to-delivery.puml

# 生成敏捷仪式详细图
plantuml -tpng docs/project/agile/agile-ceremonies.puml
plantuml -tsvg docs/project/agile/agile-ceremonies.puml
```

### VS Code 预览

如果使用 VS Code，推荐安装以下插件：

- **PlantUML**：提供 PlantUML 文件的预览和导出功能
- **Markdown Preview Enhanced**：在 Markdown 中嵌入 PlantUML 图表

在 VS Code 中打开 `.puml` 文件后，可以使用快捷键 `Alt + D` 预览图表。

## 文档之间的关系

这些敏捷方法论文档相互关联，形成了一个完整的敏捷开发指南：

1. **scrum-process.puml** 提供了 Scrum 框架的整体视图，展示了所有核心要素
2. **agile-roles.puml** 详细说明了各个角色的职责和协作方式
3. **sprint-lifecycle.puml** 展示了一个 Sprint 的完整生命周期
4. **user-story-to-delivery.puml** 展示了从需求到交付的完整流程
5. **agile-ceremonies.puml** 详细说明了各个仪式的具体流程和最佳实践

## 与项目文档的关联

这些敏捷方法论文档与项目的其他文档相互关联：

- **[用户故事文档](../../product/user-stories.md)**：user-story-to-delivery.puml 展示了用户故事从定义到交付的完整流程
- **[架构文档](../../README.md)**：敏捷方法论支持架构文档中描述的开发流程
- **[TOGAF 架构文档](../../architecture/togaf/README.md)**：敏捷方法论指导架构的实施和演进

## 使用场景

这些敏捷方法论文档可以用于：

- **团队培训**：帮助新团队成员理解敏捷开发方法
- **流程优化**：识别和改进开发流程中的问题
- **角色定义**：明确各角色的职责和协作方式
- **Sprint 规划**：指导 Sprint Planning 和 Backlog Refinement
- **回顾改进**：在 Retrospective 中参考最佳实践

## 关键原则

实施敏捷方法论时，应遵循以下核心原则：

1. **价值驱动**：聚焦交付业务价值，优先处理高价值需求
2. **持续改进**：通过 Retrospective 持续改进团队效能
3. **透明沟通**：通过 Daily Standup 和 Sprint Review 保持透明沟通
4. **自组织团队**：团队自主决定如何完成工作
5. **快速反馈**：通过短周期 Sprint 快速获得反馈
6. **质量优先**：确保每个增量都是可工作的、高质量的软件

## 维护说明

- 团队流程变更时，请及时更新相应的图表
- 新增角色或职责变更时，请更新 agile-roles.puml
- Sprint 流程优化时，请更新 sprint-lifecycle.puml
- 用户故事流程变更时，请更新 user-story-to-delivery.puml
- 仪式流程改进时，请更新 agile-ceremonies.puml

## 相关文档

更多详细的架构说明和设计原则，请参考：

- [主架构文档](../../README.md) - 完整的架构文档和设计说明
- [用户故事文档](../../product/user-stories.md) - 用户故事定义和 Epic 分解
- [TOGAF 架构文档](../../architecture/togaf/README.md) - 企业架构视图
- [沃德利地图](../../strategy/wardley-maps/README.md) - 技术演化和价值网络分析

## 参考资料

- [Scrum Guide](https://scrumguides.org/) - Scrum 官方指南
- [敏捷宣言](https://agilemanifesto.org/) - 敏捷软件开发宣言
- [PlantUML 文档](https://plantuml.com/) - PlantUML 语法和示例

---

**最后更新时间**：2024 年 12 月

