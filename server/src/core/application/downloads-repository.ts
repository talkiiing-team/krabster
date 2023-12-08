import { Download, DownloadKey } from '@sovok/server/core/domain'
import { Injection } from '@sovok/shared'

export type GetDownload = (key: DownloadKey) => Promise<Download | null>
export type GetDownloadInjection = Injection<'getDownload', GetDownload>

export type InsertDownload = (download: Download) => Promise<void>
export type InsertDownloadInjection = Injection<
  'insertDownload',
  InsertDownload
>
