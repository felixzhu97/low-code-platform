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
    const aiGeneratorPath = path.resolve(__dirname, "../../packages/ai-generator/src/index.ts");
    
    if (!existsSync(aiGeneratorPath)) {
      console.warn(`WARNING: AI Generator package not found at ${aiGeneratorPath}.`);
    }
    
    // WASM 支持配置
    const wasmPkgPath = path.resolve(__dirname, "../../packages/wasm/pkg");
    const wasmMainPath = path.resolve(wasmPkgPath, "lowcode_platform_wasm.js");
    const serverStubPath = path.resolve(__dirname, "src/shared/wasm/server-stub.js");
    
    if (isServer) {
      // 服务端构建时，使用存根文件避免加载 WASM
      config.resolve.alias = {
        ...config.resolve.alias,
        "@lowcode-platform/wasm": serverStubPath,
        "@lowcode-platform/ai-generator": aiGeneratorPath,
      };
    } else {
      // 客户端构建时，配置 WASM 支持
      config.experiments = {
        ...config.experiments,
        asyncWebAssembly: true,
      };
      
      // 检查文件是否存在（构建时）
      if (!existsSync(wasmPkgPath) || !existsSync(wasmMainPath)) {
        console.warn(`WARNING: WASM package not found at ${wasmPkgPath}. Make sure to run build:wasm first.`);
        // 如果文件不存在，使用存根文件避免构建失败
        config.resolve.alias = {
          ...config.resolve.alias,
          "@lowcode-platform/wasm": serverStubPath,
          "@lowcode-platform/ai-generator": aiGeneratorPath,
        };
      } else {
        // 文件存在，使用实际的 WASM 文件
        config.resolve.alias = {
          ...config.resolve.alias,
          "@lowcode-platform/wasm": wasmMainPath,
          "@lowcode-platform/wasm/pkg": wasmPkgPath,
          "@lowcode-platform/ai-generator": aiGeneratorPath,
        };
      }
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
