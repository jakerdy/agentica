# Журнал изменений

Все значимые изменения в этом проекте будут документироваться в этом файле.

Формат основан на [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
а проект придерживается [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.10] - 2026-02-20

### Исправлено
- Исправлено попадание обязательных файлов в публикационный пакет

### Docs / Build
- Обновлён version badge в README до `0.0.10`

## [0.0.9] - 2026-02-20

### Исправлено
- Исправлено динамическое определение корня репозитория в собранном CLI

### Docs / Build
- Обновлён version badge в README до `0.0.9`

## [0.0.8] - 2026-02-19

### Изменено
- Сборка CLI переведена в режим внешних зависимостей (`packages: "external"`) вместо полного бандлинга `node_modules`
- Синхронизированы версии пакета и CLI до `0.0.8`

### Docs / Build
- Обновлён version badge в README до `0.0.8`

## [0.0.7] - 2026-02-19

### Добавлено
- Поддержка JSONC (`comments` и trailing commas) при чтении `.vscode/settings.json` и `.vscode/extensions.json` через `jsonc-parser`

### Изменено
- Добавлены команды quality gate в `package.json`: `lint` (`biome check --write`) и `format` (`biome format --write`)

### Исправлено
- Исправлен путь размещения `AGENTS.md`: теперь файл создаётся в корне целевой директории `init`

### Документация
- Уточнён prompt инициализации для корректного создания полной структуры в корне monorepo
- Обновлён version badge в README до `0.0.7`
- Добавлен release-документ `.agentica/release/REL-v0.0.7 - Agentica 0.0.7.md`

## [0.0.6] - 2026-02-19

### Изменено
- Обновлён workflow промпта релиза: пересобрана очередность шагов Фазы 7 для помощи в публикации

### Исправлено
- Восстановлен CLI binding
- Нормализовано поле `bin` в `package.json` до объектного формата для корректного `npm publish`

### Документация
- Обновлён version badge в README до `0.0.6`
- Добавлен release-документ `.agentica/release/REL-v0.0.6 - Agentica 0.0.6.md`

## [0.0.5] - 2026-02-18

### Исправлено
- Обновлены `repository` и `bugs` в `package.json` для корректной мета-информации пакета

### Документация
- Обновлён workflow-промпт релиза и записи changelog для актуального release-процесса
- Обновлён version badge в README до `0.0.5`

## [0.0.4] - 2026-02-18

### Изменено
- Обновлены CLI- и workflow-промпты для `commit` и `release`

### Исправлено
- Исправлены ссылки в разделе `Prerequisites` в README
- Обновлён version badge в README до актуального релиза

## [0.0.3] - 2026-02-18

### Добавлено
- Workflow-промпты `commit` и `release`

### Изменено
- Усилена проверка commit workflow на нежелательные/неуместные формулировки в changes

## [0.0.2] - 2026-02-18

### Добавлено
- Бейджи в заголовке README (версия, лицензия, build)
- Раздел `Prerequisites` в README:
	- VSCode
	- GitHub Copilot
	- Bun / Node.js для CLI
	- Context7 (опционально)
- Новый скилл `frontend-design` в `.agentica/skills` и шаблонах инициализации

### Изменено
- Обновлён CLI API и упрощён интерфейс запуска команд
- Улучшен `init`-процесс: команда `init` теперь обновляет `.vscode/extensions.json` и добавляет рекомендацию `Upstash.context7-mcp`
- Подредактирован `init` prompt для более качественного процесса инициализации

### Исправлено
- Сборка переведена на Node-совместимый сценарий (не только Bun)
- Унифицировано имя инструмента `ask_questions` в промптах

### Удалено
- Удалён `PUBLISHING.md` как избыточный файл

## [0.0.1] - 2026-02-17

### Добавлено
- Первый релиз
- Команда `agentica init` для инициализации проекта
- Поддержка TypeScript-стеков: cli, lib, monorepo, server, spa
- Поддержка Python-стеков: cli, gui, lib, monorepo
- Шаблоны стеков с файлами product.md, structure.md, tech.md
- Промпты workflow агента (init, create, architect, reverse, change, tasks, implement, validate, readme, refactor)
- Шаблоны спецификаций (architecture, change, feature)
- Сборка AGENTS.md из globals (lang-specific, anti-spaghetti, use-agentica)
- Интеграция settings.json VSCode для файлов промптов
- Автоматическое создание структуры проекта
- Цветной вывод CLI с помощью chalk
- CLI-интерфейс на базе Commander.js

### Возможности
- Создание нового проекта с флагом `--name`
- Инициализация в текущей директории
- Автоматическое резервное копирование существующего AGENTS.md
- Валидация стеков и понятные сообщения об ошибках
- Система сборки на Bun
