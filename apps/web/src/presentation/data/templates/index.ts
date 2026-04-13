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
import { LANDING_TEMPLATES } from "./landing";

/**
 * 所有内置模板（按优先级排序）
 * 注意：前两个模板（Engagement Hotel Dashboard 和 Apple 风格落地页）优先级最高
 */

// 先聚合所有模板到临时数组
const _allTemplates: Template[] = [
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
  ...LANDING_TEMPLATES,
];

// 优先级模板
const PRIORITY_IDS = ["engagement-hotel-dashboard", "apple-landing-page"];

// 按优先级排序：priority 模板放前面，其余按原顺序
const priorityTemplates = _allTemplates.filter((t) => PRIORITY_IDS.includes(t.id));
const otherTemplates = _allTemplates.filter((t) => !PRIORITY_IDS.includes(t.id));

export const ALL_TEMPLATES: Template[] = [...priorityTemplates, ...otherTemplates];

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
  LANDING_TEMPLATES,
};
