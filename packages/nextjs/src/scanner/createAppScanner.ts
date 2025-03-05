import path from "path";
import fs from "fs/promises";
import { readdir } from "fs/promises";
import { generateSearchParamsType } from "../generator/generateSearchParamsType";
import { RouteFunctionDefinition, RouteSegment } from "../types";
import { isIgnoreRoute } from "./utils/isIgnoreRoute";
import { isPage } from "./utils/isPage";
import { isRouteGroup } from "./utils/isRouteGroup";
import { parseRouteSegment } from "./utils/parseRouteSegment";

function getStaticParentPath(segments: RouteSegment[]): string | undefined {
  return segments
    .filter((s) => !s.isDynamic)
    .map((s) => s.rawParamName)
    .join("/");
}

export function createAppScanner({ inputDir }: { inputDir?: string }) {
  if (!inputDir) {
    return undefined;
  }

  return async function scan({
    currentPath = inputDir,
    parentSegments = [],
    accumulatedRoutes = [],
  }: {
    currentPath?: string;
    parentSegments?: RouteSegment[];
    accumulatedRoutes?: RouteFunctionDefinition[];
  } = {}): Promise<RouteFunctionDefinition[]> {
    const items = await readdir(currentPath);

    const routes = [];
    for (const item of items) {
      const fullPath = path.join(currentPath, item);
      const relativePath = path.relative(process.cwd(), fullPath);

      if (isIgnoreRoute(item)) {
        continue;
      }

      if (isPage(item)) {
        const segments = parentSegments.filter(Boolean);
        const searchParamsType = generateSearchParamsType(relativePath);
        routes.push({
          routeSegments: segments,
          searchParamsType,
        });
      } else {
        const isDirectory = (await fs.stat(fullPath)).isDirectory();

        if (!isDirectory) {
          continue;
        }

        // handle route group
        if (isRouteGroup(item)) {
          routes.push(
            ...(await scan({
              currentPath: fullPath,
              parentSegments: [],
              accumulatedRoutes,
            })),
          );
        }

        const staticParentPath = getStaticParentPath(parentSegments);
        const segment = parseRouteSegment({
          segment: item,
          parentSegment: staticParentPath,
        });

        if (!segment) {
          continue;
        }

        routes.push(
          ...(await scan({
            currentPath: fullPath,
            parentSegments: [...parentSegments, segment],
            accumulatedRoutes,
          })),
        );
      }
    }
    return routes;
  };
}
