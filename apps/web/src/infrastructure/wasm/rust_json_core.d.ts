/**
 * Rust WASM 模块类型声明
 * 这些类型会在 wasm-pack 构建时自动生成
 */

export interface JsonValidationResult {
  valid: boolean;
  error?: string;
  data?: any;
}

export interface JsonAnalysisResult {
  type: "array" | "object" | "primitive" | "null" | "undefined";
  structure: any;
  paths: string[];
  sample?: any;
}

declare module "../../../../packages/rust-json-core/pkg/rust_json_core.js" {
  export function validate_json(jsonString: string): JsonValidationResult;
  export function format_json(jsonString: string, indent?: number): string;
  export function minify_json(jsonString: string): string;
  export function analyze_json_structure(data: any): JsonAnalysisResult;
  export function analyze_json_string(jsonString: string): JsonAnalysisResult | null;
  export function extract_paths(data: any, prefix?: string): string[];
  export function is_array_format(jsonString: string): boolean;
  export function is_object_format(jsonString: string): boolean;

  export default function init(): Promise<void>;
}

declare module "./rust_json_core.js" {
  export function validate_json(jsonString: string): JsonValidationResult;
  export function format_json(jsonString: string, indent?: number): string;
  export function minify_json(jsonString: string): string;
  export function analyze_json_structure(data: any): JsonAnalysisResult;
  export function analyze_json_string(jsonString: string): JsonAnalysisResult | null;
  export function extract_paths(data: any, prefix?: string): string[];
  export function is_array_format(jsonString: string): boolean;
  export function is_object_format(jsonString: string): boolean;

  export default function init(): Promise<void>;
}
