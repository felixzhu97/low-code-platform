import type {
  AIGeneratorConfig,
  GenerateComponentOptions,
  GeneratePageOptions,
  GenerateResult,
  GeneratorOptions,
} from "./types";
import type { Component as ComponentType } from "@lowcode-platform/component-utils/types";
import type { PageSchema } from "@lowcode-platform/schema/types";
import { ComponentGenerator } from "./generators";
import { PageGenerator } from "./generators";
import { ComponentValidator } from "./validators";
import { PageValidator } from "./validators";

/**
 * AI 生成器主类
 * 提供统一的 API 用于生成组件和页面
 */
export class AIGenerator {
  private componentGenerator: ComponentGenerator;
  private pageGenerator: PageGenerator;
  private componentValidator: ComponentValidator;
  private pageValidator: PageValidator;
  private defaultOptions: GeneratorOptions;

  constructor(config: AIGeneratorConfig) {
    this.componentGenerator = new ComponentGenerator(config.client);
    this.pageGenerator = new PageGenerator(config.client);
    this.componentValidator = new ComponentValidator();
    this.pageValidator = new PageValidator();
    this.defaultOptions = {
      validate: true,
      retryOnError: true,
      timeout: 30000,
    };
  }

  /**
   * 生成组件
   */
  async generateComponent(
    options: GenerateComponentOptions,
    generatorOptions?: GeneratorOptions
  ): Promise<GenerateResult<ComponentType>> {
    const opts = { ...this.defaultOptions, ...generatorOptions };
    const startTime = Date.now();

    try {
      const component = await this.componentGenerator.generate(options);

      // 验证组件
      if (opts.validate) {
        this.componentValidator.validate(component);
      }

      return {
        result: component,
        metadata: {
          duration: Date.now() - startTime,
        },
      };
    } catch (error) {
      if (opts.retryOnError && this.shouldRetry(error)) {
        // 重试逻辑已在生成器中实现
        throw error;
      }
      throw error;
    }
  }

  /**
   * 流式生成组件
   */
  async *streamComponent(
    options: GenerateComponentOptions
  ): AsyncGenerator<Partial<ComponentType>> {
    for await (const partial of this.componentGenerator.stream(options)) {
      yield partial;
    }
  }

  /**
   * 生成页面
   */
  async generatePage(
    options: GeneratePageOptions,
    generatorOptions?: GeneratorOptions
  ): Promise<GenerateResult<PageSchema>> {
    const opts = { ...this.defaultOptions, ...generatorOptions };
    const startTime = Date.now();

    try {
      const page = await this.pageGenerator.generate(options);

      // 验证页面
      if (opts.validate) {
        this.pageValidator.validate(page);
      }

      return {
        result: page,
        metadata: {
          duration: Date.now() - startTime,
        },
      };
    } catch (error) {
      if (opts.retryOnError && this.shouldRetry(error)) {
        throw error;
      }
      throw error;
    }
  }

  /**
   * 流式生成页面
   */
  async *streamPage(
    options: GeneratePageOptions
  ): AsyncGenerator<Partial<PageSchema>> {
    for await (const partial of this.pageGenerator.stream(options)) {
      yield partial;
    }
  }

  /**
   * 判断是否应该重试
   */
  private shouldRetry(error: unknown): boolean {
    // 网络错误、超时错误通常可以重试
    if (error instanceof Error) {
      const message = error.message.toLowerCase();
      return (
        message.includes("network") ||
        message.includes("timeout") ||
        message.includes("fetch") ||
        message.includes("connection")
      );
    }
    return false;
  }

  /**
   * 设置默认选项
   */
  setDefaultOptions(options: Partial<GeneratorOptions>): void {
    this.defaultOptions = { ...this.defaultOptions, ...options };
  }
}