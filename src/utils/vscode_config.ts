import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { ensureDir, fileExists } from "./file_system";
import type { IVSCodeSettings } from "../types";

//----------------- VSCode Config Utils ------------------//

const VSCODE_DIR = ".vscode";
const SETTINGS_FILE = "settings.json";
const AGENTICA_PROMPTS_PATH = ".agentica/prompts";
const AGENTICA_SKILLS_PATH = ".agentica/skills";

export function updateVSCodeSettings(target_dir: string): void
{
  const vscode_dir = join(target_dir, VSCODE_DIR);
  const settings_path = join(vscode_dir, SETTINGS_FILE);

  ensureDir(vscode_dir);

  let settings: IVSCodeSettings = {};

  if (fileExists(settings_path))
  {
    const content = readFileSync(settings_path, "utf-8");
    try
    {
      settings = JSON.parse(content) as IVSCodeSettings;
    } catch (error)
    {
      throw new Error(`Invalid JSON in ${settings_path}: ${error}`);
    }
  }

  // Ensure chat.promptFilesLocations exists as an object
  settings["chat.promptFilesLocations"] ??= {};
  settings["chat.promptFilesLocations"][AGENTICA_PROMPTS_PATH] = true;

  // Ensure chat.agentSkillsLocations exists as an object
  settings["chat.agentSkillsLocations"] ??= {};
  settings["chat.agentSkillsLocations"][AGENTICA_SKILLS_PATH] = true;

  // Write back with formatting
  const formatted_json = JSON.stringify(settings, null, 2);
  writeFileSync(settings_path, formatted_json, "utf-8");
}
