import { join, resolve } from "path";
import { writeFileSync } from "fs";
import chalk from "chalk";
import type { IInitOptions, IStackDefinition } from "../types";
import { ensureDir, copyDir, copyFile, fileExists } from "../utils/file_system";
import { updateVSCodeExtensions, updateVSCodeSettings } from "../utils/vscode_config";
import { composeAgentsMd } from "../utils/agents_composer";

//---------------------- Constants -----------------------//

const AGENTICA_DIR = ".agentica";
const PROMPTS_DIR = "prompts";
const TEMPLATES_DIR = "templates";
const SKILLS_DIR = "skills";
const STACKS_DIR = "stacks";
const STATUS_FILE = "status.md";
const EXIT_CODE_FAILURE = 1;

const REQUIRED_SUBDIRS = [
  "prompts",
  "templates",
  "architecture",
  "changes",
  "features",
];

const STACK_FILES = ["product.md", "structure.md", "tech.md"];

//--------------------- Public API -----------------------//

export async function initCommand(options: IInitOptions): Promise<void>
{
  console.log(chalk.blue("\n🚀 Инициализация Agentica...\n"));

  const stack = parseStack(options.stack);
  if (!stack)
  {
    exitForInvalidStack(options.stack);
  }

  const processor = new InitProcessor(options, stack);
  await processor.execute();
}

//-------------------- Init Processor --------------------//

class InitProcessor
{
  private readonly repoRoot: string;
  private readonly targetDir: string;
  private readonly stackDir: string;
  private readonly agenticaDir: string;

  constructor(
    private readonly options: IInitOptions,
    private readonly stack: IStackDefinition,
  )
  {
    this.repoRoot = getRepoRoot();
    this.targetDir = this.options.name
      ? resolve(process.cwd(), this.options.name)
      : process.cwd();
    this.stackDir = join(this.repoRoot, STACKS_DIR, this.stack.lang, this.stack.type);
    this.agenticaDir = join(this.targetDir, AGENTICA_DIR);
  }

  async execute(): Promise<void>
  {
    this.ensureStackExists();
    this.createProjectDirIfNeeded();
    this.createAgenticaDirectories();
    this.copyPrompts();
    this.copyTemplates();
    this.copySkills();
    this.copyStackTemplateFiles();
    this.createStatusFile();
    this.composeAgentsFile();
    this.updateVSCodeConfiguration();
    this.printSuccessMessage();
  }

  private ensureStackExists(): void
  {
    if (fileExists(this.stackDir))
    {
      return;
    }

    console.error(chalk.red(`❌ Стек не найден: ${this.stack.lang}/${this.stack.type}`));
    console.error(chalk.yellow(`   Путь проверки: ${this.stackDir}`));
    process.exit(EXIT_CODE_FAILURE);
  }

  private createProjectDirIfNeeded(): void
  {
    if (!this.options.name)
    {
      return;
    }

    ensureDir(this.targetDir);
    console.log(chalk.green(`✓ Создана директория: ${this.options.name}`));
  }

  private createAgenticaDirectories(): void
  {
    ensureDir(this.agenticaDir);
    console.log(chalk.green(`✓ Создана .agentica/`));

    for (const subdir of REQUIRED_SUBDIRS)
    {
      ensureDir(join(this.agenticaDir, subdir));
    }
  }

  private copyPrompts(): void
  {
    const promptsSource = join(this.repoRoot, PROMPTS_DIR);
    const promptsDestination = join(this.agenticaDir, PROMPTS_DIR);

    copyDir(promptsSource, promptsDestination);
    console.log(chalk.green(`✓ Скопирована prompts/`));
  }

  private copyTemplates(): void
  {
    const templatesSource = join(this.repoRoot, TEMPLATES_DIR);
    const templatesDestination = join(this.agenticaDir, TEMPLATES_DIR);

    copyDir(templatesSource, templatesDestination);
    console.log(chalk.green(`✓ Скопирована templates/`));
  }

  private copySkills(): void
  {
    const skillsSource = join(this.repoRoot, SKILLS_DIR);
    const skillsDestination = join(this.agenticaDir, SKILLS_DIR);

    copyDir(skillsSource, skillsDestination);
    console.log(chalk.green(`✓ Скопирована skills/`));
  }

  private copyStackTemplateFiles(): void
  {
    for (const file of STACK_FILES)
    {
      const sourcePath = join(this.stackDir, file);
      const destinationPath = join(this.agenticaDir, file);
      copyFile(sourcePath, destinationPath);
    }

    console.log(chalk.green(`✓ Скопирован шаблон стека: ${this.stack.lang}/${this.stack.type}`));
  }

  private createStatusFile(): void
  {
    const statusContent = createStatusContent(this.stack);
    const statusPath = join(this.agenticaDir, STATUS_FILE);

    writeFileSync(statusPath, statusContent, "utf-8");
    console.log(chalk.green(`✓ Создан status.md`));
  }

  private composeAgentsFile(): void
  {
    composeAgentsMd(this.repoRoot, this.targetDir, this.stack.lang);
    console.log(chalk.green(`✓ Сформирован AGENTS.md`));
  }

  private updateVSCodeConfiguration(): void
  {
    try
    {
      updateVSCodeSettings(this.targetDir);
      updateVSCodeExtensions(this.targetDir);
      console.log(chalk.green(`✓ Обновлён .vscode/settings.json`));
      console.log(chalk.green(`✓ Обновлён .vscode/extensions.json`));
    } catch (error)
    {
      console.warn(chalk.yellow(`⚠ Предупреждение: не удалось обновить настройки VSCode: ${error}`));
    }
  }

  private printSuccessMessage(): void
  {
    console.log(chalk.green.bold("\n✨ Agentica успешно инициализирована!\n"));
    console.log(chalk.cyan("Следующие шаги:"));

    if (this.options.name)
    {
      console.log(chalk.white(`  1. cd ${this.options.name}`));
    }

    console.log(chalk.white("  2. Открой проект в VSCode: code ."));
    console.log(chalk.white(`  3. Начни с промпта /agentica.init d чате Copilot:
    - Опиши свой проект, и стек технологий (после команды)
    - Agentica подстроится под твои нужды
    - А дальще можно запускать /agentica.create или /agentica.change
    - И обязательно прочитай и донастрой AGENTS.md
    `));
  }
}

//----------------------- Utils -------------------------//

function exitForInvalidStack(stackInput: string): never
{
  console.error(chalk.red(`❌ Неверный формат стека: ${stackInput}`));
  console.error(chalk.yellow("   Ожидаемый формат: <lang>/<type>"));
  console.error(chalk.yellow("   Примеры: typescript/cli, python/gui"));
  process.exit(EXIT_CODE_FAILURE);
}

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

  return `# Статус Agentica

## Инициализация

- **Дата:** ${date}
- **Стек:** ${stack.lang}/${stack.type}
- **Статус:** Инициализировано

## Статус интеграции

- [ ] Структура проекта приведена к шаблону стека
- [ ] Рабочее пространство VSCode настроено
- [ ] Создана первая спецификация фичи
- [ ] Завершена первая реализация

## Заметки

Добавьте здесь заметки о процессе интеграции.
`;
}
