# Publishing Guide

## Pre-publish Checklist

- [ ] Version updated in `package.json`
- [ ] Changes documented
- [ ] Code built successfully (`bun run build`)
- [ ] Tests passed (if any)
- [ ] README.md up to date

## Publishing to NPM

### First time setup

```bash
# Login to npm (if not already logged in)
npm login
```

### Publishing

```bash
# 1. Build the project
bun run build

# 2. Preview package contents (optional)
npm pack --dry-run

# 3. Publish to npm
npm publish --access public
```

### Publishing new version

```bash
# Update version (patch/minor/major)
npm version patch  # 0.1.0 -> 0.1.1
npm version minor  # 0.1.0 -> 0.2.0
npm version major  # 0.1.0 -> 1.0.0

# Build and publish
bun run build
npm publish --access public
```

## Package Contents

The published package includes:
- `dist/` - Compiled CLI
- `prompts/` - Agent workflow prompts
- `templates/` - Specification templates
- `stacks/` - Project stack templates
- `globals/` - Global configuration files
- `README.md` - Documentation
- `LICENSE` - MIT License

## After Publishing

1. Create a git tag:
   ```bash
   git tag v0.1.0
   git push origin v0.1.0
   ```

2. Test installation:
   ```bash
   npm install -g @jakerdy/agentica
   agentica --version
   ```

3. Create GitHub release (optional)
