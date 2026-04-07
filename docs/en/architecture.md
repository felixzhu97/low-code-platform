# Low-Code Platform — Architecture

**中文完整版:** [platform-architecture.md](../zh/platform-architecture.md)

## Overview

Felix low-code platform is a visual page builder on **Next.js** and **React**, organized with **Clean Architecture** and **DDD-style** layering. It supports drag-and-drop editing, templates, data binding, themes, optional code export, and AI-assisted generation via multi-provider LLMs (OpenAI, Claude, DeepSeek, Gemini, Ollama, SiliconFlow, and more).

## Design principles

- **Layering:** Separate domain rules from application orchestration and infrastructure.
- **Clean Architecture:** Dependencies point inward; the domain has no framework imports.
- **Dependency inversion:** Outer layers depend on abstractions (ports) that infrastructure implements.
- **Single responsibility:** Modules, facades, and use cases stay focused.
- **Component model:** Extensible built-in components and custom component flows.
- **Responsive UI:** Layout and preview adapt across viewports.
- **Scalability:** Shared packages (`packages/*`) for data structures; monorepo workspaces for dependencies.
- **Flat component tree:** All components are stored in a flat `components[]` array; parent-child relationships use `parentId`. AI-generated nested `children` are flattened by `JSONParser.flattenPageComponents()`.

## Repository layout

```text
low-code-platform/
├── apps/
│   ├── web/           # Next.js 15 editor + preview (Clean Architecture under src/)
│   │   └── src/
│   │       ├── domain/           # Entities, value objects, domain services
│   │       ├── application/      # Use cases, services, ports, DTOs
│   │       ├── infrastructure/   # Zustand stores, persistence adapters
│   │       ├── presentation/    # React UI: canvas, panels, renderers, hooks
│   │       └── lib/             # Internal app libs (ai-generator/)
│   └── server/        # FastAPI backend
└── packages/          # Shared packages (schema, component-utils, utils)
```

## Layer roles

| Layer | Role |
|-------|------|
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

## AI Generation internal library (`apps/web/src/lib/ai-generator`)

The `ai-generator/` library is application-specific code (not shared), located under `apps/web/src/lib/`. It provides:

- **Multi-model client factory** (`AIClientFactory`): Creates OpenAI, Claude, DeepSeek, Gemini, Ollama, Groq, Mistral, SiliconFlow, Azure OpenAI clients
- **Base client** (`BaseAIClient`): `fetchWithTimeout`, `withRetry`, `parseJSONResponse`
- **OllamaClient**: Default 10-minute timeout for local LLM inference
- **Generators**: `ComponentGenerator`, `PageGenerator` — call AI clients and parse responses
- **JSONParser**: `flattenPageComponents()` flattens AI-returned nested `children` into a flat `components[]` with `parentId` links
- **Prompt builders**: `ComponentPromptBuilder`, `PagePromptBuilder`
- **Validators**: `ComponentValidator`, `PageValidator`

## Architecture diagrams

- **C4 (English labels):** [`architecture/c4/`](architecture/c4/) — context, container, component, clean-architecture, code sketch, deployment.
- **C4 (Chinese labels):** [`../zh/architecture/c4/`](../zh/architecture/c4/) — parallel sources, same structure.
- **TOGAF:** English [`architecture/togaf/togaf-overview.md`](architecture/togaf/togaf-overview.md) + `.puml`. Chinese: [`../zh/architecture/togaf/togaf-overview.md`](../zh/architecture/togaf/togaf-overview.md).

## Related documentation

- [Repository README](../../README.md)
- [Architecture (中文)](../zh/platform-architecture.md)
- [Local LLM (Ollama)](local-llm-setup.md)
- [Local LLM (中文)](../zh/local-llm-setup.md)
