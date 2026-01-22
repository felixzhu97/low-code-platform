# 使用示例

本文档提供了 `@lowcode-platform/ai-generator` 的详细使用示例。

## 基础示例

### 1. 生成简单组件

```typescript
import { AIGenerator, OpenAIClient } from "@lowcode-platform/ai-generator";

const generator = new AIGenerator({
  client: new OpenAIClient({
    apiKey: process.env.OPENAI_API_KEY || "your-api-key",
  }),
});

// 生成一个按钮组件
const button = await generator.generateComponent({
  description: '创建一个蓝色的主按钮，文字为"提交"',
  type: "button",
  position: { x: 100, y: 100 },
});

console.log(button.result);
// {
//   id: 'comp_xxx',
//   type: 'button',
//   name: '提交按钮',
//   position: { x: 100, y: 100 },
//   properties: {
//     text: '提交',
//     variant: 'default',
//     // ...
//   }
// }
```

### 2. 生成复杂组件

```typescript
// 生成一个表单组件
const form = await generator.generateComponent({
  description:
    "创建一个用户注册表单，包含用户名、邮箱、密码和确认密码字段，以及提交按钮",
  type: "form",
  position: { x: 200, y: 200 },
});
```

### 3. 生成完整页面

```typescript
// 生成登录页面
const loginPage = await generator.generatePage({
  description:
    "创建一个用户登录页面，包含标题、邮箱输入框、密码输入框、记住我复选框和登录按钮，使用居中布局",
  layout: "centered",
});

console.log(loginPage.result.components);
// [
//   { type: 'container', ... },
//   { type: 'text', properties: { content: '登录' }, ... },
//   { type: 'input', properties: { type: 'email', label: '邮箱' }, ... },
//   // ...
// ]
```

## 流式生成示例

### 实时更新 UI

```typescript
import { useState, useEffect } from "react";

function StreamingComponentGenerator() {
  const [partialComponent, setPartialComponent] = useState(null);
  const [loading, setLoading] = useState(false);

  const generator = new AIGenerator({
    client: new OpenAIClient({ apiKey: "..." }),
  });

  const generate = async () => {
    setLoading(true);
    try {
      for await (const chunk of generator.streamComponent({
        description: "创建一个数据表格组件",
      })) {
        setPartialComponent(chunk);
        // 可以实时更新预览
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={generate}>生成组件</button>
      {partialComponent && <ComponentPreview component={partialComponent} />}
    </div>
  );
}
```

## 使用上下文信息

### 基于现有组件生成

```typescript
// 生成与现有组件风格一致的组件
const newComponent = await generator.generateComponent({
  description: "创建一个与现有按钮风格一致的提交按钮",
  type: "button",
  context: {
    existingComponents: [
      {
        id: "btn1",
        type: "button",
        properties: {
          variant: "outline",
          size: "large",
        },
      },
    ],
  },
});
```

### 使用主题配置

```typescript
const themedComponent = await generator.generateComponent({
  description: "创建一个符合主题的卡片组件",
  type: "card",
  context: {
    theme: {
      primaryColor: "#007bff",
      borderRadius: "8px",
      spacing: "16px",
    },
  },
});
```

## 错误处理示例

```typescript
import {
  AIGenerator,
  OpenAIClient,
  AIClientError,
  ParseError,
  ValidationError,
} from "@lowcode-platform/ai-generator";

const generator = new AIGenerator({
  client: new OpenAIClient({ apiKey: "..." }),
});

try {
  const result = await generator.generateComponent({
    description: "创建一个按钮",
  });
} catch (error) {
  if (error instanceof AIClientError) {
    if (error.statusCode === 429) {
      console.error("API 速率限制，请稍后重试");
    } else if (error.statusCode === 401) {
      console.error("API 密钥无效");
    } else {
      console.error("AI 服务错误:", error.message);
    }
  } else if (error instanceof ParseError) {
    console.error("解析响应失败:", error.message);
    console.error("原始响应:", error.rawResponse);
  } else if (error instanceof ValidationError) {
    console.error("验证失败:");
    error.errors?.forEach((err) => console.error("  -", err));
  } else {
    console.error("未知错误:", error);
  }
}
```

## 自定义配置示例

### 使用 Claude

```typescript
import { AIGenerator, ClaudeClient } from "@lowcode-platform/ai-generator";

const generator = new AIGenerator({
  client: new ClaudeClient({
    apiKey: process.env.ANTHROPIC_API_KEY,
    model: "claude-3-opus-20240229",
    temperature: 0.8,
  }),
});
```

### 自定义生成选项

```typescript
// 禁用自动验证
const result = await generator.generateComponent(
  {
    description: "创建一个组件",
  },
  {
    validate: false,
    retryOnError: false,
    timeout: 60000,
  }
);
```

### 设置默认选项

```typescript
generator.setDefaultOptions({
  validate: true,
  retryOnError: true,
  timeout: 45000,
});
```

## NestJS 集成示例

### 创建服务

```typescript
// ai-generator.service.ts
import { Injectable } from "@nestjs/common";
import { AIGenerator, OpenAIClient } from "@lowcode-platform/ai-generator";

@Injectable()
export class AIGeneratorService {
  private generator: AIGenerator;

  constructor() {
    this.generator = new AIGenerator({
      client: new OpenAIClient({
        apiKey: process.env.OPENAI_API_KEY,
      }),
    });
  }

  async generateComponent(description: string, type?: string) {
    return this.generator.generateComponent({
      description,
      type,
    });
  }

  async generatePage(description: string, layout?: string) {
    return this.generator.generatePage({
      description,
      layout: layout as any,
    });
  }
}
```

### 创建控制器

```typescript
// ai-generator.controller.ts
import { Controller, Post, Body } from "@nestjs/common";
import { AIGeneratorService } from "./ai-generator.service";

@Controller("ai")
export class AIGeneratorController {
  constructor(private readonly aiService: AIGeneratorService) {}

  @Post("components")
  async generateComponent(@Body() dto: { description: string; type?: string }) {
    return this.aiService.generateComponent(dto.description, dto.type);
  }

  @Post("pages")
  async generatePage(@Body() dto: { description: string; layout?: string }) {
    return this.aiService.generatePage(dto.description, dto.layout);
  }
}
```

## React Hook 示例

```typescript
// useAIGenerator.ts
import { useState, useCallback } from "react";
import { AIGenerator, OpenAIClient } from "@lowcode-platform/ai-generator";

export function useAIGenerator() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const generator = new AIGenerator({
    client: new OpenAIClient({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || "",
    }),
  });

  const generateComponent = useCallback(
    async (description: string, type?: string) => {
      setLoading(true);
      setError(null);
      try {
        const result = await generator.generateComponent({ description, type });
        return result.result;
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const generatePage = useCallback(
    async (description: string, layout?: string) => {
      setLoading(true);
      setError(null);
      try {
        const result = await generator.generatePage({
          description,
          layout: layout as any,
        });
        return result.result;
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    generateComponent,
    generatePage,
    loading,
    error,
  };
}
```

使用 Hook：

```typescript
function MyComponent() {
  const { generateComponent, loading, error } = useAIGenerator();

  const handleGenerate = async () => {
    try {
      const component = await generateComponent("创建一个按钮");
      console.log("生成的组件:", component);
    } catch (err) {
      console.error("生成失败:", err);
    }
  };

  return (
    <div>
      <button onClick={handleGenerate} disabled={loading}>
        {loading ? "生成中..." : "生成组件"}
      </button>
      {error && <div>错误: {error.message}</div>}
    </div>
  );
}
```
