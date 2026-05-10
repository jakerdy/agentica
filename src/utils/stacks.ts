import { readdirSync, statSync } from "fs";
import { join } from "path";
import { findRepoRoot } from "./repo_root";

//---------------------- Constants -----------------------//

const STACKS_DIR = "stacks";

//--------------------- Public API -----------------------//

export function getAvailableStacks(): string[]
{
  const repo_root = findRepoRoot(import.meta.url, [STACKS_DIR]);
  const stacks_root = join(repo_root, STACKS_DIR);

  const languages = readDirectoryNames(stacks_root);
  const stacks: string[] = [];

  for (const language of languages)
  {
    const language_path = join(stacks_root, language);
    const stack_types = readDirectoryNames(language_path);

    for (const stack_type of stack_types)
    {
      stacks.push(`${language}/${stack_type}`);
    }
  }

  return stacks.sort();
}

//----------------------- Utils --------------------------//

function readDirectoryNames(directory_path: string): string[]
{
  const entries = readdirSync(directory_path, { withFileTypes: true });
  const directories: string[] = [];

  for (const entry of entries)
  {
    if (!entry.isDirectory())
    {
      continue;
    }

    const entry_path = join(directory_path, entry.name);
    if (!statSync(entry_path).isDirectory())
    {
      continue;
    }

    directories.push(entry.name);
  }

  return directories;
}