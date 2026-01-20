import type { GenerateComponentOptions, ComponentContext } from "../types";
import {
  SYSTEM_PROMPT_TEMPLATE,
  COMPONENT_GENERATION_PROMPT,
  COMPONENT_TYPES,
  COMPONENT_PROPERTIES,
} from "./template";

/**
 * 组件提示词构建器
 */
export class ComponentPromptBuilder {
  /**
   * 构建系统提示词
   */
  buildSystemPrompt(): string {
    return SYSTEM_PROMPT_TEMPLATE;
  }

  /**
   * 构建组件生成提示词
   */
  buildComponentPrompt(options: GenerateComponentOptions): string {
    const { description, type, position, context } = options;

    let prompt = COMPONENT_GENERATION_PROMPT.replace(
      "{description}",
      description
    );

    if (type) {
      prompt = prompt.replace("{type}", type);
      const properties = this.getComponentProperties(type);
      if (properties) {
        prompt += `\n\nComponent type "${type}" supports the following properties:\n${this.formatProperties(properties)}`;
      }
    } else {
      prompt = prompt.replace("{type}", "自动选择（根据描述推断最合适的组件类型）");
    }

    if (position) {
      prompt = prompt.replace(
        "{position}",
        `x: ${position.x}, y: ${position.y}`
      );
    } else {
      prompt = prompt.replace("{position}", "未指定");
    }

    const contextStr = this.buildContextString(context);
    prompt = prompt.replace("{context}", contextStr || "无");

    // 添加属性说明
    prompt += `\n\nImportant: 
- Set a unique id for the component
- Use descriptive names in Chinese or English
- Set appropriate default properties based on the component type
- Ensure all property values are valid`;

    return prompt;
  }

  /**
   * 获取组件属性说明
   */
  private getComponentProperties(
    type: string
  ): Record<string, string> | undefined {
    return COMPONENT_PROPERTIES[type as keyof typeof COMPONENT_PROPERTIES];
  }

  /**
   * 格式化属性说明
   */
  private formatProperties(properties: Record<string, string>): string {
    return Object.entries(properties)
      .map(([key, desc]) => `  - ${key}: ${desc}`)
      .join("\n");
  }

  /**
   * 构建上下文字符串
   */
  private buildContextString(context?: ComponentContext): string {
    if (!context) {
      return "";
    }

    const parts: string[] = [];

    if (context.existingComponents && context.existingComponents.length > 0) {
      parts.push(
        `现有组件 (${context.existingComponents.length} 个):\n${context.existingComponents
          .map((c) => `  - ${c.name} (${c.type})`)
          .join("\n")}`
      );
    }

    if (context.theme) {
      parts.push("主题配置: 已提供");
    }

    if (context.dataSources && context.dataSources.length > 0) {
      parts.push(`数据源 (${context.dataSources.length} 个): 可用`);
    }

    return parts.join("\n\n");
  }

  /**
   * 验证组件类型是否有效
   */
  isValidComponentType(type: string): boolean {
    return COMPONENT_TYPES.includes(type as (typeof COMPONENT_TYPES)[number]);
  }
}