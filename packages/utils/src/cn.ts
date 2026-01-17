import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * 合并类名工具函数
 * 结合 clsx 和 tailwind-merge 的功能，智能合并 Tailwind CSS 类名
 *
 * @param inputs - 类名值（字符串、数组、对象等）
 * @returns 合并后的类名字符串
 *
 * @example
 * ```ts
 * cn("px-2 py-1", "px-4") // "py-1 px-4"
 * cn({ "bg-red": true, "bg-blue": false }) // "bg-red"
 * ```
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
