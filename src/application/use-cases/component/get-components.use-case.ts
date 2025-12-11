import type { Component } from "@/domain/entities/types";
import type { IComponentRepositoryPort } from "@/application/ports";

/**
 * 获取组件用例
 */
export class GetComponentsUseCase {
  constructor(private readonly componentRepository: IComponentRepositoryPort) {}

  /**
   * 获取所有组件
   */
  async execute(): Promise<Component[]> {
    return await this.componentRepository.findAll();
  }

  /**
   * 根据ID获取组件
   */
  async executeById(id: string): Promise<Component | null> {
    return await this.componentRepository.findById(id);
  }

  /**
   * 获取根级组件
   */
  async executeRootComponents(): Promise<Component[]> {
    return await this.componentRepository.findRootComponents();
  }

  /**
   * 根据父组件ID获取子组件
   */
  async executeByParentId(parentId: string): Promise<Component[]> {
    return await this.componentRepository.findByParentId(parentId);
  }
}

