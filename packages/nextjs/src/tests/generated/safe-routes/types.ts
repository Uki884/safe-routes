import { createSearchParams } from "@safe-routes/nextjs";
/**
 * Global search parameters that will be applied to all routes
 */
export const $SearchParams = createSearchParams(() => ({
  // Add your global search parameters here
  // locale: p.enumOr(["en", "ja"] as const, "en"),
})).passthrough();
