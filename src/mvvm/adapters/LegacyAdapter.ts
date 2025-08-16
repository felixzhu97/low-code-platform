/**
 * Legacy Adapter - 兼容现有代码的适配器
 * 将MVVM架构的接口适配到现有的组件接口
 */

import { ComponentModel } from '../models/ComponentModel';
import { PlatformModel, ThemeModel } from '../models/PlatformModel';
import { Component, ThemeConfig } from '@/domain/entities/types';

export class LegacyAdapter {
  // 将ComponentModel转换为Legacy Component
  static componentModelToLegacy(model: ComponentModel): Component {
    return {
      id: model.id,
      type: model.type,
      name: model.name,
      position: model.position,
      properties: model.properties,
      children: model.children?.map(child => this.componentModelToLegacy(child)),
      parentId: model.parentId,
      dataSource: model.dataSource,
      dataMapping: model.dataMapping,
    };
  }

  // 将Legacy Component转换为ComponentModel
  static legacyToComponentModel(component: Component): ComponentModel {
    return {
      id: component.id,
      type: component.type,
      name: component.name,
      position: component.position,
      properties: component.properties,
      children: component.children?.map(child => this.legacyToComponentModel(child)),
      parentId: component.parentId,
      dataSource: component.dataSource,
      dataMapping: component.dataMapping,
    };
  }

  // 将ThemeModel转换为Legacy ThemeConfig
  static themeModelToLegacy(model: ThemeModel): ThemeConfig {
    return {
      primaryColor: model.primaryColor,
      secondaryColor: model.secondaryColor,
      backgroundColor: model.backgroundColor,
      textColor: model.textColor,
      fontFamily: model.fontFamily,
      borderRadius: model.borderRadius,
      spacing: model.spacing,
    };
  }

  // 将Legacy ThemeConfig转换为ThemeModel
  static legacyToThemeModel(config: ThemeConfig): ThemeModel {
    return {
      primaryColor: config.primaryColor,
      secondaryColor: config.secondaryColor,
      backgroundColor: config.backgroundColor,
      textColor: config.textColor,
      fontFamily: config.fontFamily,
      borderRadius: config.borderRadius,
      spacing: config.spacing,
    };
  }

  // 批量转换组件数组
  static componentModelsToLegacy(models: ComponentModel[]): Component[] {
    return models.map(model => this.componentModelToLegacy(model));
  }

  static legacyToComponentModels(components: Component[]): ComponentModel[] {
    return components.map(component => this.legacyToComponentModel(component));
  }

  // 创建兼容的历史记录状态
  static createLegacyHistoryState(components: ComponentModel[]) {
    return {
      past: [] as Component[][],
      present: this.componentModelsToLegacy(components),
      future: [] as Component[][],
    };
  }

  // 创建兼容的平台状态
  static createLegacyPlatformState(platformModel: PlatformModel) {
    return {
      selectedComponent: platformModel.selectedComponentId 
        ? this.componentModelToLegacy(
            platformModel.components.find(c => c.id === platformModel.selectedComponentId)!
          ) 
        : null,
      activeTab: platformModel.activeTab,
      componentsHistory: this.createLegacyHistoryState(platformModel.components),
      previewMode: platformModel.previewMode,
      projectName: platformModel.projectName,
      viewportWidth: platformModel.viewport.width,
      activeDevice: platformModel.viewport.device,
      theme: this.themeModelToLegacy(platformModel.theme),
      customComponents: this.componentModelsToLegacy(platformModel.customComponents),
    };
  }
}