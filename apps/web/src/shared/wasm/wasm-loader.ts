/**
 * WASM 模块加载器
 * 用于动态加载和初始化 WASM 模块
 */

export interface WasmModule {
  add: (a: number, b: number) => number;
  greet: (name: string) => string;
  fibonacci: (n: number) => number;
}

let wasmModule: WasmModule | null = null;
let wasmLoadingPromise: Promise<WasmModule> | null = null;

/**
 * 加载 WASM 模块
 * @returns Promise<WasmModule> WASM 模块实例
 */
export async function loadWasmModule(): Promise<WasmModule> {
  console.log("[WASM Loader] loadWasmModule called");

  // 如果已经加载，直接返回
  if (wasmModule) {
    console.log("[WASM Loader] Module already loaded, returning cached module");
    return wasmModule;
  }

  // 如果正在加载，返回现有的 Promise
  if (wasmLoadingPromise) {
    console.log(
      "[WASM Loader] Module is currently loading, returning existing promise"
    );
    return wasmLoadingPromise;
  }

  console.log("[WASM Loader] Starting to load WASM module...");

  // 开始加载
  wasmLoadingPromise = (async () => {
    try {
      console.log(
        "[WASM Loader] Importing WASM module from ../../wasm/pkg/lowcode_platform_wasm.js"
      );

      // 动态导入 WASM 模块
      // wasm-pack 会根据 Cargo.toml 中的 name 生成包名（转换为下划线命名）
      // @ts-ignore - WASM 模块类型在构建后生成
      const wasm = await import("../../wasm/pkg/lowcode_platform_wasm.js");

      console.log(
        "[WASM Loader] WASM module imported successfully, initializing..."
      );

      // 初始化 WASM 模块
      await wasm.default();

      console.log("[WASM Loader] WASM module initialized successfully");
      console.log("[WASM Loader] Available functions:", {
        hasAdd: typeof wasm.add === "function",
        hasGreet: typeof wasm.greet === "function",
        hasFibonacci: typeof wasm.fibonacci === "function",
      });

      // 将模块保存为 WasmModule 类型
      wasmModule = {
        add: wasm.add,
        greet: wasm.greet,
        fibonacci: wasm.fibonacci,
      } as WasmModule;

      console.log("[WASM Loader] WASM module loaded and ready to use");
      return wasmModule;
    } catch (error) {
      console.error("[WASM Loader] Failed to load WASM module:", error);
      console.error("[WASM Loader] Error details:", {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : typeof error,
      });
      wasmLoadingPromise = null; // 重置 Promise，允许重试
      throw error;
    }
  })();

  return wasmLoadingPromise;
}

/**
 * 获取已加载的 WASM 模块（如果已加载）
 * @returns WasmModule | null
 */
export function getWasmModule(): WasmModule | null {
  console.log(
    "[WASM Loader] getWasmModule called, module exists:",
    wasmModule !== null
  );
  return wasmModule;
}

/**
 * 重置 WASM 模块（用于测试或重新加载）
 */
export function resetWasmModule(): void {
  console.log("[WASM Loader] resetWasmModule called, clearing module cache");
  wasmModule = null;
  wasmLoadingPromise = null;
  console.log("[WASM Loader] Module cache cleared");
}
