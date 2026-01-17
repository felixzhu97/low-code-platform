/**
 * 浅拷贝工具函数
 */

/**
 * 浅拷贝对象或数组
 *
 * @param obj - 要拷贝的对象或数组
 * @returns 拷贝后的新对象或数组
 *
 * @example
 * ```ts
 * const obj = { a: 1, b: { c: 2 } };
 * const cloned = shallowClone(obj);
 * ```
 */
export function shallowClone<T>(obj: T): T {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (Array.isArray(obj)) {
    return [...obj] as T;
  }

  return { ...obj };
}

/**
 * 深度拷贝对象或数组
 *
 * @param obj - 要拷贝的对象或数组
 * @returns 拷贝后的新对象或数组
 *
 * @example
 * ```ts
 * const obj = { a: 1, b: { c: 2 } };
 * const cloned = deepClone(obj);
 * ```
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T;
  }

  if (obj instanceof Array) {
    return obj.map((item) => deepClone(item)) as T;
  }

  if (typeof obj === "object") {
    const clonedObj = {} as T;
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }

  return obj;
}
