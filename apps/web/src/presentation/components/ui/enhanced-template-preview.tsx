"use client";

import { useState, useMemo } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  Button,
  ScrollArea,
  VirtualList,
} from "@/presentation/components/ui";
import { PreviewCanvas } from "@/presentation/components/canvas/preview-canvas";
import {
  Smartphone,
  Tablet,
  Monitor,
  Code,
  Layout,
  FileJson,
} from "lucide-react";
import type { Component } from "@/domain/component";
import type { ThemeConfig } from "@/domain/theme";

interface EnhancedTemplatePreviewProps {
  templateId: string;
  templates: any[];
  theme: ThemeConfig;
}

const Wrapper = styled.div`
  margin-top: 1rem;
  border: 1px solid hsl(var(--border));
  border-radius: calc(var(--radius));
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 600px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid hsl(var(--border));
  padding: 0.5rem;
  flex-shrink: 0;
`;

const TabsStyled = styled(Tabs)`
  width: auto;
`;

const TabsListStyled = styled(TabsList)`
  display: grid;
  width: auto;
  grid-template-columns: repeat(3, 1fr);
`;

const TabsTriggerStyled = styled(TabsTrigger)`
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const DeviceSwitcher = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  border: 1px solid hsl(var(--border));
  border-radius: 0.375rem;
  padding: 0.25rem;
`;

const DeviceButton = styled(Button)`
  height: 2rem;
  width: 2rem;
`;

const Content = styled.div`
  flex: 1;
  overflow: hidden;
`;

const PreviewWrapper = styled.div`
  margin: 0 auto;
  background-color: white;
`;

const StructureSection = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const StructureHeader = styled.div`
  border-bottom: 1px solid hsl(var(--border));
  background-color: hsl(var(--muted) / 0.5);
  padding: 0.5rem 1rem;
  flex-shrink: 0;
`;

const StructureTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 500;
`;

const StructureSubtitle = styled.p`
  font-size: 0.75rem;
  color: hsl(var(--muted-foreground));
`;

const JsonSection = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const JsonHeader = styled.div`
  border-bottom: 1px solid hsl(var(--border));
  background-color: hsl(var(--muted) / 0.5);
  padding: 0.5rem 1rem;
  flex-shrink: 0;
`;

const JsonTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 500;
`;

const JsonContent = styled.pre`
  padding: 1rem;
  font-size: 0.75rem;
`;

const NotFoundText = styled.div`
  padding: 1rem;
  text-align: center;
  color: hsl(var(--muted-foreground));
`;

const ComponentTreeItem = styled.div`
  display: flex;
  align-items: center;
  border-radius: 0.25rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  &:hover {
    background-color: hsl(var(--muted) / 0.5);
  }
`;

const ComponentType = styled.span`
  margin-right: 0.25rem;
  font-size: 0.75rem;
  color: hsl(var(--muted-foreground));
`;

const ComponentName = styled.span`
  font-weight: 500;
`;

export function EnhancedTemplatePreview({
  templateId,
  templates,
  theme,
}: EnhancedTemplatePreviewProps) {
  const [activeTab, setActiveTab] = useState("preview");
  const [activeDevice, setActiveDevice] = useState("desktop");

  const template = useMemo(
    () => templates.find((t) => t.id === templateId),
    [templateId, templates]
  );

  if (!template) {
    return <NotFoundText>未找到模板</NotFoundText>;
  }

  const getDeviceWidth = () => {
    if (activeTab !== "preview") return 1280;
    switch (activeDevice) {
      case "mobile":
        return 375;
      case "tablet":
        return 768;
      case "desktop":
      default:
        return 1280;
    }
  };

  const flattenComponentTree = (
    components: Component[],
    parentId: string | null = null,
    level = 0
  ): { component: Component; level: number }[] => {
    const result: { component: Component; level: number }[] = [];

    components
      .filter((component) => component.parentId === parentId)
      .forEach((component) => {
        result.push({ component, level });
        result.push(
          ...flattenComponentTree(components, component.id, level + 1)
        );
      });

    return result;
  };

  const flattenedComponents = useMemo(
    () => (template ? flattenComponentTree(template.components) : []),
    [template]
  );

  return (
    <Wrapper>
      <Header>
        <TabsStyled value={activeTab} onValueChange={setActiveTab}>
          <TabsListStyled>
            <TabsTriggerStyled value="preview">
              <Layout css={{ height: "1rem", width: "1rem" }} />
              <span css={{ display: "none", "@media(min-width: 640px)": { display: "inline" } }}>预览</span>
            </TabsTriggerStyled>
            <TabsTriggerStyled value="structure">
              <Code css={{ height: "1rem", width: "1rem" }} />
              <span css={{ display: "none", "@media(min-width: 640px)": { display: "inline" } }}>结构</span>
            </TabsTriggerStyled>
            <TabsTriggerStyled value="json">
              <FileJson css={{ height: "1rem", width: "1rem" }} />
              <span css={{ display: "none", "@media(min-width: 640px)": { display: "inline" } }}>JSON</span>
            </TabsTriggerStyled>
          </TabsListStyled>
        </TabsStyled>

        {activeTab === "preview" && (
          <DeviceSwitcher>
            <DeviceButton
              variant={activeDevice === "mobile" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setActiveDevice("mobile")}
            >
              <Smartphone css={{ height: "1rem", width: "1rem" }} />
            </DeviceButton>
            <DeviceButton
              variant={activeDevice === "tablet" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setActiveDevice("tablet")}
            >
              <Tablet css={{ height: "1rem", width: "1rem" }} />
            </DeviceButton>
            <DeviceButton
              variant={activeDevice === "desktop" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setActiveDevice("desktop")}
            >
              <Monitor css={{ height: "1rem", width: "1rem" }} />
            </DeviceButton>
          </DeviceSwitcher>
        )}
      </Header>

      <Content>
        {activeTab === "preview" && (
          <ScrollArea css={{ height: "100%" }}>
            <PreviewWrapper
              style={{
                width:
                  activeDevice === "desktop" ? "100%" : `${getDeviceWidth()}px`,
                padding: "1rem",
              }}
            >
              <PreviewCanvas
                components={template.components}
                width={getDeviceWidth()}
                theme={theme}
                isAnimating={false}
              />
            </PreviewWrapper>
          </ScrollArea>
        )}

        {activeTab === "structure" && (
          <StructureSection>
            <StructureHeader>
              <StructureTitle>组件结构</StructureTitle>
              <StructureSubtitle>共 {template?.components?.length || 0} 个组件</StructureSubtitle>
            </StructureHeader>
            <ScrollArea css={{ flex: 1 }}>
              <VirtualList
                items={flattenedComponents}
                height={500}
                itemHeight={32}
                renderItem={(
                  {
                    component,
                    level,
                  }: {
                    component: Component;
                    level: number;
                  },
                  index: number
                ) => (
                  <ComponentTreeItem
                    key={`${index}-${component.id}`}
                    style={{
                      paddingLeft: `${level * 16 + 8}px`,
                      height: "32px",
                    }}
                  >
                    <ComponentType>{component.type}</ComponentType>
                    <ComponentName>{component.name || component.type}</ComponentName>
                  </ComponentTreeItem>
                )}
              />
            </ScrollArea>
          </StructureSection>
        )}

        {activeTab === "json" && (
          <JsonSection>
            <JsonHeader>
              <JsonTitle>JSON 数据</JsonTitle>
            </JsonHeader>
            <ScrollArea css={{ flex: 1 }}>
              <JsonContent>{template ? JSON.stringify(template.components, null, 2) : ""}</JsonContent>
            </ScrollArea>
          </JsonSection>
        )}
      </Content>
    </Wrapper>
  );
}
