import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: ["src/cli.ts", "src/index.ts"],
      formats: ["es"],
    },
    rollupOptions: {
      external: ["chokidar", "commander", "path", "fs/promises", "node:fs"],
    },
  },
});
