use wasm_bindgen::prelude::*;
use serde_json;
use serde_wasm_bindgen;
use serde::{Serialize, Deserialize};

/// JSON 验证结果（使用 serde 序列化为 JsValue）
#[derive(Serialize, Deserialize)]
struct JsonValidationResultInternal {
    valid: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    error: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    data: Option<serde_json::Value>,
}

/// 验证 JSON 字符串
#[wasm_bindgen]
pub fn validate_json(json_str: &str) -> JsValue {
    // 检查是否为空
    if json_str.trim().is_empty() {
        let result = JsonValidationResultInternal {
            valid: false,
            error: Some("JSON字符串不能为空".to_string()),
            data: None,
        };
        return serde_wasm_bindgen::to_value(&result).unwrap();
    }

    // 尝试解析 JSON
    match serde_json::from_str::<serde_json::Value>(json_str) {
        Ok(value) => {
            let result = JsonValidationResultInternal {
                valid: true,
                error: None,
                data: Some(value),
            };
            serde_wasm_bindgen::to_value(&result).unwrap()
        }
        Err(e) => {
            let result = JsonValidationResultInternal {
                valid: false,
                error: Some(format!("JSON格式错误: {}", e)),
                data: None,
            };
            serde_wasm_bindgen::to_value(&result).unwrap()
        }
    }
}

/// 格式化 JSON 字符串
#[wasm_bindgen]
pub fn format_json(json_str: &str, indent: u32) -> Result<String, JsValue> {
    // 先验证 JSON
    let validation = validate_json(json_str);
    let validation_result: JsonValidationResultInternal =
        serde_wasm_bindgen::from_value(validation).map_err(|e| {
            JsValue::from_str(&format!("解析验证结果失败: {:?}", e))
        })?;

    if !validation_result.valid {
        return Err(JsValue::from_str(
            validation_result
                .error
                .as_deref()
                .unwrap_or("JSON 格式错误"),
        ));
    }

    // 解析 JSON
    let value: serde_json::Value =
        serde_json::from_str(json_str).map_err(|e| {
            JsValue::from_str(&format!("解析 JSON 失败: {}", e))
        })?;

    // 格式化输出
    serde_json::to_string_pretty(&value)
        .map_err(|e| JsValue::from_str(&format!("格式化 JSON 失败: {}", e)))
        .and_then(|formatted| {
            // 如果 indent 不是 2，需要手动调整缩进
            if indent == 2 {
                Ok(formatted)
            } else {
                // 替换缩进
                let indent_str = " ".repeat(indent as usize);
                let adjusted = formatted
                    .lines()
                    .map(|line| {
                        if line.trim().is_empty() {
                            line.to_string()
                        } else {
                            // 计算原缩进级别（假设是 2 空格）
                            let mut leading_spaces = 0;
                            for ch in line.chars() {
                                if ch == ' ' {
                                    leading_spaces += 1;
                                } else {
                                    break;
                                }
                            }
                            let indent_level = leading_spaces / 2;
                            format!(
                                "{}{}",
                                indent_str.repeat(indent_level),
                                line.trim_start()
                            )
                        }
                    })
                    .collect::<Vec<_>>()
                    .join("\n");
                Ok(adjusted)
            }
        })
}

/// 压缩 JSON 字符串（移除空格和换行）
#[wasm_bindgen]
pub fn minify_json(json_str: &str) -> Result<String, JsValue> {
    // 先验证 JSON
    let validation = validate_json(json_str);
    let validation_result: JsonValidationResultInternal =
        serde_wasm_bindgen::from_value(validation).map_err(|e| {
            JsValue::from_str(&format!("解析验证结果失败: {:?}", e))
        })?;

    if !validation_result.valid {
        return Err(JsValue::from_str(
            validation_result
                .error
                .as_deref()
                .unwrap_or("JSON 格式错误"),
        ));
    }

    // 解析 JSON
    let value: serde_json::Value =
        serde_json::from_str(json_str).map_err(|e| {
            JsValue::from_str(&format!("解析 JSON 失败: {}", e))
        })?;

    // 压缩输出（不格式化）
    serde_json::to_string(&value)
        .map_err(|e| JsValue::from_str(&format!("压缩 JSON 失败: {}", e)))
}
