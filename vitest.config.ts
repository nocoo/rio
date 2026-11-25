import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
    environment: "node",
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/lib/**/*.ts"],
      exclude: ["**/*.d.ts", "**/*.test.ts", "src/App.tsx", "src/main.tsx", "src/components/**"],
      thresholds: { statements: 80, branches: 80, functions: 80, lines: 80 },
    },
  },
});
