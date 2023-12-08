import { IRecording, ISearchResult } from 'musicbrainz-api'
import {
  ExternalSearchApi,
  ExternalGetTrackApi,
  ExternalGetTrackApiResultKind,
} from '@sovok/server/core/application'
import { CacheInjection } from '@sovok/server/shared/cache'
import { MusicBrainzApiInjection } from '@sovok/server/core/infrastructure'
import { recordingToDomain } from './external-api-mappers'

const DAILY_TTL = 24 * 60 * 60 * 1000

type RecordingsQueryResult = ISearchResult & { recordings: IRecording[] }

export type ExternalSearchApiDeps = CacheInjection & MusicBrainzApiInjection

export const externalSearchApi = ({
  cache,
  musicBrainzApi,
}: ExternalSearchApiDeps): ExternalSearchApi =>
  cache.memoized(
    'externalSearchApi',
    async query => {
      const result = await musicBrainzApi.search<RecordingsQueryResult>(
        'recording',
        {
          query: `${query}~0.9 AND ${query}~7`,
        },
      )

      return result.recordings.map(recordingToDomain)
    },
    {
      ttl: DAILY_TTL,
      transformKey: query => query.toLocaleLowerCase(),
    },
  )

export type ExternalGetTrackApiDeps = CacheInjection & MusicBrainzApiInjection

export const externalGetTrackApi = ({
  cache,
  musicBrainzApi,
}: ExternalGetTrackApiDeps): ExternalGetTrackApi =>
  cache.memoized(
    'externalGetTrackApi',
    async trackId => {
      const result = await musicBrainzApi.lookupRecording(trackId, [
        'artist-credits',
        'artists',
        'releases',
        'aliases',
      ])

      console.log(result)

      return {
        type: ExternalGetTrackApiResultKind.Ok,
        track: recordingToDomain(result),
      }
    },
    {
      ttl: DAILY_TTL,
    },
  )
