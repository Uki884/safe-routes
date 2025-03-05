import path from "path";
import { mkdir } from "fs/promises";
import { createGlobalSearchParamsFile } from "./generator/createGlobalSearchParamsFile";
import { createAppScanner } from "./scanner/createAppScanner";
import { createPagesScanner } from "./scanner/createPagesScanner";
import { UserOptions } from "./types";
import { createTypeDefinitionContent } from "./writer/createTypeDefinitionContent";
import { writeToFile } from "./writer/writeToFile";

type Options = {
  appDir: string;
  pagesDir: string;
  options: UserOptions;
};

export const generateTypes = async ({
  appDir,
  pagesDir,
  options,
}: Options): Promise<void> => {
  const { outDir } = options;

  await createGlobalSearchParamsFile(outDir);

  // create scanner
  const appScannerFn = createAppScanner({ inputDir: appDir });
  const pagesScannerFn = createPagesScanner({ inputDir: pagesDir });

  // scan routes
  const appRoutes = appScannerFn ? await appScannerFn() : [];
  const pagesRoutes = pagesScannerFn ? await pagesScannerFn() : [];

  // combine all routes
  const routes = [...appRoutes, ...pagesRoutes];

  // create directory if not exists
  await mkdir(outDir, { recursive: true });

  const typeDefPath = path.join(process.cwd(), "safe-routes.d.ts");

  // create type definition file content
  const typeDefinitionContent = createTypeDefinitionContent({
    routes,
    options,
  });

  // write to type definition file
  await writeToFile(typeDefPath, typeDefinitionContent);
};
