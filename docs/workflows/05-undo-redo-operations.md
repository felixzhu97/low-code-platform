# 撤销重做操作时序图

## 概述
描述用户执行撤销(Undo)和重做(Redo)操作的完整流程。

## 时序图

```mermaid
sequenceDiagram
    participant User as 用户
    participant Header as 工具栏
    participant PlatformVM as PlatformViewModel
    participant HistoryVM as HistoryViewModel
    participant ComponentVM as ComponentViewModel
    participant Canvas as 画布

    Note over User,Canvas: 用户进行了一系列操作，历史记录已保存

    User->>Header: 点击撤销按钮
    Header->>PlatformVM: undo()
    PlatformVM->>HistoryVM: canUndo()
    HistoryVM-->>PlatformVM: 返回true/false
    
    alt 可以撤销
        PlatformVM->>HistoryVM: undo()
        HistoryVM->>HistoryVM: 移动历史指针
        HistoryVM->>HistoryVM: 获取前一个状态
        HistoryVM-->>PlatformVM: 返回previousState
        
        PlatformVM->>ComponentVM: setComponents(previousState, false)
        Note over ComponentVM: notify=false避免循环触发
        ComponentVM->>ComponentVM: 更新组件列表
        
        PlatformVM->>PlatformVM: 更新model.components
        PlatformVM->>PlatformVM: notify()通知状态变化
        
        PlatformVM-->>Canvas: 触发重新渲染
        Canvas->>Canvas: 渲染历史状态
        Canvas-->>User: 显示撤销后的状态
        
    else 无法撤销
        PlatformVM-->>Header: 返回false
        Header-->>User: 撤销按钮保持禁用状态
    end

    Note over User,Canvas: 用户继续操作...

    User->>Header: 点击重做按钮
    Header->>PlatformVM: redo()
    PlatformVM->>HistoryVM: canRedo()
    HistoryVM-->>PlatformVM: 返回true/false
    
    alt 可以重做
        PlatformVM->>HistoryVM: redo()
        HistoryVM->>HistoryVM: 移动历史指针
        HistoryVM->>HistoryVM: 获取下一个状态
        HistoryVM-->>PlatformVM: 返回nextState
        
        PlatformVM->>ComponentVM: setComponents(nextState, false)
        ComponentVM->>ComponentVM: 更新组件列表
        
        PlatformVM->>PlatformVM: 更新model.components
        PlatformVM->>PlatformVM: notify()通知状态变化
        
        PlatformVM-->>Canvas: 触发重新渲染
        Canvas->>Canvas: 渲染重做状态
        Canvas-->>User: 显示重做后的状态
        
    else 无法重做
        PlatformVM-->>Header: 返回false
        Header-->>User: 重做按钮保持禁用状态
    end
```

## 关键步骤说明

1. **撤销检查**: 检查是否有可撤销的历史记录
2. **状态回退**: 从历史记录中获取前一个状态
3. **组件更新**: 更新ComponentViewModel中的组件列表
4. **避免循环**: 设置notify=false避免触发新的历史记录
5. **界面更新**: 重新渲染画布显示历史状态
6. **重做检查**: 检查是否有可重做的历史记录
7. **状态前进**: 从历史记录中获取下一个状态

## 历史记录管理机制

```mermaid
graph TD
    A[用户操作] --> B[ComponentViewModel变化]
    B --> C[HistoryViewModel.addState]
    C --> D[保存当前状态到历史栈]
    D --> E[更新历史指针]
    
    F[撤销操作] --> G[历史指针后退]
    G --> H[获取前一状态]
    H --> I[恢复组件状态]
    
    J[重做操作] --> K[历史指针前进]
    K --> L[获取下一状态]
    L --> M[恢复组件状态]
```

## 涉及的主要文件

- `src/mvvm/views/LowCodePlatformView.tsx` - 撤销重做按钮
- `src/mvvm/viewmodels/PlatformViewModel.ts` - 撤销重做逻辑
- `src/mvvm/viewmodels/HistoryViewModel.ts` - 历史记录管理
- `src/mvvm/viewmodels/ComponentViewModel.ts` - 组件状态管理