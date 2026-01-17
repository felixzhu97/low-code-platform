# @lowcode-platform/utils

通用工具函数库，提供低代码平台常用的工具函数。

## 功能

- **类名合并** (`cn`): 合并类名，支持 Tailwind CSS 类名合并
- **深度克隆**: 深拷贝和浅拷贝工具
- **类型判断**: 类型检查函数
- **字符串工具**: 字符串转换和处理函数
- **对象操作**: 对象属性操作和深度比较函数

## 安装

```bash
pnpm add @lowcode-platform/utils
```

## 使用方法

### 类名合并

```typescript
import { cn } from "@lowcode-platform/utils";

const className = cn("px-4 py-2", "bg-blue-500", {
  "text-white": true,
  "font-bold": false,
});
```

### 深度克隆

```typescript
import { deepClone, shallowClone } from "@lowcode-platform/utils";

const original = { a: 1, b: { c: 2 } };
const cloned = deepClone(original);
const shallow = shallowClone(original);
```

### 类型判断

```typescript
import {
  isString,
  isNumber,
  isArray,
  isObject,
  isEmpty,
} from "@lowcode-platform/utils";

if (isString(value)) {
  // TypeScript 知道 value 是 string 类型
  console.log(value.toUpperCase());
}

if (isEmpty(value)) {
  // 处理空值
}
```

### 字符串工具

```typescript
import {
  capitalize,
  camelCase,
  kebabCase,
  pascalCase,
  truncate,
} from "@lowcode-platform/utils";

capitalize("hello"); // "Hello"
camelCase("hello world"); // "helloWorld"
kebabCase("HelloWorld"); // "hello-world"
pascalCase("hello world"); // "HelloWorld"
truncate("long string", 10); // "long str..."
```

### 对象操作

```typescript
import {
  pick,
  omit,
  merge,
  get,
  set,
  has,
  isEqual,
} from "@lowcode-platform/utils";

const obj = { a: 1, b: 2, c: 3 };

pick(obj, ["a", "b"]); // { a: 1, b: 2 }
omit(obj, ["a"]); // { b: 2, c: 3 }
merge({ a: 1 }, { b: 2 }); // { a: 1, b: 2 }

get(obj, "a.b.c"); // 获取嵌套值
set(obj, "a.b.c", 1); // 设置嵌套值
has(obj, "a.b.c"); // 检查嵌套属性是否存在
isEqual({ a: 1 }, { a: 1 }); // true
```

## API 参考

### cn

合并类名，支持 Tailwind CSS 类名合并。

```typescript
function cn(...inputs: ClassValue[]): string;
```

### 克隆工具

- `deepClone<T>(obj: T): T` - 深度克隆
- `shallowClone<T>(obj: T): T` - 浅拷贝

### 类型判断

- `isNull(value: unknown): value is null`
- `isUndefined(value: unknown): value is undefined`
- `isNullOrUndefined(value: unknown): value is null | undefined`
- `isNumber(value: unknown): value is number`
- `isString(value: unknown): value is string`
- `isBoolean(value: unknown): value is boolean`
- `isFunction(value: unknown): value is Function`
- `isObject(value: unknown): value is Record<string, unknown>`
- `isArray(value: unknown): value is unknown[]`
- `isEmpty(value: unknown): boolean`
- `getType(value: unknown): string`

### 字符串工具

- `capitalize(str: string): string`
- `camelCase(str: string): string`
- `kebabCase(str: string): string`
- `snakeCase(str: string): string`
- `pascalCase(str: string): string`
- `truncate(str: string, length: number, suffix?: string): string`
- `trim(str: string): string`
- `trimStart(str: string): string`
- `trimEnd(str: string): string`
- `padStart(str: string, length: number, padString?: string): string`
- `padEnd(str: string, length: number, padString?: string): string`
- `randomString(length?: number): string`

### 对象操作

- `keys<T>(obj: T): Array<keyof T>`
- `values<T>(obj: T): T[keyof T][]`
- `entries<T>(obj: T): Array<[keyof T, T[keyof T]]>`
- `pick<T, K>(obj: T, keys: K[]): Pick<T, K>`
- `omit<T, K>(obj: T, keys: K[]): Omit<T, K>`
- `merge<T>(...objects: Partial<T>[]): T`
- `get<T>(obj: Record<string, unknown>, path: string, defaultValue?: T): T | undefined`
- `set<T>(obj: T, path: string, value: unknown): T`
- `has(obj: Record<string, unknown>, path: string): boolean`
- `isEqual(a: unknown, b: unknown): boolean`

## 导出路径

包支持多个导出路径，方便按需导入：

- `@lowcode-platform/utils` - 所有导出
- `@lowcode-platform/utils/cn` - 类名合并工具
- `@lowcode-platform/utils/clone` - 克隆工具
- `@lowcode-platform/utils/type` - 类型判断工具
- `@lowcode-platform/utils/string` - 字符串工具
- `@lowcode-platform/utils/object` - 对象操作工具

## 许可证

MIT
