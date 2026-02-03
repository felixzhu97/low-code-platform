import type { GenerateComponentOptions, ComponentContext } from "../types";
import {
  SYSTEM_PROMPT_TEMPLATE,
  COMPONENT_GENERATION_PROMPT,
  COMPONENT_TYPES,
  COMPONENT_PROPERTIES,
} from "./template";

export class ComponentPromptBuilder {
  buildSystemPrompt(): string {
    return SYSTEM_PROMPT_TEMPLATE;
  }

  buildComponentPrompt(options: GenerateComponentOptions): string {
    const { description, type, position, context } = options;

    let prompt = COMPONENT_GENERATION_PROMPT.replace("{description}", description)
      .replace("{type}", type || "infer from description")
      .replace(
        "{position}",
        position ? `x: ${position.x}, y: ${position.y}` : "not specified"
      )
      .replace("{context}", this.buildContextString(context) || "none");

    if (type) {
      const properties = this.getComponentProperties(type);
      if (properties) {
        prompt += `\n\nProperties for "${type}":\n${this.formatProperties(properties)}`;
      }
    }

    prompt += "\n\nRules: unique id; descriptive name; valid defaults for the type. Output only JSON.";

    return prompt;
  }

  private getComponentProperties(
    type: string
  ): Record<string, string> | undefined {
    return COMPONENT_PROPERTIES[type];
  }

  private formatProperties(properties: Record<string, string>): string {
    return Object.entries(properties)
      .map(([key, desc]) => `  ${key}: ${desc}`)
      .join("\n");
  }

  private buildContextString(context?: ComponentContext): string {
    if (!context) return "";

    const parts: string[] = [];

    if (context.existingComponents?.length) {
      parts.push(
        `Existing components (${context.existingComponents.length}):\n${context.existingComponents
          .map((c) => `  - ${c.name} (${c.type})`)
          .join("\n")}`
      );
    }
    if (context.theme) parts.push("Theme: provided");
    if (context.dataSources?.length) {
      parts.push(`Data sources: ${context.dataSources.length} available`);
    }

    return parts.join("\n\n");
  }

  isValidComponentType(type: string): boolean {
    return COMPONENT_TYPES.includes(type as (typeof COMPONENT_TYPES)[number]);
  }
}
