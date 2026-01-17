/**
 * 数据路径提取工具
 */

/**
 * 提取所有可用路径
 *
 * @param data - 数据对象
 * @param prefix - 路径前缀（默认为空字符串）
 * @returns 路径数组
 */
export function extractPaths(data: unknown, prefix: string = ""): string[] {
  const paths: string[] = [];

  if (data === null || data === undefined) {
    return paths;
  }

  if (Array.isArray(data)) {
    if (prefix) {
      paths.push(prefix);
    }

    if (data.length > 0) {
      paths.push(`${prefix}[0]`);
      const firstItemPaths = extractPaths(data[0], `${prefix}[0]`);
      paths.push(...firstItemPaths);
    }
  } else if (typeof data === "object") {
    if (prefix && Object.keys(data).length > 0) {
      paths.push(prefix);
    }

    for (const [key, value] of Object.entries(data)) {
      const currentPath = prefix ? `${prefix}.${key}` : key;

      if (value === null || value === undefined) {
        paths.push(currentPath);
      } else if (Array.isArray(value)) {
        paths.push(currentPath);
        if (value.length > 0) {
          paths.push(`${currentPath}[0]`);
          const itemPaths = extractPaths(value[0], `${currentPath}[0]`);
          paths.push(...itemPaths);
        }
      } else if (typeof value === "object") {
        const nestedPaths = extractPaths(value, currentPath);
        paths.push(...nestedPaths);
      } else {
        paths.push(currentPath);
      }
    }
  } else {
    if (prefix) {
      paths.push(prefix);
    }
  }

  return paths;
}

/**
 * 根据路径获取数据值
 *
 * @param data - 数据对象
 * @param path - 路径（如 "a.b[0].c"）
 * @returns 数据值
 */
export function getValueByPath(data: unknown, path: string): unknown {
  const keys = path.split(/[.\[\]]/).filter((k) => k);
  let result: unknown = data;

  for (const key of keys) {
    if (result === null || result === undefined) {
      return undefined;
    }

    if (typeof result === "object" && !Array.isArray(result)) {
      result = (result as Record<string, unknown>)[key];
    } else if (Array.isArray(result)) {
      const index = parseInt(key, 10);
      if (!isNaN(index)) {
        result = result[index];
      } else {
        return undefined;
      }
    } else {
      return undefined;
    }
  }

  return result;
}
