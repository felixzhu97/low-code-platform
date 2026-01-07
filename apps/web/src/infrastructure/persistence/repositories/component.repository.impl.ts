import type { Component } from "@/domain/component";
import type { IComponentRepository } from "@/domain/component";
import { useComponentStore } from "@/infrastructure/state-management/stores";

/**
 * 组件仓储实现（基于 Zustand Store）
 * 使用内存状态管理，也可以扩展为使用 LocalStorage 或其他持久化方案
 */
export class ComponentRepositoryImpl implements IComponentRepository {
  async findById(id: string): Promise<Component | null> {
    const components = useComponentStore.getState().components;
    return components.find((c) => c.id === id) || null;
  }

  async findAll(): Promise<Component[]> {
    return useComponentStore.getState().components;
  }

  async save(component: Component): Promise<Component> {
    const store = useComponentStore.getState();
    const existing = store.components.find((c) => c.id === component.id);

    if (existing) {
      store.updateComponent(component.id, component);
    } else {
      store.addComponent(component);
    }

    return component;
  }

  async saveAll(components: Component[]): Promise<Component[]> {
    const store = useComponentStore.getState();
    store.updateComponents(components);
    return components;
  }

  async delete(id: string): Promise<void> {
    useComponentStore.getState().deleteComponent(id);
  }

  async deleteAll(ids: string[]): Promise<void> {
    ids.forEach((id) => {
      useComponentStore.getState().deleteComponent(id);
    });
  }

  async clear(): Promise<void> {
    useComponentStore.getState().clearAllComponents();
  }

  async findByParentId(parentId: string): Promise<Component[]> {
    const components = useComponentStore.getState().components;
    return components.filter((c) => c.parentId === parentId);
  }

  async findRootComponents(): Promise<Component[]> {
    const components = useComponentStore.getState().components;
    return components.filter((c) => !c.parentId);
  }
}

