# Python Specifics

## Naming

| Тип символа              | `Casing`       | PEP                                                                            |
| ------------------------ | -------------- | ------------------------------------------------------------------------------ |
| Класс, Exception         | `PascalCase`   | [PEP 8](https://peps.python.org/pep-0008/#class-names)                         |
| Функция, метод           | `snake_case`   | [PEP 8](https://peps.python.org/pep-0008/#function-and-variable-names)         |
| Переменная, аргумент     | `snake_case`   | [PEP 8](https://peps.python.org/pep-0008/#function-and-variable-names)         |
| Константа (module-level) | `ALL_CAPS`     | [PEP 8](https://peps.python.org/pep-0008/#constants)                           |
| Приватный атрибут/метод  | `_snake_case`  | [PEP 8](https://peps.python.org/pep-0008/#method-names-and-instance-variables) |
| Name mangling            | `__snake_case` | [PEP 8](https://peps.python.org/pep-0008/#method-names-and-instance-variables) |
| Модуль, пакет            | `snake_case`   | [PEP 8](https://peps.python.org/pep-0008/#package-and-module-names)            |
| Type variable            | `PascalCase`   | [PEP 8](https://peps.python.org/pep-0008/#type-variable-names)                 |

## Декомпозиция модулей

Не стоит писать супер большие модули с множеством классов. По возможности:
- Один публичный класс = один модуль (файл)
- Связанные функции группируй в отдельные модули
- Используй `__init__.py` для удобного публичного API пакета
- Приватные helper-функции можно оставлять в том же модуле с префиксом `_`

В частности, выноси в отдельные модули:
- Модели данных (dataclasses, Pydantic models)
- Бизнес-логику и сервисы
- Утилиты и helpers
- Типы и протоколы (interfaces)
- Константы и конфигурацию

## Скрипты

- Форматирование Ruff: `uv run ruff format`
- Линт Ruff: `uv run ruff check`
- Автофикс линта: `uv run ruff check --fix`
- Проверка типов mypy: `uv run mypy .`
- Запуск всех тестов: `uv run pytest`
- Запуск тестов с покрытием: `uv run pytest --cov`
- Не запускай утилиты через `pip`, используй `uv` и скрипты выше. Если нужны дополнительные команды, добавь их в `pyproject.toml` секцию `[tool.uv.scripts]`.

## pyproject.toml и зависимости

- Добавляй зависимости только через `uv add <package>`.
- Добавляй dev-зависимости через `uv add --dev <package>`.
- Удаляй зависимости только через `uv remove <package>`.
- **Не** редактируй `pyproject.toml` вручную для зависимостей.
- Используй `uv sync` для синхронизации окружения.
- Для production-зависимостей НЕ используй `--dev`.

## Типизация

Следуй [PEP 484](https://peps.python.org/pep-0484/) (Type Hints):

```python
# Хорошо:
def process_items(items: list[str], count: int) -> dict[str, int]:
    result: dict[str, int] = {}
    return result

# Плохо (без type hints):
def process_items(items, count):
    result = {}
    return result
```

- Используй современный синтаксис типов (Python 3.10+): `list[str]` вместо `List[str]`
- Для опциональных значений: `str | None` вместо `Optional[str]`
- Используй `typing.Protocol` для структурной типизации (duck typing)
- Избегай `Any` — используй `object`, `typing.Protocol` или generic types

## Docstrings

Следуй [PEP 257](https://peps.python.org/pep-0257/) и Google/NumPy стилю:

```python
def calculate_total(items: list[float], tax_rate: float) -> float:
    """Calculate total price including tax.
    
    Args:
        items: List of item prices
        tax_rate: Tax rate as decimal (e.g., 0.15 for 15%)
    
    Returns:
        Total price with tax applied
        
    Raises:
        ValueError: If tax_rate is negative
    """
    if tax_rate < 0:
        raise ValueError("Tax rate cannot be negative")
    return sum(items) * (1 + tax_rate)
```

## Общие обязательные принципы

- **Типизация**: всегда используй type hints для публичного API ([PEP 484](https://peps.python.org/pep-0484/))
- **Обработка ошибок**: выбрасывай конкретные исключения, не используй голый `except:`
- **Imports**: следуй порядку [PEP 8](https://peps.python.org/pep-0008/#imports) (stdlib → third-party → local), используй `ruff` для автосортировки
- **Immutability**: предпочитай неизменяемые структуры данных (tuples, frozenset, dataclasses с `frozen=True`)
- **Context managers**: используй `with` для работы с ресурсами (файлы, соединения, locks)
- **Dataclasses**: используй `@dataclass` вместо ручного `__init__` для data containers
- **Pathlib**: используй `pathlib.Path` вместо `os.path` для работы с путями
- **f-strings**: используй f-strings для форматирования строк вместо `.format()` или `%`
- **List comprehensions**: предпочитай comprehensions вместо `map()`/`filter()` для простых случаев
- **Dependency Injection**: передавай зависимости через аргументы конструктора/функций (важно для тестируемости)
