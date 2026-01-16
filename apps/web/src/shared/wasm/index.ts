/**
 * WASM 模块封装
 * 提供类型安全的接口来使用 Rust 编译的 WebAssembly 模块
 */

let wasmModule: any = null;
let isInitialized = false;
let initPromise: Promise<any> | null = null;

/**
 * 初始化 WASM 模块
 * 使用动态导入避免服务端渲染问题
 */
export async function initWasm(): Promise<void> {
  if (isInitialized && wasmModule) {
    return;
  }

  if (initPromise) {
    return initPromise;
  }

  // 只在客户端执行
  if (globalThis.window === undefined) {
    throw new TypeError(
      "WASM module can only be initialized on the client side"
    );
  }

  initPromise = (async () => {
    try {
      // 动态导入 WASM 模块
      // 使用包名导入（通过 webpack alias 解析）
      const wasm = await import("@lowcode-platform/wasm");

      // 初始化 WASM
      await wasm.default();

      wasmModule = wasm;
      isInitialized = true;
    } catch (error) {
      console.error("Failed to initialize WASM module:", error);
      throw error;
    }
  })();

  return initPromise;
}

/**
 * 打印函数：接收消息并返回格式化后的字符串
 *
 * @param message - 要打印的消息
 * @returns 格式化后的字符串
 */
export async function print(message: string): Promise<string> {
  await initWasm();

  if (!wasmModule) {
    throw new TypeError("WASM module is not initialized");
  }

  return wasmModule.print(message);
}

/**
 * 带时间戳的打印函数
 *
 * @param message - 要打印的消息
 * @returns 包含时间戳的格式化字符串
 */
export async function printWithTimestamp(message: string): Promise<string> {
  await initWasm();

  if (!wasmModule) {
    throw new TypeError("WASM module is not initialized");
  }

  return wasmModule.print_with_timestamp(message);
}

/**
 * 检查 WASM 模块是否已初始化
 */
export function isWasmInitialized(): boolean {
  return isInitialized;
}
