import { Injection } from '@sovok/shared'
import {
  ExternalGetTrackApiInjection,
  ExternalGetTrackApiResultKind,
} from '@sovok/server/core/application'
import {
  Download,
  DownloadTask,
  DownloadTaskError,
  DownloadTaskErrorKind,
  createDownload,
} from '@sovok/server/core/domain'
import {
  PlatformUploadApiInjection,
  YouTubePlatformDownloadApiInjection,
} from './platform-api'

export type DownloadPipelineUseCase = (input: DownloadTask) => Promise<Download>

export type DownloadPipelineUseCaseInjection = Injection<
  'downloadPipeline',
  DownloadPipelineUseCase
>

export type SearchUseCaseDeps = ExternalGetTrackApiInjection &
  YouTubePlatformDownloadApiInjection &
  PlatformUploadApiInjection

export const downloadPipelineUseCase =
  ({
    externalGetTrackApi,
    youtubePlatformDownloadApi,
    platformUploadApi,
  }: SearchUseCaseDeps): DownloadPipelineUseCase =>
  async ({ trackId, platform }) => {
    const trackResult = await externalGetTrackApi(trackId)

    if (trackResult.type === ExternalGetTrackApiResultKind.NotFound)
      throw new DownloadTaskError(DownloadTaskErrorKind.NotFoundTrack)

    const { track } = trackResult

    const credentials = await youtubePlatformDownloadApi(track)

    if (credentials === null)
      throw new DownloadTaskError(DownloadTaskErrorKind.NotFoundDownload)

    const { stream, durationMs, format } = credentials

    const download = createDownload(track, format, platform, durationMs)

    await platformUploadApi(stream, download.id, format)

    return download
  }
