import { defineConfig } from "vitest/config";
import { getVitestConfig } from "@lowcode-platform/test-utils/vitest";

export default defineConfig(
  getVitestConfig({
    environment: "node",
  })
);
