import { createRouteDefinition } from "../transformer/routes/createRouteDefinition";
import { createRoutePaths } from "../transformer/routes/createRoutePaths";
import { FileContentOption } from "../types";

/**
 * 型定義ファイル（.d.ts）のコンテンツを生成する
 */
export const createTypeDefinitionContent = ({
  routes,
  options,
}: FileContentOption): string => {
  const routePaths = createRoutePaths({ routes, options });
  // ルート定義を生成し、フラット化する
  const routeDefinitions: { path: string; definition: string }[] = [];
  for (const route of routes) {
    const result = createRouteDefinition({ route, options });
    if (Array.isArray(result)) {
      routeDefinitions.push(...result);
    } else if (result) {
      routeDefinitions.push(result);
    }
  }

  const content = `// This file is auto-generated from @safe-routes/nextjs
// DO NOT EDIT DIRECTLY

declare module "@@@safe-routes/nextjs" {
  type IsSearchParams<T> = symbol extends keyof T ? false : true;
  type Config = import("${options.outDir}/safe-routes.config").GlobalSearchParams;
  type GlobalSearchParams = IsSearchParams<Config> extends true ? Config : never;
  type ExportedQuery<T> = IsSearchParams<T> extends true
    ? { [K in keyof T]: T[K] } & { [K in keyof GlobalSearchParams]: GlobalSearchParams[K] }
    : GlobalSearchParams;

  interface RouteList {
${routeDefinitions
  .map(({ path, definition }) => {
    return `    "${path}": ${definition}`;
  })
  .join(",\n")}
  }

  type SafeRoutePath = ${routePaths};
}
`;

  return content;
};
