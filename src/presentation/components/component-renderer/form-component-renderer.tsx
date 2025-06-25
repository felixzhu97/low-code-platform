import type React from "react";
import type { Component } from "@/domain/entities/types";
import { Input } from "@/presentation/components/ui/input";
import { Textarea } from "@/presentation/components/ui/textarea";
import { Checkbox } from "@/presentation/components/ui/checkbox";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/presentation/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/presentation/components/ui/select";
import { Label } from "@/presentation/components/ui/label";

interface FormComponentRendererProps {
  component: Component;
  props: Record<string, any>;
  themeStyle: React.CSSProperties;
  animationStyle: React.CSSProperties;
}

export function FormComponentRenderer({
  component,
  props,
  themeStyle,
  animationStyle,
}: FormComponentRendererProps) {
  switch (component.type) {
    case "input":
      return (
        <div className="space-y-2" style={{ ...animationStyle }}>
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
            <p className="text-xs text-muted-foreground">{props.helperText}</p>
          )}
        </div>
      );

    case "textarea":
      return (
        <div className="space-y-2" style={{ ...animationStyle }}>
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
            <p className="text-xs text-muted-foreground">{props.helperText}</p>
          )}
        </div>
      );

    case "select":
      return (
        <div className="space-y-2" style={{ ...animationStyle }}>
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
            <p className="text-xs text-muted-foreground">{props.helperText}</p>
          )}
        </div>
      );

    case "checkbox":
      return (
        <div className="space-y-2" style={{ ...animationStyle }}>
          <div className="flex items-center gap-2">
            <Checkbox
              id={component.id}
              disabled={props.disabled}
              checked={props.checked}
              defaultChecked={props.checked}
            />
            <Label htmlFor={component.id}>{props.label || "复选框"}</Label>
          </div>
          {props.helperText && (
            <p className="text-xs text-muted-foreground">{props.helperText}</p>
          )}
        </div>
      );

    case "radio":
      return (
        <div className="space-y-2" style={{ ...animationStyle }}>
          {props.label && <Label>{props.label}</Label>}
          <RadioGroup defaultValue={props.defaultValue || "option-1"}>
            {(props.options || ["选项1", "选项2", "选项3"]).map(
              (option: string, index: number) => (
                <div key={index} className="flex items-center space-x-2">
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
            <p className="text-xs text-muted-foreground">{props.helperText}</p>
          )}
        </div>
      );

    default:
      return (
        <div className="rounded border p-2" style={{ ...animationStyle }}>
          {component.name || component.type}
        </div>
      );
  }
}
