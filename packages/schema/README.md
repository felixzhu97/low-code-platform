# @lowcode-platform/schema

Schema 验证和转换工具库，提供低代码平台的 Schema 验证、序列化、迁移功能。

## 功能

- **Schema 验证**: 同步和异步 Schema 格式验证
- **序列化/反序列化**: ProjectData 和 PageSchema 之间的转换
- **Schema 迁移**: 版本迁移和格式转换
- **类型定义**: 完整的 TypeScript 类型定义

## 安装

```bash
pnpm add @lowcode-platform/schema
```

## 使用方法

### Schema 验证

```typescript
import {
  validateSchema,
  validateSchemaAsync,
} from "@lowcode-platform/schema";

// 同步验证（类型守卫）
const data: unknown = { /* ... */ };
if (validateSchema(data)) {
  // TypeScript 知道 data 是 PageSchema 类型
  console.log(data.version);
}

// 异步验证（详细错误）
const result = await validateSchemaAsync(schemaJson);
if (result.valid) {
  console.log("Schema is valid");
} else {
  console.error("Validation errors:", result.errors);
}
```

### Schema 序列化

```typescript
import {
  projectDataToSchema,
  projectDataToSchemaJson,
  schemaToProjectData,
  schemaJsonToProjectData,
  serializeSchema,
  deserializeSchema,
} from "@lowcode-platform/schema";

// ProjectData -> PageSchema
const schema = projectDataToSchema(projectData);

// ProjectData -> Schema JSON
const schemaJson = projectDataToSchemaJson(projectData);

// PageSchema -> ProjectData
const projectData = schemaToProjectData(schema);

// Schema JSON -> ProjectData
const projectData = schemaJsonToProjectData(schemaJson);

// PageSchema -> JSON
const json = serializeSchema(schema);

// JSON -> PageSchema
const schema = deserializeSchema(json);
```

### Schema 迁移

```typescript
import {
  migrateSchema,
  migrateSchemaVersion,
  needsMigration,
} from "@lowcode-platform/schema";

// 迁移旧格式到新格式
const migrated = migrateSchema(oldSchema);

// 迁移版本
const migratedJson = migrateSchemaVersion(
  schemaJson,
  "0.9.0",
  "1.0.0"
);

// 检查是否需要迁移
if (needsMigration(schema, "1.0.0")) {
  const migrated = migrateSchema(schema);
}
```

## API 参考

### 类型

- `PageSchema` - 页面 Schema 接口
- `ProjectData` - 项目数据接口
- `SchemaMetadata` - Schema 元数据接口
- `Component` - 组件接口
- `SchemaValidationResult` - 验证结果接口
- `SchemaValidationError` - 验证错误类
- `SCHEMA_VERSION` - Schema 版本常量

### 验证器

- `validateSchema(data: unknown): data is PageSchema` - 同步验证（类型守卫）
- `validateSchemaAsync(schemaJson: string): Promise<{ valid: boolean; errors: string[] }>` - 异步验证

### 序列化器

- `projectDataToSchema(projectData, version?): PageSchema` - ProjectData -> PageSchema
- `projectDataToSchemaJson(projectData, version?, indent?): string` - ProjectData -> JSON
- `schemaToProjectData(schema): ProjectData` - PageSchema -> ProjectData
- `schemaJsonToProjectData(schemaJson): ProjectData` - JSON -> ProjectData
- `serializeSchema(schema, indent?): string` - 序列化 Schema
- `deserializeSchema(schemaJson): PageSchema` - 反序列化 Schema

### 迁移器

- `migrateSchema(schema: unknown): PageSchema` - 迁移 Schema 格式
- `migrateSchemaVersion(schemaJson, fromVersion, toVersion): string` - 迁移版本
- `needsMigration(schema, targetVersion?): boolean` - 检查是否需要迁移

## 导出路径

包支持多个导出路径，方便按需导入：

- `@lowcode-platform/schema` - 所有导出
- `@lowcode-platform/schema/types` - 类型定义
- `@lowcode-platform/schema/validator` - 验证工具
- `@lowcode-platform/schema/serializer` - 序列化工具
- `@lowcode-platform/schema/migrator` - 迁移工具

## 许可证

MIT
