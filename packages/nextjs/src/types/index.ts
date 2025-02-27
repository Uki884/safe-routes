import { RouteFunctionDefinition } from "./route";

export type {
  DynamicRouteType,
  RouteFunctionDefinition,
  RouteSegment,
} from "./route";

export type FileContentOption = {
  routes: RouteFunctionDefinition[];
  options: UserOptions;
};

export type UserOptions = {
  trailingSlash: boolean;
  outDir?: string;
  watch?: boolean;
};
