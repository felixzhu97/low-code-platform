use wasm_bindgen::prelude::*;
use serde_json::{Value, Map};
use js_sys::JSON;
use crate::utils::{log_function_start, log_function_end, log_info, log_error, log_warn};

/// Schema 验证结果
#[wasm_bindgen]
#[derive(Debug, Clone)]
pub struct ValidationResult {
    valid: bool,
    errors: Vec<String>,
}

#[wasm_bindgen]
impl ValidationResult {
    #[wasm_bindgen(getter)]
    pub fn valid(&self) -> bool {
        self.valid
    }
    
    #[wasm_bindgen(getter)]
    pub fn errors(&self) -> Vec<String> {
        self.errors.clone()
    }
}

/// 序列化项目数据为 Schema JSON
/// 
/// # Arguments
/// * `project_data` - 项目数据对象
/// 
/// # Returns
/// Schema JSON 字符串
#[wasm_bindgen]
pub fn serialize_schema(project_data: &JsValue) -> Result<String, JsValue> {
    log_function_start("serialize_schema");
    
    let project: Value = serde_wasm_bindgen::from_value(project_data.clone())
        .map_err(|e| JsValue::from_str(&format!("Failed to deserialize project data: {}", e)))?;
    
    let schema = project_data_to_schema(&project)
        .map_err(|e| JsValue::from_str(&format!("Failed to convert to schema: {}", e)))?;
    
    serde_json::to_string_pretty(&schema)
        .map_err(|e| JsValue::from_str(&format!("Failed to serialize schema: {}", e)))
}

/// 反序列化 Schema JSON 为项目数据
/// 
/// # Arguments
/// * `schema_json` - Schema JSON 字符串
/// 
/// # Returns
/// 项目数据对象
#[wasm_bindgen]
pub fn deserialize_schema(schema_json: &str) -> Result<JsValue, JsValue> {
    log_function_start("deserialize_schema");
    log_info(&format!("Deserializing schema, length: {} bytes", schema_json.len()));
    
    let schema: Value = serde_json::from_str(schema_json)
        .map_err(|e| JsValue::from_str(&format!("Failed to parse schema JSON: {}", e)))?;
    
    let project = schema_to_project_data(&schema)
        .map_err(|e| {
            log_error(&format!("Failed to convert from schema: {}", e));
            JsValue::from_str(&format!("Failed to convert from schema: {}", e))
        })?;
    
    // 检查 project 是否包含 canvas
    if let Some(project_obj) = project.as_object() {
        let keys: Vec<String> = project_obj.keys().cloned().collect();
        log_info(&format!("Project keys: {:?}", keys));
        if let Some(canvas) = project_obj.get("canvas") {
            log_info(&format!("Project has canvas: {:?}", canvas));
        } else {
            log_warn("Project does NOT have canvas field!");
        }
    }
    
    // 将 serde_json::Value 先序列化为 JSON 字符串，然后解析为 JsValue
    // 这是因为 serde_wasm_bindgen::to_value 无法正确处理 serde_json::Value
    let json_str = serde_json::to_string(&project)
        .map_err(|e| {
            log_error(&format!("Failed to serialize project to JSON: {}", e));
            JsValue::from_str(&format!("Failed to serialize project to JSON: {}", e))
        })?;
    
    log_info(&format!("Project serialized to JSON, length: {} bytes", json_str.len()));
    
    // 使用 js_sys::JSON::parse 将 JSON 字符串解析为 JavaScript 对象
    let result = js_sys::JSON::parse(&json_str)
        .map_err(|e| {
            log_error(&format!("Failed to parse JSON string: {:?}", e));
            JsValue::from_str(&format!("Failed to parse JSON string"))
        })?;
    
    log_info("Schema deserialized successfully");
    log_function_end("deserialize_schema");
    Ok(result)
}

/// 验证 Schema 格式
/// 
/// # Arguments
/// * `schema_json` - Schema JSON 字符串
/// 
/// # Returns
/// 验证结果
#[wasm_bindgen]
pub fn validate_schema(schema_json: &str) -> Result<ValidationResult, JsValue> {
    log_function_start("validate_schema");
    log_info(&format!("Validating schema, length: {} bytes", schema_json.len()));
    
    let schema: Value = match serde_json::from_str(schema_json) {
        Ok(v) => v,
        Err(e) => {
            return Ok(ValidationResult {
                valid: false,
                errors: vec![format!("Invalid JSON: {}", e)],
            });
        }
    };
    
    let mut errors = Vec::new();
    
    // 验证版本号
    if !schema.get("version").and_then(|v| v.as_str()).is_some() {
        errors.push("Missing or invalid 'version' field".to_string());
    }
    
    // 验证元数据
    if let Some(metadata) = schema.get("metadata") {
        if let Some(metadata_obj) = metadata.as_object() {
            if !metadata_obj.contains_key("name") {
                errors.push("Missing 'metadata.name' field".to_string());
            }
            if !metadata_obj.contains_key("version") {
                errors.push("Missing 'metadata.version' field".to_string());
            }
        } else {
            errors.push("'metadata' must be an object".to_string());
        }
    } else {
        errors.push("Missing 'metadata' field".to_string());
    }
    
    // 验证组件数组
    if !schema.get("components").and_then(|v| v.as_array()).is_some() {
        errors.push("Missing or invalid 'components' field (must be an array)".to_string());
    }
    
    // 验证画布配置
    if let Some(canvas) = schema.get("canvas") {
        if let Some(canvas_obj) = canvas.as_object() {
            if !canvas_obj.contains_key("viewportWidth") {
                errors.push("Missing 'canvas.viewportWidth' field".to_string());
            }
        } else {
            errors.push("'canvas' must be an object".to_string());
        }
    } else {
        errors.push("Missing 'canvas' field".to_string());
    }
    
    // 验证数据源数组
    if !schema.get("dataSources").and_then(|v| v.as_array()).is_some() {
        errors.push("Missing or invalid 'dataSources' field (must be an array)".to_string());
    }
    
    let result = ValidationResult {
        valid: errors.is_empty(),
        errors: errors.clone(),
    };
    
    log_info(&format!("Schema validation: valid={}, errors={}", result.valid, errors.len()));
    log_function_end("validate_schema");
    Ok(result)
}

/// 迁移 Schema 版本
/// 
/// # Arguments
/// * `schema_json` - Schema JSON 字符串
/// * `from_version` - 源版本
/// * `to_version` - 目标版本
/// 
/// # Returns
/// 迁移后的 Schema JSON 字符串
#[wasm_bindgen]
pub fn migrate_schema(schema_json: &str, from_version: &str, to_version: &str) -> Result<String, JsValue> {
    log_function_start("migrate_schema");
    log_info(&format!("Migrating schema from {} to {}", from_version, to_version));
    
    let mut schema: Value = serde_json::from_str(schema_json)
        .map_err(|e| JsValue::from_str(&format!("Failed to parse schema JSON: {}", e)))?;
    
    // 当前版本为 1.0.0，未来可以添加迁移逻辑
    if from_version != to_version {
        // 更新版本号
        if let Some(metadata) = schema.get_mut("metadata") {
            if let Some(metadata_obj) = metadata.as_object_mut() {
                metadata_obj.insert("version".to_string(), Value::String(to_version.to_string()));
            }
        }
        schema.as_object_mut()
            .and_then(|obj| obj.get_mut("version"))
            .map(|v| *v = Value::String(to_version.to_string()));
    }
    
    let result = serde_json::to_string_pretty(&schema)
        .map_err(|e| {
            log_error(&format!("Failed to serialize migrated schema: {}", e));
            JsValue::from_str(&format!("Failed to serialize migrated schema: {}", e))
        })?;
    
    log_info("Schema migrated successfully");
    log_function_end("migrate_schema");
    Ok(result)
}

// 辅助函数：将项目数据转换为 Schema
fn project_data_to_schema(project: &Value) -> Result<Value, String> {
    let mut schema = Map::new();
    
    schema.insert("version".to_string(), Value::String("1.0.0".to_string()));
    
    // 元数据
    let mut metadata = Map::new();
    if let Some(name) = project.get("name").and_then(|v| v.as_str()) {
        metadata.insert("name".to_string(), Value::String(name.to_string()));
    } else {
        metadata.insert("name".to_string(), Value::String("未命名项目".to_string()));
    }
    
    if let Some(desc) = project.get("description").and_then(|v| v.as_str()) {
        metadata.insert("description".to_string(), Value::String(desc.to_string()));
    }
    
    if let Some(created) = project.get("createdAt").and_then(|v| v.as_str()) {
        metadata.insert("createdAt".to_string(), Value::String(created.to_string()));
    } else {
        // 使用当前时间戳生成 ISO 字符串
        let timestamp = js_sys::Date::now();
        let date = js_sys::Date::new(&wasm_bindgen::JsValue::from_f64(timestamp));
        let now = date.to_iso_string().as_string().unwrap_or_else(|| "1970-01-01T00:00:00Z".to_string());
        metadata.insert("createdAt".to_string(), Value::String(now));
    }
    
    if let Some(updated) = project.get("updatedAt").and_then(|v| v.as_str()) {
        metadata.insert("updatedAt".to_string(), Value::String(updated.to_string()));
    } else {
        // 使用当前时间戳生成 ISO 字符串
        let timestamp = js_sys::Date::now();
        let date = js_sys::Date::new(&wasm_bindgen::JsValue::from_f64(timestamp));
        let now = date.to_iso_string().as_string().unwrap_or_else(|| "1970-01-01T00:00:00Z".to_string());
        metadata.insert("updatedAt".to_string(), Value::String(now));
    }
    
    metadata.insert("version".to_string(), Value::String("1.0.0".to_string()));
    schema.insert("metadata".to_string(), Value::Object(metadata));
    
    // 组件
    if let Some(components) = project.get("components") {
        schema.insert("components".to_string(), components.clone());
    } else {
        schema.insert("components".to_string(), Value::Array(Vec::new()));
    }
    
    // 画布
    if let Some(canvas) = project.get("canvas") {
        schema.insert("canvas".to_string(), canvas.clone());
    } else {
        let mut canvas = Map::new();
        canvas.insert("showGrid".to_string(), Value::Bool(false));
        canvas.insert("snapToGrid".to_string(), Value::Bool(false));
        canvas.insert("viewportWidth".to_string(), Value::Number(serde_json::Number::from(1920)));
        canvas.insert("activeDevice".to_string(), Value::String("desktop".to_string()));
        schema.insert("canvas".to_string(), Value::Object(canvas));
    }
    
    // 主题
    if let Some(theme) = project.get("theme") {
        schema.insert("theme".to_string(), theme.clone());
    } else {
        schema.insert("theme".to_string(), Value::Object(Map::new()));
    }
    
    // 数据源
    if let Some(data_sources) = project.get("dataSources") {
        schema.insert("dataSources".to_string(), data_sources.clone());
    } else {
        schema.insert("dataSources".to_string(), Value::Array(Vec::new()));
    }
    
    // 设置
    if let Some(settings) = project.get("settings") {
        schema.insert("settings".to_string(), settings.clone());
    }
    
    Ok(Value::Object(schema))
}

// 辅助函数：将 Schema 转换为项目数据
fn schema_to_project_data(schema: &Value) -> Result<Value, String> {
    let mut project = Map::new();
    
    // 从 metadata 获取信息
    if let Some(metadata) = schema.get("metadata") {
        if let Some(name) = metadata.get("name").and_then(|v| v.as_str()) {
            let timestamp = js_sys::Date::now() as u64;
            let id = format!("{}-{}", name.to_lowercase().replace(" ", "-"), timestamp);
            project.insert("id".to_string(), Value::String(id));
            project.insert("name".to_string(), Value::String(name.to_string()));
        }
        
        if let Some(desc) = metadata.get("description").and_then(|v| v.as_str()) {
            project.insert("description".to_string(), Value::String(desc.to_string()));
        }
        
        if let Some(created) = metadata.get("createdAt").and_then(|v| v.as_str()) {
            project.insert("createdAt".to_string(), Value::String(created.to_string()));
        }
        
        if let Some(updated) = metadata.get("updatedAt").and_then(|v| v.as_str()) {
            project.insert("updatedAt".to_string(), Value::String(updated.to_string()));
        }
    }
    
    // 组件
    if let Some(components) = schema.get("components") {
        project.insert("components".to_string(), components.clone());
    } else {
        project.insert("components".to_string(), Value::Array(Vec::new()));
    }
    
    // 画布
    if let Some(canvas) = schema.get("canvas") {
        project.insert("canvas".to_string(), canvas.clone());
    } else {
        // 创建默认画布配置
        let mut canvas = Map::new();
        canvas.insert("showGrid".to_string(), Value::Bool(false));
        canvas.insert("snapToGrid".to_string(), Value::Bool(false));
        canvas.insert("viewportWidth".to_string(), Value::Number(serde_json::Number::from(1920)));
        canvas.insert("activeDevice".to_string(), Value::String("desktop".to_string()));
        project.insert("canvas".to_string(), Value::Object(canvas));
    }
    
    // 主题
    if let Some(theme) = schema.get("theme") {
        project.insert("theme".to_string(), theme.clone());
    } else {
        project.insert("theme".to_string(), Value::Object(Map::new()));
    }
    
    // 数据源
    if let Some(data_sources) = schema.get("dataSources") {
        project.insert("dataSources".to_string(), data_sources.clone());
    } else {
        project.insert("dataSources".to_string(), Value::Array(Vec::new()));
    }
    
    // 设置
    if let Some(settings) = schema.get("settings") {
        project.insert("settings".to_string(), settings.clone());
    } else {
        let mut settings = Map::new();
        settings.insert("activeTab".to_string(), Value::String("components".to_string()));
        settings.insert("sidebarCollapsed".to_string(), Value::Bool(false));
        settings.insert("rightPanelCollapsed".to_string(), Value::Bool(false));
        settings.insert("leftPanelCollapsed".to_string(), Value::Bool(false));
        project.insert("settings".to_string(), Value::Object(settings));
    }
    
    Ok(Value::Object(project))
}
