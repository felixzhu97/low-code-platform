use wasm_bindgen::prelude::*;
use serde_json::Value;
use std::collections::HashMap;
use crate::utils::{log_function_start, log_function_end, log_info, log_error, log_function_call, log_function_result};

/// CSV 解析结果
#[derive(Debug, Clone)]
pub struct CsvParseResult {
    pub headers: Vec<String>,
    pub rows: Vec<Vec<String>>,
}

/// 解析 CSV 文本
/// 
/// # Arguments
/// * `csv_text` - CSV 格式的文本
/// 
/// # Returns
/// 解析后的 JSON 数组，每个元素是一个对象
#[wasm_bindgen]
pub fn parse_csv(csv_text: &str) -> Result<JsValue, JsValue> {
    log_function_start("parse_csv");
    log_info(&format!("Parsing CSV text, length: {} bytes", csv_text.len()));
    
    use std::io::Cursor;
    
    let mut reader = csv::ReaderBuilder::new()
        .has_headers(true)
        .flexible(true)
        .from_reader(Cursor::new(csv_text.as_bytes()));
    
    let headers = reader.headers()
        .map_err(|e| JsValue::from_str(&format!("Failed to read CSV headers: {}", e)))?
        .iter()
        .map(|s| s.to_string())
        .collect::<Vec<String>>();
    
    let mut result: Vec<HashMap<String, String>> = Vec::new();
    
    for record in reader.records() {
        let record = record.map_err(|e| JsValue::from_str(&format!("Failed to read CSV record: {}", e)))?;
        let mut row: HashMap<String, String> = HashMap::new();
        
        for (i, field) in record.iter().enumerate() {
            if i < headers.len() {
                row.insert(headers[i].clone(), field.to_string());
            }
        }
        
        result.push(row);
    }
    
    let json_result = serde_wasm_bindgen::to_value(&result)
        .map_err(|e| {
            log_error(&format!("Failed to serialize CSV result: {}", e));
            JsValue::from_str(&format!("Failed to serialize CSV result: {}", e))
        })?;
    
    log_info(&format!("CSV parsed successfully, {} rows", result.len()));
    log_function_end("parse_csv");
    Ok(json_result)
}

/// 解析 XML 文本
/// 
/// # Arguments
/// * `xml_text` - XML 格式的文本
/// 
/// # Returns
/// 解析后的 JSON 对象
#[wasm_bindgen]
pub fn parse_xml(xml_text: &str) -> Result<JsValue, JsValue> {
    log_function_start("parse_xml");
    log_info(&format!("Parsing XML text, length: {} bytes", xml_text.len()));
    
    use quick_xml::events::Event;
    use quick_xml::Reader;
    
    let mut reader = Reader::from_str(xml_text);
    reader.trim_text(true);
    
    let mut result: HashMap<String, Value> = HashMap::new();
    let mut stack: Vec<(String, HashMap<String, Value>)> = Vec::new();
    let mut current_element: Option<(String, HashMap<String, Value>)> = None;
    let mut current_text = String::new();
    
    loop {
        match reader.read_event() {
            Ok(Event::Start(e)) => {
                let name = String::from_utf8_lossy(e.name().as_ref()).to_string();
                let mut attrs: HashMap<String, Value> = HashMap::new();
                
                for attr in e.attributes() {
                    if let Ok(attr) = attr {
                        let key = String::from_utf8_lossy(attr.key.as_ref()).to_string();
                        let value = String::from_utf8_lossy(&attr.value).to_string();
                        attrs.insert(key, Value::String(value));
                    }
                }
                
                if let Some((_, parent)) = current_element.take() {
                    stack.push((String::new(), parent));
                }
                
                current_element = Some((name, attrs));
                current_text.clear();
            }
            Ok(Event::Text(e)) => {
                current_text.push_str(&String::from_utf8_lossy(e.as_ref()));
            }
            Ok(Event::End(e)) => {
                let name = String::from_utf8_lossy(e.name().as_ref()).to_string();
                
                if let Some((elem_name, mut elem_data)) = current_element.take() {
                    if elem_name == name {
                        if !current_text.trim().is_empty() {
                            elem_data.insert("_text".to_string(), Value::String(current_text.trim().to_string()));
                        }
                        
                        let value: Value = if elem_data.len() == 1 && elem_data.contains_key("_text") {
                            elem_data.remove("_text").unwrap()
                        } else {
                            Value::Object(
                                elem_data.into_iter()
                                    .map(|(k, v)| (k, v))
                                    .collect::<serde_json::Map<String, Value>>()
                            )
                        };
                        
                        if let Some((parent_name, mut parent_data)) = stack.pop() {
                            if parent_data.contains_key(&name) {
                                if let Some(existing) = parent_data.get_mut(&name) {
                                    if let Some(arr) = existing.as_array_mut() {
                                        arr.push(value);
                                    } else {
                                        let old = existing.clone();
                                        parent_data.insert(name.clone(), Value::Array(vec![old, value]));
                                    }
                                }
                            } else {
                                parent_data.insert(name, value);
                            }
                            current_element = Some((parent_name, parent_data));
                        } else {
                            result.insert(name, value);
                        }
                    }
                }
                current_text.clear();
            }
            Ok(Event::Eof) => break,
            Err(e) => return Err(JsValue::from_str(&format!("XML parse error: {}", e))),
            _ => {}
        }
    }
    
    let json_result = serde_wasm_bindgen::to_value(&result)
        .map_err(|e| {
            log_error(&format!("Failed to serialize XML result: {}", e));
            JsValue::from_str(&format!("Failed to serialize XML result: {}", e))
        })?;
    
    log_info("XML parsed successfully");
    log_function_end("parse_xml");
    Ok(json_result)
}

/// 验证 JSON 文本
/// 
/// # Arguments
/// * `json_text` - JSON 格式的文本
/// 
/// # Returns
/// 如果 JSON 有效返回 true，否则返回 false
#[wasm_bindgen]
pub fn validate_json(json_text: &str) -> bool {
    log_function_call("validate_json", &format!("length: {} bytes", json_text.len()));
    let is_valid = serde_json::from_str::<Value>(json_text).is_ok();
    log_function_result("validate_json", &format!("{}", is_valid));
    is_valid
}
