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
  // 配置需要转译的 workspace 包
  transpilePackages: [
    "@lowcode-platform/ai-generator",
    "@lowcode-platform/wasm",
    "@lowcode-platform/component-utils",
    "@lowcode-platform/schema",
    "@lowcode-platform/utils",
    "@lowcode-platform/data-binding",
    "@lowcode-platform/layout-utils",
    "@lowcode-platform/collaboration",
    "@lowcode-platform/i18n",
    "@lowcode-platform/performance",
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
    // WASM 支持配置（客户端和服务端都需要）
    if (!isServer) {
      // 确保 WASM 文件作为资源文件处理
      config.experiments = {
        ...config.experiments,
        asyncWebAssembly: true,
      };
    }
    
    // 配置 WASM 文件的加载（服务端和客户端都需要）
    const wasmPkgPath = path.resolve(__dirname, "../../packages/wasm/pkg");
    const wasmMainPath = path.resolve(wasmPkgPath, "lowcode_platform_wasm.js");
    
    // 检查文件是否存在（构建时）
    if (!existsSync(wasmPkgPath)) {
      console.warn(`WARNING: WASM package not found at ${wasmPkgPath}. Make sure to run build:wasm first.`);
    }
    
    config.resolve.alias = {
      ...config.resolve.alias,
      // 指向主文件，而不是目录
      "@lowcode-platform/wasm": wasmMainPath,
      // 也支持目录解析（用于查找其他文件）
      "@lowcode-platform/wasm/pkg": wasmPkgPath,
    };
    
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
