import { $path } from "@safe-routes/nextjs";

export const Child = () => {
  $path("/login", { redirect: '/'}); // /login?redirect=/
  return <div>Child</div>;
};
