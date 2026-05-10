import { readFileSync, writeFileSync, renameSync } from "fs";
import { join } from "path";
import type { TAgentsSectionId } from "../types";
import { fileExists } from "./file_system";

//----------------- AGENTS.md Composer -------------------//

const AGENTS_FILE = "AGENTS.md";
const AGENTS_OLD_FILE = "AGENTS.old.md";
const SECTION_SEPARATOR = "\n\n---\n\n";

const GLOBALS_DIR = "globals";
const ANTI_SPAGHETTI_FILE = "anti-spaghetti.md";
const USE_AGENTICA_FILE = "use-agentica.md";
const DEFAULT_SECTIONS: TAgentsSectionId[] = ["lang", "anti-spaghetti", "use-agentica"];

export function composeAgentsMd(
  repo_root: string,
  target_dir: string,
  lang: string,
  section_ids?: TAgentsSectionId[],
): void
{
  const agents_path = join(target_dir, AGENTS_FILE);
  const agents_old_path = join(target_dir, AGENTS_OLD_FILE);
  const selected_section_ids = normalizeSectionIds(section_ids);

  // Backup existing AGENTS.md if present
  if (fileExists(agents_path))
  {
    renameSync(agents_path, agents_old_path);
  }

  // Read globals files from repo
  const globals_dir = join(repo_root, GLOBALS_DIR);
  const lang_file = `lang-${lang}.md`;

  const section_content_map: Record<TAgentsSectionId, string> = {
    lang: readFileSync(join(globals_dir, lang_file), "utf-8"),
    "anti-spaghetti": readFileSync(
      join(globals_dir, ANTI_SPAGHETTI_FILE),
      "utf-8",
    ),
    "use-agentica": readFileSync(
      join(globals_dir, USE_AGENTICA_FILE),
      "utf-8",
    ),
  };

  const composed_content = selected_section_ids
    .map((section_id) => section_content_map[section_id])
    .join(SECTION_SEPARATOR);

  // Write composed AGENTS.md
  writeFileSync(agents_path, composed_content, "utf-8");
}

function normalizeSectionIds(section_ids?: TAgentsSectionId[]): TAgentsSectionId[]
{
  if (!section_ids || section_ids.length === 0)
  {
    return DEFAULT_SECTIONS;
  }

  const normalized_ids = section_ids.filter((section_id, index) =>
    section_ids.indexOf(section_id) === index,
  );

  return normalized_ids.length > 0 ? normalized_ids : DEFAULT_SECTIONS;
}
