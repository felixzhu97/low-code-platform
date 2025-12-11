import type { ITemplateRepository, Template } from "@/domain/repositories";
import type { Component } from "@/domain/entities/types";

/**
 * 模板仓储实现（基于 LocalStorage）
 */
export class TemplateRepositoryImpl implements ITemplateRepository {
  private readonly STORAGE_KEY = "lowcode-templates";

  private getAllTemplates(): Template[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("获取模板列表失败:", error);
      return [];
    }
  }

  private saveAllTemplates(templates: Template[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(templates));
    } catch (error) {
      console.error("保存模板列表失败:", error);
      throw new Error("保存模板失败");
    }
  }

  async findById(id: string): Promise<Template | null> {
    const templates = this.getAllTemplates();
    return templates.find((t) => t.id === id) || null;
  }

  async findAll(): Promise<Template[]> {
    return this.getAllTemplates();
  }

  async findByCategory(category: string): Promise<Template[]> {
    const templates = this.getAllTemplates();
    return templates.filter((t) => t.category === category);
  }

  async findByTags(tags: string[]): Promise<Template[]> {
    const templates = this.getAllTemplates();
    return templates.filter((t) => t.tags?.some((tag) => tags.includes(tag)));
  }

  async search(query: string): Promise<Template[]> {
    const templates = this.getAllTemplates();
    const lowerQuery = query.toLowerCase();
    return templates.filter(
      (t) =>
        t.name.toLowerCase().includes(lowerQuery) ||
        t.description?.toLowerCase().includes(lowerQuery) ||
        t.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
  }

  async save(template: Template): Promise<Template> {
    const templates = this.getAllTemplates();
    const existingIndex = templates.findIndex((t) => t.id === template.id);

    if (existingIndex >= 0) {
      templates[existingIndex] = {
        ...template,
        updatedAt: new Date().toISOString(),
      };
    } else {
      templates.push({
        ...template,
        createdAt: template.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    this.saveAllTemplates(templates);
    return template;
  }

  async delete(id: string): Promise<void> {
    const templates = this.getAllTemplates();
    const filtered = templates.filter((t) => t.id !== id);
    this.saveAllTemplates(filtered);
  }

  async clear(): Promise<void> {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
