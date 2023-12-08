import { DownloadKey, DownloadTask } from '@sovok/server/core/domain'
import { Injection } from '@sovok/shared'

export interface DownloadTasksRepository {
  get(key: DownloadKey): Promise<DownloadTask | null>
  add(key: DownloadKey, task: DownloadTask): Promise<void>
}

export type DownloadTasksRepositoryInjection = Injection<
  'downloadTasksRepository',
  DownloadTasksRepository
>
