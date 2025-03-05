import path from "path";
import fs from "fs/promises";

async function fileExists(filepath: string) {
  try {
    return (await fs.lstat(filepath)).isFile();
  } catch (e) {
    return false;
  }
}

export const createGlobalSearchParamsFile = async (outDir: string) => {
  const configPath = path.join(outDir, "./safe-routes.config.ts");

  if (await fileExists(configPath)) {
    return;
  }

  const content = `
import { createSearchParams, InferSearchParams, setGlobalSearchParams } from "@safe-routes/nextjs";

export const globalSearchParams = createSearchParams((p) => ({
  // Add your global search parameters here
  // locale: p.enumOr(["en", "ja"] as const, "en"),
})).passthrough();

export type GlobalSearchParams = InferSearchParams<typeof globalSearchParams>;

setGlobalSearchParams(globalSearchParams);
`;

  await fs.writeFile(configPath, content);
  console.log(`Created default config.ts at ${configPath}`);
};
