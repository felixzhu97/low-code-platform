// Note: vitest and vite types should be provided by the consuming project
// Using any to avoid hard dependencies
type UserConfig = any;
type PluginOption = any;

// Dynamic imports to avoid requiring these as dependencies
let reactPlugin: PluginOption | undefined;
let pathResolve: ((from: string, to: string) => string) | undefined;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  // @ts-ignore - dynamic require for optional dependencies
  const react = require("@vitejs/plugin-react");
  reactPlugin = react.default || react;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  // @ts-ignore - dynamic require for optional dependencies
  const path = require("path");
  pathResolve = path.resolve;
} catch {
  // These will be provided by the consuming project
}

export interface VitestConfigOptions {
  /**
   * Test environment: 'jsdom' for React components, 'node' for Node.js code
   * @default 'jsdom'
   */
  environment?: "jsdom" | "node";
  /**
   * Path to setup file
   * @default undefined (uses default setup)
   */
  setupFiles?: string[];
  /**
   * Path aliases for module resolution
   * @default {}
   */
  alias?: Record<string, string>;
  /**
   * Enable globals (describe, it, expect, etc. without imports)
   * @default true
   */
  globals?: boolean;
  /**
   * Additional Vitest configuration
   */
  test?: UserConfig["test"];
}

/**
 * Get Vitest configuration preset
 * @param options Configuration options
 * @returns Vitest configuration
 */
export function getVitestConfig(options: VitestConfigOptions = {}): UserConfig {
  const {
    environment = "jsdom",
    setupFiles,
    alias = {},
    globals = true,
    test: additionalTestConfig = {},
  } = options;

  // Build resolve aliases
  const resolveAliases: Record<string, string> = {};
  if (pathResolve) {
    // Use globalThis to access process in a safe way
    const nodeProcess =
      typeof globalThis !== "undefined" && (globalThis as any).process;
    if (nodeProcess && typeof nodeProcess.cwd === "function") {
      for (const [key, value] of Object.entries(alias)) {
        resolveAliases[key] = pathResolve(nodeProcess.cwd(), value);
      }
    }
  }

  const plugins: PluginOption[] = [];
  if (reactPlugin) {
    plugins.push(reactPlugin);
  }

  return {
    plugins,
    test: {
      globals,
      environment,
      setupFiles: setupFiles || [],
      ...additionalTestConfig,
    },
    resolve: {
      alias:
        Object.keys(resolveAliases).length > 0 ? resolveAliases : undefined,
    },
  } as UserConfig;
}
