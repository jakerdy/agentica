import { readdirSync, statSync } from "fs";
import { join } from "path";
import chalk from "chalk";
import { findRepoRoot } from "../utils/repo_root";

//---------------------- Constants -----------------------//

const STACKS_DIR = "stacks";

//--------------------- Public API -----------------------//

export function stacksCommand(): void
{
  const stacks = getAvailableStacks();

  if (stacks.length === 0)
  {
    console.log(chalk.yellow("Доступные шаблоны стеков не найдены."));
    return;
  }

  console.log(chalk.green(`\nДоступные шаблоны стеков [${stacks.length}]:\n`));

  for (const stack of stacks)
  {
    console.log(`  ${stack}`);
  }

  console.log();
  console.log("Используй один из этих шаблонов чтобы проинициализировать проект:");
  console.log("  agentica init typescript/cli");
}

//----------------------- Utils --------------------------//

function getAvailableStacks(): string[]
{
  const repoRoot = findRepoRoot(import.meta.url, [STACKS_DIR]);
  const stacksRoot = join(repoRoot, STACKS_DIR);

  const languages = readDirectoryNames(stacksRoot);
  const stacks: string[] = [];

  for (const language of languages)
  {
    const languagePath = join(stacksRoot, language);
    const stackTypes = readDirectoryNames(languagePath);

    for (const stackType of stackTypes)
    {
      stacks.push(`${language}/${stackType}`);
    }
  }

  return stacks.sort();
}

function readDirectoryNames(directoryPath: string): string[]
{
  const entries = readdirSync(directoryPath, { withFileTypes: true });
  const directories: string[] = [];

  for (const entry of entries)
  {
    if (!entry.isDirectory())
    {
      continue;
    }

    const entryPath = join(directoryPath, entry.name);
    if (!statSync(entryPath).isDirectory())
    {
      continue;
    }

    directories.push(entry.name);
  }

  return directories;
}

