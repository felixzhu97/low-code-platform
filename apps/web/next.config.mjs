/** @type {import('next').NextConfig} */
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  compiler: {
    // 移除 console.log（生产环境）
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error", "warn"],
          }
        : false,
  },
  // 转译 workspace 包（关键：确保 Next.js 能处理 TypeScript 文件）
  transpilePackages: [
    "@lowcode-platform/ai-generator",
    "@lowcode-platform/schema",
    "@lowcode-platform/component-utils",
    "@lowcode-platform/utils",
    "@lowcode-platform/data-binding",
    "@lowcode-platform/layout-utils",
    "@lowcode-platform/collaboration",
    "@lowcode-platform/i18n",
    "@lowcode-platform/performance",
    "@lowcode-platform/test-utils",
  ],
  // 优化打包配置
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-tabs",
      "react-dnd",
      "react-dnd-html5-backend",
    ],
  },
  // Webpack 优化配置
  webpack: (config, { isServer }) => {
    // 配置 AI Generator 包的路径（服务端和客户端都需要）
    const aiGeneratorPath = path.resolve(
      __dirname,
      "../../packages/ai-generator/src/index.ts"
    );
    const schemaPath = path.resolve(
      __dirname,
      "../../packages/schema/src/index.ts"
    );
    const schemaTypesPath = path.resolve(
      __dirname,
      "../../packages/schema/src/types.ts"
    );
    const schemaValidatorPath = path.resolve(
      __dirname,
      "../../packages/schema/src/validator.ts"
    );
    const schemaSerializerPath = path.resolve(
      __dirname,
      "../../packages/schema/src/serializer.ts"
    );
    const schemaMigratorPath = path.resolve(
      __dirname,
      "../../packages/schema/src/migrator.ts"
    );
    const componentUtilsPath = path.resolve(
      __dirname,
      "../../packages/component-utils/src/index.ts"
    );
    const componentUtilsValidatorPath = path.resolve(
      __dirname,
      "../../packages/component-utils/src/validator.ts"
    );
    const componentUtilsTypesPath = path.resolve(
      __dirname,
      "../../packages/component-utils/src/types.ts"
    );
    const componentUtilsTreePath = path.resolve(
      __dirname,
      "../../packages/component-utils/src/tree.ts"
    );
    const componentUtilsFindPath = path.resolve(
      __dirname,
      "../../packages/component-utils/src/find.ts"
    );
    const componentUtilsChildrenPath = path.resolve(
      __dirname,
      "../../packages/component-utils/src/children.ts"
    );
    const utilsPath = path.resolve(
      __dirname,
      "../../packages/utils/src/index.ts"
    );
    const dataBindingPath = path.resolve(
      __dirname,
      "../../packages/data-binding/src/index.ts"
    );
    const layoutUtilsPath = path.resolve(
      __dirname,
      "../../packages/layout-utils/src/index.ts"
    );
    const collaborationPath = path.resolve(
      __dirname,
      "../../packages/collaboration/src/index.ts"
    );
    const i18nPath = path.resolve(
      __dirname,
      "../../packages/i18n/src/index.ts"
    );
    const performancePath = path.resolve(
      __dirname,
      "../../packages/performance/src/index.ts"
    );
    const testUtilsPath = path.resolve(
      __dirname,
      "../../packages/test-utils/src/index.ts"
    );
    if (!existsSync(aiGeneratorPath)) {
      console.warn(
        `WARNING: AI Generator package not found at ${aiGeneratorPath}.`
      );
    }
    if (!existsSync(schemaPath)) {
      console.warn(`WARNING: Schema package not found at ${schemaPath}.`);
    }
    if (!existsSync(schemaValidatorPath)) {
      console.warn(
        `WARNING: Schema validator not found at ${schemaValidatorPath}.`
      );
    }
    if (!existsSync(componentUtilsPath)) {
      console.warn(
        `WARNING: Component Utils package not found at ${componentUtilsPath}.`
      );
    }
    if (!existsSync(utilsPath)) {
      console.warn(`WARNING: Utils package not found at ${utilsPath}.`);
    }
    if (!existsSync(dataBindingPath)) {
      console.warn(
        `WARNING: Data Binding package not found at ${dataBindingPath}.`
      );
    }
    if (!existsSync(layoutUtilsPath)) {
      console.warn(
        `WARNING: Layout Utils package not found at ${layoutUtilsPath}.`
      );
    }
    if (!existsSync(collaborationPath)) {
      console.warn(
        `WARNING: Collaboration package not found at ${collaborationPath}.`
      );
    }
    if (!existsSync(i18nPath)) {
      console.warn(`WARNING: i18n package not found at ${i18nPath}.`);
    }
    if (!existsSync(performancePath)) {
      console.warn(
        `WARNING: Performance package not found at ${performancePath}.`
      );
    }
    if (!existsSync(testUtilsPath)) {
      console.warn(
        `WARNING: Test Utils package not found at ${testUtilsPath}.`
      );
    }
    // WASM 支持配置
    const wasmPkgPath = path.resolve(__dirname, "../../packages/wasm/pkg");
    const wasmMainPath = path.resolve(wasmPkgPath, "lowcode_platform_wasm.js");
    const serverStubPath = path.resolve(
      __dirname,
      "src/shared/wasm/server-stub.js"
    );

    // 基础别名配置（服务端和客户端都需要）
    // 注意：子路径导出必须在基础路径之前，以确保正确匹配
    const baseAliases = {
      // Schema 子路径导出（必须在基础路径之前）
      "@lowcode-platform/schema/types": schemaTypesPath,
      "@lowcode-platform/schema/validator": schemaValidatorPath,
      "@lowcode-platform/schema/serializer": schemaSerializerPath,
      "@lowcode-platform/schema/migrator": schemaMigratorPath,
      // Component Utils 子路径导出（必须在基础路径之前）
      "@lowcode-platform/component-utils/validator":
        componentUtilsValidatorPath,
      "@lowcode-platform/component-utils/types": componentUtilsTypesPath,
      "@lowcode-platform/component-utils/tree": componentUtilsTreePath,
      "@lowcode-platform/component-utils/find": componentUtilsFindPath,
      "@lowcode-platform/component-utils/children": componentUtilsChildrenPath,
      // 基础包路径
      "@lowcode-platform/ai-generator": aiGeneratorPath,
      "@lowcode-platform/schema": schemaPath,
      "@lowcode-platform/component-utils": componentUtilsPath,
      "@lowcode-platform/utils": utilsPath,
      "@lowcode-platform/data-binding": dataBindingPath,
      "@lowcode-platform/layout-utils": layoutUtilsPath,
      "@lowcode-platform/collaboration": collaborationPath,
      "@lowcode-platform/i18n": i18nPath,
      "@lowcode-platform/performance": performancePath,
      "@lowcode-platform/test-utils": testUtilsPath,
    };

    // 对于有问题的第三方包，先添加别名（必须在 allAliases 之前）
    const problematicExportsPackages = {
      // clsx 的 exports 字段格式错误，直接指向实际文件
      clsx: path.resolve(__dirname, "../../node_modules/clsx/dist/clsx.mjs"),
      // zustand/middleware - Next.js 仍然检查 exports 字段，需要别名绕过
      "zustand/middleware": path.resolve(
        __dirname,
        "../../node_modules/zustand/middleware.js"
      ),
    };

    // 添加有问题的包的别名（仅在文件存在时）
    const thirdPartyAliases = {};
    Object.entries(problematicExportsPackages).forEach(
      ([alias, targetPath]) => {
        // 对于 zustand/middleware，尝试多个可能的路径
        if (alias === "zustand/middleware") {
          const zustandPaths = [
            path.resolve(__dirname, "../../node_modules/zustand/middleware.js"),
            path.resolve(__dirname, "../../node_modules/zustand/esm/middleware.mjs"),
            path.resolve(__dirname, "../../node_modules/zustand/middleware/index.js"),
            path.resolve(__dirname, "../../node_modules/zustand/middleware/index.mjs"),
          ];
          
          for (const possiblePath of zustandPaths) {
            if (existsSync(possiblePath)) {
              thirdPartyAliases[alias] = possiblePath;
              console.log(`[Webpack] Aliased ${alias} to ${possiblePath}`);
              break;
            }
          }
        } else {
          // 对于其他包（如 clsx），尝试多个可能的路径
          const possiblePaths = [
            targetPath,
            targetPath.replace(/\.mjs$/, ".js"),
            targetPath.replace(/\.mjs$/, ".cjs"),
            path.resolve(__dirname, `../../node_modules/${alias}/index.js`),
            path.resolve(__dirname, `../../node_modules/${alias}/index.mjs`),
          ];

          for (const possiblePath of possiblePaths) {
            if (existsSync(possiblePath)) {
              thirdPartyAliases[alias] = possiblePath;
              break;
            }
          }
        }
      }
    );

    // 合并别名配置（确保子路径导出优先，第三方包别名在最前面）
    const allAliases = {
      ...thirdPartyAliases, // 第三方包别名在最前面
      ...baseAliases,
      "@lowcode-platform/wasm": serverStubPath,
    };

    if (isServer) {
      // 服务端构建时，使用存根文件避免加载 WASM
      config.resolve.alias = {
        ...config.resolve.alias,
        ...allAliases,
      };
    } else {
      // 客户端构建时，临时跳过 WASM，使用存根文件
      console.warn(
        `WARNING: WASM functionality is temporarily disabled. Using stub file.`
      );
      // 始终使用存根文件，跳过 WASM 功能
      config.resolve.alias = {
        ...config.resolve.alias,
        ...allAliases,
      };
    }

    // 确保 WASM 文件被正确处理
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
    };

    // 配置 webpack 以正确处理 package.json exports 字段
    config.resolve.conditionNames = ["import", "require", "default"];
    // 完全禁用 exports 字段检查，只使用 main/module
    // 这样可以绕过某些第三方包的有问题的 exports 字段配置
    // 注意：对于我们的 workspace 包，我们使用别名，所以不受影响
    config.resolve.exportsFields = ["main", "module"];

    // 对于有问题的第三方包（exports 字段格式错误），添加别名来绕过问题
    // 这些包的 exports 字段使用了无效的相对路径（缺少 ./ 前缀）
    // 注意：Next.js 仍然会检查 exports 字段，所以我们需要为这些包添加别名
    const problematicExportsPackages = {
      // clsx 的 exports 字段格式错误，直接指向实际文件
      clsx: path.resolve(__dirname, "../../node_modules/clsx/dist/clsx.mjs"),
      // zustand/middleware - Next.js 仍然检查 exports 字段，需要别名绕过
      "zustand/middleware": path.resolve(
        __dirname,
        "../../node_modules/zustand/middleware.js"
      ),
    };

    // 添加有问题的包的别名（仅在文件存在时）
    Object.entries(problematicExportsPackages).forEach(
      ([alias, targetPath]) => {
        // 对于 zustand/middleware，尝试多个可能的路径
        if (alias === "zustand/middleware") {
          const zustandPaths = [
            path.resolve(__dirname, "../../node_modules/zustand/middleware.js"),
            path.resolve(
              __dirname,
              "../../node_modules/zustand/esm/middleware.mjs"
            ),
            path.resolve(
              __dirname,
              "../../node_modules/zustand/middleware/index.js"
            ),
            path.resolve(
              __dirname,
              "../../node_modules/zustand/middleware/index.mjs"
            ),
          ];

          for (const possiblePath of zustandPaths) {
            if (existsSync(possiblePath)) {
              config.resolve.alias = {
                ...config.resolve.alias,
                [alias]: possiblePath,
              };
              console.log(`Aliased ${alias} to ${possiblePath}`);
              break;
            }
          }
        } else {
          // 对于其他包（如 clsx），尝试多个可能的路径
          const possiblePaths = [
            targetPath,
            targetPath.replace(/\.mjs$/, ".js"),
            targetPath.replace(/\.mjs$/, ".cjs"),
            path.resolve(__dirname, `../../node_modules/${alias}/index.js`),
            path.resolve(__dirname, `../../node_modules/${alias}/index.mjs`),
          ];

          for (const possiblePath of possiblePaths) {
            if (existsSync(possiblePath)) {
              config.resolve.alias = {
                ...config.resolve.alias,
                [alias]: possiblePath,
              };
              break;
            }
          }
        }
      }
    );

    // 通过设置 fullySpecified: false 可以让 webpack 更宽松地处理这些包
    if (!config.resolve.fullySpecified) {
      config.resolve.fullySpecified = false;
    }

    // 确保正确解析 TypeScript 文件
    if (!config.resolve.extensions) {
      config.resolve.extensions = [];
    }
    // 确保 .ts 和 .tsx 在扩展名列表中
    const requiredExtensions = [".ts", ".tsx", ".js", ".jsx", ".json"];
    requiredExtensions.forEach((ext) => {
      if (!config.resolve.extensions.includes(ext)) {
        config.resolve.extensions.push(ext);
      }
    });

    // 优化 chunk 分割
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: "all",
          cacheGroups: {
            default: false,
            vendors: false,
            // 将 node_modules 中的大型库单独打包
            framework: {
              name: "framework",
              chunks: "all",
              test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|react-dnd|react-dnd-html5-backend)[\\/]/,
              priority: 40,
              enforce: true,
            },
            // 将其他 node_modules 打包
            lib: {
              test: /[\\/]node_modules[\\/]/,
              name(module) {
                const packageName = module.context.match(
                  /[\\/]node_modules[\\/](.*?)([\\/]|$)/
                )?.[1];
                return packageName
                  ? `npm.${packageName.replace("@", "")}`
                  : null;
              },
              priority: 30,
              minChunks: 1,
              reuseExistingChunk: true,
            },
            // 共享的组件和工具
            commons: {
              name: "commons",
              minChunks: 2,
              priority: 20,
            },
          },
        },
      };
    }

    return config;
  },
};

export default nextConfig;
