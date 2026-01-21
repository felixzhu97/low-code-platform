/**
 * 服务端存根文件
 * 在服务端构建时使用，避免尝试加载 WASM 模块
 * 这个文件只在服务端构建时被 webpack 解析，实际运行时不会被调用
 * 因为代码中已经有 globalThis.window 检查
 */

export default function() {
  return Promise.reject(new Error("WASM module cannot be used on the server side"));
}

// 导出所有可能的函数，避免运行时错误
export function print() {
  throw new Error("WASM module cannot be used on the server side");
}

export function print_with_timestamp() {
  throw new Error("WASM module cannot be used on the server side");
}
