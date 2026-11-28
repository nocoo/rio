import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
    environment: "node",
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/lib/**/*.ts"],
      exclude: ["**/*.d.ts", "**/*.test.ts", "**/*.tsx"],
      thresholds: { statements: 90, lines: 90, functions: 90, branches: 85 },
    },
  },
});
