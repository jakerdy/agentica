import { spawnSync } from "child_process";
import { existsSync, statSync } from "fs";
import { extname, resolve } from "path";
import chalk from "chalk";

//---------------------- Constants -----------------------//

const EXIT_CODE_FAILURE = 1;
const DEFAULT_MAX_FILE_SIZE_MB = 5;

const SUSPICIOUS_EXTENSIONS = new Set([
  ".exe",
  ".dll",
  ".dylib",
  ".so",
  ".a",
  ".o",
  ".obj",
  ".class",
  ".jar",
  ".war",
  ".pyc",
  ".pyo",
  ".pyd",
  ".msi",
  ".dmg",
  ".apk",
  ".ipa",
  ".deb",
  ".rpm",
  ".bin",
  ".dat",
  ".zip",
  ".tar",
  ".tgz",
  ".gz",
  ".7z",
  ".rar",
]);

const SUSPICIOUS_DIRECTORIES = new Set([
  "dist",
  "build",
  "coverage",
  ".cache",
  ".turbo",
  ".next",
  "tmp",
  "temp",
  "out",
]);

const COMMON_ASSET_EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".svg",
  ".webp",
  ".avif",
  ".ico",
  ".pdf",
  ".mp3",
  ".wav",
  ".ogg",
  ".flac",
  ".mp4",
  ".webm",
]);

const ASSET_DIRECTORIES = new Set([
  "assets",
  "static",
  "public",
  "media",
]);

const SECRET_RULES: IPatternRule[] = [
  { name: "AWS access key", pattern: /AKIA[0-9A-Z]{16}/ },
  { name: "GitHub token", pattern: /gh[pousr]_[A-Za-z0-9_]{20,}/i },
  { name: "OpenAI key", pattern: /sk-[A-Za-z0-9]{20,}/i },
  { name: "Private key", pattern: /-----BEGIN [A-Z ]*PRIVATE KEY-----/ },
  {
    name: "Credential assignment",
    pattern: /(?:api[_-]?key|secret|token|password|passwd|pwd|connection[_-]?string)\s*[:=]\s*["']?[A-Za-z0-9+/_\-=]{8,}/i,
  },
  {
    name: "Bearer token",
    pattern: /bearer\s+[A-Za-z0-9._\-+/=]{12,}/i,
  },
];

const NSFW_RULES: IPatternRule[] = [
  {
    name: "English profanity",
    pattern: /\b(?:fuck|shit|bitch|asshole|wtf|motherfucker)\b/i,
  },
  {
    name: "Russian profanity",
    pattern: /(?:\b(?:бля|бляд|хер|нахер|пизд|ебан|ёбан|сука)\w*)/i,
  },
];

//------------------------ Types ------------------------//

interface ISafetyCheckOptions
{
  json?: boolean;
  allowEmpty?: boolean;
  maxFileSizeMb?: string;
}

interface INormalizedOptions
{
  json: boolean;
  allowEmpty: boolean;
  maxFileSizeMb: number;
}

interface IStagedEntry
{
  status: string;
  path: string;
}

interface IPatternRule
{
  name: string;
  pattern: RegExp;
}

interface IIssue
{
  kind: "empty-stage" | "artifact" | "secret" | "nsfw";
  filePath?: string;
  line?: number;
  rule: string;
  message: string;
  snippet?: string;
}

interface ISafetyCheckResult
{
  ok: boolean;
  checkedAt: string;
  stagedEntries: IStagedEntry[];
  issues: IIssue[];
}

interface IDiffLineContext
{
  filePath: string;
  line: number;
  content: string;
}

interface IRuleMatchContext
{
  line: IDiffLineContext;
  rule: IPatternRule;
}

//--------------------- Public API ----------------------//

export function safetyCheckCommand(rawOptions: ISafetyCheckOptions): void
{
  const options = normalizeOptions(rawOptions);
  const checker = new SafetyChecker(process.cwd(), options);
  const result = checker.run();

  if (options.json)
  {
    console.log(JSON.stringify(result, null, 2));
  } else
  {
    printTextReport(result, options.maxFileSizeMb);
  }

  if (!result.ok)
  {
    process.exit(EXIT_CODE_FAILURE);
  }
}

//-------------------- Safety Checker -------------------//

class SafetyChecker
{
  constructor(
    private readonly cwd: string,
    private readonly options: INormalizedOptions,
  )
  {
  }

  run(): ISafetyCheckResult
  {
    this.ensureGitRepository();

    const stagedEntries = this.getStagedEntries();
    const issues: IIssue[] = [];

    if (stagedEntries.length === 0 && !this.options.allowEmpty)
    {
      issues.push({
        kind: "empty-stage",
        rule: "staged-changes",
        message: "В индексе нет изменений. Сначала добавь файлы в stage.",
      });
    }

    issues.push(...this.findArtifactIssues(stagedEntries));
    issues.push(...this.findPatternIssues(SECRET_RULES, "secret"));
    issues.push(...this.findPatternIssues(NSFW_RULES, "nsfw"));

    return {
      ok: issues.length === 0,
      checkedAt: new Date().toISOString(),
      stagedEntries,
      issues,
    };
  }

  private ensureGitRepository(): void
  {
    const result = this.runGitCommand(["rev-parse", "--is-inside-work-tree"]);
    if (!result.ok || result.stdout.trim() !== "true")
    {
      throw new Error("Текущая директория не является git-репозиторием.");
    }
  }

  private getStagedEntries(): IStagedEntry[]
  {
    const result = this.runGitCommand([
      "diff",
      "--cached",
      "--name-status",
      "--find-renames",
      "-z",
    ]);

    if (!result.ok)
    {
      throw new Error(result.stderr || "Не удалось получить staged-изменения.");
    }

    const chunks = result.stdout.split("\u0000").filter(Boolean);
    const entries: IStagedEntry[] = [];

    for (let index = 0; index < chunks.length; index += 1)
    {
      const status = chunks[index];
      if (!status)
      {
        continue;
      }

      const code = status[0] ?? "M";
      if (code === "R" || code === "C")
      {
        const nextPath = chunks[index + 2];
        if (nextPath)
        {
          entries.push({ status, path: normalizeGitPath(nextPath) });
        }
        index += 2;
        continue;
      }

      const nextPath = chunks[index + 1];
      if (nextPath)
      {
        entries.push({ status, path: normalizeGitPath(nextPath) });
      }
      index += 1;
    }

    return entries;
  }

  private findArtifactIssues(stagedEntries: IStagedEntry[]): IIssue[]
  {
    const issues: IIssue[] = [];

    for (const entry of stagedEntries)
    {
      if (entry.status.startsWith("D"))
      {
        continue;
      }

      const lowerPath = entry.path.toLowerCase();
      const extension = extname(lowerPath);

      if (SUSPICIOUS_EXTENSIONS.has(extension))
      {
        issues.push({
          kind: "artifact",
          filePath: entry.path,
          rule: `suspicious-extension:${extension}`,
          message: "Файл похож на бинарный артефакт или архив.",
        });
      }

      if (isInsideSuspiciousDirectory(lowerPath))
      {
        issues.push({
          kind: "artifact",
          filePath: entry.path,
          rule: "suspicious-directory",
          message: "Файл находится в build/temp директории и требует ручной проверки.",
        });
      }

      const absolutePath = resolve(this.cwd, entry.path);
      if (!existsSync(absolutePath))
      {
        continue;
      }

      if (this.isLargeUnexpectedFile(entry.path, absolutePath))
      {
        issues.push({
          kind: "artifact",
          filePath: entry.path,
          rule: `large-file>${this.options.maxFileSizeMb}MB`,
          message: `Файл превышает ${this.options.maxFileSizeMb} MB и не похож на типичный ассет проекта.`,
        });
      }
    }

    return dedupeIssues(issues);
  }

  private isLargeUnexpectedFile(filePath: string, absolutePath: string): boolean
  {
    const stats = statSync(absolutePath);
    const maxFileSizeBytes = this.options.maxFileSizeMb * 1024 * 1024;
    if (stats.size <= maxFileSizeBytes)
    {
      return false;
    }

    return !isLikelyProjectAsset(filePath);
  }

  private findPatternIssues(rules: IPatternRule[], kind: IIssue["kind"]): IIssue[]
  {
    const addedLines = this.getAddedLines();
    const issues: IIssue[] = [];

    for (const line of addedLines)
    {
      for (const rule of rules)
      {
        const matchContext: IRuleMatchContext = { line, rule };

        if (!rule.pattern.test(line.content) || shouldIgnoreRuleMatch(matchContext, kind))
        {
          continue;
        }

        issues.push({
          kind,
          filePath: line.filePath,
          line: line.line,
          rule: rule.name,
          message: kind === "secret"
            ? "Найдён потенциальный секрет в staged diff."
            : "Найдена потенциально неуместная фраза в staged diff.",
          snippet: sanitizeSnippet(line.content),
        });
      }
    }

    return dedupeIssues(issues);
  }

  private getAddedLines(): IDiffLineContext[]
  {
    const result = this.runGitCommand([
      "diff",
      "--cached",
      "--unified=0",
      "--no-color",
      "--no-ext-diff",
      "--text",
    ]);

    if (!result.ok)
    {
      throw new Error(result.stderr || "Не удалось прочитать staged diff.");
    }

    const lines = result.stdout.split(/\r?\n/);
    const additions: IDiffLineContext[] = [];

    let currentFilePath: string | null = null;
    let currentLineNumber = 0;

    for (const line of lines)
    {
      if (line.startsWith("+++ b/"))
      {
        currentFilePath = normalizeGitPath(line.slice(6));
        continue;
      }

      const hunkMatch = /^@@ -\d+(?:,\d+)? \+(\d+)(?:,(\d+))? @@/.exec(line);
      if (hunkMatch)
      {
        currentLineNumber = Number.parseInt(hunkMatch[1] ?? "0", 10);
        continue;
      }

      if (!currentFilePath)
      {
        continue;
      }

      if (line.startsWith("+") && !line.startsWith("+++"))
      {
        additions.push({
          filePath: currentFilePath,
          line: currentLineNumber,
          content: line.slice(1),
        });
        currentLineNumber += 1;
        continue;
      }

      if (line.startsWith(" "))
      {
        currentLineNumber += 1;
      }
    }

    return additions;
  }

  private runGitCommand(args: string[]): { ok: boolean; stdout: string; stderr: string }
  {
    const result = spawnSync("git", args, {
      cwd: this.cwd,
      encoding: "utf-8",
      windowsHide: true,
    });

    return {
      ok: result.status === 0,
      stdout: result.stdout ?? "",
      stderr: result.stderr ?? "",
    };
  }
}

//----------------------- Output ------------------------//

function printTextReport(result: ISafetyCheckResult, maxFileSizeMb: number): void
{
  const title = result.ok
    ? chalk.green("✓ Safety check пройден")
    : chalk.red("✗ Safety check обнаружил риски");

  console.log(title);
  console.log(chalk.gray(`Проверено staged paths: ${result.stagedEntries.length}`));

  if (result.ok)
  {
    console.log(chalk.green("Подозрительных артефактов, секретов и неуместных фраз не найдено."));
    return;
  }

  const groupedIssues = groupIssues(result.issues);

  if (groupedIssues["empty-stage"]?.length)
  {
    console.log();
    console.log(chalk.yellow("Пустой stage:"));
    for (const issue of groupedIssues["empty-stage"])
    {
      console.log(`  - ${issue.message}`);
    }
  }

  if (groupedIssues.artifact?.length)
  {
    console.log();
    console.log(chalk.yellow("Подозрительные файлы:"));
    for (const issue of groupedIssues.artifact)
    {
      console.log(`  - ${issue.filePath}: ${issue.message} [${issue.rule}]`);
    }
  }

  if (groupedIssues.secret?.length)
  {
    console.log();
    console.log(chalk.yellow("Потенциальные секреты:"));
    for (const issue of groupedIssues.secret)
    {
      console.log(`  - ${issue.filePath}:${issue.line}: ${issue.message} [${issue.rule}]`);
      if (issue.snippet)
      {
        console.log(`    ${chalk.gray(issue.snippet)}`);
      }
    }
  }

  if (groupedIssues.nsfw?.length)
  {
    console.log();
    console.log(chalk.yellow("Потенциально неуместные фразы:"));
    for (const issue of groupedIssues.nsfw)
    {
      console.log(`  - ${issue.filePath}:${issue.line}: ${issue.message} [${issue.rule}]`);
      if (issue.snippet)
      {
        console.log(`    ${chalk.gray(issue.snippet)}`);
      }
    }
  }

  console.log();
  console.log(chalk.cyan("Что делать дальше:"));
  console.log("  1. Убери лишние файлы из stage или обнови .gitignore.");
  console.log("  2. Замаскируй секреты и замени неуместные формулировки.");
  console.log(`  3. Повтори проверку: agentica safety-check --max-file-size-mb ${maxFileSizeMb}`);
}

//------------------------ Utils ------------------------//

function normalizeOptions(rawOptions: ISafetyCheckOptions): INormalizedOptions
{
  const maxFileSizeMb = rawOptions.maxFileSizeMb
    ? Number.parseFloat(rawOptions.maxFileSizeMb)
    : DEFAULT_MAX_FILE_SIZE_MB;

  if (!Number.isFinite(maxFileSizeMb) || maxFileSizeMb <= 0)
  {
    throw new Error("Опция --max-file-size-mb должна быть положительным числом.");
  }

  return {
    json: rawOptions.json ?? false,
    allowEmpty: rawOptions.allowEmpty ?? false,
    maxFileSizeMb,
  };
}

function normalizeGitPath(filePath: string): string
{
  return filePath.replaceAll("\\", "/");
}

function isInsideSuspiciousDirectory(filePath: string): boolean
{
  const segments = filePath.split("/");
  return segments.some((segment) => SUSPICIOUS_DIRECTORIES.has(segment));
}

function isLikelyProjectAsset(filePath: string): boolean
{
  const lowerPath = filePath.toLowerCase();
  const extension = extname(lowerPath);
  const segments = lowerPath.split("/");

  return COMMON_ASSET_EXTENSIONS.has(extension)
    && segments.some((segment) => ASSET_DIRECTORIES.has(segment));
}

function sanitizeSnippet(snippet: string): string
{
  const masked = snippet
    .replaceAll(/([A-Za-z0-9_\-]{3})[A-Za-z0-9_\-]{4,}/g, "$1***")
    .replaceAll(/([=:]\s*["']?)([^"'\s]{4,})/g, "$1***");

  return masked.length > 160
    ? `${masked.slice(0, 157)}...`
    : masked;
}

function shouldIgnoreRuleMatch(
  context: IRuleMatchContext,
  kind: IIssue["kind"],
): boolean
{
  if (kind !== "nsfw")
  {
    return false;
  }

  const trimmedLine = context.line.content.trim();
  if (!trimmedLine.startsWith("pattern:"))
  {
    return false;
  }

  return context.line.filePath === "src/commands/safety_check.ts";
}

function dedupeIssues(issues: IIssue[]): IIssue[]
{
  const seen = new Set<string>();
  const deduped: IIssue[] = [];

  for (const issue of issues)
  {
    const key = [issue.kind, issue.filePath, issue.line, issue.rule, issue.message].join("::");
    if (seen.has(key))
    {
      continue;
    }

    seen.add(key);
    deduped.push(issue);
  }

  return deduped;
}

function groupIssues(issues: IIssue[]): Record<IIssue["kind"], IIssue[]>
{
  return {
    "empty-stage": issues.filter((issue) => issue.kind === "empty-stage"),
    artifact: issues.filter((issue) => issue.kind === "artifact"),
    secret: issues.filter((issue) => issue.kind === "secret"),
    nsfw: issues.filter((issue) => issue.kind === "nsfw"),
  };
}