import type { GeneratePageOptions, PageContext } from "../types";
import { SYSTEM_PROMPT_TEMPLATE, PAGE_GENERATION_PROMPT } from "./template";

export class PagePromptBuilder {
  buildSystemPrompt(): string {
    return `${SYSTEM_PROMPT_TEMPLATE}

You can also generate full page schemas: multiple components in a logical layout with metadata, canvas, theme, and dataSources.`;
  }

  buildPagePrompt(options: GeneratePageOptions): string {
    const { description, layout, context } = options;

    let prompt = PAGE_GENERATION_PROMPT.replace("{description}", description).replace(
      "{layout}",
      this.getLayoutDescription(layout)
    );

    const contextStr = this.buildContextString(context);
    if (contextStr) prompt += `\n\nContext:\n${contextStr}`;

    prompt += `\n\nLayout:\n${this.getLayoutGuidelines(layout)}`;
    prompt += `\n\nRequirements: clear hierarchy; use container/layout components; sensible positions and spacing; complete metadata (name, createdAt, updatedAt, version). Output only JSON.`;

    return prompt;
  }

  private getLayoutDescription(
    layout?: "centered" | "full-width" | "sidebar" | "grid"
  ): string {
    switch (layout) {
      case "centered":
        return "centered (narrow content, e.g. login/form)";
      case "full-width":
        return "full-width (dashboard, list)";
      case "sidebar":
        return "sidebar (fixed left nav + main area)";
      case "grid":
        return "grid (grid system)";
      default:
        return "infer from description";
    }
  }

  private getLayoutGuidelines(
    layout?: "centered" | "full-width" | "sidebar" | "grid"
  ): string {
    switch (layout) {
      case "centered":
        return "- Container with max-width; center content; vertical spacing; form width ~400–600px";
      case "full-width":
        return "- Full-width container; grid-layout or flex-layout; padding/margins";
      case "sidebar":
        return "- Row: left column ~200–300px (sidebar), right column flex:1 (main); use flex-layout or grid-layout";
      case "grid":
        return "- grid-layout; set columns and gap; responsive items";
      default:
        return "- Choose layout from description; use layout containers appropriately";
    }
  }

  private buildContextString(context?: PageContext): string {
    if (!context) return "";

    const parts: string[] = [];

    if (context.existingPages?.length) {
      parts.push(
        `Existing pages (${context.existingPages.length}):\n${context.existingPages
          .map((p) => `  - ${p.metadata.name}`)
          .join("\n")}`
      );
    }
    if (context.theme) parts.push("Theme: provided");
    if (context.dataSources?.length) {
      parts.push(`Data sources: ${context.dataSources.length} available`);
    }

    return parts.join("\n\n");
  }
}
