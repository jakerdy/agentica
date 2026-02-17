import { mkdirSync, existsSync, readdirSync, statSync, copyFileSync } from "fs";
import { join, dirname } from "path";

//-------------------- File System Utils --------------------//

export function ensureDir(dir_path: string): void
{
  if (!existsSync(dir_path))
  {
    mkdirSync(dir_path, { recursive: true });
  }
}

export function fileExists(file_path: string): boolean
{
  return existsSync(file_path);
}

export function copyFile(source_path: string, dest_path: string): void
{
  ensureDir(dirname(dest_path));
  copyFileSync(source_path, dest_path);
}

export function copyDir(source_dir: string, dest_dir: string): void
{
  ensureDir(dest_dir);

  const entries = readdirSync(source_dir);

  for (const entry of entries)
  {
    const source_path = join(source_dir, entry);
    const dest_path = join(dest_dir, entry);
    const stat = statSync(source_path);

    if (stat.isDirectory())
    {
      copyDir(source_path, dest_path);
    } else
    {
      copyFile(source_path, dest_path);
    }
  }
}
