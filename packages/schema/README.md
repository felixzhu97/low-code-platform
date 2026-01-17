# @lowcode-platform/schema

Schema 验证、序列化和迁移工具包，提供低代码平台的 Schema 管理功能。

## 安装

```bash
pnpm add @lowcode-platform/schema
```

## 功能

### Schema 类型定义

提供 PageSchema、ProjectData、Component 等类型定义。

```ts
import type { PageSchema, Component } from "@lowcode-platform/schema";
```

### Schema 验证

提供同步和异步的 Schema 验证功能。

```ts
import { validateSchema, validateSchemaJson } from "@lowcode-platform/schema";

// 同步验证
const isValid = validateSchema(data); // boolean

// JSON 字符串验证
const result = validateSchemaJson(jsonString);
// { valid: boolean, errors: string[] }
```

### Schema 序列化/反序列化

提供 ProjectData 和 PageSchema 之间的转换功能。

```ts
import {
  projectDataToSchema,
  schemaToProjectData,
  serializeSchema,
  deserializeSchema,
} from "@lowcode-platform/schema";

// ProjectData 转换为 PageSchema
const schema = projectDataToSchema(projectData);

// PageSchema 转换为 ProjectData
const projectData = schemaToProjectData(schema);

// 序列化为 JSON
const json = serializeSchema(schema);

// 反序列化
const schema = deserializeSchema(jsonString);
```

### Schema 迁移

支持将旧版本的 Schema 迁移到新版本。

```ts
import { migrateSchema, migrateSchemaJson } from "@lowcode-platform/schema";

// 迁移 Schema 对象
const migratedSchema = migrateSchema(oldSchema);

// 迁移 JSON 字符串
const migratedJson = migrateSchemaJson(
  oldSchemaJson,
  "1.0.0",
  "2.0.0"
);
```

## API 参考

详细的 API 文档请参考源代码中的 JSDoc 注释。

## License

MIT
