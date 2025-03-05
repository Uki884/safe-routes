import {
  $path,
  InferSearchParams,
  createSearchParams,
  parseSearchParams,
} from "@safe-routes/nextjs";

import Link from "next/link";

const SearchParams = createSearchParams(
  ({ numberOr, enumOr, stringOr }) => ({
    page: numberOr(2),
    sort: enumOr(["asc", "desc"] as const, "asc"),
    q: stringOr("sss"),
  })
)

export type SearchParams = InferSearchParams<typeof SearchParams>;

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = parseSearchParams(SearchParams, await searchParams);

  const userId = $path(
    "/users/[user_id]",
    { userId: 1 },
    { page: 1, sort: "asc", locale: "ja" },
  );
  $path(
    "/products/[[...filters]]",
    { filters: ["sort", "page"] },
    { sort: "asc", page: 1 },
  );
  $path("/products", { sort: "asc", page: 1, locale: "ja" });
  $path("/shop", { isRequired: true, isOptional: 1, locale: "ja" });
  $path("/login", { redirect: "https://example.com", locale: "ja" });

  return (
    <div>
      <h1>Route Examples</h1>
      {JSON.stringify(params)}
      <ul>
        <li>
          <Link
            href={$path("/top", { page: 1, sort: "desc", q: "", test: "a" })}
          >
            Top
          </Link>
        </li>
        <li>
          <Link href={$path("/blog/[slug]", { slug: "hello" }, { page: 1 })}>
            Dynamic Route
          </Link>
        </li>
        <li>
          <Link
            href={$path(
              "/shop/[...categories]",
              { categories: ["men", "shoes"] },
              { page: 1 },
            )}
          >
            Catch-all Route
          </Link>
        </li>
        <li>
          <Link href={$path("/products", { sort: "asc", page: 1 })}>
            Optional Catch-all
          </Link>
        </li>
        <li>
          <Link
            href={$path(
              "/users/[user_id]/posts/[post-id]",
              { userId: "123", postId: "11" },
              { page: 1 },
            )}
          >
            Multiple Dynamic Segments
          </Link>
        </li>
      </ul>
    </div>
  );
}
