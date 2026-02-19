# REL-v0.0.8 - Agentica 0.0.8

## Сводка релиза

- **Дата:** 2026-02-19
- **Предыдущая версия:** v0.0.7
- **Новая версия:** v0.0.8
- **Тип релиза:** patch
- **Тег:** v0.0.8

## Чеклист предрелизных работ

- [x] Активная ветка: `main` или `master` (`main`)
- [x] Все изменения закоммичены (`git status` чистый) на момент аудита
- [x] Версии в манифестах синхронизированы с тегом релиза (`package.json` = `0.0.8`)
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

- Нет

### Refactor / Chore

- Переведена сборка CLI на external dependencies (`packages: "external"`), чтобы не бандлить runtime-зависимости в `dist`
- Синхронизированы версии пакета и CLI до `0.0.8`

### Docs / Tests / Build

- Обновлён version badge в README до `0.0.8`

### Breaking Changes (если есть)

- Нет

## План действий (стеко-ориентированный)

### TypeScript / Node / Bun

1. Обновить версии в `package.json` (и package-манифестах, если monorepo).
2. Выполнить quality gate (`format`, `lint`, `typecheck`, `test`, `build`).
3. Проверить dry-run публикации (`npm publish --dry-run` или `bun publish --dry-run`).
4. Создать тег релиза и отправить его в origin.
5. Выполнить реальную публикацию в registry.

## Блокеры и риски

- [ ] Блокер: отсутствует
- [ ] Риск: переменная окружения `NPM_TOKEN` не задана, публикация опирается на локальную npm-аутентификацию (`npm whoami` проходит)

## Команды для публикации (по результатам аудита)

```bash
npm run lint
npm run typecheck
npm run build
npm publish --dry-run

# После проверки
git tag v0.0.8
git push origin v0.0.8
npm publish
```