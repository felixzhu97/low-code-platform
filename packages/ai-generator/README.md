# @lowcode-platform/ai-generator

AI 驱动的组件和页面生成服务，支持通过自然语言对话生成低代码平台的组件和页面。

## 功能特性

- 🤖 **多 AI 提供商支持**: 支持 OpenAI、Claude 等多种 AI 服务
- 📦 **组件生成**: 通过自然语言描述生成符合规范的组件
- 📄 **页面生成**: 一键生成完整的页面结构，包含布局、组件和样式
- ✅ **自动验证**: 生成的组件和页面自动通过结构验证
- 🔄 **流式响应**: 支持实时流式生成，提供更好的用户体验
- 🔧 **可配置**: 灵活配置 AI 模型、参数和生成选项

## 安装

```bash
pnpm add @lowcode-platform/ai-generator
```

## 快速开始

### 生成组件

```typescript
import { AIGenerator, OpenAIClient } from "@lowcode-platform/ai-generator";

const generator = new AIGenerator({
  client: new OpenAIClient({ apiKey: process.env.OPENAI_API_KEY }),
  model: "gpt-4",
});

const result = await generator.generateComponent({
  description: "创建一个带有图标的主按钮",
  type: "button",
  position: { x: 100, y: 200 },
});

console.log(result.result); // 生成的组件
```

### 生成页面

```typescript
const result = await generator.generatePage({
  description: "创建一个用户登录页面，包含邮箱输入框、密码输入框和登录按钮",
  layout: "centered",
});

console.log(result.result); // 生成的页面 Schema
```

### 流式生成

```typescript
for await (const chunk of generator.streamComponent({
  description: "创建一个表单组件",
})) {
  // 实时更新 UI
  updatePreview(chunk);
}
```

## API 文档

### AIGenerator

主要的生成器类，提供统一的 API。

#### 构造函数

```typescript
new AIGenerator(config: AIGeneratorConfig)
```

#### 方法

##### generateComponent

生成单个组件。

```typescript
generateComponent(
  options: GenerateComponentOptions,
  generatorOptions?: GeneratorOptions
): Promise<GenerateResult<Component>>
```

**示例：**

```typescript
const result = await generator.generateComponent({
  description: '创建一个文本输入框',
  type: 'input',
  position: { x: 100, y: 200 },
  context: {
    existingComponents: [...],
    theme: {...}
  }
});
```

##### generatePage

生成完整页面。

```typescript
generatePage(
  options: GeneratePageOptions,
  generatorOptions?: GeneratorOptions
): Promise<GenerateResult<PageSchema>>
```

**示例：**

```typescript
const result = await generator.generatePage({
  description: '创建一个产品展示页面',
  layout: 'grid',
  theme: {...}
});
```

##### streamComponent

流式生成组件。

```typescript
streamComponent(
  options: GenerateComponentOptions
): AsyncGenerator<Partial<Component>>
```

##### streamPage

流式生成页面。

```typescript
streamPage(
  options: GeneratePageOptions
): AsyncGenerator<Partial<PageSchema>>
```

### AI 客户端

#### OpenAIClient

```typescript
import { OpenAIClient } from "@lowcode-platform/ai-generator";

const client = new OpenAIClient({
  apiKey: "your-api-key",
  model: "gpt-4",
  temperature: 0.7,
  maxTokens: 2000,
});
```

#### ClaudeClient

```typescript
import { ClaudeClient } from "@lowcode-platform/ai-generator";

const client = new ClaudeClient({
  apiKey: "your-api-key",
  model: "claude-3-opus-20240229",
  temperature: 0.7,
  maxTokens: 2000,
});
```

## 客户端集成

### React 组件示例

```typescript
import { useState } from "react";
import { AIGenerator, OpenAIClient } from "@lowcode-platform/ai-generator";

function ComponentGenerator({ onComponentGenerated }) {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const generator = new AIGenerator({
    client: new OpenAIClient({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    }),
  });

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await generator.generateComponent({
        description,
        type: "button",
      });
      onComponentGenerated(result.result);
    } catch (error) {
      console.error("Generation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="描述要生成的组件..."
      />
      <button onClick={handleGenerate} disabled={loading}>
        {loading ? "生成中..." : "生成组件"}
      </button>
    </div>
  );
}
```

## 服务端集成

### NestJS 模块示例

```typescript
import { Module, Controller, Post, Body } from "@nestjs/common";
import { AIGenerator, OpenAIClient } from "@lowcode-platform/ai-generator";

@Module({
  providers: [
    {
      provide: "AIGenerator",
      useFactory: () => {
        return new AIGenerator({
          client: new OpenAIClient({
            apiKey: process.env.OPENAI_API_KEY,
          }),
        });
      },
    },
  ],
})
export class AIGeneratorModule {}

@Controller("ai")
export class AIGeneratorController {
  constructor(@Inject("AIGenerator") private generator: AIGenerator) {}

  @Post("components")
  async generateComponent(@Body() options: GenerateComponentOptions) {
    const result = await this.generator.generateComponent(options);
    return result;
  }

  @Post("pages")
  async generatePage(@Body() options: GeneratePageOptions) {
    const result = await this.generator.generatePage(options);
    return result;
  }
}
```

## 错误处理

所有错误都是 `AIGeneratorError` 的子类：

```typescript
import {
  AIGeneratorError,
  AIClientError,
  ParseError,
  ValidationError
} from '@lowcode-platform/ai-generator';

try {
  const result = await generator.generateComponent({...});
} catch (error) {
  if (error instanceof AIClientError) {
    // AI 服务错误
    console.error('API Error:', error.statusCode, error.message);
  } else if (error instanceof ParseError) {
    // 解析错误
    console.error('Parse Error:', error.message);
  } else if (error instanceof ValidationError) {
    // 验证错误
    console.error('Validation Errors:', error.errors);
  } else {
    // 其他错误
    console.error('Unknown Error:', error);
  }
}
```

## 配置选项

### AIGeneratorConfig

```typescript
interface AIGeneratorConfig {
  client: AIClient;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}
```

### GeneratorOptions

```typescript
interface GeneratorOptions {
  validate?: boolean; // 是否验证生成结果（默认: true）
  retryOnError?: boolean; // 是否在错误时重试（默认: true）
  timeout?: number; // 超时时间（毫秒，默认: 30000）
}
```

## 架构

本包采用模块化设计，包含以下核心模块：

- **AI 客户端**: 抽象的 AI 服务接口和具体实现
- **提示词构建器**: 将用户需求转换为 AI 提示词
- **生成器**: 将 AI 响应转换为组件/页面结构
- **验证器**: 确保生成的结构符合规范

## 许可证

MIT
