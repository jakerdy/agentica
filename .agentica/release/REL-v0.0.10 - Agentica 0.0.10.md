# REL-v0.0.10 - Agentica 0.0.10

## Сводка релиза

- **Дата:** 2026-02-20
- **Предыдущая версия:** v0.0.9
- **Новая версия:** v0.0.10
- **Тип релиза:** patch
- **Тег:** v0.0.10

## Чеклист предрелизных работ

- [x] Активная ветка: `main` или `master` (`main`)
- [x] Все изменения закоммичены (`git status` чистый) — будет проверено после релизного коммита
- [x] Версии в манифестах синхронизированы с тегом релиза (`package.json` = `0.0.10`)
- [x] Форматирование проходит успешно (`npm run lint` / Biome check)
- [x] Линт проходит успешно (`npm run lint`)
- [x] Компиляция/типизация проходит успешно (`npm run typecheck`)
- [x] Сборка проходит успешно (`npm run build`)
- [x] Dry-run публикации прошёл успешно (`npm publish --dry-run`)
- [x] Публикационное окружение и credentials проверены (`npm whoami` успешен, registry `https://registry.npmjs.org/`)

## Черновик Changelog для текущей версии

### Features

- Нет

### Fixes

- `7779f86` — Исправлено попадание обязательных файлов в публикационный пакет

### Refactor / Chore

- Нет

### Docs / Tests / Build

- Обновлён version badge в README до `0.0.10`
- Обновлён `CHANGELOG.md` с секцией `0.0.10`

### Breaking Changes (если есть)

- Нет

## План действий (стеко-ориентированный)

### TypeScript / Node / Bun

1. Обновить версии в `package.json` (и package-манифестах, если monorepo).
2. Выполнить quality gate (`format`, `lint`, `typecheck`, `test`, `build`).
3. Проверить dry-run публикации (`npm publish --dry-run` или `bun publish --dry-run`).
4. Создать тег релиза и отправить его в origin.
5. Выполнить реальную публикацию в registry.

### Python

- N/A: стек Python в текущем пакете не используется.

### Другое / Custom

- N/A: отдельный кастомный pipeline публикации не используется.

## Блокеры и риски

- [ ] Блокер: отсутствует
- [ ] Риск: в CI-пайплайне потребуется `NPM_TOKEN`, даже если локальный `npm whoami` проходит

## Команды для публикации (по результатам аудита)

```bash
npm run lint
npm run typecheck
npm run build
npm publish --dry-run

# После финальной проверки
git tag v0.0.10
git push origin v0.0.10
npm publish
```
