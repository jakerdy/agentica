import { readFileSync, writeFileSync, chmodSync } from "fs";

//----------------------- Build CLI ----------------------//

console.log("🔨 Building Agentica CLI...\n");

const result = await Bun.build({
  entrypoints: ["./src/cli.ts"],
  outdir: "./dist",
  target: "bun",
  minify: false,
  sourcemap: "external",
});

if (!result.success)
{
  console.error("❌ Build failed:");
  for (const message of result.logs)
  {
    console.error(message);
  }
  process.exit(1);
}

// Add shebang to the output file
const cli_file = "./dist/cli.js";
const content = readFileSync(cli_file, "utf-8");

if (!content.startsWith("#!/usr/bin/env bun"))
{
  const with_shebang = `#!/usr/bin/env bun\n${content}`;
  writeFileSync(cli_file, with_shebang, "utf-8");
}

// Make executable
try
{
  chmodSync(cli_file, 0o755);
} catch (error)
{
  console.warn("⚠ Warning: Could not make file executable:", error);
}

console.log("✅ Build successful!");
console.log(`   Output: ${cli_file}`);
