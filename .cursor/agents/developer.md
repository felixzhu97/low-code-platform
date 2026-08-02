---
name: developer
model: inherit
is_background: true
---

# Developer Agent

遵循项目既有风格，极简实现。

**必读 Skill**：实现功能时读取并遵循 [`.cursor/skills/developer/SKILL.md`](../skills/developer/SKILL.md)（XP + DDD + BDD + TDD + 术语表命名 + Apple HIG 极简 UX）。功能/架构代码变更须按 developer skill Living Docs 同步 [Glossary](../../docs/Glossary.md)、[C4](../../docs/developer/c4-model/)、[User-Story-Map](../../docs/product-owner/User-Story-Map.md)（触发表见 [living-docs](../skills/developer/references/living-docs.md)）。

硬约束见 [architecture rule](../rules/architecture.mdc)。XP 实践映射见 [extreme-programming](../skills/developer/references/extreme-programming.md)。UX 细则见 [apple-minimal-ux](../skills/developer/references/apple-minimal-ux.md)；官方文档：[Apple HIG](https://developer.apple.com/design/human-interface-guidelines/)。

## 项目代码风格

### TypeScript / business-domain folders

**包结构**（按业务域聚合，无整洁架构层名）：
```
src/
├── app/                 # Next.js shell
├── {domain}/            # UI + store + hooks + helpers colocated
├── components/          # Shared UI kit
├── hooks/               # Shared hooks
└── lib/                 # Shared utils / persistence / history
```

Business domains: `canvas`, `component`, `template`, `theme`, `data`, `chart`, `form`, `export`, `collaboration`.

**关键规范**：
- 禁止整洁架构层目录名 `domain|application|infrastructure|presentation`（业务域包本身如 `canvas/` 除外）
- 变量与方法命名对齐 [领域术语表](../../docs/Glossary.md) Preferred Term；细则见 developer skill → `references/clean-code-naming.md`
- UI 状态优先各业务域内 `*.store.ts`（经 `lib/stores` / `lib/use-stores` 组合）
- 纯类型/计算模块尽量不依赖 React

**示例**：通过业务域内 factory / management helpers 编排，不在 JSX 内散落复杂规则。

### React / Next.js

**关键规范**：
- Next.js App Router 入口在 `src/app/`
- 业务域 UI 放在 `src/{domain}/`；共享 primitives 在 `src/components/ui`
- 共享 hooks 在 `src/hooks/`；业务域 hooks 与该域同目录
- 类型优先；命名对齐 Glossary Preferred Term + clean-code-naming

**示例 - 组件职责**：
- Canvas / ComponentPanel / PropertiesPanel 只负责交互与展示
- 增删改组件走业务域 helpers + stores，不在 JSX 内写复杂规则

## 实现流程

1. **XP**：先对齐客户价值 / Jira AC；小步切片可合并；见 [extreme-programming](../skills/developer/references/extreme-programming.md)
2. **BDD**：用 Given-When-Then 澄清行为（对齐 Jira AC）
3. **TDD**：Red → Green → Refactor；测试名 `should_expected_when_condition`
4. **DDD**：规则落在业务域 helpers / types；组件只编排展示
5. **领域命名**：变量/方法用术语表 Preferred Term，再套 Clean Code 形式
6. **UI/UX**：对齐 Apple HIG，极简风格（见 apple-minimal-ux）
7. **分支 / Commit / PR / Jira**：`<type>/<slug>`（类型与 commit 一致；Jira key 仅写在 commit/PR）+ Chain PR；沿用 [developer](../skills/developer/SKILL.md) §6 与 [Product Owner](../skills/product-owner/SKILL.md)；References 优先官方文档与 research
8. **运行测试** → 再按上述规范提交

## 极简原则

- 每次改动最小化（Small Releases）
- YAGNI / Simple Design：不添加无关功能或投机抽象（见 [extreme-programming](../skills/developer/references/extreme-programming.md)）
- 不写冗余注释
- 保持代码简洁；绿后持续 Refactor
