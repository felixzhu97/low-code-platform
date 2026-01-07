import type { Component } from "@/domain/component";
import type {
  ITemplateRepositoryPort,
  IStateManagementPort,
} from "@/application/ports";
import { ApplyTemplateUseCase } from "@/application/use-cases";

/**
 * 模板适配器
 * 表现层与模板用例之间的适配器
 */
export class TemplateAdapter {
  private applyTemplateUseCase: ApplyTemplateUseCase;

  constructor(
    templateRepository: ITemplateRepositoryPort,
    stateManagement: IStateManagementPort
  ) {
    this.applyTemplateUseCase = new ApplyTemplateUseCase(
      templateRepository,
      stateManagement
    );
  }

  /**
   * 应用模板
   */
  async applyTemplate(templateId: string): Promise<Component[]> {
    return await this.applyTemplateUseCase.execute(templateId);
  }

  /**
   * 直接应用组件数组（用于从模板库选择）
   */
  async applyTemplateFromComponents(
    templateComponents: Component[]
  ): Promise<Component[]> {
    return await this.applyTemplateUseCase.executeFromComponents(
      templateComponents
    );
  }
}
