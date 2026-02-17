import { join, resolve } from "path";
import { writeFileSync } from "fs";
import chalk from "chalk";
import type { IInitOptions, IStackDefinition } from "../types";
import { ensureDir, copyDir, copyFile, fileExists } from "../utils/file_system";
import { updateVSCodeSettings } from "../utils/vscode_config";
import { composeAgentsMd } from "../utils/agents_composer";

//-------------------- Init Command ----------------------//

const AGENTICA_DIR = ".agentica";
const PROMPTS_DIR = "prompts";
const TEMPLATES_DIR = "templates";
const STACKS_DIR = "stacks";

const REQUIRED_SUBDIRS = [
  "prompts",
  "templates",
  "architecture",
  "changes",
  "features",
];

const STACK_FILES = ["product.md", "structure.md", "tech.md"];
const STATUS_FILE = "status.md";

export async function initCommand(options: IInitOptions): Promise<void>
{
  console.log(chalk.blue("\n🚀 Initializing Agentica...\n"));

  // Parse and validate stack
  const stack = parseStack(options.stack);
  if (!stack)
  {
    console.error(
      chalk.red(`❌ Invalid stack format: ${options.stack}`)
    );
    console.error(chalk.yellow("   Expected format: <lang>/<type>"));
    console.error(chalk.yellow("   Examples: typescript/cli, python/gui"));
    process.exit(1);
  }

  // Determine target directory
  const target_dir = options.name
    ? resolve(process.cwd(), options.name)
    : process.cwd();

  // Get repo root (where this CLI is running from)
  const repo_root = getRepoRoot();

  // Validate stack exists in repo
  const stack_dir = join(repo_root, STACKS_DIR, stack.lang, stack.type);
  if (!fileExists(stack_dir))
  {
    console.error(
      chalk.red(`❌ Stack not found: ${stack.lang}/${stack.type}`)
    );
    console.error(chalk.yellow(`   Looked in: ${stack_dir}`));
    process.exit(1);
  }

  // Create project directory if needed
  if (options.name)
  {
    ensureDir(target_dir);
    console.log(chalk.green(`✓ Created directory: ${options.name}`));
  }

  // Create .agentica directory structure
  const agentica_dir = join(target_dir, AGENTICA_DIR);
  ensureDir(agentica_dir);
  console.log(chalk.green(`✓ Created .agentica/`));

  for (const subdir of REQUIRED_SUBDIRS)
  {
    ensureDir(join(agentica_dir, subdir));
  }

  // Copy prompts
  const prompts_source = join(repo_root, PROMPTS_DIR);
  const prompts_dest = join(agentica_dir, PROMPTS_DIR);
  copyDir(prompts_source, prompts_dest);
  console.log(chalk.green(`✓ Copied prompts/`));

  // Copy templates
  const templates_source = join(repo_root, TEMPLATES_DIR);
  const templates_dest = join(agentica_dir, TEMPLATES_DIR);
  copyDir(templates_source, templates_dest);
  console.log(chalk.green(`✓ Copied templates/`));

  // Copy stack template files
  for (const file of STACK_FILES)
  {
    const source_path = join(stack_dir, file);
    const dest_path = join(agentica_dir, file);
    copyFile(source_path, dest_path);
  }
  console.log(
    chalk.green(`✓ Copied stack template: ${stack.lang}/${stack.type}`)
  );

  // Create status.md
  const status_content = createStatusContent(stack);
  const status_path = join(agentica_dir, STATUS_FILE);
  writeFileSync(status_path, status_content, "utf-8");
  console.log(chalk.green(`✓ Created status.md`));

  // Compose AGENTS.md
  composeAgentsMd(repo_root, target_dir, stack.lang);
  console.log(chalk.green(`✓ Composed AGENTS.md`));

  // Update VSCode settings
  try
  {
    updateVSCodeSettings(target_dir);
    console.log(chalk.green(`✓ Updated .vscode/settings.json`));
  } catch (error)
  {
    console.warn(
      chalk.yellow(`⚠ Warning: Could not update VSCode settings: ${error}`)
    );
  }

  // Success message
  console.log(chalk.green.bold("\n✨ Agentica initialized successfully!\n"));
  console.log(chalk.cyan("Next steps:"));
  if (options.name)
  {
    console.log(chalk.white(`  1. cd ${options.name}`));
  }
  console.log(chalk.white("  2. Open in VSCode: code ."));
  console.log(
    chalk.white("  3. Start using agents via chat with .agentica/prompts/")
  );
  console.log();
}

//----------------------- Utils --------------------------//

function parseStack(stack_string: string): IStackDefinition | null
{
  const parts = stack_string.split("/");
  if (parts.length !== 2)
  {
    return null;
  }

  const [lang, type] = parts;
  if (!lang || !type)
  {
    return null;
  }

  return { lang, type };
}

function getRepoRoot(): string
{
  // In production, this will be the installed package location
  // For development, use current directory structure
  return resolve(__dirname, "../..");
}

function createStatusContent(stack: IStackDefinition): string
{
  const date = new Date().toISOString().split("T")[0];

  return `# Agentica Status

## Initialization

- **Date:** ${date}
- **Stack:** ${stack.lang}/${stack.type}
- **Status:** Initialized

## Integration Status

- [ ] Project structure aligned with stack template
- [ ] VSCode workspace configured
- [ ] First feature specification created
- [ ] First implementation completed

## Notes

Add any notes about the integration process here.
`;
}
