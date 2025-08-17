# 预览模式切换时序图

## 概述
描述用户在编辑模式和预览模式之间切换的完整流程。

## 时序图

```mermaid
sequenceDiagram
    participant User as 用户
    participant Header as 工具栏
    participant PlatformVM as PlatformViewModel
    participant ComponentVM as ComponentViewModel
    participant Canvas as 画布
    participant Panels as 侧边面板
    participant UI as 界面布局

    Note over User,UI: 当前处于编辑模式

    User->>Header: 点击预览按钮
    Header->>PlatformVM: setPreviewMode(true)
    PlatformVM->>PlatformVM: 更新model.previewMode = true
    
    PlatformVM->>ComponentVM: selectComponent(null)
    ComponentVM->>ComponentVM: 清除选中状态
    ComponentVM->>ComponentVM: 通知状态变化
    
    PlatformVM->>PlatformVM: notify()通知状态变化
    
    PlatformVM-->>UI: 触发重新渲染
    
    par 并行更新界面
        UI->>Panels: 隐藏侧边面板
        Panels-->>UI: 面板隐藏完成
    and
        UI->>Canvas: 切换到预览模式
        Canvas->>Canvas: 移除编辑工具
        Canvas->>Canvas: 隐藏组件边框
        Canvas->>Canvas: 禁用拖拽功能
        Canvas->>Canvas: 应用视口宽度限制
        Canvas-->>UI: 预览模式激活
    and
        UI->>Header: 更新按钮文本
        Header-->>UI: 显示"退出预览"
    end
    
    UI-->>User: 显示纯净的预览界面
    
    Note over User,UI: 用户在预览模式中查看效果

    User->>Header: 点击退出预览按钮
    Header->>PlatformVM: setPreviewMode(false)
    PlatformVM->>PlatformVM: 更新model.previewMode = false
    PlatformVM->>PlatformVM: notify()通知状态变化
    
    PlatformVM-->>UI: 触发重新渲染
    
    par 并行恢复界面
        UI->>Panels: 显示侧边面板
        Panels-->>UI: 面板显示完成
    and
        UI->>Canvas: 切换到编辑模式
        Canvas->>Canvas: 恢复编辑工具
        Canvas->>Canvas: 显示组件边框
        Canvas->>Canvas: 启用拖拽功能
        Canvas->>Canvas: 移除视口宽度限制
        Canvas-->>UI: 编辑模式激活
    and
        UI->>Header: 更新按钮文本
        Header-->>UI: 显示"预览"
    end
    
    UI-->>User: 恢复完整的编辑界面
    
    Note over User,UI: 回到编辑模式，可以继续编辑
```

## 预览模式界面变化

```mermaid
graph TD
    A[编辑模式] --> B{点击预览}
    B --> C[隐藏组件面板]
    B --> D[隐藏属性面板]
    B --> E[隐藏组件树面板]
    B --> F[清除组件选中状态]
    B --> G[移除组件编辑边框]
    B --> H[禁用拖拽功能]
    B --> I[应用视口宽度限制]
    
    C --> J[预览模式]
    D --> J
    E --> J
    F --> J
    G --> J
    H --> J
    I --> J
    
    J --> K{点击退出预览}
    K --> L[显示所有面板]
    K --> M[恢复编辑功能]
    K --> N[移除视口限制]
    
    L --> O[编辑模式]
    M --> O
    N --> O
```

## 关键步骤说明

1. **预览切换**: 用户点击预览按钮触发模式切换
2. **状态更新**: PlatformViewModel更新预览模式状态
3. **选中清除**: 自动清除当前选中的组件
4. **界面调整**: 并行执行多个界面元素的显示/隐藏
5. **功能禁用**: 在预览模式下禁用编辑相关功能
6. **视口限制**: 应用响应式视口宽度限制
7. **模式恢复**: 退出预览时恢复所有编辑功能

## 涉及的主要文件

- `src/mvvm/views/LowCodePlatformView.tsx` - 主视图布局控制
- `src/mvvm/viewmodels/PlatformViewModel.ts` - 预览模式状态管理
- `src/mvvm/views/components/canvas.tsx` - 画布预览模式处理
- `src/mvvm/views/components/header.tsx` - 预览按钮交互