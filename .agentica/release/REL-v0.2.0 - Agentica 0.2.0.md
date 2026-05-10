# REL-v0.2.0 - Agentica 0.2.0

## Сводка релиза

- **Дата:** 2026-05-10
- **Предыдущая версия:** v0.1.0
- **Новая версия:** v0.2.0
- **Тип релиза:** minor
- **Тег:** v0.2.0

## Чеклист предрелизных работ

- [x] Активная ветка: `main`
- [x] Все изменения закоммичены (`release`-коммит будет создан перед тегированием, после него `git status` чистый)
- [x] Версии в манифестах синхронизированы с тегом релиза (`package.json`, `src/cli.ts`, version badge в `README.md`)
- [x] Форматирование проходит успешно (`bun run format`)
- [x] Линт проходит успешно (`bun run lint`)
- [x] Компиляция/типизация проходит успешно (`bun run typecheck`)
- [x] Сборка проходит успешно (`bun run build`)
- [x] Dry-run публикации прошёл успешно (`npm publish --dry-run` → `@jakerdy/agentica@0.2.0`)
- [x] Публикационное окружение и credentials проверены (`npm whoami` → `jakerdy`, registry → `https://registry.npmjs.org/`)

## Черновик Changelog для текущей версии

### Features

- Добавлен интерактивный мастер для `agentica init`, который предлагает выбрать стек, директорию проекта и секции для `AGENTS.md`

### Fixes

- Нет

### Refactor / Chore

- Сборка `AGENTS.md` сделана конфигурируемой по выбранным секциям
- Получение списка стеков вынесено в общий utility для переиспользования между командами CLI

### Docs / Tests / Build

- README обновлён под интерактивный сценарий `init`
- Подготовлены `CHANGELOG.md`, version badge в `README.md`, `package.json` и `src/cli.ts` для релиза `v0.2.0`

### Breaking Changes (если есть)

- Нет

## План действий (стеко-ориентированный)

### TypeScript / Node / Bun

1. Убедиться, что версии в `package.json` и CLI-константах обновлены до `0.2.0`.
2. Выполнить quality gate: `bun run format`, `bun run lint`, `bun run typecheck`, `bun run build`.
3. Проверить dry-run публикации: `npm publish --dry-run`.
4. Создать release commit и тег `v0.2.0`.
5. Отправить `main` и тег в `origin`, затем выполнить реальную публикацию.

## Блокеры и риски

Блокеров нет. До создания release-коммита рабочее дерево ожидаемо содержит version bump, changelog и новый REL-документ.

Риск: перед реальной публикацией стоит ещё раз просмотреть финальный `CHANGELOG.md` и текст REL-документа на предмет формулировок релизных notes.

## Команды для публикации

```bash
# Коммит релизной подготовки
git add -A
git commit -m "chore(release): prepare v0.2.0"

# Тег и push
git tag v0.2.0
git push origin main
git push origin v0.2.0

# Публикация
npm publish
```