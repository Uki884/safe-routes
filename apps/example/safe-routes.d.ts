// This file is auto-generated from @safe-routes/nextjs
// DO NOT EDIT DIRECTLY

declare module "@@@safe-routes/nextjs" {
  type IsSearchParams<T> = symbol extends keyof T ? false : true;
  type Config = import("./safe-routes.config").GlobalSearchParams;
  type GlobalSearchParams = IsSearchParams<Config> extends true ? Config : never;
  type ExportedQuery<T> = IsSearchParams<T> extends true
    ? { [K in keyof T]: T[K] } & { [K in keyof GlobalSearchParams]: GlobalSearchParams[K] }
    : GlobalSearchParams;

  interface RouteList {
    "/login": {
  params: Record<string, never>,
  searchParams: ExportedQuery<
  // @ts-ignore
  import("app/(auth)/login/page.tsx").SearchParams>
},
    "/blog/[slug]/[hoge]": {
  params: { slug: string | number, hoge: string | number },
  searchParams: ExportedQuery<
  // @ts-ignore
  import("app/blog/[slug]/[hoge]/page.tsx").SearchParams>
},
    "/blog/[slug]": {
  params: { slug: string | number },
  searchParams: ExportedQuery<
  // @ts-ignore
  import("app/blog/[slug]/page.tsx").SearchParams>
},
    "/products": {
  params: Record<string, never>,
  searchParams: ExportedQuery<
  // @ts-ignore
  import("app/products/[[...filters]]/page.tsx").SearchParams>
},
    "/products/[[...filters]]": {
  params: { filters: string[] | number[] },
  searchParams: ExportedQuery<
  // @ts-ignore
  import("app/products/[[...filters]]/page.tsx").SearchParams>
},
    "/shop/[...categories]": {
  params: { categories: string[] | number[] },
  searchParams: ExportedQuery<
  // @ts-ignore
  import("app/shop/[...categories]/page.tsx").SearchParams>
},
    "/shop": {
  params: Record<string, never>,
  searchParams: ExportedQuery<
  // @ts-ignore
  import("app/shop/page.tsx").SearchParams>
},
    "/top": {
  params: Record<string, never>,
  searchParams: ExportedQuery<
  // @ts-ignore
  import("app/top/page.tsx").SearchParams>
},
    "/users/[user_id]/[year]/[month]": {
  params: { userId: string | number, year: string | number, month: string | number },
  searchParams: ExportedQuery<
  // @ts-ignore
  import("app/users/[user_id]/[year]/[month]/page.tsx").SearchParams>
},
    "/users/[user_id]": {
  params: { userId: string | number },
  searchParams: ExportedQuery<
  // @ts-ignore
  import("app/users/[user_id]/page.tsx").SearchParams>
},
    "/users/[user_id]/posts/[post-id]": {
  params: { userId: string | number, postId: string | number },
  searchParams: ExportedQuery<
  // @ts-ignore
  import("app/users/[user_id]/posts/[post-id]/page.tsx").SearchParams>
},
    "/about": {
  params: Record<string, never>,
  searchParams: ExportedQuery<
  // @ts-ignore
  import("pages/about.tsx").SearchParams>
},
    "/docs/[...slug]": {
  params: { slug: string[] | number[] },
  searchParams: ExportedQuery<
  // @ts-ignore
  import("pages/docs/[...slug].tsx").SearchParams>
},
    "/video": {
  params: Record<string, never>,
  searchParams: ExportedQuery<
  // @ts-ignore
  import("pages/video/[[...name]].tsx").SearchParams>
},
    "/video/[[...name]]": {
  params: { name: string[] | number[] },
  searchParams: ExportedQuery<
  // @ts-ignore
  import("pages/video/[[...name]].tsx").SearchParams>
},
    "/video/[id]": {
  params: { id: string | number },
  searchParams: ExportedQuery<
  // @ts-ignore
  import("pages/video/[id]/index.tsx").SearchParams>
}
  }

  type SafeRoutePath = "/login" | "/blog/[slug]/[hoge]" | "/blog/[slug]" | "/products/[[...filters]]" | "/products" | "/shop/[...categories]" | "/shop" | "/top" | "/users/[user_id]/[year]/[month]" | "/users/[user_id]" | "/users/[user_id]/posts/[post-id]" | "/about" | "/docs/[...slug]" | "/video/[[...name]]" | "/video" | "/video/[id]";;
}
