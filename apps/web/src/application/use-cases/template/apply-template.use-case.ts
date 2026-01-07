import type { Component } from "@/domain/component";
import type {
  ITemplateRepositoryPort,
  IStateManagementPort,
} from "@/application/ports";
import { TemplateService } from "@/application/services/template-command.service";

/**
 * 应用模板用例
 */
export class ApplyTemplateUseCase {
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
      throw new Error(`Template with id ${templateId} not found`);
    }

    // 使用模板服务应用模板
    const components = TemplateService.applyTemplate(template.components);

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
    // 使用模板服务应用模板
    const components = TemplateService.applyTemplate(templateComponents);

    // 更新状态管理
    this.stateManagement.setComponents(components);

    return components;
  }
}
