"use client";

import { useState, useEffect, useRef } from "react";
import styled from "@emotion/styled";
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
import { JsonHelperService } from "@/application/services/json-helper.service";

interface BoundDataEditorProps {
  readonly data: any;
  readonly onUpdate?: (data: any) => void;
  readonly onReset?: () => void;
  readonly minHeight?: string;
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const EditorCard = styled(Card)`
  border: 1px solid hsl(var(--border));
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

const CardHeaderStyled = styled(CardHeader)`
  padding-bottom: 0.75rem;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 1rem;
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
`;

const IconWrapper = styled.div`
  border-radius: calc(var(--radius) / 2);
  background-color: hsl(var(--primary) / 0.1);
  padding: 0.375rem;
`;

const EditIcon = styled(Edit)`
  width: 1rem;
  height: 1rem;
  color: hsl(var(--primary));
`;

const HeaderLabel = styled(Label)`
  font-size: 0.875rem;
  font-weight: 600;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.375rem;
`;

const SmallButton = styled(Button)`
  height: 1.75rem;
  gap: 0.375rem;
  font-size: 0.75rem;
`;

const CardContentStyled = styled(CardContent)`
  padding-left: 1rem;
  padding-right: 1rem;
  padding-bottom: 1rem;
  padding-top: 0;
`;

const StyledTextarea = styled(Textarea)`
  font-family: monospace;
  font-size: 0.875rem;
  transition: border-color 0.2s, box-shadow 0.2s;

  &[data-valid="true"] {
    border-color: hsl(var(--input));
    &:focus-visible {
      box-shadow: 0 0 0 2px hsl(var(--ring));
    }
  }

  &[data-valid="false"] {
    border-color: hsl(var(--destructive));
    &:focus-visible {
      box-shadow: 0 0 0 2px hsl(var(--destructive) / 0.5);
    }
  }
`;

const StatusSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ErrorAlert = styled(Alert)`
  padding: 0.5rem;
`;

const ErrorIcon = styled(AlertCircle)`
  width: 0.875rem;
  height: 0.875rem;
`;

const ErrorText = styled.div`
  font-size: 0.75rem;
`;

const ApplyButton = styled(Button)`
  width: 100%;
  height: 2.25rem;
  gap: 0.5rem;
  font-size: 0.875rem;
`;

const ApplyIcon = styled(CheckCircle2)`
  width: 0.875rem;
  height: 0.875rem;
`;

const StatusText = styled.div`
  font-size: 0.75rem;
  color: hsl(var(--muted-foreground));
  text-align: center;
  padding: 0.25rem 0;
`;

export function BoundDataEditor({
  data,
  onUpdate,
  onReset,
  minHeight = "200px",
}: BoundDataEditorProps) {
  const dataToJsonString = (data: any): string => {
    if (data === null || data === undefined) {
      return "";
    }
    try {
      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.debug("JSON stringify error:", error);
      return String(data);
    }
  };

  const isDataEqual = (data1: any, data2: any): boolean => {
    if (data1 === data2) return true;
    if (data1 === null || data2 === null) return data1 === data2;
    if (data1 === undefined || data2 === undefined) return data1 === data2;

    try {
      return JSON.stringify(data1) === JSON.stringify(data2);
    } catch (error) {
      console.debug("Data comparison error:", error);
      return false;
    }
  };

  const [jsonString, setJsonString] = useState(dataToJsonString(data));
  const [validationResult, setValidationResult] = useState<{
    valid: boolean;
    error?: string;
    data?: any;
  }>({ valid: true });

  const justAppliedRef = useRef(false);
  const lastAppliedDataRef = useRef<string>("");

  useEffect(() => {
    const newJsonString = dataToJsonString(data);

    if (justAppliedRef.current) {
      try {
        const appliedData = JSON.parse(lastAppliedDataRef.current);
        if (isDataEqual(appliedData, data)) {
          justAppliedRef.current = false;
          lastAppliedDataRef.current = "";
          return;
        }
      } catch {
        if (newJsonString === lastAppliedDataRef.current) {
          justAppliedRef.current = false;
          lastAppliedDataRef.current = "";
          return;
        }
      }
      justAppliedRef.current = false;
      lastAppliedDataRef.current = "";
    }

    try {
      const currentData = JSON.parse(jsonString);
      if (isDataEqual(currentData, data)) {
        return;
      }
    } catch {
      if (newJsonString === jsonString) {
        return;
      }
    }

    setJsonString(newJsonString);
    validateJson(newJsonString);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

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

  const handleInputChange = (newValue: string) => {
    setJsonString(newValue);
    validateJson(newValue);
  };

  const handleFormat = () => {
    const formatted = JsonHelperService.formatJson(jsonString);
    if (formatted !== jsonString) {
      handleInputChange(formatted);
    }
  };

  const handleApply = () => {
    const result = JsonHelperService.validateJson(jsonString);
    if (result.valid && result.data && onUpdate) {
      justAppliedRef.current = true;
      lastAppliedDataRef.current = jsonString;
      onUpdate(result.data);
    }
  };

  const handleReset = () => {
    const originalJson = dataToJsonString(data);
    handleInputChange(originalJson);
    if (onReset) {
      onReset();
    }
  };

  const hasChanges = jsonString.trim() !== dataToJsonString(data).trim();

  return (
    <Wrapper>
      <EditorCard>
        <CardHeaderStyled>
          <HeaderContent>
            <HeaderLeft>
              <IconWrapper>
                <EditIcon />
              </IconWrapper>
              <HeaderLabel htmlFor="bound-data-editor">编辑已绑定数据</HeaderLabel>
            </HeaderLeft>
            <ButtonGroup>
              <SmallButton
                variant="outline"
                size="sm"
                onClick={handleFormat}
                disabled={!jsonString.trim()}
                title="格式化JSON"
              >
                <Copy css={{ width: "0.75rem", height: "0.75rem" }} />
                格式化
              </SmallButton>
              {hasChanges && (
                <SmallButton
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  title="重置为原始数据"
                >
                  <RotateCcw css={{ width: "0.75rem", height: "0.75rem" }} />
                  重置
                </SmallButton>
              )}
            </ButtonGroup>
          </HeaderContent>
        </CardHeaderStyled>
        <CardContentStyled>
          <StyledTextarea
            id="bound-data-editor"
            value={jsonString}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="编辑已绑定的数据..."
            data-valid={validationResult.valid}
            style={{ minHeight }}
          />
        </CardContentStyled>
      </EditorCard>

      {jsonString.trim() && (
        <StatusSection>
          {!validationResult.valid && (
            <ErrorAlert variant="destructive">
              <ErrorIcon />
              <ErrorText>{validationResult.error}</ErrorText>
            </ErrorAlert>
          )}

          {hasChanges && validationResult.valid && validationResult.data && (
            <ApplyButton onClick={handleApply} size="sm">
              <ApplyIcon />
              应用更改
            </ApplyButton>
          )}

          {!hasChanges && validationResult.valid && (
            <StatusText>数据已同步</StatusText>
          )}
        </StatusSection>
      )}
    </Wrapper>
  );
}
