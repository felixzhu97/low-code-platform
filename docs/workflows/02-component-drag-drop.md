# 组件拖拽添加时序图

## 概述
描述用户从组件面板拖拽组件到画布的完整交互流程。

## 时序图

```mermaid
sequenceDiagram
    participant User as 用户
    participant ComponentPanel as 组件面板
    participant DnD as React DnD
    participant Canvas as 画布
    participant Hook as useCanvasDrag
    participant ComponentVM as ComponentViewModel
    participant Factory as ComponentFactory
    participant HistoryVM as HistoryViewModel
    participant UI as 界面更新

    User->>ComponentPanel: 开始拖拽组件
    ComponentPanel->>DnD: 触发dragStart事件
    DnD->>DnD: 设置拖拽数据
    Note over DnD: 包含组件类型、名称等信息
    
    User->>Canvas: 拖拽到画布区域
    Canvas->>Hook: 触发dragOver事件
    Hook->>Hook: 计算拖拽位置
    Hook->>Canvas: 显示拖拽预览
    
    User->>Canvas: 释放鼠标(drop)
    Canvas->>Hook: 触发drop事件
    Hook->>Hook: 获取拖拽数据
    Hook->>Hook: 计算最终位置
    
    Hook->>Factory: 创建组件实例
    Factory->>Factory: 生成唯一ID
    Factory->>Factory: 设置默认属性
    Factory-->>Hook: 返回组件模型
    
    Hook->>ComponentVM: 添加组件
    ComponentVM->>ComponentVM: 更新组件列表
    ComponentVM->>HistoryVM: 记录历史状态
    ComponentVM->>ComponentVM: 通知状态变化
    
    ComponentVM-->>UI: 触发重新渲染
    UI->>Canvas: 渲染新组件
    Canvas-->>User: 显示添加的组件
    
    Note over User,UI: 组件添加完成，用户可以继续操作
```

## 关键步骤说明

1. **拖拽开始**: 用户在组件面板开始拖拽组件
2. **拖拽数据**: React DnD设置拖拽传输的组件信息
3. **拖拽预览**: 画布显示拖拽位置预览效果
4. **位置计算**: 根据鼠标位置计算组件放置坐标
5. **组件创建**: 使用工厂模式创建组件实例
6. **状态更新**: 更新组件列表并记录历史
7. **界面渲染**: 重新渲染画布显示新组件

## 涉及的主要文件

- `src/mvvm/views/components/component-panel.tsx` - 组件面板
- `src/mvvm/views/components/canvas.tsx` - 画布组件
- `src/mvvm/hooks/use-canvas-drag.ts` - 拖拽处理Hook
- `src/mvvm/viewmodels/ComponentViewModel.ts` - 组件状态管理
- `src/mvvm/models/ComponentModel.ts` - 组件数据模型
- `src/mvvm/viewmodels/component-factory.service.ts` - 组件工厂