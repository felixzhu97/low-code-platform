/**
 * 提示词模板常量
 */

/**
 * 组件类型列表
 */
export const COMPONENT_TYPES = [
  "text",
  "button",
  "image",
  "input",
  "textarea",
  "select",
  "checkbox",
  "radio",
  "switch",
  "slider",
  "date-picker",
  "time-picker",
  "form",
  "table",
  "card",
  "container",
  "grid-layout",
  "flex-layout",
  "row",
  "column",
  "divider",
  "spacer",
  "icon",
  "avatar",
  "badge",
  "tag",
  "tooltip",
  "popover",
  "modal",
  "drawer",
  "tabs",
  "collapse",
  "progress",
  "spinner",
  "alert",
  "notification",
] as const;

/**
 * 组件属性说明
 */
export const COMPONENT_PROPERTIES = {
  button: {
    text: "按钮文本",
    variant: "按钮样式变体 (default | outline | ghost | link | destructive)",
    size: "按钮尺寸 (small | default | large | icon)",
    disabled: "是否禁用",
    icon: "图标名称",
    iconPosition: "图标位置 (left | right)",
    fullWidth: "是否全宽",
    onClick: "点击事件处理",
  },
  input: {
    placeholder: "占位符文本",
    type: "输入框类型 (text | email | password | number | tel | url)",
    label: "标签文本",
    helperText: "帮助文本",
    required: "是否必填",
    disabled: "是否禁用",
    value: "默认值",
  },
  form: {
    layout: "表单布局 (vertical | horizontal | inline)",
    labelAlign: "标签对齐方式 (left | right)",
    colon: "是否显示冒号",
    requiredMark: "必填标记样式",
  },
  container: {
    width: "容器宽度",
    height: "容器高度",
    padding: "内边距",
    margin: "外边距",
    backgroundColor: "背景颜色",
    borderRadius: "圆角",
    border: "边框",
  },
} as const;

/**
 * 系统提示词模板
 */
export const SYSTEM_PROMPT_TEMPLATE = `You are an AI assistant specialized in generating low-code platform components and pages. 

Your task is to generate valid component structures based on user descriptions. All components must follow the Component interface specification:

{
  id: string;           // Unique identifier (use nanoid or uuid)
  type: string;         // Component type from the available types
  name: string;         // Human-readable name
  position?: {          // Optional position on canvas
    x: number;
    y: number;
  };
  properties?: Record<string, unknown>;  // Component-specific properties
  children?: (Component | string)[];     // Child components or component IDs
  parentId?: string | null;              // Parent component ID
  dataSource?: string | null;            // Associated data source ID
  dataMapping?: unknown[];               // Data mapping configuration
}

Available component types: ${COMPONENT_TYPES.join(", ")}

Always return valid JSON only, without markdown formatting or explanatory text.`;

/**
 * 组件生成提示词模板
 */
export const COMPONENT_GENERATION_PROMPT = `Generate a component based on the following description:

Description: {description}
Type: {type}
Position: {position}

Context:
{context}

Return a valid JSON object matching the Component interface. Include appropriate default properties for the component type.`;

/**
 * 页面生成提示词模板
 */
export const PAGE_GENERATION_PROMPT = `Generate a complete page schema based on the following description:

Description: {description}
Layout: {layout}

The page should include:
- A logical component hierarchy
- Appropriate layout containers
- Styled components with reasonable default properties
- Proper component positioning

Return a valid JSON object matching the PageSchema interface:
{
  version: string;
  metadata: {
    name: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
    version: string;
  };
  components: Component[];
  canvas: {
    showGrid: boolean;
    snapToGrid: boolean;
    viewportWidth: number;
    activeDevice: string;
  };
  theme: unknown;
  dataSources: unknown[];
}`;