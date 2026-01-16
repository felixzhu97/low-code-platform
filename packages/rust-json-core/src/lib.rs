mod json_validator;
mod json_formatter;
mod json_analyzer;

use wasm_bindgen::prelude::*;

// 重新导出所有公共函数
pub use json_validator::*;
pub use json_formatter::*;
pub use json_analyzer::*;

// 当 WASM 模块加载时调用
#[wasm_bindgen(start)]
pub fn main() {
    // 初始化（如果需要）
}

#[cfg(test)]
mod tests {
    use super::*;
    use wasm_bindgen::JsValue;
    use serde_json;

    #[test]
    fn test_validate_json_valid() {
        let json_string = r#"{"name": "test", "value": 123}"#;
        let result_js = validate_json(json_string);
        // 转换为 serde Value 进行测试
        let result_value: serde_json::Value = result_js.into_serde().unwrap();
        assert_eq!(result_value["valid"], true);
        assert!(result_value.get("error").is_none());
    }

    #[test]
    fn test_validate_json_invalid() {
        let json_string = r#"{"name": "test", "value": 123"#;
        let result_js = validate_json(json_string);
        let result_value: serde_json::Value = result_js.into_serde().unwrap();
        assert_eq!(result_value["valid"], false);
        assert!(result_value.get("error").is_some());
    }

    #[test]
    fn test_format_json() {
        let json_string = r#"{"name":"test","value":123}"#;
        let formatted = format_json(json_string, Some(2));
        assert!(formatted.contains("\n"));
        assert!(formatted.contains("  ")); // 缩进
    }

    #[test]
    fn test_minify_json() {
        let json_string = r#"{
            "name": "test",
            "value": 123
        }"#;
        let minified = minify_json(json_string);
        assert!(!minified.contains("\n"));
        assert!(!minified.contains("  "));
    }

    #[test]
    fn test_is_array_format() {
        assert!(is_array_format(r#"[1, 2, 3]"#));
        assert!(!is_array_format(r#"{"a": 1}"#));
    }

    #[test]
    fn test_is_object_format() {
        assert!(is_object_format(r#"{"a": 1}"#));
        assert!(!is_object_format(r#"[1, 2, 3]"#));
    }
}
