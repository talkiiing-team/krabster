import { hash } from 'ohash'
import { DownloadKey, DownloadTask } from '@sovok/server/core/domain'
import { DownloadTasksRepository } from '@sovok/server/core/application'

export class DownloadTasksRepositoryImpl implements DownloadTasksRepository {
  private tasks = new Map<string, DownloadTask>()

  async get(key: DownloadKey): Promise<DownloadTask | null> {
    const hashKey = hash(key)
    return this.tasks.get(hashKey) ?? null
  }

  async add(key: DownloadKey, task: DownloadTask): Promise<void> {
    const hashKey = hash(key)
    this.tasks.set(hashKey, task)
  }
}
