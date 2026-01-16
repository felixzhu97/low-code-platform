"use client";

import { useState, useEffect } from "react";
import { loadWasmModule, getWasmModule, type WasmModule } from "./wasm-loader";

export interface UseWasmResult {
  wasm: WasmModule | null;
  loading: boolean;
  error: Error | null;
  reload: () => Promise<void>;
}

/**
 * React Hook 用于加载和使用 WASM 模块
 * @returns UseWasmResult 包含 wasm 模块、加载状态和错误信息
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { wasm, loading, error } = useWasm();
 *
 *   if (loading) return <div>Loading WASM...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *   if (!wasm) return null;
 *
 *   const result = wasm.add(1, 2);
 *   return <div>Result: {result}</div>;
 * }
 * ```
 */
export function useWasm(): UseWasmResult {
  const [wasm, setWasm] = useState<WasmModule | null>(getWasmModule());
  const [loading, setLoading] = useState<boolean>(!wasm);
  const [error, setError] = useState<Error | null>(null);

  console.log("[useWasm] Hook initialized", {
    hasWasm: wasm !== null,
    loading,
    hasError: error !== null,
  });

  useEffect(() => {
    console.log("[useWasm] useEffect triggered", { wasm: wasm !== null });

    // 如果已经加载，直接返回
    if (wasm) {
      console.log("[useWasm] WASM module already available, skipping load");
      setLoading(false);
      return;
    }

    console.log("[useWasm] Starting to load WASM module...");

    // 加载 WASM 模块
    let cancelled = false;

    loadWasmModule()
      .then((module) => {
        if (cancelled) {
          console.log("[useWasm] Component unmounted, ignoring loaded module");
          return;
        }
        console.log("[useWasm] WASM module loaded successfully in hook");
        setWasm(module);
        setLoading(false);
        setError(null);
        console.log(
          "[useWasm] State updated: wasm loaded, loading=false, error=null"
        );
      })
      .catch((err) => {
        if (cancelled) {
          console.log("[useWasm] Component unmounted, ignoring error");
          return;
        }
        console.error("[useWasm] Failed to load WASM module in hook:", err);
        const errorObj = err instanceof Error ? err : new Error(String(err));
        setError(errorObj);
        setLoading(false);
        console.log("[useWasm] State updated: error set, loading=false");
      });

    return () => {
      console.log("[useWasm] Cleanup: cancelling WASM load");
      cancelled = true;
    };
  }, [wasm]);

  const reload = async () => {
    console.log("[useWasm] reload() called");
    setLoading(true);
    setError(null);
    setWasm(null);
    console.log("[useWasm] State reset: loading=true, error=null, wasm=null");

    try {
      console.log("[useWasm] Reloading WASM module...");
      const module = await loadWasmModule();
      console.log("[useWasm] WASM module reloaded successfully");
      setWasm(module);
      setLoading(false);
      console.log("[useWasm] Reload complete: wasm loaded, loading=false");
    } catch (err) {
      console.error("[useWasm] Failed to reload WASM module:", err);
      const errorObj = err instanceof Error ? err : new Error(String(err));
      setError(errorObj);
      setLoading(false);
      console.log("[useWasm] Reload failed: error set, loading=false");
    }
  };

  return {
    wasm,
    loading,
    error,
    reload,
  };
}
