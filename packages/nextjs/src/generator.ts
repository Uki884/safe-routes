import fs from "fs/promises";
import { createGlobalSearchParamsFile } from "./generator/createGlobalSearchParamsFile";
import { createAppScanner } from "./scanner/createAppScanner";
import { createPagesScanner } from "./scanner/createPagesScanner";
import { UserOptions } from "./types";
import { createFileContent } from "./writer/createFileContent";
import { writeToFile } from "./writer/writeToFile";

type Options = {
  appDir: string;
  pagesDir: string;
  options: UserOptions;
};

export async function generateTypes({ appDir, pagesDir, options }: Options) {
  try {
    const outDir = options.outDir || "generated/safe-routes";
    await fs.mkdir(outDir, { recursive: true });

    await createGlobalSearchParamsFile(outDir);

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
