# @lowcode-platform/data-binding

数据绑定和 JSON 处理工具包，提供 JSON 验证、数据路径提取、数据映射等功能。

## 安装

```bash
pnpm add @lowcode-platform/data-binding
```

## 功能

### JSON 处理

```ts
import { JsonHelper } from "@lowcode-platform/data-binding";

// 验证 JSON
const result = JsonHelper.validateJson(jsonString);
// { valid: boolean, error?: string, data?: unknown }

// 格式化 JSON
const formatted = JsonHelper.formatJson(jsonString);

// 压缩 JSON
const minified = JsonHelper.minifyJson(jsonString);
```

### 数据路径提取

```ts
import { extractPaths, getValueByPath } from "@lowcode-platform/data-binding";

// 提取所有路径
const paths = extractPaths(data);
// ["a", "a.b", "a.b[0]", ...]

// 根据路径获取值
const value = getValueByPath(data, "a.b[0].c");
```

### 数据结构分析

```ts
import { analyzeJsonStructure, analyzeJsonString } from "@lowcode-platform/data-binding";

// 分析数据结构
const analysis = analyzeJsonStructure(data);
// { type, structure, paths, sample }
```

### 数据映射

```ts
import { applyDataMapping, generateMappingRules } from "@lowcode-platform/data-binding";

// 应用映射规则
const mapped = applyDataMapping(sourceData, mappingRules);

// 生成映射规则
const rules = generateMappingRules(sourceStructure, targetStructure);
```

## API 参考

详细的 API 文档请参考源代码中的 JSDoc 注释。

## License

MIT
