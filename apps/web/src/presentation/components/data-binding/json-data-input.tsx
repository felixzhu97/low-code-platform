"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Button,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  Alert,
  Card,
  CardHeader,
  CardContent,
} from "@/presentation/components/ui";
import {
  FileCode,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Trash2,
  Copy,
} from "lucide-react";
import {
  JSON_DATA_TEMPLATES,
  getTemplateJson,
  getDefaultTemplateJson,
  getTemplatesByComponentType,
} from "@/presentation/data/json-data-templates";
import { JsonHelperWasmService } from "@/application/services/json-helper-wasm.service";

interface JsonDataInputProps {
  value?: string;
  onChange?: (jsonString: string, isValid: boolean, data?: any) => void;
  onConfirm?: (data: any) => void;
  showTemplateSelector?: boolean;
  placeholder?: string;
  minHeight?: string;
  componentType?: string; // 组件类型，用于过滤模板
}

export function JsonDataInput({
  value = "",
  onChange,
  onConfirm,
  showTemplateSelector = true,
  placeholder = "输入JSON数据...",
  minHeight = "200px",
  componentType,
}: JsonDataInputProps) {
  // 根据组件类型获取适用的模板
  const availableTemplates = componentType
    ? getTemplatesByComponentType(componentType)
    : JSON_DATA_TEMPLATES;

  const [jsonString, setJsonString] = useState(
    value || getDefaultTemplateJson(componentType)
  );
  const [validationResult, setValidationResult] = useState<{
    valid: boolean;
    error?: string;
    data?: any;
  }>({ valid: true });
  const [selectedTemplate, setSelectedTemplate] = useState<string>(
    availableTemplates.length > 0 ? availableTemplates[0].id : ""
  );

  // 预加载 WASM 模块
  useEffect(() => {
    JsonHelperWasmService.preload().catch((error) => {
      console.warn("WASM 预加载失败，将使用降级方案:", error);
    });
  }, []);

  useEffect(() => {
    if (value !== jsonString) {
      setJsonString(value || "");
    }
  }, [value]);

  // 验证JSON（异步）
  const validateJson = useCallback(async (json: string) => {
    try {
      const result = await JsonHelperWasmService.validateJson(json);
      setValidationResult(result);
      return result;
    } catch (error) {
      console.error("验证失败:", error);
      // 使用同步降级方案
      const fallbackResult = JsonHelperWasmService.validateJsonSync(json);
      setValidationResult(fallbackResult);
      return fallbackResult;
    }
  }, []);

  // 处理输入变化
  const handleInputChange = useCallback(
    async (newValue: string) => {
      setJsonString(newValue);
      const result = await validateJson(newValue);
      if (onChange) {
        onChange(newValue, result.valid, result.data);
      }
    },
    [validateJson, onChange]
  );

  // 处理模板选择
  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const templateJson = getTemplateJson(templateId);
    handleInputChange(templateJson);
  };

  // 格式化JSON（异步）
  const handleFormat = useCallback(async () => {
    try {
      const formatted = await JsonHelperWasmService.formatJson(jsonString, 2);
      if (formatted !== jsonString) {
        await handleInputChange(formatted);
      }
    } catch (error) {
      console.error("格式化失败:", error);
      // 使用同步降级方案
      const formatted = JsonHelperWasmService.formatJsonSync(jsonString, 2);
      if (formatted !== jsonString) {
        await handleInputChange(formatted);
      }
    }
  }, [jsonString, handleInputChange]);

  // 确认输入（异步）
  const handleConfirm = useCallback(async () => {
    const result = await validateJson(jsonString);
    if (result.valid && result.data && onConfirm) {
      onConfirm(result.data);
    }
  }, [jsonString, validateJson, onConfirm]);

  // 清空输入
  const handleClear = () => {
    handleInputChange("");
  };

  return (
    <div className="space-y-4">
      {/* 模板选择器 */}
      {showTemplateSelector && (
        <Card className="border-dashed">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <Label htmlFor="template-select" className="text-sm font-medium">
                选择模板
              </Label>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <Select
              value={selectedTemplate}
              onValueChange={handleTemplateSelect}
            >
              <SelectTrigger id="template-select" className="w-full">
                <SelectValue placeholder="选择模板" />
              </SelectTrigger>
              <SelectContent>
                {availableTemplates.length === 0 ? (
                  <div className="p-3 text-sm text-muted-foreground text-center">
                    暂无适用的模板
                  </div>
                ) : (
                  availableTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      <div className="flex flex-col py-1">
                        <span className="font-medium">{template.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {template.description}
                        </span>
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      )}

      {/* JSON输入框 */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCode className="h-4 w-4 text-primary" />
              <Label htmlFor="json-input" className="text-sm font-medium">
                JSON数据
              </Label>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleFormat}
                disabled={!jsonString.trim()}
                className="h-7 gap-1.5"
              >
                <Copy className="h-3 w-3" />
                格式化
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                disabled={!jsonString.trim()}
                className="h-7 gap-1.5"
              >
                <Trash2 className="h-3 w-3" />
                清空
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <Textarea
            id="json-input"
            value={jsonString}
            onChange={(e) => {
              handleInputChange(e.target.value);
            }}
            placeholder={placeholder}
            className={`font-mono text-sm transition-colors ${
              validationResult.valid
                ? "border-input focus-visible:ring-ring"
                : "border-destructive focus-visible:ring-destructive"
            }`}
            style={{ minHeight }}
          />
        </CardContent>
      </Card>

      {/* 验证结果 */}
      {jsonString.trim() && (
        <div className="animate-in fade-in-0 slide-in-from-top-2 duration-200">
          {validationResult.valid ? (
            <Alert className="border-green-500/50 bg-green-50/50 text-green-900 dark:bg-green-950/50 dark:text-green-100">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <div className="flex items-center justify-between w-full">
                <span className="text-sm font-medium">JSON格式正确</span>
                {validationResult.data && (
                  <span className="text-xs text-muted-foreground bg-background/50 px-2 py-0.5 rounded">
                    {(() => {
                      if (Array.isArray(validationResult.data)) {
                        return `数组，${validationResult.data.length}项`;
                      }
                      if (typeof validationResult.data === "object") {
                        return "对象";
                      }
                      return "数据";
                    })()}
                  </span>
                )}
              </div>
            </Alert>
          ) : (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <div className="text-sm">{validationResult.error}</div>
            </Alert>
          )}
        </div>
      )}

      {/* 确认按钮 */}
      {onConfirm && validationResult.valid && validationResult.data && (
        <Button
          onClick={handleConfirm}
          className="w-full h-10 gap-2 font-medium shadow-sm"
          size="lg"
        >
          <CheckCircle2 className="h-4 w-4" />
          确认并使用数据
        </Button>
      )}
    </div>
  );
}
