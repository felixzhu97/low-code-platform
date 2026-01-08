import type { Component } from "@/domain/component";
import type {
  ITemplateRepositoryPort,
  IStateManagementPort,
} from "@/application/ports";
import { TemplateApplicationError } from "@/domain/shared/errors";

/**
 * 应用模板用例
 * 封装模板应用的业务逻辑
 */
export class ApplyTemplateUseCase {
  private idMapping = new Map<string, string>();

  constructor(
    private readonly templateRepository: ITemplateRepositoryPort,
    private readonly stateManagement: IStateManagementPort
  ) {}

  /**
   * 执行应用模板用例
   */
  async execute(templateId: string): Promise<Component[]> {
    // 从仓储获取模板
    const template = await this.templateRepository.findById(templateId);
    if (!template) {
      throw new TemplateApplicationError(
        `Template with id ${templateId} not found`
      );
    }

    // 处理模板组件
    const components = this.processTemplateComponents(template.components);

    // 更新状态管理
    this.stateManagement.setComponents(components);

    return components;
  }

  /**
   * 直接应用组件数组（用于从模板库选择）
   */
  async executeFromComponents(
    templateComponents: Component[]
  ): Promise<Component[]> {
    // 处理模板组件
    const components = this.processTemplateComponents(templateComponents);

    // 更新状态管理
    this.stateManagement.setComponents(components);

    return components;
  }

  /**
   * 处理模板组件：生成新ID并更新引用
   */
  private processTemplateComponents(
    templateComponents: Component[]
  ): Component[] {
    try {
      if (!templateComponents || templateComponents.length === 0) {
        throw new TemplateApplicationError("No template components provided");
      }

      // 重置ID映射
      this.idMapping.clear();

      // 生成新ID并创建映射
      const processedComponents = templateComponents.map((component) => {
        if (!component.type) {
          throw new TemplateApplicationError(
            `Component missing type: ${component.id}`
          );
        }

        const newId = this.generateUniqueId(component.type);
        this.idMapping.set(component.id, newId);

        return {
          ...component,
          id: newId,
        };
      });

      // 更新组件引用
      return this.updateComponentReferences(processedComponents);
    } catch (error) {
      if (error instanceof TemplateApplicationError) {
        throw error;
      }
      throw new TemplateApplicationError(
        error instanceof Error
          ? error.message
          : "Failed to apply template"
      );
    }
  }

  /**
   * 生成唯一ID
   */
  private generateUniqueId(type: string): string {
    return `${type}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }

  /**
   * 更新组件引用（parentId 和 children）
   */
  private updateComponentReferences(components: Component[]): Component[] {
    return components.map((component) => {
      const updatedComponent = { ...component };

      // 更新 parentId
      if (component.parentId) {
        updatedComponent.parentId =
          this.idMapping.get(component.parentId) || null;
      }

      // 更新 children 引用
      if (component.children && Array.isArray(component.children)) {
        updatedComponent.children = component.children.map(
          (childId: Component | string) => {
            if (typeof childId === "string") {
              return this.idMapping.get(childId) || childId;
            }
            return childId;
          }
        );
      }

      return updatedComponent;
    });
  }
}
