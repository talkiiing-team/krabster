import { z } from 'zod'
import { Track } from './track'

export const SearchQuery = z.string().min(3).max(100)

export type SearchQuery = z.infer<typeof SearchQuery>

export const SearchInput = z.object({
  query: SearchQuery,
})

export type SearchInput = z.infer<typeof SearchInput>

export const SearchOutput = z.array(Track)

export type SearchOutput = z.infer<typeof SearchOutput>
