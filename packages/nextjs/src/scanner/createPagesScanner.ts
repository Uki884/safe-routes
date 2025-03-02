import path from "path";
import { readdir, stat } from "fs/promises";
import { generateSearchParamsType } from "../generator/generateSearchParamsType";
import { RouteFunctionDefinition, RouteSegment } from "../types";
import { isIgnoreRoute } from "./utils/isIgnoreRoute";
import { parseRouteSegment } from "./utils/parseRouteSegment";

function getStaticParentPath(segments: RouteSegment[]): string | undefined {
  return segments
    .filter((s) => !s.isDynamic)
    .map((s) => s.rawParamName)
    .join("/");
}

export function createPagesScanner({
  inputDir,
  outDir,
}: { inputDir?: string; outDir: string }) {
  if (!inputDir) {
    return undefined;
  }

  return async function scan({
    currentPath = inputDir,
    parentSegments = [],
  }: {
    currentPath?: string;
    parentSegments?: RouteSegment[];
  } = {}): Promise<RouteFunctionDefinition[]> {
    const items = await readdir(currentPath);
    const routes: RouteFunctionDefinition[] = [];

    for (const item of items) {
      // skip special files
      if (isIgnoreRoute(item)) {
        continue;
      }

      const fullPath = path.join(currentPath, item);
      const stats = await stat(fullPath);

      if (stats.isDirectory()) {
        // handle directory
        const segment = parseRouteSegment({
          segment: item,
          parentSegment: getStaticParentPath(parentSegments),
        });

        if (segment) {
          routes.push(
            ...(await scan({
              currentPath: fullPath,
              parentSegments: [...parentSegments, segment],
            })),
          );
        }
      } else {
        // handle file
        if (item.endsWith(".tsx") || item.endsWith(".ts")) {
          const isIndex = item === "index.tsx" || item === "index.ts";
          const segment = parseRouteSegment({
            segment: item.replace(/\.tsx?$/, ""),
            parentSegment: getStaticParentPath(parentSegments),
          });

          if (!segment) {
            continue;
          }

          if (isIndex || segment) {
            const segments = isIndex
              ? parentSegments
              : [...parentSegments, segment];
            const searchParamsType = generateSearchParamsType(fullPath, outDir);
            routes.push({
              routeSegments: segments,
              searchParamsType,
            });
          }
        }
      }
    }

    return routes;
  };
}
