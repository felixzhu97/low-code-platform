import type { Component } from "@/domain/component/entities/component.entity";
import type { IComponentRepository } from "@/domain/repositories/component.repository";
import { store } from "@/infrastructure/state-management/store";
import * as componentActions from "@/infrastructure/state-management/store/slices/component.slice";

export class ComponentRepositoryImpl implements IComponentRepository {
  private getState() {
    return store.getState().component;
  }

  async findById(id: string): Promise<Component | null> {
    const components = this.getState().components;
    return components.find((c) => c.id === id) || null;
  }

  async findAll(): Promise<Component[]> {
    return this.getState().components;
  }

  async save(component: Component): Promise<Component> {
    const state = this.getState();
    const existing = state.components.find((c) => c.id === component.id);

    if (existing) {
      store.dispatch(componentActions.updateComponent({ id: component.id, updates: component }));
    } else {
      store.dispatch(componentActions.addComponent(component));
    }

    return component;
  }

  async saveAll(components: Component[]): Promise<Component[]> {
    store.dispatch(componentActions.updateComponents(components));
    return components;
  }

  async delete(id: string): Promise<void> {
    store.dispatch(componentActions.deleteComponent(id));
  }

  async deleteAll(ids: string[]): Promise<void> {
    ids.forEach((id) => {
      store.dispatch(componentActions.deleteComponent(id));
    });
  }

  async clear(): Promise<void> {
    store.dispatch(componentActions.clearAllComponents());
  }

  async findByParentId(parentId: string): Promise<Component[]> {
    const components = this.getState().components;
    return components.filter((c) => c.parentId === parentId);
  }

  async findRootComponents(): Promise<Component[]> {
    const components = this.getState().components;
    return components.filter((c) => !c.parentId);
  }
}
