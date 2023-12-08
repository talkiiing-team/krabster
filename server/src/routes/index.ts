import { router } from '@sovok/server/trpc'

import { music } from './music'

export const mainRouter = router({
  music,
})
