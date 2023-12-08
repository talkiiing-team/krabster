import { Cache, CacheOptions, MemoizedFn } from './cache'

const DEFAULT_MAX_ENTRIES = 1_000
const DEFAULT_TTL = 60_000_000

const getKey = (
  key: string,
  args: Array<unknown>,
  transformArgs: (...args: Array<unknown>) => unknown = (...args) => args,
): string => {
  const transformed = transformArgs(...args)
  return `${key}(${JSON.stringify(transformed)})`
}

type StoredData = {
  data: unknown
  expiresAt: number
}

export type InMemoryCacheOptions = {
  maxEntries?: number
}

export class InMemoryCache implements Cache {
  private readonly cache: Map<string, StoredData> = new Map()

  constructor(private readonly options: InMemoryCacheOptions = {}) {
    this.options.maxEntries ??= DEFAULT_MAX_ENTRIES
  }

  memoized<T extends Array<unknown>, R>(
    key: string,
    fn: (...args: T) => Promise<R>,
    options?: Partial<CacheOptions<T>>,
  ): MemoizedFn<T, R> {
    const ttl = options?.ttl ?? DEFAULT_TTL

    const memoizedVersion = async (...args: T): Promise<R> => {
      const entryKey = getKey(
        key,
        args,
        options?.transformKey as (...args: Array<unknown>) => unknown,
      )
      const cached = this.cache.get(entryKey)

      if (cached && cached.expiresAt > Date.now()) {
        console.log('Cache hit', entryKey)
        return cached.data as R
      }

      console.log('Cache miss', entryKey)

      const data = await fn(...args)
      this.cache.set(entryKey, { data, expiresAt: Date.now() + ttl })

      return data
    }

    memoizedVersion.invalidateAll = (): Promise<void> => {
      const keys = [...this.cache.keys()].filter(entryKey =>
        entryKey.startsWith(`${key}(`),
      )
      keys.forEach(key => this.cache.delete(key))

      return Promise.resolve()
    }

    memoizedVersion.invalidate = (...args: T): Promise<void> => {
      const entryKey = getKey(key, args)
      this.cache.delete(entryKey)

      return Promise.resolve()
    }

    return memoizedVersion
  }

  invalidate(fnName: string): Promise<void> {
    const keys = [...this.cache.keys()].filter(key => key.startsWith(fnName))

    keys.forEach(key => this.cache.delete(key))

    return Promise.resolve()
  }

  getDebugInfo(): Promise<{ entries: number }> {
    return Promise.resolve({ entries: this.cache.size })
  }
}
