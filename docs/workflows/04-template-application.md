# 模板应用时序图

## 概述
描述用户选择并应用页面模板到画布的完整流程。

## 时序图

```mermaid
sequenceDiagram
    participant User as 用户
    participant TemplateGallery as 模板库
    participant TemplatePreview as 模板预览
    participant PlatformVM as PlatformViewModel
    participant LegacyAdapter as 适配器
    participant ComponentVM as ComponentViewModel
    participant Factory as ComponentFactory
    participant HistoryVM as HistoryViewModel
    participant Canvas as 画布

    User->>TemplateGallery: 点击打开模板库
    TemplateGallery->>TemplateGallery: 加载预置模板
    TemplateGallery-->>User: 显示模板列表
    
    User->>TemplateGallery: 选择模板
    TemplateGallery->>TemplatePreview: 显示模板预览
    TemplatePreview->>TemplatePreview: 渲染模板组件
    TemplatePreview-->>User: 显示预览效果
    
    User->>TemplatePreview: 确认应用模板
    TemplatePreview->>PlatformVM: handleSelectTemplate(templateComponents)
    
    PlatformVM->>LegacyAdapter: legacyToComponentModels(templateComponents)
    LegacyAdapter->>LegacyAdapter: 转换数据格式
    LegacyAdapter-->>PlatformVM: 返回ComponentModel数组
    
    PlatformVM->>PlatformVM: applyTemplate(componentModels)
    PlatformVM->>PlatformVM: processTemplateComponent(component)
    
    loop 处理每个模板组件
        PlatformVM->>Factory: 生成新的唯一ID
        Factory-->>PlatformVM: 返回新ID
        PlatformVM->>PlatformVM: 处理子组件(递归)
    end
    
    PlatformVM->>ComponentVM: addComponent(processedComponent)
    ComponentVM->>ComponentVM: 添加到组件列表
    ComponentVM->>HistoryVM: 记录历史状态
    ComponentVM->>ComponentVM: 通知状态变化
    
    ComponentVM-->>Canvas: 触发重新渲染
    Canvas->>Canvas: 渲染新添加的组件
    Canvas-->>User: 显示模板应用结果
    
    PlatformVM->>PlatformVM: 显示成功提示
    PlatformVM-->>User: "模板应用成功"
    
    Note over User,Canvas: 模板应用完成，用户可以继续编辑
```

## 关键步骤说明

1. **模板浏览**: 用户打开模板库浏览可用模板
2. **模板预览**: 选择模板后显示预览效果
3. **确认应用**: 用户确认应用选中的模板
4. **数据转换**: 将Legacy格式转换为ComponentModel
5. **组件处理**: 为模板组件生成新的唯一ID
6. **递归处理**: 处理嵌套的子组件结构
7. **状态更新**: 添加组件到画布并记录历史
8. **界面更新**: 重新渲染画布显示模板内容

## 涉及的主要文件

- `src/mvvm/views/components/template-gallery.tsx` - 模板库组件
- `src/mvvm/views/components/template-preview.tsx` - 模板预览
- `src/mvvm/viewmodels/PlatformViewModel.ts` - 平台状态管理
- `src/mvvm/adapters/LegacyAdapter.ts` - 数据格式适配
- `src/mvvm/viewmodels/ComponentViewModel.ts` - 组件管理
- `src/mvvm/models/ComponentModel.ts` - 组件数据模型