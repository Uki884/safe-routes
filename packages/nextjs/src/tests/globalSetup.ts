import { generateTypes } from "../generator";

export const setup = async () => {
  await generateTypes({
    appDir: "src/fixtures/app",
    pagesDir: "",
    options: {
      outDir: "src/tests/.safe-routes",
      trailingSlash: true,
    },
  });
};
