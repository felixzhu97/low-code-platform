"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/presentation/components/ui/dialog";
import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import { Label } from "@/presentation/components/ui/label";
import { Checkbox } from "@/presentation/components/ui/checkbox";
import { ScrollArea } from "@/presentation/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/presentation/components/ui/select";
import { FormInput, Plus, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/presentation/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/presentation/components/ui/tabs";

import { Component } from "@/domain/entities/types";

interface FormBuilderProps {
  onAddForm: (components: Component[]) => void;
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
  // 新增属性
  checked?: boolean;
  min?: number;
  max?: number;
  step?: number;
  multiple?: boolean;
  accept?: string;
  maxSize?: string;
};

export function FormBuilder({ onAddForm }: FormBuilderProps) {
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
      fields.map((field) => {
        if (field.id === id) {
          return { ...field, ...updates };
        }
        return field;
      })
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
    const formTitle: Component = {
      id: `form-title-${Date.now()}`,
      type: "text",
      name: "表单标题",
      position: { x: 0, y: 0 },
      properties: {
        content: formName,
        fontSize: 24,
        fontWeight: "bold",
        color: "#000000",
        margin: "0 0 20px 0",
      },
      parentId: formContainer.id,
    };

    formContainer.children = [formTitle];

    // 为每个字段创建组件
    let yPosition = 60;
    fields.forEach((field) => {
      // 创建输入组件
      let inputComponent: Component;
      const yInputPosition = yPosition + 30;

      switch (field.type) {
        case "text":
        case "email":
        case "password":
        case "number":
          inputComponent = {
            id: `input-${field.id}`,
            type: "input",
            name: "输入框",
            position: { x: 0, y: yInputPosition },
            properties: {
              placeholder: field.placeholder || "",
              required: field.required || false,
              type: field.type,
              width: "100%",
              validation: field.validation,
            },
            parentId: formContainer.id,
          };
          break;
        case "textarea":
          inputComponent = {
            id: `textarea-${field.id}`,
            type: "textarea",
            name: "文本域",
            position: { x: 0, y: yInputPosition },
            properties: {
              placeholder: field.placeholder || "",
              required: field.required || false,
              width: "100%",
              height: "100px",
              validation: field.validation,
            },
            parentId: formContainer.id,
          };
          break;
        case "select":
          inputComponent = {
            id: `select-${field.id}`,
            type: "select",
            name: "下拉选择",
            position: { x: 0, y: yInputPosition },
            properties: {
              placeholder: "请选择",
              required: field.required || false,
              options: field.options || [],
              width: "100%",
            },
            parentId: formContainer.id,
          };
          break;
        case "checkbox":
          // 复选框组件不需要单独的标签，因为标签已经包含在组件内部
          inputComponent = {
            id: `checkbox-${field.id}`,
            type: "checkbox",
            name: "复选框",
            position: { x: 0, y: yPosition },
            properties: {
              label: field.label,
              required: field.required || false,
            },
            parentId: formContainer.id,
          };
          if (formContainer.children) {
            formContainer.children.push(inputComponent);
          } else {
            formContainer.children = [inputComponent];
          }
          yPosition += 50;
          return; // 跳过下面的标签和输入组件添加逻辑
        case "radio":
          inputComponent = {
            id: `radio-${field.id}`,
            type: "radio",
            name: "单选框",
            position: { x: 0, y: yInputPosition },
            properties: {
              options: field.options || [],
              required: field.required || false,
            },
            parentId: formContainer.id,
          };
          break;
        case "switch":
          // 开关组件不需要单独的标签，因为标签已经包含在组件内部
          inputComponent = {
            id: `switch-${field.id}`,
            type: "switch",
            name: "开关",
            position: { x: 0, y: yPosition },
            properties: {
              label: field.label,
              checked: field.checked || false,
              required: field.required || false,
            },
            parentId: formContainer.id,
          };
          if (formContainer.children) {
            formContainer.children.push(inputComponent);
          } else {
            formContainer.children = [inputComponent];
          }
          yPosition += 50;
          return; // 跳过下面的标签和输入组件添加逻辑
        case "slider":
          inputComponent = {
            id: `slider-${field.id}`,
            type: "slider",
            name: "滑块",
            position: { x: 0, y: yInputPosition },
            properties: {
              min: field.min || 0,
              max: field.max || 100,
              step: field.step || 1,
              defaultValue: [50],
              required: field.required || false,
            },
            parentId: formContainer.id,
          };
          break;
        case "date-picker":
          inputComponent = {
            id: `date-picker-${field.id}`,
            type: "date-picker",
            name: "日期选择器",
            position: { x: 0, y: yInputPosition },
            properties: {
              placeholder: field.placeholder || "选择日期",
              required: field.required || false,
            },
            parentId: formContainer.id,
          };
          break;
        case "time-picker":
          inputComponent = {
            id: `time-picker-${field.id}`,
            type: "time-picker",
            name: "时间选择器",
            position: { x: 0, y: yInputPosition },
            properties: {
              placeholder: field.placeholder || "选择时间",
              required: field.required || false,
            },
            parentId: formContainer.id,
          };
          break;
        case "file-upload":
          inputComponent = {
            id: `file-upload-${field.id}`,
            type: "file-upload",
            name: "文件上传",
            position: { x: 0, y: yInputPosition },
            properties: {
              multiple: field.multiple || false,
              accept: field.accept || "*",
              maxSize: field.maxSize || "",
              required: field.required || false,
            },
            parentId: formContainer.id,
          };
          break;
        default:
          inputComponent = {
            id: `input-${field.id}`,
            type: "input",
            name: "输入框",
            position: { x: 0, y: yInputPosition },
            properties: {
              placeholder: field.placeholder || "",
              required: field.required || false,
              width: "100%",
            },
            parentId: formContainer.id,
          };
      }

      // 创建标签（除了checkbox和switch，它们已经包含标签）
      const labelComponent: Component = {
        id: `label-${field.id}`,
        type: "text",
        name: "字段标签",
        position: { x: 0, y: yPosition },
        properties: {
          content: `${field.label}${field.required ? " *" : ""}`,
          fontSize: 14,
          fontWeight: "medium",
          color: "#000000",
          margin: "0 0 8px 0",
        },
        parentId: formContainer.id,
      };

      if (formContainer.children) {
        formContainer.children.push(labelComponent, inputComponent);
      } else {
        formContainer.children = [labelComponent, inputComponent];
      }
      yPosition += field.type === "textarea" ? 150 : 80;
    });

    // 添加提交按钮
    const submitButton: Component = {
      id: `submit-button-${Date.now()}`,
      type: "button",
      name: "提交按钮",
      position: { x: 0, y: yPosition },
      properties: {
        text: "提交",
        variant: "default",
        size: "default",
        width: "100%",
      },
      parentId: formContainer.id,
    };

    if (formContainer.children) {
      formContainer.children.push(submitButton);
    } else {
      formContainer.children = [submitButton];
    }

    return [formContainer];
  };

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
                      className={`flex items-center justify-between rounded-md border p-2 ${
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

          <div className="col-span-2 rounded-md border p-4">
            {activeFieldId ? (
              <Tabs defaultValue="basic">
                <TabsList className="w-full">
                  <TabsTrigger value="basic" className="flex-1">
                    基本设置
                  </TabsTrigger>
                  <TabsTrigger value="validation" className="flex-1">
                    验证规则
                  </TabsTrigger>
                </TabsList>

                {fields
                  .filter((field) => field.id === activeFieldId)
                  .map((field) => (
                    <div key={field.id}>
                      <TabsContent value="basic" className="space-y-4 py-4">
                        <div className="grid gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="field-label">字段标签</Label>
                            <Input
                              id="field-label"
                              value={field.label}
                              onChange={(e) =>
                                updateField(field.id, { label: e.target.value })
                              }
                            />
                          </div>

                          <div className="grid gap-2">
                            <Label htmlFor="field-type">字段类型</Label>
                            <Select
                              value={field.type}
                              onValueChange={(value: any) =>
                                updateField(field.id, { type: value })
                              }
                            >
                              <SelectTrigger id="field-type">
                                <SelectValue placeholder="选择字段类型" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="text">文本</SelectItem>
                                <SelectItem value="email">邮箱</SelectItem>
                                <SelectItem value="password">密码</SelectItem>
                                <SelectItem value="number">数字</SelectItem>
                                <SelectItem value="textarea">文本域</SelectItem>
                                <SelectItem value="select">下拉选择</SelectItem>
                                <SelectItem value="checkbox">复选框</SelectItem>
                                <SelectItem value="radio">单选框</SelectItem>
                                <SelectItem value="switch">开关</SelectItem>
                                <SelectItem value="slider">滑块</SelectItem>
                                <SelectItem value="date-picker">
                                  日期选择器
                                </SelectItem>
                                <SelectItem value="time-picker">
                                  时间选择器
                                </SelectItem>
                                <SelectItem value="file-upload">
                                  文件上传
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {(field.type === "text" ||
                            field.type === "email" ||
                            field.type === "password" ||
                            field.type === "number" ||
                            field.type === "textarea") && (
                            <div className="grid gap-2">
                              <Label htmlFor="field-placeholder">
                                占位文本
                              </Label>
                              <Input
                                id="field-placeholder"
                                value={field.placeholder || ""}
                                onChange={(e) =>
                                  updateField(field.id, {
                                    placeholder: e.target.value,
                                  })
                                }
                              />
                            </div>
                          )}

                          {(field.type === "select" ||
                            field.type === "radio") && (
                            <div className="grid gap-2">
                              <Label htmlFor="field-options">
                                选项（每行一个）
                              </Label>
                              <textarea
                                id="field-options"
                                className="min-h-[100px] w-full rounded-md border p-2"
                                value={(field.options || []).join("\n")}
                                onChange={(e) =>
                                  updateField(field.id, {
                                    options: e.target.value
                                      .split("\n")
                                      .filter(Boolean),
                                  })
                                }
                              />
                            </div>
                          )}

                          {field.type === "switch" && (
                            <div className="flex items-center gap-2">
                              <Checkbox
                                id="field-checked"
                                checked={field.checked || false}
                                onCheckedChange={(checked) =>
                                  updateField(field.id, { checked: !!checked })
                                }
                              />
                              <Label htmlFor="field-checked">默认开启</Label>
                            </div>
                          )}

                          {field.type === "slider" && (
                            <div className="grid grid-cols-3 gap-4">
                              <div className="grid gap-2">
                                <Label htmlFor="field-min">最小值</Label>
                                <Input
                                  id="field-min"
                                  type="number"
                                  value={field.min || 0}
                                  onChange={(e) =>
                                    updateField(field.id, {
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
                                  value={field.max || 100}
                                  onChange={(e) =>
                                    updateField(field.id, {
                                      max:
                                        Number.parseInt(e.target.value) || 100,
                                    })
                                  }
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="field-step">步长</Label>
                                <Input
                                  id="field-step"
                                  type="number"
                                  value={field.step || 1}
                                  onChange={(e) =>
                                    updateField(field.id, {
                                      step:
                                        Number.parseInt(e.target.value) || 1,
                                    })
                                  }
                                />
                              </div>
                            </div>
                          )}

                          {field.type === "file-upload" && (
                            <div className="grid gap-4">
                              <div className="flex items-center gap-2">
                                <Checkbox
                                  id="field-multiple"
                                  checked={field.multiple || false}
                                  onCheckedChange={(checked) =>
                                    updateField(field.id, {
                                      multiple: !!checked,
                                    })
                                  }
                                />
                                <Label htmlFor="field-multiple">
                                  允许多文件
                                </Label>
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="field-accept">文件类型</Label>
                                <Input
                                  id="field-accept"
                                  value={field.accept || "*"}
                                  onChange={(e) =>
                                    updateField(field.id, {
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
                                <Label htmlFor="field-max-size">
                                  最大文件大小
                                </Label>
                                <Input
                                  id="field-max-size"
                                  value={field.maxSize || ""}
                                  onChange={(e) =>
                                    updateField(field.id, {
                                      maxSize: e.target.value,
                                    })
                                  }
                                  placeholder="例如: 10MB"
                                />
                              </div>
                            </div>
                          )}

                          <div className="flex items-center gap-2">
                            <Checkbox
                              id="field-required"
                              checked={field.required || false}
                              onCheckedChange={(checked) =>
                                updateField(field.id, { required: !!checked })
                              }
                            />
                            <Label htmlFor="field-required">必填字段</Label>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent
                        value="validation"
                        className="space-y-4 py-4"
                      >
                        <div className="grid gap-4">
                          {(field.type === "text" ||
                            field.type === "email" ||
                            field.type === "password") && (
                            <>
                              <div className="grid gap-2">
                                <Label htmlFor="field-pattern">
                                  正则表达式
                                </Label>
                                <Input
                                  id="field-pattern"
                                  value={field.validation?.pattern || ""}
                                  onChange={(e) =>
                                    updateField(field.id, {
                                      validation: {
                                        ...field.validation,
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
                                  <Label htmlFor="field-min-length">
                                    最小长度
                                  </Label>
                                  <Input
                                    id="field-min-length"
                                    type="number"
                                    value={field.validation?.minLength || ""}
                                    onChange={(e) =>
                                      updateField(field.id, {
                                        validation: {
                                          ...field.validation,
                                          minLength:
                                            Number.parseInt(e.target.value) ||
                                            undefined,
                                        },
                                      })
                                    }
                                  />
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor="field-max-length">
                                    最大长度
                                  </Label>
                                  <Input
                                    id="field-max-length"
                                    type="number"
                                    value={field.validation?.maxLength || ""}
                                    onChange={(e) =>
                                      updateField(field.id, {
                                        validation: {
                                          ...field.validation,
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

                          {field.type === "number" && (
                            <div className="grid grid-cols-2 gap-4">
                              <div className="grid gap-2">
                                <Label htmlFor="field-min">最小值</Label>
                                <Input
                                  id="field-min"
                                  type="number"
                                  value={field.validation?.min || ""}
                                  onChange={(e) =>
                                    updateField(field.id, {
                                      validation: {
                                        ...field.validation,
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
                                  value={field.validation?.max || ""}
                                  onChange={(e) =>
                                    updateField(field.id, {
                                      validation: {
                                        ...field.validation,
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

                          {(field.type === "email" ||
                            field.type === "password") && (
                            <Card>
                              <CardHeader>
                                <CardTitle className="text-sm">
                                  内置验证
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <p className="text-sm text-muted-foreground">
                                  {field.type === "email" &&
                                    "此字段将自动验证电子邮件格式"}
                                  {field.type === "password" &&
                                    "密码字段将自动隐藏输入内容"}
                                </p>
                              </CardContent>
                            </Card>
                          )}
                        </div>
                      </TabsContent>
                    </div>
                  ))}
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
          <Button onClick={() => onAddForm(generateFormComponents())}>
            添加到画布
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
