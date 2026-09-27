import { defineConfig } from "vitest/config";

// Tests run from the repository root in Node; the Vite app config roots at client/.
export default defineConfig({
  test: {
    root: import.meta.dirname,
    include: ["tests/**/*.test.ts"],
    environment: "node",
  },
});
