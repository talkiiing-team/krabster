import { publicProcedure } from '@sovok/server/trpc'
import { SearchInput, SearchOutput } from '@sovok/shared'

export const search = publicProcedure
  .input(SearchInput)
  .output(SearchOutput)
  .query(({ ctx: { container }, input }) =>
    container.searchUseCase(input.query),
  )
