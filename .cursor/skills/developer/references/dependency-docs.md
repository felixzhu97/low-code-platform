# Project Dependency Reference

**Why-corroboration catalog.** Every row is a `Claim in why` you can paste or adapt into a commit/PR why paragraph, plus an official URL that supports that claim. Prefer specific docs pages over marketing homepages.

When adding a dependency: add a row with claim + deep link — never library name alone.

For lab research / open-source hubs, also use [business-tech-analysis sources](../../business-tech-analysis/references/sources.md) and arXiv abs pages when relevant.

## Frontend

| Claim in why | Artifact | Official doc |
|--------------|----------|--------------|
| Use App Router / React Server Components patterns | Next.js | [Next.js App Router](https://nextjs.org/docs/app) |
| Build UI with React 19 components and hooks | React 19 | [React docs](https://react.dev) |
| Utility-first styling without a second design system | Tailwind CSS | [Tailwind CSS docs](https://tailwindcss.com/docs) |
| Accessible primitives for dialogs, menus, etc. | Radix UI | [Radix Primitives](https://www.radix-ui.com/primitives/docs/overview/introduction) |
| Drag-and-drop on the canvas | React DnD | [React DnD docs](https://react-dnd.github.io/react-dnd/docs/overview) |
| Client state for editor stores | Zustand | [Zustand docs](https://zustand.docs.pmnd.rs/getting-started/introduction) |
| Charts on the canvas | Recharts | [Recharts guide](https://recharts.org/en-US/guide) |
| Forms with schema validation | React Hook Form + Zod | [RHF](https://react-hook-form.com/) · [Zod](https://zod.dev/) |
| Type-check with TypeScript | TypeScript | [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html) |
| Lint TS/JS with project ESLint rules | ESLint | [ESLint docs](https://eslint.org/docs/latest/) |
| Unit-test with Vitest + Testing Library | Vitest | [Vitest guide](https://vitest.dev/guide/) · [Testing Library](https://testing-library.com/docs/react-testing-library/intro/) |
| Install and run scripts with pnpm | pnpm | [pnpm CLI](https://pnpm.io/cli/install) |

## Deploy / platform

| Claim in why | Artifact | Official doc |
|--------------|----------|--------------|
| Deploy Next.js on Vercel | Vercel | [Vercel Next.js guide](https://vercel.com/docs/frameworks/nextjs) |
| Bind HTTP port from platform env | PORT | [Vercel environment variables](https://vercel.com/docs/projects/environment-variables) |

## Design / UX / delivery

| Claim in why | Artifact | Official doc |
|--------------|----------|--------------|
| Prefer clarity and deference in product UI | Apple HIG | [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/) |
| Keep architecture diagrams layered and audience-specific | C4 model | [c4model.com](https://c4model.com/) |
| Keep story maps as the delivery backbone | User Story Mapping | [Jeff Patton — User Story Mapping](https://www.jpattonassociates.com/user-story-mapping/) |
| Cite code-review expectations for PR quality | Google eng practices | [Code Review](https://google.github.io/eng-practices/review/) |
| Keep Cursor always-apply rules thin | Cursor Rules | [Cursor Rules](https://cursor.com/docs/context/rules) |

## Google ecosystem (optional claims)

| Claim in why | Artifact | Official doc |
|--------------|----------|--------------|
| Treat latency / reliability as reviewable signals | SRE Book | [Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/) |
| Prefer Well-Architected guidance for cloud deploy trade-offs | Google Cloud WAF | [Well-Architected Framework](https://docs.cloud.google.com/architecture/framework) |
