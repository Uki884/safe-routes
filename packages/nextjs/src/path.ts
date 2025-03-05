import { RouteList } from "@@@safe-routes/nextjs";

type SearchParams = {
  [key: string]: unknown;
};

type SafeRoutePath = keyof RouteList & string;
type SafeRouteParams<T extends SafeRoutePath> = RouteList[T]["params"];
type SafeRouteSearchParams<T extends SafeRoutePath> =
  RouteList[T]["searchParams"];

type IsAllOptional<T> = { [K in keyof T]?: unknown } extends T ? true : false;
type HasSearchParams<T> = T extends { searchParams: undefined } ? false : true;
type HasParams<T> = T extends Record<string, never> ? false : true;
type PickSearchParams<T extends SafeRoutePath> = Pick<
  RouteList[T],
  "searchParams"
>;

type RouteParameters<T extends SafeRoutePath> = {
  RequiredBoth: [
    params: SafeRouteParams<T>,
    searchParams: SafeRouteSearchParams<T>,
  ];
  RequiredParamsOptionalSearch: [
    params: SafeRouteParams<T>,
    searchParams?: SafeRouteSearchParams<T>,
  ];
  ParamsOnly: [params: SafeRouteParams<T>];
  SearchOnly: [searchParams: SafeRouteSearchParams<T>];
  OptionalSearchOnly: [searchParams?: SafeRouteSearchParams<T>];
  None: [];
};

type SafeRouteArgs<T extends SafeRoutePath> = HasParams<
  SafeRouteParams<T>
> extends true
  ? HasSearchParams<PickSearchParams<T>> extends true
    ? IsAllOptional<SafeRouteSearchParams<T>> extends true
      ? RouteParameters<T>["RequiredParamsOptionalSearch"]
      : RouteParameters<T>["RequiredBoth"]
    : RouteParameters<T>["ParamsOnly"]
  : HasSearchParams<PickSearchParams<T>> extends true
    ? IsAllOptional<SafeRouteSearchParams<T>> extends true
      ? RouteParameters<T>["OptionalSearchOnly"]
      : RouteParameters<T>["SearchOnly"]
    : RouteParameters<T>["None"];

// URLSearchParamsを構築する関数
const buildSearchParams = (params?: SearchParams): string => {
  if (!params) return "";
  const searchParams = new URLSearchParams();
  const safeDecodeURIComponent = (value: string) => {
    try {
      return decodeURIComponent(value);
    } catch {
      return value;
    }
  };

  for (const [key, values] of Object.entries(params)) {
    if (Array.isArray(values)) {
      const uniqueValues = Array.from(new Set([...values]));
      for (const value of uniqueValues) {
        searchParams.append(key, safeDecodeURIComponent(String(value)));
      }
    } else {
      if (values) {
        searchParams.append(key, safeDecodeURIComponent(String(values)));
      }
    }
  }
  return `?${searchParams.toString()}`;
};

export const $path = <T extends SafeRoutePath>(
  path: T,
  ...args: SafeRouteArgs<T>
) => {
  const pathString = path as string;
  const hasDynamicParams = pathString.includes("[");
  const params = hasDynamicParams ? args[0] : {};

  const searchParams = hasDynamicParams ? args[1] : args[0];

  const resolvedPath = pathString.replace(
    /\[(?:\[)?(?:\.\.\.)?([^\]]+?)\](?:\])?/g,
    (_, key: string) => {
      const paramKey = key.replace(/[-_]([a-zA-Z])/g, (_: string, c: string) =>
        c.toUpperCase(),
      ) as keyof typeof params;
      const value = params?.[paramKey] || "";
      if (value === undefined || value === null) return "";

      if (Array.isArray(value)) {
        if (value.length === 0) return "";
        return value.join("/");
      }

      const stringValue = String(value || "");
      return stringValue === "" ? "" : stringValue;
    },
  );

  // Remove extra slashes
  const normalizedPath = resolvedPath
    .replace(/\/+/g, "/")
    .replace(/\/\/+/g, "/");

  return `${normalizedPath}${buildSearchParams(searchParams)}` as T;
};
