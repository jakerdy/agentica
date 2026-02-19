# REL-v0.0.7 - Agentica 0.0.7

## Сводка релиза

- **Дата:** 2026-02-19
- **Предыдущая версия:** v0.0.6
- **Новая версия:** v0.0.7
- **Тип релиза:** patch
- **Тег:** v0.0.7

## Чеклист предрелизных работ

- [x] Активная ветка: `main` или `master` (`main`)
- [x] Все изменения закоммичены (`git status` чистый)
- [x] Версии в манифестах синхронизированы с тегом релиза (`package.json: 0.0.7`)
- [x] Форматирование проходит успешно (`bun run format`)
- [x] Линт проходит успешно (`npm run lint`)
- [x] Компиляция/типизация проходит успешно (`npm run typecheck`)
- [x] Сборка проходит успешно (`npm run build`)
- [x] Dry-run публикации прошёл успешно (`npm publish --dry-run`)
- [x] Публикационное окружение и credentials проверены (`npm whoami` успешен, registry: `https://registry.npmjs.org/`)

## Черновик Changelog для текущей версии

### Features

- Улучшена работа с конфигами VSCode: добавлен безопасный парсинг JSONC для `.vscode/settings.json` и `.vscode/extensions.json`.

### Fixes

- `fb5c813` — fix: Make CLI put AGENTS.md to ther root of init folder

### Refactor / Chore

- В `package.json` добавлены команды `lint` и `format` для предрелизного quality gate.

### Docs / Tests / Build

- `d9ee267` — prompt: Makek sure init creates full structure at monorepo root

### Breaking Changes (если есть)

- Не обнаружены.

## План действий (стеко-ориентированный)

### TypeScript / Node / Bun

1. Обновить версии в манифестах (`package.json`) и проверить, что changelog синхронизирован.
2. Выполнить quality gate: `npm run typecheck` и `npm run build`.
3. Проверить dry-run публикации: `npm publish --dry-run`.
4. Сделать release commit, создать тег релиза и отправить изменения в origin.
5. Выполнить реальную публикацию в npm registry.

### Python

1. N/A — Python-манифесты (`pyproject.toml`) в этом репозитории отсутствуют.

### Другое / Custom

1. Проверить наличие доступа к npm registry и токена публикации.
2. Убедиться, что релизный документ и changelog соответствуют фактическому диапазону коммитов.

## Блокеры и риски

- [ ] Блокеры отсутствуют.
- [ ] Риск: Критичных рисков по сборке/типизации не выявлено.

## Команды для публикации (не запускать до устранения блокеров)

```bash
# Финальный preflight
npm run typecheck
npm run build
npm publish --dry-run

# Подготовка релиза
git add package.json src/utils/vscode_config.ts bun.lock CHANGELOG.md .agentica/release/REL-v0.0.7 - Agentica 0.0.7.md
git commit -m "chore(release): finalize v0.0.7"
git tag -f v0.0.7
git push origin main
git push origin -f v0.0.7

# Публикация (только после настройки credentials)
npm publish
```

### Инструкции по запуску

1. Настроить npm credentials (`NPM_TOKEN` или login в npm CLI).
2. Проверить preflight-команды.
3. Закоммитить релиз, отправить ветку и тег.
4. Выполнить `npm publish`.
