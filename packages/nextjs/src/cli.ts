#!/usr/bin/env node

import { existsSync } from "node:fs";
import path from "path";
import chokidar from "chokidar";
import { program } from "commander";
import { generateTypes } from "./generator";

program
  .name("safe-routes")
  .description("Generate type-safe routes for Next.js")
  .option("-w, --watch", "Watch for file changes and regenerate types")
  .option("-o, --out-dir <path>", "Output directory (default: .safe-routes)")
  .option(
    "--trailing-slash <boolean>",
    "Enable trailing slash in generated routes",
    "true",
  )
  .action(
    async (options: {
      trailingSlash: "true" | "false";
      outDir: string;
      watch: boolean;
    }) => {
      const findDirectory = (baseName: string): string | null => {
        const rootPath = path.resolve(process.cwd(), baseName);
        const srcPath = path.resolve(process.cwd(), "src", baseName);
        if (existsSync(rootPath)) return rootPath;
        if (existsSync(srcPath)) return srcPath;
        return null;
      };

      const appDir = findDirectory("app") || "";
      const pagesDir = findDirectory("pages") || "";
      const trailingSlash = options.trailingSlash === "true";

      if (!appDir && !pagesDir) {
        console.error(
          "Error: Neither 'app' nor 'pages' directory found in root or src directory",
        );
        process.exit(1);
      }

      const outDir = path.resolve(
        process.cwd(),
        options.outDir || "generated/safe-routes",
      );

      const config = {
        appDir,
        pagesDir,
        options: {
          trailingSlash,
          outDir,
        },
      };

      let timeoutId: NodeJS.Timeout | null = null;
      const debouncedGenerate = () => {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(async () => {
          try {
            await generateTypes(config);
          } catch (error) {
            if (!options.watch) process.exit(1);
          }
        }, 1000);
      };

      debouncedGenerate();

      console.log("==================================");
      console.log("✨ Generating routes types...");
      console.log("🚀 by @safe-routes/nextjs");
      console.log("==================================");

      if (options.watch) {
        const targetDirs = [appDir, pagesDir].filter((dir) => dir);

        const watcher = chokidar.watch(targetDirs, {
          ignored: /(^|[\/\\])\../,
          persistent: true,
          ignoreInitial: true,
          usePolling: false,
          awaitWriteFinish: true,
        });

        watcher
          .on("add", () => debouncedGenerate())
          .on("unlink", () => debouncedGenerate())
          .on("unlinkDir", () => debouncedGenerate())
          .on("change", () => debouncedGenerate());
      }
    },
  );

program.parse();
