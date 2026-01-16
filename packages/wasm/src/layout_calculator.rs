use wasm_bindgen::prelude::*;
use serde_json::Value;
use crate::utils::{log_error, log_function_start, log_function_end};

/// 位置结构
#[wasm_bindgen]
#[derive(Debug, Clone)]
pub struct Position {
    x: f64,
    y: f64,
}

#[wasm_bindgen]
impl Position {
    #[wasm_bindgen(constructor)]
    pub fn new(x: f64, y: f64) -> Position {
        Position { x, y }
    }
    
    #[wasm_bindgen(getter)]
    pub fn x(&self) -> f64 {
        self.x
    }
    
    #[wasm_bindgen(getter)]
    pub fn y(&self) -> f64 {
        self.y
    }
}

/// 计算布局
/// 
/// # Arguments
/// * `components` - 组件数组
/// * `viewport_width` - 视口宽度
/// 
/// # Returns
/// 计算后的组件布局数组
#[wasm_bindgen]
pub fn calculate_layout(components: &JsValue, viewport_width: f64) -> Result<JsValue, JsValue> {
    log_function_start("calculate_layout");
    let result = {
        let components: Vec<Value> = serde_wasm_bindgen::from_value(components.clone())
        .map_err(|e| JsValue::from_str(&format!("Failed to deserialize components: {}", e)))?;
    
    let mut result = Vec::new();
    
    for component in components {
        if let Some(mut comp_obj) = component.as_object().cloned() {
            // 计算响应式布局
            if let Some(position) = comp_obj.get("position") {
                if let Some(pos_obj) = position.as_object() {
                    let mut new_pos = pos_obj.clone();
                    
                    // 根据视口宽度调整位置
                    if let Some(x) = new_pos.get("x").and_then(|v| v.as_f64()) {
                        let adjusted_x = (x / 1920.0) * viewport_width;
                        if let Some(num) = serde_json::Number::from_f64(adjusted_x) {
                            new_pos.insert("x".to_string(), Value::Number(num));
                        }
                    }
                    
                    comp_obj.insert("position".to_string(), Value::Object(new_pos));
                }
            }
            
            // 计算宽度
            if let Some(props) = comp_obj.get("properties") {
                if let Some(props_obj) = props.as_object() {
                    let mut new_props = props_obj.clone();
                    
                    if let Some(width) = new_props.get("width") {
                        if let Some(width_str) = width.as_str() {
                            if width_str.ends_with("%") {
                                if let Ok(percent) = width_str.trim_end_matches("%").parse::<f64>() {
                                    let pixel_width = (percent / 100.0) * viewport_width;
                                    new_props.insert("width".to_string(), 
                                        Value::String(format!("{}px", pixel_width)));
                                }
                            }
                        }
                    }
                    
                    comp_obj.insert("properties".to_string(), Value::Object(new_props));
                }
            }
            
            result.push(Value::Object(comp_obj));
        }
    }
    
    serde_wasm_bindgen::to_value(&result)
        .map_err(|e| {
            log_error(&format!("Failed to serialize layout result: {}", e));
            JsValue::from_str(&format!("Failed to serialize layout result: {}", e))
        })
    };
    log_function_end("calculate_layout");
    result
}

/// 网格对齐
/// 
/// # Arguments
/// * `x` - X 坐标
/// * `y` - Y 坐标
/// * `grid_size` - 网格大小
/// 
/// # Returns
/// 对齐后的位置
#[wasm_bindgen]
pub fn snap_to_grid(x: f64, y: f64, grid_size: f64) -> Position {
    log_function_start("snap_to_grid");
    let snapped_x = (x / grid_size).round() * grid_size;
    let snapped_y = (y / grid_size).round() * grid_size;
    let result = Position::new(snapped_x, snapped_y);
    log_function_end("snap_to_grid");
    result
}

/// 检测碰撞
/// 
/// # Arguments
/// * `component1` - 组件1
/// * `component2` - 组件2
/// 
/// # Returns
/// 如果碰撞返回 true，否则返回 false
#[wasm_bindgen]
pub fn detect_collision(component1: &JsValue, component2: &JsValue) -> bool {
    log_function_start("detect_collision");
    let result = {
        let comp1: Value = match serde_wasm_bindgen::from_value(component1.clone()) {
        Ok(v) => v,
        Err(_) => return false,
    };
    
    let comp2: Value = match serde_wasm_bindgen::from_value(component2.clone()) {
        Ok(v) => v,
        Err(_) => return false,
    };
    
    let pos1 = get_component_bounds(&comp1);
    let pos2 = get_component_bounds(&comp2);
    
    // AABB 碰撞检测
    pos1.0 < pos2.2 && pos1.2 > pos2.0 && pos1.1 < pos2.3 && pos1.3 > pos2.1
    };
    log_function_end("detect_collision");
    result
}

// 辅助函数：获取组件边界
fn get_component_bounds(component: &Value) -> (f64, f64, f64, f64) {
    let mut x = 0.0;
    let mut y = 0.0;
    let mut width = 100.0;
    let mut height = 100.0;
    
    if let Some(pos) = component.get("position") {
        if let Some(pos_obj) = pos.as_object() {
            if let Some(x_val) = pos_obj.get("x").and_then(|v| v.as_f64()) {
                x = x_val;
            }
            if let Some(y_val) = pos_obj.get("y").and_then(|v| v.as_f64()) {
                y = y_val;
            }
        }
    }
    
    if let Some(props) = component.get("properties") {
        if let Some(props_obj) = props.as_object() {
            if let Some(w) = props_obj.get("width") {
                if let Some(w_val) = w.as_f64() {
                    width = w_val;
                } else if let Some(w_str) = w.as_str() {
                    if let Ok(w_num) = w_str.trim_end_matches("px").parse::<f64>() {
                        width = w_num;
                    }
                }
            }
            if let Some(h) = props_obj.get("height") {
                if let Some(h_val) = h.as_f64() {
                    height = h_val;
                } else if let Some(h_str) = h.as_str() {
                    if let Ok(h_num) = h_str.trim_end_matches("px").parse::<f64>() {
                        height = h_num;
                    }
                }
            }
        }
    }
    
    (x, y, x + width, y + height)
}
