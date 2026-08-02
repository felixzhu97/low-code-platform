import type { Component } from "@/component/domain/types";

export type TemplateSelectHandler = (templateComponents: Component[]) => void;

export class TemplateApplicationError extends Error {
  constructor(
    message: string,
    public readonly templateComponents: Component[]
  ) {
    super(message);
    this.name = "TemplateApplicationError";
  }
}
