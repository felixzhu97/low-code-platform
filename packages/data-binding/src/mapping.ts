/**
 * 数据映射工具
 */

/**
 * 数据映射规则
 */
export interface DataMappingRule {
  source: string;
  target: string;
  transform?: (value: unknown) => unknown;
  defaultValue?: unknown;
}

/**
 * 应用数据映射规则
 *
 * @param sourceData - 源数据
 * @param mappingRules - 映射规则数组
 * @returns 映射后的数据
 */
export function applyDataMapping(
  sourceData: unknown,
  mappingRules: DataMappingRule[]
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const rule of mappingRules) {
    try {
      // 从源数据中获取值（简化版，实际可能需要路径解析）
      let value: unknown;

      if (typeof sourceData === "object" && sourceData !== null) {
        value = (sourceData as Record<string, unknown>)[rule.source];
      } else {
        value = undefined;
      }

      // 使用默认值
      if (value === undefined || value === null) {
        value = rule.defaultValue;
      }

      // 应用转换函数
      if (rule.transform && value !== undefined && value !== null) {
        value = rule.transform(value);
      }

      // 设置目标值
      result[rule.target] = value;
    } catch (error) {
      console.warn(`Data mapping failed for rule: ${rule.source} -> ${rule.target}`, error);
      result[rule.target] = rule.defaultValue;
    }
  }

  return result;
}

/**
 * 生成映射规则（自动匹配同名属性）
 *
 * @param sourceStructure - 源数据结构
 * @param targetStructure - 目标数据结构
 * @returns 映射规则数组
 */
export function generateMappingRules(
  sourceStructure: Record<string, unknown>,
  targetStructure: Record<string, unknown>
): DataMappingRule[] {
  const rules: DataMappingRule[] = [];

  for (const targetKey in targetStructure) {
    if (targetKey in sourceStructure) {
      rules.push({
        source: targetKey,
        target: targetKey,
      });
    }
  }

  return rules;
}
