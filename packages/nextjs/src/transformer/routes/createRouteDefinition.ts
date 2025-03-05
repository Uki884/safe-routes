import { FileContentOption, RouteFunctionDefinition } from "../../types";
import { RouteSegment } from "../../types/route";
import { convertPathToParamFormat } from "./createRoutePaths";

type CreateRouteDefinitionOption = {
  route: RouteFunctionDefinition;
  options: FileContentOption["options"];
};

type RouteDefinitionResult = {
  path: string;
  definition: string;
};

export const createRouteDefinition = ({
  route,
  options,
}: CreateRouteDefinitionOption):
  | RouteDefinitionResult
  | RouteDefinitionResult[] => {
  const path =
    route.routeSegments.length === 0
      ? `"/"`
      : `"/${convertPathToParamFormat(route.routeSegments)}${
          options.trailingSlash ? "/" : ""
        }"`;

  const hasOptionalCatchAll = route.routeSegments.some(
    (s: RouteSegment) => s.dynamicType === "optional-catch-all",
  );

  const searchParamsType = route.searchParamsType;
  const paramsType = createParamsType(route);

  // 通常のルートの場合
  if (!hasOptionalCatchAll) {
    return {
      path: path.replace(/"/g, ""),
      definition: `{
  params: ${paramsType},
  searchParams: ExportedQuery<${searchParamsType}>
}`,
    };
  }

  const basePath = `"/${route.routeSegments
    .filter((s: RouteSegment) => s.dynamicType !== "optional-catch-all")
    .map((s: RouteSegment) => s.rawParamName)
    .join("/")}${options.trailingSlash ? "/" : ""}"`;

  return [
    {
      path: basePath.replace(/"/g, ""),
      definition: `{
  params: Record<string, never>,
  searchParams: ExportedQuery<${searchParamsType}>
}`,
    },
    {
      path: path.replace(/"/g, ""),
      definition: `{
  params: ${createParamsType(route, true)},
  searchParams: ExportedQuery<${searchParamsType}>
}`,
    },
  ];
};

const createParamsType = (
  route: RouteFunctionDefinition,
  makeRequired = false,
): string => {
  if (!route.routeSegments.some((s: RouteSegment) => s.isDynamic)) {
    return "Record<string, never>";
  }

  const params = route.routeSegments
    .filter((s: RouteSegment) => s.isDynamic)
    .map((s: RouteSegment) => {
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
