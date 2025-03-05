export const createSafeRoute = () => {
  return `export type SafeRouteParams<T extends SafeRoutePath> = (typeof safeRoutes)[T]['params'];
export type SafeRouteSearchParams<T extends SafeRoutePath> = (typeof safeRoutes)[T]['searchParams'];
export type SafeRoutes = typeof safeRoutes;

type IsAllOptional<T> = { [K in keyof T]?: unknown } extends T ? true : false;
type HasSearchParams<T> = T extends { searchParams: undefined } ? false : true;
type HasParams<T> = T extends Record<string, never> ? false : true;
type PickSearchParams<T extends SafeRoutePath> = Pick<typeof safeRoutes[T], 'searchParams'>;
type IsSearchParams<T> = symbol extends keyof T ? false : true;
type ExportedQuery<T> = IsSearchParams<T> extends true ? T & GlobalSearchParams : GlobalSearchParams;`;
};
