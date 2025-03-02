import {
  InferSearchParams,
  createSearchParams,
  parseSearchParams,
} from "@safe-routes/nextjs";

const SearchParams = createSearchParams((q) => ({
  page: q.numberOr(1),
  sort: q.enumOr(["asc", "desc"] as const, "asc"),
}));

export type SearchParams = InferSearchParams<typeof SearchParams>;

export default async function UsersUserIdPage({
  params,
  searchParams,
}: {
  params: {
    userId: string;
  };
  searchParams: Promise<SearchParams>;
}) {
  const parsedSearchParams = parseSearchParams(
    SearchParams,
    await searchParams
  );
  console.log(parsedSearchParams);
  return <h1>Users UserId Page</h1>;
}
