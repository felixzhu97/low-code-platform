/**
 * WASM 占位符模块
 * 当 WASM 包未构建时使用此占位符，避免构建错误
 */

export default async function wasmStub() {
  console.warn("WASM module is not available. Using stub implementation.");
  return Promise.resolve();
}

// 导出占位符函数
export const parse_csv = () => {
  throw new Error("WASM module not available. Please build WASM first.");
};

export const parse_xml = () => {
  throw new Error("WASM module not available. Please build WASM first.");
};

export const validate_json = () => {
  throw new Error("WASM module not available. Please build WASM first.");
};

export const serialize_schema = () => {
  throw new Error("WASM module not available. Please build WASM first.");
};

export const deserialize_schema = () => {
  throw new Error("WASM module not available. Please build WASM first.");
};

export const validate_schema = () => {
  throw new Error("WASM module not available. Please build WASM first.");
};

export const migrate_schema = () => {
  throw new Error("WASM module not available. Please build WASM first.");
};

export const generate_mapping = () => {
  throw new Error("WASM module not available. Please build WASM first.");
};

export const apply_mapping = () => {
  throw new Error("WASM module not available. Please build WASM first.");
};

export const transform_data = () => {
  throw new Error("WASM module not available. Please build WASM first.");
};

export const calculate_layout = () => {
  throw new Error("WASM module not available. Please build WASM first.");
};

export const snap_to_grid = () => {
  throw new Error("WASM module not available. Please build WASM first.");
};

export const detect_collision = () => {
  throw new Error("WASM module not available. Please build WASM first.");
};

export const print = () => {
  throw new Error("WASM module not available. Please build WASM first.");
};

export const print_with_timestamp = () => {
  throw new Error("WASM module not available. Please build WASM first.");
};
