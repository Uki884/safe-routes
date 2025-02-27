import { safeRoute } from "@safe-routes/nextjs";
import Link from "next/link";

export type SearchParams = {
  page: number;
  sort?: "asc" | "desc";
};

export default function HomePage() {
  const userId = safeRoute(
    "/users/[user_id]",
    { userId: 1 },
    { page: 1, sort: "desc" },
  );
  safeRoute(
    "/products/[[...filters]]",
    { filters: ["sort", "page"] },
    { sort: "asc", page: 1 },
  );
  safeRoute("/products", { sort: "asc", page: 1 });
  safeRoute("/", { page: 1 });
  safeRoute("/shop", { isRequired: true, isOptional: 1 });
  safeRoute("/login", { redirect: "https://example.com" });

  return (
    <div>
      <h1>Route Examples</h1>
      <ul>
        <li>
          <Link
            href={safeRoute("/blog/[slug]", { slug: "hello" }, { page: 1 })}
          >
            Dynamic Route
          </Link>
        </li>
        <li>
          <Link
            href={safeRoute(
              "/shop/[...categories]",
              { categories: ["men", "shoes"] },
              { page: 1 },
            )}
          >
            Catch-all Route
          </Link>
        </li>
        <li>
          <Link href={safeRoute("/products", { sort: "asc", page: 1 })}>
            Optional Catch-all
          </Link>
        </li>
        <li>
          <Link
            href={safeRoute(
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
