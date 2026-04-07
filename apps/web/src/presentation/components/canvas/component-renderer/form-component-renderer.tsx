import type React from "react";
import type { Component } from "@/domain/component";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import {
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Slider,
  Calendar,
  Switch,
  Button,
  Input,
  Textarea,
  Checkbox,
  RadioGroup,
  RadioGroupItem,
} from "@/presentation/components/ui";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { CalendarIcon, Clock, Upload } from "lucide-react";
import {
  fieldStack,
  flexRowGap2,
  mutedSmall,
  padX2,
  sliderScaleRow,
  radioOptionRow,
  fallbackBox,
} from "./renderer-emotion";

const FlexGrowInput = styled(Input)`
  flex: 1;
  min-width: 0;
`;

const FullWidthSlider = styled(Slider)`
  width: 100%;
`;

const DateTriggerButton = styled(Button)`
  width: 100%;
  justify-content: flex-start;
  text-align: left;
  font-weight: 400;
`;

const PopoverCalendarPanel = styled(PopoverContent)`
  width: auto;
  padding: 0;
`;

/** 渲染表单子组件的 wrapper，与 LayoutComponentRenderer 保持一致的交互行为 */
function ChildWrapper({
  child,
  components,
  isPreviewMode,
  selectedId,
  onSelectComponent,
  onMouseDown,
}: {
  child: Component;
  components: Component[];
  isPreviewMode: boolean;
  selectedId: string | null;
  onSelectComponent?: (component: Component) => void;
  onMouseDown?: (e: React.MouseEvent, component: Component) => void;
}) {
  return (
    <div
      key={child.id}
      css={css`
        position: relative;
        ${!isPreviewMode ? "cursor: grab;" : ""}
      `}
      style={{
        width: child.properties?.width || "auto",
        height: child.properties?.height || "auto",
        margin: child.properties?.margin || "0",
        padding: child.properties?.padding || "0",
        backgroundColor: child.properties?.bgColor || "transparent",
        borderRadius: child.properties?.borderRadius || "0.5rem",
        border: child.properties?.border
          ? `1px solid ${child.properties?.borderColor || "rgb(229 231 235)"}`
          : "none",
      }}
      onClick={(e) => {
        if (isPreviewMode || !onSelectComponent) return;
        e.stopPropagation();
        onSelectComponent(child);
      }}
    >
      <ComponentChildContent
        child={child}
        components={components}
        isPreviewMode={isPreviewMode}
        selectedId={selectedId}
      />
    </div>
  );
}

/** 递归渲染子组件内容（form/form 嵌套） */
function ComponentChildContent({
  child,
  components,
  isPreviewMode,
  selectedId,
}: {
  child: Component;
  components: Component[];
  isPreviewMode: boolean;
  selectedId: string | null;
}) {
  const childProps = child.properties || {};
  const childChildren = components.filter((c) => c.parentId === child.id);

  if (child.type === "input") {
    return (
      <div css={fieldStack}>
        {childProps.label && <Label htmlFor={child.id}>{childProps.label}</Label>}
        <Input
          id={child.id}
          placeholder={childProps.placeholder || "请输入..."}
          disabled={childProps.disabled}
          required={childProps.required}
          type={childProps.type || "text"}
          defaultValue={childProps.defaultValue || ""}
        />
        {childProps.helperText && <p css={mutedSmall}>{childProps.helperText}</p>}
      </div>
    );
  }
  if (child.type === "textarea") {
    return (
      <div css={fieldStack}>
        {childProps.label && <Label htmlFor={child.id}>{childProps.label}</Label>}
        <Textarea
          id={child.id}
          placeholder={childProps.placeholder || "请输入多行文本..."}
          disabled={childProps.disabled}
          required={childProps.required}
          rows={childProps.rows || 4}
          defaultValue={childProps.defaultValue || ""}
        />
        {childProps.helperText && <p css={mutedSmall}>{childProps.helperText}</p>}
      </div>
    );
  }
  if (child.type === "select") {
    return (
      <div css={fieldStack}>
        {childProps.label && <Label htmlFor={child.id}>{childProps.label}</Label>}
        <Select disabled={childProps.disabled} defaultValue={childProps.defaultValue || ""}>
          <SelectTrigger id={child.id}>
            <SelectValue placeholder={childProps.placeholder || "请选择..."} />
          </SelectTrigger>
          <SelectContent>
            {(childProps.options || ["选项1", "选项2", "选项3"]).map(
              (option: string, idx: number) => (
                <SelectItem key={idx} value={option}>{option}</SelectItem>
              )
            )}
          </SelectContent>
        </Select>
        {childProps.helperText && <p css={mutedSmall}>{childProps.helperText}</p>}
      </div>
    );
  }
  if (child.type === "button") {
    return (
      <Button
        disabled={childProps.disabled}
        variant={childProps.variant || "default"}
        style={{ width: childProps.fullWidth ? "100%" : "auto" }}
      >
        {childProps.text || "按钮"}
      </Button>
    );
  }

  // 嵌套表单或其他类型：递归渲染子 children
  if (childChildren.length > 0) {
    return (
      <div css={css`display: flex; flex-direction: column; gap: 0.5rem;`}>
        {childChildren.map((c) => (
          <ComponentChildContent
            key={c.id}
            child={c}
            components={components}
            isPreviewMode={isPreviewMode}
            selectedId={selectedId}
          />
        ))}
      </div>
    );
  }

  return <span css={mutedSmall}>{child.name || child.type}</span>;
}

interface FormComponentRendererProps {
  component: Component;
  props: Record<string, any>;
  themeStyle: React.CSSProperties;
  animationStyle: React.CSSProperties;
  childComponents?: Component[];
  components?: Component[];
  isPreviewMode?: boolean;
  selectedId?: string | null;
  dropTargetId?: string | null;
  onSelectComponent?: (component: Component) => void;
  onMouseDown?: (e: React.MouseEvent, component: Component) => void;
}

export function FormComponentRenderer({
  component,
  props,
  themeStyle,
  animationStyle,
  childComponents = [],
  components = [],
  isPreviewMode = false,
  selectedId = null,
  dropTargetId = null,
  onSelectComponent,
  onMouseDown,
}: FormComponentRendererProps) {
  switch (component.type) {
    case "input":
      return (
        <div css={fieldStack} style={{ ...animationStyle }}>
          {props.label && <Label htmlFor={component.id}>{props.label}</Label>}
          <Input
            id={component.id}
            placeholder={props.placeholder || "请输入..."}
            disabled={props.disabled}
            required={props.required}
            type={props.type || "text"}
            defaultValue={props.defaultValue || ""}
            style={{ ...themeStyle }}
          />
          {props.helperText && (
            <p css={mutedSmall}>{props.helperText}</p>
          )}
        </div>
      );

    case "textarea":
      return (
        <div css={fieldStack} style={{ ...animationStyle }}>
          {props.label && <Label htmlFor={component.id}>{props.label}</Label>}
          <Textarea
            id={component.id}
            placeholder={props.placeholder || "请输入多行文本..."}
            disabled={props.disabled}
            required={props.required}
            rows={props.rows || 4}
            defaultValue={props.defaultValue || ""}
            style={{ ...themeStyle }}
          />
          {props.helperText && (
            <p css={mutedSmall}>{props.helperText}</p>
          )}
        </div>
      );

    case "select":
      return (
        <div css={fieldStack} style={{ ...animationStyle }}>
          {props.label && <Label htmlFor={component.id}>{props.label}</Label>}
          <Select
            disabled={props.disabled}
            defaultValue={props.defaultValue || ""}
          >
            <SelectTrigger id={component.id} style={{ ...themeStyle }}>
              <SelectValue placeholder={props.placeholder || "请选择..."} />
            </SelectTrigger>
            <SelectContent>
              {(props.options || ["选项1", "选项2", "选项3"]).map(
                (option: string, index: number) => (
                  <SelectItem key={index} value={option}>
                    {option}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
          {props.helperText && (
            <p css={mutedSmall}>{props.helperText}</p>
          )}
        </div>
      );

    case "checkbox":
      return (
        <div css={fieldStack} style={{ ...animationStyle }}>
          <div css={flexRowGap2}>
            <Checkbox
              id={component.id}
              disabled={props.disabled}
              checked={props.checked}
              defaultChecked={props.checked}
            />
            <Label htmlFor={component.id}>{props.label || "复选框"}</Label>
          </div>
          {props.helperText && (
            <p css={mutedSmall}>{props.helperText}</p>
          )}
        </div>
      );

    case "radio":
      return (
        <div css={fieldStack} style={{ ...animationStyle }}>
          {props.label && <Label>{props.label}</Label>}
          <RadioGroup defaultValue={props.defaultValue || "option-1"}>
            {(props.options || ["选项1", "选项2", "选项3"]).map(
              (option: string, index: number) => (
                <div key={index} css={radioOptionRow}>
                  <RadioGroupItem
                    value={`option-${index + 1}`}
                    id={`${component.id}-${index}`}
                    disabled={props.disabled}
                  />
                  <Label htmlFor={`${component.id}-${index}`}>{option}</Label>
                </div>
              )
            )}
          </RadioGroup>
          {props.helperText && (
            <p css={mutedSmall}>{props.helperText}</p>
          )}
        </div>
      );

    case "switch":
      return (
        <div css={fieldStack} style={{ ...animationStyle }}>
          <div css={flexRowGap2}>
            <Switch
              id={component.id}
              disabled={props.disabled}
              checked={props.checked}
              defaultChecked={props.checked}
            />
            <Label htmlFor={component.id}>{props.label || "开关"}</Label>
          </div>
          {props.helperText && (
            <p css={mutedSmall}>{props.helperText}</p>
          )}
        </div>
      );

    case "slider":
      return (
        <div css={fieldStack} style={{ ...animationStyle }}>
          {props.label && <Label htmlFor={component.id}>{props.label}</Label>}
          <div css={padX2}>
            <FullWidthSlider
              id={component.id}
              disabled={props.disabled}
              defaultValue={props.defaultValue || [50]}
              min={props.min || 0}
              max={props.max || 100}
              step={props.step || 1}
            />
            <div css={sliderScaleRow}>
              <span>{props.min || 0}</span>
              <span>{props.max || 100}</span>
            </div>
          </div>
          {props.helperText && (
            <p css={mutedSmall}>{props.helperText}</p>
          )}
        </div>
      );

    case "date-picker":
      return (
        <div css={fieldStack} style={{ ...animationStyle }}>
          {props.label && <Label htmlFor={component.id}>{props.label}</Label>}
          <Popover>
            <PopoverTrigger asChild>
              <DateTriggerButton
                id={component.id}
                variant="outline"
                disabled={props.disabled}
              >
                <CalendarIcon size={16} style={{ marginRight: "0.5rem" }} />
                {props.selectedDate ? (
                  format(props.selectedDate, "PPP", { locale: zhCN })
                ) : (
                  <span>{props.placeholder || "选择日期"}</span>
                )}
              </DateTriggerButton>
            </PopoverTrigger>
            <PopoverCalendarPanel align="start">
              <Calendar
                mode="single"
                selected={props.selectedDate}
                onSelect={props.onDateSelect}
                disabled={props.disabled}
                initialFocus
              />
            </PopoverCalendarPanel>
          </Popover>
          {props.helperText && (
            <p css={mutedSmall}>{props.helperText}</p>
          )}
        </div>
      );

    case "time-picker":
      return (
        <div css={fieldStack} style={{ ...animationStyle }}>
          {props.label && <Label htmlFor={component.id}>{props.label}</Label>}
          <div css={flexRowGap2}>
            <FlexGrowInput
              id={component.id}
              type="time"
              placeholder={props.placeholder || "选择时间"}
              disabled={props.disabled}
              defaultValue={props.defaultValue || ""}
            />
            <Clock
              size={16}
              style={{ color: "hsl(var(--muted-foreground))", flexShrink: 0 }}
            />
          </div>
          {props.helperText && (
            <p css={mutedSmall}>{props.helperText}</p>
          )}
        </div>
      );

    case "file-upload":
      return (
        <div css={fieldStack} style={{ ...animationStyle }}>
          {props.label && <Label htmlFor={component.id}>{props.label}</Label>}
          <div css={flexRowGap2}>
            <FlexGrowInput
              id={component.id}
              type="file"
              disabled={props.disabled}
              multiple={props.multiple || false}
              accept={props.accept || "*"}
            />
            <Upload
              size={16}
              style={{ color: "hsl(var(--muted-foreground))", flexShrink: 0 }}
            />
          </div>
          {props.helperText && (
            <p css={mutedSmall}>{props.helperText}</p>
          )}
          {props.maxSize && (
            <p css={mutedSmall}>
              最大文件大小: {props.maxSize}
            </p>
          )}
        </div>
      );

    case "form": {
      const formDirection = props.layout === "horizontal" ? "row" : "column";
      const formGap = props.gap ?? "0.75rem";
      const isInline = props.layout === "inline";

      return (
        <div
          css={css`
            display: flex;
            flex-direction: ${formDirection};
            flex-wrap: ${isInline ? "wrap" : "nowrap"};
            gap: ${formGap};
            align-items: ${formDirection === "row" ? "center" : "stretch"};
          `}
          style={{
            ...themeStyle,
            ...animationStyle,
          }}
          data-component-id={component.id}
        >
          {childComponents.length > 0 ? (
            childComponents.map((child) => (
              <ChildWrapper
                key={child.id}
                child={child}
                components={components}
                isPreviewMode={isPreviewMode}
                selectedId={selectedId}
                onSelectComponent={onSelectComponent}
                onMouseDown={onMouseDown}
              />
            ))
          ) : (
            <span css={mutedSmall}>表单内容</span>
          )}
        </div>
      );
    }

    default:
      return (
        <div css={fallbackBox} style={{ ...animationStyle }}>
          {component.name || component.type}
        </div>
      );
  }
}
