/**
 * 字符串工具函数
 */

/**
 * 首字母大写
 *
 * @param str - 输入字符串
 * @returns 首字母大写的字符串
 */
export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * 转换为驼峰命名
 *
 * @param str - 输入字符串（可以是 kebab-case、snake_case 等）
 * @returns 驼峰命名的字符串
 */
export function camelCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""))
    .replace(/^[A-Z]/, (c) => c.toLowerCase());
}

/**
 * 转换为 kebab-case
 *
 * @param str - 输入字符串
 * @returns kebab-case 字符串
 */
export function kebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
}

/**
 * 转换为 snake_case
 *
 * @param str - 输入字符串
 * @returns snake_case 字符串
 */
export function snakeCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .replace(/[\s-]+/g, "_")
    .toLowerCase();
}

/**
 * 截断字符串
 *
 * @param str - 输入字符串
 * @param length - 最大长度
 * @param suffix - 后缀（默认为 "..."）
 * @returns 截断后的字符串
 */
export function truncate(
  str: string,
  length: number,
  suffix: string = "..."
): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + suffix;
}

/**
 * 移除字符串两端的空白字符
 *
 * @param str - 输入字符串
 * @returns 去除空白后的字符串
 */
export function trim(str: string): string {
  return str.trim();
}

/**
 * 生成随机字符串
 *
 * @param length - 字符串长度
 * @returns 随机字符串
 */
export function randomString(length: number = 8): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
