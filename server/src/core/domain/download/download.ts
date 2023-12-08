import * as Shared from '@sovok/shared/models'
import { nanoid } from 'nanoid'

import { Track } from '../track'

export type Download = Shared.Download

export const MediaFormat = Shared.MediaFormat.Enum
export type MediaFormat = Shared.MediaFormat

export const MediaSource = Shared.MediaSource.Enum
export type MediaSource = Shared.MediaSource

export const createDownload = (
  track: Track,
  format: MediaFormat,
  platform: MediaSource,
  durationMs: Download['durationMs'],
): Download => ({
  id: nanoid(50),
  track,
  format,
  platform,
  durationMs,
})

export type DownloadKey = {
  trackId: Track['id']
  platform: MediaSource
}
