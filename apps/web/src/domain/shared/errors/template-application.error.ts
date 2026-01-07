import type { Component } from "../../component/entities/component.entity";

/**
 * 模板应用错误
 * 当应用模板时发生错误时抛出
 */
export class TemplateApplicationError extends Error {
  constructor(
    message: string,
    public readonly templateComponents: Component[]
  ) {
    super(message);
    this.name = "TemplateApplicationError";
  }
}

