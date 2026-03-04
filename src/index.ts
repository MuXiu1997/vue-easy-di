import type { InjectionKey } from 'vue-demi'

import { inject, provide } from 'vue-demi'

export interface WithInjectDefault<T> {
  injectDefault: T | (() => T)
}

export interface WithThrowOnNoProvider {
  throwOnNoProvider: () => Error
}

export type Options<T> = {
  key?: InjectionKey<T> | string
} & (WithInjectDefault<T> | WithThrowOnNoProvider)

export type OverrideOptions<T> = (WithInjectDefault<T> | WithThrowOnNoProvider)

function isWithInjectDefault<T>(options: unknown): options is WithInjectDefault<T> {
  return typeof options === 'object' && options != null && 'injectDefault' in options && options.injectDefault != null
}

function isWithThrowOnNoProvider(options: unknown): options is WithThrowOnNoProvider {
  return typeof options === 'object' && options != null && 'throwOnNoProvider' in options && options.throwOnNoProvider != null
}

/**
 * A composable for dependency injection in a Vue component. It can be used in 'inject' or 'provide' mode.
 * It is not initialized, so in provide mode, initializer needs to be passed in
 * @param mode=inject - 'provide' or 'inject'
 * @param initializer - initializer for provide mode
 * @param overrideOptions - override options for inject mode
 * @see defineUseDependencyInjection
 */
export interface UseDependencyInjection<T> {
  (mode: 'provide', initializer: () => T): NonNullable<T>

  (): T
  (mode: 'inject'): T

  (mode: 'inject', overrideOptions: OverrideOptions<T>): NonNullable<T>
  (overrideOptions: OverrideOptions<T>): NonNullable<T>
}

/**
 * A composable for dependency injection in a Vue component. It can be used in 'inject' or 'provide' mode.
 * It is initialized, so in provide mode, initializer is not needed, and still can be passed in to override the default initializer
 */
export interface UseInitiatedDependencyInjection<T> extends UseDependencyInjection<T> {
  (mode: 'provide'): NonNullable<T>
}

/**
 * Creates a DI composable without an initializer or inject safety net.
 *
 * In provide mode, an initializer must be passed at call site.
 * In inject mode, returns `T | undefined` — the caller is responsible for handling the missing-provider case.
 *
 * @param [options] - Configuration options.
 * @param [options.key] - Custom injection key. A unique Symbol is generated if omitted.
 * @returns A composable that can be called in 'provide' or 'inject' (default) mode.
 *
 * @example
 * const useFoo = defineUseDependencyInjection<Foo>()
 * // or with a custom key
 * const useFoo = defineUseDependencyInjection<Foo>({ key: Symbol('foo') })
 *
 * useFoo('provide', () => new Foo()) // in parent
 * const foo = useFoo()               // in child, foo: Foo | undefined
 */
export default function defineUseDependencyInjection<T extends NonNullable<unknown>>(
  options?: Pick<Options<T>, 'key'>,
): UseDependencyInjection<T | undefined>

/**
 * Creates a DI composable without an initializer, but with an inject safety net.
 *
 * In provide mode, an initializer must be passed at call site.
 * In inject mode, either falls back to `injectDefault` or throws via `throwOnNoProvider`,
 * so the return type is always `T`.
 *
 * @param options - Configuration options.
 * @param [options.key] - Custom injection key. A unique Symbol is generated if omitted.
 * @param options.injectDefault - Default value (or factory) used when no provider is found.
 * @param options.throwOnNoProvider - Factory that returns an Error to throw when no provider is found.
 * @returns A composable that can be called in 'provide' or 'inject' (default) mode.
 *
 * @example
 * const useFoo = defineUseDependencyInjection<Foo>({
 *   injectDefault: () => Foo.empty(),
 * })
 * const foo = useFoo() // foo: Foo (never undefined)
 *
 * @example
 * const useFoo = defineUseDependencyInjection<Foo>({
 *   throwOnNoProvider: () => new Error('Foo provider is required'),
 * })
 * const foo = useFoo() // foo: Foo (throws if no provider)
 */
export default function defineUseDependencyInjection<T extends NonNullable<unknown>>(
  options: Options<T>,
): UseDependencyInjection<T>

/**
 * Creates a DI composable with a default initializer.
 *
 * In provide mode, the initializer is called automatically (can be overridden).
 * In inject mode, returns `T | undefined` — the caller is responsible for handling the missing-provider case.
 *
 * @param initializer - Factory function called in provide mode to create the value.
 * @param [options] - Configuration options.
 * @param [options.key] - Custom injection key. A unique Symbol is generated if omitted.
 * @returns A composable that can be called in 'provide' or 'inject' (default) mode.
 *
 * @example
 * const useFoo = defineUseDependencyInjection(() => new Foo())
 *
 * useFoo('provide')                   // uses default initializer
 * useFoo('provide', () => new Bar())  // overrides initializer
 * const foo = useFoo()                // foo: Foo | undefined
 */
export default function defineUseDependencyInjection<T extends NonNullable<unknown>>(
  initializer: () => T,
  options?: Pick<Options<T>, 'key'>,
): UseInitiatedDependencyInjection<T | undefined>

/**
 * Creates a DI composable with both a default initializer and an inject safety net.
 *
 * In provide mode, the initializer is called automatically (can be overridden).
 * In inject mode, either falls back to `injectDefault` or throws via `throwOnNoProvider`,
 * so the return type is always `T`.
 *
 * @param initializer - Factory function called in provide mode to create the value.
 * @param options - Configuration options.
 * @param [options.key] - Custom injection key. A unique Symbol is generated if omitted.
 * @param [options.injectDefault] - Default value (or factory) used when no provider is found.
 * @param [options.throwOnNoProvider] - Factory that returns an Error to throw when no provider is found.
 * @returns A composable that can be called in 'provide' or 'inject' (default) mode.
 *
 * @example
 * const useFoo = defineUseDependencyInjection(() => new Foo(), {
 *   throwOnNoProvider: () => new Error('Foo provider is required'),
 * })
 *
 * useFoo('provide')    // uses default initializer
 * const foo = useFoo() // foo: Foo (throws if no provider)
 */
export default function defineUseDependencyInjection<T extends NonNullable<unknown>>(
  initializer: () => T,
  options: Partial<Options<T>>,
): UseInitiatedDependencyInjection<T>

export default function defineUseDependencyInjection<T extends NonNullable<unknown>>(
  arg0: (() => T) | Partial<Options<T>> | undefined = undefined,
  arg1: Partial<Options<T>> | undefined = undefined,
): UseInitiatedDependencyInjection<T | undefined> {
  let initializer: (() => T) | undefined
  let options: Partial<Options<T>> = {}
  // two arguments
  if (arg0 != null && arg1 != null) {
    if (typeof arg0 !== 'function') {
      throw new TypeError('[defineUseDependencyInjection] first argument must be a initializer function when two arguments are provided')
    }
    initializer = arg0 as () => T
    options = arg1
  }
  // one argument
  else if (arg0 != null) {
    // first argument is initializer
    if (typeof arg0 === 'function') {
      initializer = arg0
    }
    // first argument is options
    else {
      options = arg0
    }
  }
  // no argument do nothing

  // eslint-disable-next-line symbol-description
  const injectKey = options.key ?? (Symbol() as InjectionKey<T>)
  return function UseDependencyInjection($arg0: unknown, $arg1: unknown) {
    // mode: 'provide'

    if ($arg0 === 'provide') {
      if ($arg1 != null && typeof $arg1 !== 'function') {
        throw new TypeError('[useDependencyInjection] second argument must be a function when mode is \'provide\'')
      }
      const overrideInitializer = $arg1 as (() => T) | undefined
      const value = overrideInitializer?.() ?? initializer?.()
      if (value == null)
        throw new Error(`UseDependencyInjection value \`${injectKey.toString()}\` is not initialized`)
      provide(injectKey, value)

      return value
    }

    // mode: 'inject'

    const overrideOptions = ($arg0 === 'inject' ? ($arg1 ?? {}) : ($arg0 ?? {})) as OverrideOptions<T>

    const finalOptions: Partial<WithInjectDefault<T> & WithThrowOnNoProvider> = { ...options }
    // override options has higher priority than options
    if (isWithInjectDefault<T>(overrideOptions)) {
      finalOptions.injectDefault = overrideOptions.injectDefault
      finalOptions.throwOnNoProvider = undefined
    }
    else if (isWithThrowOnNoProvider(overrideOptions)) {
      finalOptions.throwOnNoProvider = overrideOptions.throwOnNoProvider
      finalOptions.injectDefault = undefined
    }

    if (finalOptions.injectDefault != null) {
      return inject(injectKey, finalOptions.injectDefault, true)
    }

    const value = inject(injectKey)
    if (value == null && isWithThrowOnNoProvider(finalOptions)) {
      throw finalOptions.throwOnNoProvider()
    }

    return value
  } as UseInitiatedDependencyInjection<T | undefined>
}
