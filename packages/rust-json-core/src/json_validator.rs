use wasm_bindgen::prelude::*;
use serde::{Deserialize, Serialize};
use serde_json::Value;

#[derive(Serialize, Deserialize)]
pub struct JsonValidationResult {
    pub valid: bool,
    pub error: Option<String>,
    pub data: Option<Value>,
}

/// 验证 JSON 字符串
#[wasm_bindgen]
pub fn validate_json(json_string: &str) -> JsValue {
    if json_string.trim().is_empty() {
        let result = JsonValidationResult {
            valid: false,
            error: Some("JSON字符串不能为空".to_string()),
            data: None,
        };
        return JsValue::from_serde(&result).unwrap();
    }

    match serde_json::from_str::<Value>(json_string) {
        Ok(data) => {
            let result = JsonValidationResult {
                valid: true,
                error: None,
                data: Some(data),
            };
            JsValue::from_serde(&result).unwrap()
        }
        Err(e) => {
            let result = JsonValidationResult {
                valid: false,
                error: Some(format!("JSON格式错误: {}", e)),
                data: None,
            };
            JsValue::from_serde(&result).unwrap()
        }
    }
}
