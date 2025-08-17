# 数据绑定流程时序图

## 概述
描述组件与数据源绑定以及数据渲染的完整流程。

## 时序图

```mermaid
sequenceDiagram
    participant User as 用户
    participant DataPanel as 数据面板
    participant PlatformVM as PlatformViewModel
    participant PropertiesPanel as 属性面板
    participant ComponentVM as ComponentViewModel
    participant DataService as 数据服务
    participant ComponentRenderer as 组件渲染器
    participant Canvas as 画布

    Note over User,Canvas: 用户准备为组件绑定数据

    User->>DataPanel: 添加数据源
    DataPanel->>DataPanel: 配置数据源信息
    Note over DataPanel: 包括名称、类型(static/api/database)、数据内容
    
    DataPanel->>PlatformVM: addDataSource(dataSource)
    PlatformVM->>PlatformVM: 添加到model.dataSources
    PlatformVM->>PlatformVM: notify()通知状态变化
    
    PlatformVM-->>DataPanel: 数据源添加成功
    DataPanel-->>User: 显示新的数据源
    
    User->>Canvas: 选择要绑定数据的组件
    Canvas->>ComponentVM: selectComponent(componentId)
    ComponentVM-->>PropertiesPanel: 显示组件属性
    
    User->>PropertiesPanel: 配置数据绑定
    PropertiesPanel->>PropertiesPanel: 选择数据源
    PropertiesPanel->>PropertiesPanel: 配置字段映射
    Note over PropertiesPanel: 设置dataSource和dataMapping
    
    PropertiesPanel->>ComponentVM: updateComponentProperties(id, {dataSource, dataMapping})
    ComponentVM->>ComponentVM: 更新组件数据绑定配置
    ComponentVM->>ComponentVM: 通知状态变化
    
    ComponentVM-->>Canvas: 触发重新渲染
    Canvas->>ComponentRenderer: 渲染组件
    
    ComponentRenderer->>DataService: getComponentData(component, dataSources)
    DataService->>DataService: 查找组件绑定的数据源
    
    alt 静态数据源
        DataService->>DataService: 直接返回静态数据
    else API数据源
        DataService->>DataService: 发起API请求
        DataService->>DataService: 处理响应数据
    else 数据库数据源
        DataService->>DataService: 执行数据库查询
        DataService->>DataService: 处理查询结果
    end
    
    DataService->>DataService: 应用字段映射
    DataService-->>ComponentRenderer: 返回处理后的数据
    
    ComponentRenderer->>ComponentRenderer: 使用数据渲染组件
    ComponentRenderer-->>Canvas: 返回渲染结果
    
    Canvas-->>User: 显示数据绑定后的组件
    
    Note over User,Canvas: 数据绑定完成，组件显示实际数据
```

## 数据源类型处理流程

```mermaid
graph TD
    A[数据源配置] --> B{数据源类型}
    
    B -->|static| C[静态数据]
    C --> C1[直接使用配置的JSON数据]
    C1 --> G[应用字段映射]
    
    B -->|api| D[API数据源]
    D --> D1[发起HTTP请求]
    D1 --> D2[处理响应数据]
    D2 --> D3[缓存数据结果]
    D3 --> G
    
    B -->|database| E[数据库数据源]
    E --> E1[构建查询语句]
    E1 --> E2[执行数据库查询]
    E2 --> E3[处理查询结果]
    E3 --> G
    
    G --> H[数据字段映射]
    H --> I[组件数据渲染]
```

## 字段映射机制

```mermaid
sequenceDiagram
    participant DataService as 数据服务
    participant Component as 组件配置
    participant DataSource as 数据源
    participant Mapper as 字段映射器

    DataService->>Component: 获取dataMapping配置
    Component-->>DataService: 返回字段映射规则
    
    DataService->>DataSource: 获取原始数据
    DataSource-->>DataService: 返回数据
    
    DataService->>Mapper: 应用字段映射
    
    loop 处理每个映射规则
        Mapper->>Mapper: 提取源字段数据
        Mapper->>Mapper: 映射到目标字段
        Mapper->>Mapper: 类型转换和格式化
    end
    
    Mapper-->>DataService: 返回映射后的数据
    DataService-->>Component: 提供给组件渲染
```

## 关键步骤说明

1. **数据源管理**: 用户在数据面板中添加和配置数据源
2. **组件选择**: 选择需要绑定数据的组件
3. **绑定配置**: 在属性面板中配置数据源和字段映射
4. **数据获取**: 根据数据源类型获取数据
5. **字段映射**: 将数据源字段映射到组件属性
6. **组件渲染**: 使用映射后的数据渲染组件

## 涉及的主要文件

- `src/mvvm/views/components/data-panel.tsx` - 数据源管理面板
- `src/mvvm/views/components/properties-panel.tsx` - 数据绑定配置
- `src/mvvm/viewmodels/PlatformViewModel.ts` - 数据源状态管理
- `src/mvvm/viewmodels/component-management.service.ts` - 数据获取服务
- `src/mvvm/views/components/component-renderer/` - 组件渲染器