import { writeFile } from "fs/promises";

export const writeToFile = async (
  filePath: string,
  content: string,
): Promise<void> => {
  try {
    await writeFile(filePath, content);
  } catch (error) {
    console.error(`Error writing to file ${filePath}:`, error);
    throw error;
  }
};
