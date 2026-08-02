# Living Docs Sync

Code that changes architecture, domain language, or product capabilities must update living docs in the **same PR**. Pure test/style/chore with no product or architecture meaning does not.

## Documents

| Document | Path | Owns |
|----------|------|------|
| Domain Glossary | [docs/Glossary.md](../../../../docs/Glossary.md) | Preferred Terms, modules, UI areas, code paths |
| C4 model | [docs/developer/c4-model/](../../../../docs/developer/c4-model/) | Context / containers / components / deployment (`.puml` is source of truth) |
| User Story Map | [docs/product-owner/User-Story-Map.md](../../../../docs/product-owner/User-Story-Map.md) | Journey / Backbone / Epic index (status) |
| User stories (Epics) | [docs/product-owner/user-stories/](../../../../docs/product-owner/user-stories/) | Per-US As a / GWT acceptance criteria / status |

## Trigger matrix

If **any** row matches, update the listed doc(s) in the same PR. If none match, mark N/A on the checklist.

| Change | Update |
|--------|--------|
| New or renamed Preferred Term, business concept, package path, UI area | Glossary |
| New module / container boundary / external system | C2 (+ C1 if actors/systems change) |
| Frontend shell, canvas/panels, major store/service structure | C3-Component-Frontend |
| Local or production deploy topology, ports, hosting | C4-Deployment and/or C4-Deployment-Production |
| New user-visible capability, nav/module add/remove, delivery status change | User Story Map index **and** the matching `user-stories/E*.md` (US text, GWT AC, status) |
| Pure unit/integration tests, formatting, dependency bump with no product/architecture semantics | None (N/A) |

### C4 layer cheat sheet

| File | Update when |
|------|-------------|
| `C1-Context.puml` | New external actor/system or system purpose change |
| `C2-Container.puml` | New app container / major data store / layer boundary |
| `C3-Component-Frontend.puml` | New editor shell, panel, store, or application service wiring |
| `C4-Deployment*.puml` | Port, host, or runtime topology change |

`.puml` first. Regenerate `png/` when PlantUML is available; otherwise note in the PR that PNGs are stale.

## Workflow

1. Implement the code change.
2. Run the trigger matrix; update every matched doc.
3. Include doc updates in the same PR (same commit or a follow-up docs commit on the same branch).
4. Checklist: Glossary / C4 / Story Map — done or N/A per matrix.

## Example — new Chart type

Adding a new chart component under `src/chart/`:

1. **Glossary** — Chart-related Preferred Term if naming changed.
2. **C4** — at least `C3-Component-Frontend.puml` if the component graph changes; regenerate png if possible.
3. **User Story Map** — update the matching US status/AC if the capability delivery status changes.
4. **user-stories/E*.md** — add or update the US block when acceptance criteria change.
