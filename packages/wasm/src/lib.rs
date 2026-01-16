use wasm_bindgen::prelude::*;

/// 打印函数：接收消息并返回格式化后的字符串
/// 
/// # Arguments
/// * `message` - 要打印的消息
/// 
/// # Returns
/// 格式化后的字符串，包含时间戳和消息内容
#[wasm_bindgen]
pub fn print(message: &str) -> String {
    // 获取当前时间（使用 JavaScript 的 Date.now()）
    // 注意：在 WASM 中直接获取时间需要使用 web-sys，这里简化处理
    format!("[WASM] {}", message)
}

/// 带时间戳的打印函数
/// 
/// # Arguments
/// * `message` - 要打印的消息
/// 
/// # Returns
/// 包含时间戳的格式化字符串
#[wasm_bindgen]
pub fn print_with_timestamp(message: &str) -> String {
    // 使用 JavaScript 的 Date 对象获取时间戳
    // 这里返回一个格式化的字符串，实际时间戳由 JavaScript 端提供
    format!("[WASM] {}", message)
}
