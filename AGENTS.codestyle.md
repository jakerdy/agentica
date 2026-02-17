# Code Style Guide для AI Агентов

Принципы: **Плоский (Flat), Простой (Simple), Структурированный (Structured)**.

## Структура модуля (сверху вниз)

1. **Импорты**
2. **Константы** — магические числа/строки выносятся сюда
3. **Интерфейсы/типы** — одноуровневые, без вложенности
4. **Публичные функции/классы** — экспортируемые
5. **Приватные функции/классы** — внутренние реализации
6. **Утилитарные функции** — вспомогательные

Визуальное разделение через заголовки:
```typescript
//------------------- Constants ---------------------//
//---------------------- Types ----------------------//
//------------------- Public API --------------------//
//---------------- Order Processor ------------------//
//---------------------- Utils ----------------------//
```

## Структура класса (сверху вниз)

1. **Приватные поля** — состояние класса
2. **Конструктор**
3. **Публичные свойства** — геттеры/сеттеры
4. **Публичные методы**
5. **Приватные методы**
6. **Утилитарные методы** — статические/вспомогательные

## Плоскость (Flatness)

### ✅ Ранний возврат (Early Return)
```typescript
// ❌ Плохо
function process(data: Data): Result {
  if (data.isValid) {
    if (data.hasPermission) {
      // логика
    }
  }
}

// ✅ Хорошо
function process(data: Data): Result {
  if (!data.isValid) return null;
  if (!data.hasPermission) return null;
  // логика на нулевом уровне
}
```

### ✅ Избегай `else` после `return`
```typescript
// ❌ Плохо
if (condition) {
  return value;
} else {
  doSomething();
}

// ✅ Хорошо
if (condition) return value;
doSomething();
```

### ✅ Распаковка цепочек методов
```typescript
// ❌ Плохо
const result = data.filter(x => x.active).map(x => x.value).reduce((a, b) => a + b, 0);

// ✅ Хорошо
const activeItems = data.filter(x => x.active);
const values = activeItems.map(x => x.value);
const result = values.reduce((a, b) => a + b, 0);
```

### ✅ Извлечение функций из вложенных блоков
```typescript
// ❌ Плохо
items.forEach(item => {
  if (item.type === 'A') {
    // 30 строк логики
  }
});

// ✅ Хорошо
items.forEach(item => {
  if (item.type === 'A') return handleTypeA(item);
});

function handleTypeA(item: Item): void { ... }
```

## Простота (Simplicity)

### ✅ Превращай мега-функции в классы
**Когда:**
- Функция > 100 строк
- 5+ аргументов
- Состояние в замыканиях (`let state = ...`)
- Сложная последовательность шагов

**Как:**
```typescript
// ❌ Плохо — мега-функция с состоянием
export function process(a, b, c, d, e): Result {
  let state1 = 0;
  let state2 = [];
  // 200 строк логики
}

// ✅ Хорошо — класс с полями
export function process(a, b, c, d, e): Result {
  const processor = new Processor(a, b, c, d, e);
  return processor.execute();
}

class Processor {
  private state1 = 0;
  private state2: string[] = [];
  
  constructor(
    private readonly a: string,
    private readonly b: string,
    // ...
  ) {}
  
  execute(): Result {
    this.step1();
    this.step2();
    return this.buildResult();
  }
  
  private step1(): void { ... }
  private step2(): void { ... }
}
```

### ✅ НЕ создавай 10 DTO для передачи одних и тех же данных
```typescript
// ❌ Плохо
interface ValidateInput { orderId: string; items: Item[]; }
interface CalculateInput { orderId: string; items: Item[]; }
// ...ещё 8 интерфейсов с теми же полями

// ✅ Хорошо — используй класс
class OrderProcessor {
  constructor(
    private orderId: string,
    private items: Item[]
  ) {}
  
  private validate() { /* использует this.orderId, this.items */ }
  private calculate() { /* использует this.items */ }
}
```

### ✅ Одноуровневые типы
```typescript
// ❌ Плохо
function process(data: { items: { id: string; meta: { tags: string[] } }[] }): void {}

// ✅ Хорошо
interface ItemMeta { tags: string[]; }
interface Item { id: string; meta: ItemMeta; }
interface ProcessData { items: Item[]; }

function process(data: ProcessData): void {}
```

### ✅ Императивное > Функционального
Если можно написать простой цикл — пиши цикл. Не городи сложные `map/filter/reduce`.

```typescript
// ❌ Плохо (если логика сложная)
const result = items
  .filter(x => x.active)
  .map(x => ({ ...x, price: x.price * 1.2 }))
  .reduce((acc, x) => acc + x.price, 0);

// ✅ Хорошо
let total = 0;
for (const item of items) {
  if (!item.active) continue;
  const adjustedPrice = item.price * 1.2;
  total += adjustedPrice;
}
```

## Чистота (Cleanliness)

### ✅ Не проверяй дважды
```typescript
// ❌ Плохо
function handleUser(user: User): void {
  if (!user) throw new Error('User required');
  processUser(user); // внутри тоже проверяет user
}
function processUser(user: User): void {
  if (!user) throw new Error('User required'); // ДУБЛЬ
}

// ✅ Хорошо
function handleUser(user: User): void {
  if (!user) throw new Error('User required');
  processUser(user); // доверяем вызывающему
}
function processUser(user: User): void {
  // Только логика
}
```

### ✅ Доверяй типизации
Если TypeScript гарантирует, что значение не `null/undefined` — не проверяй вручную.

```typescript
// ❌ Плохо
function getName(user: User): string {
  if (!user) return ''; // User не может быть null
  return user.name;
}

// ✅ Хорошо
function getName(user: User): string {
  return user.name;
}
```

### ✅ Defensive programming только на границах
Проверки нужны **на границах** системы (публичный API, пользовательский ввод). Внутри модуля между приватными функциями — **не нужны**.

### ✅ Магические числа и строки → константы
```typescript
// ❌ Плохо
if (retryCount > 3) { ... }
setTimeout(() => ..., 5000);

// ✅ Хорошо
const MAX_RETRY_COUNT = 3;
const RETRY_DELAY_MS = 5000;

if (retryCount > MAX_RETRY_COUNT) { ... }
setTimeout(() => ..., RETRY_DELAY_MS);
```

### ✅ Чистота булевых выражений
```typescript
// ❌ Плохо
if (user.age > 18 && user.hasPermission && !user.isBanned) { ... }

// ✅ Хорошо
const canAccess = user.age > 18 && user.hasPermission && !user.isBanned;
if (canAccess) { ... }

// ✅ Ещё лучше — инкапсуляция в класс
if (user.canAccessContent()) { ... }
```

### ✅ Инкапсуляция условий в классы
Логика проверок должна **принадлежать объекту**, владеющему данными.

```typescript
// ❌ Плохо
if (order.total > 100 && order.user.isPremium) {
  applyDiscount(order);
}

// ✅ Хорошо
if (order.canApplyDiscount()) {
  applyDiscount(order);
}
```

## Ограничения

- **Функция/метод:** Максимум 30-40 строк *(если больше — разбивай)*
- **Вложенность:** Максимум 3-4 уровня *(if/for/while)*
- **Аргументы функции:** Максимум 4 *(если больше — группируй в объект/класс)*
- **Длина строки:** Максимум 100-120 символов
- **Цепочка методов:** Максимум 2-3 вызова *(если больше — разбивай на переменные)*

## Запреты

- ❌ **Вложенные стрелочные функции** с логикой *(только короткие lambda)*
- ❌ **Вложенные тернарные операторы** *(только однострочные тернары)*
- ❌ **Методы, целиком завёрнутые в try-catch** *(только на верхнем уровне API)*
- ❌ **Закомментированный код** *(для истории есть Git)*
- ❌ **Side Effects в геттерах** *(методы `get...` не должны менять состояние)*
- ❌ **Мутация входных параметров** *(immutability, избегай побочных эффектов)*
- ❌ **Boolean-флаги, меняющие логику функции** *(лучше разделить на две функции)*
- ❌ **Использование `typeof` или `Type["field"]`** *(используй прямые импорты типов)*

## Антипаттерны

### ❌ 10-этажные конструкции
Вложенность > 3 уровней, цепочки методов на 5+ операций.

**Решение:** Pass 1 (Flatten) — ранний возврат, извлечение функций, распаковка цепочек.

### ❌ Мега-функции
Функции на 100+ строк с состоянием в замыканиях.

**Решение:** Pass 3 — превратить в класс с полями и методами.

### ❌ Избыточные проверки
3-4 `if` перед простой операцией, дублирование валидаций.

**Решение:** Pass 2 — убрать дубли, доверять типизации, defensive programming только на границах.

### ❌ Паранойя проверок
```typescript
function calculateTotal(items: Item[]): number {
  if (!items) return 0; // TypeScript не позволит передать null
  if (!Array.isArray(items)) return 0; // Redundant
  if (items.length === 0) return 0; // Избыточно
  return items.reduce((sum, item) => sum + item.price, 0);
}
```

**Решение:** Доверяй типам, проверки только на границах публичного API.

### ❌ Функция с 8 аргументами
```typescript
function process(a, b, c, d, e, f, g, h): Result { ... }
```

**Решение:** Группируй в объект (DTO) или используй класс.

## Визуальная структура

### ✅ Используй заголовки для разделения секций
```typescript
//------------------- Constants ---------------------//

const MAX_RETRY = 3;
const TIMEOUT_MS = 5000;

//--------------------- Types -----------------------//

interface User { ... }
interface Order { ... }

//------------------- Public API --------------------//

export function createOrder(...) { ... }

//---------------- Order Processor ------------------//

class OrderProcessor { ... }

//--------------------- Utils -----------------------//

function formatPrice(value: number): string { ... }
```

### ✅ Порядок — это часть качества кода
Соблюдай канонический порядок элементов в модулях и классах. Это делает код **предсказуемым** и **легко читаемым**.

---

**Главный принцип:** Код должен быть **простым для восприятия человеком**. Если что-то выглядит сложно — упрости. Если непонятно за 10 секунд — рефактори.
