"use client";

import { useEffect, useCallback } from "react";
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
import { usePlatformState } from "@/presentation/hooks/use-platform-state";
import { DataPanel } from "@/presentation/components/data";

export default function LowCodePlatform() {
  const {
    state,
    updateState,
    updateComponentsHistory,
    handleUndo,
    handleRedo,
  } = usePlatformState();

  const {
    selectedComponent,
    activeTab,
    componentsHistory,
    previewMode,
    projectName,
    viewportWidth,
    activeDevice,
    theme,
    customComponents,
  } = state;

  const components = componentsHistory.present;

  // 添加调试日志
  useEffect(() => {
    console.log("Current components:", components);
  }, [components]);

  const handleAddCustomComponent = (component: any) => {
    updateState({ customComponents: [...customComponents, component] });
  };

  const handleRemoveCustomComponent = (componentId: string) => {
    updateState({
      customComponents: customComponents.filter((c) => c.id !== componentId),
    });
  };

  const handleImportComponents = (components: any[]) => {
    updateState({ customComponents: [...customComponents, ...components] });
  };

  const handleUpdateComponent = (id: string, properties: any) => {
    const updatedComponents = components.map((component) => {
      if (component.id === id) {
        return { ...component, properties };
      }
      return component;
    });

    updateComponentsHistory(updatedComponents);
  };

  const handleSelectComponent = (component: Component | null) => {
    updateState({ selectedComponent: component });
  };

  const togglePreviewMode = () => {
    updateState({
      previewMode: !previewMode,
      selectedComponent: !previewMode ? null : selectedComponent,
    });
  };

  const handleViewportChange = (width: number, device: string) => {
    updateState({ viewportWidth: width, activeDevice: device });
  };

  const handleThemeChange = (newTheme: ThemeConfig) => {
    updateState({ theme: newTheme });
  };

  // 处理模板选择
  const handleSelectTemplate = useCallback(
    (templateComponents: Component[]) => {
      try {
        const processedComponents =
          TemplateService.applyTemplate(templateComponents);
        updateComponentsHistory(processedComponents);

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
    [updateComponentsHistory]
  );

  const handleAddForm = (formComponents: Component[]) => {
    updateComponentsHistory([...components, ...formComponents]);
  };

  const handleApplyAnimation = (componentId: string, animation: any) => {
    const updatedComponents = components.map((component) => {
      if (component.id === componentId) {
        return {
          ...component,
          properties: {
            ...component.properties,
            animation,
          },
        };
      }
      return component;
    });

    updateComponentsHistory(updatedComponents);
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
    updateComponentsHistory([...remainingComponents, groupContainer]);
  };

  // 处理组件树中的组件删除
  const handleDeleteComponent = (id: string) => {
    // 递归删除组件及其子组件
    const deleteComponentAndChildren = (
      componentId: string,
      comps: Component[]
    ): Component[] => {
      // 找出所有子组件ID
      const childIds = comps
        .filter((comp) => comp.parentId === componentId)
        .map((comp) => comp.id);

      // 递归删除所有子组件
      let updatedComps = [...comps];
      for (const childId of childIds) {
        updatedComps = deleteComponentAndChildren(childId, updatedComps);
      }

      // 删除当前组件
      return updatedComps.filter((comp) => comp.id !== componentId);
    };

    const newComponents = deleteComponentAndChildren(id, components);
    updateComponentsHistory(newComponents);

    if (selectedComponent?.id === id) {
      updateState({ selectedComponent: null });
    }
  };

  // 处理组件可见性切换
  const handleToggleVisibility = (id: string, visible: boolean) => {
    const updatedComponents = components.map((component) => {
      if (component.id === id) {
        return {
          ...component,
          properties: {
            ...component.properties,
            visible: !visible,
          },
        };
      }
      return component;
    });

    updateComponentsHistory(updatedComponents);
  };

  // 处理组件移动
  const handleMoveComponent = (id: string, targetParentId: string | null) => {
    const componentToMove = components.find((comp) => comp.id === id);
    if (!componentToMove) return;

    // 如果目标是画布（targetParentId为null）
    if (targetParentId === null) {
      // 如果组件已经在画布上，不需要移动
      if (componentToMove.parentId === null) return;

      // 找到当前父组件，计算全局位置
      const calculateGlobalPosition = (
        comp: Component
      ): { x: number; y: number } => {
        if (!comp.parentId) {
          return comp.position || { x: 0, y: 0 };
        }

        const parent = components.find((p) => p.id === comp.parentId);
        if (!parent) {
          return comp.position || { x: 0, y: 0 };
        }

        const parentPos = calculateGlobalPosition(parent);
        return {
          x: (comp.position?.x || 0) + parentPos.x,
          y: (comp.position?.y || 0) + parentPos.y,
        };
      };

      const globalPosition = calculateGlobalPosition(componentToMove);

      // 更新组件，移动到画布上
      const updatedComponents = components.map((comp) => {
        if (comp.id === id) {
          return {
            ...comp,
            parentId: null,
            position: globalPosition,
          };
        }
        return comp;
      });

      updateComponentsHistory(updatedComponents);
    } else {
      // 移动到目标容器中
      const updatedComponents = components.map((comp) => {
        if (comp.id === id) {
          return {
            ...comp,
            parentId: targetParentId,
            position: { x: 10, y: 10 }, // 设置相对于容器的初始位置
          };
        }
        return comp;
      });

      updateComponentsHistory(updatedComponents);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen flex-col">
        <Header>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleUndo}
              disabled={componentsHistory.past.length === 0}
            >
              <Undo2 className="mr-2 h-4 w-4" />
              撤销
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRedo}
              disabled={componentsHistory.future.length === 0}
            >
              <Redo2 className="mr-2 h-4 w-4" />
              重做
            </Button>
            <Button variant="outline" size="sm" onClick={togglePreviewMode}>
              <Eye className="mr-2 h-4 w-4" />
              {previewMode ? "退出预览" : "预览"}
            </Button>
            <ResponsiveControls onViewportChange={handleViewportChange} />
            <TemplateGallery
              onSelectTemplate={handleSelectTemplate}
              theme={theme}
            />
            <FormBuilder onAddForm={handleAddForm} />
            <ComponentGrouping
              components={components}
              onGroupComponents={handleGroupComponents}
            />
            <AnimationEditor
              componentId={selectedComponent?.id || null}
              onApplyAnimation={handleApplyAnimation}
            />
            <ThemeEditor theme={theme} onThemeChange={handleThemeChange} />
            <Collaboration projectName={projectName} />
            <ComponentLibraryManager
              customComponents={customComponents}
              onAddComponent={handleAddCustomComponent}
              onRemoveComponent={handleRemoveCustomComponent}
              onImportComponents={handleImportComponents}
              existingComponents={components}
            />
            <CodeExport components={components} />
          </div>
        </Header>
        <div className="flex flex-1 overflow-hidden">
          {!previewMode && (
            <Tabs
              value={activeTab}
              onValueChange={(value) => updateState({ activeTab: value })}
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
                <ComponentTree
                  components={components}
                  selectedId={selectedComponent?.id || null}
                  onSelectComponent={handleSelectComponent}
                  onDeleteComponent={handleDeleteComponent}
                  onToggleVisibility={handleToggleVisibility}
                  onMoveComponent={handleMoveComponent}
                />
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
              maxWidth: previewMode ? viewportWidth + "px" : "none",
              margin: previewMode ? "0 auto" : "0",
              transition: "max-width 0.3s ease",
            }}
          >
            <Canvas
              onSelectComponent={handleSelectComponent}
              isPreviewMode={previewMode}
              theme={theme}
              viewportWidth={viewportWidth}
              activeDevice={activeDevice}
              components={components}
              onUpdateComponents={updateComponentsHistory}
            />
          </div>
          {!previewMode && (
            <PropertiesPanel
              selectedComponent={selectedComponent}
              onUpdateComponent={handleUpdateComponent}
            />
          )}
        </div>
      </div>
    </DndProvider>
  );
}
