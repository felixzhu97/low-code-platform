use wasm_bindgen::prelude::*;
use serde_json::Value;

/// 格式化 JSON 字符串
#[wasm_bindgen]
pub fn format_json(json_string: &str, indent: Option<usize>) -> String {
    let indent = indent.unwrap_or(2);
    
    match serde_json::from_str::<Value>(json_string) {
        Ok(data) => {
            match serde_json::to_string_pretty(&data) {
                Ok(formatted) => {
                    // 自定义缩进（serde_json 只支持固定 2 空格缩进）
                    if indent == 2 {
                        formatted
                    } else {
                        adjust_indent(&formatted, indent)
                    }
                }
                Err(_) => json_string.to_string(),
            }
        }
        Err(_) => json_string.to_string(),
    }
}

/// 压缩 JSON 字符串（移除空格和换行）
#[wasm_bindgen]
pub fn minify_json(json_string: &str) -> String {
    match serde_json::from_str::<Value>(json_string) {
        Ok(data) => {
            match serde_json::to_string(&data) {
                Ok(minified) => minified,
                Err(_) => json_string.to_string(),
            }
        }
        Err(_) => json_string.to_string(),
    }
}

/// 调整 JSON 字符串的缩进
fn adjust_indent(json: &str, target_indent: usize) -> String {
    if target_indent == 0 {
        return json.replace("  ", "");
    }

    let indent_str = " ".repeat(target_indent);
    let mut result = String::new();
    let mut current_indent = 0;

    for line in json.lines() {
        let trimmed = line.trim();
        if trimmed.is_empty() {
            continue;
        }

        // 计算当前行的缩进级别
        let line_indent = line.len() - line.trim_start().len();
        let level = if line_indent > 0 {
            line_indent / 2 // serde_json 使用 2 空格缩进
        } else {
            0
        };

        // 调整缩进级别
        if trimmed.starts_with('}') || trimmed.starts_with(']') {
            current_indent = if level > 0 { level - 1 } else { 0 };
        } else {
            current_indent = level;
        }

        // 应用新的缩进
        result.push_str(&indent_str.repeat(current_indent));
        result.push_str(trimmed);
        result.push('\n');

        // 更新缩进级别（为下一行做准备）
        if trimmed.ends_with('{') || trimmed.ends_with('[') {
            current_indent += 1;
        }
    }

    result.trim_end().to_string()
}
