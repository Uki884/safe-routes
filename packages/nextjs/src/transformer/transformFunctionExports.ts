import { FileContentOption } from "../types";
import { createRouteDefinition } from "./routes/createRouteDefinition";
import { createSafeRoute } from "./routes/createSafeRoute";

export const transformFunctionExports = ({
  routes,
  options,
}: FileContentOption) => {
  const routeDefinitionsArray: { path: string; definition: string }[] = [];
  for (const route of routes) {
    const result = createRouteDefinition({ route, options });
    if (Array.isArray(result)) {
      routeDefinitionsArray.push(...result);
    } else if (result) {
      routeDefinitionsArray.push(result);
    }
  }

  const safeRoute = createSafeRoute();

  return `
${safeRoute};
`;
};
