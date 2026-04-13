"use client";

import { useState } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { ScrollArea } from "../ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { FormInput, Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

import type { Component } from "@/domain/component";
import { useComponentStore } from "@/infrastructure/state-management/stores";

interface FormBuilderProps {}

type FormField = {
  id: string;
  type:
    | "text"
    | "email"
    | "password"
    | "number"
    | "textarea"
    | "select"
    | "checkbox"
    | "radio"
    | "switch"
    | "slider"
    | "date-picker"
    | "time-picker"
    | "file-upload";
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
  validation?: {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
  };
  checked?: boolean;
  min?: number;
  max?: number;
  step?: number;
  multiple?: boolean;
  accept?: string;
  maxSize?: string;
};

const FIELD_TYPES = [
  { value: "text", label: "文本" },
  { value: "email", label: "邮箱" },
  { value: "password", label: "密码" },
  { value: "number", label: "数字" },
  { value: "textarea", label: "文本域" },
  { value: "select", label: "下拉选择" },
  { value: "checkbox", label: "复选框" },
  { value: "radio", label: "单选框" },
  { value: "switch", label: "开关" },
  { value: "slider", label: "滑块" },
  { value: "date-picker", label: "日期选择器" },
  { value: "time-picker", label: "时间选择器" },
  { value: "file-upload", label: "文件上传" },
];

const createBaseComponent = (
  id: string,
  type: string,
  name: string,
  position: { x: number; y: number },
  properties: any,
  parentId: string
): Component => ({
  id,
  type,
  name,
  position,
  properties,
  parentId,
});

const createFieldComponent = (
  field: FormField,
  yPosition: number,
  parentId: string
): Component[] => {
  const components: Component[] = [];
  const yInputPosition = yPosition + 30;

  if (!["checkbox", "switch"].includes(field.type)) {
    const labelComponent = createBaseComponent(
      `label-${field.id}`,
      "text",
      "字段标签",
      { x: 0, y: yPosition },
      {
        content: `${field.label}${field.required ? " *" : ""}`,
        fontSize: 14,
        fontWeight: "medium",
        color: "#000000",
        margin: "0 0 8px 0",
      },
      parentId
    );
    components.push(labelComponent);
  }

  let inputComponent: Component;
  const baseProps = {
    required: field.required || false,
    width: "100%",
  };

  switch (field.type) {
    case "text":
    case "email":
    case "password":
    case "number":
      inputComponent = createBaseComponent(
        `input-${field.id}`,
        "input",
        "输入框",
        { x: 0, y: yInputPosition },
        {
          ...baseProps,
          placeholder: field.placeholder || "",
          type: field.type,
          validation: field.validation,
        },
        parentId
      );
      break;
    case "textarea":
      inputComponent = createBaseComponent(
        `textarea-${field.id}`,
        "textarea",
        "文本域",
        { x: 0, y: yInputPosition },
        {
          ...baseProps,
          placeholder: field.placeholder || "",
          height: "100px",
          validation: field.validation,
        },
        parentId
      );
      break;
    case "select":
      inputComponent = createBaseComponent(
        `select-${field.id}`,
        "select",
        "下拉选择",
        { x: 0, y: yInputPosition },
        {
          ...baseProps,
          placeholder: "请选择",
          options: field.options || [],
        },
        parentId
      );
      break;
    case "checkbox":
      inputComponent = createBaseComponent(
        `checkbox-${field.id}`,
        "checkbox",
        "复选框",
        { x: 0, y: yPosition },
        {
          label: field.label,
          required: field.required || false,
        },
        parentId
      );
      break;
    case "radio":
      inputComponent = createBaseComponent(
        `radio-${field.id}`,
        "radio",
        "单选框",
        { x: 0, y: yInputPosition },
        {
          ...baseProps,
          options: field.options || [],
        },
        parentId
      );
      break;
    case "switch":
      inputComponent = createBaseComponent(
        `switch-${field.id}`,
        "switch",
        "开关",
        { x: 0, y: yPosition },
        {
          label: field.label,
          checked: field.checked || false,
          required: field.required || false,
        },
        parentId
      );
      break;
    case "slider":
      inputComponent = createBaseComponent(
        `slider-${field.id}`,
        "slider",
        "滑块",
        { x: 0, y: yInputPosition },
        {
          ...baseProps,
          min: field.min || 0,
          max: field.max || 100,
          step: field.step || 1,
          defaultValue: [50],
        },
        parentId
      );
      break;
    case "date-picker":
      inputComponent = createBaseComponent(
        `date-picker-${field.id}`,
        "date-picker",
        "日期选择器",
        { x: 0, y: yInputPosition },
        {
          ...baseProps,
          placeholder: field.placeholder || "选择日期",
        },
        parentId
      );
      break;
    case "time-picker":
      inputComponent = createBaseComponent(
        `time-picker-${field.id}`,
        "time-picker",
        "时间选择器",
        { x: 0, y: yInputPosition },
        {
          ...baseProps,
          placeholder: field.placeholder || "选择时间",
        },
        parentId
      );
      break;
    case "file-upload":
      inputComponent = createBaseComponent(
        `file-upload-${field.id}`,
        "file-upload",
        "文件上传",
        { x: 0, y: yInputPosition },
        {
          ...baseProps,
          multiple: field.multiple || false,
          accept: field.accept || "*",
          maxSize: field.maxSize || "",
        },
        parentId
      );
      break;
    default:
      inputComponent = createBaseComponent(
        `input-${field.id}`,
        "input",
        "输入框",
        { x: 0, y: yInputPosition },
        {
          ...baseProps,
          placeholder: field.placeholder || "",
        },
        parentId
      );
  }

  components.push(inputComponent);
  return components;
};

const LeftPanel = styled.div`
  grid-column: span 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const RightPanel = styled.div`
  grid-column: span 2;
  border: 1px solid hsl(var(--border));
  border-radius: calc(var(--radius));
  padding: 1rem;
`;

const FormGroup = styled.div`
  display: grid;
  gap: 0.5rem;
`;

const FieldList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-right: 1rem;
`;

const FieldItem = styled.div<{ active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid hsl(var(--border));
  border-radius: calc(var(--radius));
  padding: 0.5rem;
  cursor: pointer;
  transition: border-color 0.2s, background-color 0.2s;
  ${(p) =>
    p.active
      ? css`
          border-color: hsl(var(--primary));
          background-color: hsl(var(--primary) / 0.05);
        `
      : ""}
`;

const FieldItemContent = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FieldLabel = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
`;

const RequiredMark = styled.span`
  font-size: 0.75rem;
  color: hsl(var(--destructive));
`;

const DeleteButton = styled(Button)`
  height: 1.5rem;
  width: 1.5rem;
`;

const ConfigSection = styled.div`
  display: grid;
  gap: 1rem;
`;

const ConfigRow = styled.div`
  display: grid;
  gap: 1rem;
`;

const TextareaStyled = styled.textarea`
  min-height: 6.25rem;
  width: 100%;
  border: 1px solid hsl(var(--input));
  border-radius: calc(var(--radius));
  padding: 0.5rem;
  font-size: 0.875rem;
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));

  &:focus {
    outline: none;
    border-color: hsl(var(--ring));
    box-shadow: 0 0 0 2px hsl(var(--ring) / 0.3);
  }
`;

const HelperText = styled.p`
  font-size: 0.75rem;
  color: hsl(var(--muted-foreground));
`;

const SwitchRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Footer = styled.div`
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
`;

const FieldCount = styled.p`
  font-size: 0.875rem;
  color: hsl(var(--muted-foreground));
`;

export function FormBuilder({}: FormBuilderProps) {
  const { addComponent } = useComponentStore();
  const [formName, setFormName] = useState("新建表单");
  const [fields, setFields] = useState<FormField[]>([
    {
      id: `field-${Date.now()}`,
      type: "text",
      label: "姓名",
      placeholder: "请输入姓名",
      required: true,
    },
  ]);
  const [activeFieldId, setActiveFieldId] = useState<string | null>(
    fields[0]?.id || null
  );

  const addField = () => {
    const newField: FormField = {
      id: `field-${Date.now()}`,
      type: "text",
      label: "新字段",
      placeholder: "请输入",
      required: false,
    };
    setFields([...fields, newField]);
    setActiveFieldId(newField.id);
  };

  const removeField = (id: string) => {
    const newFields = fields.filter((field) => field.id !== id);
    setFields(newFields);
    if (activeFieldId === id) {
      setActiveFieldId(newFields[0]?.id || null);
    }
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(
      fields.map((field) =>
        field.id === id ? { ...field, ...updates } : field
      )
    );
  };

  const generateFormComponents = (): Component[] => {
    const formContainer: Component = {
      id: `form-container-${Date.now()}`,
      type: "container",
      name: formName,
      position: { x: 50, y: 50 },
      properties: {
        width: "400px",
        padding: "20px",
        bgColor: "#ffffff",
      },
      children: [],
    };

    const formTitle = createBaseComponent(
      `form-title-${Date.now()}`,
      "text",
      "表单标题",
      { x: 0, y: 0 },
      {
        content: formName,
        fontSize: 24,
        fontWeight: "bold",
        color: "#000000",
        margin: "0 0 20px 0",
      },
      formContainer.id
    );

    const submitButton = createBaseComponent(
      `submit-button-${Date.now()}`,
      "button",
      "提交按钮",
      { x: 0, y: 0 },
      {
        text: "提交",
        variant: "default",
        size: "default",
        width: "100%",
      },
      formContainer.id
    );

    formContainer.children = [formTitle];

    let yPosition = 60;
    fields.forEach((field) => {
      const fieldComponents = createFieldComponent(
        field,
        yPosition,
        formContainer.id
      );
      formContainer.children!.push(...fieldComponents);

      if (["checkbox", "switch"].includes(field.type)) {
        yPosition += 50;
      } else if (field.type === "textarea") {
        yPosition += 150;
      } else {
        yPosition += 80;
      }
    });

    submitButton.position = { x: 0, y: yPosition };
    formContainer.children!.push(submitButton);

    return [formContainer];
  };

  const activeField = fields.find((field) => field.id === activeFieldId);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <FormInput css={{ marginRight: "0.375rem", width: "1rem", height: "1rem" }} aria-hidden="true" />
          表单构建器
        </Button>
      </DialogTrigger>
      <DialogContent css={{ maxWidth: "56rem" }}>
        <DialogHeader>
          <DialogTitle>表单构建器</DialogTitle>
          <DialogDescription>
            创建自定义表单并添加到您的项目中
          </DialogDescription>
        </DialogHeader>

        <div css={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "1rem" }}>
          <LeftPanel>
            <FormGroup>
              <Label htmlFor="form-name">表单名称</Label>
              <Input
                id="form-name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <div css={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Label>表单字段</Label>
                <Button size="sm" variant="outline" onClick={addField}>
                  <Plus css={{ marginRight: "0.25rem", width: "0.75rem", height: "0.75rem" }} />
                  添加字段
                </Button>
              </div>

              <ScrollArea css={{ height: "18.75rem" }}>
                <FieldList>
                  {fields.map((field) => (
                    <FieldItem
                      key={field.id}
                      active={activeFieldId === field.id}
                      onClick={() => setActiveFieldId(field.id)}
                    >
                      <FieldItemContent>
                        <FieldLabel>{field.label}</FieldLabel>
                        {field.required && <RequiredMark>*</RequiredMark>}
                      </FieldItemContent>
                      <DeleteButton
                        size="icon"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeField(field.id);
                        }}
                      >
                        <Trash2 css={{ width: "0.75rem", height: "0.75rem" }} />
                      </DeleteButton>
                    </FieldItem>
                  ))}
                </FieldList>
              </ScrollArea>
            </FormGroup>
          </LeftPanel>

          <RightPanel>
            {activeField ? (
              <Tabs defaultValue="basic">
                <TabsList css={{ width: "100%" }}>
                  <TabsTrigger value="basic" css={{ flex: 1 }}>基本设置</TabsTrigger>
                  <TabsTrigger value="validation" css={{ flex: 1 }}>验证规则</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" css={{ display: "flex", flexDirection: "column", gap: "1rem", paddingTop: "1rem" }}>
                  <ConfigSection>
                    <FormGroup>
                      <Label htmlFor="field-label">字段标签</Label>
                      <Input
                        id="field-label"
                        value={activeField.label}
                        onChange={(e) =>
                          updateField(activeField.id, { label: e.target.value })
                        }
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label htmlFor="field-type">字段类型</Label>
                      <Select
                        value={activeField.type}
                        onValueChange={(value: any) =>
                          updateField(activeField.id, { type: value })
                        }
                      >
                        <SelectTrigger id="field-type">
                          <SelectValue placeholder="选择字段类型" />
                        </SelectTrigger>
                        <SelectContent>
                          {FIELD_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormGroup>

                    {[
                      "text",
                      "email",
                      "password",
                      "number",
                      "textarea",
                    ].includes(activeField.type) && (
                      <FormGroup>
                        <Label htmlFor="field-placeholder">占位文本</Label>
                        <Input
                          id="field-placeholder"
                          value={activeField.placeholder || ""}
                          onChange={(e) =>
                            updateField(activeField.id, {
                              placeholder: e.target.value,
                            })
                          }
                        />
                      </FormGroup>
                    )}

                    {["select", "radio"].includes(activeField.type) && (
                      <FormGroup>
                        <Label htmlFor="field-options">选项（每行一个）</Label>
                        <TextareaStyled
                          id="field-options"
                          value={(activeField.options || []).join("\n")}
                          onChange={(e) =>
                            updateField(activeField.id, {
                              options: e.target.value
                                .split("\n")
                                .filter(Boolean),
                            })
                          }
                        />
                      </FormGroup>
                    )}

                    {activeField.type === "switch" && (
                      <SwitchRow>
                        <Checkbox
                          id="field-checked"
                          checked={activeField.checked || false}
                          onCheckedChange={(checked) =>
                            updateField(activeField.id, { checked: !!checked })
                          }
                        />
                        <Label htmlFor="field-checked">默认开启</Label>
                      </SwitchRow>
                    )}

                    {activeField.type === "slider" && (
                      <ConfigRow css={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
                        <FormGroup>
                          <Label htmlFor="field-min">最小值</Label>
                          <Input
                            id="field-min"
                            type="number"
                            value={activeField.min || 0}
                            onChange={(e) =>
                              updateField(activeField.id, {
                                min: Number.parseInt(e.target.value) || 0,
                              })
                            }
                          />
                        </FormGroup>
                        <FormGroup>
                          <Label htmlFor="field-max">最大值</Label>
                          <Input
                            id="field-max"
                            type="number"
                            value={activeField.max || 100}
                            onChange={(e) =>
                              updateField(activeField.id, {
                                max: Number.parseInt(e.target.value) || 100,
                              })
                            }
                          />
                        </FormGroup>
                        <FormGroup>
                          <Label htmlFor="field-step">步长</Label>
                          <Input
                            id="field-step"
                            type="number"
                            value={activeField.step || 1}
                            onChange={(e) =>
                              updateField(activeField.id, {
                                step: Number.parseInt(e.target.value) || 1,
                              })
                            }
                          />
                        </FormGroup>
                      </ConfigRow>
                    )}

                    {activeField.type === "file-upload" && (
                      <ConfigSection>
                        <SwitchRow>
                          <Checkbox
                            id="field-multiple"
                            checked={activeField.multiple || false}
                            onCheckedChange={(checked) =>
                              updateField(activeField.id, {
                                multiple: !!checked,
                              })
                            }
                          />
                          <Label htmlFor="field-multiple">允许多文件</Label>
                        </SwitchRow>
                        <FormGroup>
                          <Label htmlFor="field-accept">文件类型</Label>
                          <Input
                            id="field-accept"
                            value={activeField.accept || "*"}
                            onChange={(e) =>
                              updateField(activeField.id, {
                                accept: e.target.value,
                              })
                            }
                            placeholder="例如: .jpg,.png,.pdf"
                          />
                          <HelperText>
                            用逗号分隔文件扩展名，* 表示所有类型
                          </HelperText>
                        </FormGroup>
                        <FormGroup>
                          <Label htmlFor="field-max-size">最大文件大小</Label>
                          <Input
                            id="field-max-size"
                            value={activeField.maxSize || ""}
                            onChange={(e) =>
                              updateField(activeField.id, {
                                maxSize: e.target.value,
                              })
                            }
                            placeholder="例如: 10MB"
                          />
                        </FormGroup>
                      </ConfigSection>
                    )}

                    <SwitchRow>
                      <Checkbox
                        id="field-required"
                        checked={activeField.required || false}
                        onCheckedChange={(checked) =>
                          updateField(activeField.id, { required: !!checked })
                        }
                      />
                      <Label htmlFor="field-required">必填字段</Label>
                    </SwitchRow>
                  </ConfigSection>
                </TabsContent>

                <TabsContent value="validation" css={{ display: "flex", flexDirection: "column", gap: "1rem", paddingTop: "1rem" }}>
                  <ConfigSection>
                    {["text", "email", "password"].includes(
                      activeField.type
                    ) && (
                      <>
                        <FormGroup>
                          <Label htmlFor="field-pattern">正则表达式</Label>
                          <Input
                            id="field-pattern"
                            value={activeField.validation?.pattern || ""}
                            onChange={(e) =>
                              updateField(activeField.id, {
                                validation: {
                                  ...activeField.validation,
                                  pattern: e.target.value,
                                },
                              })
                            }
                            placeholder="例如: ^[A-Za-z0-9]+$"
                          />
                          <HelperText>
                            用于验证输入格式的正则表达式
                          </HelperText>
                        </FormGroup>

                        <ConfigRow css={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
                          <FormGroup>
                            <Label htmlFor="field-min-length">最小长度</Label>
                            <Input
                              id="field-min-length"
                              type="number"
                              value={activeField.validation?.minLength || ""}
                              onChange={(e) =>
                                updateField(activeField.id, {
                                  validation: {
                                    ...activeField.validation,
                                    minLength:
                                      Number.parseInt(e.target.value) ||
                                      undefined,
                                  },
                                })
                              }
                            />
                          </FormGroup>
                          <FormGroup>
                            <Label htmlFor="field-max-length">最大长度</Label>
                            <Input
                              id="field-max-length"
                              type="number"
                              value={activeField.validation?.maxLength || ""}
                              onChange={(e) =>
                                updateField(activeField.id, {
                                  validation: {
                                    ...activeField.validation,
                                    maxLength:
                                      Number.parseInt(e.target.value) ||
                                      undefined,
                                  },
                                })
                              }
                            />
                          </FormGroup>
                        </ConfigRow>
                      </>
                    )}

                    {activeField.type === "number" && (
                      <ConfigRow css={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
                        <FormGroup>
                          <Label htmlFor="field-min">最小值</Label>
                          <Input
                            id="field-min"
                            type="number"
                            value={activeField.validation?.min || ""}
                            onChange={(e) =>
                              updateField(activeField.id, {
                                validation: {
                                  ...activeField.validation,
                                  min:
                                    Number.parseInt(e.target.value) ||
                                    undefined,
                                },
                              })
                            }
                          />
                        </FormGroup>
                        <FormGroup>
                          <Label htmlFor="field-max">最大值</Label>
                          <Input
                            id="field-max"
                            type="number"
                            value={activeField.validation?.max || ""}
                            onChange={(e) =>
                              updateField(activeField.id, {
                                validation: {
                                  ...activeField.validation,
                                  max:
                                    Number.parseInt(e.target.value) ||
                                    undefined,
                                },
                              })
                            }
                          />
                        </FormGroup>
                      </ConfigRow>
                    )}

                    {["email", "password"].includes(activeField.type) && (
                      <Card>
                        <CardHeader>
                          <CardTitle css={{ fontSize: "0.875rem" }}>内置验证</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p css={{ fontSize: "0.875rem", color: "hsl(var(--muted-foreground))" }}>
                            {activeField.type === "email" &&
                              "此字段将自动验证电子邮件格式"}
                            {activeField.type === "password" &&
                              "密码字段将自动隐藏输入内容"}
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </ConfigSection>
                </TabsContent>
              </Tabs>
            ) : (
              <div css={{ display: "flex", height: "100%", alignItems: "center", justifyContent: "center" }}>
                <p css={{ color: "hsl(var(--muted-foreground))" }}>选择一个字段进行编辑</p>
              </div>
            )}
          </RightPanel>
        </div>

        <Footer>
          <FieldCount>
            {fields.length} 个字段 | {fields.filter((f) => f.required).length}{" "}
            个必填
          </FieldCount>
          <Button
            onClick={() => {
              const formComponents = generateFormComponents();
              formComponents.forEach((component) => {
                addComponent(component);
              });
            }}
          >
            添加到画布
          </Button>
        </Footer>
      </DialogContent>
    </Dialog>
  );
}
