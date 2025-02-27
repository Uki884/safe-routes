import { safeRoute } from "@safe-routes/nextjs";

export type SearchParams = {
  locale: "en";
};

export default function AboutPage() {
  console.log(safeRoute("/about", { locale: "en" }));
  return <h1>About Page</h1>;
}
