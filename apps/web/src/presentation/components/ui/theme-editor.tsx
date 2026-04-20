"use client";

import { useState, memo } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { Button } from "./button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import { Label } from "./label";
import { Palette } from "lucide-react";
import { ColorPicker } from "./color-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import type { ThemeConfig } from "@/domain/theme";
import { useThemeStore } from "@/infrastructure/state-management/stores";

interface ThemeEditorProps {}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
`;

const Section = styled.div`
  display: grid;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: grid;
  gap: 0.5rem;
`;

const PresetButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const PreviewCard = styled.div`
  border-radius: calc(var(--radius));
  background-color: hsl(var(--muted));
  padding: 1rem;
`;

const PreviewHeader = styled.h4`
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const PreviewContent = styled.div`
  display: flex;
  gap: 0.5rem;
  border-radius: calc(var(--radius));
  padding: 1rem;
`;

const PreviewButton = styled.div<{ bgColor: string; textColor?: string }>`
  border-radius: calc(var(--radius));
  padding: 0.25rem 0.75rem;
  background-color: ${(p) => p.bgColor};
  color: ${(p) => p.textColor || "#ffffff"};
`;

const PreviewOutlineButton = styled.div<{ borderColor: string; textColor: string }>`
  border: 1px solid ${(p) => p.borderColor};
  border-radius: calc(var(--radius));
  padding: 0.25rem 0.75rem;
  color: ${(p) => p.textColor};
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const ThemeEditor = memo(function ThemeEditor({}: ThemeEditorProps) {
  const { theme, updateTheme } = useThemeStore();
  const [localTheme, setLocalTheme] = useState<ThemeConfig>(theme);

  const handleChange = (key: keyof ThemeConfig, value: string) => {
    const updatedTheme = { ...localTheme, [key]: value };
    setLocalTheme(updatedTheme);
  };

  const handleApply = () => {
    updateTheme(localTheme);
  };

  const presetThemes = [
    {
      name: "默认主题",
      config: {
        primaryColor: "#0070f3",
        secondaryColor: "#6c757d",
        backgroundColor: "#ffffff",
        textColor: "#000000",
        fontFamily: "system-ui, sans-serif",
        borderRadius: "0.375rem",
        spacing: "1rem",
      },
    },
    {
      name: "暗色主题",
      config: {
        primaryColor: "#3b82f6",
        secondaryColor: "#6b7280",
        backgroundColor: "#1f2937",
        textColor: "#f9fafb",
        fontFamily: "system-ui, sans-serif",
        borderRadius: "0.375rem",
        spacing: "1rem",
      },
    },
    {
      name: "柔和主题",
      config: {
        primaryColor: "#8b5cf6",
        secondaryColor: "#a78bfa",
        backgroundColor: "#f5f3ff",
        textColor: "#4c1d95",
        fontFamily: "'Inter', sans-serif",
        borderRadius: "0.5rem",
        spacing: "1.25rem",
      },
    },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Palette css={{ marginRight: "0.375rem", width: "1rem", height: "1rem" }} aria-hidden="true" />
          主题设置
        </Button>
      </DialogTrigger>
      <DialogContent css={{ maxWidth: "42rem" }}>
        <DialogHeader>
          <DialogTitle>主题设置</DialogTitle>
          <DialogDescription>自定义应用的视觉风格</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="colors">
          <TabsList css={{ display: "grid", width: "100%", gridTemplateColumns: "repeat(3, 1fr)" }}>
            <TabsTrigger value="colors">颜色</TabsTrigger>
            <TabsTrigger value="typography">排版</TabsTrigger>
            <TabsTrigger value="spacing">间距与圆角</TabsTrigger>
          </TabsList>

          <TabsContent value="colors" css={{ display: "flex", flexDirection: "column", gap: "1rem", paddingTop: "1rem" }}>
            <Section>
              <FormGroup>
                <Label htmlFor="primaryColor">主色调</Label>
                <ColorPicker
                  color={localTheme.primaryColor}
                  onChange={(color) => handleChange("primaryColor", color)}
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="secondaryColor">次要色调</Label>
                <ColorPicker
                  color={localTheme.secondaryColor}
                  onChange={(color) => handleChange("secondaryColor", color)}
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="backgroundColor">背景色</Label>
                <ColorPicker
                  color={localTheme.backgroundColor}
                  onChange={(color) => handleChange("backgroundColor", color)}
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="textColor">文本颜色</Label>
                <ColorPicker
                  color={localTheme.textColor}
                  onChange={(color) => handleChange("textColor", color)}
                />
              </FormGroup>
            </Section>
          </TabsContent>

          <TabsContent value="typography" css={{ display: "flex", flexDirection: "column", gap: "1rem", paddingTop: "1rem" }}>
            <Section>
              <FormGroup>
                <Label htmlFor="fontFamily">字体</Label>
                <Select
                  value={localTheme.fontFamily}
                  onValueChange={(value) => handleChange("fontFamily", value)}
                >
                  <SelectTrigger id="fontFamily">
                    <SelectValue placeholder="选择字体" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="system-ui, sans-serif">
                      系统默认
                    </SelectItem>
                    <SelectItem value="'Inter', sans-serif">Inter</SelectItem>
                    <SelectItem value="'Roboto', sans-serif">Roboto</SelectItem>
                    <SelectItem value="'Noto Sans SC', sans-serif">
                      Noto Sans SC
                    </SelectItem>
                    <SelectItem value="'Helvetica Neue', sans-serif">
                      Helvetica Neue
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormGroup>
            </Section>
          </TabsContent>

          <TabsContent value="spacing" css={{ display: "flex", flexDirection: "column", gap: "1rem", paddingTop: "1rem" }}>
            <Section>
              <FormGroup>
                <Label htmlFor="borderRadius">圆角</Label>
                <Select
                  value={localTheme.borderRadius}
                  onValueChange={(value) => handleChange("borderRadius", value)}
                >
                  <SelectTrigger id="borderRadius">
                    <SelectValue placeholder="选择圆角大小" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">无圆角</SelectItem>
                    <SelectItem value="0.125rem">小圆角 (2px)</SelectItem>
                    <SelectItem value="0.25rem">中小圆角 (4px)</SelectItem>
                    <SelectItem value="0.375rem">中圆角 (6px)</SelectItem>
                    <SelectItem value="0.5rem">大圆角 (8px)</SelectItem>
                    <SelectItem value="0.75rem">特大圆角 (12px)</SelectItem>
                    <SelectItem value="9999px">圆形</SelectItem>
                  </SelectContent>
                </Select>
              </FormGroup>
              <FormGroup>
                <Label htmlFor="spacing">基础间距</Label>
                <Select
                  value={localTheme.spacing}
                  onValueChange={(value) => handleChange("spacing", value)}
                >
                  <SelectTrigger id="spacing">
                    <SelectValue placeholder="选择基础间距" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.5rem">紧凑 (8px)</SelectItem>
                    <SelectItem value="0.75rem">较紧凑 (12px)</SelectItem>
                    <SelectItem value="1rem">标准 (16px)</SelectItem>
                    <SelectItem value="1.25rem">宽松 (20px)</SelectItem>
                    <SelectItem value="1.5rem">较宽松 (24px)</SelectItem>
                  </SelectContent>
                </Select>
              </FormGroup>
            </Section>
          </TabsContent>
        </Tabs>

        <Wrapper>
          <PresetButtons>
            <Label css={{ width: "100%", fontWeight: 500 }}>预设主题</Label>
            {presetThemes.map((presetTheme) => (
              <Button
                key={presetTheme.name}
                variant="outline"
                size="sm"
                onClick={() => setLocalTheme(presetTheme.config)}
              >
                {presetTheme.name}
              </Button>
            ))}
          </PresetButtons>

          <PreviewCard>
            <PreviewHeader>预览</PreviewHeader>
            <PreviewContent
              style={{
                backgroundColor: localTheme.backgroundColor,
                color: localTheme.textColor,
                fontFamily: localTheme.fontFamily,
              }}
            >
              <PreviewButton bgColor={localTheme.primaryColor}>
                主按钮
              </PreviewButton>
              <PreviewButton bgColor={localTheme.secondaryColor}>
                次要按钮
              </PreviewButton>
              <PreviewOutlineButton
                borderColor={localTheme.primaryColor}
                textColor={localTheme.textColor}
              >
                轮廓按钮
              </PreviewOutlineButton>
            </PreviewContent>
          </PreviewCard>

          <Actions>
            <Button onClick={handleApply}>应用主题</Button>
          </Actions>
        </Wrapper>
      </DialogContent>
    </Dialog>
  );
});