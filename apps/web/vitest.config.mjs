import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./test/setup.ts"],
  },
  resolve: {
    alias: {
      "@": resolve(process.cwd(), "./src"),
      "@/shared": resolve(process.cwd(), "../../src/shared"),
      "@/domain": resolve(process.cwd(), "../../src/domain"),
      "@/application": resolve(process.cwd(), "../../src/application"),
      "@/infrastructure": resolve(process.cwd(), "../../src/infrastructure"),
      "@/presentation": resolve(process.cwd(), "../../src/presentation"),
    },
  },
});
