export type SearchParams = {
  [key: string]: string | number | (string | number)[];
};

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

export type SafeRoutePath = "/login" | "/blog/[slug]/[hoge]" | "/blog/[slug]" | "/products/[[...filters]]" | "/products" | "/shop/[...categories]" | "/shop" | "/top" | "/users/[user_id]/[year]/[month]" | "/users/[user_id]" | "/users/[user_id]/posts/[post-id]" | "/about" | "/docs/[...slug]" | "/video/[[...name]]" | "/video" | "/video/[id]";;

export type SafeRouteParams<T extends SafeRoutePath> = (typeof safeRoutes)[T]['params'];
export type SafeRouteSearchParams<T extends SafeRoutePath> = (typeof safeRoutes)[T]['searchParams'];
export type SafeRoutes = typeof safeRoutes;

type GlobalSearchParams = import("./types").SearchParams;
type IsAllOptional<T> = { [K in keyof T]?: any } extends T ? true : false;
type HasSearchParams<T> = T extends { searchParams: undefined } ? false : true;
type HasParams<T> = T extends Record<string, never> ? false : true
type PickSearchParams<T extends SafeRoutePath> = Pick<typeof safeRoutes[T], 'searchParams'>;
type IsSearchParams<T> = symbol extends keyof T ? false : true;
type ExportedQuery<T> = IsSearchParams<T> extends true ? T & GlobalSearchParams :  GlobalSearchParams;

type RouteParameters<T extends SafeRoutePath> = {
  RequiredBoth: [params: SafeRouteParams<T>, searchParams: SafeRouteSearchParams<T>];
  RequiredParamsOptionalSearch: [params: SafeRouteParams<T>, searchParams?: SafeRouteSearchParams<T>];
  ParamsOnly: [params: SafeRouteParams<T>];
  SearchOnly: [searchParams: SafeRouteSearchParams<T>];
  OptionalSearchOnly: [searchParams?: SafeRouteSearchParams<T>];
  None: [];
};

type SafeRouteArgs<T extends SafeRoutePath> =
  HasParams<SafeRouteParams<T>> extends true
    ? HasSearchParams<PickSearchParams<T>> extends true
      ? IsAllOptional<SafeRouteSearchParams<T>> extends true
        ? RouteParameters<T>['RequiredParamsOptionalSearch']
        : RouteParameters<T>['RequiredBoth']
      : RouteParameters<T>['ParamsOnly']
    : HasSearchParams<PickSearchParams<T>> extends true
      ? IsAllOptional<SafeRouteSearchParams<T>> extends true
        ? RouteParameters<T>['OptionalSearchOnly']
        : RouteParameters<T>['SearchOnly']
      : RouteParameters<T>['None'];

export function $path<T extends SafeRoutePath>(
  path: T,
  ...args: SafeRouteArgs<T>
): T {
  const hasDynamicParams = path.includes('[');
  const params = hasDynamicParams ? args[0] : {};
  const searchParams = hasDynamicParams ? args[1] : args[0];

  const resolvedPath = path.replace(/\[(?:\[)?(?:\.\.\.)?([^\]]+?)\](?:\])?/g, (_, key: string) => {
    const paramKey = key.replace(/[-_]([a-z])/g, (_: string, c: string) => c.toUpperCase()) as keyof typeof params;
    const value = params?.[paramKey] || "";

    if (Array.isArray(value)) {
      if (value.length === 0) return "";
      return value.join("/");
    }

    const stringValue = String(value || "");
    return stringValue === "" ? "" : stringValue;
  });

  // Remove extra slashes
  const normalizedPath = resolvedPath.replace(/\/+/g, '/');

  return `${normalizedPath}${buildSearchParams(searchParams as SearchParams)}` as T;
}

export const safeRoutes = {
"/login": {
  params: {} as Record<string, never>,
  searchParams: {} as ExportedQuery<
  // @ts-ignore
  import("../../app/(auth)/login/page.tsx").SearchParams>
},
"/blog/[slug]/[hoge]": {
  params: {} as { slug: string | number, hoge: string | number },
  searchParams: {} as ExportedQuery<
  // @ts-ignore
  import("../../app/blog/[slug]/[hoge]/page.tsx").SearchParams>
},
"/blog/[slug]": {
  params: {} as { slug: string | number },
  searchParams: {} as ExportedQuery<
  // @ts-ignore
  import("../../app/blog/[slug]/page.tsx").SearchParams>
},
"/products": {
  params: {} as Record<string, never>,
  searchParams: {} as ExportedQuery<
  // @ts-ignore
  import("../../app/products/[[...filters]]/page.tsx").SearchParams>
},
"/products/[[...filters]]": {
  params: {} as { filters: string[] | number[] },
  searchParams: {} as ExportedQuery<
  // @ts-ignore
  import("../../app/products/[[...filters]]/page.tsx").SearchParams>
},
"/shop/[...categories]": {
  params: {} as { categories: string[] | number[] },
  searchParams: {} as ExportedQuery<
  // @ts-ignore
  import("../../app/shop/[...categories]/page.tsx").SearchParams>
},
"/shop": {
  params: {} as Record<string, never>,
  searchParams: {} as ExportedQuery<
  // @ts-ignore
  import("../../app/shop/page.tsx").SearchParams>
},
"/top": {
  params: {} as Record<string, never>,
  searchParams: {} as ExportedQuery<
  // @ts-ignore
  import("../../app/top/page.tsx").SearchParams>
},
"/users/[user_id]/[year]/[month]": {
  params: {} as { userId: string | number, year: string | number, month: string | number },
  searchParams: {} as ExportedQuery<
  // @ts-ignore
  import("../../app/users/[user_id]/[year]/[month]/page.tsx").SearchParams>
},
"/users/[user_id]": {
  params: {} as { userId: string | number },
  searchParams: {} as ExportedQuery<
  // @ts-ignore
  import("../../app/users/[user_id]/page.tsx").SearchParams>
},
"/users/[user_id]/posts/[post-id]": {
  params: {} as { userId: string | number, postId: string | number },
  searchParams: {} as ExportedQuery<
  // @ts-ignore
  import("../../app/users/[user_id]/posts/[post-id]/page.tsx").SearchParams>
},
"/about": {
  params: {} as Record<string, never>,
  searchParams: {} as ExportedQuery<
  // @ts-ignore
  import("../../pages/about.tsx").SearchParams>
},
"/docs/[...slug]": {
  params: {} as { slug: string[] | number[] },
  searchParams: {} as ExportedQuery<
  // @ts-ignore
  import("../../pages/docs/[...slug].tsx").SearchParams>
},
"/video": {
  params: {} as Record<string, never>,
  searchParams: {} as ExportedQuery<
  // @ts-ignore
  import("../../pages/video/[[...name]].tsx").SearchParams>
},
"/video/[[...name]]": {
  params: {} as { name: string[] | number[] },
  searchParams: {} as ExportedQuery<
  // @ts-ignore
  import("../../pages/video/[[...name]].tsx").SearchParams>
},
"/video/[id]": {
  params: {} as { id: string | number },
  searchParams: {} as ExportedQuery<
  // @ts-ignore
  import("../../pages/video/[id]/index.tsx").SearchParams>
}
} as const;