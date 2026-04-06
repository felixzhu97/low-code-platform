"use client";

import { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
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

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border-radius: 0.5rem;
  border: 1px solid hsl(var(--border));
  padding: 1rem;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h4`
  font-weight: 500;
`;

const Grid = styled.div`
  display: grid;
  gap: 1rem;
`;

const GridItem = styled.div`
  display: grid;
  gap: 0.5rem;
`;

const GridItemRow = styled.div`
  display: grid;
  gap: 0.5rem;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SwitchRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SmallButton = styled(Button)`
  height: 1.5rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  font-size: 0.75rem;
`;

const ErrorText = styled.p`
  font-size: 0.75rem;
  color: hsl(var(--destructive));
`;

const SelectTriggerStyled = styled(SelectTrigger)<{ $invalid?: boolean }>`
  ${(props) =>
    props.$invalid &&
    css`
      border-color: hsl(var(--destructive));
    `}
`;

const InputStyled = styled(Input)<{ $invalid?: boolean }>`
  ${(props) =>
    props.$invalid &&
    css`
      border-color: hsl(var(--destructive));
    `}
`;

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
    <Wrapper>
      <Header>
        <Title>数据映射</Title>
        {onDelete && (
          <Button variant="ghost" size="sm" onClick={onDelete}>
            删除
          </Button>
        )}
      </Header>

      <Grid>
        <GridItem>
          <Label htmlFor="field-name">字段名</Label>
          <Input
            id="field-name"
            value={field}
            onChange={(e) => setField(e.target.value)}
            placeholder="例如: userName"
          />
        </GridItem>

        <GridItem>
          <Row>
            <Label htmlFor="source-path">源路径</Label>
            {availablePaths.length > 0 && (
              <SmallButton
                variant="ghost"
                onClick={() =>
                  setSourcePathInputMode(
                    sourcePathInputMode === "select" ? "input" : "select"
                  )
                }
              >
                {sourcePathInputMode === "select" ? "手动输入" : "选择路径"}
              </SmallButton>
            )}
          </Row>
          {sourcePathInputMode === "select" && availablePaths.length > 0 ? (
            <Select
              value={sourcePath}
              onValueChange={handleSourcePathSelectChange}
            >
              <SelectTriggerStyled
                id="source-path"
                $invalid={!isValid}
              >
                <SelectValue placeholder="选择或输入路径" />
              </SelectTriggerStyled>
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
            <InputStyled
              id="source-path"
              value={sourcePath}
              onChange={(e) => setSourcePath(e.target.value)}
              placeholder="例如: users[0].name 或 metadata.total"
              $invalid={!isValid}
            />
          )}
          {!isValid && <ErrorText>{validationError}</ErrorText>}
        </GridItem>

        <GridItem>
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
        </GridItem>

        <GridItem>
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
        </GridItem>

        <GridItem>
          <SwitchRow>
            <Switch
              checked={useDefaultValue}
              onCheckedChange={setUseDefaultValue}
            />
            <Label htmlFor="use-default">使用默认值</Label>
          </SwitchRow>
          {renderDefaultValueInput()}
        </GridItem>
      </Grid>
    </Wrapper>
  );
}
