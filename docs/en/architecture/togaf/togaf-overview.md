# TOGAF architecture views (English labels)

PlantUML in this folder is produced from `docs/zh/architecture/togaf/*.puml` by `docs/scripts/togaf_zh_to_en_puml.py` (repo root).

**Chinese narrative:** [../../../zh/architecture/togaf/togaf-overview.md](../../../zh/architecture/togaf/togaf-overview.md)

| File | Topic |
|------|--------|
| [business-architecture.puml](business-architecture.puml) | Business capabilities & flows |
| [application-architecture.puml](application-architecture.puml) | Application / clean layers |
| [data-architecture.puml](data-architecture.puml) | Entities, storage, flows |
| [technology-architecture.puml](technology-architecture.puml) | Stack & infrastructure |

```bash
python3 docs/scripts/togaf_zh_to_en_puml.py
plantuml -tpng docs/en/architecture/togaf/business-architecture.puml
```

**C4:** English [../c4/](../c4/), Chinese [../../../zh/architecture/c4/](../../../zh/architecture/c4/).
