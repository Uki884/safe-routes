/**
 * Global search parameters that will be applied to all routes
 */
export type GlobalSearchParams = {
  [key: string]: string | number | boolean | (string | number | boolean)[];

  // Add your global search parameters here
  // locale?: string;
};
