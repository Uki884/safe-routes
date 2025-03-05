export const generateSearchParamsType = (fullPath: string): string => {
  return `
  // @ts-ignore
  import("${fullPath}").SearchParams`;
};
