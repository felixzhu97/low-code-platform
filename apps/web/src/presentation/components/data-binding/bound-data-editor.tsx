"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Button,
  Label,
  Textarea,
  Alert,
  Card,
  CardHeader,
  CardContent,
} from "@/presentation/components/ui";
import { Edit, CheckCircle2, AlertCircle, RotateCcw, Copy } from "lucide-react";
import { JsonHelperWasmService } from "@/application/services/json-helper-wasm.service";

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

  // 验证JSON（异步）
  const validateJson = useCallback(async (json: string) => {
    if (!json.trim()) {
      setValidationResult({
        valid: false,
        error: "JSON字符串不能为空",
      });
      return false;
    }

    try {
      const result = await JsonHelperWasmService.validateJson(json);
      setValidationResult(result);
      return result.valid;
    } catch (error) {
      console.error("验证失败:", error);
      // 使用同步降级方案
      const fallbackResult = JsonHelperWasmService.validateJsonSync(json);
      setValidationResult(fallbackResult);
      return fallbackResult.valid;
    }
  }, []);

  // 预加载 WASM 模块
  useEffect(() => {
    JsonHelperWasmService.preload().catch((error) => {
      console.warn("WASM 预加载失败，将使用降级方案:", error);
    });
  }, []);

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
    // 重新验证（异步）
    validateJson(newJsonString);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, validateJson]);

  // 处理输入变化
  const handleInputChange = useCallback(
    (newValue: string) => {
      setJsonString(newValue);
      // 异步验证
      validateJson(newValue);
    },
    [validateJson]
  );

  // 格式化JSON（异步）
  const handleFormat = useCallback(async () => {
    try {
      const formatted = await JsonHelperWasmService.formatJson(jsonString, 2);
      if (formatted !== jsonString) {
        handleInputChange(formatted);
      }
    } catch (error) {
      console.error("格式化失败:", error);
      // 使用同步降级方案
      const formatted = JsonHelperWasmService.formatJsonSync(jsonString, 2);
      if (formatted !== jsonString) {
        handleInputChange(formatted);
      }
    }
  }, [jsonString, handleInputChange]);

  // 应用更改（异步）
  const handleApply = useCallback(async () => {
    try {
      const result = await JsonHelperWasmService.validateJson(jsonString);
      
      if (result.valid && onUpdate) {
        justAppliedRef.current = true;
        lastAppliedDataRef.current = jsonString;
        const dataToUpdate = result.data !== undefined ? result.data : null;
        onUpdate(dataToUpdate);
      }
    } catch (error) {
      // 使用同步降级方案
      const result = JsonHelperWasmService.validateJsonSync(jsonString);
      if (result.valid && onUpdate) {
        justAppliedRef.current = true;
        lastAppliedDataRef.current = jsonString;
        const dataToUpdate = result.data !== undefined ? result.data : null;
        onUpdate(dataToUpdate);
      }
    }
  }, [jsonString, onUpdate]);

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
          <div className="flex items-center justify-between gap-2 min-w-0">
            <div className="flex gap-1.5 flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={handleFormat}
                disabled={!jsonString.trim()}
                className="h-7 gap-1.5 text-xs"
                title="格式化JSON"
              >
                <Copy className="h-3 w-3 flex-shrink-0" />
                <span className="hidden sm:inline">格式化</span>
              </Button>
              {hasChanges && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  className="h-7 gap-1.5 text-xs"
                  title="重置为原始数据"
                >
                  <RotateCcw className="h-3 w-3 flex-shrink-0" />
                  <span className="hidden sm:inline">重置</span>
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

      {/* 错误提示 - 只在有错误时显示 */}
      {jsonString.trim() && !validationResult.valid && (
        <Alert
          variant="destructive"
          className="animate-in fade-in-0 slide-in-from-top-2 duration-200"
        >
          <AlertCircle className="h-4 w-4" />
          <div className="text-sm">{validationResult.error}</div>
        </Alert>
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

      {/* 状态提示 - 简洁的单行提示 */}
      {!hasChanges && jsonString.trim() && validationResult.valid && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground px-1">
          <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
          <span>
            {validationResult.data && Array.isArray(validationResult.data)
              ? `数据已同步 (${validationResult.data.length}项)`
              : "数据已同步"}
          </span>
        </div>
      )}
    </div>
  );
}
