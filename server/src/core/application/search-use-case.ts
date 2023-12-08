import { Injection } from '@sovok/shared'
import { Track, SearchQuery } from '@sovok/server/core/domain'
import { ExternalSearchApiInjection } from '@sovok/server/core/application'

export type SearchUseCase = (query: SearchQuery) => Promise<Track[]>
export type SearchUseCaseInjection = Injection<'searchUseCase', SearchUseCase>

export type SearchUseCaseDeps = ExternalSearchApiInjection

export const searchUseCase =
  ({ externalSearchApi }: SearchUseCaseDeps): SearchUseCase =>
  async query => {
    // TODO: extend this to search not only tracks
    // but also albums, artists, etc.
    // and then aggregate the results
    // and sort them by relevance.
    const tracks = await externalSearchApi(query)

    return tracks
  }
