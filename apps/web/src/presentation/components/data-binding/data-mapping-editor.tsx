"use client";

import { useState, useEffect } from "react";
import {
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Button,
  Switch,
} from "@/presentation/components/ui";
import type { DataMapping, DataSource } from "@/domain/datasource";
import { DataBindingService } from "@/application/services/data-binding.service";

interface DataMappingEditorProps {
  mapping: DataMapping;
  dataSource: DataSource | null;
  availablePaths?: string[];
  targetPathSuggestions?: string[];
  onChange: (mapping: DataMapping) => void;
  onDelete?: () => void;
}

export function DataMappingEditor({
  mapping,
  dataSource,
  availablePaths = [],
  targetPathSuggestions = [],
  onChange,
  onDelete,
}: DataMappingEditorProps) {
  const [field, setField] = useState(mapping.field || "");
  const [sourcePath, setSourcePath] = useState(mapping.sourcePath || "");
  const [targetPath, setTargetPath] = useState(mapping.targetPath || "");
  const [transform, setTransform] = useState<
    "string" | "number" | "boolean" | "date" | "json" | undefined
  >(mapping.transform);
  const [defaultValue, setDefaultValue] = useState(mapping.defaultValue);
  const [useDefaultValue, setUseDefaultValue] = useState(
    mapping.defaultValue !== undefined
  );
  const [sourcePathInputMode, setSourcePathInputMode] = useState<
    "select" | "input"
  >("select");
  const [isValid, setIsValid] = useState(true);
  const [validationError, setValidationError] = useState<string>("");

  // 更新父组件
  useEffect(() => {
    const updatedMapping: DataMapping = {
      field,
      sourcePath,
      targetPath,
      transform,
      defaultValue: useDefaultValue ? defaultValue : undefined,
    };
    onChange(updatedMapping);
  }, [field, sourcePath, targetPath, transform, defaultValue, useDefaultValue]);

  // 验证源路径
  useEffect(() => {
    const validatePath = async () => {
      if (!sourcePath || !dataSource) {
        setIsValid(true);
        setValidationError("");
        return;
      }

      try {
        const valid = await DataBindingService.validateSourcePath(
          sourcePath,
          dataSource
        );
        setIsValid(valid);
        setValidationError(valid ? "" : "源路径无效或不存在于数据源中");
      } catch (error) {
        setIsValid(false);
        setValidationError("验证路径时出错");
      }
    };

    validatePath();
  }, [sourcePath, dataSource]);

  const handleSourcePathSelectChange = (value: string) => {
    if (value === "__manual__") {
      setSourcePathInputMode("input");
    } else {
      setSourcePath(value);
      setSourcePathInputMode("select");
    }
  };

  const handleDefaultValueChange = (value: any) => {
    if (transform === "boolean") {
      setDefaultValue(value);
    } else if (transform === "number") {
      const num = parseFloat(value);
      setDefaultValue(isNaN(num) ? 0 : num);
    } else if (transform === "json") {
      try {
        setDefaultValue(JSON.parse(value));
      } catch {
        setDefaultValue(value);
      }
    } else {
      setDefaultValue(value);
    }
  };

  const renderDefaultValueInput = () => {
    if (!useDefaultValue) return null;

    switch (transform) {
      case "boolean":
        return (
          <Switch
            checked={defaultValue === true}
            onCheckedChange={(checked) => setDefaultValue(checked)}
          />
        );
      case "number":
        return (
          <Input
            type="number"
            value={defaultValue || ""}
            onChange={(e) => handleDefaultValueChange(e.target.value)}
            placeholder="默认数值"
          />
        );
      case "date":
        return (
          <Input
            type="datetime-local"
            value={
              defaultValue
                ? new Date(defaultValue).toISOString().slice(0, 16)
                : ""
            }
            onChange={(e) =>
              setDefaultValue(new Date(e.target.value).toISOString())
            }
          />
        );
      case "json":
        return (
          <Input
            value={
              typeof defaultValue === "string"
                ? defaultValue
                : JSON.stringify(defaultValue || {})
            }
            onChange={(e) => handleDefaultValueChange(e.target.value)}
            placeholder='{"key": "value"}'
          />
        );
      default:
        return (
          <Input
            value={defaultValue || ""}
            onChange={(e) => setDefaultValue(e.target.value)}
            placeholder="默认值"
          />
        );
    }
  };

  return (
    <div className="space-y-4 rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">数据映射</h4>
        {onDelete && (
          <Button variant="ghost" size="sm" onClick={onDelete}>
            删除
          </Button>
        )}
      </div>

      <div className="grid gap-4">
        {/* 字段名 */}
        <div className="grid gap-2">
          <Label htmlFor="field-name">字段名</Label>
          <Input
            id="field-name"
            value={field}
            onChange={(e) => setField(e.target.value)}
            placeholder="例如: userName"
          />
        </div>

        {/* 源路径 */}
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="source-path">源路径</Label>
            {availablePaths.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setSourcePathInputMode(
                    sourcePathInputMode === "select" ? "input" : "select"
                  )
                }
                className="h-6 px-2 text-xs"
              >
                {sourcePathInputMode === "select" ? "手动输入" : "选择路径"}
              </Button>
            )}
          </div>
          {sourcePathInputMode === "select" && availablePaths.length > 0 ? (
            <Select
              value={sourcePath}
              onValueChange={handleSourcePathSelectChange}
            >
              <SelectTrigger
                id="source-path"
                className={!isValid ? "border-destructive" : ""}
              >
                <SelectValue placeholder="选择或输入路径" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__manual__">手动输入...</SelectItem>
                {availablePaths.map((path) => (
                  <SelectItem key={path} value={path}>
                    {path}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              id="source-path"
              value={sourcePath}
              onChange={(e) => setSourcePath(e.target.value)}
              placeholder="例如: users[0].name 或 metadata.total"
              className={!isValid ? "border-destructive" : ""}
            />
          )}
          {!isValid && (
            <p className="text-xs text-destructive">{validationError}</p>
          )}
        </div>

        {/* 目标路径 */}
        <div className="grid gap-2">
          <Label htmlFor="target-path">目标路径</Label>
          {targetPathSuggestions.length > 0 ? (
            <Select value={targetPath} onValueChange={setTargetPath}>
              <SelectTrigger id="target-path">
                <SelectValue placeholder="选择或输入路径" />
              </SelectTrigger>
              <SelectContent>
                {targetPathSuggestions.map((path) => (
                  <SelectItem key={path} value={path}>
                    {path}
                  </SelectItem>
                ))}
                <SelectItem value="__custom__">自定义...</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <Input
              id="target-path"
              value={targetPath}
              onChange={(e) => setTargetPath(e.target.value)}
              placeholder="例如: properties.text 或 properties.content"
            />
          )}
        </div>

        {/* 转换类型 */}
        <div className="grid gap-2">
          <Label htmlFor="transform">转换类型</Label>
          <Select
            value={transform || "none"}
            onValueChange={(value) =>
              setTransform(
                value === "none"
                  ? undefined
                  : (value as DataMapping["transform"])
              )
            }
          >
            <SelectTrigger id="transform">
              <SelectValue placeholder="选择转换类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">无转换</SelectItem>
              <SelectItem value="string">字符串</SelectItem>
              <SelectItem value="number">数字</SelectItem>
              <SelectItem value="boolean">布尔值</SelectItem>
              <SelectItem value="date">日期</SelectItem>
              <SelectItem value="json">JSON</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 默认值 */}
        <div className="grid gap-2">
          <div className="flex items-center gap-2">
            <Switch
              checked={useDefaultValue}
              onCheckedChange={setUseDefaultValue}
            />
            <Label htmlFor="use-default">使用默认值</Label>
          </div>
          {renderDefaultValueInput()}
        </div>
      </div>
    </div>
  );
}
