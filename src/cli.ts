#!/usr/bin/env bun

import { Command } from "commander";
import { initCommand } from "./commands/init";
import type { IInitOptions } from "./types";

//-------------------- Agentica CLI ----------------------//

const program = new Command();

program
  .name("agentica")
  .description("Spec-driven framework for agent coding")
  .version("0.1.0");

program
  .command("init")
  .description("Initialize Agentica in a project")
  .requiredOption("--stack <type>", "Stack template (e.g., typescript/cli)")
  .option("--name <name>", "Project name (creates new directory)")
  .action(async (options: IInitOptions) =>
  {
    try
    {
      await initCommand(options);
    } catch (error)
    {
      console.error("Error:", error);
      process.exit(1);
    }
  });

program.parse();
