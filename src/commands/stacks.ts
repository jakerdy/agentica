import chalk from "chalk";
import { getAvailableStacks } from "../utils/stacks";

//---------------------- Constants -----------------------//

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

