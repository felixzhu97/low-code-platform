/// 日志工具模块
/// 提供在 WASM 环境中打印日志的功能

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
    
    #[wasm_bindgen(js_namespace = console)]
    fn warn(s: &str);
    
    #[wasm_bindgen(js_namespace = console)]
    fn error(s: &str);
}

/// 打印调试信息
pub fn log_debug(message: &str) {
    log(&format!("[WASM DEBUG] {}", message));
}

/// 打印信息
pub fn log_info(message: &str) {
    log(&format!("[WASM INFO] {}", message));
}

/// 打印警告
pub fn log_warn(message: &str) {
    warn(&format!("[WASM WARN] {}", message));
}

/// 打印错误
pub fn log_error(message: &str) {
    error(&format!("[WASM ERROR] {}", message));
}

/// 打印函数调用开始
pub fn log_function_start(function_name: &str) {
    warn(&format!("[WASM] → {}()", function_name));
}

/// 打印函数调用结束
pub fn log_function_end(function_name: &str) {
    warn(&format!("[WASM] ← {}()", function_name));
}

/// 打印函数调用（带参数）
pub fn log_function_call(function_name: &str, args: &str) {
    log(&format!("[WASM] → {}({})", function_name, args));
}

/// 打印函数返回结果
pub fn log_function_result(function_name: &str, result: &str) {
    log(&format!("[WASM] ← {}() = {}", function_name, result));
}
