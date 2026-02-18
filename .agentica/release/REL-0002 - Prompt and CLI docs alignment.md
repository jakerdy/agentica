# REL-0002 - Prompt and CLI docs alignment

## Сводка релиза

- **Дата:** 2026-02-18
- **Предыдущая версия:** v0.0.3
- **Новая версия:** v0.0.4
- **Тип релиза:** patch
- **Тег:** v0.0.4

## Чеклист предрелизных работ

- [x] Активная ветка: `main` или `master` (`main`)
- [x] Все изменения закоммичены (`git status --porcelain` был пуст до генерации REL-документа)
- [ ] Версии в манифестах синхронизированы с тегом релиза (`package.json` = `0.0.3`, ожидается `0.0.4`)
- [x] Форматирование проходит успешно (`bunx @biomejs/biome check .`)
- [x] Линт проходит успешно (`bunx @biomejs/biome check .`)
- [x] Компиляция/типизация проходит успешно (`npm run typecheck`)
- [x] Сборка проходит успешно (`npm run build`)
- [ ] Dry-run публикации прошёл успешно (если применимо) (`npm publish --dry-run` неуспешен из-за уже опубликованной версии `0.0.3`; `bun publish --dry-run` успешен)
- [ ] Публикационное окружение и credentials проверены (registry корректный: `https://registry.npmjs.org/`, но `NPM_TOKEN/NODE_AUTH_TOKEN` не обнаружены)

## Черновик Changelog для текущей версии

### Features

- Нет изменений в диапазоне релиза.

### Fixes

- Нет изменений в диапазоне релиза.

### Refactor / Chore

- Нет изменений в диапазоне релиза.

### Docs / Tests / Build

- `5341ec2` — docs: update CLI and commit/release prompts (Jak Erdy - Home, 2026-02-18)
- `eac11e7` — readme: Links to prerequisites (Jak Erdy - Home, 2026-02-18)

### Breaking Changes (если есть)

- Не обнаружены.

## План действий (стеко-ориентированный)

### TypeScript / Node / Bun

1. Обновить версию в `package.json` до `0.0.4`.
2. Подтвердить quality gate: `bunx @biomejs/biome check .`, `npm run typecheck`, `npm run build`.
3. Повторить dry-run: `npm publish --dry-run` и `bun publish --dry-run`.
4. Создать тег `v0.0.4` и отправить в origin.
5. Выполнить публикацию в npm (`npm publish`) и при необходимости через Bun (`bun publish`).

### Python

1. N/A — Python-пакет для публикации в репозитории не обнаружен.

### Другое / Custom

1. Исправить предупреждение npm по полю `bin[agentica]` (валидное имя бинаря должно совпадать с именем пакета без scope).
2. Проверить наличие publish-токена в окружении CI/local shell перед реальной публикацией.

## Блокеры и риски

- [x] Блокер 1: версия в манифесте не соответствует рассчитываемому релизу (`0.0.3` vs `0.0.4`).
- [x] Блокер 2: отсутствуют publish credentials в окружении (`NPM_TOKEN/NODE_AUTH_TOKEN`).
- [x] Риск 1: `npm publish --dry-run` предупреждает о некорректном `bin[agentica]` и автокорректирует `package.json` при публикации.
- [ ] Риск 2: отсутствует.

## Команды для публикации (не запускать до устранения блокеров)

```bash
# 1) Апдейт версии
npm version 0.0.4 --no-git-tag-version

# 2) Проверка качества и сборки
bunx @biomejs/biome check .
npm run typecheck
npm run build

# 3) Проверка dry-run
npm publish --dry-run
bun publish --dry-run

# 4) Коммит и тег
git add package.json .agentica/release/REL-0002\ -\ Prompt\ and\ CLI\ docs\ alignment.md
git commit -m "chore(release): prepare v0.0.4"
git tag v0.0.4
git push origin main
git push origin v0.0.4

# 5) Публикация
npm publish
# bun publish (если требуется отдельный Bun-канал)
```