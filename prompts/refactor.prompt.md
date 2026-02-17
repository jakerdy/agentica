---
name: agentica.refactor
description: Многопроходный рефакторинг существующего кода без изменения публичного API
---

## Ввод пользователя

```text
$ARGUMENTS
```

Ты **ОБЯЗАН** учесть ввод пользователя (аргументы и контекст) перед тем как продолжить.

## Цель и принципы работы

Твоя задача — улучшить качество существующего кода, сделав его **плоским, простым и структурированным**, при этом **не меняя публичный API**.
Работай строго линейно: **Диагностика → Pass 1 → Pass 2 → Pass 3 → Pass 4 → Проверка → Отчёт**.

Рефакторинг — это **не переписывание с нуля**. Это систематическое улучшение кода через серию небольших трансформаций, каждая из которых сохраняет работоспособность.

### Глобальные запреты (Safety Guards)

Останови выполнение и не вноси изменения, если:
1. Пользователь просит **добавить новую функциональность** (используй `implement` или `change`).
2. Публичный API нужно изменить (сигнатуры экспортируемых функций/классов) — это не рефакторинг, а breaking change.
3. Код работает корректно, но пользователь просит "сделать по-другому" без технических причин — уточни обоснование.
4. Нет тестов, и изменения могут сломать поведение — предупреди о рисках.
5. Входные данные не указывают, **какой именно код** нужно рефакторить.

В случае остановки: объясни причину и предложи корректную команду.

### Главный инвариант: API остаётся неизменным

**До рефакторинга:**
```typescript
export function processData(input: string): Result { ... }
```

**После рефакторинга:**
```typescript
export function processData(input: string): Result {
  // Внутренняя реализация изменилась, но сигнатура — НЕТ
  const processor = new DataProcessor(input);
  return processor.execute();
}
```

Если изменение API неизбежно — это **не рефакторинг**. Используй `change` для таких случаев.

## Фаза 0: Диагностика и анализ

### Шаг 0.1: Определение скоупа рефакторинга

1. Прочитай код, который пользователь указал для рефакторинга.
2. Определи границы изменений:
   - **Один файл:** Локальный рефакторинг.
   - **Несколько файлов:** Системный рефакторинг (требуется анализ зависимостей).
   - **Весь модуль:** Архитектурный рефакторинг (может потребоваться `architect`).

3. Найди **публичный API** (экспортированные функции/классы) — его сигнатуры **нельзя** менять.

### Шаг 0.2: Чтение контекста

Прочитай следующие файлы из скоупа проекта:
1. `tech.md` — технические стандарты и соглашения.
2. Существующие тесты для выбранного кода (если есть).
3. Места использования рефакторируемого кода (чтобы понять, как он применяется).

### Шаг 0.3: Составление карты проблем

Проанализируй код и составь список проблем:

1. **10-этажные конструкции:** Вложенность > 3 уровней, цепочки методов на 5+ операций.
2. **Мега-функции:** Функции на 100+ строк с состоянием в замыканиях.
3. **Избыточные проверки:** 3-4 `if` перед простой операцией, дублирование валидаций.
4. **Функции с 5+ аргументами:** Нужно переписывать в виде класса.
5. **Магические числа/строки:** Не вынесены в константы.
6. **Смешанные уровни абстракции:** Низкоуровневые операции рядом с бизнес-логикой.

**Критерий запуска:** Если найдено **3+ проблемы** из списка — продолжай. Если меньше — уточни у пользователя, что именно улучшать.

## Pass 1 — Распаковка вложенности (Flatten)

**Цель:** Сделать код **плоским** — убрать пирамиды вложенности, распаковать 10-этажные конструкции.

### Правило 1.1: Ранний возврат (Early Return)

**Было:**
```typescript
function process(data: Data): Result {
  if (data.isValid) {
    if (data.hasPermission) {
      if (data.isActive) {
        // 100 строк логики
      }
    }
  }
  return null;
}
```

**Стало:**
```typescript
function process(data: Data): Result {
  if (!data.isValid) return null;
  if (!data.hasPermission) return null;
  if (!data.isActive) return null;
  
  // 100 строк логики на нулевом уровне вложенности
}
```

### Правило 1.2: Извлечение функций из вложенных блоков

**Было:**
```typescript
function process(items: Item[]): void {
  items.forEach(item => {
    if (item.type === 'A') {
      // 30 строк логики
    } else if (item.type === 'B') {
      // 40 строк логики
    }
  });
}
```

**Стало:**
```typescript
function process(items: Item[]): void {
  items.forEach(item => {
    if (item.type === 'A') return handleTypeA(item);
    if (item.type === 'B') return handleTypeB(item);
  });
}

function handleTypeA(item: Item): void { ... }
function handleTypeB(item: Item): void { ... }
```

### Правило 1.3: Распаковка цепочек методов

**Было:**
```typescript
const result = data.filter(x => x.active).map(x => x.value).reduce((a, b) => a + b, 0).toFixed(2);
```

**Стало:**
```typescript
const activeItems = data.filter(x => x.active);
const values = activeItems.map(x => x.value);
const sum = values.reduce((a, b) => a + b, 0);
const result = sum.toFixed(2);
```

### Правило 1.4: Избегай `else` после `return`

**Было:**
```typescript
if (condition) {
  return value;
} else {
  // ...
}
```

**Стало:**
```typescript
if (condition) return value;
// ...
```

### Критерий завершения Pass 1

Проверь код:
- ✅ Нет вложенности глубже 3 уровней.
- ✅ Цепочки методов разбиты на именованные переменные.
- ✅ Нет `else` после `return/throw/break`.

## Pass 2 — Очистка от избыточных проверок

**Цель:** Удалить **паранойю** — проверки, которые дублируются или бессмысленны в данном контексте.

### Правило 2.1: Не проверяй дважды

**Было:**
```typescript
function handleUser(user: User): void {
  if (!user) throw new Error('User required');
  if (!user.id) throw new Error('User ID required');
  
  processUser(user); // внутри тоже проверяет user
}

function processUser(user: User): void {
  if (!user) throw new Error('User required'); // ДУБЛЬ
  // ...
}
```

**Стало:**
```typescript
function handleUser(user: User): void {
  if (!user) throw new Error('User required');
  if (!user.id) throw new Error('User ID required');
  
  processUser(user); // доверяем вызывающему коду
}

function processUser(user: User): void {
  // Только реальная логика, без повторных проверок
}
```

### Правило 2.2: Доверяй типизации

Если TypeScript гарантирует, что значение не `null/undefined` — не проверяй это вручную.

**Было:**
```typescript
function getName(user: User): string {
  if (!user) return ''; // User не может быть null по типу
  if (!user.name) return ''; // name: string, не может быть null
  return user.name;
}
```

**Стало:**
```typescript
function getName(user: User): string {
  return user.name;
}
```

### Правило 2.3: Убери defensive programming там, где он не нужен

Проверки нужны **на границах** системы (публичный API, пользовательский ввод). Внутри модуля между приватными функциями — **не нужны**.

**Было:**
```typescript
function calculateTotal(items: Item[]): number {
  if (!items) return 0; // Внутренняя функция, items всегда валидный
  if (!Array.isArray(items)) return 0; // TypeScript не позволит передать не-массив
  if (items.length === 0) return 0; // Можно, но избыточно
  
  return items.reduce((sum, item) => sum + item.price, 0);
}
```

**Стало:**
```typescript
function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}
```

**Правило:** Проверки на `null/undefined/length` нужны **только** в публичных функциях. Внутри модуля — доверяй типам.

### Критерий завершения Pass 2

Проверь код:
- ✅ Нет дублирующих проверок между вызовами.
- ✅ Внутренние функции не проверяют то, что гарантирует TypeScript.
- ✅ Defensive programming применяется **только** на границах системы.

## Pass 3 — Извлечение классов из мега-функций

**Цель:** Превратить функции на 200+ строк с состоянием в замыканиях в **классы** с чётким жизненным циклом.

### Когда превращать функцию в класс

1. **Функция > 100 строк** и содержит несколько локальных переменных, используемых в разных частях.
2. **Функция с 5+ аргументами** или передаёт одни и те же параметры вглубь вызовов.
3. **Состояние в замыканиях:** `let state = {}; function inner() { state.x = ...; }`.
4. **Сложная последовательность шагов:** Функция делает 5+ разных операций подряд.

### Паттерн трансформации

**Было (мега-функция):**
```typescript
export async function processOrder(
  orderId: string,
  userId: string,
  items: Item[],
  config: Config,
  logger: Logger
): Promise<Result> {
  let totalPrice = 0;
  let appliedDiscounts: Discount[] = [];
  let validationErrors: string[] = [];
  
  // 50 строк валидации
  for (const item of items) {
    if (!item.id) validationErrors.push(`Invalid item`);
    // ...
  }
  
  // 50 строк расчёта
  for (const item of items) {
    totalPrice += item.price * item.quantity;
    // ...
  }
  
  // 50 строк применения скидок
  if (config.discountsEnabled) {
    // ...
  }
  
  // 50 строк сохранения
  await saveOrder({ orderId, userId, totalPrice, appliedDiscounts });
  logger.info('Order processed');
  
  return { success: true, orderId, totalPrice };
}
```

**Стало (класс):**
```typescript
//------------------- Public API ------------------//

export async function processOrder(
  orderId: string,
  userId: string,
  items: Item[],
  config: Config,
  logger: Logger
): Promise<Result> {
  const processor = new OrderProcessor(orderId, userId, items, config, logger);
  return processor.execute();
}

//------------------- Order Processor ------------------//

class OrderProcessor {
  private totalPrice = 0;
  private appliedDiscounts: Discount[] = [];
  private validationErrors: string[] = [];
  
  constructor(
    private readonly orderId: string,
    private readonly userId: string,
    private readonly items: Item[],
    private readonly config: Config,
    private readonly logger: Logger
  ) {}
  
  async execute(): Promise<Result> {
    this.validate();
    this.calculate();
    this.applyDiscounts();
    await this.save();
    
    return { success: true, orderId: this.orderId, totalPrice: this.totalPrice };
  }
  
  private validate(): void {
    for (const item of this.items) {
      if (!item.id) this.validationErrors.push(`Invalid item`);
    }
    if (this.validationErrors.length > 0) {
      throw new ValidationError(this.validationErrors);
    }
  }
  
  private calculate(): void {
    this.totalPrice = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }
  
  private applyDiscounts(): void {
    if (!this.config.discountsEnabled) return;
    // ...
  }
  
  private async save(): Promise<void> {
    await saveOrder({
      orderId: this.orderId,
      userId: this.userId,
      totalPrice: this.totalPrice,
      appliedDiscounts: this.appliedDiscounts
    });
    this.logger.info('Order processed');
  }
}
```

### Правило 3.1: Состояние → Поля класса

Все `let` переменные, которые мутируются в процессе выполнения → `private` поля класса.

### Правило 3.2: Шаги последовательности → Методы

Если в функции есть комментарии вида `// Step 1`, `// Validation`, `// Calculate` — каждый блок становится отдельным методом.

### Правило 3.3: Аргументы → Constructor

Все параметры, которые используются в нескольких местах → `readonly` поля, инициализируемые в конструкторе.

### Правило 3.4: Публичная функция остаётся

Экспортированная функция **не удаляется** — она становится тонкой обёрткой над классом. Это сохраняет **API**.

### Правило 3.5: НЕ создавай 10 DTO для передачи одних и тех же данных

**Антипаттерн (плохо):**
```typescript
interface ValidateInput { orderId: string; userId: string; items: Item[]; }
interface CalculateInput { orderId: string; userId: string; items: Item[]; }
interface DiscountInput { orderId: string; userId: string; items: Item[]; config: Config; }
// ... и так далее

function validate(input: ValidateInput) { ... }
function calculate(input: CalculateInput) { ... }
function applyDiscount(input: DiscountInput) { ... }
```

**Правильно (класс):**
```typescript
class OrderProcessor {
  constructor(
    private orderId: string,
    private userId: string,
    private items: Item[],
    private config: Config
  ) {}
  
  private validate() { /* использует this.orderId, this.items */ }
  private calculate() { /* использует this.items */ }
  private applyDiscount() { /* использует this.config, this.items */ }
}
```

**Почему:** Код должен быть **простым для восприятия**. Класс с полями читается легче, чем 10 DTO с одинаковыми полями.

### Критерий завершения Pass 3

Проверь код:
- ✅ Функции не длиннее 40 строк (кроме фабричных/экспортируемых обёрток).
- ✅ Нет функций с 5+ аргументами (либо DTO, либо класс).
- ✅ Состояние не хранится в замыканиях — только в полях класса.
- ✅ Экспортируемые функции остались, но стали тонкими обёртками.

## Pass 4 — Структурирование и именование

**Цель:** Навести финальный лоск — правильный порядок элементов, чёткие имена, визуальная структура.

### Правило 4.1: Порядок элементов в модуле

**Канонический порядок (сверху вниз):**
1. Импорты
2. Константы
3. Интерфейсы/типы
4. Публичные функции/классы (экспортируемые)
5. Приватные функции/классы
6. Утилитарные функции

**Визуальное разделение через заголовки:**
```typescript
//------------------- Constants ---------------------//
const MAX_RETRY = 3;

//--------------------- Types -----------------------//
interface OrderData { ... }

//------------------- Public API --------------------//
export function processOrder(...) { ... }

//---------------- Order Processor ------------------//
class OrderProcessor { ... }

//--------------------- Utils -----------------------//
function formatPrice(value: number): string { ... }
```

### Правило 4.2: Порядок элементов в классе

**Канонический порядок (сверху вниз):**
1. Приватные поля (состояние)
2. Конструктор
3. Публичные свойства (геттеры/сеттеры)
4. Публичные методы
5. Приватные методы
6. Утилитарные методы (статические/вспомогательные)

### Правило 4.3: Одноуровневые типы

Не вкладывай типы друг в друга. Создавай **отдельный интерфейс** для каждого "объекта", даже если он используется один раз.

**Плохо:**
```typescript
function process(data: { items: { id: string; meta: { tags: string[] } }[] }): void { ... }
```

**Хорошо:**
```typescript
interface ItemMeta {
  tags: string[];
}

interface Item {
  id: string;
  meta: ItemMeta;
}

interface ProcessData {
  items: Item[];
}

function process(data: ProcessData): void { ... }
```

### Правило 4.4: Максимумы и ограничения

- **Функция/метод:** Максимум 30-40 строк (если больше — разбивай).
- **Вложенность:** Максимум 3-4 уровня (if/for/while).
- **Аргументы функции:** Максимум 4 (если больше — группируй в объект/класс).
- **Длина строки:** Максимум 100-120 символов.
- **Цепочка методов:** Максимум 2-3 вызова подряд (если больше — разбивай на переменные).

### Правило 4.5: Магические числа и строки

Все конфигурационные значения → константы с говорящими именами.

**Плохо:**
```typescript
if (retryCount > 3) { ... }
setTimeout(() => ..., 5000);
if (status === 'pending') { ... }
```

**Хорошо:**
```typescript
const MAX_RETRY_COUNT = 3;
const RETRY_DELAY_MS = 5000;
const STATUS_PENDING = 'pending';

if (retryCount > MAX_RETRY_COUNT) { ... }
setTimeout(() => ..., RETRY_DELAY_MS);
if (status === STATUS_PENDING) { ... }
```

### Правило 4.6: Чистота булевых выражений

Если условие содержит 2+ логических оператора → выносим в переменную или метод.

**Плохо:**
```typescript
if (user.age > 18 && user.hasPermission && !user.isBanned) { ... }
```

**Хорошо:**
```typescript
const canAccess = user.age > 18 && user.hasPermission && !user.isBanned;
if (canAccess) { ... }

// Или ещё лучше:
if (user.canAccessContent()) { ... }
```

### Правило 4.7: Инкапсуляция условий в классы

Логика проверок должна **принадлежать объекту**, владеющему данными.

**Плохо:**
```typescript
if (order.total > 100 && order.user.isPremium) {
  applyDiscount(order);
}
```

**Хорошо:**
```typescript
if (order.canApplyDiscount()) {
  applyDiscount(order);
}

// В классе Order:
class Order {
  canApplyDiscount(): boolean {
    return this.total > 100 && this.user.isPremium;
  }
}
```

### Правило 4.8: Императивное > Функционального

Если можно написать простой цикл — пиши цикл. Не надо `map/filter/reduce`, если это не улучшает читаемость.

**Плохо (переусложнение):**
```typescript
const result = items
  .filter(x => x.active)
  .map(x => ({ ...x, price: x.price * 1.2 }))
  .reduce((acc, x) => acc + x.price, 0);
```

**Хорошо (если логика сложная):**
```typescript
let total = 0;
for (const item of items) {
  if (!item.active) continue;
  const adjustedPrice = item.price * 1.2;
  total += adjustedPrice;
}
```

### Правило 4.9: Прямые импорты типов

Используй типы напрямую (добавляй импорты), вместо `typeof` или `SomeType["field"]`.

**Плохо:**
```typescript
type UserType = typeof user;
type NameType = User["name"];
```

**Хорошо:**
```typescript
import { User, UserName } from './types';
```

### Правило 4.10: Запреты

- ❌ **Вложенные стрелочные функции** с логикой (только короткие lambda-expression).
- ❌ **Вложенные тернарные операторы** (только однострочные тернары).
- ❌ **Методы, целиком завёрнутые в try-catch** (только на верхнем уровне публичного API).
- ❌ **Закомментированный код** (для истории есть Git).
- ❌ **Side Effects в геттерах** (методы `get...` не должны менять состояние).
- ❌ **Мутация входных параметров** (immutability, избегай побочных эффектов).
- ❌ **Boolean-флаги, меняющие логику** (лучше разделить на две функции).

### Критерий завершения Pass 4

Проверь код:
- ✅ Элементы модуля/класса упорядочены по каноническому порядку.
- ✅ Визуальные заголовки разделяют секции.
- ✅ Нет магических чисел/строк.
- ✅ Типы одноуровневые, с отдельными интерфейсами.
- ✅ Булевые выражения чистые (вынесены в переменные/методы).
- ✅ Все запреты соблюдены.

## Фаза 5: Финальная проверка

Перед завершением рефакторинга проверь:

### Чек-лист качества кода

1. **API не изменился:**
   - Сигнатуры экспортируемых функций/классов идентичны.
   - Поведение осталось прежним (если есть тесты — запусти их).

2. **Код плоский:**
   - Вложенность не превышает 3 уровня.
   - Нет 10-этажных цепочек методов.

3. **Код простой:**
   - Функции не длиннее 40 строк.
   - Нет функций с 5+ аргументами.
   - Мега-функции превращены в классы.

4. **Код чистый:**
   - Нет избыточных проверок.
   - Нет дублирующих валидаций.
   - Defensive programming только на границах.

5. **Код структурированный:**
   - Порядок элементов канонический.
   - Визуальные заголовки разделяют секции.
   - Типы одноуровневые.

6. **Запреты соблюдены:**
   - Нет закомментированного кода.
   - Нет магических чисел/строк.
   - Нет мутаций входных параметров.

Если хотя бы одна проверка провалена — **вернись к соответствующему Pass** и исправь.

## Фаза 6: Отчёт пользователю

Выдай короткое резюме:
1. **Изменённые файлы:** [список файлов].
2. **Выполненные трансформации:**
   - Pass 1: Убрано X уровней вложенности, распакованы Y цепочек методов.
   - Pass 2: Удалено Z избыточных проверок.
   - Pass 3: Извлечено N классов из мега-функций.
   - Pass 4: Упорядочено M модулей/классов, вынесено K констант.
3. **Метрики до/после:**
   - Средняя длина функции: было 120 строк → стало 35 строк.
   - Максимальная вложенность: было 6 уровней → стало 2 уровня.
4. **Публичный API:** Не изменился ✅.
5. **Рекомендация:** Запусти тесты (если есть) для проверки работоспособности.

## Дополнительные правила

### Работа с легаси-кодом

Если код **критически плох** (500+ строк в одной функции, 10+ уровней вложенности):
1. Предложи **постепенный рефакторинг** (по частям).
2. Начни с самых проблемных участков (Pass 1 → Pass 3).
3. Остальное оставь на следующие итерации.

### Работа без тестов

Если тестов нет:
1. Предупреди пользователя о рисках.
2. Делай **минимальные изменения** за раз.
3. Предложи добавить тесты до рефакторинга (через `implement`).

### Терминология и стиль

- Используй термины из `tech.md` проекта (если они есть).
- Пиши кратко, но **точно**. Не добавляй "лишних абстракций" — код должен быть **простым**, а не "красивым".
- Если можно написать 5 строк императивного кода или 1 строку функционального, но непонятного — выбирай императивный.