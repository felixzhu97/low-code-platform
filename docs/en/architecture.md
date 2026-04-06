# Low-Code Platform — Architecture

**中文完整版:** [platform-architecture.md](../zh/platform-architecture.md)

## Overview

Felix low-code platform is a visual page builder on **Next.js** and **React**, organized with **Clean Architecture** and **DDD-style** layering. It supports drag-and-drop editing, templates, data binding, themes, optional code export, and AI-assisted generation.

## Design principles

- **Layering:** Separate domain rules from application orchestration and infrastructure.
- **Clean Architecture:** Dependencies point inward; the domain has no framework imports.
- **Dependency inversion:** Outer layers depend on abstractions (ports) that infrastructure implements.
- **Single responsibility:** Modules, facades, and use cases stay focused.
- **Component model:** Extensible built-in components and custom component flows.
- **Responsive UI:** Layout and preview adapt across viewports.
- **Scalability:** Shared packages (`packages/*`) for data structures; monorepo workspaces for dependencies.

## Repository layout

```text
low-code-platform/
├── apps/
│   ├── web/           # Next.js 15 editor + preview (Clean Architecture under src/)
│   │   └── src/lib/  # Internal libraries (ai-generator)
│   └── server/        # FastAPI backend
└── packages/          # Shared packages (schema, component-utils, utils)
```

> **Note**: `packages/` contains data structures shared between frontend and backend. `apps/web/src/lib/` contains application-specific code (ai-generator).

Frontend source lives in **`apps/web/src/`**:

```text
apps/web/src/
├── domain/             # Entities, value objects, repository contracts
├── application/        # Use cases, application services, ports, DTOs
├── infrastructure/     # Repository implementations, Zustand adapters
├── presentation/     # React UI: canvas, panels, renderers, shadcn-style ui/
├── app/                # Next.js App Router entry (routes, layout)
└── shared/             # Cross-cutting helpers used by multiple layers
```

Editor chrome and component renderers use **Emotion**; **Tailwind** and **Radix** (shadcn patterns) remain for primitives and tokens.

Backend API is **FastAPI** under `apps/server/` (Python, Pydantic, Uvicorn).

## Layer roles

| Layer | Role |
|--------|------|
| **Domain** | Core types and rules: components, templates, data sources; no UI or HTTP. |
| **Application** | Use cases (create/update components, apply templates, canvas updates) and ports. |
| **Infrastructure** | Zustand stores, persistence adapters, external APIs implementing ports. |
| **Presentation** | React tree: canvas, property panel, component renderers, hooks, Emotion styles. |

## Dependency rule

```text
Presentation → Application → Domain
Infrastructure → implements Application ports & Domain-facing contracts
```

- The domain **must not** import from application, infrastructure, or presentation.
- Presentation talks to application through adapters / use cases, not directly to stores when a port is defined.

## Architecture diagrams

- **C4 (English labels):** [`architecture/c4/`](architecture/c4/) — context, container, component, clean-architecture, code sketch, deployment.
- **C4 (Chinese labels):** [`../zh/architecture/c4/`](../zh/architecture/c4/) — parallel sources, same structure.
- **TOGAF:** English [`architecture/togaf/togaf-overview.md`](architecture/togaf/togaf-overview.md) + `.puml` (from zh via `docs/scripts/togaf_zh_to_en_puml.py`). Chinese: [`../zh/architecture/togaf/togaf-overview.md`](../zh/architecture/togaf/togaf-overview.md).

Additional UML placeholders and strategy maps referenced only in the Chinese doc may live under future paths; the **canonical** diagram sources for this repo are the C4 and TOGAF folders above.

## Related documentation

- [Repository README](../../README.md)
- [Architecture (中文)](../zh/platform-architecture.md)
- [Local LLM (Ollama)](local-llm-setup.md)
- [Local LLM (中文)](../zh/local-llm-setup.md)
- [Docs scripts / TOGAF regen](../../scripts/TOOLING.md)
