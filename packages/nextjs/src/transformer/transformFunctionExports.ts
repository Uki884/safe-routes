import { FileContentOption } from "../types";
import { createRouteDefinition } from "./routes/createRouteDefinition";
import { createRoutePaths } from "./routes/createRoutePaths";
import { createSafeRoute } from "./routes/createSafeRoute";

export const transformFunctionExports = ({
  routes,
  options,
}: FileContentOption) => {
  const routePaths = createRoutePaths({ routes, options });
  const routeDefinitions = routes.map((route) =>
    createRouteDefinition({ route, options }),
  );
  const safeRoute = createSafeRoute();

  return `
export type SafeRoutePath = ${routePaths};

${safeRoute}

export const safeRoutes = {
${routeDefinitions.join(",\n")}
} as const;`;
};
