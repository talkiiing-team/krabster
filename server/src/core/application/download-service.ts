import {
  Download,
  WorkerMpiInjection,
  InputMessageKind,
  DownloadTask,
  createDownloadTask,
  OutputMessageKind,
  OutputMessage,
  WorkerMpi,
  DownloadKey,
  DownloadTaskError,
  DownloadTaskErrorKind,
} from '@sovok/server/core/domain'
import {
  DownloadTasksRepository,
  DownloadTasksRepositoryInjection,
} from './download-tasks-repository'
import {
  GetDownload,
  GetDownloadInjection,
  InsertDownload,
  InsertDownloadInjection,
} from './downloads-repository'
import { DownloadOutput, Injection } from '@sovok/shared'

type DownloadServiceDeps = WorkerMpiInjection &
  DownloadTasksRepositoryInjection &
  GetDownloadInjection &
  InsertDownloadInjection

export type DownloadServiceInjection = Injection<
  'downloadService',
  DownloadService
>

const filterByTaskId =
  (taskId: DownloadTask['id']) => (message: OutputMessage) =>
    message.payload.taskId === taskId

export class DownloadService {
  private readonly workerMpi: WorkerMpi
  private readonly downloadTasksRepository: DownloadTasksRepository
  private readonly getDownload: GetDownload
  private readonly insertDownload: InsertDownload

  constructor(deps: DownloadServiceDeps) {
    this.workerMpi = deps.workerMpi
    this.downloadTasksRepository = deps.downloadTasksRepository
    this.getDownload = deps.getDownload
    this.insertDownload = deps.insertDownload
  }

  // TODO: this might be a good candidate for a generator function
  // that yields the download progress as it comes in.
  async download(key: DownloadKey): Promise<Download> {
    console.log('Getting download')
    const existingDownload = await this.getDownload(key)

    if (existingDownload) {
      return existingDownload
    }

    const download = await this.handleWorkerDownload(key)

    await this.insertDownload(download)

    return download
  }

  private async handleWorkerDownload(key: DownloadKey): Promise<Download> {
    let task = await this.downloadTasksRepository.get(key)

    if (!task) {
      task = createDownloadTask(key.trackId, key.platform)

      await this.downloadTasksRepository.add(key, task)

      this.workerMpi.send({
        type: InputMessageKind.DownloadTask,
        payload: task,
      })
    }

    const filter = filterByTaskId(task.id)
    const timeoutMs = 1000 * 60 * 5

    const waitOptions = { filter, timeoutMs }

    const successPromise = this.workerMpi.wait(
      OutputMessageKind.DownloadTaskSuccess,
      waitOptions,
    )

    const errorPromise = this.workerMpi.wait(
      OutputMessageKind.DownloadTaskError,
      waitOptions,
    )

    const result = await Promise.race([successPromise, errorPromise])

    if (result.type === OutputMessageKind.DownloadTaskSuccess) {
      return result.payload.download
    }

    throw result.payload.error
  }
}
