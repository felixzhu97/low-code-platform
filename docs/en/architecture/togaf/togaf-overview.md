# TOGAF Architecture Views

**中文文档：** [../../../zh/architecture/togaf/togaf-overview.md](../../../zh/architecture/togaf/togaf-overview.md)

This folder contains the Felix Low-Code Platform's TOGAF (The Open Group Architecture Framework) enterprise architecture documentation, written in PlantUML, covering four core views: Business, Application, Data, and Technology Architecture.

## Overview

TOGAF provides a complete architecture development method. This project's TOGAF documentation describes the low-code platform's architecture across four dimensions:

- **Business Architecture**: Business roles, processes, capabilities, and value streams
- **Application Architecture**: Application systems, components, and their interactions (Clean Architecture)
- **Data Architecture**: Data entities, data flows, and storage
- **Technology Architecture**: Technology stack, infrastructure, and deployment

## File Index

### 1. business-architecture.puml — Business Architecture

Describes the platform's business design:

- **Business Roles**: Page Designer, Developer, Administrator, End User
- **Core Business Processes**: Page design & build, **template management** (browse/category/search/preview/apply), collaboration, code export, **Schema management** (import/export), data management, i18n, auth, AI generation
- **Business Capabilities**: Visual editing, component management, data binding, collaboration, code generation, **Schema management**, **template management** (browse/category/search/preview/apply/customize/share), i18n, auth, charts, AI generation
- **Value Stream**: From requirements to deployment

Key update (2026-04): Added **Nested Component Flattening** as a new AI generation sub-capability, reflecting the fix for AI-generated nested JSON (`children` with full objects) being flattened into a flat `components` array with `parentId` links.

### 2. application-architecture.puml — Application Architecture

Describes the application system structure using Clean Architecture:

- **Presentation Layer**: Visual editor, component panel, property panel, **TemplateGallery**, **TemplatePreview**, data panel, data source selector, JSON input, AI Chat, AI Generator UI, form builder, theme editor, **Hook layer** (use-template-gallery), **adapters** (template.adapter, ai-generator.adapter)
- **Application Layer**: ComponentManagementService, **TemplateManagementService**, DataBindingService, DataSourceService, JsonHelperService, CanvasManagementService, HistoryService, SchemaManagementService, **AIGeneratorAdapter**, **ApplyTemplateUseCase**, **CreateComponentUseCase**, **UpdateComponentUseCase**, **DeleteComponentUseCase**, **UpdateCanvasStateUseCase**
- **Domain Layer**: Component, Template, Project, DataSource, DataMapping, ThemeConfig, ChartConfig entities; **ComponentFactoryService** component factory; **Repository interfaces** (ComponentRepository, TemplateRepository, DataSourceRepository)
- **Infrastructure Layer**: Zustand stores (Canvas/Component/**Data**/History/Theme/UI/**CustomComponents**), persistence (ComponentRepositoryImpl, TemplateRepositoryImpl, DataSourceRepositoryImpl, LocalStorageAdapter), **AI Generator internal lib** (`lib/ai-generator`)

### 3. data-architecture.puml — Data Architecture

Describes the platform's data model, flows, and storage:

- **Core Data Entities**: Component (`children: string[]` + `parentId` for flat array), **Template** (with `category`, `tags`, `description`, `thumbnail`), Project, DataSource, DataMapping, ThemeConfig, HistoryRecord, PageSchema, ChartConfig
- **Data Storage**: **LocalStorage (browser)** with **template data** in `presentation/data/templates/` (per-category files), PostgreSQL (optional), Redis (optional), Object Storage (optional)
- **Key Data Flows**:
  - **AI Generation**: user input → AI returns nested JSON → `JSONParser.flattenPageComponents()` flattens → ApplyTemplateUseCase → Zustand stores → canvas renders
  - **Schema Import**: upload JSON → parse → flatten nested children → render to canvas
  - **Template Application** (`appendTemplateFromComponents`): browse → select → ApplyTemplateUseCase → ComponentFactory → batch add → canvas renders
  - Data binding, component editing, collaboration sync

**Key Design**: Component uses a **flat `components` array + `parentId`** for parent-child relationships. AI-generated nested `children` (with full objects) are flattened by `JSONParser.flattenPageComponents()` to ensure Zustand stores render correctly.

### 4. technology-architecture.puml — Technology Architecture

Describes the tech stack, infrastructure, and deployment:

- **Frontend**: Next.js 15 + React 19 + TypeScript + Emotion + Radix UI + React DnD + Recharts + Zustand + react-i18next
- **AI Generator Internal Lib** (`lib/ai-generator`): Multi-model client factory, BaseAIClient with retry and timeout, **JSONParser** (with `flattenPageComponents`), **ComponentGenerator / PageGenerator**, **ComponentPromptBuilder / PagePromptBuilder**, **ComponentValidator / PageValidator**, OllamaClient (10-min default timeout)
- **Backend**: FastAPI + Python 3 + Uvicorn + Pydantic (optional deployment)
- **Dev Mode**: Frontend runs standalone without backend; AI connects directly from browser (Ollama localhost or cloud API); Zustand state stored in LocalStorage; **template data loaded locally** (`presentation/data/templates/`)

## How to View

PlantUML files can be rendered with:

- **Online**: [PlantUML Online](http://www.plantuml.com/plantuml/)
- **VS Code**: PlantUML extension
- **CLI**: PlantUML CLI

```bash
plantuml -tpng docs/en/architecture/togaf/business-architecture.puml
plantuml -tpng docs/en/architecture/togaf/application-architecture.puml
plantuml -tpng docs/en/architecture/togaf/data-architecture.puml
plantuml -tpng docs/en/architecture/togaf/technology-architecture.puml
```

## Architecture View Relationships

1. **Business Architecture** defines "what and why" — provides business goals
2. **Application Architecture** converts business capabilities into application functions
3. **Data Architecture** defines how data is organized and flows
4. **Technology Architecture** provides the technical infrastructure

## Relationship with C4 Model

- **C4 Model** (in [../c4/](../c4/)): Hierarchical view from system context to code-level design
- **TOGAF** (this folder): Enterprise architecture views covering business, application, data, and technology dimensions

## Latest Updates

### 2026-04-08: Documentation and Architecture Sync

- **README.md**: Updated project structure with precise descriptions of domain (component/template/datasource/theme/chart/shared/value-objects/repositories/entities), application (use-cases/ports/services), infrastructure (state-management/persistence), presentation (components/hooks/adapters/data), lib (ai-generator)
- **C4 diagrams**: Updated c4-component (new UI library, template library, chart components, data binding, Hook layer), c4-container (added standalone frontend explanation), c4-context (distinguished cloud vs. local LLM), c4-clean-architecture (detailed layer responsibility annotations)
- **TOGAF diagrams**: Fully updated business architecture (template management split into browse/category/search/preview/apply), application architecture (new use cases, application layer ports), data architecture (new template application data flow), technology architecture (added local template data loading notes)

### 2026-04-07: AI Nested Component Flattening Fix

- **Problem**: AI (e.g. Ollama qwen3-coder) returned nested JSON (`children` with full child objects), but the flattening logic was missing, causing only root nodes to be saved
- **Fix**: Added `JSONParser.flattenPageComponents()` method that flattens nested `children` into a flat `components` array with `parentId` links; called by both `PageGenerator.generate()` and `ComponentGenerator.generate()`
- **Ollama Timeout**: Default timeout raised from 30s to 10 minutes
- **Files Changed**: `json-parser.ts`, `page-generator.ts`, `component-generator.ts`, `generator.ts`, adapters and hooks

### 2026-01: AI Generator Integration

- Multi-provider support: OpenAI, Claude, DeepSeek, Gemini, Azure OpenAI, Groq, Mistral, Ollama, SiliconFlow
- Component and page generation, auto-validation, streaming responses
- Separated AI Chat (AIChat) from AI Generator UI (AIGenerator)

## References

- [TOGAF](https://www.opengroup.org/togaf)
- [PlantUML](https://plantuml.com/)
- [C4 Model](https://c4model.com/)
