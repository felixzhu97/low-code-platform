"use client";

import { useState } from "react";
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

import { Component } from "@/domain/entities/types";
import { useComponentStore } from "@/shared/stores";

interface FormBuilderProps {
  // 移除 props，现在从 store 获取状态
}

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

// 字段类型配置
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

// 工具函数：创建基础组件
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

// 工具函数：创建字段组件
const createFieldComponent = (
  field: FormField,
  yPosition: number,
  parentId: string
): Component[] => {
  const components: Component[] = [];
  const yInputPosition = yPosition + 30;

  // 创建标签组件（checkbox和switch除外）
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

  // 创建输入组件
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

export function FormBuilder({}: FormBuilderProps) {
  // 从 store 获取状态
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
    // 创建表单容器
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

    // 添加表单标题
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

    // 添加提交按钮
    const submitButton = createBaseComponent(
      `submit-button-${Date.now()}`,
      "button",
      "提交按钮",
      { x: 0, y: 0 }, // 位置将在后面计算
      {
        text: "提交",
        variant: "default",
        size: "default",
        width: "100%",
      },
      formContainer.id
    );

    formContainer.children = [formTitle];

    // 为每个字段创建组件
    let yPosition = 60;
    fields.forEach((field) => {
      const fieldComponents = createFieldComponent(
        field,
        yPosition,
        formContainer.id
      );
      formContainer.children!.push(...fieldComponents);

      // 更新y位置
      if (["checkbox", "switch"].includes(field.type)) {
        yPosition += 50;
      } else if (field.type === "textarea") {
        yPosition += 150;
      } else {
        yPosition += 80;
      }
    });

    // 设置提交按钮位置
    submitButton.position = { x: 0, y: yPosition };
    formContainer.children!.push(submitButton);

    return [formContainer];
  };

  const activeField = fields.find((field) => field.id === activeFieldId);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <FormInput className="mr-2 h-4 w-4" />
          表单构建器
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>表单构建器</DialogTitle>
          <DialogDescription>
            创建自定义表单并添加到您的项目中
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-4">
          {/* 左侧：表单设置 */}
          <div className="col-span-1 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="form-name">表单名称</Label>
              <Input
                id="form-name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>表单字段</Label>
                <Button size="sm" variant="outline" onClick={addField}>
                  <Plus className="mr-1 h-3 w-3" /> 添加字段
                </Button>
              </div>

              <ScrollArea className="h-[300px]">
                <div className="space-y-2 pr-4">
                  {fields.map((field) => (
                    <div
                      key={field.id}
                      className={`flex items-center justify-between rounded-md border p-2 cursor-pointer ${
                        activeFieldId === field.id
                          ? "border-primary bg-primary/5"
                          : ""
                      }`}
                      onClick={() => setActiveFieldId(field.id)}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {field.label}
                        </span>
                        {field.required && (
                          <span className="text-xs text-red-500">*</span>
                        )}
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeField(field.id);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* 右侧：字段配置 */}
          <div className="col-span-2 rounded-md border p-4">
            {activeField ? (
              <Tabs defaultValue="basic">
                <TabsList className="w-full">
                  <TabsTrigger value="basic" className="flex-1">
                    基本设置
                  </TabsTrigger>
                  <TabsTrigger value="validation" className="flex-1">
                    验证规则
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4 py-4">
                  <div className="grid gap-4">
                    {/* 基本字段配置 */}
                    <div className="grid gap-2">
                      <Label htmlFor="field-label">字段标签</Label>
                      <Input
                        id="field-label"
                        value={activeField.label}
                        onChange={(e) =>
                          updateField(activeField.id, { label: e.target.value })
                        }
                      />
                    </div>

                    <div className="grid gap-2">
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
                    </div>

                    {/* 占位文本 */}
                    {[
                      "text",
                      "email",
                      "password",
                      "number",
                      "textarea",
                    ].includes(activeField.type) && (
                      <div className="grid gap-2">
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
                      </div>
                    )}

                    {/* 选项配置 */}
                    {["select", "radio"].includes(activeField.type) && (
                      <div className="grid gap-2">
                        <Label htmlFor="field-options">选项（每行一个）</Label>
                        <textarea
                          id="field-options"
                          className="min-h-[100px] w-full rounded-md border p-2"
                          value={(activeField.options || []).join("\n")}
                          onChange={(e) =>
                            updateField(activeField.id, {
                              options: e.target.value
                                .split("\n")
                                .filter(Boolean),
                            })
                          }
                        />
                      </div>
                    )}

                    {/* 开关默认状态 */}
                    {activeField.type === "switch" && (
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="field-checked"
                          checked={activeField.checked || false}
                          onCheckedChange={(checked) =>
                            updateField(activeField.id, { checked: !!checked })
                          }
                        />
                        <Label htmlFor="field-checked">默认开启</Label>
                      </div>
                    )}

                    {/* 滑块配置 */}
                    {activeField.type === "slider" && (
                      <div className="grid grid-cols-3 gap-4">
                        <div className="grid gap-2">
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
                        </div>
                        <div className="grid gap-2">
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
                        </div>
                        <div className="grid gap-2">
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
                        </div>
                      </div>
                    )}

                    {/* 文件上传配置 */}
                    {activeField.type === "file-upload" && (
                      <div className="grid gap-4">
                        <div className="flex items-center gap-2">
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
                        </div>
                        <div className="grid gap-2">
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
                          <p className="text-xs text-muted-foreground">
                            用逗号分隔文件扩展名，* 表示所有类型
                          </p>
                        </div>
                        <div className="grid gap-2">
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
                        </div>
                      </div>
                    )}

                    {/* 必填字段 */}
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="field-required"
                        checked={activeField.required || false}
                        onCheckedChange={(checked) =>
                          updateField(activeField.id, { required: !!checked })
                        }
                      />
                      <Label htmlFor="field-required">必填字段</Label>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="validation" className="space-y-4 py-4">
                  <div className="grid gap-4">
                    {/* 文本验证 */}
                    {["text", "email", "password"].includes(
                      activeField.type
                    ) && (
                      <>
                        <div className="grid gap-2">
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
                          <p className="text-xs text-muted-foreground">
                            用于验证输入格式的正则表达式
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
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
                          </div>
                          <div className="grid gap-2">
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
                          </div>
                        </div>
                      </>
                    )}

                    {/* 数字验证 */}
                    {activeField.type === "number" && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
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
                        </div>
                        <div className="grid gap-2">
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
                        </div>
                      </div>
                    )}

                    {/* 内置验证提示 */}
                    {["email", "password"].includes(activeField.type) && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">内置验证</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">
                            {activeField.type === "email" &&
                              "此字段将自动验证电子邮件格式"}
                            {activeField.type === "password" &&
                              "密码字段将自动隐藏输入内容"}
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-muted-foreground">选择一个字段进行编辑</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 flex justify-between">
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">
              {fields.length} 个字段 | {fields.filter((f) => f.required).length}{" "}
              个必填
            </p>
          </div>
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
