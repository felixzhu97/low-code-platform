import type { Component } from '@/domain/entities/types';

export interface TemplateCommand {
  execute(): Component[];
  undo?(): void;
}

export class ApplyTemplateCommand implements TemplateCommand {
  private templateComponents: Component[];
  private idMapping = new Map<string, string>();

  constructor(templateComponents: Component[]) {
    this.templateComponents = templateComponents;
  }

  execute(): Component[] {
    try {
      if (!this.templateComponents || this.templateComponents.length === 0) {
        throw new Error('No template components provided');
      }

      // Generate new IDs and create mapping
      const processedComponents = this.templateComponents.map((component) => {
        if (!component.type) {
          throw new Error(`Component missing type: ${component.id}`);
        }
        
        const newId = this.generateUniqueId(component.type);
        this.idMapping.set(component.id, newId);
        
        return {
          ...component,
          id: newId,
        };
      });

      // Update references
      return this.updateComponentReferences(processedComponents);
    } catch (error) {
      console.error('Template application failed:', error);
      throw error instanceof Error ? error : new Error('Failed to apply template');
    }
  }

  private generateUniqueId(type: string): string {
    return `${type}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }

  private updateComponentReferences(components: Component[]): Component[] {
    return components.map((component) => {
      const updatedComponent = { ...component };

      // Update parentId
      if (component.parentId) {
        updatedComponent.parentId = this.idMapping.get(component.parentId) || null;
      }

      // Update children references
      if (component.children && Array.isArray(component.children)) {
        updatedComponent.children = component.children
          .map((childId) => {
            if (typeof childId === 'string') {
              return this.idMapping.get(childId) || childId;
            }
            return childId;
          })
          .filter((child): child is Component => typeof child !== 'string');
      }

      return updatedComponent;
    });
  }
}

export class TemplateService {
  static applyTemplate(templateComponents: Component[]): Component[] {
    const command = new ApplyTemplateCommand(templateComponents);
    return command.execute();
  }
}