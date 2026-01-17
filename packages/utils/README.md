# @lowcode-platform/utils

通用工具函数包，提供常用的工具函数，包括类名合并、深度克隆、类型判断、字符串处理和对象操作等功能。

## 安装

```bash
pnpm add @lowcode-platform/utils
```

## 功能

### 类名合并 (`cn`)

结合 clsx 和 tailwind-merge 的功能，智能合并 Tailwind CSS 类名。

```ts
import { cn } from "@lowcode-platform/utils";

cn("px-2 py-1", "px-4"); // "py-1 px-4"
cn({ "bg-red": true, "bg-blue": false }); // "bg-red"
```

### 深度克隆 (`clone`)

提供浅拷贝和深度拷贝功能。

```ts
import { shallowClone, deepClone } from "@lowcode-platform/utils";

const obj = { a: 1, b: { c: 2 } };
const cloned = deepClone(obj);
```

### 类型判断 (`type`)

提供各种类型判断函数。

```ts
import { isArray, isObject, isEmpty } from "@lowcode-platform/utils";

isArray([1, 2, 3]); // true
isObject({}); // true
isEmpty(null); // true
```

### 字符串工具 (`string`)

提供字符串格式化、转换等工具函数。

```ts
import { camelCase, kebabCase, truncate } from "@lowcode-platform/utils";

camelCase("hello-world"); // "helloWorld"
kebabCase("helloWorld"); // "hello-world"
truncate("Hello World", 5); // "Hello..."
```

### 对象操作 (`object`)

提供对象操作工具函数，如 pick、omit、merge 等。

```ts
import { pick, omit, merge, get, set } from "@lowcode-platform/utils";

pick({ a: 1, b: 2, c: 3 }, ["a", "b"]); // { a: 1, b: 2 }
omit({ a: 1, b: 2, c: 3 }, ["a"]); // { b: 2, c: 3 }
get({ a: { b: { c: 1 } } }, "a.b.c"); // 1
set({}, "a.b.c", 1); // { a: { b: { c: 1 } } }
```

## API 参考

详细的 API 文档请参考源代码中的 JSDoc 注释。

## License

MIT
