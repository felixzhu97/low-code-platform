# 组件库文档

## 🏗️ 核心组件

### 表单元素

- `Button` - 可定制样式的按钮
- `Input` - 带验证的文本输入框
- `Checkbox` - 受控复选框
- `Select` - 下拉选择器
- `Form` - 带验证的表单构建器

### 布局组件

- `Card` - 灵活的内容容器
- `Accordion` - 可折叠区域
- `Tabs` - 标签页组件
- `Resizable` - 可调整大小的面板

### 数据展示

- `Table` - 可排序的数据表格
- `Chart` - 数据可视化图表
- `Badge` - 状态标记

## 🎨 UI 基础组件

基于 Radix UI 和 Tailwind 样式化的组件:

- `Alert` - 系统提示
- `Dialog` - 模态窗口
- `Tooltip` - 上下文帮助
- `Toast` - 通知系统
- `Avatar` - 用户头像

## 使用示例

```tsx
import { Button } from "@/components/ui/button";

function Example() {
  return (
    <Button variant="primary" size="lg">
      点击我
    </Button>
  );
}
```

## Props 文档

每个组件都包含完整的 TypeScript 类型定义。
