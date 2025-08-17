# 组件选择与属性编辑时序图

## 概述
描述用户选择画布中的组件并在属性面板中编辑其属性的完整流程。

## 时序图

```mermaid
sequenceDiagram
    participant User as 用户
    participant Canvas as 画布
    participant ComponentVM as ComponentViewModel
    participant PropertiesPanel as 属性面板
    participant LegacyAdapter as 适配器
    participant HistoryVM as HistoryViewModel
    participant UI as 界面更新

    User->>Canvas: 点击选择组件
    Canvas->>Canvas: 处理点击事件
    Canvas->>ComponentVM: selectComponent(componentId)
    ComponentVM->>ComponentVM: 设置selectedComponentId
    ComponentVM->>ComponentVM: 通知状态变化
    
    ComponentVM-->>UI: 触发重新渲染
    UI->>Canvas: 高亮选中组件
    UI->>PropertiesPanel: 显示组件属性
    
    PropertiesPanel->>ComponentVM: getSelectedComponent()
    ComponentVM-->>PropertiesPanel: 返回选中组件
    PropertiesPanel->>LegacyAdapter: 转换为Legacy格式
    LegacyAdapter-->>PropertiesPanel: 返回Legacy组件
    
    PropertiesPanel->>PropertiesPanel: 渲染属性表单
    PropertiesPanel-->>User: 显示可编辑属性
    
    User->>PropertiesPanel: 修改属性值
    PropertiesPanel->>PropertiesPanel: 更新本地状态
    PropertiesPanel->>LegacyAdapter: 转换属性格式
    LegacyAdapter-->>PropertiesPanel: 返回标准格式
    
    PropertiesPanel->>ComponentVM: updateComponentProperties(id, properties)
    ComponentVM->>ComponentVM: 查找目标组件
    ComponentVM->>ComponentVM: 更新组件属性
    ComponentVM->>HistoryVM: 记录历史状态
    ComponentVM->>ComponentVM: 通知状态变化
    
    ComponentVM-->>UI: 触发重新渲染
    UI->>Canvas: 重新渲染组件
    Canvas-->>User: 显示属性变化效果
    
    Note over User,UI: 属性编辑完成，实时预览效果
```

## 关键步骤说明

1. **组件选择**: 用户点击画布中的组件进行选择
2. **状态更新**: ComponentViewModel更新选中状态
3. **界面响应**: 画布高亮选中组件，属性面板显示
4. **属性加载**: 属性面板获取并显示组件属性
5. **格式转换**: 使用LegacyAdapter进行数据格式适配
6. **属性编辑**: 用户在属性面板中修改属性值
7. **实时更新**: 属性变化立即反映到画布预览

## 涉及的主要文件

- `src/mvvm/views/components/canvas.tsx` - 画布组件选择
- `src/mvvm/views/components/properties-panel.tsx` - 属性编辑面板
- `src/mvvm/viewmodels/ComponentViewModel.ts` - 组件状态管理
- `src/mvvm/adapters/LegacyAdapter.ts` - 数据格式适配器
- `src/mvvm/hooks/useComponentViewModel.ts` - 组件操作Hook
- `src/mvvm/viewmodels/HistoryViewModel.ts` - 历史记录管理