/**
 * Platform Model - 平台数据模型
 * 负责整个平台的状态数据结构定义
 */

import { ComponentModel } from './ComponentModel';

export interface ThemeModel {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  borderRadius: string;
  spacing: string;
}

export interface DataSourceModel {
  id: string;
  name: string;
  type: 'static' | 'api' | 'database';
  data: any;
}

export interface ViewportModel {
  width: number;
  height: number;
  device: 'desktop' | 'tablet' | 'mobile';
}

export interface PlatformModel {
  // 组件相关
  components: ComponentModel[];
  selectedComponentId: string | null;
  
  // UI状态
  activeTab: 'components' | 'tree' | 'data';
  previewMode: boolean;
  viewport: ViewportModel;
  
  // 项目配置
  projectName: string;
  theme: ThemeModel;
  
  // 数据源
  dataSources: DataSourceModel[];
  
  // 自定义组件库
  customComponents: ComponentModel[];
}

export const createDefaultPlatformModel = (): PlatformModel => ({
  components: [],
  selectedComponentId: null,
  activeTab: 'components',
  previewMode: false,
  viewport: {
    width: 1280,
    height: 720,
    device: 'desktop',
  },
  projectName: '我的低代码项目',
  theme: {
    primaryColor: '#0070f3',
    secondaryColor: '#6c757d',
    backgroundColor: '#ffffff',
    textColor: '#000000',
    fontFamily: 'system-ui, sans-serif',
    borderRadius: '0.375rem',
    spacing: '1rem',
  },
  dataSources: [],
  customComponents: [],
});