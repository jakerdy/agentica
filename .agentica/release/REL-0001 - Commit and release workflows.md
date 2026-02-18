# REL-0001 - Commit and release workflows

## Сводка релиза

- **Дата:** 2026-02-18
- **Предыдущая версия:** v0.0.2
- **Новая версия:** v0.0.3
- **Тип релиза:** patch
- **Тег:** v0.0.3

## Чеклист предрелизных работ

- [x] Активная ветка: `main` или `master` (`main`)
- [ ] Все изменения закоммичены (`git status` не чистый: изменены `package.json`, `biome.json`, добавлен `.agentica/`)
- [x] Версии в манифестах синхронизированы с тегом релиза (`package.json` = `0.0.3`)
- [x] Форматирование проходит успешно (`bunx @biomejs/biome check .`)
- [x] Линт проходит успешно (`bunx @biomejs/biome check .`)
- [x] Компиляция/типизация проходит успешно (`bunx tsc --noEmit`)
- [x] Сборка проходит успешно (`npm run build`)
- [x] Dry-run публикации прошёл успешно (`npm publish --dry-run`, `bun publish --dry-run`)
- [x] Публикационное окружение и credentials проверены (`npm whoami` OK, registry: `https://registry.npmjs.org/`)

## Черновик Changelog для текущей версии

### Features

- `95c35b6` — feat: add commit and release workflows (Jak Erdy - Home, 2026-02-18)

### Fixes

- Нет изменений в диапазоне релиза.

### Refactor / Chore

- Нет изменений в диапазоне релиза.

### Docs / Tests / Build

- Обновлён промпт релиза: `prompts/release.prompt.md` (включено в релизный пакет по запросу).

### Breaking Changes (если есть)

- Не обнаружены.

## План действий (стеко-ориентированный)

### TypeScript / Node / Bun

1. Закоммитить релизные изменения (`package.json`, `biome.json`, `.agentica/release/*`).
2. Подтвердить quality gate: `bun run typecheck`, `bunx @biomejs/biome check .`, `npm run build`.
3. Подтвердить dry-run: `npm publish --dry-run` и `bun publish --dry-run`.
4. Создать тег `v0.0.3`, отправить в origin, выполнить реальную публикацию.

### Python

1. N/A — Python-пакет для публикации в репозитории не обнаружен.

### Другое / Custom

1. Проверить предупреждение npm по `bin[agentica]` и, при необходимости, нормализовать путь бинаря перед публикацией.

## Блокеры и риски

- [x] Блокер 1: Рабочее дерево не чистое — релиз нельзя публиковать до коммита изменений.
- [ ] Блокер 2: отсутствует.
- [x] Риск 1: npm сообщает предупреждение о `bin[agentica]` (скрипт удаляется при автокоррекции).
- [ ] Риск 2: отсутствует.

## Команды для публикации (не запускать до устранения блокеров)

```bash
# 1) Закоммитить изменения
git add package.json biome.json .agentica/release/REL-0001\ -\ Commit\ and\ release\ workflows.md
git commit -m "chore(release): prepare v0.0.3"

# 2) Пройти quality gate
bun run typecheck
bunx @biomejs/biome check .
npm run build

# 3) Dry-run публикации
npm publish --dry-run
bun publish --dry-run

# 4) Тег и публикация
git tag v0.0.3
git push origin v0.0.3
npm publish
```
