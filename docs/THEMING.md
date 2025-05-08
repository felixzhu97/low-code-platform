# 主题定制指南

## 🎨 主题变量

主题系统使用 CSS 变量和 Tailwind 配置:

```js
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      primary: 'var(--primary)',
      secondary: 'var(--secondary)',
    }
  }
}
```

## 🖌️ 自定义方法

1. 使用主题编辑器组件
2. 修改`tailwind.config.ts`
3. 覆盖`globals.css`中的 CSS 变量

## 示例: 自定义主题

```css
/* globals.css */
:root {
  --primary: #3b82f6;
  --secondary: #10b981;
  --radius: 0.5rem;
}
```

## 组件主题

组件使用`@apply`应用主题变量:

```css
.btn-primary {
  @apply bg-primary text-white;
}
```

## 暗黑模式

使用`next-themes`切换:

```tsx
import { ThemeProvider } from "next-themes";

function App() {
  return <ThemeProvider attribute="class">{/* 你的应用 */}</ThemeProvider>;
}
```
