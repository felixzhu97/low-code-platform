use wasm_bindgen::prelude::*;
use serde_json::{Value, Map};
use crate::utils::{log_function_start, log_function_end, log_info, log_error};

/// 生成数据映射
/// 
/// # Arguments
/// * `source_data` - 源数据
/// * `target_structure` - 目标结构
/// 
/// # Returns
/// 映射规则数组
#[wasm_bindgen]
pub fn generate_mapping(source_data: &JsValue, target_structure: &JsValue) -> Result<JsValue, JsValue> {
    log_function_start("generate_mapping");
    
    let source: Value = serde_wasm_bindgen::from_value(source_data.clone())
        .map_err(|e| JsValue::from_str(&format!("Failed to deserialize source data: {}", e)))?;
    
    let target: Value = serde_wasm_bindgen::from_value(target_structure.clone())
        .map_err(|e| JsValue::from_str(&format!("Failed to deserialize target structure: {}", e)))?;
    
    let mappings = generate_mapping_internal(&source, &target, "")
        .map_err(|e| JsValue::from_str(&format!("Failed to generate mapping: {}", e)))?;
    
    serde_wasm_bindgen::to_value(&mappings)
        .map_err(|e| JsValue::from_str(&format!("Failed to serialize mappings: {}", e)))
}

/// 应用映射规则
/// 
/// # Arguments
/// * `data` - 源数据
/// * `mappings` - 映射规则数组
/// 
/// # Returns
/// 转换后的数据
#[wasm_bindgen]
pub fn apply_mapping(data: &JsValue, mappings: &JsValue) -> Result<JsValue, JsValue> {
    log_function_start("apply_mapping");
    
    let source: Value = serde_wasm_bindgen::from_value(data.clone())
        .map_err(|e| JsValue::from_str(&format!("Failed to deserialize data: {}", e)))?;
    
    let mappings: Vec<Value> = serde_wasm_bindgen::from_value(mappings.clone())
        .map_err(|e| JsValue::from_str(&format!("Failed to deserialize mappings: {}", e)))?;
    
    let result = apply_mapping_internal(&source, &mappings)
        .map_err(|e| JsValue::from_str(&format!("Failed to apply mapping: {}", e)))?;
    
    let json_result = serde_wasm_bindgen::to_value(&result)
        .map_err(|e| {
            log_error(&format!("Failed to serialize result: {}", e));
            JsValue::from_str(&format!("Failed to serialize result: {}", e))
        })?;
    
    log_info("Mapping applied successfully");
    log_function_end("apply_mapping");
    Ok(json_result)
}

/// 转换数据
/// 
/// # Arguments
/// * `data` - 源数据
/// * `transform_rules` - 转换规则
/// 
/// # Returns
/// 转换后的数据
#[wasm_bindgen]
pub fn transform_data(data: &JsValue, transform_rules: &JsValue) -> Result<JsValue, JsValue> {
    log_function_start("transform_data");
    
    let source: Value = serde_wasm_bindgen::from_value(data.clone())
        .map_err(|e| JsValue::from_str(&format!("Failed to deserialize data: {}", e)))?;
    
    let rules: Value = serde_wasm_bindgen::from_value(transform_rules.clone())
        .map_err(|e| JsValue::from_str(&format!("Failed to deserialize transform rules: {}", e)))?;
    
    let result = transform_data_internal(&source, &rules)
        .map_err(|e| JsValue::from_str(&format!("Failed to transform data: {}", e)))?;
    
    let json_result = serde_wasm_bindgen::to_value(&result)
        .map_err(|e| {
            log_error(&format!("Failed to serialize result: {}", e));
            JsValue::from_str(&format!("Failed to serialize result: {}", e))
        })?;
    
    log_info("Data transformed successfully");
    log_function_end("transform_data");
    Ok(json_result)
}

// 内部函数：生成映射
fn generate_mapping_internal(source: &Value, target: &Value, prefix: &str) -> Result<Vec<Value>, String> {
    let mut mappings = Vec::new();
    
    if let (Some(source_obj), Some(target_obj)) = (source.as_object(), target.as_object()) {
        for (key, target_val) in target_obj {
            let source_path = if prefix.is_empty() {
                key.clone()
            } else {
                format!("{}.{}", prefix, key)
            };
            
            let target_path = source_path.clone();
            
            if let Some(source_val) = source_obj.get(key) {
                if source_val.is_object() && target_val.is_object() {
                    let nested = generate_mapping_internal(source_val, target_val, &source_path)?;
                    mappings.extend(nested);
                } else {
                    let mut mapping = Map::new();
                    mapping.insert("field".to_string(), Value::String(key.clone()));
                    mapping.insert("sourcePath".to_string(), Value::String(source_path));
                    mapping.insert("targetPath".to_string(), Value::String(target_path));
                    mappings.push(Value::Object(mapping));
                }
            } else {
                let mut mapping = Map::new();
                mapping.insert("field".to_string(), Value::String(key.clone()));
                mapping.insert("sourcePath".to_string(), Value::String(source_path.clone()));
                mapping.insert("targetPath".to_string(), Value::String(target_path));
                mapping.insert("defaultValue".to_string(), Value::Null);
                mappings.push(Value::Object(mapping));
            }
        }
    } else if let (Some(source_arr), Some(target_arr)) = (source.as_array(), target.as_array()) {
        if let Some(first_source) = source_arr.first() {
            if let Some(first_target) = target_arr.first() {
                let nested = generate_mapping_internal(first_source, first_target, prefix)?;
                mappings.extend(nested);
            }
        }
    }
    
    Ok(mappings)
}

// 内部函数：应用映射
fn apply_mapping_internal(data: &Value, mappings: &[Value]) -> Result<Value, String> {
    let mut result = Map::new();
    
    for mapping in mappings {
        if let Some(mapping_obj) = mapping.as_object() {
            let source_path = mapping_obj.get("sourcePath")
                .and_then(|v| v.as_str())
                .ok_or("Missing sourcePath in mapping")?;
            
            let target_path = mapping_obj.get("targetPath")
                .and_then(|v| v.as_str())
                .ok_or("Missing targetPath in mapping")?;
            
            let value = get_value_by_path(data, source_path)
                .or_else(|| mapping_obj.get("defaultValue").cloned())
                .unwrap_or(Value::Null);
            
            set_value_by_path(&mut result, target_path, value)?;
        }
    }
    
    Ok(Value::Object(result))
}

// 内部函数：转换数据
fn transform_data_internal(data: &Value, rules: &Value) -> Result<Value, String> {
    if let Some(rules_obj) = rules.as_object() {
        let mut result = data.clone();
        
        if let Some(transform_type) = rules_obj.get("type").and_then(|v| v.as_str()) {
            match transform_type {
                "string" => {
                    result = Value::String(data.to_string());
                }
                "number" => {
                    if let Some(n) = data.as_f64() {
                        if let Some(num) = serde_json::Number::from_f64(n) {
                            result = Value::Number(num);
                        }
                    } else if let Some(s) = data.as_str() {
                        if let Ok(n) = s.parse::<f64>() {
                            if let Some(num) = serde_json::Number::from_f64(n) {
                                result = Value::Number(num);
                            }
                        }
                    }
                }
                "boolean" => {
                    result = Value::Bool(data.as_bool().unwrap_or(false));
                }
                _ => {}
            }
        }
        
        Ok(result)
    } else {
        Ok(data.clone())
    }
}

// 辅助函数：根据路径获取值
fn get_value_by_path(data: &Value, path: &str) -> Option<Value> {
    let parts: Vec<&str> = path.split('.').collect();
    let mut current = data;
    
    for part in parts {
        if let Some(obj) = current.as_object() {
            current = obj.get(part)?;
        } else if let Some(arr) = current.as_array() {
            if let Ok(index) = part.parse::<usize>() {
                current = arr.get(index)?;
            } else {
                return None;
            }
        } else {
            return None;
        }
    }
    
    Some(current.clone())
}

// 辅助函数：根据路径设置值
fn set_value_by_path(obj: &mut Map<String, Value>, path: &str, value: Value) -> Result<(), String> {
    let parts: Vec<&str> = path.split('.').collect();
    
    if parts.is_empty() {
        return Err("Path cannot be empty".to_string());
    }
    
    if parts.len() == 1 {
        obj.insert(parts[0].to_string(), value);
        return Ok(());
    }
    
    // 处理嵌套路径
    let mut current = obj;
    let last_index = parts.len() - 1;
    let last_part = parts[last_index];
    
    // 先遍历到最后一个路径段之前
    for part in &parts[..last_index] {
        let entry = current.entry(part.to_string())
            .or_insert_with(|| Value::Object(Map::new()));
        
        if let Some(nested_obj) = entry.as_object_mut() {
            current = nested_obj;
        } else {
            return Err(format!("Path segment '{}' is not an object", part));
        }
    }
    
    // 在最后一个路径段设置值
    current.insert(last_part.to_string(), value);
    
    Ok(())
}
