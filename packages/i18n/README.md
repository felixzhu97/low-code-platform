# @lowcode-platform/i18n

低代码平台的国际化工具包，基于 `react-i18next` 提供完整的国际化功能。

## 功能

- **核心配置**: 开箱即用的 i18n 配置和初始化
- **React Hooks**: 便捷的 React Hooks（useTranslation、useLanguage 等）
- **工具函数**: 语言检测、日期/数字格式化等实用工具
- **语言切换组件**: 可定制的语言切换器组件
- **类型安全**: 完整的 TypeScript 类型定义
- **可扩展性**: 易于添加新语言和命名空间

## 安装

```bash
pnpm add @lowcode-platform/i18n
```

## 使用方法

### 初始化

在应用的根组件中初始化 i18n：

```typescript
// app/layout.tsx or app.tsx
import "@lowcode-platform/i18n";
```

或者自定义配置：

```typescript
import { initI18n } from "@lowcode-platform/i18n";

initI18n({
  defaultLanguage: "zh",
  fallbackLanguage: "en",
  supportedLanguages: ["zh", "en"],
});
```

### 在组件中使用翻译

#### 使用 useTranslation Hook

```typescript
import { useTranslation } from "@lowcode-platform/i18n/hooks";

function MyComponent() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t("welcome")}</h1>
      <p>{t("hello", { name: "World" })}</p>
    </div>
  );
}
```

#### 使用指定命名空间

```typescript
import { useTranslation } from "@lowcode-platform/i18n/hooks";

function MyComponent() {
  const { t } = useTranslation("common");

  return <p>{t("welcome")}</p>;
}
```

### 语言切换

#### 使用 useLanguage Hook

```typescript
import { useLanguage } from "@lowcode-platform/i18n/hooks";

function LanguageSelector() {
  const { language, changeLanguage, availableLanguages } = useLanguage();

  return (
    <div>
      <p>当前语言: {language}</p>
      <select
        value={language}
        onChange={(e) => changeLanguage(e.target.value as Language)}
      >
        {availableLanguages.map((lang) => (
          <option key={lang} value={lang}>
            {lang}
          </option>
        ))}
      </select>
    </div>
  );
}
```

#### 使用 LanguageSwitcher 组件

```typescript
import { LanguageSwitcher } from "@lowcode-platform/i18n/components";

function App() {
  return (
    <div>
      <LanguageSwitcher
        displayFormat="native"
        showFlag={false}
      />
    </div>
  );
}
```

### 工具函数

#### 语言检测

```typescript
import { detectLanguage, getAvailableLanguages, getLanguageInfo } from "@lowcode-platform/i18n/utils";

// 检测浏览器语言
const detectedLang = detectLanguage(); // "zh" | "en" | ...

// 获取支持的语言列表
const languages = getAvailableLanguages();

// 获取语言信息
const info = getLanguageInfo("zh");
// { code: "zh", name: "Chinese", nativeName: "简体中文" }
```

#### 日期和数字格式化

```typescript
import { formatDate, formatNumber, formatCurrency } from "@lowcode-platform/i18n/utils";

// 格式化日期
const dateStr = formatDate(new Date(), "zh"); // "2024年1月1日"
const dateStrEn = formatDate(new Date(), "en"); // "1/1/2024"

// 格式化数字
const numStr = formatNumber(1234.56, "zh"); // "1,234.56"

// 格式化货币
const currency = formatCurrency(1234.56, "CNY", "zh"); // "¥1,234.56"
```

### 添加新语言

1. 在 `src/locales/` 目录下创建新的语言目录
2. 添加翻译文件（如 `common.json`）
3. 在配置中注册新语言：

```typescript
// 如果需要自定义配置
import { initI18n } from "@lowcode-platform/i18n";
import jaCommon from "./locales/ja/common.json";

initI18n({
  supportedLanguages: ["zh", "en", "ja"],
  // ... 其他配置
});

// 在 config.ts 中添加资源
// resources: {
//   ja: {
//     common: jaCommon,
//   },
// }
```

## API 参考

### Hooks

#### `useTranslation(namespace?: string)`

获取翻译函数和 i18n 实例。

**返回值**:
- `t: TFunction` - 翻译函数
- `i18n: typeof i18n` - i18n 实例
- `ready: boolean` - 翻译资源是否已加载

#### `useLanguage()`

获取当前语言和切换语言函数。

**返回值**:
- `language: Language` - 当前语言代码
- `changeLanguage: (language: Language) => Promise<void>` - 切换语言函数
- `availableLanguages: Language[]` - 支持的语言列表

#### `useTranslationReady()`

检查翻译资源是否已加载。

**返回值**: `boolean`

### 工具函数

#### `detectLanguage(): Language`

检测浏览器语言，优先从 localStorage 读取。

#### `getAvailableLanguages(): LanguageInfo[]`

获取支持的语言列表。

#### `getLanguageInfo(code: Language): LanguageInfo | undefined`

根据语言代码获取语言信息。

#### `formatDate(date: Date | number | string, locale?: Language, options?: Intl.DateTimeFormatOptions): string`

根据语言格式化日期。

#### `formatNumber(number: number, locale?: Language, options?: Intl.NumberFormatOptions): string`

根据语言格式化数字。

#### `formatCurrency(amount: number, currency?: string, locale?: Language): string`

根据语言格式化货币。

#### `loadTranslations(language: Language, namespace?: string): Promise<void>`

动态加载翻译资源。

### 组件

#### `LanguageSwitcher`

语言切换器组件。

**Props**:
- `className?: string` - 容器自定义类名
- `buttonClassName?: string` - 按钮自定义类名
- `dropdownClassName?: string` - 下拉菜单自定义类名
- `itemClassName?: string` - 菜单项自定义类名
- `displayFormat?: "full" | "short" | "native"` - 显示格式
- `showFlag?: boolean` - 是否显示国旗图标
- `renderButton?: (language: Language, info?: LanguageInfo) => React.ReactNode` - 自定义按钮渲染
- `renderItem?: (language: Language, info?: LanguageInfo, isSelected: boolean) => React.ReactNode` - 自定义菜单项渲染

## 导出路径

包支持多个导出路径，方便按需导入：

- `@lowcode-platform/i18n` - 所有导出（默认导出 i18n 实例）
- `@lowcode-platform/i18n/hooks` - React Hooks
- `@lowcode-platform/i18n/utils` - 工具函数
- `@lowcode-platform/i18n/components` - UI 组件

## 默认支持的语言

- **zh** - 简体中文 (Chinese)
- **en** - 英文 (English)

可通过配置扩展支持更多语言。

## 翻译文件结构

```
src/locales/
├── zh/
│   └── common.json
└── en/
    └── common.json
```

每个语言目录下可以包含多个命名空间文件，例如：

```
src/locales/
├── zh/
│   ├── common.json
│   ├── validation.json
│   └── messages.json
└── en/
    ├── common.json
    ├── validation.json
    └── messages.json
```

## 许可证

MIT