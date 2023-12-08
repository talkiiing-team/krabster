import { Injection } from '@sovok/shared'

export type CacheOptions<T extends Array<unknown>> = {
  /**
   * Time to live in ms
   * @default 60_000_000
   */
  ttl?: number

  transformKey?: (...args: T) => unknown
}

export type CacheDebugInfo = {
  entries: number
}

type Unpromise<T> = T extends Promise<infer U> ? U : T

// deno-lint-ignore no-explicit-any
export type Memoized<F extends (...args: Array<any>) => Promise<any>> =
  MemoizedFn<Parameters<F>, Unpromise<ReturnType<F>>>

export type MemoizedFn<T extends Array<unknown>, R> = {
  (...args: T): Promise<R>
  invalidateAll(): Promise<void>
  invalidate(...args: T): Promise<void>
}

export interface Cache {
  memoized<T extends Array<unknown>, R>(
    key: string,
    fn: (...args: T) => Promise<R>,
    options?: Partial<CacheOptions<T>>,
  ): MemoizedFn<T, R>

  invalidate(fnName: string): Promise<void>

  getDebugInfo(): Promise<CacheDebugInfo>
}

export type CacheInjection = Injection<'cache', Cache>
