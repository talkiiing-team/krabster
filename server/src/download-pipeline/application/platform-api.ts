import { MediaFormat, Track, Download } from '@sovok/server/core/domain'
import { Injection } from '@sovok/shared'

export type PlatformDownloadApiResult = {
  stream: NodeJS.ReadableStream
  format: MediaFormat
  durationMs: number
}

export type PlatformDownloadApi = (
  track: Track,
) => Promise<PlatformDownloadApiResult | null>

export type YouTubePlatformDownloadApiInjection = Injection<
  'youtubePlatformDownloadApi',
  PlatformDownloadApi
>

export type PlatformUploadApi = (
  stream: NodeJS.ReadableStream,
  uploadId: Download['id'],
  format: MediaFormat,
) => Promise<void>

export type PlatformUploadApiInjection = Injection<
  'platformUploadApi',
  PlatformUploadApi
>
