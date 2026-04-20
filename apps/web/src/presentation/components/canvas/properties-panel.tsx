"use client";

import { useState, useEffect, memo } from "react";
import {
  Input,
  Label,
  Switch,
  Slider,
  ScrollArea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  ColorPicker,
} from "@/presentation/components/ui";

import { useComponentStore } from "@/infrastructure/state-management/stores";
import { useDataBinding } from "@/presentation/hooks/use-data-binding";
import {
  DataSourceSelector,
  BoundDataEditor,
} from "@/presentation/components/data-binding";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

const panelShell = css`
  width: 20rem;
  border-left: 1px solid hsl(var(--border));
`;

const padded = css`
  padding: 1rem;
`;

const panelTitle = css`
  font-size: 1.125rem;
  line-height: 1.75rem;
  font-weight: 600;
`;

const mutedLead = css`
  margin-top: 0.25rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: hsl(var(--muted-foreground));
`;

const mutedLeadSpaced = css`
  margin-top: 1rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: hsl(var(--muted-foreground));
`;

const sectionGrid = css`
  display: grid;
  gap: 1rem;
`;

const fieldGrid = css`
  display: grid;
  gap: 0.5rem;
`;

const flexRow = css`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const dataStack = css`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const bindStatusRow = css`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  line-height: 1rem;
  color: hsl(var(--muted-foreground));
  padding-left: 0.25rem;
  padding-right: 0.25rem;
`;

const bindStatusDot = css`
  width: 0.375rem;
  height: 0.375rem;
  border-radius: 9999px;
  background-color: rgb(34 197 94);
`;

const valueSpan8 = css`
  width: 2rem;
  text-align: right;
`;

const valueSpan12 = css`
  width: 3rem;
  text-align: right;
`;

const PropsScrollArea = styled(ScrollArea)`
  height: calc(100vh - 12rem);
`;

const tabsBarWrap = css`
  padding: 0 1rem 0.75rem;
`;

const FullTabsList = styled(TabsList)`
  width: 100%;
  height: 2.25rem;
  border-radius: 0.5rem;
  padding: 0.1875rem;
  background-color: hsl(var(--muted) / 0.6);
`;

const EqualTabTrigger = styled(TabsTrigger)`
  flex: 1;
  font-size: 0.8125rem;
  font-weight: 500;
  padding: 0.3125rem 0.5rem;
  border-radius: 0.375rem;

  &[data-state="active"] {
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
  }
`;

const accordionPanel = css`
  margin-top: 0.25rem;
  padding-top: 0.5rem;
  border-top: 1px solid hsl(var(--border) / 0.6);
`;

const FlexSlider = styled(Slider)`
  flex: 1;
`;

export const PropertiesPanel = memo(() => {
  const { selectedComponent, updateComponent } = useComponentStore();
  const [properties, setProperties] = useState<any>({});

  // 数据绑定相关
  const {
    dataSources,
    currentDataSource,
    currentBoundData,
    bindDataSource,
    createDataSourceFromJson,
    renderDataToComponent,
    updateComponentBoundData,
  } = useDataBinding({
    componentId: selectedComponent?.id || null,
  });

  useEffect(() => {
    if (selectedComponent?.properties) {
      setProperties(selectedComponent.properties);
    } else if (selectedComponent) {
      // Set default properties based on component type
      switch (selectedComponent.type) {
        case "text":
          setProperties({
            content: "示例文本",
            fontSize: 16,
            fontWeight: "normal",
            color: "#000000",
            alignment: "left",
            lineHeight: 1.5,
            letterSpacing: "normal",
            textTransform: "none",
            textDecoration: "none",
          });
          break;
        case "button":
          setProperties({
            text: "按钮",
            variant: "default",
            size: "default",
            disabled: false,
            icon: "",
            iconPosition: "left",
            fullWidth: false,
            onClick: "none",
          });
          break;
        case "image":
          setProperties({
            src: "/placeholder.svg?height=200&width=300",
            alt: "示例图片",
            width: 300,
            height: 200,
            objectFit: "cover",
            rounded: false,
            shadow: false,
            border: false,
            caption: "",
          });
          break;
        case "divider":
          setProperties({
            orientation: "horizontal",
            thickness: 1,
            color: "#e2e8f0",
            margin: "1rem 0",
            style: "solid",
          });
          break;
        case "input":
          setProperties({
            placeholder: "请输入...",
            disabled: false,
            required: false,
            type: "text",
            label: "输入框",
            helperText: "",
            defaultValue: "",
          });
          break;
        case "card":
          setProperties({
            title: "卡片标题",
            shadow: true,
            padding: "1rem",
            border: true,
            rounded: true,
          });
          break;
        case "grid-layout":
          setProperties({
            columns: 3,
            gap: 2,
            autoRows: false,
            rowHeight: "auto",
            width: "100%",
            height: "auto",
          });
          break;
        case "flex-layout":
          setProperties({
            direction: "row",
            wrap: true,
            justifyContent: "start",
            alignItems: "center",
            gap: 2,
            width: "100%",
            height: "auto",
          });
          break;
        case "split-layout":
          setProperties({
            direction: "horizontal",
            splitRatio: 30,
            minSize: 100,
            width: "100%",
            height: "300px",
          });
          break;
        case "tab-layout":
          setProperties({
            tabs: [
              { id: "tab-1", label: "标签1", content: "标签1内容" },
              { id: "tab-2", label: "标签2", content: "标签2内容" },
            ],
            defaultTab: "tab-1",
            width: "100%",
            height: "auto",
          });
          break;
        case "card-group":
          setProperties({
            columns: 3,
            gap: 2,
            width: "100%",
            height: "auto",
          });
          break;
        case "responsive-container":
          setProperties({
            breakpoints: {
              sm: 640,
              md: 768,
              lg: 1024,
              xl: 1280,
            },
            width: "100%",
            height: "auto",
          });
          break;
        default:
          setProperties({});
      }
    } else {
      setProperties({});
    }
  }, [selectedComponent]);

  const handlePropertyChange = (key: string, value: any) => {
    const updatedProperties = { ...properties, [key]: value };
    setProperties(updatedProperties);

    if (selectedComponent) {
      updateComponent(selectedComponent.id, { properties: updatedProperties });
    }
  };

  if (!selectedComponent) {
    return (
      <div css={panelShell}>
        <div css={padded}>
          <h2 css={panelTitle}>属性面板</h2>
          <p css={mutedLeadSpaced}>
            选择一个组件来编辑其属性
          </p>
        </div>
      </div>
    );
  }

  return (
    <div css={panelShell}>
      <div css={padded}>
        <h2 css={panelTitle}>属性面板</h2>
        <p css={mutedLead}>
          {selectedComponent.name} ({selectedComponent.id})
        </p>
      </div>
      <Tabs defaultValue="properties">
        <div css={tabsBarWrap}>
          <FullTabsList>
            <EqualTabTrigger value="properties">
              属性
            </EqualTabTrigger>
            <EqualTabTrigger value="data">
              数据
            </EqualTabTrigger>
            <EqualTabTrigger value="events">
              事件
            </EqualTabTrigger>
          </FullTabsList>
        </div>

        <TabsContent value="properties">
          <PropsScrollArea>
            <div css={padded}>
              <div css={accordionPanel}>
              <Accordion type="single" collapsible defaultValue="basic">
                <AccordionItem value="basic">
                  <AccordionTrigger>基本属性</AccordionTrigger>
                  <AccordionContent>
                    <div css={sectionGrid}>
                      {selectedComponent.type === "text" && (
                        <>
                          <div css={fieldGrid}>
                            <Label htmlFor="content">文本内容</Label>
                            <Input
                              id="content"
                              value={properties.content || ""}
                              onChange={(e) =>
                                handlePropertyChange("content", e.target.value)
                              }
                            />
                          </div>
                          <div css={fieldGrid}>
                            <Label htmlFor="fontSize">字体大小</Label>
                            <div css={flexRow}>
                              <FlexSlider
                                id="fontSize"
                                min={12}
                                max={36}
                                step={1}
                                value={[properties.fontSize || 16]}
                                onValueChange={(value) =>
                                  handlePropertyChange("fontSize", value[0])
                                }
                              />
                              <span css={valueSpan8}>
                                {properties.fontSize || 16}px
                              </span>
                            </div>
                          </div>
                          <div css={fieldGrid}>
                            <Label htmlFor="fontWeight">字体粗细</Label>
                            <Select
                              value={properties.fontWeight || "normal"}
                              onValueChange={(value) =>
                                handlePropertyChange("fontWeight", value)
                              }
                            >
                              <SelectTrigger id="fontWeight">
                                <SelectValue placeholder="选择字体粗细" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="normal">正常</SelectItem>
                                <SelectItem value="bold">粗体</SelectItem>
                                <SelectItem value="light">细体</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div css={fieldGrid}>
                            <Label htmlFor="color">文本颜色</Label>
                            <ColorPicker
                              color={properties.color || "#000000"}
                              onChange={(color) =>
                                handlePropertyChange("color", color)
                              }
                            />
                          </div>
                          <div css={fieldGrid}>
                            <Label htmlFor="alignment">对齐方式</Label>
                            <Select
                              value={properties.alignment || "left"}
                              onValueChange={(value) =>
                                handlePropertyChange("alignment", value)
                              }
                            >
                              <SelectTrigger id="alignment">
                                <SelectValue placeholder="选择对齐方式" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="left">左对齐</SelectItem>
                                <SelectItem value="center">居中</SelectItem>
                                <SelectItem value="right">右对齐</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div css={fieldGrid}>
                            <Label htmlFor="lineHeight">行高</Label>
                            <div css={flexRow}>
                              <FlexSlider
                                id="lineHeight"
                                min={1}
                                max={3}
                                step={0.1}
                                value={[properties.lineHeight || 1.5]}
                                onValueChange={(value) =>
                                  handlePropertyChange("lineHeight", value[0])
                                }
                              />
                              <span css={valueSpan8}>
                                {properties.lineHeight || 1.5}
                              </span>
                            </div>
                          </div>
                          <div css={fieldGrid}>
                            <Label htmlFor="textTransform">文本转换</Label>
                            <Select
                              value={properties.textTransform || "none"}
                              onValueChange={(value) =>
                                handlePropertyChange("textTransform", value)
                              }
                            >
                              <SelectTrigger id="textTransform">
                                <SelectValue placeholder="选择文本转换" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">无</SelectItem>
                                <SelectItem value="uppercase">大写</SelectItem>
                                <SelectItem value="lowercase">小写</SelectItem>
                                <SelectItem value="capitalize">
                                  首字母大写
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div css={fieldGrid}>
                            <Label htmlFor="textDecoration">文本装饰</Label>
                            <Select
                              value={properties.textDecoration || "none"}
                              onValueChange={(value) =>
                                handlePropertyChange("textDecoration", value)
                              }
                            >
                              <SelectTrigger id="textDecoration">
                                <SelectValue placeholder="选择文本装饰" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">无</SelectItem>
                                <SelectItem value="underline">
                                  下划线
                                </SelectItem>
                                <SelectItem value="line-through">
                                  删除线
                                </SelectItem>
                                <SelectItem value="overline">上划线</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </>
                      )}

                      {selectedComponent.type === "button" && (
                        <>
                          <div css={fieldGrid}>
                            <Label htmlFor="text">按钮文本</Label>
                            <Input
                              id="text"
                              value={properties.text || ""}
                              onChange={(e) =>
                                handlePropertyChange("text", e.target.value)
                              }
                            />
                          </div>
                          <div css={fieldGrid}>
                            <Label htmlFor="variant">样式变体</Label>
                            <Select
                              value={properties.variant || "default"}
                              onValueChange={(value) =>
                                handlePropertyChange("variant", value)
                              }
                            >
                              <SelectTrigger id="variant">
                                <SelectValue placeholder="选择样式变体" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="default">默认</SelectItem>
                                <SelectItem value="outline">轮廓</SelectItem>
                                <SelectItem value="secondary">次要</SelectItem>
                                <SelectItem value="ghost">幽灵</SelectItem>
                                <SelectItem value="destructive">
                                  危险
                                </SelectItem>
                                <SelectItem value="link">链接</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div css={fieldGrid}>
                            <Label htmlFor="size">尺寸</Label>
                            <Select
                              value={properties.size || "default"}
                              onValueChange={(value) =>
                                handlePropertyChange("size", value)
                              }
                            >
                              <SelectTrigger id="size">
                                <SelectValue placeholder="选择尺寸" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="default">默认</SelectItem>
                                <SelectItem value="sm">小</SelectItem>
                                <SelectItem value="lg">大</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div css={flexRow}>
                            <Label htmlFor="disabled">禁用</Label>
                            <Switch
                              id="disabled"
                              checked={properties.disabled || false}
                              onCheckedChange={(checked) =>
                                handlePropertyChange("disabled", checked)
                              }
                            />
                          </div>
                          <div css={flexRow}>
                            <Label htmlFor="fullWidth">全宽</Label>
                            <Switch
                              id="fullWidth"
                              checked={properties.fullWidth || false}
                              onCheckedChange={(checked) =>
                                handlePropertyChange("fullWidth", checked)
                              }
                            />
                          </div>
                          <div css={fieldGrid}>
                            <Label htmlFor="icon">图标</Label>
                            <Select
                              value={properties.icon || ""}
                              onValueChange={(value) =>
                                handlePropertyChange("icon", value)
                              }
                            >
                              <SelectTrigger id="icon">
                                <SelectValue placeholder="选择图标" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">无</SelectItem>
                                <SelectItem value="plus">加号</SelectItem>
                                <SelectItem value="minus">减号</SelectItem>
                                <SelectItem value="check">对勾</SelectItem>
                                <SelectItem value="x">叉号</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          {properties.icon && (
                            <div css={fieldGrid}>
                              <Label htmlFor="iconPosition">图标位置</Label>
                              <Select
                                value={properties.iconPosition || "left"}
                                onValueChange={(value) =>
                                  handlePropertyChange("iconPosition", value)
                                }
                              >
                                <SelectTrigger id="iconPosition">
                                  <SelectValue placeholder="选择图标位置" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="left">左侧</SelectItem>
                                  <SelectItem value="right">右侧</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                        </>
                      )}

                      {selectedComponent.type === "image" && (
                        <>
                          <div css={fieldGrid}>
                            <Label htmlFor="src">图片地址</Label>
                            <Input
                              id="src"
                              value={properties.src || ""}
                              onChange={(e) =>
                                handlePropertyChange("src", e.target.value)
                              }
                            />
                          </div>
                          <div css={fieldGrid}>
                            <Label htmlFor="alt">替代文本</Label>
                            <Input
                              id="alt"
                              value={properties.alt || ""}
                              onChange={(e) =>
                                handlePropertyChange("alt", e.target.value)
                              }
                            />
                          </div>
                          <div css={fieldGrid}>
                            <Label htmlFor="width">宽度</Label>
                            <div css={flexRow}>
                              <FlexSlider
                                id="width"
                                min={50}
                                max={800}
                                step={10}
                                value={[properties.width || 300]}
                                onValueChange={(value) =>
                                  handlePropertyChange("width", value[0])
                                }
                              />
                              <span css={valueSpan12}>
                                {properties.width || 300}px
                              </span>
                            </div>
                          </div>
                          <div css={fieldGrid}>
                            <Label htmlFor="height">高度</Label>
                            <div css={flexRow}>
                              <FlexSlider
                                id="height"
                                min={50}
                                max={600}
                                step={10}
                                value={[properties.height || 200]}
                                onValueChange={(value) =>
                                  handlePropertyChange("height", value[0])
                                }
                              />
                              <span css={valueSpan12}>
                                {properties.height || 200}px
                              </span>
                            </div>
                          </div>
                          <div css={fieldGrid}>
                            <Label htmlFor="objectFit">填充方式</Label>
                            <Select
                              value={properties.objectFit || "cover"}
                              onValueChange={(value) =>
                                handlePropertyChange("objectFit", value)
                              }
                            >
                              <SelectTrigger id="objectFit">
                                <SelectValue placeholder="选择填充方式" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="cover">
                                  覆盖 (cover)
                                </SelectItem>
                                <SelectItem value="contain">
                                  包含 (contain)
                                </SelectItem>
                                <SelectItem value="fill">
                                  填充 (fill)
                                </SelectItem>
                                <SelectItem value="none">无 (none)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div css={flexRow}>
                            <Label htmlFor="rounded">圆角</Label>
                            <Switch
                              id="rounded"
                              checked={properties.rounded || false}
                              onCheckedChange={(checked) =>
                                handlePropertyChange("rounded", checked)
                              }
                            />
                          </div>
                          <div css={flexRow}>
                            <Label htmlFor="shadow">阴影</Label>
                            <Switch
                              id="shadow"
                              checked={properties.shadow || false}
                              onCheckedChange={(checked) =>
                                handlePropertyChange("shadow", checked)
                              }
                            />
                          </div>
                          <div css={flexRow}>
                            <Label htmlFor="border">边框</Label>
                            <Switch
                              id="border"
                              checked={properties.border || false}
                              onCheckedChange={(checked) =>
                                handlePropertyChange("border", checked)
                              }
                            />
                          </div>
                          <div css={fieldGrid}>
                            <Label htmlFor="caption">图片说明</Label>
                            <Input
                              id="caption"
                              value={properties.caption || ""}
                              onChange={(e) =>
                                handlePropertyChange("caption", e.target.value)
                              }
                            />
                          </div>
                        </>
                      )}

                      {selectedComponent.type === "divider" && (
                        <>
                          <div css={fieldGrid}>
                            <Label htmlFor="orientation">方向</Label>
                            <Select
                              value={properties.orientation || "horizontal"}
                              onValueChange={(value) =>
                                handlePropertyChange("orientation", value)
                              }
                            >
                              <SelectTrigger id="orientation">
                                <SelectValue placeholder="选择方向" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="horizontal">水平</SelectItem>
                                <SelectItem value="vertical">垂直</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div css={fieldGrid}>
                            <Label htmlFor="thickness">粗细</Label>
                            <div css={flexRow}>
                              <FlexSlider
                                id="thickness"
                                min={1}
                                max={10}
                                step={1}
                                value={[properties.thickness || 1]}
                                onValueChange={(value) =>
                                  handlePropertyChange("thickness", value[0])
                                }
                              />
                              <span css={valueSpan8}>
                                {properties.thickness || 1}px
                              </span>
                            </div>
                          </div>
                          <div css={fieldGrid}>
                            <Label htmlFor="color">颜色</Label>
                            <ColorPicker
                              color={properties.color || "#e2e8f0"}
                              onChange={(color) =>
                                handlePropertyChange("color", color)
                              }
                            />
                          </div>
                          <div css={fieldGrid}>
                            <Label htmlFor="margin">外边距</Label>
                            <Input
                              id="margin"
                              value={properties.margin || "1rem 0"}
                              onChange={(e) =>
                                handlePropertyChange("margin", e.target.value)
                              }
                              placeholder="例如: 1rem 0"
                            />
                          </div>
                          <div css={fieldGrid}>
                            <Label htmlFor="style">样式</Label>
                            <Select
                              value={properties.style || "solid"}
                              onValueChange={(value) =>
                                handlePropertyChange("style", value)
                              }
                            >
                              <SelectTrigger id="style">
                                <SelectValue placeholder="选择样式" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="solid">实线</SelectItem>
                                <SelectItem value="dashed">虚线</SelectItem>
                                <SelectItem value="dotted">点线</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </>
                      )}

                      {selectedComponent.type === "input" && (
                        <>
                          <div css={fieldGrid}>
                            <Label htmlFor="label">标签文本</Label>
                            <Input
                              id="label"
                              value={properties.label || ""}
                              onChange={(e) =>
                                handlePropertyChange("label", e.target.value)
                              }
                            />
                          </div>
                          <div css={fieldGrid}>
                            <Label htmlFor="placeholder">占位文本</Label>
                            <Input
                              id="placeholder"
                              value={properties.placeholder || ""}
                              onChange={(e) =>
                                handlePropertyChange(
                                  "placeholder",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div css={fieldGrid}>
                            <Label htmlFor="defaultValue">默认值</Label>
                            <Input
                              id="defaultValue"
                              value={properties.defaultValue || ""}
                              onChange={(e) =>
                                handlePropertyChange(
                                  "defaultValue",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div css={fieldGrid}>
                            <Label htmlFor="helperText">帮助文本</Label>
                            <Input
                              id="helperText"
                              value={properties.helperText || ""}
                              onChange={(e) =>
                                handlePropertyChange(
                                  "helperText",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div css={fieldGrid}>
                            <Label htmlFor="type">输入类型</Label>
                            <Select
                              value={properties.type || "text"}
                              onValueChange={(value) =>
                                handlePropertyChange("type", value)
                              }
                            >
                              <SelectTrigger id="type">
                                <SelectValue placeholder="选择输入类型" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="text">文本</SelectItem>
                                <SelectItem value="password">密码</SelectItem>
                                <SelectItem value="email">邮箱</SelectItem>
                                <SelectItem value="number">数字</SelectItem>
                                <SelectItem value="tel">电话</SelectItem>
                                <SelectItem value="url">网址</SelectItem>
                                <SelectItem value="date">日期</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div css={flexRow}>
                            <Label htmlFor="disabled">禁用</Label>
                            <Switch
                              id="disabled"
                              checked={properties.disabled || false}
                              onCheckedChange={(checked) =>
                                handlePropertyChange("disabled", checked)
                              }
                            />
                          </div>
                          <div css={flexRow}>
                            <Label htmlFor="required">必填</Label>
                            <Switch
                              id="required"
                              checked={properties.required || false}
                              onCheckedChange={(checked) =>
                                handlePropertyChange("required", checked)
                              }
                            />
                          </div>
                        </>
                      )}

                      {selectedComponent.type === "card" && (
                        <>
                          <div css={fieldGrid}>
                            <Label htmlFor="title">卡片标题</Label>
                            <Input
                              id="title"
                              value={properties.title || ""}
                              onChange={(e) =>
                                handlePropertyChange("title", e.target.value)
                              }
                            />
                          </div>
                          <div css={flexRow}>
                            <Label htmlFor="shadow">阴影</Label>
                            <Switch
                              id="shadow"
                              checked={properties.shadow || false}
                              onCheckedChange={(checked) =>
                                handlePropertyChange("shadow", checked)
                              }
                            />
                          </div>
                          <div css={flexRow}>
                            <Label htmlFor="rounded">圆角</Label>
                            <Switch
                              id="rounded"
                              checked={properties.rounded || false}
                              onCheckedChange={(checked) =>
                                handlePropertyChange("rounded", checked)
                              }
                            />
                          </div>
                          <div css={flexRow}>
                            <Label htmlFor="border">边框</Label>
                            <Switch
                              id="border"
                              checked={properties.border || false}
                              onCheckedChange={(checked) =>
                                handlePropertyChange("border", checked)
                              }
                            />
                          </div>
                          <div css={fieldGrid}>
                            <Label htmlFor="padding">内边距</Label>
                            <Input
                              id="padding"
                              value={properties.padding || "1rem"}
                              onChange={(e) =>
                                handlePropertyChange("padding", e.target.value)
                              }
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="style">
                  <AccordionTrigger>样式</AccordionTrigger>
                  <AccordionContent>
                    <div css={sectionGrid}>
                      <div css={fieldGrid}>
                        <Label htmlFor="width">宽度</Label>
                        <Input
                          id="width"
                          placeholder="auto"
                          value={properties.width || ""}
                          onChange={(e) =>
                            handlePropertyChange("width", e.target.value)
                          }
                        />
                      </div>
                      <div css={fieldGrid}>
                        <Label htmlFor="height">高度</Label>
                        <Input
                          id="height"
                          placeholder="auto"
                          value={properties.height || ""}
                          onChange={(e) =>
                            handlePropertyChange("height", e.target.value)
                          }
                        />
                      </div>
                      <div css={fieldGrid}>
                        <Label htmlFor="margin">外边距</Label>
                        <Input
                          id="margin"
                          placeholder="0px"
                          value={properties.margin || ""}
                          onChange={(e) =>
                            handlePropertyChange("margin", e.target.value)
                          }
                        />
                      </div>
                      <div css={fieldGrid}>
                        <Label htmlFor="padding">内边距</Label>
                        <Input
                          id="padding"
                          placeholder="0px"
                          value={properties.padding || ""}
                          onChange={(e) =>
                            handlePropertyChange("padding", e.target.value)
                          }
                        />
                      </div>
                      <div css={fieldGrid}>
                        <Label htmlFor="bgColor">背景颜色</Label>
                        <ColorPicker
                          color={properties.bgColor || "#ffffff"}
                          onChange={(color) =>
                            handlePropertyChange("bgColor", color)
                          }
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              </div>
            </div>
          </PropsScrollArea>
        </TabsContent>

        <TabsContent value="data">
          <PropsScrollArea>
            <div css={padded}>
              <div css={dataStack}>
                {/* 数据源选择器 */}
                <DataSourceSelector
                  dataSources={dataSources}
                  selectedDataSourceId={currentDataSource?.id || null}
                  componentType={selectedComponent?.type}
                  onDataSourceChange={(dataSourceId) => {
                    bindDataSource(dataSourceId);
                    // 如果选择的是已有数据源，也直接渲染数据
                    if (dataSourceId && selectedComponent) {
                      const dataSource = dataSources.find(
                        (ds) => ds.id === dataSourceId
                      );
                      if (dataSource?.data) {
                        renderDataToComponent(dataSource.data);
                      }
                    }
                  }}
                  onCreateDataSourceFromJson={createDataSourceFromJson}
                />

                {/* 编辑已绑定数据 */}
                {currentDataSource && currentBoundData !== null && (
                  <BoundDataEditor
                    data={currentBoundData}
                    onUpdate={(updatedData) => {
                      updateComponentBoundData(updatedData);
                    }}
                    minHeight="200px"
                  />
                )}

                {/* 绑定状态提示 - 简化显示 */}
                {currentDataSource && currentBoundData !== null && (
                  <div css={bindStatusRow}>
                    <div css={bindStatusDot} />
                    <span>数据已绑定</span>
                  </div>
                )}
              </div>
            </div>
          </PropsScrollArea>
        </TabsContent>

        <TabsContent value="events">
          <PropsScrollArea>
            <div css={padded}>
              <div css={sectionGrid}>
                <div css={fieldGrid}>
                  <Label htmlFor="onClick">点击事件</Label>
                  <Select
                    value={properties.onClick || "none"}
                    onValueChange={(value) =>
                      handlePropertyChange("onClick", value)
                    }
                  >
                    <SelectTrigger id="onClick">
                      <SelectValue placeholder="选择事件" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">无</SelectItem>
                      <SelectItem value="navigate">页面跳转</SelectItem>
                      <SelectItem value="submit">提交表单</SelectItem>
                      <SelectItem value="openDialog">打开对话框</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {properties.onClick === "navigate" && (
                  <div css={fieldGrid}>
                    <Label htmlFor="navigateUrl">跳转地址</Label>
                    <Input
                      id="navigateUrl"
                      placeholder="https://example.com"
                      value={properties.navigateUrl || ""}
                      onChange={(e) =>
                        handlePropertyChange("navigateUrl", e.target.value)
                      }
                    />
                  </div>
                )}

                {properties.onClick === "openDialog" && (
                  <div css={fieldGrid}>
                    <Label htmlFor="dialogId">对话框ID</Label>
                    <Input
                      id="dialogId"
                      placeholder="dialog-1"
                      value={properties.dialogId || ""}
                      onChange={(e) =>
                        handlePropertyChange("dialogId", e.target.value)
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          </PropsScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
})

PropertiesPanel.displayName = "PropertiesPanel";
