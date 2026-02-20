import { existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const DEFAULT_MARKER_DIRS = ["stacks", "prompts", "templates"];

export function findRepoRoot(
  fromImportMetaUrl: string,
  requiredDirs: string[] = DEFAULT_MARKER_DIRS,
): string
{
  let currentDir = dirname(fileURLToPath(fromImportMetaUrl));

  while (true)
  {
    const hasAllRequiredDirs = requiredDirs.every((dirName) =>
      existsSync(join(currentDir, dirName)),
    );

    if (hasAllRequiredDirs)
    {
      return currentDir;
    }

    const parentDir = dirname(currentDir);
    if (parentDir === currentDir)
    {
      break;
    }

    currentDir = parentDir;
  }

  throw new Error(
    `Не удалось определить корень Agentica. Ожидались директории: ${requiredDirs.join(", ")}`,
  );
}