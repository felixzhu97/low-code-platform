# 用户使用手册

## 目录

1. [界面概览](#界面概览)
2. [组件管理](#组件管理)
3. [属性编辑](#属性编辑)
4. [数据管理](#数据管理)
5. [主题定制](#主题定制)
6. [项目管理](#项目管理)
7. [代码生成](#代码生成)
8. [高级功能](#高级功能)

## 界面概览

### 主界面布局

Felix 低代码平台采用经典的四区域布局：

```
┌─────────────────────────────────────────────────────────┐
│                    顶部工具栏                            │
├──────────┬─────────────────────────────┬─────────────────┤
│          │                             │                 │
│   组件   │          画布区域            │    属性面板     │
│   面板   │                             │                 │
│          │                             │                 │
├──────────┴─────────────────────────────┴─────────────────┤
│                    数据面板                              │
└─────────────────────────────────────────────────────────┘
```

### 顶部工具栏

#### 文件操作
- **新建**: 创建新项目
- **打开**: 打开已有项目
- **保存**: 保存当前项目
- **另存为**: 保存项目副本

#### 编辑操作
- **撤销**: 撤销上一步操作 (Ctrl+Z)
- **重做**: 重做已撤销的操作 (Ctrl+Y)
- **复制**: 复制选中组件 (Ctrl+C)
- **粘贴**: 粘贴组件 (Ctrl+V)

#### 视图控制
- **缩放**: 调整画布缩放比例
- **适应**: 自适应画布大小
- **网格**: 显示/隐藏网格线
- **标尺**: 显示/隐藏标尺

#### 预览和导出
- **预览**: 进入预览模式
- **设备切换**: 切换不同设备预览
- **导出**: 生成代码或导出项目

### 左侧组件面板

#### 组件分类

**基础组件**
- 文本 (Text)
- 按钮 (Button)
- 图片 (Image)
- 链接 (Link)
- 分割线 (Divider)

**布局组件**
- 容器 (Container)
- 行 (Row)
- 列 (Column)
- 网格 (Grid)
- 弹性布局 (Flex)

**表单组件**
- 输入框 (Input)
- 文本域 (Textarea)
- 选择器 (Select)
- 复选框 (Checkbox)
- 单选框 (Radio)
- 开关 (Switch)
- 滑块 (Slider)
- 日期选择器 (DatePicker)

**数据展示**
- 表格 (Table)
- 列表 (List)
- 卡片 (Card)
- 标签 (Tag)
- 进度条 (Progress)
- 统计数值 (Statistic)

**导航组件**
- 菜单 (Menu)
- 面包屑 (Breadcrumb)
- 分页 (Pagination)
- 步骤条 (Steps)
- 标签页 (Tabs)

**反馈组件**
- 警告提示 (Alert)
- 消息通知 (Message)
- 对话框 (Modal)
- 抽屉 (Drawer)
- 气泡确认框 (Popconfirm)

#### 组件搜索

在组件面板顶部的搜索框中输入关键词，快速找到需要的组件。

#### 自定义组件

点击 "自定义组件" 标签页，管理和使用自定义组件：
- 查看已创建的自定义组件
- 导入外部组件
- 编辑组件属性

### 中央画布区域

#### 画布操作

**缩放控制**
- 鼠标滚轮: 缩放画布
- Ctrl + 滚轮: 精确缩放
- 缩放按钮: 预设缩放比例

**平移画布**
- 空格键 + 拖拽: 平移画布
- 中键拖拽: 平移画布

**选择操作**
- 单击: 选择单个组件
- Ctrl + 单击: 多选组件
- 拖拽框选: 框选多个组件
- Ctrl + A: 全选组件

#### 组件操作

**拖拽添加**
1. 从组件面板拖拽组件到画布
2. 松开鼠标完成添加
3. 自动选中新添加的组件

**移动组件**
- 拖拽组件到新位置
- 使用方向键微调位置
- 按住 Shift 键进行大幅移动

**调整大小**
- 拖拽组件边角控制点
- 按住 Shift 键保持宽高比
- 双击边框自动调整大小

**层级管理**
- 右键菜单选择 "置于顶层"
- 右键菜单选择 "置于底层"
- 使用图层面板调整层级

#### 辅助功能

**对齐辅助**
- 智能参考线
- 组件边缘对齐
- 中心点对齐
- 等距分布

**网格系统**
- 显示网格线
- 网格吸附
- 自定义网格大小

### 右侧属性面板

#### 基础属性

**位置和尺寸**
- X 坐标: 组件左上角 X 位置
- Y 坐标: 组件左上角 Y 位置
- 宽度: 组件宽度
- 高度: 组件高度
- 旋转: 组件旋转角度

**外观样式**
- 背景颜色: 设置背景色
- 边框: 边框样式、颜色、粗细
- 圆角: 边框圆角半径
- 阴影: 投影效果
- 透明度: 组件透明度

**文本样式** (文本组件)
- 字体: 字体系列
- 字号: 字体大小
- 颜色: 文字颜色
- 粗细: 字体粗细
- 对齐: 文本对齐方式
- 行高: 行间距

#### 高级属性

**响应式设置**
- 断点配置: 不同屏幕尺寸的样式
- 显示/隐藏: 在特定设备上的显示控制
- 布局调整: 响应式布局变化

**动画效果**
- 进入动画: 组件出现时的动画
- 退出动画: 组件消失时的动画
- 悬停效果: 鼠标悬停时的变化
- 点击效果: 点击时的反馈动画

**交互行为**
- 点击事件: 点击时执行的操作
- 悬停事件: 鼠标悬停时的行为
- 表单验证: 表单组件的验证规则
- 条件显示: 基于数据的显示控制

#### 数据绑定

**静态数据**
直接在属性面板中输入固定值。

**动态数据**
1. 点击属性旁的数据绑定图标
2. 选择数据源
3. 选择字段路径
4. 配置数据转换 (可选)

**表达式绑定**
使用 JavaScript 表达式进行复杂的数据处理：
```javascript
// 条件显示
user.role === 'admin'

// 数据格式化
formatDate(item.createdAt, 'YYYY-MM-DD')

// 计算属性
item.price * item.quantity
```

### 底部数据面板

#### 数据源管理

**添加数据源**
1. 点击 "添加数据源" 按钮
2. 选择数据源类型
3. 配置连接参数
4. 测试连接
5. 保存配置

**数据源类型**

**静态数据**
```json
{
  "users": [
    {"id": 1, "name": "张三", "email": "zhang@example.com"},
    {"id": 2, "name": "李四", "email": "li@example.com"}
  ]
}
```

**REST API**
```javascript
{
  "url": "https://api.example.com/users",
  "method": "GET",
  "headers": {
    "Authorization": "Bearer your-token",
    "Content-Type": "application/json"
  },
  "params": {
    "page": 1,
    "limit": 10
  }
}
```

**GraphQL**
```javascript
{
  "endpoint": "https://api.example.com/graphql",
  "query": `
    query GetUsers($limit: Int) {
      users(limit: $limit) {
        id
        name
        email
      }
    }
  `,
  "variables": {
    "limit": 10
  }
}
```

#### 数据预览

在数据面板中可以：
- 查看数据源返回的原始数据
- 预览数据结构和字段类型
- 测试数据查询和过滤
- 监控数据更新状态

## 组件管理

### 组件选择

#### 单选组件
- 在画布中单击组件
- 选中的组件会显示蓝色边框
- 属性面板会显示该组件的属性

#### 多选组件
- 按住 Ctrl 键点击多个组件
- 或使用拖拽框选多个组件
- 属性面板显示公共属性

#### 全选组件
- 使用快捷键 Ctrl+A
- 或右键菜单选择 "全选"

### 组件操作

#### 复制和粘贴
```
复制: Ctrl+C 或右键菜单
粘贴: Ctrl+V 或右键菜单
剪切: Ctrl+X 或右键菜单
```

#### 删除组件
```
删除: Delete 键或右键菜单
批量删除: 选中多个组件后按 Delete
```

#### 组件分组
1. 选中多个组件
2. 右键选择 "创建分组"
3. 输入分组名称
4. 确认创建

#### 取消分组
1. 选中分组
2. 右键选择 "取消分组"
3. 组件恢复独立状态

### 组件层级

#### 图层面板
在右侧面板的 "图层" 标签页中：
- 查看组件层级结构
- 拖拽调整层级顺序
- 显示/隐藏组件
- 锁定/解锁组件

#### 层级操作
- **置于顶层**: 将组件移到最上层
- **置于底层**: 将组件移到最下层
- **上移一层**: 向上移动一个层级
- **下移一层**: 向下移动一个层级

### 组件对齐

#### 对齐方式
- **左对齐**: 多个组件左边缘对齐
- **右对齐**: 多个组件右边缘对齐
- **顶部对齐**: 多个组件顶部对齐
- **底部对齐**: 多个组件底部对齐
- **水平居中**: 多个组件水平中心对齐
- **垂直居中**: 多个组件垂直中心对齐

#### 分布方式
- **水平等距分布**: 组件间水平距离相等
- **垂直等距分布**: 组件间垂直距离相等

## 属性编辑

### 样式属性

#### 尺寸设置
- **固定尺寸**: 设置具体的像素值
- **百分比尺寸**: 相对于父容器的百分比
- **自动尺寸**: 根据内容自动调整
- **最小/最大尺寸**: 设置尺寸范围

#### 间距设置
- **外边距 (Margin)**: 组件外部间距
- **内边距 (Padding)**: 组件内部间距
- **边框 (Border)**: 边框样式和尺寸

#### 颜色设置
- **颜色选择器**: 可视化颜色选择
- **十六进制值**: 直接输入颜色代码
- **RGB/HSL**: 使用不同颜色模式
- **渐变色**: 设置线性或径向渐变

#### 字体设置
- **字体系列**: 选择字体类型
- **字体大小**: 设置字号
- **字体粗细**: 设置字重
- **字体样式**: 正常、斜体等
- **文本装饰**: 下划线、删除线等

### 交互属性

#### 事件处理
为组件添加交互行为：

**点击事件**
```javascript
// 显示消息
showMessage('按钮被点击了！');

// 跳转页面
navigateTo('/dashboard');

// 调用 API
callAPI('POST', '/api/submit', formData);

// 更新状态
updateState('isVisible', true);
```

**表单事件**
```javascript
// 表单提交
onSubmit: (values) => {
  console.log('表单数据:', values);
  submitForm(values);
}

// 字段变化
onChange: (value) => {
  validateField(value);
  updateFormData(value);
}
```

#### 条件显示
基于数据条件控制组件显示：

```javascript
// 简单条件
user.isLoggedIn

// 复杂条件
user.role === 'admin' && user.permissions.includes('write')

// 数据存在性检查
data && data.length > 0
```

### 响应式属性

#### 断点设置
为不同屏幕尺寸设置不同的样式：

- **手机端** (< 768px)
- **平板端** (768px - 1024px)
- **桌面端** (> 1024px)

#### 响应式配置
```javascript
{
  "mobile": {
    "width": "100%",
    "fontSize": "14px"
  },
  "tablet": {
    "width": "50%",
    "fontSize": "16px"
  },
  "desktop": {
    "width": "33.33%",
    "fontSize": "18px"
  }
}
```

## 数据管理

### 数据源配置

#### 静态数据源
适用于固定不变的数据：

```json
{
  "type": "static",
  "data": {
    "title": "欢迎使用 Felix",
    "description": "强大的低代码开发平台",
    "features": [
      "可视化编辑",
      "组件化开发",
      "数据绑定",
      "响应式设计"
    ]
  }
}
```

#### API 数据源
从远程 API 获取数据：

```javascript
{
  "type": "api",
  "config": {
    "url": "https://api.example.com/data",
    "method": "GET",
    "headers": {
      "Authorization": "Bearer ${token}",
      "Content-Type": "application/json"
    },
    "params": {
      "page": "${currentPage}",
      "limit": 10
    },
    "cache": {
      "enabled": true,
      "ttl": 300000  // 5分钟缓存
    }
  }
}
```

#### 数据库数据源
直接连接数据库：

```javascript
{
  "type": "database",
  "config": {
    "connection": "postgresql://user:pass@localhost:5432/db",
    "query": "SELECT * FROM users WHERE active = true",
    "params": {
      "limit": "${pageSize}"
    }
  }
}
```

### 数据转换

#### 数据映射
将数据源字段映射到组件属性：

```javascript
// 原始数据
{
  "user_name": "张三",
  "user_email": "zhang@example.com",
  "created_time": "2024-01-01T00:00:00Z"
}

// 映射配置
{
  "name": "user_name",
  "email": "user_email",
  "createdAt": "created_time"
}

// 转换后数据
{
  "name": "张三",
  "email": "zhang@example.com",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

#### 数据过滤
```javascript
// 过滤条件
data.filter(item => item.status === 'active' && item.score > 80)

// 排序
data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

// 分组
data.reduce((groups, item) => {
  const key = item.category;
  groups[key] = groups[key] || [];
  groups[key].push(item);
  return groups;
}, {})
```

#### 数据格式化
```javascript
// 日期格式化
formatDate(item.createdAt, 'YYYY-MM-DD HH:mm:ss')

// 数字格式化
formatNumber(item.price, { style: 'currency', currency: 'CNY' })

// 文本截取
truncateText(item.description, 100)
```

### 数据绑定

#### 单向绑定
数据源 → 组件属性

```javascript
// 绑定文本内容
<Text text="${user.name}" />

// 绑定图片地址
<Image src="${user.avatar}" />

// 绑定列表数据
<List dataSource="${users}" />
```

#### 双向绑定
表单组件支持双向数据绑定：

```javascript
// 输入框双向绑定
<Input value="${form.username}" onChange="updateForm" />

// 选择器双向绑定
<Select value="${form.category}" onChange="updateForm" />
```

#### 计算属性
基于其他数据计算得出的属性：

```javascript
// 全名计算
fullName: "${user.firstName} ${user.lastName}"

// 总价计算
totalPrice: "${item.price * item.quantity}"

// 状态判断
isExpired: "${new Date(item.expireDate) < new Date()}"
```

## 主题定制

### 主题系统

#### 预设主题
Felix 提供多种预设主题：
- **默认主题**: 经典蓝白配色
- **暗色主题**: 深色背景主题
- **简约主题**: 极简设计风格
- **商务主题**: 专业商务风格

#### 自定义主题
创建个性化主题：

1. 点击主题编辑器
2. 调整颜色配置
3. 设置字体样式
4. 配置间距规则
5. 预览效果
6. 保存主题

### 颜色系统

#### 主色调配置
```javascript
{
  "primary": "#1890ff",      // 主色
  "secondary": "#722ed1",    // 辅助色
  "success": "#52c41a",      // 成功色
  "warning": "#faad14",      // 警告色
  "error": "#f5222d",        // 错误色
  "info": "#13c2c2"          // 信息色
}
```

#### 中性色配置
```javascript
{
  "white": "#ffffff",
  "gray-50": "#fafafa",
  "gray-100": "#f5f5f5",
  "gray-200": "#e8e8e8",
  "gray-300": "#d9d9d9",
  "gray-400": "#bfbfbf",
  "gray-500": "#8c8c8c",
  "gray-600": "#595959",
  "gray-700": "#434343",
  "gray-800": "#262626",
  "gray-900": "#1f1f1f",
  "black": "#000000"
}
```

### 字体系统

#### 字体配置
```javascript
{
  "fontFamily": {
    "sans": ["Inter", "system-ui", "sans-serif"],
    "serif": ["Georgia", "serif"],
    "mono": ["Fira Code", "monospace"]
  },
  "fontSize": {
    "xs": "12px",
    "sm": "14px",
    "base": "16px",
    "lg": "18px",
    "xl": "20px",
    "2xl": "24px",
    "3xl": "30px",
    "4xl": "36px"
  },
  "fontWeight": {
    "light": 300,
    "normal": 400,
    "medium": 500,
    "semibold": 600,
    "bold": 700
  }
}
```

### 间距系统

#### 间距配置
```javascript
{
  "spacing": {
    "0": "0px",
    "1": "4px",
    "2": "8px",
    "3": "12px",
    "4": "16px",
    "5": "20px",
    "6": "24px",
    "8": "32px",
    "10": "40px",
    "12": "48px",
    "16": "64px",
    "20": "80px",
    "24": "96px"
  }
}
```

#### 圆角配置
```javascript
{
  "borderRadius": {
    "none": "0px",
    "sm": "2px",
    "base": "4px",
    "md": "6px",
    "lg": "8px",
    "xl": "12px",
    "2xl": "16px",
    "full": "9999px"
  }
}
```

### 阴影系统

#### 阴影配置
```javascript
{
  "boxShadow": {
    "sm": "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    "base": "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    "md": "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    "lg": "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    "xl": "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
  }
}
```

## 项目管理

### 项目创建

#### 新建空白项目
1. 点击 "新建项目"
2. 选择 "空白项目"
3. 输入项目名称
4. 选择初始模板 (可选)
5. 确认创建

#### 使用模板创建
1. 点击 "新建项目"
2. 选择模板类型
3. 预览模板效果
4. 自定义项目信息
5. 确认创建

### 项目保存

#### 自动保存
- 系统每 30 秒自动保存一次
- 在进行重要操作时自动保存
- 保存状态显示在状态栏

#### 手动保存
- 快捷键: Ctrl+S
- 工具栏保存按钮
- 文件菜单保存选项

#### 版本管理
- 每次保存创建新版本
- 查看历史版本
- 恢复到指定版本
- 比较版本差异

### 项目导入导出

#### 导出项目
支持多种导出格式：

**项目文件 (.felix)**
- 包含完整项目数据
- 可在其他 Felix 实例中导入
- 支持版本兼容性检查

**代码包 (.zip)**
- 生成可部署的代码
- 包含 HTML、CSS、JavaScript
- 支持多种框架 (React、Vue、原生)

#### 导入项目
1. 点击 "导入项目"
2. 选择项目文件
3. 检查兼容性
4. 确认导入设置
5. 完成导入

### 协作功能

#### 项目分享
1. 点击 "分享项目"
2. 生成分享链接
3. 设置访问权限
4. 发送给协作者

#### 实时协作
- 多人同时编辑
- 实时同步变更
- 冲突检测和解决
- 操作历史记录

## 代码生成

### 生成配置

#### 目标框架
- **React**: 生成 React 组件
- **Vue**: 生成 Vue 组件
- **Angular**: 生成 Angular 组件
- **原生 HTML**: 生成纯 HTML/CSS/JS

#### 代码风格
- **TypeScript**: 使用 TypeScript
- **JavaScript**: 使用 JavaScript
- **CSS Modules**: 使用 CSS 模块
- **Styled Components**: 使用样式组件

### 生成流程

#### 1. 配置生成选项
```javascript
{
  "framework": "react",
  "language": "typescript",
  "styling": "css-modules",
  "bundler": "webpack",
  "features": {
    "responsive": true,
    "animations": true,
    "dataBinding": true
  }
}
```

#### 2. 组件转换
系统将可视化组件转换为代码：

```jsx
// 生成的 React 组件示例
import React from 'react';
import styles from './Button.module.css';

interface ButtonProps {
  text: string;
  variant: 'primary' | 'secondary';
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({ 
  text, 
  variant, 
  onClick 
}) => {
  return (
    <button 
      className={`${styles.button} ${styles[variant]}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};
```

#### 3. 样式生成
```css
/* Button.module.css */
.button {
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.primary {
  background-color: #1890ff;
  color: white;
}

.primary:hover {
  background-color: #40a9ff;
}

.secondary {
  background-color: #f5f5f5;
  color: #333;
}
```

#### 4. 数据层生成
```typescript
// 数据服务
export class DataService {
  async fetchUsers(): Promise<User[]> {
    const response = await fetch('/api/users');
    return response.json();
  }
  
  async createUser(user: CreateUserDto): Promise<User> {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });
    return response.json();
  }
}
```

### 部署配置

#### 构建配置
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "react": "^18.0.0",
    "next": "^13.0.0"
  }
}
```

#### 部署脚本
```bash
#!/bin/bash
# 构建项目
npm run build

# 部署到服务器
rsync -avz ./out/ user@server:/var/www/html/

# 重启服务
ssh user@server "sudo systemctl restart nginx"
```

## 高级功能

### 自定义组件开发

#### 组件定义
```typescript
import { ComponentDefinition } from '@/types';

export const CustomChart: ComponentDefinition = {
  id: 'custom-chart',
  name: 'CustomChart',
  type: 'custom-chart',
  category: 'data-display',
  displayName: '自定义图表',
  description: '可配置的数据图表组件',
  icon: <ChartIcon />,
  
  defaultProps: {
    type: 'bar',
    data: [],
    width: 400,
    height: 300
  },
  
  propSchema: {
    type: {
      type: 'select',
      label: '图表类型',
      options: [
        { label: '柱状图', value: 'bar' },
        { label: '折线图', value: 'line' },
        { label: '饼图', value: 'pie' }
      ]
    },
    data: {
      type: 'array',
      label: '数据源',
      required: true
    }
  },
  
  render: (props) => <Chart {...props} />
};
```

#### 组件注册
```typescript
import { registerComponent } from '@/platform';

registerComponent(CustomChart);
```

### 插件系统

#### 插件开发
```typescript
interface Plugin {
  id: string;
  name: string;
  version: string;
  
  install(platform: PlatformAPI): void;
  uninstall(): void;
}

export const MyPlugin: Plugin = {
  id: 'my-plugin',
  name: '我的插件',
  version: '1.0.0',
  
  install(platform) {
    // 注册自定义组件
    platform.registerComponent(CustomComponent);
    
    // 添加工具栏按钮
    platform.addToolbarItem({
      id: 'my-tool',
      label: '我的工具',
      icon: <ToolIcon />,
      onClick: () => console.log('工具被点击')
    });
  },
  
  uninstall() {
    // 清理资源
  }
};
```

### API 扩展

#### 自定义数据源
```typescript
export class CustomDataSource implements DataSource {
  async connect(): Promise<void> {
    // 建立连接
  }
  
  async fetchData(query: any): Promise<any> {
    // 获取数据
  }
  
  async updateData(data: any): Promise<void> {
    // 更新数据
  }
}
```

#### 自定义事件处理器
```typescript
export class CustomEventHandler implements EventHandler {
  canHandle(event: Event): boolean {
    return event.type === 'custom-event';
  }
  
  async handle(event: Event, context: any): Promise<void> {
    // 处理事件
  }
}
```

### 性能优化

#### 组件懒加载
```typescript
const LazyComponent = React.lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <LazyComponent />
    </Suspense>
  );
}
```

#### 虚拟滚动
```typescript
import { VirtualList } from '@/components';

function DataList({ data }) {
  return (
    <VirtualList
      data={data}
      itemHeight={50}
      renderItem={({ item, index }) => (
        <div key={index}>{item.name}</div>
      )}
    />
  );
}
```

#### 缓存策略
```typescript
import { useCache } from '@/hooks';

function DataComponent() {
  const { data, loading } = useCache('api-data', fetchData, {
    ttl: 5 * 60 * 1000, // 5分钟缓存
    staleWhileRevalidate: true
  });
  
  return loading ? <Loading /> : <DataView data={data} />;
}
```

---

这份用户手册涵盖了 Felix 低代码平台的所有主要功能。如果你需要更详细的信息，请参考相关的技术文档或联系支持团队。