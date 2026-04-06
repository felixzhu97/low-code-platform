"use client";

import { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
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
import { JsonHelperService } from "@/application/services/json-helper.service";

interface JsonDataInputProps {
  value?: string;
  onChange?: (jsonString: string, isValid: boolean, data?: any) => void;
  onConfirm?: (data: any) => void;
  showTemplateSelector?: boolean;
  placeholder?: string;
  minHeight?: string;
  componentType?: string;
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const TemplateCardStyled = styled(Card)`
  border-style: dashed;
`;

const CardHeaderStyled = styled(CardHeader)`
  padding-bottom: 0.75rem;
`;

const CardHeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SparklesIcon = styled(Sparkles)`
  width: 1rem;
  height: 1rem;
  color: hsl(var(--primary));
`;

const HeaderLabel = styled(Label)`
  font-size: 0.875rem;
  font-weight: 500;
`;

const CardContentStyled = styled(CardContent)`
  padding-top: 0;
`;

const SelectTriggerStyled = styled(SelectTrigger)`
  width: 100%;
`;

const JsonInputCard = styled(Card)``;

const JsonInputHeader = styled(CardHeader)`
  padding-bottom: 0.75rem;
`;

const JsonInputHeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const JsonInputHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FileCodeIcon = styled(FileCode)`
  width: 1rem;
  height: 1rem;
  color: hsl(var(--primary));
`;

const HeaderLabelStyled = styled(Label)`
  font-size: 0.875rem;
  font-weight: 500;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const SmallButton = styled(Button)`
  height: 1.75rem;
  gap: 0.375rem;
`;

const JsonInputContentStyled = styled(CardContent)`
  padding-top: 0;
`;

const TextareaStyled = styled(Textarea)`
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

const ValidationWrapper = styled.div`
  animation: fadeIn 0.2s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-0.5rem);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const SuccessAlert = styled(Alert)`
  border-color: hsl(142 76% 36% / 0.5);
  background-color: hsl(142 76% 96% / 0.5);
  color: hsl(142 76% 16%);

  @media (prefers-color-scheme: dark) {
    background-color: hsl(142 76% 12% / 0.5);
    color: hsl(142 76% 90%);
  }
`;

const SuccessIcon = styled(CheckCircle2)`
  width: 1rem;
  height: 1rem;
  color: hsl(142 76% 36%);
`;

const AlertContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const AlertText = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
`;

const DataTypeBadge = styled.span`
  font-size: 0.75rem;
  color: hsl(var(--muted-foreground));
  background-color: hsl(var(--background) / 0.5);
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
`;

const ErrorAlert = styled(Alert)`
  --tw-border-opacity: 1;
  border-color: hsl(var(--destructive) / var(--tw-border-opacity, 1));
`;

const ErrorIcon = styled(AlertCircle)`
  width: 1rem;
  height: 1rem;
`;

const ErrorText = styled.div`
  font-size: 0.875rem;
`;

const ConfirmButton = styled(Button)`
  width: 100%;
  height: 2.5rem;
  gap: 0.5rem;
  font-weight: 500;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

export function JsonDataInput({
  value = "",
  onChange,
  onConfirm,
  showTemplateSelector = true,
  placeholder = "输入JSON数据...",
  minHeight = "200px",
  componentType,
}: JsonDataInputProps) {
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

  useEffect(() => {
    if (value !== jsonString) {
      setJsonString(value || "");
    }
  }, [value]);

  const validateJson = (json: string) => {
    const result = JsonHelperService.validateJson(json);
    setValidationResult(result);
    return result;
  };

  const handleInputChange = (newValue: string) => {
    setJsonString(newValue);
    const result = validateJson(newValue);
    if (onChange) {
      onChange(newValue, result.valid, result.data);
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const templateJson = getTemplateJson(templateId);
    handleInputChange(templateJson);
  };

  const handleFormat = () => {
    const formatted = JsonHelperService.formatJson(jsonString);
    if (formatted !== jsonString) {
      handleInputChange(formatted);
    }
  };

  const handleConfirm = () => {
    const result = validateJson(jsonString);
    if (result.valid && result.data && onConfirm) {
      onConfirm(result.data);
    }
  };

  const handleClear = () => {
    handleInputChange("");
  };

  const getDataTypeText = () => {
    if (!validationResult.data) return "数据";
    if (Array.isArray(validationResult.data)) {
      return `数组，${validationResult.data.length}项`;
    }
    if (typeof validationResult.data === "object") {
      return "对象";
    }
    return "数据";
  };

  return (
    <Wrapper>
      {showTemplateSelector && (
        <TemplateCardStyled>
          <CardHeaderStyled>
            <CardHeaderContent>
              <SparklesIcon />
              <HeaderLabel htmlFor="template-select">选择模板</HeaderLabel>
            </CardHeaderContent>
          </CardHeaderStyled>
          <CardContentStyled>
            <Select
              value={selectedTemplate}
              onValueChange={handleTemplateSelect}
            >
              <SelectTriggerStyled id="template-select">
                <SelectValue placeholder="选择模板" />
              </SelectTriggerStyled>
              <SelectContent>
                {availableTemplates.length === 0 ? (
                  <div
                    css={{
                      padding: "0.75rem",
                      fontSize: "0.875rem",
                      color: "hsl(var(--muted-foreground))",
                      textAlign: "center",
                    }}
                  >
                    暂无适用的模板
                  </div>
                ) : (
                  availableTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      <div css={{ display: "flex", flexDirection: "column", padding: "0.25rem 0" }}>
                        <span css={{ fontWeight: 500 }}>{template.name}</span>
                        <span css={{ fontSize: "0.75rem", color: "hsl(var(--muted-foreground))" }}>
                          {template.description}
                        </span>
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </CardContentStyled>
        </TemplateCardStyled>
      )}

      <JsonInputCard>
        <JsonInputHeader>
          <JsonInputHeaderContent>
            <JsonInputHeaderLeft>
              <FileCodeIcon />
              <HeaderLabelStyled htmlFor="json-input">JSON数据</HeaderLabelStyled>
            </JsonInputHeaderLeft>
            <ButtonGroup>
              <SmallButton
                variant="outline"
                size="sm"
                onClick={handleFormat}
                disabled={!jsonString.trim()}
              >
                <Copy css={{ width: "0.75rem", height: "0.75rem" }} />
                格式化
              </SmallButton>
              <SmallButton
                variant="ghost"
                size="sm"
                onClick={handleClear}
                disabled={!jsonString.trim()}
              >
                <Trash2 css={{ width: "0.75rem", height: "0.75rem" }} />
                清空
              </SmallButton>
            </ButtonGroup>
          </JsonInputHeaderContent>
        </JsonInputHeader>
        <JsonInputContentStyled>
          <TextareaStyled
            id="json-input"
            value={jsonString}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={placeholder}
            data-valid={validationResult.valid}
            style={{ minHeight }}
          />
        </JsonInputContentStyled>
      </JsonInputCard>

      {jsonString.trim() && (
        <ValidationWrapper>
          {validationResult.valid ? (
            <SuccessAlert>
              <SuccessIcon />
              <AlertContent>
                <AlertText>JSON格式正确</AlertText>
                {validationResult.data && (
                  <DataTypeBadge>{getDataTypeText()}</DataTypeBadge>
                )}
              </AlertContent>
            </SuccessAlert>
          ) : (
            <ErrorAlert variant="destructive">
              <ErrorIcon />
              <ErrorText>{validationResult.error}</ErrorText>
            </ErrorAlert>
          )}
        </ValidationWrapper>
      )}

      {onConfirm && validationResult.valid && validationResult.data && (
        <ConfirmButton
          onClick={handleConfirm}
          size="lg"
        >
          <CheckCircle2 css={{ width: "1rem", height: "1rem" }} />
          确认并使用数据
        </ConfirmButton>
      )}
    </Wrapper>
  );
}
