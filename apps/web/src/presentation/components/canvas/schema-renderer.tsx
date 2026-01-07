"use client";

import React, { useMemo, useCallback } from "react";
import type { Component } from "@/domain/component";
import type { ThemeConfig } from "@/domain/theme";
import { ComponentRenderer } from "./component-renderer";
import { ComponentManagementService } from "@/application/services/component-management.service";
import {
  PageSchema,
  validateSchema,
  migrateSchema,
  SchemaValidationError,
} from "@/domain/entities/schema.types";

interface SchemaRendererProps {
  schema: PageSchema | string; // 支持直接传入 Schema 对象或 JSON 字符串
  isReadOnly?: boolean; // 是否为只读模式（预览模式）
  selectedId?: string | null;
  dropTargetId?: string | null;
  onSelectComponent?: (component: Component) => void;
  onMouseDown?: (e: React.MouseEvent, component: Component) => void;
  getComponentData?: (component: Component) => any;
  className?: string;
}

export function SchemaRenderer({
  schema,
  isReadOnly = true,
  selectedId = null,
  dropTargetId = null,
  onSelectComponent,
  onMouseDown,
  getComponentData,
  className,
}: SchemaRendererProps) {
  // 解析和验证 Schema
  const parsedSchema = useMemo(() => {
    try {
      // 如果是字符串，先解析为对象
      const schemaObj =
        typeof schema === "string" ? JSON.parse(schema) : schema;

      // 迁移旧版本 Schema
      const migratedSchema = migrateSchema(schemaObj);

      // 验证 Schema 格式
      if (!validateSchema(migratedSchema)) {
        throw new SchemaValidationError("Schema 格式验证失败", migratedSchema);
      }

      return migratedSchema;
    } catch (error) {
      console.error("Schema 解析失败:", error);
      if (error instanceof SchemaValidationError) {
        throw error;
      }
      throw new SchemaValidationError(
        error instanceof Error ? error.message : "未知错误",
        schema
      );
    }
  }, [schema]);

  // 获取组件数据（如果提供了函数）
  const handleGetComponentData = useCallback(
    (component: Component) => {
      if (getComponentData) {
        return getComponentData(component);
      }
      // 默认实现：从数据源中查找组件绑定的数据
      const dataSource = parsedSchema.dataSources.find(
        (ds) => ds.id === component.dataSource
      );
      return dataSource?.data || null;
    },
    [getComponentData, parsedSchema.dataSources]
  );

  // 处理组件选择（只读模式下禁用）
  const handleSelectComponent = useCallback(
    (component: Component) => {
      if (!isReadOnly && onSelectComponent) {
        onSelectComponent(component);
      }
    },
    [isReadOnly, onSelectComponent]
  );

  // 处理鼠标按下事件（只读模式下禁用）
  const handleMouseDown = useCallback(
    (e: React.MouseEvent, component: Component) => {
      if (!isReadOnly && onMouseDown) {
        onMouseDown(e, component);
      }
    },
    [isReadOnly, onMouseDown]
  );

  // 递归渲染组件
  const renderComponent = useCallback(
    (component: Component, parentComponent: Component | null = null) => {
      const componentData = handleGetComponentData(component);

      return (
        <ComponentRenderer
          key={component.id}
          component={component}
          parentComponent={parentComponent}
          components={parsedSchema.components}
          theme={parsedSchema.theme as ThemeConfig}
          isPreviewMode={isReadOnly}
          selectedId={selectedId}
          dropTargetId={dropTargetId}
          onSelectComponent={handleSelectComponent}
          onMouseDown={handleMouseDown}
          componentData={componentData}
        />
      );
    },
    [
      parsedSchema.components,
      parsedSchema.theme,
      isReadOnly,
      selectedId,
      dropTargetId,
      handleSelectComponent,
      handleMouseDown,
      handleGetComponentData,
    ]
  );

  // 获取根级组件（没有父组件的组件）
  const rootComponents = useMemo(() => {
    return ComponentManagementService.getRootComponents(
      parsedSchema.components
    );
  }, [parsedSchema.components]);

  // 应用画布样式
  const canvasStyle: React.CSSProperties = {
    width: parsedSchema.canvas.viewportWidth || 1920,
    position: "relative",
    minHeight: "100vh",
    backgroundColor: parsedSchema.theme?.backgroundColor || "#ffffff",
  };

  return (
    <div className={className} style={canvasStyle}>
      {rootComponents.length === 0 ? (
        <div className="flex h-full items-center justify-center text-muted-foreground">
          没有组件可渲染
        </div>
      ) : (
        rootComponents.map((component) => renderComponent(component, null))
      )}
    </div>
  );
}
