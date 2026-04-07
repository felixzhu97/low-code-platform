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

export const COMPONENT_PROPERTIES: Record<
  string,
  Record<string, string>
> = {
  button: {
    text: "Button label",
    variant: "default | outline | ghost | link | destructive",
    size: "small | default | large | icon",
    disabled: "boolean",
    icon: "icon name",
    iconPosition: "left | right",
    fullWidth: "boolean",
    onClick: "event handler",
  },
  input: {
    placeholder: "placeholder text",
    type: "text | email | password | number | tel | url",
    label: "label text",
    helperText: "helper text",
    required: "boolean",
    disabled: "boolean",
    value: "default value",
  },
  form: {
    layout: "vertical | horizontal | inline",
    labelAlign: "left | right",
    colon: "boolean",
    requiredMark: "required marker style",
  },
  container: {
    width: "width",
    height: "height",
    padding: "padding",
    margin: "margin",
    backgroundColor: "background color",
    borderRadius: "border radius",
    border: "border",
  },
};

export const SYSTEM_PROMPT_TEMPLATE = `You are a JSON generator for low-code platform components and pages.

CRITICAL OUTPUT RULES:
1. Output ONLY valid JSON - no markdown, no code blocks, no explanation, no comments
2. Start with { and end with }
3. Use double quotes for all strings
4. Never use trailing commas
5. Never use single quotes
6. Never use multiline string values

Example valid component output:
{"id":"comp_001","type":"button","name":"Submit Button","position":{"x":0,"y":0},"properties":{"text":"Submit","variant":"default"},"children":[],"parentId":null,"dataSource":null,"dataMapping":[]}

Example valid page output:
{"version":"1.0.0","metadata":{"name":"My Page","description":"A test page","createdAt":"2024-01-01T00:00:00.000Z","updatedAt":"2024-01-01T00:00:00.000Z","version":"1.0.0"},"components":[],"canvas":{"showGrid":false,"snapToGrid":false,"viewportWidth":1920,"activeDevice":"desktop"},"theme":{},"dataSources":[]}

If your output is not valid JSON, the system will fail.

Component structure:
{ "id": "unique-id", "type": "<type>", "name": "<name>", "position": { "x": 0, "y": 0 }, "properties": {}, "children": [], "parentId": null, "dataSource": null, "dataMapping": [] }

Required: id (unique), type, name. Optional: position, properties, children, parentId, dataSource, dataMapping.

Available types: ${COMPONENT_TYPES.join(", ")}`;

export const COMPONENT_GENERATION_PROMPT = `Description: {description}
Type: {type}
Position: {position}

Context: {context}

IMPORTANT: Output ONLY a single JSON object. No markdown, no explanation.
Example: {"id":"comp_001","type":"button","name":"Submit","position":{"x":0,"y":0},"properties":{"text":"Submit","variant":"default"},"children":[],"parentId":null,"dataSource":null,"dataMapping":[]}

Return a single JSON object: one Component with a unique id, correct type, name, and sensible default properties. Output only the JSON.`;

export const PAGE_GENERATION_PROMPT = `Description: {description}
Layout: {layout}

Return a JSON object with: version (string), metadata (name, description, createdAt, updatedAt, version), components (array of Components), canvas (showGrid, snapToGrid, viewportWidth, activeDevice), theme (object), dataSources (array).

Use a clear component hierarchy and layout containers. Set sensible positions and default properties. Output only the JSON.`;
