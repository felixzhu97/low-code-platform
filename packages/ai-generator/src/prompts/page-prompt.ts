import type { GeneratePageOptions, PageContext } from "../types";
import { SYSTEM_PROMPT_TEMPLATE, PAGE_GENERATION_PROMPT } from "./template";

/**
 * 页面提示词构建器
 */
export class PagePromptBuilder {
  /**
   * 构建系统提示词
   */
  buildSystemPrompt(): string {
    return `${SYSTEM_PROMPT_TEMPLATE}

Additionally, you can generate complete page schemas that include multiple components organized in a logical layout.`;
  }

  /**
   * 构建页面生成提示词
   */
  buildPagePrompt(options: GeneratePageOptions): string {
    const { description, layout, context } = options;

    let prompt = PAGE_GENERATION_PROMPT.replace("{description}", description);

    const layoutDescription = this.getLayoutDescription(layout);
    prompt = prompt.replace("{layout}", layoutDescription);

    const contextStr = this.buildContextString(context);
    if (contextStr) {
      prompt += `\n\nContext:\n${contextStr}`;
    }

    // 添加布局指导
    prompt += `\n\nLayout Guidelines:
${this.getLayoutGuidelines(layout)}`;

    // 添加生成要求
    prompt += `\n\nRequirements:
- Create a logical component hierarchy
- Use appropriate container components for layout
- Set reasonable default positions for components
- Include proper spacing and padding
- Generate a complete, functional page structure
- Set metadata with a descriptive name and current timestamp`;

    return prompt;
  }

  /**
   * 获取布局描述
   */
  private getLayoutDescription(
    layout?: "centered" | "full-width" | "sidebar" | "grid"
  ): string {
    switch (layout) {
      case "centered":
        return "居中布局 - 内容区域居中显示，适合登录页、表单页等";
      case "full-width":
        return "全宽布局 - 内容占满整个宽度，适合仪表盘、列表页等";
      case "sidebar":
        return "侧边栏布局 - 左侧固定侧边栏，右侧主要内容区域";
      case "grid":
        return "网格布局 - 使用网格系统组织内容";
      default:
        return "自动选择布局（根据页面描述推断最合适的布局方式）";
    }
  }

  /**
   * 获取布局指导
   */
  private getLayoutGuidelines(
    layout?: "centered" | "full-width" | "sidebar" | "grid"
  ): string {
    switch (layout) {
      case "centered":
        return `- Use a container component with max-width constraint
- Center content horizontally
- Add appropriate vertical spacing
- Keep content width reasonable (e.g., 400-600px for forms)`;
      case "full-width":
        return `- Use full-width container
- Utilize grid-layout or flex-layout for content organization
- Consider responsive breakpoints
- Add proper padding/margins`;
      case "sidebar":
        return `- Create a row container
- Left column: sidebar navigation (fixed width ~200-300px)
- Right column: main content area (flex: 1)
- Use flex-layout or grid-layout`;
      case "grid":
        return `- Use grid-layout component
- Define appropriate column count
- Set gap between grid items
- Make items responsive`;
      default:
        return `- Analyze the description to determine the best layout
- Consider the content type and user flow
- Use appropriate layout containers`;
    }
  }

  /**
   * 构建上下文字符串
   */
  private buildContextString(context?: PageContext): string {
    if (!context) {
      return "";
    }

    const parts: string[] = [];

    if (context.existingPages && context.existingPages.length > 0) {
      parts.push(
        `现有页面 (${context.existingPages.length} 个):\n${context.existingPages
          .map((p) => `  - ${p.metadata.name}`)
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
}