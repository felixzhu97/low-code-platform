# Quick Start | 快速开始

> Explore Lowcode — Local Development Guide（本地开发指南）

---

## 1. Prerequisites | 环境要求

| Requirement | Version |
| ----------- | ------- |
| Node.js | >= 18 |
| Package manager | pnpm (recommended) |

---

## 2. Install | 安装

```bash
pnpm install
```

---

## 3. Start | 启动

```bash
pnpm dev
```

Open [http://localhost:4250](http://localhost:4250).

---

## 4. First Use | 首次使用

1. Drag a component from the left **Component Panel** onto the **Canvas**
2. Select the component and edit props in the right **Properties** panel
3. Use **Preview** to inspect the result
4. Optionally apply a **Template**, customize **Theme**, or **Export** code

---

## 5. Common Commands | 常用命令

| Command | Description |
| ------- | ----------- |
| `pnpm dev` | Start Next.js dev server |
| `pnpm build` | Production build |
| `pnpm start` | Serve production build (`PORT` defaults to 4250) |
| `pnpm lint` | Run ESLint |
| `pnpm test` | Run Vitest |
| `pnpm test:coverage` | Coverage report |

---

## 6. Project Layout | 目录要点

```
src/
├── app/             # Next.js App Router shell
├── canvas/          # Business domain: canvas UI + store + hooks
├── component/       # Business domain: factory, panel, renderer, stores
├── template/ theme/ data/ chart/ form/ export/ collaboration/
├── components/      # Shared UI kit
├── hooks/           # Shared hooks
└── lib/             # Shared utils, persistence, history
```

Organize by business domain and colocate related files (React File Structure FAQ). No Clean Architecture layer folders. See [Glossary](../Glossary.md) and `.cursor/rules/architecture.mdc`.

---

## 7. Deploy | 部署

### Vercel (recommended)

1. Push the repository to GitHub
2. Import the project on [Vercel](https://vercel.com)
3. Deploy (Next.js detected automatically)

### Self-hosted

```bash
pnpm build
pnpm start
```

| Variable | Description | Default |
| -------- | ----------- | ------- |
| `PORT` | HTTP listen port | `4250` |

On platforms like Render, bind to `0.0.0.0:$PORT`.

---

## 8. Troubleshooting | 排查

| Symptom | Check |
| ------- | ----- |
| Port in use | Stop other process on 4250 or set `PORT` |
| Stale Next cache | Remove `.next` and rerun `pnpm dev` |
| Test failures | Ensure `pnpm install` completed; run `pnpm test` |

---

## 9. Related Docs | 相关文档

- [Glossary](../Glossary.md)
- [C4 Model](./c4-model/README.md)
- [User Story Map](../product-owner/User-Story-Map.md)
