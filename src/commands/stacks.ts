import { readdirSync, statSync } from "fs";
import { join, resolve } from "path";
import chalk from "chalk";

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
  const repoRoot = getRepoRoot();
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

function getRepoRoot(): string
{
  return resolve(__dirname, "../..");
}
