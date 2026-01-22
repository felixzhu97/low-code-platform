/**
 * AI Generator 占位符模块
 * 当 AI Generator 包不可用时使用此占位符，避免构建错误
 */

// 导出错误类
export class AIClientError extends Error {
  statusCode?: number;
  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = "AIClientError";
    this.statusCode = statusCode;
  }
}

export class ParseError extends Error {
  rawResponse?: string;
  constructor(message: string, rawResponse?: string) {
    super(message);
    this.name = "ParseError";
    this.rawResponse = rawResponse;
  }
}

export class ValidationError extends Error {
  errors?: string[];
  constructor(message: string, errors?: string[]) {
    super(message);
    this.name = "ValidationError";
    this.errors = errors;
  }
}

// 导出占位符类
export class AIGenerator {
  constructor(_config: any) {
    throw new Error(
      "AI Generator module not available. Please ensure @lowcode-platform/ai-generator is installed."
    );
  }
}

export class OpenAIClient {
  constructor(_config: any) {
    throw new Error(
      "AI Generator module not available. Please ensure @lowcode-platform/ai-generator is installed."
    );
  }
}

export class ClaudeClient {
  constructor(_config: any) {
    throw new Error(
      "AI Generator module not available. Please ensure @lowcode-platform/ai-generator is installed."
    );
  }
}

export class DeepSeekClient {
  constructor(_config: any) {
    throw new Error(
      "AI Generator module not available. Please ensure @lowcode-platform/ai-generator is installed."
    );
  }
}

// 导出其他占位符
export const generateComponent = () => {
  throw new Error(
    "AI Generator module not available. Please ensure @lowcode-platform/ai-generator is installed."
  );
};

export const generatePage = () => {
  throw new Error(
    "AI Generator module not available. Please ensure @lowcode-platform/ai-generator is installed."
  );
};
