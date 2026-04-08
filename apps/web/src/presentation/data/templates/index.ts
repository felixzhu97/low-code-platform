/**
 * 模板数据入口
 * 从领域层导入类型，从各分类文件聚合所有内置模板
 */
import type { Template } from "@/domain/template";
export type { Template };

import { DASHBOARD_TEMPLATES } from "./dashboard";
import { USER_MANAGEMENT_TEMPLATES } from "./user-management";
import { SETTINGS_TEMPLATES } from "./settings";
import { BILLING_TEMPLATES } from "./billing";
import { ONBOARDING_TEMPLATES } from "./onboarding";
import { ANALYTICS_TEMPLATES } from "./analytics";
import { NOTIFICATIONS_TEMPLATES } from "./notifications";
import { PROFILE_TEMPLATES } from "./profile";
import { TEAM_TEMPLATES } from "./team";
import { API_TEMPLATES } from "./api";

/**
 * 所有内置模板
 */
export const ALL_TEMPLATES: Template[] = [
  ...DASHBOARD_TEMPLATES,
  ...USER_MANAGEMENT_TEMPLATES,
  ...SETTINGS_TEMPLATES,
  ...BILLING_TEMPLATES,
  ...ONBOARDING_TEMPLATES,
  ...ANALYTICS_TEMPLATES,
  ...NOTIFICATIONS_TEMPLATES,
  ...PROFILE_TEMPLATES,
  ...TEAM_TEMPLATES,
  ...API_TEMPLATES,
];

/**
 * 获取所有模板类别
 */
export const getAllCategories = (): string[] => {
  return Array.from(
    new Set(ALL_TEMPLATES.map((template) => template?.category ?? ""))
  ).filter(Boolean).sort((a, b) => a.localeCompare(b));
};

/**
 * 获取所有模板标签
 */
export const getAllTags = (): string[] => {
  return Array.from(
    new Set(ALL_TEMPLATES.flatMap((template) => template?.tags ?? []))
  ).sort((a, b) => a.localeCompare(b));
};

/**
 * 按类别获取模板
 */
export const getTemplatesByCategory = (category: string): Template[] => {
  return ALL_TEMPLATES.filter((template) => template?.category === category);
};

/**
 * 按标签获取模板
 */
export const getTemplatesByTag = (tag: string): Template[] => {
  return ALL_TEMPLATES.filter((template) => template?.tags?.includes(tag));
};

/**
 * 根据ID查找模板
 */
export const getTemplateById = (id: string): Template | undefined => {
  return ALL_TEMPLATES.find((template) => template?.id === id);
};

/**
 * 搜索模板（按名称、描述、标签模糊匹配）
 */
export const searchTemplates = (query: string): Template[] => {
  const lowerQuery = query.toLowerCase();
  return ALL_TEMPLATES.filter(
    (template) =>
      template &&
      (template.name.toLowerCase().includes(lowerQuery) ||
        template.description?.toLowerCase().includes(lowerQuery) ||
        template.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery)))
  );
};

/**
 * 按分类导出，方便按需加载
 */
export {
  DASHBOARD_TEMPLATES,
  USER_MANAGEMENT_TEMPLATES,
  SETTINGS_TEMPLATES,
  BILLING_TEMPLATES,
  ONBOARDING_TEMPLATES,
  ANALYTICS_TEMPLATES,
  NOTIFICATIONS_TEMPLATES,
  PROFILE_TEMPLATES,
  TEAM_TEMPLATES,
  API_TEMPLATES,
};
