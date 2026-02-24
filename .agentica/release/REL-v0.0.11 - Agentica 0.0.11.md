# REL-v0.0.11 - Agentica 0.0.11

## Сводка релиза

- **Дата:** 2026-02-24
- **Предыдущая версия:** v0.0.10
- **Новая версия:** v0.0.11
- **Тип релиза:** patch
- **Тег:** v0.0.11

## Чеклист предрелизных работ

- [x] Активная ветка: `main`
- [x] Все изменения закоммичены (`git status` чистый после release-коммита)
- [x] Версии в манифестах синхронизированы с тегом релиза (`package.json`, `src/cli.ts`)
- [x] Форматирование проходит успешно (`npm run format`)
- [x] Линт проходит успешно (`npm run lint`)
- [x] Компиляция/типизация проходит успешно (`npm run typecheck`)
- [x] Сборка проходит успешно (`npm run build`)
- [x] Dry-run публикации прошёл успешно (`npm publish --dry-run` → `@jakerdy/agentica@0.0.11`)
- [x] Публикационное окружение и credentials проверены (`npm whoami` → `jakerdy`)

## Черновик Changelog для текущей версии

### Refactor / Chore

- Команда `/agentica.architect` переименована в `/agentica.rnd`; промпт `architect.prompt.md` удалён и заменён новым `rnd.prompt.md`, переориентированным на R&D-исследования
- Директория `.agentica/architecture/` переименована в `.agentica/research/`, префикс документов `AR-` заменён на `RnD-` во всех шаблонах, стеках, промптах и документации
- Обновлены: `globals/use-agentica.md`, `prompts/init.prompt.md`, все `stacks/**/structure.md`, `prompts/create/change/refactor/reverse.prompt.md`, `src/commands/init.ts`

### Docs / Build

- Обновлён version badge в `README.md` до `v0.0.11`
- Исправлена захардкоженная старая версия `0.0.8` в `src/cli.ts`
- Добавлена запись в `CHANGELOG.md`

## Блокеры и риски

Блокеров нет. Все проверки пройдены.

## Команды для публикации

```bash
# Коммит релизной подготовки
git add -A
git commit -m "chore(release): prepare v0.0.11"

# Тег и push
git tag v0.0.11
git push origin main
git push origin v0.0.11

# Публикация
npm publish
```
