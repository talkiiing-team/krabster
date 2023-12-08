import { Injection } from '@sovok/shared/di'
import { Track } from '@sovok/server/core/domain'

export type ExternalSearchApi = (query: string) => Promise<Track[]>
export type ExternalSearchApiInjection = Injection<
  'externalSearchApi',
  ExternalSearchApi
>

export enum ExternalGetTrackApiResultKind {
  NotFound = 'NotFound',
  Ok = 'Ok',
}

export type ExternalGetTrackApiResult =
  | { type: ExternalGetTrackApiResultKind.NotFound }
  | { type: ExternalGetTrackApiResultKind.Ok; track: Track }

export type ExternalGetTrackApi = (
  trackId: string,
) => Promise<ExternalGetTrackApiResult>

export type ExternalGetTrackApiInjection = Injection<
  'externalGetTrackApi',
  ExternalGetTrackApi
>
