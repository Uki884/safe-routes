import fs from "fs/promises";
import { createAppScanner } from "./scanner/createAppScanner";
import { createPagesScanner } from "./scanner/createPagesScanner";
import { createFileContent } from "./writer/createFileContent";
import { writeToFile } from "./writer/writeToFile";
import { UserOptions } from "./types";

type Options = {
  appDir: string;
  pagesDir: string;
  options: UserOptions;
};

export async function generateTypes({ appDir, pagesDir, options }: Options) {
  try {
    const outDir = options.outDir || ".safe-routes";
    await fs.mkdir(outDir, { recursive: true });
    const appScanner = createAppScanner({ inputDir: appDir, outDir });
    const pagesScanner = createPagesScanner({ inputDir: pagesDir, outDir });

    const appRoutes = appScanner ? await appScanner() : [];
    const pagesRoutes = pagesScanner ? await pagesScanner() : [];
    const allRoutes = [...appRoutes, ...pagesRoutes];

    // generate TypeScript source file
    const content = createFileContent({ routes: allRoutes, options });
    await writeToFile(content, `${outDir}/index.ts`);
  } catch (error) {
    console.error("Error generating types:", error);
  }
}
