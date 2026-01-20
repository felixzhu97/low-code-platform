import type { Component } from "@lowcode-platform/component-utils/types";
import { validateComponent } from "@lowcode-platform/component-utils/validator";
import { ValidationError } from "../types";

/**
 * 组件验证器
 */
export class ComponentValidator {
  /**
   * 验证组件
   */
  validate(component: unknown): asserts component is Component {
    if (!validateComponent(component)) {
      const errors = this.getValidationErrors(component);
      throw new ValidationError(
        "Component validation failed",
        errors
      );
    }
  }

  /**
   * 验证组件数组
   */
  validateArray(components: unknown): asserts components is Component[] {
    if (!Array.isArray(components)) {
      throw new ValidationError("Components must be an array");
    }

    const errors: string[] = [];
    components.forEach((comp, index) => {
      if (!validateComponent(comp)) {
        errors.push(
          `Component at index ${index}: ${this.getValidationErrors(comp).join(", ")}`
        );
      }
    });

    if (errors.length > 0) {
      throw new ValidationError("Component array validation failed", errors);
    }
  }

  /**
   * 获取验证错误详情
   */
  private getValidationErrors(component: unknown): string[] {
    const errors: string[] = [];

    if (!component || typeof component !== "object") {
      return ["Component must be an object"];
    }

    const comp = component as Record<string, unknown>;

    if (typeof comp.id !== "string" || !comp.id) {
      errors.push("Missing or invalid 'id' field");
    }

    if (typeof comp.type !== "string" || !comp.type) {
      errors.push("Missing or invalid 'type' field");
    }

    if (typeof comp.name !== "string" || !comp.name) {
      errors.push("Missing or invalid 'name' field");
    }

    // 验证可选字段的类型
    if (comp.position !== undefined && comp.position !== null) {
      if (
        typeof comp.position !== "object" ||
        typeof (comp.position as Record<string, unknown>).x !== "number" ||
        typeof (comp.position as Record<string, unknown>).y !== "number"
      ) {
        errors.push("Invalid 'position' field (must have x and y numbers)");
      }
    }

    if (comp.properties !== undefined && typeof comp.properties !== "object") {
      errors.push("Invalid 'properties' field (must be an object)");
    }

    if (
      comp.children !== undefined &&
      !Array.isArray(comp.children)
    ) {
      errors.push("Invalid 'children' field (must be an array)");
    }

    if (
      comp.parentId !== undefined &&
      comp.parentId !== null &&
      typeof comp.parentId !== "string"
    ) {
      errors.push("Invalid 'parentId' field (must be string or null)");
    }

    return errors;
  }
}