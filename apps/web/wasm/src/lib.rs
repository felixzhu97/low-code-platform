use wasm_bindgen::prelude::*;

// 导入 console.log 用于日志输出
#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

// 宏定义，方便输出日志
macro_rules! console_log {
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}

/// 示例函数：加法运算
#[wasm_bindgen]
pub fn add(a: i32, b: i32) -> i32 {
    console_log!("[WASM] add() called with a={}, b={}", a, b);
    let result = a + b;
    console_log!("[WASM] add() result: {}", result);
    result
}

/// 示例函数：问候语
#[wasm_bindgen]
pub fn greet(name: &str) -> String {
    console_log!("[WASM] greet() called with name={}", name);
    let result = format!("Hello, {}! Welcome to Low-Code Platform WASM.", name);
    console_log!("[WASM] greet() result: {}", result);
    result
}

/// 示例函数：计算斐波那契数列
#[wasm_bindgen]
pub fn fibonacci(n: u32) -> u64 {
    console_log!("[WASM] fibonacci() called with n={}", n);
    if n <= 1 {
        console_log!("[WASM] fibonacci() n <= 1, returning {}", n);
        return n as u64;
    }
    
    let mut a = 0u64;
    let mut b = 1u64;
    
    for i in 2..=n {
        let temp = a + b;
        a = b;
        b = temp;
        if i % 10 == 0 || i == n {
            console_log!("[WASM] fibonacci() iteration {}: result={}", i, b);
        }
    }
    
    console_log!("[WASM] fibonacci() final result: {}", b);
    b
}
