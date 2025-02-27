import path from "path";
import fs from "fs/promises";

async function fileExists(filepath: string) {
  try {
    return (await fs.lstat(filepath)).isFile();
  } catch (e) {
    return false;
  }
}

export const createDefaultConfigFile = async (
  outDir: string,
): Promise<void> => {
  const typesPath = path.join(outDir, "./types.ts");

  if (await fileExists(typesPath)) {
    return;
  }

  const defaultContent = `/**
 * Global search parameters that will be applied to all routes
 */
export type GlobalSearchParams = {
  [key: string]: string | number | boolean | (string | number | boolean)[];

  // Add your global search parameters here
  // locale?: string;
};
`;

  await fs.writeFile(typesPath, defaultContent, "utf8");
  console.log(`Created default types.ts at ${typesPath}`);
};

