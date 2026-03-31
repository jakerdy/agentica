# REL-v0.1.0 - Agentica 0.1.0

## Сводка релиза

- **Дата:** 2026-03-31
- **Предыдущая версия:** v0.0.11
- **Новая версия:** v0.1.0
- **Тип релиза:** minor
- **Тег:** v0.1.0

## Чеклист предрелизных работ

- [x] Активная ветка: `main`
- [ ] Все изменения закоммичены (`git status` будет чистым после release-коммита)
- [x] Версии в манифестах синхронизированы с тегом релиза (`package.json`, `src/cli.ts`)
- [x] Форматирование проходит успешно (`bun run format`)
- [x] Линт проходит успешно (`bun run lint`)
- [x] Компиляция/типизация проходит успешно (`bun run typecheck`)
- [x] Сборка проходит успешно (`bun run build`)
- [x] Dry-run публикации прошёл успешно (`npm publish --dry-run` → `@jakerdy/agentica@0.1.0`)
- [x] Публикационное окружение и credentials проверены (`npm whoami` → `jakerdy`)

## Черновик Changelog для текущей версии

### Features

- Добавлена команда `agentica safety-check`, которая проверяет staged-изменения на артефакты, секреты, большие файлы и потенциально неуместные фразы через фиксированные эвристики CLI

### Fixes

- Устранено ложноположительное срабатывание NSFW-проверки на собственные определения regex-правил внутри `src/commands/safety_check.ts`

### Refactor / Chore

- Команда `/agentica.commit` переведена на вызов `agentica safety-check`, чтобы safety-аудит выполнялся быстрее и детерминированно вне агента

### Docs / Tests / Build

- Обновлены `README.md` и `prompts/commit.prompt.md` под новый commit-flow
- Подготовлены `CHANGELOG.md`, version badge в `README.md`, `package.json` и `src/cli.ts` для релиза `v0.1.0`

### Breaking Changes (если есть)

- Нет

## План действий (стеко-ориентированный)

### TypeScript / Node / Bun

1. Обновить версии в `package.json` и CLI-константах.
2. Выполнить quality gate: `bun run format`, `bun run lint`, `bun run typecheck`, `bun run build`.
3. Проверить dry-run публикации: `npm publish --dry-run`.
4. Создать release commit и тег `v0.1.0`.
5. Отправить `main` и тег в `origin`, затем выполнить реальную публикацию.

## Блокеры и риски

Блокеров нет. До коммита релизной подготовки рабочее дерево ожидаемо содержит version bump, changelog и REL-документ.

## Команды для публикации

```bash
# Коммит релизной подготовки
git add -A
git commit -m "chore(release): prepare v0.1.0"

# Тег и push
git tag v0.1.0
git push origin main
git push origin v0.1.0

# Публикация
npm publish
```