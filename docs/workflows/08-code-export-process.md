# 代码导出流程时序图

## 概述
描述用户导出生成的React代码的完整流程。

## 时序图

```mermaid
sequenceDiagram
    participant User as 用户
    participant CodeExport as 代码导出组件
    participant PlatformVM as PlatformViewModel
    participant ComponentVM as ComponentViewModel
    participant CodeGenerator as 代码生成器
    participant TemplateEngine as 模板引擎
    participant FileSystem as 文件系统

    User->>CodeExport: 点击代码导出按钮
    CodeExport->>CodeExport: 打开导出对话框
    CodeExport-->>User: 显示导出选项
    
    User->>CodeExport: 配置导出选项
    Note over CodeExport: 选择导出格式、包含文件等
    
    User->>CodeExport: 确认导出
    CodeExport->>PlatformVM: 获取当前项目状态
    PlatformVM->>ComponentVM: getComponents()
    ComponentVM-->>PlatformVM: 返回组件列表
    
    PlatformVM->>PlatformVM: getTheme()
    PlatformVM->>PlatformVM: getDataSources()
    PlatformVM-->>CodeExport: 返回完整项目数据
    
    CodeExport->>CodeGenerator: generateProject(projectData)
    
    CodeGenerator->>CodeGenerator: 分析组件依赖关系
    CodeGenerator->>CodeGenerator: 构建组件树结构
    
    loop 生成每个组件
        CodeGenerator->>TemplateEngine: generateComponent(component)
        TemplateEngine->>TemplateEngine: 选择组件模板
        TemplateEngine->>TemplateEngine: 填充组件属性
        TemplateEngine->>TemplateEngine: 处理子组件嵌套
        TemplateEngine->>TemplateEngine: 生成JSX代码
        TemplateEngine-->>CodeGenerator: 返回组件代码
    end
    
    CodeGenerator->>TemplateEngine: generateMainApp(components)
    TemplateEngine->>TemplateEngine: 生成App.tsx
    TemplateEngine->>TemplateEngine: 添加组件导入
    TemplateEngine->>TemplateEngine: 构建主布局
    TemplateEngine-->>CodeGenerator: 返回主应用代码
    
    CodeGenerator->>TemplateEngine: generateStyles(theme)
    TemplateEngine->>TemplateEngine: 生成CSS/Tailwind配置
    TemplateEngine->>TemplateEngine: 应用主题变量
    TemplateEngine-->>CodeGenerator: 返回样式文件
    
    CodeGenerator->>TemplateEngine: generatePackageJson()
    TemplateEngine->>TemplateEngine: 生成依赖配置
    TemplateEngine->>TemplateEngine: 添加必要的脚本
    TemplateEngine-->>CodeGenerator: 返回package.json
    
    CodeGenerator->>CodeGenerator: 组装完整项目结构
    CodeGenerator-->>CodeExport: 返回生成的代码文件
    
    CodeExport->>FileSystem: 创建ZIP文件
    FileSystem->>FileSystem: 压缩所有文件
    FileSystem-->>CodeExport: 返回ZIP文件
    
    CodeExport->>CodeExport: 触发文件下载
    CodeExport-->>User: 下载生成的项目代码
    
    Note over User,FileSystem: 代码导出完成，用户获得可部署的React项目
```

## 代码生成结构

```mermaid
graph TD
    A[项目数据] --> B[代码生成器]
    
    B --> C[组件分析]
    C --> C1[依赖关系分析]
    C --> C2[组件树构建]
    C --> C3[导入语句生成]
    
    B --> D[文件生成]
    D --> D1[组件文件 .tsx]
    D --> D2[样式文件 .css]
    D --> D3[配置文件]
    D --> D4[主应用文件]
    
    B --> E[项目结构]
    E --> E1[src/components/]
    E --> E2[src/styles/]
    E --> E3[src/utils/]
    E --> E4[public/]
    E --> E5[package.json]
    
    D1 --> F[ZIP打包]
    D2 --> F
    D3 --> F
    D4 --> F
    E1 --> F
    E2 --> F
    E3 --> F
    E4 --> F
    E5 --> F
    
    F --> G[文件下载]
```

## 组件代码生成模板

```typescript
// 组件生成示例
const componentTemplate = `
import React from 'react';
{{#if hasStyles}}
import './{{componentName}}.css';
{{/if}}
{{#each imports}}
import { {{name}} } from '{{path}}';
{{/each}}

interface {{componentName}}Props {
  {{#each props}}
  {{name}}?: {{type}};
  {{/each}}
}

export const {{componentName}}: React.FC<{{componentName}}Props> = ({
  {{#each props}}
  {{name}}{{#if defaultValue}} = {{defaultValue}}{{/if}},
  {{/each}}
}) => {
  return (
    <{{tagName}}
      {{#each attributes}}
      {{name}}={{value}}
      {{/each}}
    >
      {{#if hasChildren}}
      {{#each children}}
      {{{childComponent}}}
      {{/each}}
      {{else}}
      {{{content}}}
      {{/if}}
    </{{tagName}}>
  );
};
`;
```

## 关键步骤说明

1. **导出配置**: 用户选择导出选项和格式
2. **数据收集**: 获取当前项目的完整状态数据
3. **依赖分析**: 分析组件间的依赖关系
4. **代码生成**: 使用模板引擎生成各类文件
5. **项目结构**: 构建标准的React项目结构
6. **文件打包**: 将所有文件打包成ZIP格式
7. **文件下载**: 提供给用户下载

## 涉及的主要文件

- `src/mvvm/views/components/code-export.tsx` - 代码导出界面
- `src/mvvm/viewmodels/PlatformViewModel.ts` - 项目数据获取
- 代码生成器相关服务 (需要实现)
- 组件模板文件 (需要创建)