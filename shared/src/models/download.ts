import { z } from 'zod'
import { Track } from './track'

export const MediaSource = z.enum(['YouTube'])
export type MediaSource = z.infer<typeof MediaSource>

export const MediaFormat = z.enum(['MP3', 'MP4', 'WEBM'])
export type MediaFormat = z.infer<typeof MediaFormat>

export const Download = z.object({
  id: z.string(),
  durationMs: z.number(),
  track: Track,
  format: MediaFormat,
  platform: MediaSource,
})

export type Download = z.infer<typeof Download>

export const ServerInfo = z.object({
  endpoint: z.string(),
  folder: z.string(),
})

export type ServerInfo = z.infer<typeof ServerInfo>

export const DownloadInput = z.object({
  trackId: Track.shape.id,
  platform: MediaSource,
})

export type DownloadInput = z.infer<typeof DownloadInput>

export const DownloadError = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('track-not-found'),
  }),
  z.object({
    type: z.literal('track-not-available'),
  }),
])

export type DownloadError = z.infer<typeof DownloadError>

export const DownloadOutput = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('ok'),
    download: Download,
    serverInfo: ServerInfo,
  }),
  z.object({
    type: z.literal('error'),
    error: DownloadError,
  }),
])

export type DownloadOutput = z.infer<typeof DownloadOutput>

export const getDownloadUrl = (serverInfo: ServerInfo, download: Download) =>
  `${serverInfo.endpoint}/${serverInfo.folder}/${download.id}.${download.format}`
