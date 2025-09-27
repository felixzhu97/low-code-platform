# 视觉效果增强说明

## 概述

本次更新大幅增强了低代码平台的视觉效果，提供了更现代、更流畅的用户体验。

## 主要改进

### 1. 组件交互效果

- **悬停效果**: 所有组件现在都具有平滑的悬停动画

  - 轻微的向上移动 (`translateY(-2px)`)
  - 阴影增强效果
  - 缩放动画 (`hover:scale-105`, `active:scale-95`)

- **选择状态**: 选中的组件具有明显的视觉反馈
  - 彩色渐变边框动画
  - 增强的阴影效果
  - 更高的 z-index 层级

### 2. 动画系统

新增了多种动画效果：

- `slideInScale`: 滑动缩放进入动画
- `float`: 悬浮动画
- `glow`: 发光效果
- `shimmer`: 闪烁加载效果
- `gradientShift`: 渐变色彩变化

### 3. 阴影系统

提供了多层次的阴影效果：

- `shadow-soft`: 柔和阴影
- `shadow-medium`: 中等阴影
- `shadow-strong`: 强烈阴影
- `shadow-colored`: 彩色阴影

### 4. 渐变背景

新增了多种渐变背景选项：

- `gradient-primary`: 主色调渐变
- `gradient-secondary`: 次要色调渐变
- `gradient-success`: 成功色渐变
- `gradient-warm`: 暖色调渐变
- `gradient-cool`: 冷色调渐变

### 5. 特殊效果

- **玻璃拟态效果**: `glass-morphism` 类提供毛玻璃效果
- **悬浮动画**: `floating` 类提供持续的浮动效果
- **组件加载状态**: `component-loading` 提供骨架屏效果

### 6. 组件特定增强

#### 按钮组件

- 支持渐变背景
- 悬停缩放效果
- 图标动画
- 自定义阴影

#### 图片组件

- 悬停缩放效果
- 渐变遮罩层
- 覆盖文字效果
- 滤镜增强

#### 卡片组件

- 渐变背景支持
- 悬浮动画选项
- 增强的阴影效果
- 玻璃拟态效果

#### 徽章和标签

- 悬停缩放效果
- 渐变背景支持
- 脉冲动画选项
- 自定义阴影

#### 轮播组件

- 卡片悬停效果
- 渐变背景卡片
- 箭头按钮动画

### 7. 布局组件增强

#### 网格布局

- 玻璃拟态效果
- 渐变背景
- 拖拽目标高亮

#### 弹性布局

- 暖色调渐变
- 玻璃拟态效果
- 平滑过渡动画

#### 卡片组

- 自动渐变色彩分配
- 悬停缩放效果
- 增强的视觉层次

### 8. 响应式设计

- 支持 `prefers-reduced-motion` 媒体查询
- 自动禁用动画以减少运动敏感用户的不适

## 使用方法

### 基础组件属性

组件现在支持以下新的视觉属性：

```typescript
interface ComponentProps {
  // 视觉效果
  gradient?: boolean; // 启用渐变背景
  shadow?: boolean; // 启用阴影效果
  floating?: boolean; // 启用悬浮动画
  glass?: boolean; // 启用玻璃拟态效果
  hoverEffect?: boolean; // 启用悬停效果

  // 图片特定
  gradientOverlay?: boolean; // 渐变遮罩层
  overlayText?: string; // 覆盖文字

  // 样式自定义
  backgroundColor?: string; // 背景颜色
  textColor?: string; // 文字颜色
  borderColor?: string; // 边框颜色
  borderRadius?: string; // 圆角半径
}
```

### CSS 类名使用

```css
/* 组件交互效果 */
.component-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
}

/* 选中状态 */
.component-selected::before {
  background: linear-gradient(45deg, #3b82f6, #8b5cf6, #06b6d4, #10b981);
  animation: gradientShift 3s ease infinite;
}

/* 拖拽目标 */
.component-drag-over {
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.1) 0%,
    rgba(139, 92, 246, 0.1) 100%
  );
  animation: glow 2s ease-in-out infinite;
}
```

## 性能优化

- 使用 `transform` 和 `opacity` 进行动画，确保 GPU 加速
- 合理的动画持续时间（200-300ms）
- 支持动画偏好设置，尊重用户的辅助功能需求

## 浏览器兼容性

- 现代浏览器完全支持
- 优雅降级，在不支持的浏览器中提供基础样式
- 使用 CSS 自定义属性确保主题一致性

## 未来计划

- 更多动画效果选项
- 自定义动画编辑器
- 主题色彩系统扩展
- 微交互设计增强
