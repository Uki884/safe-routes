
import { createSearchParams, InferSearchParams } from "@safe-routes/nextjs";
/**
 * Global search parameters that will be applied to all routes
 */
const SearchParams = createSearchParams(() => ({
  // Add your global search parameters here
  // locale: p.enumOr(["en", "ja"] as const, "en"),
}));

export type SearchParams = InferSearchParams<typeof SearchParams>;
