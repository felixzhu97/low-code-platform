use wasm_bindgen::prelude::*;
use serde::{Deserialize, Serialize};
use serde_json::Value;

#[derive(Serialize, Deserialize, Clone)]
#[serde(tag = "type")]
pub enum JsonType {
    #[serde(rename = "array")]
    Array,
    #[serde(rename = "object")]
    Object,
    #[serde(rename = "primitive")]
    Primitive,
    #[serde(rename = "null")]
    Null,
    #[serde(rename = "undefined")]
    Undefined,
}

#[derive(Serialize, Deserialize)]
pub struct JsonAnalysisResult {
    #[serde(rename = "type")]
    pub json_type: JsonType,
    pub structure: Value,
    pub paths: Vec<String>,
    pub sample: Option<Value>,
}

/// 分析 JSON 数据结构
#[wasm_bindgen]
pub fn analyze_json_structure(data: &JsValue) -> JsValue {
    let value: Value = match data.into_serde() {
        Ok(v) => v,
        Err(_) => {
            // 处理 undefined
            let result = JsonAnalysisResult {
                json_type: JsonType::Undefined,
                structure: Value::Null,
                paths: vec![],
                sample: None,
            };
            return JsValue::from_serde(&result).unwrap();
        }
    };

    let result = analyze_value(&value);
    JsValue::from_serde(&result).unwrap()
}

fn analyze_value(value: &Value) -> JsonAnalysisResult {
    match value {
        Value::Null => JsonAnalysisResult {
            json_type: JsonType::Null,
            structure: Value::Null,
            paths: vec![],
            sample: None,
        },
        Value::Array(arr) => {
            let mut paths = vec!["[]".to_string()];
            let mut sample: Option<Value> = None;

            if !arr.is_empty() {
                sample = Some(arr[0].clone());
                let item_analysis = analyze_value(&arr[0]);
                for path in item_analysis.paths {
                    let full_path = if path.starts_with('.') {
                        format!("[0]{}", path)
                    } else {
                        format!("[0].{}", path)
                    };
                    paths.push(full_path);
                }
            }

            let structure = if let Some(ref s) = sample {
                if s.is_array() {
                    Value::String("array[]".to_string())
                } else {
                    Value::String(format!("{}", s))
                }
            } else {
                Value::String("array".to_string())
            };

            JsonAnalysisResult {
                json_type: JsonType::Array,
                structure,
                paths,
                sample,
            }
        }
        Value::Object(obj) => {
            let mut paths = vec![];
            let mut structure_obj = serde_json::Map::new();

            for (key, val) in obj.iter() {
                paths.push(format!(".{}", key));
                structure_obj.insert(key.clone(), Value::String(get_type_string(val)));

                // 递归分析嵌套结构
                if val.is_object() || val.is_array() {
                    let nested_analysis = analyze_value(val);
                    for path in nested_analysis.paths {
                        paths.push(format!(".{}{}", key, path));
                    }
                }
            }

            JsonAnalysisResult {
                json_type: JsonType::Object,
                structure: Value::Object(structure_obj),
                paths,
                sample: None,
            }
        }
        _ => {
            // 原始类型
            JsonAnalysisResult {
                json_type: JsonType::Primitive,
                structure: Value::String(get_type_string(value)),
                paths: vec![],
                sample: Some(value.clone()),
            }
        }
    }
}

fn get_type_string(value: &Value) -> String {
    match value {
        Value::Null => "null".to_string(),
        Value::Bool(_) => "boolean".to_string(),
        Value::Number(_) => "number".to_string(),
        Value::String(_) => "string".to_string(),
        Value::Array(_) => "array".to_string(),
        Value::Object(_) => "object".to_string(),
    }
}

/// 从 JSON 字符串分析结构
#[wasm_bindgen]
pub fn analyze_json_string(json_string: &str) -> JsValue {
    match serde_json::from_str::<Value>(json_string) {
        Ok(value) => {
            let result = analyze_value(&value);
            JsValue::from_serde(&result).unwrap()
        }
        Err(_) => {
            // 返回 null 表示分析失败
            JsValue::NULL
        }
    }
}

/// 提取所有可用路径
#[wasm_bindgen]
pub fn extract_paths(data: &JsValue, prefix: &str) -> Vec<String> {
    let value: Value = match data.into_serde() {
        Ok(v) => v,
        Err(_) => return vec![],
    };

    extract_paths_from_value(&value, prefix)
}

fn extract_paths_from_value(value: &Value, prefix: &str) -> Vec<String> {
    let mut paths = vec![];

    match value {
        Value::Null | Value::Bool(_) | Value::Number(_) | Value::String(_) => {
            if !prefix.is_empty() {
                paths.push(prefix.to_string());
            }
        }
        Value::Array(arr) => {
            if !prefix.is_empty() && !arr.is_empty() {
                paths.push(prefix.to_string());
            }

            if !arr.is_empty() {
                let first_path = if prefix.is_empty() {
                    "[0]".to_string()
                } else {
                    format!("{}[0]", prefix)
                };
                paths.push(first_path.clone());
                paths.extend(extract_paths_from_value(&arr[0], &first_path));
            }
        }
        Value::Object(obj) => {
            if !prefix.is_empty() && !obj.is_empty() {
                paths.push(prefix.to_string());
            }

            for (key, val) in obj.iter() {
                let current_path = if prefix.is_empty() {
                    key.clone()
                } else {
                    format!("{}.{}", prefix, key)
                };

                match val {
                    Value::Null | Value::Bool(_) | Value::Number(_) | Value::String(_) => {
                        paths.push(current_path);
                    }
                    Value::Array(arr_val) => {
                        paths.push(current_path.clone());
                        if !arr_val.is_empty() {
                            let arr_path = format!("{}[0]", current_path);
                            paths.push(arr_path.clone());
                            paths.extend(extract_paths_from_value(&arr_val[0], &arr_path));
                        }
                    }
                    Value::Object(_) => {
                        paths.extend(extract_paths_from_value(val, &current_path));
                    }
                }
            }
        }
    }

    paths
}

/// 检查 JSON 是否为数组格式
#[wasm_bindgen]
pub fn is_array_format(json_string: &str) -> bool {
    match serde_json::from_str::<Value>(json_string) {
        Ok(Value::Array(_)) => true,
        _ => false,
    }
}

/// 检查 JSON 是否为对象格式
#[wasm_bindgen]
pub fn is_object_format(json_string: &str) -> bool {
    match serde_json::from_str::<Value>(json_string) {
        Ok(Value::Object(_)) => true,
        _ => false,
    }
}
