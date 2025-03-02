import { FileContentOption, RouteSegment } from "../../types";

export const convertPathToParamFormat = (segments: RouteSegment[]) => {
  if (segments.length === 0) return "";
  return segments
    .map((segment) => {
      if (!segment.isDynamic) return segment.rawParamName;
      return segment.rawParamName;
    })
    .join("/");
};

export const createRoutePaths = ({ routes, options }: FileContentOption) => {
  return `${routes
    .map((route) => {
      const path =
        route.routeSegments.length === 0
          ? "/"
          : `/${convertPathToParamFormat(route.routeSegments)}${
              options.trailingSlash ? "/" : ""
            }`;

      if (
        route.routeSegments.some((s) => s.dynamicType === "optional-catch-all")
      ) {
        const basePath = `/${route.routeSegments
          .filter((s) => s.dynamicType !== "optional-catch-all")
          .map((s) => s.rawParamName)
          .join("/")}${options.trailingSlash ? "/" : ""}`;

        return `"${path}" | "${basePath}"`;
      }

      return `"${path}"`;
    })
    .join(" | ")};`;
};
