# @lowcode-platform/ai-generator

AI-powered component and page generation for the low-code platform. Generate components and pages from natural language using multiple providers (OpenAI, Claude, Ollama, etc.).

## Features

- Multiple AI providers: OpenAI, Claude, DeepSeek, Gemini, Azure OpenAI, Groq, Mistral, Ollama, SiliconFlow
- Component generation: produce components from descriptions
- Page generation: produce full page schemas (layout, components, theme)
- Validation: generated output is validated against the platform schema
- Streaming: optional streaming for component and page generation
- Configurable: model, temperature, timeouts, retries

## Package structure

```
packages/ai-generator/
├── src/
│   ├── index.ts              # Public API
│   ├── types.ts              # Shared types and error classes
│   ├── generator.ts          # AIGenerator entry
│   ├── clients/              # AI provider implementations
│   │   ├── base-client.ts
│   │   ├── client-factory.ts
│   │   ├── openai-client.ts
│   │   ├── claude-client.ts
│   │   ├── ollama-client.ts
│   │   └── ...
│   ├── prompts/              # Prompt building
│   │   ├── template.ts
│   │   ├── component-prompt.ts
│   │   └── page-prompt.ts
│   ├── generators/          # Schema generation from AI response
│   │   ├── component-generator.ts
│   │   └── page-generator.ts
│   ├── parsers/              # Response parsing (e.g. JSON)
│   │   └── json-parser.ts
│   └── validators/           # Output validation
│       ├── component-validator.ts
│       └── page-validator.ts
├── __tests__/
├── package.json
├── README.md
└── EXAMPLES.md
```

## Installation

```bash
pnpm add @lowcode-platform/ai-generator
```

## Quick start

### Generate a component

```typescript
import { AIGenerator, OpenAIClient } from "@lowcode-platform/ai-generator";

const generator = new AIGenerator({
  client: new OpenAIClient({ apiKey: process.env.OPENAI_API_KEY }),
  model: "gpt-4",
});

const result = await generator.generateComponent({
  description: "A primary button with an icon",
  type: "button",
  position: { x: 100, y: 200 },
});

console.log(result.result);
```

### Generate a page

```typescript
const result = await generator.generatePage({
  description: "A login page with email, password and submit button",
  layout: "centered",
});

console.log(result.result);
```

### Local LLM (Ollama)

```typescript
import { AIGenerator, OllamaClient } from "@lowcode-platform/ai-generator";

const generator = new AIGenerator({
  client: new OllamaClient({
    baseURL: "http://localhost:11434",
    model: "codellama",
  }),
});

const result = await generator.generatePage({
  description: "A dashboard with a header and two cards",
  layout: "full-width",
});
```

See [docs/local-llm-setup.md](../../docs/local-llm-setup.md) in the repo root for Ollama setup.

## API overview

### AIGenerator

- `generateComponent(options)` – generate one component
- `generatePage(options)` – generate a full page schema
- `streamComponent(options)` – stream component chunks
- `streamPage(options)` – stream page schema chunks

### AIClientFactory

Create a client by provider name:

```typescript
import { AIClientFactory } from "@lowcode-platform/ai-generator";

const client = AIClientFactory.createClient("ollama", {
  baseURL: "http://localhost:11434",
  model: "codellama",
});
```

### Errors

All errors extend `AIGeneratorError`: `AIClientError`, `ParseError`, `ValidationError`.

## License

MIT
