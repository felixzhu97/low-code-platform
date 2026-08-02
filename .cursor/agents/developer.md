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

### TypeScript / Clean Architecture

**包结构（domain-first）**：
```
src/
├── app/                              # Next.js shell
├── {module}/domain|application|infrastructure|presentation/
└── common/                           # UI kit, utils, persistence, history
```

Modules: `canvas`, `component`, `template`, `theme`, `data`, `chart`, `form`, `export`, `collaboration`.

**关键规范**：
- Domain 不依赖 React / Next.js
- 应用服务编排用例；领域规则留在 `{module}/domain`
- 禁止全局 `src/domain|application|presentation|shared` 与 `domain/port` / `*Port` / `adapter/in|out`
- 变量与方法命名必须对齐 [领域术语表](../../docs/Glossary.md) Preferred Term；细则见 developer skill → `references/clean-code-naming.md`
- UI 状态优先各域 `infrastructure` stores（经 `common/infrastructure/stores` facade 组合）

**示例 - 领域服务用法**：通过 `{module}/application` 调用 domain factory / management，不在组件内散落业务规则。

### React / Next.js (Presentation)

**关键规范**：
- Next.js App Router 入口在 `src/app/`
- UI 放在所属业务域的 `presentation/`（横切 primitives 在 `common/presentation/ui`）
- Hooks 放各域 `presentation/hooks` 或 `common/presentation/hooks`
- 类型优先；命名对齐 Glossary Preferred Term + clean-code-naming（禁止含糊的 `data`/`tmp`/`handle` 及术语同义词）

**示例 - 组件职责**：
- Canvas / ComponentPanel / PropertiesPanel 只负责交互与展示
- 增删改组件走 application services + stores，不在 JSX 内写领域规则

## 实现流程

1. **XP**：先对齐客户价值 / Jira AC；小步切片可合并；见 [extreme-programming](../skills/developer/references/extreme-programming.md)
2. **BDD**：用 Given-When-Then 澄清行为（对齐 Jira AC）
3. **TDD**：Red → Green → Refactor；测试名 `should_expected_when_condition`
4. **DDD**：规则落在 domain； application 只编排
5. **领域命名**：变量/方法用术语表 Preferred Term，再套 Clean Code 形式
6. **UI/UX**：对齐 Apple HIG，极简风格（见 apple-minimal-ux）
7. **分支 / Commit / PR / Jira**：`<type>/<slug>`（类型与 commit 一致；Jira key 仅写在 commit/PR）+ Chain PR；沿用 [developer](../skills/developer/SKILL.md) §6 与 [Product Owner](../skills/product-owner/SKILL.md)；References 优先官方文档与 research
8. **运行测试** → 再按上述规范提交

## 极简原则

- 每次改动最小化（Small Releases）
- YAGNI / Simple Design：不添加无关功能或投机抽象（见 [extreme-programming](../skills/developer/references/extreme-programming.md)）
- 不写冗余注释
- 保持代码简洁；绿后持续 Refactor
