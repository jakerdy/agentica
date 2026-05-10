#!/usr/bin/env bun

import { Command } from "commander";
import { createInterface } from "readline/promises";
import { stdin as input, stdout as output } from "process";
import { initCommand } from "./commands/init";
import { safetyCheckCommand } from "./commands/safety_check";
import { stacksCommand } from "./commands/stacks";
import type { IInitOptions, TAgentsSectionId } from "./types";
import { getAvailableStacks } from "./utils/stacks";

//---------------------- Constants -----------------------//

const EXIT_CODE_FAILURE = 1;
const AGENTS_SECTION_OPTIONS: IAgentsSectionOption[] = [
  {
    id: "lang",
    title: "Языковые правила",
    description: "Языковые и стековые соглашения по выбранному стеку",
  },
  {
    id: "anti-spaghetti",
    title: "Анти-спагетти",
    description: "Общие правила структуры и чистоты кода",
  },
  {
    id: "use-agentica",
    title: "Гайд по Agentica",
    description: "Как агентам работать со спеками и артефактами Agentica",
  },
];

//------------------------ Types -------------------------//

interface IAgentsSectionOption
{
  id: TAgentsSectionId;
  title: string;
  description: string;
}

//-------------------- Agentica CLI ----------------------//

const program = new Command();

program
  .name("agentica")
  .description("Фреймворк для агентной разработки по спецификациям")
  .version("0.2.0");

program
  .command("init")
  .description("Инициализировать Agentica в проекте")
  .argument("[stack]", "Шаблон стека (например, typescript/cli)")
  .argument("[targetPath]", "Путь проекта (по умолчанию текущая директория)")
  .option("--stack <type>", "Шаблон стека (альтернатива позиционному аргументу)")
  .option("--out <path>", "Путь проекта (альтернатива targetPath)")
  .action(async (
    stackArg: string | undefined,
    targetPathArg: string | undefined,
    commandOptions: { stack?: string; out?: string },
  ) =>
  {
    const options = await resolveInitOptions(
      stackArg,
      targetPathArg,
      commandOptions,
    );

    try
    {
      await initCommand(options);
    } catch (error)
    {
      console.error("Ошибка:", error);
      process.exit(EXIT_CODE_FAILURE);
    }
  });

program
  .command("stacks")
  .description("Показать доступные шаблоны проектов")
  .action(stacksCommand);

program
  .command("safety-check")
  .description("Проверить staged-изменения на артефакты, секреты и прочие риски")
  .option("--json", "Вывести результат в JSON")
  .option("--allow-empty", "Не считать пустой stage ошибкой")
  .option("--max-file-size-mb <size>", "Порог большого файла в MB", "5")
  .action((commandOptions: { json?: boolean; allowEmpty?: boolean; maxFileSizeMb?: string }) =>
  {
    try
    {
      safetyCheckCommand(commandOptions);
    } catch (error)
    {
      console.error("Ошибка:", error);
      process.exit(1);
    }
  });

program.parse();

//----------------------- Utils -------------------------//

async function resolveInitOptions(
  stack_arg: string | undefined,
  target_path_arg: string | undefined,
  command_options: { stack?: string; out?: string },
): Promise<IInitOptions>
{
  const stack = stack_arg ?? command_options.stack;
  const target_path = target_path_arg ?? command_options.out;

  if (stack)
  {
    return {
      stack,
      name: target_path,
    };
  }

  if (!process.stdin.isTTY || !process.stdout.isTTY)
  {
    console.error(
      "Ошибка: не указан stack. Используйте init <stack> или запустите команду в интерактивном терминале.",
    );
    process.exit(EXIT_CODE_FAILURE);
  }

  return await promptInitOptions();
}

async function promptInitOptions(): Promise<IInitOptions>
{
  const stacks = getAvailableStacks();

  if (stacks.length === 0)
  {
    console.error("Ошибка: не удалось найти доступные шаблоны стеков.");
    process.exit(EXIT_CODE_FAILURE);
  }

  const rl = createInterface({ input, output });

  try
  {
    console.log("\nПошаговая инициализация Agentica\n");

    const stack = await promptStackSelection(rl, stacks);
    const target_path = await promptTargetPath(rl);
    const agents_sections = await promptAgentsSections(rl, stack);

    console.log("\nБудет выполнено:");
    console.log(`  stack: ${stack}`);
    console.log(`  target: ${target_path || "."}`);
    console.log(`  AGENTS.md: ${formatSectionSummary(agents_sections, stack)}`);

    return {
      stack,
      name: target_path || undefined,
      agents_sections,
    };
  } finally
  {
    rl.close();
  }
}

async function promptStackSelection(
  rl: ReturnType<typeof createInterface>,
  stacks: string[],
): Promise<string>
{
  console.log("Шаг 1/3. Выбери стек:");

  for (const [index, stack] of stacks.entries())
  {
    console.log(`  ${index + 1}. ${stack}`);
  }

  while (true)
  {
    const answer = await rl.question("Номер стека: ");
    const selected_index = Number(answer.trim());

    if (Number.isInteger(selected_index) && selected_index >= 1 && selected_index <= stacks.length)
    {
      return stacks[selected_index - 1] as string;
    }

    console.log("Введите номер из списка.");
  }
}

async function promptTargetPath(
  rl: ReturnType<typeof createInterface>,
): Promise<string>
{
  console.log("\nШаг 2/3. Куда инициализировать проект?");
  console.log("Нажми Enter, чтобы использовать текущую директорию.");

  const answer = await rl.question("Путь проекта: ");
  return answer.trim();
}

async function promptAgentsSections(
  rl: ReturnType<typeof createInterface>,
  stack: string,
): Promise<TAgentsSectionId[]>
{
  console.log("\nШаг 3/3. Что включить в AGENTS.md?");

  for (const [index, section] of AGENTS_SECTION_OPTIONS.entries())
  {
    const title = section.id === "lang"
      ? `${section.title} (${stack.split("/")[0]})`
      : section.title;
    console.log(`  ${index + 1}. ${title} - ${section.description}`);
  }

  console.log("По умолчанию будут включены все секции.");

  while (true)
  {
    const answer = await rl.question("Номера секций через запятую: ");
    const trimmed_answer = answer.trim();

    if (trimmed_answer.length === 0)
    {
      return AGENTS_SECTION_OPTIONS.map((section) => section.id);
    }

    const selected_ids = parseSectionSelection(trimmed_answer);
    if (selected_ids.length > 0)
    {
      return selected_ids;
    }

    console.log("Введите номера секций через запятую, например: 1,2,3");
  }
}

function parseSectionSelection(answer: string): TAgentsSectionId[]
{
  const selected_numbers = answer
    .split(",")
    .map((part) => Number(part.trim()))
    .filter((value) => Number.isInteger(value));

  if (selected_numbers.length === 0)
  {
    return [];
  }

  const selected_ids: TAgentsSectionId[] = [];

  for (const selected_number of selected_numbers)
  {
    const section = AGENTS_SECTION_OPTIONS[selected_number - 1];
    if (!section || selected_ids.includes(section.id))
    {
      continue;
    }

    selected_ids.push(section.id);
  }

  return selected_ids;
}

function formatSectionSummary(
  section_ids: TAgentsSectionId[],
  stack: string,
): string
{
  const lang = stack.split("/")[0] ?? "unknown";

  return section_ids
    .map((section_id) =>
    {
      if (section_id === "lang")
      {
        return `языковые правила (${lang})`;
      }

      if (section_id === "anti-spaghetti")
      {
        return "анти-спагетти";
      }

      return "гайд по Agentica";
    })
    .join(", ");
}
