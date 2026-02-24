#!/usr/bin/env bun

import { Command } from "commander";
import { initCommand } from "./commands/init";
import { stacksCommand } from "./commands/stacks";
import type { IInitOptions } from "./types";

//-------------------- Agentica CLI ----------------------//

const program = new Command();

program
  .name("agentica")
  .description("Фреймворк для агентной разработки по спецификациям")
  .version("0.0.11");

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
    const stack = stackArg ?? commandOptions.stack;
    const targetPath = targetPathArg ?? commandOptions.out;

    if (!stack)
    {
      console.error("Ошибка: не указан stack. Используйте init <stack> или --stack <type>.");
      process.exit(1);
    }

    const options: IInitOptions = {
      stack,
      name: targetPath,
    };

    try
    {
      await initCommand(options);
    } catch (error)
    {
      console.error("Ошибка:", error);
      process.exit(1);
    }
  });

program
  .command("stacks")
  .description("Показать доступные шаблоны проектов")
  .action(stacksCommand);

program.parse();
