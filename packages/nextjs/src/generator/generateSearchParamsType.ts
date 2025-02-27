import path from "path";

export const generateSearchParamsType = (
  fullPath: string,
  outDir: string,
): string => {
  // calculate relative path from outDir to targetFile
  const importPath = path.relative(outDir, fullPath).replace(/\\/g, "/");

  return `import("${importPath}").SearchParams`;
};
