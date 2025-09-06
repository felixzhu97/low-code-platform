/**
 * Low Code Platform View - MVVM架构的主视图组件
 * 使用ViewModel进行状态管理，保持View的纯净性
 */

"use client";

import React, { useCallback } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

// MVVM Hooks
import { usePlatformViewModel } from "../hooks/usePlatformViewModel";
import { useComponentViewModel } from "../hooks/useComponentViewModel";

// Legacy Adapter
import { LegacyAdapter } from "../adapters/LegacyAdapter";

// UI Components (保持现有的组件)
import { ComponentPanel } from "@/presentation/components/component-panel";
import { Canvas } from "@/presentation/components/canvas";
import { PropertiesPanel } from "@/presentation/components/properties-panel";
import { Header } from "@/presentation/components/header";
import { DataPanel } from "@/presentation/components/data-panel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/presentation/components/ui/tabs";
import { CodeExport } from "@/presentation/components/code-export";
import { TemplateGallery } from "@/presentation/components/template-gallery";
import { ResponsiveControls } from "@/presentation/components/responsive-controls";
import { ThemeEditor } from "@/presentation/components/theme-editor";
import { FormBuilder } from "@/presentation/components/form-builder";
import { AnimationEditor } from "@/presentation/components/animation-editor";
import { Collaboration } from "@/presentation/components/collaboration";
import { ComponentLibraryManager } from "@/presentation/components/component-library-manager";
import { ComponentGrouping } from "@/presentation/components/component-grouping";
import { ComponentTree } from "@/presentation/components/component-tree";
import { Button } from "@/presentation/components/ui/button";
import { Eye, Undo2, Redo2 } from "lucide-react";
import { toast } from "@/presentation/components/ui/use-toast";

// Types
import { Component } from "@/domain/entities/types";

export default function LowCodePlatformView() {
  // 使用MVVM Hooks
  const platformViewModel = usePlatformViewModel();
  const componentViewModel = useComponentViewModel();

  const {
    state,
    undo,
    redo,
    canUndo,
    canRedo,
    setActiveTab,
    setPreviewMode,
    setViewport,
    setTheme,
    addCustomComponent,
    removeCustomComponent,
    importCustomComponents,
    applyTemplate,
  } = platformViewModel;

  const {
    components,
    selectedComponent,
    selectComponent,
    updateComponentProperties,
    deleteComponent,
    toggleComponentVisibility,
    groupComponents,
    setComponents,
  } = componentViewModel;

  // 转换为Legacy格式以兼容现有组件
  const legacyComponents = LegacyAdapter.componentModelsToLegacy(components);
  const legacySelectedComponent = selectedComponent 
    ? LegacyAdapter.componentModelToLegacy(selectedComponent)
    : null;
  const legacyTheme = LegacyAdapter.themeModelToLegacy(state.theme);

  // 事件处理器
  const handleSelectComponent = useCallback((component: Component | null) => {
    selectComponent(component?.id || null);
  }, [selectComponent]);

  const handleUpdateComponent = useCallback((id: string, properties: any) => {
    updateComponentProperties(id, properties);
  }, [updateComponentProperties]);

  const handleTogglePreview = useCallback(() => {
    setPreviewMode(!state.previewMode);
  }, [setPreviewMode, state.previewMode]);

  const handleViewportChange = useCallback((width: number, device: string) => {
    setViewport({ width, device: device as any });
  }, [setViewport]);

  const handleThemeChange = useCallback((newTheme: any) => {
    const themeModel = LegacyAdapter.legacyToThemeModel(newTheme);
    setTheme(themeModel);
  }, [setTheme]);

  const handleSelectTemplate = useCallback((templateComponents: Component[]) => {
    try {
      const componentModels = LegacyAdapter.legacyToComponentModels(templateComponents);
      applyTemplate(componentModels);
      
      toast({
        title: "模板应用成功",
        description: `已添加 ${templateComponents.length} 个组件到画布`,
      });
    } catch (error) {
      console.error("应用模板时出错:", error);
      toast({
        title: "模板应用失败",
        description: "处理模板时发生错误",
        variant: "destructive",
      });
    }
  }, [applyTemplate]);

  const handleAddForm = useCallback((formComponents: Component[]) => {
    const componentModels = LegacyAdapter.legacyToComponentModels(formComponents);
    const updatedComponents = [...components, ...componentModels];
    setComponents(updatedComponents);
  }, [components, setComponents]);

  const handleApplyAnimation = useCallback((componentId: string, animation: any) => {
    updateComponentProperties(componentId, { animation });
  }, [updateComponentProperties]);

  const handleGroupComponents = useCallback((componentIds: string[], groupName: string) => {
    const groupedComponent = groupComponents(componentIds, groupName);
    if (groupedComponent) {
      toast({
        title: "组件分组成功",
        description: `已创建组: ${groupName}`,
      });
    }
  }, [groupComponents]);

  const handleDeleteComponent = useCallback((id: string) => {
    deleteComponent(id);
  }, [deleteComponent]);

  const handleToggleVisibility = useCallback((id: string, visible: boolean) => {
    toggleComponentVisibility(id);
  }, [toggleComponentVisibility]);

  const handleMoveComponent = useCallback((id: string, targetParentId: string | null) => {
    // 这里可以实现更复杂的移动逻辑
    console.log('Move component:', id, 'to parent:', targetParentId);
  }, []);

  const handleAddCustomComponent = useCallback((component: any) => {
    const componentModel = LegacyAdapter.legacyToComponentModel(component);
    addCustomComponent(componentModel);
  }, [addCustomComponent]);

  const handleRemoveCustomComponent = useCallback((componentId: string) => {
    removeCustomComponent(componentId);
  }, [removeCustomComponent]);

  const handleImportComponents = useCallback((components: any[]) => {
    const componentModels = LegacyAdapter.legacyToComponentModels(components);
    importCustomComponents(componentModels);
  }, [importCustomComponents]);

  const handleUpdateComponents = useCallback((newComponents: Component[]) => {
    const componentModels = LegacyAdapter.legacyToComponentModels(newComponents);
    setComponents(componentModels);
  }, [setComponents]);

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
            <Button variant="outline" size="sm" onClick={handleTogglePreview}>
              <Eye className="mr-2 h-4 w-4" />
              {state.previewMode ? "退出预览" : "预览"}
            </Button>
            <ResponsiveControls onViewportChange={handleViewportChange} />
            <TemplateGallery
              onSelectTemplate={handleSelectTemplate}
              theme={legacyTheme}
            />
            <FormBuilder onAddForm={handleAddForm} />
            <ComponentGrouping
              components={legacyComponents}
              onGroupComponents={handleGroupComponents}
            />
            <AnimationEditor
              componentId={selectedComponent?.id || null}
              onApplyAnimation={handleApplyAnimation}
            />
            <ThemeEditor theme={legacyTheme} onThemeChange={handleThemeChange} />
            <Collaboration projectName={state.projectName} />
            <ComponentLibraryManager
              customComponents={LegacyAdapter.componentModelsToLegacy(state.customComponents)}
              onAddComponent={handleAddCustomComponent}
              onRemoveComponent={handleRemoveCustomComponent}
              onImportComponents={handleImportComponents}
              existingComponents={legacyComponents}
            />
            <CodeExport components={legacyComponents} />
          </div>
        </Header>
        
        <div className="flex flex-1 overflow-hidden">
          {!state.previewMode && (
            <Tabs
              value={state.activeTab}
              onValueChange={(value) => setActiveTab(value as any)}
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
                  components={legacyComponents}
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
              maxWidth: state.previewMode ? state.viewport.width + "px" : "none",
              margin: state.previewMode ? "0 auto" : "0",
              transition: "max-width 0.3s ease",
            }}
          >
            <Canvas
              onSelectComponent={handleSelectComponent}
              isPreviewMode={state.previewMode}
              theme={legacyTheme}
              viewportWidth={state.viewport.width}
              activeDevice={state.viewport.device}
              components={legacyComponents}
              onUpdateComponents={handleUpdateComponents}
            />
          </div>
          
          {!state.previewMode && (
            <PropertiesPanel
              selectedComponent={legacySelectedComponent}
              onUpdateComponent={handleUpdateComponent}
            />
          )}
        </div>
      </div>
    </DndProvider>
  );
}