import { transformFunctionExports } from "../transformer/transformFunctionExports";
import { transformFunctionShared } from "../transformer/transformFunctionShared";
import { FileContentOption } from "../types";

export const createFileContent = ({
  routes,
  options,
}: FileContentOption): string => {
  const shared = transformFunctionShared();
  const exports = transformFunctionExports({ routes, options });

  return `${shared}\n${exports}`;
};
