import { initTRPC } from '@trpc/server'
import { AppContainer } from './container'

export type Context = {
  container: AppContainer
}

const t = initTRPC.context<Context>().create()

export const router = t.router
export const middleware = t.middleware
export const publicProcedure = t.procedure
