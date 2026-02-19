# REL-v0.0.7 - Agentica 0.0.7

## Сводка релиза

- **Дата:** 2026-02-19
- **Предыдущая версия:** v0.0.6
- **Новая версия:** v0.0.7
- **Тип релиза:** patch
- **Тег:** v0.0.7

## Чеклист предрелизных работ

- [x] Активная ветка: `main` или `master` (`main`)
- [ ] Все изменения закоммичены (`git status` чистый) — **FAIL (в процессе подготовки release-коммита)**
- [x] Версии в манифестах синхронизированы с тегом релиза (`package.json: 0.0.7`)
- [ ] Форматирование проходит успешно — **N/A** (в проекте нет отдельной команды format)
- [ ] Линт проходит успешно — **N/A** (в проекте нет отдельной команды lint)
- [x] Компиляция/типизация проходит успешно (`npm run typecheck`)
- [x] Сборка проходит успешно (`npm run build`)
- [x] Dry-run публикации прошёл успешно (`npm publish --dry-run`)
- [ ] Публикационное окружение и credentials проверены — **FAIL** (`NPM_TOKEN`/`NODE_AUTH_TOKEN` не обнаружены)

## Черновик Changelog для текущей версии

### Features

- Нет feature-коммитов в диапазоне релиза.

### Fixes

- `fb5c813` — fix: Make CLI put AGENTS.md to ther root of init folder

### Refactor / Chore

- Нет refactor/chore-коммитов в диапазоне релиза.

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

- [x] Блокер: Публикационные credentials не обнаружены (`NPM_TOKEN`/`NODE_AUTH_TOKEN`).
- [x] Блокер: Рабочее дерево не чистое до release-коммита (ожидаемо в процессе подготовки).
- [ ] Риск: Критичных рисков по сборке/типизации не выявлено.

## Команды для публикации (не запускать до устранения блокеров)

```bash
# Финальный preflight
npm run typecheck
npm run build
npm publish --dry-run

# Подготовка релиза
git add package.json README.md CHANGELOG.md .agentica/release/REL-v0.0.7 - Agentica 0.0.7.md
git commit -m "chore(release): prepare v0.0.7"
git tag v0.0.7
git push origin main
git push origin v0.0.7

# Публикация (только после настройки credentials)
npm publish
```

### Инструкции по запуску

1. Настроить npm credentials (`NPM_TOKEN` или login в npm CLI).
2. Проверить preflight-команды.
3. Закоммитить релиз, отправить ветку и тег.
4. Выполнить `npm publish`.
