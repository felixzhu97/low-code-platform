"use client";

import { useState, useEffect, useRef } from "react";
import {
  Button,
  Label,
  Textarea,
  Alert,
  Card,
  CardHeader,
  CardContent,
} from "@/presentation/components/ui";
import {
  Edit,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Copy,
} from "lucide-react";
import { JsonHelperService } from "@/application/services/json-helper.service";

interface BoundDataEditorProps {
  data: any;
  onUpdate?: (data: any) => void;
  onReset?: () => void;
  minHeight?: string;
}

export function BoundDataEditor({
  data,
  onUpdate,
  onReset,
  minHeight = "200px",
}: BoundDataEditorProps) {
  // 将数据转换为JSON字符串
  const dataToJsonString = (data: any): string => {
    if (data === null || data === undefined) {
      return "";
    }
    try {
      return JSON.stringify(data, null, 2);
    } catch (error) {
      return String(data);
    }
  };

  // 深度比较两个数据是否相等
  const isDataEqual = (data1: any, data2: any): boolean => {
    if (data1 === data2) return true;
    if (data1 === null || data2 === null) return data1 === data2;
    if (data1 === undefined || data2 === undefined) return data1 === data2;
    
    try {
      return JSON.stringify(data1) === JSON.stringify(data2);
    } catch {
      return false;
    }
  };

  const [jsonString, setJsonString] = useState(dataToJsonString(data));
  const [validationResult, setValidationResult] = useState<{
    valid: boolean;
    error?: string;
    data?: any;
  }>({ valid: true });
  
  // 用于跟踪是否是用户刚刚应用了更改
  const justAppliedRef = useRef(false);
  const lastAppliedDataRef = useRef<string>("");

  // 当外部数据变化时，更新编辑器内容
  useEffect(() => {
    const newJsonString = dataToJsonString(data);
    
    // 如果用户刚刚应用了更改，检查新数据是否与用户编辑的内容一致
    if (justAppliedRef.current) {
      // 解析用户编辑的数据和外部传入的数据进行比较
      try {
        const appliedData = JSON.parse(lastAppliedDataRef.current);
        if (isDataEqual(appliedData, data)) {
          // 数据一致，说明是用户应用更改后的更新，不重置输入框
          justAppliedRef.current = false;
          lastAppliedDataRef.current = "";
          return;
        }
      } catch {
        // 如果解析失败，使用字符串比较
        if (newJsonString === lastAppliedDataRef.current) {
          justAppliedRef.current = false;
          lastAppliedDataRef.current = "";
          return;
        }
      }
      // 如果不一致，说明是外部数据源变化，需要重置
      justAppliedRef.current = false;
      lastAppliedDataRef.current = "";
    }
    
    // 只有当新数据与当前输入框内容不同时才更新
    // 使用深度比较，避免因为 JSON 格式化差异导致不必要的更新
    try {
      const currentData = JSON.parse(jsonString);
      if (isDataEqual(currentData, data)) {
        // 数据内容相同，只是格式可能不同，不更新输入框
        return;
      }
    } catch {
      // 如果当前输入框内容不是有效 JSON，则比较字符串
      if (newJsonString === jsonString) {
        return;
      }
    }
    
    // 数据不同，更新输入框
    setJsonString(newJsonString);
    // 重新验证
    validateJson(newJsonString);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  // 验证JSON
  const validateJson = (json: string) => {
    if (!json.trim()) {
      setValidationResult({
        valid: false,
        error: "JSON字符串不能为空",
      });
      return false;
    }

    const result = JsonHelperService.validateJson(json);
    setValidationResult(result);
    return result.valid;
  };

  // 处理输入变化
  const handleInputChange = (newValue: string) => {
    setJsonString(newValue);
    validateJson(newValue);
  };

  // 格式化JSON
  const handleFormat = () => {
    const formatted = JsonHelperService.formatJson(jsonString);
    if (formatted !== jsonString) {
      handleInputChange(formatted);
    }
  };

  // 应用更改
  const handleApply = () => {
    const result = JsonHelperService.validateJson(jsonString);
    if (result.valid && result.data && onUpdate) {
      // 标记刚刚应用了更改
      justAppliedRef.current = true;
      lastAppliedDataRef.current = jsonString;
      // 调用更新回调
      onUpdate(result.data);
    }
  };

  // 重置为原始数据
  const handleReset = () => {
    const originalJson = dataToJsonString(data);
    handleInputChange(originalJson);
    if (onReset) {
      onReset();
    }
  };

  // 检查是否有未保存的更改
  const hasChanges = jsonString.trim() !== dataToJsonString(data).trim();

  return (
    <div className="space-y-3">
      <Card className="border shadow-sm">
        <CardHeader className="pb-3 px-4 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="rounded-md bg-primary/10 p-1.5">
                <Edit className="h-4 w-4 text-primary" />
              </div>
              <Label htmlFor="bound-data-editor" className="text-sm font-semibold">
                编辑已绑定数据
              </Label>
            </div>
            <div className="flex gap-1.5">
              <Button
                variant="outline"
                size="sm"
                onClick={handleFormat}
                disabled={!jsonString.trim()}
                className="h-7 gap-1.5 text-xs"
                title="格式化JSON"
              >
                <Copy className="h-3 w-3" />
                格式化
              </Button>
              {hasChanges && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  className="h-7 gap-1.5 text-xs"
                  title="重置为原始数据"
                >
                  <RotateCcw className="h-3 w-3" />
                  重置
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0 px-4 pb-4">
          <Textarea
            id="bound-data-editor"
            value={jsonString}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="编辑已绑定的数据..."
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

      {/* 应用更改按钮 */}
      {hasChanges && validationResult.valid && validationResult.data && (
        <Button
          onClick={handleApply}
          className="w-full h-10 gap-2 font-medium shadow-sm"
          size="lg"
        >
          <CheckCircle2 className="h-4 w-4" />
          应用更改
        </Button>
      )}

      {/* 提示信息 */}
      {!hasChanges && jsonString.trim() && (
        <Alert className="border-blue-500/50 bg-blue-50/50 text-blue-900 dark:bg-blue-950/50 dark:text-blue-100">
          <div className="text-xs">
            当前数据与组件已绑定数据一致，无需更新
          </div>
        </Alert>
      )}
    </div>
  );
}

