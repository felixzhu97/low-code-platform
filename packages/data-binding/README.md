# @lowcode-platform/data-binding

数据绑定工具库，提供 JSON 处理、数据路径提取、数据映射等功能。

## 功能

- **JSON 工具**: 验证、格式化、压缩、分析
- **路径提取**: 提取数据路径、按路径获取/设置值
- **数据映射**: 数据映射和应用
- **结构分析**: 数据结构分析

## 安装

```bash
pnpm add @lowcode-platform/data-binding
```

## 使用方法

### JSON 工具

```typescript
import {
  validateJson,
  formatJson,
  minifyJson,
  analyzeJsonStructure,
} from "@lowcode-platform/data-binding";

// 验证 JSON
const result = validateJson(jsonString);
if (result.valid) {
  console.log(result.data);
}

// 格式化 JSON
const formatted = formatJson(jsonString, 2);

// 压缩 JSON
const minified = minifyJson(jsonString);

// 分析结构
const analysis = analyzeJsonStructure(data);
```

### 路径提取

```typescript
import {
  extractPaths,
  getValueByPath,
  setValueByPath,
} from "@lowcode-platform/data-binding";

// 提取所有路径
const paths = extractPaths(data);

// 按路径获取值
const value = getValueByPath(data, "users[0].name");

// 按路径设置值
setValueByPath(data, "users[0].name", "John");
```

### 数据映射

```typescript
import { applyMapping, generateMapping } from "@lowcode-platform/data-binding";

// 应用映射
const mapped = applyMapping(sourceData, mappings);

// 生成映射
const mappings = generateMapping(sourceData, targetStructure);
```

## API 参考

详见各模块导出。

## 许可证

MIT
