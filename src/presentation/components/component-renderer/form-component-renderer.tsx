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
import { Switch } from "@/presentation/components/ui/switch";
import { Slider } from "@/presentation/components/ui/slider";
import { Calendar } from "@/presentation/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/presentation/components/ui/popover";
import { Button } from "@/presentation/components/ui/button";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { CalendarIcon, Clock, Upload } from "lucide-react";

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

    case "switch":
      return (
        <div className="space-y-2" style={{ ...animationStyle }}>
          <div className="flex items-center gap-2">
            <Switch
              id={component.id}
              disabled={props.disabled}
              checked={props.checked}
              defaultChecked={props.checked}
            />
            <Label htmlFor={component.id}>{props.label || "开关"}</Label>
          </div>
          {props.helperText && (
            <p className="text-xs text-muted-foreground">{props.helperText}</p>
          )}
        </div>
      );

    case "slider":
      return (
        <div className="space-y-2" style={{ ...animationStyle }}>
          {props.label && <Label htmlFor={component.id}>{props.label}</Label>}
          <div className="px-2">
            <Slider
              id={component.id}
              disabled={props.disabled}
              defaultValue={props.defaultValue || [50]}
              min={props.min || 0}
              max={props.max || 100}
              step={props.step || 1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{props.min || 0}</span>
              <span>{props.max || 100}</span>
            </div>
          </div>
          {props.helperText && (
            <p className="text-xs text-muted-foreground">{props.helperText}</p>
          )}
        </div>
      );

    case "date-picker":
      return (
        <div className="space-y-2" style={{ ...animationStyle }}>
          {props.label && <Label htmlFor={component.id}>{props.label}</Label>}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id={component.id}
                variant="outline"
                className="w-full justify-start text-left font-normal"
                disabled={props.disabled}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {props.selectedDate ? (
                  format(props.selectedDate, "PPP", { locale: zhCN })
                ) : (
                  <span>{props.placeholder || "选择日期"}</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={props.selectedDate}
                onSelect={props.onDateSelect}
                disabled={props.disabled}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {props.helperText && (
            <p className="text-xs text-muted-foreground">{props.helperText}</p>
          )}
        </div>
      );

    case "time-picker":
      return (
        <div className="space-y-2" style={{ ...animationStyle }}>
          {props.label && <Label htmlFor={component.id}>{props.label}</Label>}
          <div className="flex items-center gap-2">
            <Input
              id={component.id}
              type="time"
              placeholder={props.placeholder || "选择时间"}
              disabled={props.disabled}
              defaultValue={props.defaultValue || ""}
              className="flex-1"
            />
            <Clock className="h-4 w-4 text-muted-foreground" />
          </div>
          {props.helperText && (
            <p className="text-xs text-muted-foreground">{props.helperText}</p>
          )}
        </div>
      );

    case "file-upload":
      return (
        <div className="space-y-2" style={{ ...animationStyle }}>
          {props.label && <Label htmlFor={component.id}>{props.label}</Label>}
          <div className="flex items-center gap-2">
            <Input
              id={component.id}
              type="file"
              disabled={props.disabled}
              multiple={props.multiple || false}
              accept={props.accept || "*"}
              className="flex-1"
            />
            <Upload className="h-4 w-4 text-muted-foreground" />
          </div>
          {props.helperText && (
            <p className="text-xs text-muted-foreground">{props.helperText}</p>
          )}
          {props.maxSize && (
            <p className="text-xs text-muted-foreground">
              最大文件大小: {props.maxSize}
            </p>
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
