import { nanoid } from 'nanoid'
import { MediaSource } from './download'
import { Track } from '../track'

export type DownloadTask = {
  id: string
  trackId: Track['id']
  platform: MediaSource
}

export const createDownloadTask = (
  trackId: Track['id'],
  platform: MediaSource,
): DownloadTask => ({
  id: nanoid(10),
  trackId,
  platform,
})
