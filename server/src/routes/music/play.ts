import { publicProcedure } from '@sovok/server/trpc'
import { DownloadInput, DownloadOutput, ServerInfo } from '@sovok/shared'

export const play = publicProcedure
  .input(DownloadInput)
  .output(DownloadOutput)
  .mutation(async ({ ctx: { container }, input }) => {
    try {
      const download = await container.downloadService.download(input)
      const serverInfo: ServerInfo = {
        endpoint: container.env.SOVOK_SERVER_S3_ENDPOINT,
        folder: container.env.SOVOK_SERVER_S3_FOLDER,
      }

      return {
        type: 'ok',
        serverInfo,
        download,
      }
    } catch {
      return {
        type: 'error',
        error: {
          type: 'track-not-available',
        },
      }
    }
  })
