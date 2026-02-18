# Журнал изменений

Все значимые изменения в этом проекте будут документироваться в этом файле.

Формат основан на [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
а проект придерживается [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
