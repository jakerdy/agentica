# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-02-17

### Added
- Initial release
- `agentica init` command for project initialization
- Support for TypeScript stacks: cli, lib, monorepo, server, spa
- Support for Python stacks: cli, gui, lib, monorepo
- Stack templates with product.md, structure.md, tech.md
- Agent workflow prompts (init, create, architect, reverse, change, tasks, implement, validate, readme, refactor)
- Specification templates (architecture, change, feature)
- AGENTS.md composition from globals (lang-specific, anti-spaghetti, use-agentica)
- VSCode settings.json integration for prompt files
- Automatic project structure creation
- Colored CLI output with chalk
- Commander.js-based CLI interface

### Features
- Create new project with `--name` flag
- Initialize in current directory
- Automatic backup of existing AGENTS.md
- Stack validation and helpful error messages
- Build system with Bun

[0.1.0]: https://github.com/jakerdy/agentica/releases/tag/v0.1.0
