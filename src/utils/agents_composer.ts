import { readFileSync, writeFileSync, renameSync } from "fs";
import { join } from "path";
import { fileExists } from "./file_system";

//----------------- AGENTS.md Composer -------------------//

const AGENTS_FILE = "AGENTS.md";
const AGENTS_OLD_FILE = "AGENTS.old.md";
const SECTION_SEPARATOR = "\n\n---\n\n";

const GLOBALS_DIR = "globals";
const ANTI_SPAGHETTI_FILE = "anti-spaghetti.md";
const USE_AGENTICA_FILE = "use-agentica.md";

export function composeAgentsMd(
  repo_root: string,
  lang: string
): void
{
  const agents_path = join(repo_root, AGENTS_FILE);
  const agents_old_path = join(repo_root, AGENTS_OLD_FILE);

  // Backup existing AGENTS.md if present
  if (fileExists(agents_path))
  {
    renameSync(agents_path, agents_old_path);
  }

  // Read globals files from repo
  const globals_dir = join(repo_root, GLOBALS_DIR);
  const lang_file = `lang-${lang}.md`;

  const lang_content = readFileSync(join(globals_dir, lang_file), "utf-8");
  const anti_spaghetti_content = readFileSync(
    join(globals_dir, ANTI_SPAGHETTI_FILE),
    "utf-8"
  );
  const use_agentica_content = readFileSync(
    join(globals_dir, USE_AGENTICA_FILE),
    "utf-8"
  );

  // Compose in order: lang -> anti-spaghetti -> use-agentica
  const composed_content = [
    lang_content,
    anti_spaghetti_content,
    use_agentica_content,
  ].join(SECTION_SEPARATOR);

  // Write composed AGENTS.md
  writeFileSync(agents_path, composed_content, "utf-8");
}
