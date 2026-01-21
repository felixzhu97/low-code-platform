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
  // 配置需要转译的 workspace 包
  transpilePackages: ["@lowcode-platform/ai-generator"],
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
    const wasmStubPath = path.resolve(__dirname, "./src/shared/stubs/wasm-stub.ts");
    
    // 检查文件是否存在（构建时）
    const wasmExists = existsSync(wasmPkgPath) && existsSync(wasmMainPath);
    
    // 配置 AI Generator 包 - 检查多个可能的位置
    const aiGeneratorSrcPath = path.resolve(__dirname, "../../packages/ai-generator/src/index.ts");
    const aiGeneratorNodeModulesPath = path.resolve(__dirname, "../../node_modules/@lowcode-platform/ai-generator");
    const aiGeneratorStubPath = path.resolve(__dirname, "./src/shared/stubs/ai-generator-stub.ts");
    
    // 检查包是否存在（可能在 workspace 或 node_modules 中）
    const aiGeneratorExists = 
      existsSync(aiGeneratorSrcPath) || 
      existsSync(aiGeneratorNodeModulesPath) ||
      existsSync(path.resolve(__dirname, "../../packages/ai-generator"));
    
    // 设置别名：如果包不存在，使用占位符
    const webpack = config.webpack || require("webpack");
    
    config.resolve.alias = {
      ...config.resolve.alias,
      // WASM 别名 - 如果不存在则使用占位符
      "@lowcode-platform/wasm": wasmExists ? wasmMainPath : wasmStubPath,
      "@lowcode-platform/wasm/pkg": wasmExists ? wasmPkgPath : wasmStubPath,
    };
    
    // 如果 AI Generator 不存在，使用占位符
    if (!aiGeneratorExists) {
      console.warn(`WARNING: AI Generator package not found. Using stub implementation.`);
      config.resolve.alias["@lowcode-platform/ai-generator"] = aiGeneratorStubPath;
    }
    
    // 如果 WASM 不存在，使用占位符
    if (!wasmExists) {
      console.warn(`WARNING: WASM package not found at ${wasmPkgPath}. Using stub implementation.`);
    }
    
    // 确保 WASM 文件被正确处理
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
    };
    
    // 添加模块解析路径，确保能找到 workspace 包
    if (!config.resolve.modules) {
      config.resolve.modules = [];
    }
    if (Array.isArray(config.resolve.modules)) {
      config.resolve.modules.push(
        path.resolve(__dirname, "../../packages"),
        path.resolve(__dirname, "../../node_modules")
      );
    }
    
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
