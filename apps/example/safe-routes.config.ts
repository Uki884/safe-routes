import { createGlobalSearchParams, InferSearchParams, setGlobalSearchParams } from "@safe-routes/nextjs";

export const globalSearchParams = createGlobalSearchParams((p) => ({
  // Add your global search parameters here
  locale: p.enumOr(["en", "ja"], "ja").optional(),
}));

export type GlobalSearchParams = InferSearchParams<typeof globalSearchParams>;

setGlobalSearchParams(globalSearchParams);