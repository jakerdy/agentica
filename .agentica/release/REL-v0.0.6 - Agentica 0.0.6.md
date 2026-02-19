# REL-v0.0.6 - Agentica 0.0.6

## Сводка релиза

- **Дата:** 2026-02-19
- **Предыдущая версия:** v0.0.5
- **Новая версия:** v0.0.6
- **Тип релиза:** patch
- **Тег:** v0.0.6

## Чеклист предрелизных работ

- [x] Активная ветка: `main` или `master` (`main`)
- [ ] Все изменения закоммичены (`git status` чистый) — **FAIL** (`M package.json`)
- [x] Версии в манифестах синхронизированы с тегом релиза (`package.json: 0.0.6`)
- [ ] Форматирование проходит успешно — **N/A** (в проекте нет отдельной команды format)
- [ ] Линт проходит успешно — **N/A** (в проекте нет отдельной команды lint)
- [x] Компиляция/типизация проходит успешно (`npm run typecheck`)
- [x] Сборка проходит успешно (`npm run build`)
- [x] Dry-run публикации прошёл успешно (`npm publish --dry-run`)
- [x] Публикационное окружение и credentials проверены (`npm config get registry`, `npm whoami`)

## Черновик Changelog для текущей версии

### Features

- Нет продуктовых feature-коммитов в диапазоне релиза.

### Fixes

- `e436994` — fix: Get back CLI binding

### Refactor / Chore

- `47075c5` — prompt: Better release prompt, that actualy do most of the work

### Docs / Tests / Build

- Нет отдельных docs/test/build-коммитов в диапазоне релиза.

### Breaking Changes (если есть)

- Не обнаружены.

## План действий (стеко-ориентированный)

### TypeScript / Node / Bun

1. Проверить и закоммитить изменения манифеста версии (`package.json`).
2. Выполнить quality gate: `npm run typecheck` и `npm run build`.
3. Проверить dry-run публикации: `npm publish --dry-run`.
4. Создать тег релиза и отправить его в origin.
5. Выполнить реальную публикацию в npm registry.

### Python

1. N/A — текущий репозиторий не содержит Python-манифестов.

### Другое / Custom

1. Убедиться, что `CHANGELOG.md` и version badge в `README.md` обновлены под `v0.0.6`.
2. Перед финальной публикацией ещё раз выполнить `npm publish --dry-run`.

## Блокеры и риски

- [x] Блокер 1: Рабочее дерево не чистое (идёт подготовка release-коммита; блокер снимается после `chore(release): prepare v0.0.6`).
- [ ] Блокер 2: Ошибка/предупреждение `bin` в `npm publish --dry-run` — устранено (поле `bin` нормализовано).
- [ ] Риск 1: Критичных рисков не выявлено после повторного dry-run.

## Команды для публикации

```bash
# 1) Финальный preflight перед публикацией
npm run typecheck
npm run build
npm publish --dry-run

# 2) Подготовить релиз
git add package.json README.md CHANGELOG.md prompts/release.prompt.md .agentica/release/REL-v0.0.6 - Agentica 0.0.6.md
git commit -m "chore(release): prepare v0.0.6"
git tag v0.0.6
git push origin main
git push origin v0.0.6

# 3) Публикация
npm publish
```

### Инструкции по запуску

1. Выполнить preflight-команды и убедиться, что нет ошибок.
2. Закоммитить релизный пакет и запушить ветку и тег.
3. Запустить `npm publish` только после успешного шага 2.
