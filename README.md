# Low-Code Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black.svg)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6.svg)](https://www.typescriptlang.org/)

Low-Code Platform brings visual page building into everyday product work. Our mission is to help teams design, compose, and ship interfaces faster—without sacrificing clarity or code quality.

**Live:** [https://low-code-platform-eta.vercel.app/](https://low-code-platform-eta.vercel.app/)

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)

## Features

| Area | Capability |
|------|------------|
| **Canvas** | Drag-and-drop layout, component tree, properties panel, responsive device preview |
| **Components** | Built-in UI kit, charts, forms; custom component builder and grouping |
| **Data** | Data sources, binding, and table / list / card style views |
| **Theme** | Theme tokens and animation editor |
| **Templates** | Gallery of page templates to start from |
| **Export** | Export designed pages as front-end code |
| **Persistence** | Local project state via browser LocalStorage; undo / redo history |

## Tech Stack

| Layer | Choice |
|-------|--------|
| App | Next.js 16 (App Router), React 19, TypeScript |
| UI | Tailwind CSS, Radix UI, Lucide |
| DnD | React DnD |
| State | Zustand |
| Charts | Recharts |
| Forms | React Hook Form + Zod |
| Tests | Vitest + Testing Library |

Source is organized by **business domain** under `src/{domain}/` (UI, stores, and helpers colocated). Shared UI lives in `src/components/`, shared hooks in `src/hooks/`, and shared utilities in `src/lib/`. See [Glossary](docs/Glossary.md) and [architecture rule](.cursor/rules/architecture.mdc).

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | 18+ |
| pnpm | latest recommended |
| Git | latest |

No API keys are required for the local editor.

## Getting Started

```bash
git clone https://github.com/felixzhu97/low-code-platform.git
cd low-code-platform
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

More detail: [docs/developer/QUICKSTART.md](docs/developer/QUICKSTART.md).

## Usage

1. Drag a component from the left **Component Panel** onto the **Canvas**.
2. Select the component and edit props in the right **Properties** panel.
3. Use **Preview** (and device controls) to inspect the result.
4. Optionally apply a **Template**, adjust **Theme**, bind **Data**, or **Export** code.

## Testing

```bash
pnpm test
pnpm test:coverage
```

## Project Structure

```
low-code-platform/
├── src/
│   ├── app/                 # Next.js App Router shell
│   ├── canvas/              # Canvas UI, store, hooks
│   ├── component/           # Factory, panel, renderer, stores
│   ├── template/ theme/ data/ chart/ form/ export/ collaboration/
│   ├── components/          # Shared UI kit + chrome
│   ├── hooks/               # Shared hooks
│   └── lib/                 # utils, persistence, history, store facade
├── docs/                    # Glossary, C4, user stories
└── public/
```

## Deployment

| Target | Notes |
|--------|--------|
| [Vercel](https://vercel.com) | Recommended for Next.js; import the GitHub repo and deploy |
| Self-hosted | `pnpm build` then `pnpm start` (binds to the host `PORT` when set) |

## Documentation

| Doc | Link |
|-----|------|
| Quick start | [docs/developer/QUICKSTART.md](docs/developer/QUICKSTART.md) |
| C4 model | [docs/developer/c4-model/](docs/developer/c4-model/) |
| Glossary | [docs/Glossary.md](docs/Glossary.md) |
| User story map | [docs/product-owner/User-Story-Map.md](docs/product-owner/User-Story-Map.md) |

![C1 Context](docs/developer/c4-model/png/C1-Context.png)

![C2 Container](docs/developer/c4-model/png/C2-Container.png)

## Contributing

Issues and pull requests are welcome. Use the repository [pull request template](.github/pull_request_template.md) (why paragraph, References, Jira link).

## License

[MIT](LICENSE) © Felix
