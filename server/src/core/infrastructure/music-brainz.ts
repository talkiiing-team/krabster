import { MusicBrainzApi } from 'musicbrainz-api'
import { Injection } from '@sovok/shared'

export type MusicBrainzApiInjection = Injection<
  'musicBrainzApi',
  MusicBrainzApi
>
