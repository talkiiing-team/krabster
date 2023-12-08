import { router } from '@sovok/server/trpc'
import { search } from './search'
import { play } from './play'

export const music = router({
  search,
  play,
})
