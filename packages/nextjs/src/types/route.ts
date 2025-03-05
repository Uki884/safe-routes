export type DynamicRouteType =
  | "dynamic"
  | "catch-all"
  | "optional-catch-all"
  | false;

export type RouteSegment = {
  rawParamName: string;
  isPage: boolean;
  isDynamic: boolean;
  paramName: string;
  dynamicType: DynamicRouteType;
  parentSegment?: string;
};

export type RouteFunctionDefinition = {
  routeSegments: RouteSegment[];
  searchParamsType: string;
};
