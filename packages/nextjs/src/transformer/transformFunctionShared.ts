export const transformFunctionShared = (type: "js" | "dts" = "js") => {
  // 型定義ファイル用
  if (type === "dts") {
    return `
type SearchParams = {
  [key: string]: string | number | (string | number)[];
};

declare function buildSearchParams(params?: SearchParams): string;
`;
  }

  // JSファイル用
  return `
const buildSearchParams = (params) => {
  if (!params) return "";
  const searchParams = new URLSearchParams();
  const safeDecodeURIComponent = (value) => {
    try {
      return decodeURIComponent(value);
    } catch {
      return value;
    }
  };
  for (const [key, values] of Object.entries(params)) {
    if (Array.isArray(values)) {
      const uniqueValues = Array.from(new Set([...values]));
      for (const value of uniqueValues) {
        searchParams.append(key, safeDecodeURIComponent(String(value)));
      }
    } else {
      if (values) {
        searchParams.append(key, safeDecodeURIComponent(String(values)));
      }
    }
  }
  return \`?\${searchParams.toString()}\`;
};
`;
};
