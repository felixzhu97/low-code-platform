/**
 * WASM 模块 Mock
 * 用于测试环境，当 WASM 模块不存在时使用
 */

// Mock WASM 模块导入，避免测试时解析错误
if (typeof window !== "undefined") {
  // 在浏览器环境中，动态导入会失败但不会影响测试
  // Vite 在构建时解析导入，我们需要通过配置来处理
}
