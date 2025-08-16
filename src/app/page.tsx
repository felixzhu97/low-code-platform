/**
 * 主页面 - 使用MVVM架构重构
 * 现在使用新的MVVM架构，保持向后兼容
 */

"use client";

// 导入新的MVVM视图组件
import { LowCodePlatformView } from "@/mvvm";

export default function LowCodePlatform() {
  return <LowCodePlatformView />;
}
