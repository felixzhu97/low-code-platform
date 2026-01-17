/**
 * 对象操作工具函数
 */

/**
 * 获取对象的所有键
 */
export function keys<T extends Record<string, unknown>>(
  obj: T
): Array<keyof T> {
  return Object.keys(obj) as Array<keyof T>;
}

/**
 * 获取对象的所有值
 */
export function values<T extends Record<string, unknown>>(obj: T): T[keyof T][] {
  return Object.values(obj);
}

/**
 * 获取对象的键值对数组
 */
export function entries<T extends Record<string, unknown>>(
  obj: T
): Array<[keyof T, T[keyof T]]> {
  return Object.entries(obj) as Array<[keyof T, T[keyof T]]>;
}

/**
 * 从键值对数组创建对象
 */
export function fromEntries<T extends string | number | symbol, V>(
  entries: Array<[T, V]>
): Record<T, V> {
  return Object.fromEntries(entries) as Record<T, V>;
}

/**
 * 选择对象的指定属性
 *
 * @param obj - 源对象
 * @param keys - 要选择的键数组
 * @returns 新对象，包含指定的属性
 */
export function pick<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key];
    }
  }
  return result;
}

/**
 * 排除对象的指定属性
 *
 * @param obj - 源对象
 * @param keys - 要排除的键数组
 * @returns 新对象，不包含指定的属性
 */
export function omit<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj };
  for (const key of keys) {
    delete result[key];
  }
  return result;
}

/**
 * 合并多个对象（深度合并）
 *
 * @param objects - 要合并的对象数组
 * @returns 合并后的对象
 */
export function merge<T extends Record<string, unknown>>(
  ...objects: T[]
): T {
  const result = {} as T;

  for (const obj of objects) {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key];
        if (
          typeof value === "object" &&
          value !== null &&
          !Array.isArray(value) &&
          typeof result[key] === "object" &&
          result[key] !== null &&
          !Array.isArray(result[key])
        ) {
          result[key] = merge(result[key] as T, value as T) as T[keyof T];
        } else {
          result[key] = value;
        }
      }
    }
  }

  return result;
}

/**
 * 检查对象是否有指定的键
 */
export function hasOwn<T extends Record<string, unknown>>(
  obj: T,
  key: string | number | symbol
): key is keyof T {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

/**
 * 获取对象的嵌套属性值（支持路径如 "a.b.c"）
 *
 * @param obj - 源对象
 * @param path - 属性路径
 * @param defaultValue - 默认值（如果路径不存在）
 * @returns 属性值或默认值
 */
export function get<T = unknown>(
  obj: Record<string, unknown>,
  path: string,
  defaultValue?: T
): T | undefined {
  const keys = path.split(".");
  let result: unknown = obj;

  for (const key of keys) {
    if (result === null || result === undefined) {
      return defaultValue;
    }
    result = (result as Record<string, unknown>)[key];
  }

  return (result as T) ?? defaultValue;
}

/**
 * 设置对象的嵌套属性值（支持路径如 "a.b.c"）
 *
 * @param obj - 目标对象
 * @param path - 属性路径
 * @param value - 要设置的值
 */
export function set(
  obj: Record<string, unknown>,
  path: string,
  value: unknown
): void {
  const keys = path.split(".");
  const lastKey = keys.pop()!;
  let current: Record<string, unknown> = obj;

  for (const key of keys) {
    if (!(key in current) || typeof current[key] !== "object") {
      current[key] = {};
    }
    current = current[key] as Record<string, unknown>;
  }

  current[lastKey] = value;
}
