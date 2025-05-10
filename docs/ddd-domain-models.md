# 低代码平台领域模型详解

本文档详细描述了低代码平台各个领域的核心模型，为DDD架构实施提供参考。

## 1. 组件领域 (Component Domain)

组件领域是低代码平台的核心，负责组件的定义、管理和操作。

### 核心实体

```typescript
// 组件实体
export interface Component {
  id: string;                            // 组件唯一标识
  type: string;                          // 组件类型
  name: string;                          // 组件名称
  position?: ComponentPosition;          // 组件位置
  properties?: Record<string, any>;      // 组件属性
  children?: Component[];                // 子组件
  parentId?: string | null;              // 父组件ID
  dataSource?: string | null;            // 绑定的数据源
  dataMapping?: Record<string, string>;  // 数据映射关系
}

// 组件位置（值对象）
export interface ComponentPosition {
  x: number;
  y: number;
}

// 组件类别
export interface ComponentCategory {
  id: string;                            // 类别ID
  name: string;                          // 类别名称
  icon: string;                          // 类别图标
  components: ComponentDefinition[];     // 该类别下的组件定义
}

// 组件定义
export interface ComponentDefinition {
  id: string;                            // 定义ID
  name: string;                          // 组件名称
  type: string;                          // 组件类型
  isContainer?: boolean;                 // 是否为容器组件
  defaultProperties?: Record<string, any>; // 默认属性
}
```

### 核心服务

```typescript
// 组件工厂
export interface ComponentFactory {
  createComponent(type: string, options?: Partial<Component>): Component;
  cloneComponent(component: Component): Component;
}

// 组件注册服务
export interface ComponentRegistry {
  registerComponentType(definition: ComponentDefinition): void;
  getComponentTypes(): ComponentDefinition[];
  getComponentTypesByCategory(): Record<string, ComponentDefinition[]>;
}

// 组件树管理服务
export interface ComponentTreeService {
  addComponent(component: Component, parentId?: string): void;
  removeComponent(id: string): void;
  moveComponent(id: string, newParentId: string | null, index?: number): void;
  updateComponent(id: string, updates: Partial<Component>): void;
  getComponentById(id: string): Component | null;
  getRootComponents(): Component[];
}
```

## 2. 设计领域 (Design Domain)

设计领域负责处理画布、属性面板等设计时交互功能。

### 核心实体

```typescript
// 画布状态
export interface CanvasState {
  components: Component[];              // 画布上的组件
  selectedId: string | null;            // 当前选中的组件ID
  scale: number;                        // 缩放比例
  position: { x: number, y: number };   // 画布位置
  gridVisible: boolean;                 // 网格是否可见
  snapToGrid: boolean;                  // 是否启用网格对齐
}

// 设计历史记录
export interface DesignHistory<T> {
  past: T[];                            // 过去的状态
  present: T;                           // 当前状态
  future: T[];                          // 未来的状态
}

// 选择状态
export interface SelectionState {
  selectedIds: string[];                // 选中的组件ID列表
  activeId: string | null;              // 当前活动的组件ID
}
```

### 核心服务

```typescript
// 画布状态管理
export interface CanvasStateManager {
  getState(): CanvasState;
  selectComponent(id: string | null): void;
  addComponent(component: Component): void;
  updateComponent(id: string, updates: Partial<Component>): void;
  removeComponent(id: string): void;
  moveComponent(id: string, parentId: string | null): void;
  setScale(scale: number): void;
  setPosition(position: { x: number, y: number }): void;
  toggleGrid(visible: boolean): void;
  toggleSnapToGrid(enabled: boolean): void;
}

// 历史记录管理
export interface HistoryManager<T> {
  undo(): void;
  redo(): void;
  addToHistory(state: T): void;
  canUndo(): boolean;
  canRedo(): boolean;
  getHistory(): DesignHistory<T>;
}

// 拖放服务
export interface DragDropService {
  beginDrag(componentType: string, initialPosition: ComponentPosition): void;
  moveDrag(position: ComponentPosition): void;
  endDrag(finalPosition: ComponentPosition): Component | null;
  isDragging(): boolean;
}
```

## 3. 数据领域 (Data Domain)

数据领域处理数据源、数据绑定和数据映射相关功能。

### 核心实体

```typescript
// 数据源
export interface DataSource {
  id: string;                            // 数据源ID
  name: string;                          // 数据源名称
  type: DataSourceType;                  // 数据源类型
  configuration: Record<string, any>;    // 数据源配置
  schema?: DataSchema;                   // 数据模式
}

// 数据源类型
export enum DataSourceType {
  STATIC = 'static',
  REST_API = 'rest_api',
  GRAPHQL = 'graphql',
  DATABASE = 'database',
  CUSTOM = 'custom'
}

// 数据模式
export interface DataSchema {
  fields: DataField[];                   // 字段列表
}

// 数据字段
export interface DataField {
  name: string;                          // 字段名称
  type: 'string' | 'number' | 'boolean' | 'date' | 'object' | 'array'; // 字段类型
  path: string;                          // 字段路径
  subFields?: DataField[];               // 子字段（对于对象和数组类型）
}

// 数据映射
export interface DataMapping {
  componentId: string;                   // 组件ID
  dataSourceId: string;                  // 数据源ID
  fieldMappings: Record<string, string>; // 字段映射关系
}
```

### 核心服务

```typescript
// 数据源管理
export interface DataSourceManager {
  addDataSource(dataSource: DataSource): void;
  removeDataSource(id: string): void;
  updateDataSource(id: string, updates: Partial<DataSource>): void;
  getDataSourceById(id: string): DataSource | null;
  getAllDataSources(): DataSource[];
}

// 数据绑定服务
export interface DataBindingService {
  bindComponentToDataSource(componentId: string, dataSourceId: string): void;
  unbindComponent(componentId: string): void;
  mapComponentProperty(componentId: string, propertyPath: string, dataField: string): void;
  getComponentDataMapping(componentId: string): DataMapping | null;
  resolveData(component: Component, dataSources: Record<string, any>): Record<string, any>;
}

// 数据校验服务
export interface DataValidationService {
  validateMapping(mapping: DataMapping, dataSource: DataSource): boolean;
  validateExpression(expression: string): boolean;
  validateTransformation(data: any, transformation: string): any;
}
```

## 4. 主题领域 (Theme Domain)

主题领域处理样式、主题和外观相关功能。

### 核心实体

```typescript
// 主题配置
export interface ThemeConfig {
  id: string;                             // 主题ID
  name: string;                           // 主题名称
  primaryColor: string;                   // 主色调
  secondaryColor: string;                 // 次色调
  backgroundColor: string;                // 背景色
  textColor: string;                      // 文本颜色
  fontFamily: string;                     // 字体系列
  borderRadius: string;                   // 边框圆角
  spacing: string;                        // 间距
  customProperties?: Record<string, any>; // 自定义属性
}

// 颜色预设
export interface ColorPreset {
  id: string;                             // 预设ID
  name: string;                           // 预设名称
  colors: string[];                       // 颜色列表
}

// 样式变量
export interface StyleVariable {
  name: string;                           // 变量名
  value: string;                          // 变量值
  type: 'color' | 'size' | 'font' | 'other'; // 变量类型
}
```

### 核心服务

```typescript
// 主题管理
export interface ThemeManager {
  setActiveTheme(themeId: string): void;
  getActiveTheme(): ThemeConfig;
  addTheme(theme: ThemeConfig): void;
  updateTheme(id: string, updates: Partial<ThemeConfig>): void;
  removeTheme(id: string): void;
  getAllThemes(): ThemeConfig[];
}

// 样式生成
export interface StyleGenerator {
  generateComponentStyles(component: Component, theme: ThemeConfig): Record<string, any>;
  generateGlobalStyles(theme: ThemeConfig): string;
  applyThemeToComponent(component: Component, theme: ThemeConfig): Component;
}

// 颜色工具
export interface ColorUtilities {
  darken(color: string, amount: number): string;
  lighten(color: string, amount: number): string;
  getContrastColor(backgroundColor: string): string;
  getColorPalette(baseColor: string): string[];
}
```

## 5. 协作领域 (Collaboration Domain)

协作领域处理多人实时协作相关功能。

### 核心实体

```typescript
// 用户
export interface User {
  id: string;                             // 用户ID
  name: string;                           // 用户名
  avatar?: string;                        // 头像URL
  color: string;                          // 用户标识颜色
}

// 会话
export interface Session {
  id: string;                             // 会话ID
  projectId: string;                      // 项目ID
  activeUsers: User[];                    // 活动用户列表
  createdAt: Date;                        // 创建时间
  lastActivity: Date;                     // 最后活动时间
}

// 操作
export interface Operation {
  id: string;                             // 操作ID
  userId: string;                         // 用户ID
  type: OperationType;                    // 操作类型
  payload: any;                           // 操作数据
  timestamp: Date;                        // 时间戳
}

// 操作类型
export enum OperationType {
  ADD_COMPONENT = 'add_component',
  UPDATE_COMPONENT = 'update_component',
  DELETE_COMPONENT = 'delete_component',
  MOVE_COMPONENT = 'move_component',
  SELECT_COMPONENT = 'select_component',
  CHANGE_PROPERTY = 'change_property'
}
```

### 核心服务

```typescript
// 协作服务
export interface CollaborationService {
  joinSession(sessionId: string, user: User): void;
  leaveSession(): void;
  broadcastOperation(operation: Operation): void;
  onOperationReceived(callback: (operation: Operation) => void): void;
  getActiveUsers(): User[];
  getUserCursors(): Record<string, ComponentPosition>;
}

// 冲突解决
export interface ConflictResolver {
  resolveConflict(localOperation: Operation, remoteOperation: Operation): Operation[];
  transformOperation(operation: Operation, concurrentOperations: Operation[]): Operation;
}

// 变更跟踪
export interface ChangeTracker {
  trackChanges(component: Component): void;
  getChanges(since: Date): Operation[];
  applyChanges(operations: Operation[]): void;
}
```

## 6. 导出领域 (Export Domain)

导出领域处理代码生成、预览和部署相关功能。

### 核心实体

```typescript
// 导出配置
export interface ExportConfig {
  format: 'react' | 'vue' | 'angular' | 'html' | 'custom'; // 导出格式
  includeStyles: boolean;                 // 是否包含样式
  includeInteractivity: boolean;          // 是否包含交互逻辑
  includeDataFetching: boolean;           // 是否包含数据获取
  outputPath?: string;                    // 输出路径
  customSettings?: Record<string, any>;   // 自定义设置
}

// 导出结果
export interface ExportResult {
  files: ExportFile[];                    // 导出文件列表
  success: boolean;                       // 是否成功
  errors?: string[];                      // 错误信息
}

// 导出文件
export interface ExportFile {
  path: string;                           // 文件路径
  content: string;                        // 文件内容
  type: 'component' | 'style' | 'data' | 'config' | 'other'; // 文件类型
}
```

### 核心服务

```typescript
// 代码生成
export interface CodeGenerator {
  generateComponentCode(component: Component, config: ExportConfig): string;
  generateContainerCode(components: Component[], config: ExportConfig): string;
  generateStyleCode(components: Component[], theme: ThemeConfig): string;
  generateDataFetchingCode(dataSources: DataSource[]): string;
}

// 预览服务
export interface PreviewService {
  generatePreview(components: Component[], theme: ThemeConfig): string;
  getPreviewUrl(): string;
  refreshPreview(): void;
}

// 导出服务
export interface ExportService {
  exportProject(components: Component[], dataSources: DataSource[], theme: ThemeConfig, config: ExportConfig): Promise<ExportResult>;
  validateExport(components: Component[], config: ExportConfig): string[];
  getExportFormats(): string[];
}
```

## 7. 动画领域 (Animation Domain)

动画领域处理动画和交互效果相关功能。

### 核心实体

```typescript
// 动画定义
export interface Animation {
  id: string;                             // 动画ID
  name: string;                           // 动画名称
  type: AnimationType;                    // 动画类型
  duration: number;                       // 持续时间(ms)
  delay: number;                          // 延迟时间(ms)
  easing: string;                         // 缓动函数
  properties: Record<string, any>;        // 动画属性
}

// 动画类型
export enum AnimationType {
  FADE = 'fade',
  SLIDE = 'slide',
  SCALE = 'scale',
  ROTATE = 'rotate',
  CUSTOM = 'custom'
}

// 动画触发器
export interface AnimationTrigger {
  eventType: 'click' | 'hover' | 'load' | 'scroll' | 'custom'; // 触发事件类型
  targetId?: string;                      // 目标组件ID
  condition?: string;                     // 触发条件
}
```

### 核心服务

```typescript
// 动画管理
export interface AnimationManager {
  addAnimation(componentId: string, animation: Animation, trigger: AnimationTrigger): void;
  removeAnimation(componentId: string, animationId: string): void;
  updateAnimation(componentId: string, animationId: string, updates: Partial<Animation>): void;
  getComponentAnimations(componentId: string): Array<{animation: Animation, trigger: AnimationTrigger}>;
}

// 动画预览
export interface AnimationPreview {
  previewAnimation(animation: Animation, element: HTMLElement): Promise<void>;
  stopPreview(element: HTMLElement): void;
}

// 动画代码生成
export interface AnimationCodeGenerator {
  generateAnimationCode(componentId: string, animations: Animation[], format: string): string;
  generateAnimationStyles(animation: Animation): string;
}
```

## 8. 共享领域 (Shared Domain)

共享领域包含整个应用共享的通用功能和基础设施。

### 核心实体

```typescript
// 通用标识符
export interface Identifier {
  id: string;                             // ID值
  namespace?: string;                     // 命名空间
}

// 结果包装器
export interface Result<T> {
  success: boolean;                       // 是否成功
  data?: T;                               // 数据
  error?: string;                         // 错误信息
}

// 版本信息
export interface Version {
  major: number;                          // 主版本
  minor: number;                          // 次版本
  patch: number;                          // 补丁版本
  toString(): string;                     // 版本字符串
}
```

### 核心服务

```typescript
// ID生成器
export interface IdGenerator {
  generate(namespace?: string): string;
  isValid(id: string): boolean;
}

// 事件总线
export interface EventBus {
  publish<T>(eventType: string, payload: T): void;
  subscribe<T>(eventType: string, callback: (payload: T) => void): () => void;
  unsubscribe(eventType: string, callback: Function): void;
}

// 本地存储
export interface StorageService {
  save<T>(key: string, data: T): void;
  load<T>(key: string): T | null;
  remove(key: string): void;
  clear(): void;
}
```

## 领域之间的关系

以下是各个领域之间的主要依赖关系：

1. **设计域** 依赖于 **组件域** 获取组件定义
2. **组件域** 依赖于 **数据域** 获取数据绑定信息
3. **组件域** 依赖于 **主题域** 获取样式信息
4. **导出域** 依赖于 **组件域**、**数据域** 和 **主题域** 生成代码
5. **协作域** 依赖于 **设计域** 同步设计状态
6. **动画域** 依赖于 **组件域** 为组件添加动画

## 聚合根

每个领域中的聚合根如下：

1. **组件域**：`ComponentTree` - 管理组件的层次结构
2. **设计域**：`Canvas` - 管理画布上的组件和状态
3. **数据域**：`DataSourceRegistry` - 管理所有数据源
4. **主题域**：`ThemeRegistry` - 管理所有主题
5. **协作域**：`CollaborationSession` - 管理协作会话
6. **导出域**：`ExportManager` - 管理导出配置和过程
7. **动画域**：`AnimationRegistry` - 管理所有动画定义
8. **共享域**：无聚合根，提供通用服务 