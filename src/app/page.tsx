"use client";

import { useCallback } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  Canvas,
  ComponentPanel,
  PropertiesPanel,
} from "@/presentation/components/canvas";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/presentation/components/ui/tabs";
import { CodeExport, Header } from "@/presentation/components/ui";
import { TemplateGallery } from "@/presentation/components/templates";
import { ResponsiveControls } from "@/presentation/components/ui";
import { ThemeEditor } from "@/presentation/components/ui";
import { FormBuilder } from "@/presentation/components/forms";
import { AnimationEditor } from "@/presentation/components/ui";
import { Collaboration } from "@/presentation/components/ui";
import type { Component, ThemeConfig } from "@/domain/entities/types";
import { TemplateApplicationError } from "@/domain/entities/types";
import { TemplateService } from "@/application/services/template-command.service";
import { Button } from "@/presentation/components/ui/button";
import { Eye, Undo2, Redo2 } from "lucide-react";
import { ComponentLibraryManager } from "@/presentation/components/ui";
import { ComponentGrouping } from "@/presentation/components/ui";
import { ComponentTree } from "@/presentation/components/canvas";
import { toast } from "@/presentation/hooks/use-toast";
import { useStores } from "@/shared/stores";
import { DataPanel } from "@/presentation/components/data";

export default function LowCodePlatform() {
  // 从 stores 获取状态
  const {
    // 组件状态
    components,
    selectedComponent,
    addComponent,
    updateComponent,
    deleteComponent,
    selectComponent,
    // 画布状态
    isPreviewMode,
    viewportWidth,
    activeDevice,
    setPreviewMode,
    setViewportWidth,
    setActiveDevice,
    // 主题状态
    theme,
    updateTheme,
    // UI状态
    activeTab,
    projectName,
    setActiveTab,
    // 历史记录状态
    undo,
    redo,
    canUndo,
    canRedo,
    addToHistory,
  } = useStores();

  // 处理自定义组件（暂时使用空实现，后续可以添加到UI store）
  const handleAddCustomComponent = (component: any) => {
    // TODO: 添加到自定义组件管理
  };

  const handleRemoveCustomComponent = (componentId: string) => {
    // TODO: 从自定义组件管理移除
  };

  const handleImportComponents = (components: any[]) => {
    // TODO: 导入自定义组件
  };

  const handleUpdateComponent = (id: string, properties: any) => {
    updateComponent(id, { properties });
    addToHistory(components);
  };

  const handleSelectComponent = (component: Component | null) => {
    selectComponent(component);
  };

  const togglePreviewMode = () => {
    setPreviewMode(!isPreviewMode);
    if (!isPreviewMode) {
      selectComponent(null);
    }
  };

  const handleViewportChange = (width: number, device: string) => {
    setViewportWidth(width);
    setActiveDevice(device);
  };

  const handleThemeChange = (newTheme: ThemeConfig) => {
    updateTheme(newTheme);
  };

  // 处理模板选择
  const handleSelectTemplate = useCallback(
    (templateComponents: Component[]) => {
      try {
        const processedComponents =
          TemplateService.applyTemplate(templateComponents);

        // 添加组件到store
        processedComponents.forEach((component) => {
          addComponent(component);
        });

        addToHistory(components);

        toast({
          title: "模板应用成功",
          description: `已添加 ${processedComponents.length} 个组件到画布`,
        });
      } catch (error) {
        console.error("应用模板时出错:", error);

        if (error instanceof TemplateApplicationError) {
          toast({
            title: "模板应用失败",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "应用模板失败",
            description: "处理模板时发生未知错误",
            variant: "destructive",
          });
        }
      }
    },
    [addComponent, addToHistory, components]
  );

  const handleAddForm = (formComponents: Component[]) => {
    formComponents.forEach((component) => {
      addComponent(component);
    });
    addToHistory(components);
  };

  const handleApplyAnimation = (componentId: string, animation: any) => {
    updateComponent(componentId, {
      properties: {
        ...components.find((c) => c.id === componentId)?.properties,
        animation,
      },
    });
    addToHistory(components);
  };

  const handleGroupComponents = (componentIds: string[], groupName: string) => {
    if (componentIds.length < 2) return;

    // 找出要分组的组件
    const groupComponents = components.filter((c) =>
      componentIds.includes(c.id)
    );

    // 计算组的位置（使用第一个组件的位置）
    const firstComponent = groupComponents[0];
    const groupPosition = firstComponent.position || { x: 0, y: 0 };

    // 创建组容器
    const groupContainer: Component = {
      id: `group-${Date.now()}`,
      type: "container",
      name: groupName,
      position: groupPosition,
      properties: {
        width: "auto",
        height: "auto",
        padding: "10px",
        bgColor: "rgba(0, 0, 0, 0.03)",
        isGroup: true,
      },
      children: [],
    };

    // 调整子组件的位置为相对于组的位置
    const childComponents = groupComponents.map((component) => {
      const relativeX = (component.position?.x || 0) - groupPosition.x;
      const relativeY = (component.position?.y || 0) - groupPosition.y;

      return {
        ...component,
        position: { x: relativeX, y: relativeY },
        parentId: groupContainer.id,
      };
    });

    groupContainer.children = childComponents;

    // 从画布中移除被分组的组件
    const remainingComponents = components.filter(
      (c) => !componentIds.includes(c.id)
    );

    // 添加新的组容器
    addComponent(groupContainer);
    addToHistory(components);
  };

  // 处理组件树中的组件删除
  const handleDeleteComponent = (id: string) => {
    deleteComponent(id);
    addToHistory(components);

    if (selectedComponent?.id === id) {
      selectComponent(null);
    }
  };

  // 处理组件可见性切换
  const handleToggleVisibility = (id: string, visible: boolean) => {
    updateComponent(id, {
      properties: {
        ...components.find((c) => c.id === id)?.properties,
        visible: !visible,
      },
    });
    addToHistory(components);
  };

  // 处理组件移动
  const handleMoveComponent = (id: string, targetParentId: string | null) => {
    const componentToMove = components.find((comp) => comp.id === id);
    if (!componentToMove) return;

    // 简化移动逻辑，直接更新父组件ID
    updateComponent(id, {
      parentId: targetParentId,
      position: targetParentId ? { x: 10, y: 10 } : componentToMove.position,
    });
    addToHistory(components);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen flex-col">
        <Header>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={undo}
              disabled={!canUndo()}
            >
              <Undo2 className="mr-2 h-4 w-4" />
              撤销
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={redo}
              disabled={!canRedo()}
            >
              <Redo2 className="mr-2 h-4 w-4" />
              重做
            </Button>
            <Button variant="outline" size="sm" onClick={togglePreviewMode}>
              <Eye className="mr-2 h-4 w-4" />
              {isPreviewMode ? "退出预览" : "预览"}
            </Button>
            <ResponsiveControls />
            <TemplateGallery />
            <FormBuilder />
            <ComponentGrouping
              components={components}
              onGroupComponents={handleGroupComponents}
            />
            <AnimationEditor
              componentId={selectedComponent?.id || null}
              onApplyAnimation={handleApplyAnimation}
            />
            <ThemeEditor />
            <Collaboration projectName={projectName} />
            <ComponentLibraryManager
              customComponents={[]} // TODO: 从store获取
              onAddComponent={handleAddCustomComponent}
              onRemoveComponent={handleRemoveCustomComponent}
              onImportComponents={handleImportComponents}
              existingComponents={components}
            />
            <CodeExport />
          </div>
        </Header>
        <div className="flex flex-1 overflow-hidden">
          {!isPreviewMode && (
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-64 border-r flex flex-col"
            >
              <TabsList className="grid w-full grid-cols-3 shrink-0">
                <TabsTrigger value="components">组件</TabsTrigger>
                <TabsTrigger value="tree">组件树</TabsTrigger>
                <TabsTrigger value="data">数据</TabsTrigger>
              </TabsList>
              <TabsContent
                value="components"
                className="flex-1 p-0 data-[state=active]:flex data-[state=active]:flex-col overflow-hidden"
              >
                <ComponentPanel />
              </TabsContent>
              <TabsContent
                value="tree"
                className="flex-1 p-0 data-[state=active]:flex data-[state=active]:flex-col overflow-hidden"
              >
                <ComponentTree />
              </TabsContent>
              <TabsContent
                value="data"
                className="flex-1 p-0 data-[state=active]:flex data-[state=active]:flex-col overflow-hidden"
              >
                <DataPanel />
              </TabsContent>
            </Tabs>
          )}
          <div
            className="flex-1 overflow-auto"
            style={{
              maxWidth: isPreviewMode ? viewportWidth + "px" : "none",
              margin: isPreviewMode ? "0 auto" : "0",
              transition: "max-width 0.3s ease",
            }}
          >
            <Canvas />
          </div>
          {!isPreviewMode && <PropertiesPanel />}
        </div>
      </div>
    </DndProvider>
  );
}
