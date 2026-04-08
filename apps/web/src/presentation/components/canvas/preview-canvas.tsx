"use client";

import type React from "react";

import styled from "@emotion/styled";
import type { Component } from "@/domain/component";
import type { ThemeConfig } from "@/domain/theme";
import type { PageSchema } from "@/domain/entities/schema.types";
import { SchemaRenderer } from "./schema-renderer";
import { ComponentRenderer } from "./component-renderer";
import {
  ComponentManagementService,
} from "@/application/services/component-management.service";

const SchemaWrap = styled.div<{ $width: number }>`
  width: ${(p) => p.$width}px;
  overflow: auto;
`;

const PreviewEmptyOuter = styled.div<{ $width: number }>`
  display: flex;
  height: 100%;
  min-height: 400px;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  border: 2px dashed hsl(var(--border));
  width: ${(p) => p.$width}px;
`;

const PreviewEmptyInner = styled.div`
  text-align: center;
  color: hsl(var(--muted-foreground));
`;

interface PreviewCanvasProps {
  readonly components?: Component[];
  readonly width: number;
  readonly theme?: ThemeConfig;
  readonly isAnimating?: boolean;
  readonly schema?: PageSchema | string;
}

const noop = () => undefined;
void noop;

export function PreviewCanvas({
  components,
  width,
  theme,
  schema,
}: PreviewCanvasProps) {
  if (schema) {
    return (
      <SchemaWrap $width={width}>
        <SchemaRenderer schema={schema} isReadOnly={true} />
      </SchemaWrap>
    );
  }

  if (!components || components.length === 0) {
    return (
      <PreviewEmptyOuter $width={width}>
        <PreviewEmptyInner>
          <p>没有组件可预览</p>
        </PreviewEmptyInner>
      </PreviewEmptyOuter>
    );
  }

  const rootComponents = ComponentManagementService.getRootComponents(
    components
  );

  const calculateCanvasHeight = () => {
    if (rootComponents.length === 0) return 500;
    let maxHeight = 500;
    for (const component of rootComponents) {
      const compHeight = component.properties?.height
        ? Number.parseInt(component.properties.height.toString())
        : 0;
      const compY = component.position?.y || 0;
      const totalHeight = compY + compHeight + 100;
      if (totalHeight > maxHeight) maxHeight = totalHeight;
    }
    return maxHeight;
  };

  const canvasWidth = width;
  const canvasHeight = calculateCanvasHeight();

  return (
    <div
      style={{
        position: "relative",
        isolation: "isolate",
        width: `${canvasWidth}px`,
        minHeight: `${canvasHeight}px`,
        backgroundColor: theme?.backgroundColor || "#ffffff",
        color: theme?.textColor || "#000000",
        fontFamily: theme?.fontFamily || "system-ui, sans-serif",
        overflow: "visible",
      }}
    >
      {[...rootComponents]
        .sort((a, b) => (a.position?.y ?? 0) - (b.position?.y ?? 0))
        .map((component) => (
          <ComponentRenderer
            key={component.id}
            component={component}
            parentComponent={null}
            components={components}
            theme={theme}
            isPreviewMode={true}
            selectedId={null}
            dropTargetId={null}
            onSelectComponent={noop}
            onMouseDown={noop}
            componentData={undefined}
          />
        ))}
    </div>
  );
}
