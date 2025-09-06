# API 参考文档

## 概述

本文档提供了 Felix 低代码平台的完整 API 参考，包括核心接口、组件 API、数据管理 API 和扩展 API。

## 核心 API

### PlatformViewModel

平台视图模型，负责整个平台的状态管理。

```typescript
interface PlatformViewModel {
  // 状态属性
  state: PlatformModel;
  
  // 历史管理
  undo(): void;
  redo(): void;
  canUndo(): boolean;
  canRedo(): boolean;
  
  // UI 状态管理
  setActiveTab(tab: 'components' | 'tree' | 'data'): void;
  setPreviewMode(enabled: boolean): void;
  setViewport(viewport: ViewportModel): void;
  
  // 主题管理
  setTheme(theme: ThemeModel): void;
  
  // 项目管理
  setProjectName(name: string): void;
  
  // 自定义组件管理
  addCustomComponent(component: ComponentModel): void;
  removeCustomComponent(componentId: string): void;
  importCustomComponents(components: ComponentModel[]): void;
  
  // 模板管理
  applyTemplate(components: ComponentModel[]): void;
}
```

### ComponentViewModel

组件视图模型，负责组件相关的状态管理。

```typescript
interface ComponentViewModel {
  // 状态属性
  components: ComponentModel[];
  selectedComponent: ComponentModel | null;
  
  // 组件选择
  selectComponent(componentId: string | null): void;
  
  // 组件操作
  addComponent(component: ComponentModel): void;
  updateComponentProperties(id: string, properties: Partial<ComponentProperties>): void;
  deleteComponent(id: string): void;
  duplicateComponent(id: string): ComponentModel | null;
  
  // 组件层级管理
  moveComponent(id: string, targetParentId: string | null, index?: number): void;
  toggleComponentVisibility(id: string): void;
  
  // 组件分组
  groupComponents(componentIds: string[], groupName: string): ComponentModel | null;
  ungroupComponents(groupId: string): ComponentModel[];
  
  // 批量操作
  setComponents(components: ComponentModel[]): void;
  clearComponents(): void;
}
```

## 组件 API

### ComponentModel

组件数据模型的核心接口。

```typescript
interface ComponentModel {
  id: string;                              // 组件唯一标识
  type: string;                            // 组件类型
  name: string;                            // 组件名称
  position?: Position;                     // 组件位置
  properties?: ComponentProperties;        // 组件属性
  children?: ComponentModel[];             // 子组件列表
  parentId?: string | null;               // 父组件ID
  dataSource?: string | null;             // 数据源ID
  dataMapping?: Record<string, string>;   // 数据字段映射
}

interface Position {
  x: number;
  y: number;
}

interface ComponentProperties {
  [key: string]: any;
  visible?: boolean;
  animation?: AnimationConfig;
  style?: CSSProperties;
  className?: string;
}
```

### ComponentDefinition

组件定义接口，用于注册新组件。

```typescript
interface ComponentDefinition {
  // 基本信息
  id: string;
  name: string;
  type: string;
  category: ComponentCategory;
  
  // 显示信息
  displayName: string;
  description: string;
  icon: React.ReactNode;
  
  // 配置信息
  defaultProps: Record<string, any>;
  propSchema: PropSchema;
  
  // 行为配置
  isContainer: boolean;
  allowedChildren?: string[];
  maxChildren?: number;
  
  // 渲染函数
  render: (props: any, children?: React.ReactNode) => React.ReactNode;
  
  // 生命周期钩子
  onCreate?: (component: ComponentModel) => void;
  onUpdate?: (component: ComponentModel, prevProps: any) => void;
  onDelete?: (component: ComponentModel) => void;
}
```

### PropSchema

属性模式定义，用于配置组件属性编辑器。

```typescript
interface PropSchema {
  [propName: string]: PropDefinition;
}

interface PropDefinition {
  type: PropType;
  label: string;
  description?: string;
  defaultValue?: any;
  required?: boolean;
  options?: Array<{ label: string; value: any }>;
  validation?: ValidationRule[];
  group?: string;
  conditional?: ConditionalRule;
  editor?: EditorConfig;
}

type PropType = 
  | 'string' 
  | 'number' 
  | 'boolean' 
  | 'object' 
  | 'array' 
  | 'color' 
  | 'image' 
  | 'select' 
  | 'multiSelect'
  | 'date'
  | 'dateRange'
  | 'json';
```

## 数据管理 API

### DataSource

数据源管理接口。

```typescript
interface DataSource {
  id: string;
  name: string;
  type: DataSourceType;
  config: DataSourceConfig;
  schema?: DataSchema;
  status: 'connected' | 'disconnected' | 'error';
  lastUpdated?: Date;
}

type DataSourceType = 'static' | 'api' | 'database' | 'realtime';

interface DataSourceConfig {
  // 静态数据配置
  data?: any;
  
  // API 配置
  url?: string;
  method?: HttpMethod;
  headers?: Record<string, string>;
  params?: Record<string, any>;
  
  // 数据库配置
  connection?: string;
  query?: string;
  
  // 实时数据配置
  endpoint?: string;
  protocol?: 'websocket' | 'sse' | 'polling';
  interval?: number;
  
  // 通用配置
  transformer?: string;
  cache?: CacheConfig;
  errorHandling?: ErrorHandlingConfig;
}
```

### DataBinding

数据绑定配置接口。

```typescript
interface DataBinding {
  id: string;
  sourceId: string;                    // 数据源ID
  fieldPath: string;                   // 字段路径
  targetComponentId: string;           // 目标组件ID
  targetProp: string;                  // 目标属性
  transformer?: DataTransformer;       // 数据转换器
  defaultValue?: any;                  // 默认值
  condition?: string;                  // 绑定条件
  refreshInterval?: number;            // 刷新间隔
}

interface DataTransformer {
  type: 'map' | 'filter' | 'sort' | 'group' | 'custom';
  config: Record<string, any>;
  script?: string;
}
```

## 事件系统 API

### EventHandler

事件处理器接口。

```typescript
interface EventHandler {
  id: string;
  componentId: string;
  eventType: EventType;
  condition?: string;
  actions: EventAction[];
  enabled: boolean;
}

type EventType = 
  | 'click' 
  | 'change' 
  | 'submit' 
  | 'focus' 
  | 'blur' 
  | 'mouseEnter' 
  | 'mouseLeave'
  | 'keyDown'
  | 'keyUp'
  | 'custom';

interface EventAction {
  type: ActionType;
  config: Record<string, any>;
  delay?: number;
  condition?: string;
}

type ActionType = 
  | 'updateState' 
  | 'callApi' 
  | 'navigate' 
  | 'showMessage' 
  | 'openModal' 
  | 'closeModal'
  | 'updateComponent'
  | 'triggerEvent'
  | 'custom';
```

## 主题系统 API

### ThemeModel

主题配置接口。

```typescript
interface ThemeModel {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  fontSize: string;
  borderRadius: string;
  spacing: string;
  shadows: ShadowConfig;
  breakpoints: BreakpointConfig;
  customProperties?: Record<string, string>;
}

interface ShadowConfig {
  small: string;
  medium: string;
  large: string;
  extraLarge: string;
}

interface BreakpointConfig {
  mobile: number;
  tablet: number;
  desktop: number;
  wide: number;
}
```

## 插件系统 API

### Plugin

插件接口定义。

```typescript
interface Plugin {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  
  // 插件生命周期
  install(platform: PlatformAPI): void;
  uninstall(platform: PlatformAPI): void;
  
  // 插件配置
  config?: PluginConfig;
  
  // 插件依赖
  dependencies?: string[];
  
  // 插件权限
  permissions?: PluginPermission[];
}

interface PlatformAPI {
  // 组件管理
  registerComponent(definition: ComponentDefinition): void;
  unregisterComponent(componentId: string): void;
  
  // 数据源管理
  registerDataSource(source: DataSource): void;
  unregisterDataSource(sourceId: string): void;
  
  // 事件系统
  addEventListener(handler: EventHandler): void;
  removeEventListener(handlerId: string): void;
  
  // 主题系统
  registerTheme(theme: ThemeModel): void;
  unregisterTheme(themeId: string): void;
  
  // 工具栏扩展
  addToolbarItem(item: ToolbarItem): void;
  removeToolbarItem(itemId: string): void;
  
  // 面板扩展
  addPanel(panel: PanelDefinition): void;
  removePanel(panelId: string): void;
}
```

## 工具函数 API

### ComponentFactory

组件工厂函数。

```typescript
class ComponentFactory {
  static create(
    type: string,
    name: string,
    position?: Position,
    properties?: ComponentProperties
  ): ComponentModel;
  
  static clone(component: ComponentModel): ComponentModel;
  
  static updateProperties(
    component: ComponentModel,
    properties: Partial<ComponentProperties>
  ): ComponentModel;
  
  static validateComponent(component: ComponentModel): ValidationResult;
  
  static serializeComponent(component: ComponentModel): string;
  
  static deserializeComponent(data: string): ComponentModel;
}
```

### DataUtils

数据处理工具函数。

```typescript
class DataUtils {
  static transformData(data: any, transformer: DataTransformer): any;
  
  static validateData(data: any, schema: DataSchema): ValidationResult;
  
  static mergeData(target: any, source: any): any;
  
  static extractFields(data: any, paths: string[]): Record<string, any>;
  
  static formatData(data: any, format: string): string;
  
  static filterData(data: any[], condition: string): any[];
  
  static sortData(data: any[], field: string, order: 'asc' | 'desc'): any[];
  
  static groupData(data: any[], field: string): Record<string, any[]>;
}
```

### ValidationUtils

验证工具函数。

```typescript
class ValidationUtils {
  static validateRequired(value: any): boolean;
  
  static validateType(value: any, type: string): boolean;
  
  static validateRange(value: number, min: number, max: number): boolean;
  
  static validatePattern(value: string, pattern: RegExp): boolean;
  
  static validateEmail(email: string): boolean;
  
  static validateUrl(url: string): boolean;
  
  static validateJson(json: string): boolean;
  
  static validateComponent(component: ComponentModel): ValidationResult;
  
  static validateDataSource(source: DataSource): ValidationResult;
}
```

## 错误处理 API

### ErrorTypes

错误类型定义。

```typescript
class ComponentError extends Error {
  constructor(
    message: string,
    public componentId: string,
    public errorCode: string
  ) {
    super(message);
    this.name = 'ComponentError';
  }
}

class DataSourceError extends Error {
  constructor(
    message: string,
    public sourceId: string,
    public errorCode: string
  ) {
    super(message);
    this.name = 'DataSourceError';
  }
}

class ValidationError extends Error {
  constructor(
    message: string,
    public field: string,
    public value: any
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}
```

### ErrorHandler

错误处理器接口。

```typescript
interface ErrorHandler {
  canHandle(error: Error): boolean;
  handle(error: Error, context: any): Promise<void>;
  getRecoveryActions(error: Error): RecoveryAction[];
}

interface RecoveryAction {
  label: string;
  action: () => void;
  type: 'retry' | 'ignore' | 'reset' | 'custom';
}
```

## 类型定义

### 通用类型

```typescript
// 验证结果
interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

// 验证规则
interface ValidationRule {
  type: 'required' | 'min' | 'max' | 'pattern' | 'custom';
  value?: any;
  message: string;
  validator?: (value: any) => boolean;
}

// 条件规则
interface ConditionalRule {
  field: string;
  operator: '==' | '!=' | '>' | '<' | '>=' | '<=' | 'in' | 'notIn';
  value: any;
}

// 编辑器配置
interface EditorConfig {
  type: 'input' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'color' | 'image' | 'json';
  props?: Record<string, any>;
}

// 缓存配置
interface CacheConfig {
  enabled: boolean;
  ttl: number;
  maxSize: number;
  strategy: 'lru' | 'fifo' | 'ttl';
}

// 错误处理配置
interface ErrorHandlingConfig {
  retry: {
    maxAttempts: number;
    delay: number;
    backoff: 'linear' | 'exponential';
  };
  fallback?: any;
  onError?: (error: Error) => void;
}
```

## 使用示例

### 注册自定义组件

```typescript
import { registerComponent } from '@/mvvm';

const customButton: ComponentDefinition = {
  id: 'custom-button',
  name: 'CustomButton',
  type: 'custom-button',
  category: 'custom',
  displayName: '自定义按钮',
  description: '带有特殊样式的按钮组件',
  icon: <ButtonIcon />,
  isContainer: false,
  defaultProps: {
    text: '点击我',
    variant: 'primary',
    size: 'medium',
  },
  propSchema: {
    text: {
      type: 'string',
      label: '按钮文本',
      required: true,
    },
    variant: {
      type: 'select',
      label: '按钮样式',
      options: [
        { label: '主要', value: 'primary' },
        { label: '次要', value: 'secondary' },
      ],
    },
    size: {
      type: 'select',
      label: '按钮大小',
      options: [
        { label: '小', value: 'small' },
        { label: '中', value: 'medium' },
        { label: '大', value: 'large' },
      ],
    },
  },
  render: (props) => (
    <button 
      className={`btn btn-${props.variant} btn-${props.size}`}
    >
      {props.text}
    </button>
  ),
};

registerComponent(customButton);
```

### 创建数据源

```typescript
import { createDataSource } from '@/mvvm';

const apiDataSource: DataSource = {
  id: 'user-api',
  name: '用户API',
  type: 'api',
  config: {
    url: 'https://api.example.com/users',
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ${token}',
    },
    cache: {
      enabled: true,
      ttl: 300000, // 5分钟
    },
  },
  status: 'disconnected',
};

createDataSource(apiDataSource);
```

### 添加事件处理器

```typescript
import { addEventListener } from '@/mvvm';

const buttonClickHandler: EventHandler = {
  id: 'button-click-handler',
  componentId: 'submit-button',
  eventType: 'click',
  actions: [
    {
      type: 'callApi',
      config: {
        sourceId: 'user-api',
        method: 'POST',
        data: '${form.values}',
      },
    },
    {
      type: 'showMessage',
      config: {
        type: 'success',
        message: '提交成功！',
      },
    },
  ],
  enabled: true,
};

addEventListener(buttonClickHandler);
```