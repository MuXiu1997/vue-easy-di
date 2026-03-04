<h1 align="center">vue-easy-di</h1>
<div align="center">
<a href="https://github.com/MuXiu1997/vue-easy-di/actions/workflows/ci.yml"><img alt="CI" src="https://img.shields.io/github/actions/workflow/status/MuXiu1997/vue-easy-di/ci.yml?branch=main&style=flat-square&label=CI"></a>
<a href="https://www.npmjs.com/package/@muxiu1997/vue-easy-di"><img alt="npm version" src="https://img.shields.io/npm/v/@muxiu1997/vue-easy-di?style=flat-square&color=orange"></a>
<a href="LICENSE"><img alt="LICENSE" src="https://img.shields.io/github/license/MuXiu1997/vue-easy-di?style=flat-square"></a>
</div>
<br/>
<div align="center">Type-safe dependency injection for <a href="https://vuejs.org/">Vue</a>, simplified into a single composable.</div>

---

## 📦 Install

```bash
npm install @muxiu1997/vue-easy-di
```

## 📖 Usage

### Basic

```typescript
import defineUseDependencyInjection from '@muxiu1997/vue-easy-di'

// Define a DI composable
const useFoo = defineUseDependencyInjection<Foo>()

// Provide in parent component
useFoo('provide', () => new Foo())

// Inject in child component
const foo = useFoo() // foo: Foo | undefined
const foo = useFoo('inject') // equivalent
```

### With Default Initializer

```typescript
// The initializer is called automatically in provide mode
const useFoo = defineUseDependencyInjection(() => new Foo())

useFoo('provide') // uses default initializer
useFoo('provide', () => new Bar()) // overrides initializer
const foo = useFoo() // foo: Foo | undefined
```

### With Inject Default

```typescript
// Fallback value when no provider is found
const useFoo = defineUseDependencyInjection<Foo>({
  injectDefault: () => Foo.empty(),
})

const foo = useFoo() // foo: Foo (never undefined)
```

### With Throw On No Provider

```typescript
// Throws when no provider is found
const useFoo = defineUseDependencyInjection<Foo>({
  throwOnNoProvider: () => new Error('Foo provider is required'),
})

const foo = useFoo() // foo: Foo (throws if no provider)
```

### Override Options at Inject Site

```typescript
const useFoo = defineUseDependencyInjection<Foo>()

// Override injectDefault
const foo = useFoo('inject', { injectDefault: () => Foo.empty() })

// Override throwOnNoProvider
const foo = useFoo('inject', { throwOnNoProvider: () => new Error('missing') })
```

## 🛠 Development

### Prerequisites

- [Node.js](https://nodejs.org/) >= 24
- [pnpm](https://pnpm.io/)

### Setup

```bash
git clone https://github.com/MuXiu1997/vue-easy-di.git
cd vue-easy-di
pnpm install
```

### Scripts

- `pnpm run lint` — Lint and auto-fix.
- `pnpm run test` — Run tests with type checking.
- `pnpm run coverage` — Run tests with coverage report.
- `pnpm run build` — Build the library.

## 📜 License

This project is licensed under the [MIT License](LICENSE).
