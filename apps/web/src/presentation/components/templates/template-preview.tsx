"use client";

import { useState } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  ScrollArea,
} from "@/presentation/components/ui";
import { Star, Code, Layout, Smartphone, Tablet, Monitor } from "lucide-react";
import { PreviewCanvas } from "@/presentation/components/canvas/preview-canvas";

import type { Component } from "@/domain/component";

interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: string;
  tags?: string[];
  components: Component[];
}

interface TemplatePreviewProps {
  template: Template | null;
  isOpen: boolean;
  onClose: () => void;
  onUse: (components: Component[]) => void;
  isFavorite: boolean;
  onToggleFavorite: (templateId: string) => void;
}

const DialogHeaderStyled = styled(DialogHeader)`
  flex-shrink: 0;
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
`;

const FavoriteIconButton = styled(Button)`
  height: 2rem;
  width: 2rem;
`;

const TabsWrapper = styled(Tabs)`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

const TabsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
`;

const DeviceSwitcher = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  border: 1px solid hsl(var(--border));
  border-radius: calc(var(--radius));
  padding: 0.25rem;
`;

const DeviceButton = styled(Button)`
  height: 2rem;
  width: 2rem;
`;

const TabsContentWrapper = styled.div`
  flex: 1;
  overflow: hidden;
  margin-top: 1rem;
`;

const PreviewScrollArea = styled(ScrollArea)`
  flex: 1;
  border: 1px solid hsl(var(--border));
  border-radius: calc(var(--radius));
`;

const PreviewContent = styled.div`
  overflow: visible;
  margin: 0 auto;
`;

const StructurePanel = styled.div`
  flex: 1;
  border: 1px solid hsl(var(--border));
  border-radius: calc(var(--radius));
  overflow: hidden;
`;

const StructureHeader = styled.div`
  border-bottom: 1px solid hsl(var(--border));
  background-color: hsl(var(--muted) / 0.5);
  padding: 0.5rem 1rem;
`;

const StructureScrollArea = styled(ScrollArea)`
  height: 25rem;
`;

const StructureContent = styled.div`
  padding: 1rem;
`;

const Footer = styled.div`
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
  flex-shrink: 0;
`;

const DescriptionText = styled.p`
  font-size: 0.875rem;
  color: hsl(var(--muted-foreground));
`;

const TagsWrapper = styled.div`
  margin-top: 0.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
`;

const Tag = styled.span`
  border-radius: 9999px;
  background-color: hsl(var(--muted));
  padding: 0.125rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: hsl(var(--muted-foreground));
`;

const ComponentTreeItem = styled.div`
  margin-bottom: 0.25rem;
`;

const ComponentRow = styled.div`
  display: flex;
  align-items: center;
  border-radius: calc(var(--radius) / 2);
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;

  &:hover {
    background-color: hsl(var(--muted) / 0.5);
  }
`;

const TypeLabel = styled.span`
  margin-right: 0.25rem;
  font-size: 0.75rem;
  color: hsl(var(--muted-foreground));
`;

const NameLabel = styled.span`
  font-weight: 500;
`;

export function TemplatePreview({
  template,
  isOpen,
  onClose,
  onUse,
  isFavorite,
  onToggleFavorite,
}: TemplatePreviewProps) {
  const [activeTab, setActiveTab] = useState("preview");
  const [activeDevice, setActiveDevice] = useState("desktop");

  if (!template) return null;

  const handleUseTemplate = () => {
    console.log("使用模板:", template.name);
    console.log("模板组件:", template.components);
    onUse(template.components);
  };

  const getDeviceWidth = () => {
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

  const buildComponentTree = (
    components: Component[],
    parentId: string | null = null,
    level = 0
  ): React.ReactElement[] => {
    return components
      .filter((component) => component.parentId === parentId)
      .map((component) => (
        <ComponentTreeItem key={component.id}>
          <ComponentRow
            style={{ paddingLeft: `${level * 16 + 8}px` }}
          >
            <TypeLabel>{component.type}</TypeLabel>
            <NameLabel>
              {component.name || component.type}
            </NameLabel>
          </ComponentRow>
          {buildComponentTree(components, component.id, level + 1)}
        </ComponentTreeItem>
      ));
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        css={css`
          max-width: 62rem;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        `}
      >
        <DialogHeaderStyled>
          <TitleWrapper>
            <DialogTitle>{template.name}</DialogTitle>
            <FavoriteIconButton
              variant="ghost"
              size="icon"
              onClick={() => onToggleFavorite(template.id)}
            >
              <Star
                css={isFavorite ? css`
                  width: 1rem;
                  height: 1rem;
                  fill: #facc15;
                  color: #facc15;
                ` : css`
                  width: 1rem;
                  height: 1rem;
                `}
              />
            </FavoriteIconButton>
          </TitleWrapper>
        </DialogHeaderStyled>

        <TabsWrapper
          defaultValue="preview"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsHeader>
            <TabsList>
              <TabsTrigger value="preview" css={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                <Layout css={{ width: "1rem", height: "1rem" }} />
                <span>预览</span>
              </TabsTrigger>
              <TabsTrigger value="structure" css={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                <Code css={{ width: "1rem", height: "1rem" }} />
                <span>结构</span>
              </TabsTrigger>
            </TabsList>

            {activeTab === "preview" && (
              <DeviceSwitcher>
                <DeviceButton
                  variant={activeDevice === "mobile" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setActiveDevice("mobile")}
                >
                  <Smartphone css={{ width: "1rem", height: "1rem" }} />
                </DeviceButton>
                <DeviceButton
                  variant={activeDevice === "tablet" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setActiveDevice("tablet")}
                >
                  <Tablet css={{ width: "1rem", height: "1rem" }} />
                </DeviceButton>
                <DeviceButton
                  variant={activeDevice === "desktop" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setActiveDevice("desktop")}
                >
                  <Monitor css={{ width: "1rem", height: "1rem" }} />
                </DeviceButton>
              </DeviceSwitcher>
            )}
          </TabsHeader>

          <TabsContentWrapper>
            <TabsContent
              value="preview"
              css={css`
                height: 100%;
                margin: 0;
                &[data-state="active"] {
                  display: flex;
                  flex-direction: column;
                }
              `}
            >
              <PreviewScrollArea>
                <PreviewContent
                  style={{
                    width:
                      activeDevice === "desktop"
                        ? "100%"
                        : `${getDeviceWidth()}px`,
                  }}
                >
                  <PreviewCanvas
                    components={template.components}
                    width={getDeviceWidth()}
                  />
                </PreviewContent>
              </PreviewScrollArea>
            </TabsContent>

            <TabsContent
              value="structure"
              css={css`
                height: 100%;
                margin: 0;
                &[data-state="active"] {
                  display: flex;
                  flex-direction: column;
                }
              `}
            >
              <StructurePanel>
                <StructureHeader>
                  <h3 css={{ fontSize: "0.875rem", fontWeight: 500 }}>组件结构</h3>
                  <p css={{ fontSize: "0.75rem", color: "hsl(var(--muted-foreground))" }}>
                    共 {template.components.length} 个组件
                  </p>
                </StructureHeader>
                <StructureScrollArea>
                  <StructureContent>
                    {buildComponentTree(template.components)}
                  </StructureContent>
                </StructureScrollArea>
              </StructurePanel>
            </TabsContent>
          </TabsContentWrapper>
        </TabsWrapper>

        <Footer>
          <div>
            <DescriptionText>{template.description}</DescriptionText>
            <TagsWrapper>
              {template.tags?.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </TagsWrapper>
          </div>
          <Button onClick={handleUseTemplate}>使用此模板</Button>
        </Footer>
      </DialogContent>
    </Dialog>
  );
}
