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
    const typesPath = path.resolve(
      __dirname,
      "../../packages/types/src/index.ts"
    );
    const validatorPath = path.resolve(
      __dirname,
      "../../packages/validator/src/index.ts"
    );
    const serializerPath = path.resolve(
      __dirname,
      "../../packages/serializer/src/index.ts"
    );
    const migratorPath = path.resolve(
      __dirname,
      "../../packages/migrator/src/index.ts"
    );
    const indexPath = path.resolve(__dirname, "../../packages/index.ts");
    const packageJsonPath = path.resolve(
      __dirname,
      "../../packages/package.json"
    );
    const tsconfigJsonPath = path.resolve(
      __dirname,
      "../../packages/tsconfig.json"
    );
    const vitestConfigPath = path.resolve(
      __dirname,
      "../../packages/vitest.config.ts"
    );
    if (!existsSync(aiGeneratorPath)) {
      console.warn(
        `WARNING: AI Generator package not found at ${aiGeneratorPath}.`
      );
    }
    if (!existsSync(schemaPath)) {
      console.warn(`WARNING: Schema package not found at ${schemaPath}.`);
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
    if (!existsSync(typesPath)) {
      console.warn(`WARNING: Types package not found at ${typesPath}.`);
    }
    if (!existsSync(validatorPath)) {
      console.warn(`WARNING: Validator package not found at ${validatorPath}.`);
    }
    if (!existsSync(serializerPath)) {
      console.warn(
        `WARNING: Serializer package not found at ${serializerPath}.`
      );
    }
    if (!existsSync(migratorPath)) {
      console.warn(`WARNING: Migrator package not found at ${migratorPath}.`);
    }
    if (!existsSync(indexPath)) {
      console.warn(`WARNING: Index package not found at ${indexPath}.`);
    }
    if (!existsSync(packageJsonPath)) {
      console.warn(
        `WARNING: Package Json package not found at ${packageJsonPath}.`
      );
    }
    if (!existsSync(tsconfigJsonPath)) {
      console.warn(
        `WARNING: Tsconfig Json package not found at ${tsconfigJsonPath}.`
      );
    }
    if (!existsSync(vitestConfigPath)) {
      console.warn(
        `WARNING: Vitest Config package not found at ${vitestConfigPath}.`
      );
    }
    // WASM 支持配置
    const wasmPkgPath = path.resolve(__dirname, "../../packages/wasm/pkg");
    const wasmMainPath = path.resolve(wasmPkgPath, "lowcode_platform_wasm.js");
    const serverStubPath = path.resolve(
      __dirname,
      "src/shared/wasm/server-stub.js"
    );

    if (isServer) {
      // 服务端构建时，使用存根文件避免加载 WASM
      config.resolve.alias = {
        ...config.resolve.alias,
        "@lowcode-platform/wasm": serverStubPath,
        "@lowcode-platform/ai-generator": aiGeneratorPath,
        "@lowcode-platform/schema": schemaPath,
        "@lowcode-platform/schema/types": schemaTypesPath,
        "@lowcode-platform/schema/validator": schemaValidatorPath,
        "@lowcode-platform/schema/serializer": schemaSerializerPath,
        "@lowcode-platform/schema/migrator": schemaMigratorPath,
        "@lowcode-platform/component-utils": componentUtilsPath,
        "@lowcode-platform/utils": utilsPath,
        "@lowcode-platform/data-binding": dataBindingPath,
        "@lowcode-platform/layout-utils": layoutUtilsPath,
        "@lowcode-platform/collaboration": collaborationPath,
        "@lowcode-platform/i18n": i18nPath,
        "@lowcode-platform/performance": performancePath,
        "@lowcode-platform/test-utils": testUtilsPath,
        "@lowcode-platform/types": typesPath,
        "@lowcode-platform/validator": validatorPath,
        "@lowcode-platform/serializer": serializerPath,
        "@lowcode-platform/migrator": migratorPath,
        "@lowcode-platform/index": indexPath,
        "@lowcode-platform/package.json": packageJsonPath,
        "@lowcode-platform/tsconfig.json": tsconfigJsonPath,
        "@lowcode-platform/vitest.config.ts": vitestConfigPath,
      };
    } else {
      // 客户端构建时，临时跳过 WASM，使用存根文件
      console.warn(
        `WARNING: WASM functionality is temporarily disabled. Using stub file.`
      );
      // 始终使用存根文件，跳过 WASM 功能
      config.resolve.alias = {
        ...config.resolve.alias,
        "@lowcode-platform/wasm": serverStubPath,
        "@lowcode-platform/ai-generator": aiGeneratorPath,
        "@lowcode-platform/schema": schemaPath,
        "@lowcode-platform/schema/types": schemaTypesPath,
        "@lowcode-platform/schema/validator": schemaValidatorPath,
        "@lowcode-platform/schema/serializer": schemaSerializerPath,
        "@lowcode-platform/schema/migrator": schemaMigratorPath,
        "@lowcode-platform/component-utils": componentUtilsPath,
        "@lowcode-platform/utils": utilsPath,
        "@lowcode-platform/data-binding": dataBindingPath,
        "@lowcode-platform/layout-utils": layoutUtilsPath,
        "@lowcode-platform/collaboration": collaborationPath,
        "@lowcode-platform/i18n": i18nPath,
        "@lowcode-platform/performance": performancePath,
        "@lowcode-platform/test-utils": testUtilsPath,
        "@lowcode-platform/types": typesPath,
        "@lowcode-platform/validator": validatorPath,
        "@lowcode-platform/serializer": serializerPath,
        "@lowcode-platform/migrator": migratorPath,
        "@lowcode-platform/index": indexPath,
        "@lowcode-platform/package.json": packageJsonPath,
        "@lowcode-platform/tsconfig.json": tsconfigJsonPath,
        "@lowcode-platform/vitest.config.ts": vitestConfigPath,
      };
    }

    // 确保 WASM 文件被正确处理
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
    };

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
