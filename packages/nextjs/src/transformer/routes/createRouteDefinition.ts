import { FileContentOption, RouteFunctionDefinition } from "../../types";
import { convertPathToParamFormat } from "./createRoutePaths";

type CreateRouteDefinitionOption = {
  route: RouteFunctionDefinition;
  options: FileContentOption["options"];
};

export const createRouteDefinition = ({
  route,
  options,
}: CreateRouteDefinitionOption) => {
  const path =
    route.routeSegments.length === 0
      ? `"/"`
      : `"/${convertPathToParamFormat(route.routeSegments)}${
          options.trailingSlash ? "/" : ""
        }"`;

  const hasOptionalCatchAll = route.routeSegments.some(
    (s) => s.dynamicType === "optional-catch-all",
  );

  const searchParamsType = `ExportedQuery<${route.searchParamsType} & import("./types").GlobalSearchParams>`;

  if (hasOptionalCatchAll) {
    const basePath = `"/${route.routeSegments
      .filter((s) => s.dynamicType !== "optional-catch-all")
      .map((s) => s.rawParamName)
      .join("/")}${options.trailingSlash ? "/" : ""}"`;

    return `${basePath}: {
  params: {} as Record<string, never>,
  // @ts-ignore
  searchParams: {} as ${searchParamsType}
},
${path}: {
  params: {} as ${createParamsType(route, true)},
  // @ts-ignore
  searchParams: {} as ${searchParamsType}
}`;
  }

  return `${path}: {
  params: {} as ${createParamsType(route)},
  // @ts-ignore
  searchParams: {} as ${searchParamsType}
}`;
};

const createParamsType = (
  route: RouteFunctionDefinition,
  makeRequired = false,
) => {
  if (!route.routeSegments.some((s) => s.isDynamic)) {
    return "Record<string, never>";
  }

  const params = route.routeSegments
    .filter((s) => s.isDynamic)
    .map((s) => {
      switch (s.dynamicType) {
        case "catch-all":
          return `${s.paramName}: string[] | number[]`;
        case "optional-catch-all":
          return makeRequired
            ? `${s.paramName}: string[] | number[]`
            : `${s.paramName}?: string[] | number[]`;
        default:
          return `${s.paramName}: string | number`;
      }
    })
    .join(", ");

  return `{ ${params} }`;
};
